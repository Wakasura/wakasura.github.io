/* =====================================================================
   GUITARE — morceaux : collection de base, lecteurs de tablatures (fonctions pures sauf les deux lecteurs de fichiers)
   Modèle commun : piste = {name, tuning:[6 hauteurs MIDI, grave→aigu], ts:[n,d], bars:[{len, ts, beats:[{off, dur, pos:[[corde,case],…], label?}]}]}
   (off et dur en doubles-croches ; corde 0 = 6ᵉ corde, la plus grave)
   Dépend de guitar-core.js (GS, GLIBM, gShapePos, gs) et de core.js (STEP, r3, toPartwise, bufToXml).
   ===================================================================== */
const gEsc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]));

/* ---------- placement d'une hauteur sur le manche (positions basses, mouvement minimal) ---------- */
function gTabify(midi, prev, used=[]){
  let best = null, bc = 1e9;
  for(let s=0;s<6;s++){ const f = midi-GS[s]; if(f<0 || f>12 || used.includes(s)) continue;
    const c = f*.9 + (prev ? Math.abs(f-prev[1])*.6 + Math.abs(s-prev[0])*.5 : s*.3);
    if(c<bc){ bc = c; best = [s,f]; } }
  if(!best) throw new Error(`note hors de portée de la guitare (MIDI ${midi})`);
  return best;
}
const gNoteMidi = n => { const m = n.match(/^([A-G])([#b]?)(-?\d)$/); return m ? (+m[3]+1)*12 + STEP[m[1]] + (m[2]==='#' ? 1 : m[2]==='b' ? -1 : 0) : null; };

/* ---------- notation compacte des morceaux ----------
   mesures séparées par « | », jetons séparés par des espaces, chaque jeton = contenu/durée (1 ronde, 2 blanche, 4 noire, 8 croche, 16 double ; « . » = pointée)
     E4/4        note, placée automatiquement (Mi4 = Mi aigu à vide)      R/4         silence
     6:3/8       corde 6 (grave) case 3                                       @Am/1       accord plaqué (formes de GLIB)
     @Am[5 3 2 1 2 3]/8   arpège : numéros de cordes (6 = grave), une note par durée */
function gParseDSL(src, ts){
  const len = ts[0]*16/ts[1]; let prev = null;
  return src.split('|').map(x=>x.trim()).filter(Boolean).map((bs,bi)=>{
    const beats = []; let off = 0;
    for(const tok of bs.match(/@[^\s\[]+\[[^\]]*\]\/\d+\.?|\S+/g) || []){
      const m = tok.match(/^(.+)\/(\d+)(\.?)$/); if(!m) throw new Error(`mesure ${bi+1} : jeton « ${tok} » invalide`);
      const dur = 16/+m[2]*(m[3] ? 1.5 : 1), body = m[1];
      if(body==='R'){ beats.push({off, dur, pos:[]}); off += dur; }
      else if(body[0]==='@'){
        const mm = body.match(/^@([^\[]+)(?:\[([\d ]+)\])?$/), c = mm && GLIBM[mm[1]]; if(!c) throw new Error(`mesure ${bi+1} : accord « ${body} » inconnu`);
        if(mm[2]) mm[2].trim().split(/\s+/).forEach((n,j)=>{ const s = 6-+n, f = c[2][s];
          if(f==null || f<0) throw new Error(`mesure ${bi+1} : corde ${n} muette dans ${mm[1]}`);
          beats.push({off, dur, pos:[[s,f]], label:j===0 ? mm[1] : ''}); off += dur; });
        else{ beats.push({off, dur, pos:gShapePos(c[2]), label:mm[1]}); off += dur; }
      }
      else if(/^\d:\d+$/.test(body)){ const [n,f] = body.split(':').map(Number); prev = [6-n,f]; beats.push({off, dur, pos:[prev]}); off += dur; }
      else{ const midi = gNoteMidi(body); if(midi==null) throw new Error(`mesure ${bi+1} : note « ${body} » inconnue`);
        prev = gTabify(midi, prev); beats.push({off, dur, pos:[prev]}); off += dur; }
    }
    if(Math.abs(off-len)>.01) throw new Error(`mesure ${bi+1} : durée ${off} au lieu de ${len}`);
    return {len, ts, beats};
  });
}

/* ---------- du modèle de piste à un morceau jouable (étapes = groupes de notes à cliquer) ---------- */
function gMakeSong(tr, meta){
  const steps = [], starts = []; let base = 0, mf = 0;
  tr.bars.forEach((b,bi)=>{ starts.push(base);
    b.beats.forEach(be=>{ if(!be.pos.length) return; be.pos.forEach(p=>{ mf = Math.max(mf, p[1]); });
      steps.push({bar:bi, off:be.off, t:base+be.off, dur:be.dur, pos:be.pos, label:be.label || be.pos.map(([s,f])=>gs(tr.tuning[s]+f)).join(' ')}); });
    base += b.len; });
  return {...meta, name:tr.name, ts:tr.ts, tuning:tr.tuning, bars:tr.bars, steps, starts, total:base, nf:Math.min(24, Math.max(7, mf+2))};
}
const gParsedFromDef = d => ({title:d.title, tempo:d.tempo, tracks:[{name:'Mélodie', tuning:GS.slice(), ts:d.ts, bars:gParseDSL(d.dsl, d.ts)}]});

/* ---------- lecteur MusicXML (tablature : <string> et <fret> ; sinon placement automatique) ---------- */
function gParseXMLTab(xml, fb){
  let doc = new DOMParser().parseFromString(xml, 'text/xml'); if(doc.querySelector('parsererror')) throw new Error('XML invalide');
  doc = toPartwise(doc); const parts = [...doc.querySelectorAll('score-partwise > part')]; if(!parts.length) throw new Error('format non supporté (score-partwise attendu)');
  const names = [...doc.querySelectorAll('part-list > score-part')].map((p,i)=>p.querySelector('part-name')?.textContent || 'Partie '+(i+1));
  const txt = (el,q) => el.querySelector(q)?.textContent; let tempo = 0; const tracks = [];
  parts.forEach((part,pi)=>{
    let div = 1, ts = [4,4], oc = 0, pos = 0, last = 0, hasTab = false; const raw = [];
    [...part.children].filter(e=>e.tagName==='measure').forEach(me=>{
      pos = last = 0; const evs = [];
      for(const el of me.children){ const tg = el.tagName;
        if(tg==='attributes'){ if(txt(el,'divisions')) div = +txt(el,'divisions'); if(txt(el,'time beats')) ts = [+txt(el,'time beats'), +txt(el,'time beat-type')];
          if(txt(el,'transpose octave-change')) oc = +txt(el,'transpose octave-change'); }
        else if(tg==='direction' || tg==='sound'){ const t = tg==='sound' ? el : el.querySelector('sound[tempo]'); if(t?.getAttribute('tempo') && !tempo) tempo = Math.round(+t.getAttribute('tempo')); }
        else if(tg==='backup') pos -= +txt(el,'duration'); else if(tg==='forward') pos += +txt(el,'duration');
        else if(tg==='note'){
          if(el.querySelector('grace')) continue;
          const d = +txt(el,'duration')||0, chord = !!el.querySelector('chord'), start = chord ? last : pos; if(!chord){ last = pos; pos += d; }
          if(el.querySelector('rest') || el.querySelector('tie[type="stop"]')) continue;
          const n = {off:r3(start*4/div), dur:r3(d*4/div)}, st = txt(el,'technical string'), fr = txt(el,'technical fret');
          if(st!=null && fr!=null){ n.s = 6-(+st); n.f = +fr; hasTab = true; }                      // MusicXML : corde 1 = la plus aiguë
          else if(el.querySelector('pitch')) n.midi = (+txt(el,'pitch octave')+1)*12 + STEP[txt(el,'pitch step')] + Math.round(+txt(el,'pitch alter')||0) + 12*oc;
          else continue;
          evs.push(n);
        } }
      raw.push({len:ts[0]*16/ts[1], ts:ts.slice(), evs});
    });
    let prev = null;
    const bars = raw.map(r=>{
      const seen = new Set(), groups = new Map();
      r.evs.filter(n=>!hasTab || n.s!=null).forEach(n=>{ const key = `${n.off}|${n.s!=null ? n.s+':'+n.f : n.midi}`; if(seen.has(key)) return; seen.add(key);
        if(!groups.has(n.off)) groups.set(n.off, {off:n.off, dur:n.dur, notes:[]}); const g = groups.get(n.off); g.dur = Math.min(g.dur, n.dur); g.notes.push(n); });
      const beats = [...groups.values()].sort((a,b)=>a.off-b.off).map(g=>{ const ps = [], used = [];
        g.notes.filter(n=>n.s!=null).forEach(n=>{ ps.push([n.s,n.f]); used.push(n.s); });
        g.notes.filter(n=>n.s==null).sort((a,b)=>b.midi-a.midi).forEach(n=>{ const p = gTabify(n.midi, prev, used); used.push(p[0]); ps.push(p); prev = p; });
        return {off:g.off, dur:g.dur, pos:ps.sort((a,b)=>a[0]-b[0])}; });
      return {len:r.len, ts:r.ts, beats};
    });
    if(bars.some(b=>b.beats.length)) tracks.push({name:names[pi], tuning:GS.slice(), ts:bars[0]?.ts || [4,4], bars});
  });
  if(!tracks.length) throw new Error('aucune note trouvée');
  return {title:txt(doc,'work-title') || txt(doc,'movement-title') || fb, tempo, tracks};
}

/* ---------- Guitar Pro (3 à 8) : lu par alphaTab, chargé à la demande (voir guitar-songs-ui.js) ---------- */
function gFromAlphaTab(score){
  const tracks = [];
  (score.tracks||[]).forEach(tr=>{
    const st = tr.staves && tr.staves[0]; if(!st || tr.isPercussion || st.isPercussion) return;
    const tun = (st.tuning && st.tuning.length ? st.tuning : st.stringTuning && st.stringTuning.tunings) || [];
    if(!tun.length || tun.length>6) return;                       // guitares à 6 cordes (ou moins : basses) seulement
    const asc = tun.slice().sort((a,b)=>a-b), n = asc.length, tuning = GS.slice();
    asc.forEach((p,i)=>{ tuning[i] = p; });
    const bars = st.bars.map(bar=>{
      const mb = bar.masterBar, tsn = mb.timeSignatureNumerator, tsd = mb.timeSignatureDenominator, len = tsn*16/tsd, groups = new Map();
      bar.voices.forEach(v=>v.beats.forEach(b=>{
        if(b.isEmpty || b.isRest || (b.graceType && b.graceType!==0)) return;
        const ps = []; b.notes.forEach(nt=>{ if(nt.isTieDestination || nt.isDead) return;
          let s = nt.string-1;                                   // alphaTab : corde 1 = la plus grave ; on vérifie avec la hauteur réelle si elle est connue
          if(typeof nt.realValue==='number'){ const sB = n-nt.string; if(sB>=0 && sB<n && Math.abs(asc[sB]+nt.fret-nt.realValue) < Math.abs(asc[Math.max(0,Math.min(n-1,s))]+nt.fret-nt.realValue)) s = sB; }
          if(s>=0 && s<n) ps.push([s, nt.fret]); });
        if(!ps.length) return;
        let rel = b.playbackStart; const barTicks = tsn*3840/tsd;               // alphaTab : 960 ticks par noire ; le début du temps est relatif à la mesure (ou absolu selon la version)
        if(mb.start>0 && rel>=barTicks-1) rel -= mb.start;
        const off = Math.max(0, Math.min(len-.5, r3(rel/240))), dur = Math.max(.5, r3(b.playbackDuration/240));
        const g = groups.get(off) || groups.set(off, {off, dur, pos:[]}).get(off); g.dur = Math.min(g.dur, dur); ps.forEach(p=>{ if(!g.pos.some(q=>q[0]===p[0])) g.pos.push(p); });
      }));
      return {len, ts:[tsn,tsd], beats:[...groups.values()].sort((a,b)=>a.off-b.off).map(g=>({...g, pos:g.pos.sort((a,b)=>a[0]-b[0])}))};
    });
    if(bars.some(b=>b.beats.length)) tracks.push({name:tr.name || 'Piste '+(tracks.length+1), tuning, ts:bars[0]?.ts || [4,4], bars});
  });
  if(!tracks.length) throw new Error('aucune piste de guitare trouvée');
  return {title:score.title || '', tempo:Math.round(score.tempo||0), tracks};
}

/* ---------- collection de base : mélodies du domaine public, accompagnements traditionnels, études originales ---------- */
const gChunk8 = tk => [0,8,16].map(i=>tk.slice(i,i+8).join(' ')).join(' | ');                       // 24 notes -> 3 mesures de 8 croches
const gSpider = () => gChunk8([6,5,4,3,2,1].flatMap(s=>[1,2,3,4].map(f=>`${s}:${f}/8`)));
const gPentaBox = () => { const up = [[6,5],[6,8],[5,5],[5,7],[4,5],[4,7],[3,5],[3,7],[2,5],[2,8],[1,5],[1,8]];
  return gChunk8(up.concat(up.slice().reverse()).map(([s,f])=>`${s}:${f}/8`)); };
const gShuffle = () => { const bar = (r,a,b) => [r,a,r,b,r,a,r,b].map(x=>x+'/8').join(' '), A = bar('5:0','4:2','4:4'), D = bar('4:0','3:2','3:4'), E = bar('6:0','5:2','5:4');
  return [A,A,A,A,D,D,A,A,E,D,A,A].join(' | '); };
const gTwice = x => x+' | '+x;
const GSONGS = [
 {id:'cordes', title:'Cordes à vide', level:'débutant', tempo:60, ts:[4,4], info:'Les six cordes à vide, de la grave à l’aiguë et retour. Étude originale.',
  dsl:'6:0/4 5:0/4 4:0/4 3:0/4 | 2:0/4 1:0/4 2:0/4 3:0/4 | 4:0/4 5:0/4 6:0/2'},
 {id:'araignee', title:'Exercice « araignée » 1-2-3-4', level:'débutant', tempo:70, ts:[4,4], info:'Un doigt par case (1-2-3-4) sur chaque corde : dextérité de la main gauche. Étude originale.', dsl:gSpider()},
 {id:'ode', title:'Ode à la joie (Beethoven)', level:'débutant', tempo:90, ts:[4,4], info:'Thème de la 9ᵉ symphonie (1824), domaine public. Mélodie en Do, cases basses.',
  dsl:'E4/4 E4/4 F4/4 G4/4 | G4/4 F4/4 E4/4 D4/4 | C4/4 C4/4 D4/4 E4/4 | E4/4. D4/8 D4/2 | E4/4 E4/4 F4/4 G4/4 | G4/4 F4/4 E4/4 D4/4 | C4/4 C4/4 D4/4 E4/4 | D4/4. C4/8 C4/2'},
 {id:'jacques', title:'Frère Jacques', level:'débutant', tempo:100, ts:[4,4], info:'Chanson traditionnelle, domaine public. Mélodie en Do.',
  dsl:'C4/4 D4/4 E4/4 C4/4 | C4/4 D4/4 E4/4 C4/4 | E4/4 F4/4 G4/2 | E4/4 F4/4 G4/2 | G4/8 A4/8 G4/8 F4/8 E4/4 C4/4 | G4/8 A4/8 G4/8 F4/8 E4/4 C4/4 | C4/4 G3/4 C4/2 | C4/4 G3/4 C4/2'},
 {id:'lune', title:'Au clair de la lune', level:'débutant', tempo:90, ts:[4,4], info:'Chanson traditionnelle, domaine public. Deux fois la première phrase.',
  dsl:gTwice('C4/4 C4/4 C4/4 D4/4 | E4/2 D4/2 | C4/4 E4/4 D4/4 D4/4 | C4/1')},
 {id:'twinkle', title:'Ah ! vous dirai-je, maman', level:'débutant', tempo:100, ts:[4,4], info:'Mélodie traditionnelle (« Twinkle, twinkle, little star »), domaine public.',
  dsl:'C4/4 C4/4 G4/4 G4/4 | A4/4 A4/4 G4/2 | F4/4 F4/4 E4/4 E4/4 | D4/4 D4/4 C4/2 | G4/4 G4/4 F4/4 F4/4 | E4/4 E4/4 D4/2 | G4/4 G4/4 F4/4 F4/4 | E4/4 E4/4 D4/2 | C4/4 C4/4 G4/4 G4/4 | A4/4 A4/4 G4/2 | F4/4 F4/4 E4/4 E4/4 | D4/4 D4/4 C4/2'},
 {id:'jingle', title:'Jingle Bells (refrain)', level:'facile', tempo:110, ts:[4,4], info:'Chanson de James Pierpont (1857), domaine public. Version simplifiée du refrain.',
  dsl:'E4/4 E4/4 E4/2 | E4/4 E4/4 E4/2 | E4/4 G4/4 C4/4. D4/8 | E4/1 | F4/4 F4/4 F4/4. F4/8 | F4/4 E4/4 E4/4 E4/8 E4/8 | E4/4 D4/4 D4/4 E4/4 | D4/2 G4/2'},
 {id:'soleil', title:'House of the Rising Sun (accompagnement)', level:'moyen', tempo:80, ts:[6,8], info:'Chanson traditionnelle américaine : suite d’accords classique Am – C – D – F – Am – C – E – E, jouée en arpèges.',
  dsl:'@Am[5 3 2 1 2 3]/8 | @C[5 3 2 1 2 3]/8 | @D[4 3 2 1 2 3]/8 | @F[4 3 2 1 2 3]/8 | @Am[5 3 2 1 2 3]/8 | @C[5 3 2 1 2 3]/8 | @E[6 3 2 1 2 3]/8 | @E[6 3 2 1 2 3]/8'},
 {id:'canon', title:'Canon en Ré (grille d’accords)', level:'moyen', tempo:60, ts:[4,4], info:'Les huit accords du Canon de Pachelbel (domaine public) : D – A – Bm – F♯m – G – D – G – A. Un accord par mesure.',
  dsl:'@D/1 | @A/1 | @Bm/1 | @F♯m/1 | @G/1 | @D/1 | @G/1 | @A/1'},
 {id:'penta', title:'Pentatonique de La mineur (boîte 1)', level:'facile', tempo:80, ts:[4,4], info:'La position 1 en croches, montée puis descente. Étude originale.', dsl:gPentaBox()},
 {id:'blues', title:'Blues shuffle en La (12 mesures)', level:'moyen', tempo:90, ts:[4,4], info:'Riff de basse A – D – E sur 12 mesures, en croches. Composition originale.', dsl:gShuffle()}
];
