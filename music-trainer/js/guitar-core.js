/* =====================================================================
   GUITARE — données et fonctions pures (aucun accès au DOM)
   Cordes numérotées de 0 (6ᵉ corde, Mi grave) à 5 (1ʳᵉ corde, Mi aigu).
   Une « position » est une paire [corde, case] ; case 0 = corde à vide.
   Dépend de game.js (R_MAJ, R_MIN, cfr, csy) et exercises.js (FR, LET) au moment de l'appel.
   ===================================================================== */
const GS = [40,45,50,55,59,64];                               // Mi2 La2 Ré3 Sol3 Si3 Mi4 (numéros MIDI)
const GSN = ['Mi grave','La','Ré','Sol','Si','Mi aigu'], GSO = ['6ᵉ','5ᵉ','4ᵉ','3ᵉ','2ᵉ','1ʳᵉ'];
const GLET = ['C','C♯/D♭','D','D♯/E♭','E','F','F♯/G♭','G','G♯/A♭','A','A♯/B♭','B'];
const GFR = ['Do','Do♯/Ré♭','Ré','Ré♯/Mi♭','Mi','Fa','Fa♯/Sol♭','Sol','Sol♯/La♭','La','La♯/Si♭','Si'];
const FRS = ['Do','Do♯','Ré','Ré♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];
const gn = pc => (S.solfege ? GFR : GLET)[((pc%12)+12)%12];     // « C♯/D♭ » ou « Do♯/Ré♭ » selon le réglage
const gs = pc => gn(pc).split('/')[0];                         // nom court : « C♯ »
const BLK = new Set([1,3,6,8,10]);

/* ---------- accords : [symbole, nom, forme 6ᵉ→1ʳᵉ (-1 = corde muette), type] — o ouvert · 7 septième · b barré · p power chord */
/* 5ᵉ élément facultatif : notes tolérées en plus de la forme (le Do7 ouvert n'a pas de quinte, on accepte Sol si on l'ajoute) */
const GLIB = [
  ['C','Do majeur',[-1,3,2,0,1,0],'o'], ['A','La majeur',[-1,0,2,2,2,0],'o'], ['G','Sol majeur',[3,2,0,0,0,3],'o'],
  ['E','Mi majeur',[0,2,2,1,0,0],'o'], ['D','Ré majeur',[-1,-1,0,2,3,2],'o'],
  ['Am','La mineur',[-1,0,2,2,1,0],'o'], ['Em','Mi mineur',[0,2,2,0,0,0],'o'], ['Dm','Ré mineur',[-1,-1,0,2,3,1],'o'],
  ['A7','La septième',[-1,0,2,0,2,0],'7'], ['B7','Si septième',[-1,2,1,2,0,2],'7'], ['C7','Do septième',[-1,3,2,3,1,0],'7',[7]],
  ['D7','Ré septième',[-1,-1,0,2,1,2],'7'], ['E7','Mi septième',[0,2,0,1,0,0],'7'], ['G7','Sol septième',[3,2,0,0,0,1],'7'],
  ['Cmaj7','Do majeur 7',[-1,3,2,0,0,0],'7'], ['Fmaj7','Fa majeur 7',[-1,-1,3,2,1,0],'7'],
  ['Amaj7','La majeur 7',[-1,0,2,1,2,0],'7'], ['Dmaj7','Ré majeur 7',[-1,-1,0,2,2,2],'7'],
  ['F','Fa majeur',[1,3,3,2,1,1],'b'], ['Bm','Si mineur',[-1,2,4,4,3,2],'b'], ['F♯m','Fa♯ mineur',[2,4,4,2,2,2],'b'],
  ['B','Si majeur',[-1,2,4,4,4,2],'b'], ['C♯m','Do♯ mineur',[-1,4,6,6,5,4],'b'],
  ['G5','Sol 5 (power chord)',[3,5,5,-1,-1,-1],'p']
];
const GLIBM = Object.fromEntries(GLIB.map(c=>[c[0],c]));
const gShapePos = sh => sh.map((f,s)=>f<0 ? null : [s,f]).filter(Boolean);
const gShapePcs = sh => [...new Set(gShapePos(sh).map(([s,f])=>(GS[s]+f)%12))];
const gShapeStr = sh => sh.map(f=>f<0 ? 'x' : f).join('-');
const gChordObj = (sym, label, shape, kind, extra=[]) => ({sym, label, shape, kind, pcs:gShapePcs(shape), extra});

function gBarre(pc, minor){                                    // forme de Mi (racine corde 6) ou de La (racine corde 5), la plus basse
  const fe = ((pc-4)%12+12)%12 || 12, fa = ((pc-9)%12+12)%12 || 12;
  if(fe<=fa) return minor ? [fe,fe+2,fe+2,fe,fe,fe] : [fe,fe+2,fe+2,fe+1,fe,fe];
  return minor ? [-1,fa,fa+2,fa+2,fa+1,fa] : [-1,fa,fa+2,fa+2,fa+2,fa];
}
function gBarreChord(pc, minor){                               // accord barré sur n'importe quelle fondamentale (noms usuels)
  const [l,a] = (minor ? R_MIN : R_MAJ)[pc], n = {step:l, alter:a};
  return gChordObj(csy(n)+(minor?'m':''), cfr(n)+(minor?' mineur':' majeur'), gBarre(pc,minor), 'b');
}

/* ---------- gammes et exercices : {title, steps:[{pos:[[corde,case],…], label}], nf} ---------- */
const SCALES_G = {maj:[0,2,4,5,7,9,11], min:[0,2,3,5,7,8,10], pmin:[0,3,5,7,10], pmaj:[0,2,4,7,9], blues:[0,3,5,6,7,10]};
const GXN = {maj:'majeure', min:'mineure naturelle', pmin:'pentatonique mineure', pmaj:'pentatonique majeure', blues:'blues'};
const upDown = up => up.concat(up.slice(0,-1).reverse());
const gxSteps = (seq) => seq.map(([s,f])=>({pos:[[s,f]], label:gs(GS[s]+f)}));
function gxScale(tonic, v, baseStr){                           // « boîte » de 4-5 cases, racine sur la corde 6 (baseStr 0) ou la corde 5 (1)
  const iv = SCALES_G[v], pcs = new Set(iv.map(i=>(tonic+i)%12)), full = iv.length>=7;
  const f0 = ((tonic-GS[baseStr])%12+12)%12, lo = full ? (f0>=1 ? f0-1 : 0) : f0, hi = full ? lo+4 : lo+3, up = [];
  for(let s=0;s<6;s++) for(let f=lo;f<=hi;f++) if(pcs.has((GS[s]+f)%12)) up.push([s,f]);
  return {title:`Gamme ${GXN[v]} de ${gs(tonic)}, racine sur la corde de ${baseStr?'La':'Mi grave'} (cases ${lo}–${hi})`,
    steps:gxSteps(upDown(up)), nf:Math.min(15, Math.max(7, hi+2)), tonic};
}
function gxChromo(s){
  const up = [...Array(13)].map((_,f)=>[s,f]);
  return {title:`Chromatique sur la ${GSO[s]} corde (${GSN[s]}), cases 0 à 12`, steps:gxSteps(upDown(up)), nf:12};
}
function gxArp(sym){
  const c = GLIBM[sym], up = gShapePos(c[2]);
  return {title:`Arpège de ${c[1]} (${sym}), corde par corde`, steps:gxSteps(upDown(up)), nf:Math.max(5, Math.max(...c[2])+2)};
}
const GPROG = {G:['G','C','D','Em'], C:['C','F','G','Am'], D:['D','G','A','Bm'], A:['A','D','E','F♯m'], E:['E','A','B','C♯m']};   // I · IV · V · vi
const GPV = {IVV:['I – IV – V – I',[0,1,2,0]], pop:['I – V – vi – IV',[0,2,3,1]], fif:['I – vi – IV – V',[0,3,1,2]]};
function gxProg(key, v){
  const ch = GPROG[key], [name, order] = GPV[v], cs = order.map(i=>GLIBM[ch[i]]);
  return {title:`Enchaînement ${name} en ${GLIBM[key][1]}`, steps:cs.map(c=>({pos:gShapePos(c[2]), label:`${c[0]} (${c[1]})`})),
    nf:Math.max(5, Math.max(...cs.flatMap(c=>c[2]))+2)};
}

/* ---------- dessins SVG (chaînes de caractères) ---------- */
function gBoardSVG(nf, marks, hit=true){                       // manche horizontal ; marks : Map « corde:case » -> {c: classe, t: texte}
  const SP=56, X0=58, Y0=30, DY=34, W=X0+nf*SP+16, H=Y0+5*DY+36, cy = s => Y0+(5-s)*DY, cx = f => f===0 ? X0-24 : X0+(f-.5)*SP;
  let h = `<svg class="gb" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Manche de guitare">`;
  h += `<rect class="gb-bg" x="${X0}" y="${Y0-12}" width="${nf*SP}" height="${5*DY+24}" rx="3"/>`;
  for(let f=0;f<=nf;f++) h += `<line class="${f?'gb-fret':'gb-nut'}" x1="${X0+f*SP}" y1="${Y0-12}" x2="${X0+f*SP}" y2="${Y0+5*DY+12}"/>`;
  for(let f=1;f<=nf;f++){ const x = X0+(f-.5)*SP;
    if([3,5,7,9,15].includes(f)) h += `<circle class="gb-dot" cx="${x}" cy="${Y0+2.5*DY}" r="5"/>`;
    if(f===12) h += `<circle class="gb-dot" cx="${x}" cy="${Y0+1.5*DY}" r="5"/><circle class="gb-dot" cx="${x}" cy="${Y0+3.5*DY}" r="5"/>`;
    if([3,5,7,9,12,15].includes(f)) h += `<text class="gb-num" x="${x}" y="${H-8}" text-anchor="middle">${f}</text>`; }
  for(let s=0;s<6;s++){ const y = cy(s);
    h += `<line class="gb-str" style="stroke-width:${(3-s*.45).toFixed(2)}px" x1="${X0}" y1="${y}" x2="${X0+nf*SP}" y2="${y}"/>`;
    h += `<text class="gb-sl" x="14" y="${y+4}" text-anchor="middle">${['E','A','D','G','B','e'][s]}</text>`; }
  for(const [k,m] of marks){ const [s,f] = k.split(':').map(Number), x = cx(f), y = cy(s);
    h += `<circle class="gb-mk ${m.c}" cx="${x}" cy="${y}" r="13"/>` + (m.t ? `<text class="gb-mt" x="${x}" y="${y+4}" text-anchor="middle">${m.t}</text>` : ''); }
  if(hit) for(let s=0;s<6;s++) for(let f=0;f<=nf;f++)
    h += `<rect class="gb-hit" data-s="${s}" data-f="${f}" x="${f===0 ? X0-44 : X0+(f-1)*SP}" y="${cy(s)-DY/2}" width="${f===0 ? 44 : SP}" height="${DY}"/>`;
  return h + '</svg>';
}
function chordDiagram(sh, o={}){                               // diagramme vertical : cordes graves à gauche
  const fr = sh.filter(f=>f>0), minF = fr.length ? Math.min(...fr) : 1, maxF = Math.max(0,...sh), base = maxF<=5 ? 1 : minF;
  const sx=22, sy=26, x0=30, y0=34, NF=5, W=x0+5*sx+34, H=y0+NF*sy+16, T = 'fill="currentColor" stroke="none"';
  let s = `<svg class="cd" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${o.label||'Diagramme d’accord'}" fill="none" stroke="currentColor" stroke-width="1.5">`;
  for(let i=0;i<6;i++) s += `<line x1="${x0+i*sx}" y1="${y0}" x2="${x0+i*sx}" y2="${y0+NF*sy}"/>`;
  for(let j=0;j<=NF;j++) s += `<line x1="${x0}" y1="${y0+j*sy}" x2="${x0+5*sx}" y2="${y0+j*sy}"${j===0&&base===1 ? ' stroke-width="5"' : ''}/>`;
  if(base>1) s += `<text x="${x0+5*sx+8}" y="${y0+sy*.65}" ${T} font-size="12">${base}fr</text>`;
  sh.forEach((f,i)=>{ const x = x0+i*sx;
    if(f<0) s += `<text x="${x}" y="${y0-10}" text-anchor="middle" ${T} font-size="14">×</text>`;
    else if(f===0) s += `<circle cx="${x}" cy="${y0-14}" r="4.5"/>`;
    else s += `<circle cx="${x}" cy="${y0+(f-base+.5)*sy}" r="8" ${T}/>`; });
  return s + '</svg>';
}
