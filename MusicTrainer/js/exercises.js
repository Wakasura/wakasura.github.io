/* =====================================================
   EXERCICES : gammes, 5 doigts, arpèges, accords, cadences, intervalles, armures
   (ils génèrent une "partition" et réutilisent mains / boucle / écoute / métronome)
   ===================================================== */
const LET = ['C','D','E','F','G','A','B'], LPC = [0,2,4,5,7,9,11], FR = ['Do','Ré','Mi','Fa','Sol','La','Si'];
const KX = [['Do',60,0,0],['Sol',67,1,4],['Ré',62,2,1],['La',69,3,5],['Mi',64,4,2],['Si',71,5,6],['Fa♯',66,6,3],['Ré♭',61,-5,1],['La♭',68,-4,5],['Mi♭',63,-3,2],['Si♭',70,-2,6],['Fa',65,-1,3]];
const L = n => LET.indexOf(n.step);
const spell = (midi, li) => { li = ((li%7)+7)%7; const oct = Math.round((midi-LPC[li])/12)-1; return {step:LET[li], alter:midi-((oct+1)*12+LPC[li]), oct, midi}; };
const deg = (K,i) => spell(K[1]+12*Math.floor(i/7)+LPC[((i%7)+7)%7], K[3]+i);       // degré i de la gamme majeure K
const frn = n => FR[L(n)] + (n.alter>0?'♯':n.alter<0?'♭':'');
const frno = n => frn(n)+n.oct;                              // avec l'octave : Do4, Fa♯3…
const NE = (n,staff,off,dur,x) => ({type:'note', ...n, staff, off, dur, voice:'1', beams:[], tie:false, ...x});
const lowHand = n => n.midi>=64 ? 24 : 12;

function pack(beats, key){                                   // 4 temps par mesure
  const ms = [];
  for(let i=0;i<beats.length;i+=4){
    const ev = [];
    beats.slice(i,i+4).forEach((b,j)=>{ (b.n||[]).forEach(n=>ev.push(NE(n,1,j*4,4,{label:b.label}))); (b.b||[]).forEach(n=>ev.push(NE(n,2,j*4,4,{label:b.label}))); });
    ms.push({ev, key});
  }
  return ms;
}
function mkScore(title, ms, o={}){
  const steps = []; let base = 0;
  const measures = ms.map((m,mi)=>{
    const M = {events:m.ev, clefs:{1:'treble',2:'bass'}, ts:[4,4], key:m.key||0, tsChg:false, keyChg:false, clefChg:{1:false,2:false}, len:16, real:16, end1:false, slots:{}};
    for(const s of [1,2]){ const vs = [...new Set(M.events.filter(e=>e.staff===s).map(e=>e.voice))]; M.slots[s] = (vs.length?vs:['1']).map(v=>buildSlots(M,s,v)); }
    M.n = Math.max(...[1,2].flatMap(s=>M.slots[s].map(a=>a.length)));
    const ns = M.events.filter(e=>e.type==='note' && !e.tie);
    [...new Set(ns.map(e=>e.off))].sort((a,b)=>a-b).forEach(off=>steps.push({m:mi, off, t:base+off, label:ns.find(e=>e.off===off).label,
      notes:ns.filter(e=>e.off===off).map(e=>({midi:e.midi, staff:e.staff, dur:e.dur}))}));
    if(m.expect) steps.push({m:mi, off:0, t:base, label:m.label, notes:m.expect.map(x=>({midi:x, staff:x<60?2:1, dur:16}))});
    base += 16; return M;
  });
  return {title, measures, steps, hasBass:true, tempo:o.tempo||70, single:!!o.single};
}
const both = seq => { const sh = lowHand(seq[0]); return seq.map(n=>({n:[n], b:[spell(n.midi-sh, L(n))]})); };   // 2 mains en parallèle
const SL = {maj:'majeure', min:'mineure naturelle', harm:'mineure harmonique', pmaj:'pentatonique majeure', pmin:'pentatonique mineure', chro:'chromatique', dor:'dorienne', phr:'phrygienne', lyd:'lydienne', mix:'mixolydienne', loc:'locrienne'};
const MODES = {dor:1, phr:2, lyd:3, mix:4, loc:6};        // degré de départ dans la gamme majeure parente
const VL = {maj:'majeur', min:'mineur', dim:'diminué', aug:'augmenté', dom7:'septième de dominante'};

function exScale(K,v){
  let seq, key = K[2];
  if(v==='chro'){
    const t = K[1], SH = [0,0,1,1,2,3,3,4,4,5,5,6], FL = [0,1,1,2,2,3,4,4,5,5,6,6];
    seq = [...Array(13)].map((_,i)=>spell(t+i, SH[(t+i)%12])).concat([...Array(12)].map((_,i)=>spell(t+11-i, FL[(t+11-i)%12]))); key = 0;
  } else {
    const idx = MODES[v]!=null ? [...Array(8)].map((_,i)=>MODES[v]+i) : {maj:[0,1,2,3,4,5,6,7], min:[5,6,7,8,9,10,11,12], harm:[5,6,7,8,9,10,11,12], pmaj:[0,1,2,4,5,7], pmin:[5,7,8,9,11,12]}[v];
    let up = idx.map(i=>deg(K,i)); if(up[0].midi>=72) up = up.map(n=>spell(n.midi-12,L(n)));
    if(v==='harm') up[6] = spell(up[6].midi+1, L(up[6]));                // 7e degré relevé
    seq = up.concat(up.slice(0,-1).reverse());
  }
  return mkScore(`Gamme de ${frn(seq[0])} ${SL[v]}${MODES[v]!=null?` (armure de ${K[0]} majeur)`:''} — monte puis redescend`, pack(both(seq), key));
}
function exFive(K,v){
  const pat = {up:[0,1,2,3,4,3,2,1,0], third:[0,2,1,3,2,4,3,2,1,0]}[v];
  return mkScore(`5 doigts en ${K[0]} majeur`, pack(both(pat.map(i=>deg(K,i))), K[2]));
}
function exChord(K,v,arp){
  const offs = {maj:[0,4,7], min:[0,3,7], dim:[0,3,6], aug:[0,4,8], dom7:[0,4,7,10]}[v], root = K[1];
  const c = offs.map((o,i)=>spell(root+o, K[3]+[0,2,4,6][i]));
  if(arp){ const up = c.concat([spell(root+12,K[3])]); return mkScore(`Arpège de ${frn(c[0])} ${VL[v]}`, pack(both(up.concat(up.slice(0,-1).reverse())), 0)); }
  const bass = spell(root-lowHand(c[0]), K[3]), beats = [];
  for(let k=0;k<=c.length;k++){
    const n = c.map((x,i)=>i<k ? spell(x.midi+12,L(x)) : x).sort((a,b)=>a.midi-b.midi);
    beats.push({n, b:[bass], label:['état fondamental','1er renversement','2e renversement','3e renversement','à l’octave'][k]});
  }
  return mkScore(`Accord de ${frn(c[0])} ${VL[v]} et ses renversements`, pack(beats, 0));
}
function exCad(K,v){
  const P = {a:[[0,2,4],[0,3,5],[-1,1,4],[0,2,4]], b:[[0,2,4],[-1,1,4],[0,2,5],[0,3,5]]}[v];
  const B = {a:[0,3,4,0], b:[0,4,5,3]}[v], N = {a:['I','IV','V','I'], b:['I','V','vi','IV']}[v];
  return mkScore(`Cadence ${N.join(' – ')} en ${K[0]} majeur`, pack(P.map((p,i)=>({n:p.map(d=>deg(K,d)), b:[deg(K,B[i]-7)], label:N[i]})), K[2]), {tempo:60});
}
const IVL = [['seconde mineure',2,1,'une'],['seconde majeure',2,2,'une'],['tierce mineure',3,3,'une'],['tierce majeure',3,4,'une'],['quarte juste',4,5,'une'],['triton',4,6,'un'],['quinte juste',5,7,'une'],['sixte mineure',6,8,'une'],['sixte majeure',6,9,'une'],['septième mineure',7,10,'une'],['septième majeure',7,11,'une'],['octave',8,12,'une']];
function pickInt(){                                           // intervalle au hasard, montant ou descendant, départ sur une touche blanche
  const i = Math.floor(Math.random()*12), num = IVL[i][1], semi = IVL[i][2], dir = Math.random()<.5 ? 1 : -1, li = Math.floor(Math.random()*7);
  const a = spell((dir>0 ? 4+Math.floor(Math.random()*2) : 5)*12 + LPC[li], li);
  return {i, a, b:spell(a.midi+dir*semi, li+dir*(num-1)), dir};
}
function exInt(){                                             // variante « par le nom » : on joue la note demandée
  const ms = [], st = n => n.midi<60 ? 2 : 1;
  for(let k=0;k<8;k++){
    const {i,a,b,dir} = pickInt();
    ms.push({ev:[NE(a,st(a),0,16,{tie:true})], key:0, expect:[b.midi],            // seule la note de départ (grise) est dessinée
      label:`Joue ${IVL[i][3]} ${IVL[i][0]} ${dir>0?'au-dessus de':'en dessous de'} ${frno(a)}`});
  }
  return mkScore('Intervalles — trouve la note', ms, {single:true});
}
/* variantes « nommer » : à la portée et à l'oreille */
function playQ(){ const q = S.q; playNote(q.a.midi,.8,700); setTimeout(()=>playNote(q.b.midi,.8,900),800); }
function newQ(){ S.rev = (S.rev||0)+1; [...$('ansBtns').children].forEach(b=>b.className=''); S.q = {...pickInt(), done:false}; if(S.quizT==='ear') setTimeout(playQ,350); syncAns(); }
function syncAns(){ const q = S.q; $('ansReplay').hidden = !(S.quizT==='ear' || q?.done); $('ansNext').hidden = !(q?.done && !q.ok); }
function drawQ(){
  const q = S.q, sc = $('score');
  if(S.quizT==='ear'){                                          // à l'oreille : jamais de portée
    sc.innerHTML = '<p style="font-size:22px">' + (q.done
      ? (q.ok?'Correct. ':'Incorrect. ') + 'Réponse : <b>' + IVL[q.i][0] + '</b> (' + frno(q.a) + ' → ' + frno(q.b) + ')'
      : 'Écoute les deux notes, puis nomme l’intervalle.') + '</p>';
    return;
  }
  const W = Math.max(300, Math.min(sc.clientWidth-10, 480)), ctx = newCtx(W,330);
  const tr = new Stave(30,50,W-40).addClef('treble').setContext(ctx).draw(), ba = new Stave(30,170,W-40).addClef('bass').setContext(ctx).draw();
  ['brace','singleLeft'].forEach(t=>new StaveConnector(tr,ba).setType(t).setContext(ctx).draw());
  const vs = [[1,tr],[2,ba]].map(([s,st])=>{
    const tk = [q.a,q.b].map(n=> (n.midi<60?2:1)===s
      ? new StaveNote({keys:[n.step.toLowerCase()+(ACC[n.alter]??'')+'/'+n.oct], duration:'h', clef:s===1?'treble':'bass', auto_stem:true})
      : new Vex.Flow.GhostNote({duration:'h'}));
    const v = new Voice({num_beats:4, beat_value:4}).setStrict(false).addTickables(tk); Accidental.applyAccidentals([v],'C'); return [v,st];
  });
  const f = new Formatter(); vs.forEach(([v])=>f.joinVoices([v])); f.format(vs.map(x=>x[0]), W-140); vs.forEach(([v,st])=>v.draw(ctx,st));
}
function answer(i){
  const q = S.q; if(!S.quiz || q.done) return;
  const ok = i===q.i; q.done = true; q.ok = ok;
  const bs = $('ansBtns').children; bs[i].classList.add(ok?'ok':'ko'); if(!ok) bs[q.i].classList.add('ok');
  if(ok){ S.streak++; S.best = Math.max(S.best,S.streak); feedback('Correct !', true); }
  else { S.streak = 0; feedback(`Non : c’était ${IVL[q.i][3]} ${IVL[q.i][0]} (${frno(q.a)} → ${frno(q.b)})`, false); }
  persist(); syncAns(); draw(); if(ok) setTimeout(()=>{ if(S.quiz){ newQ(); draw(); } }, 500);   // faux : on reste sur la correction jusqu'à « Suivant »
}
function exKey(v){
  const ms = KX.slice().sort(()=>Math.random()-.5).slice(0,8).map(K=>{
    const t = v==='min' ? deg(K,5) : deg(K,0);
    return {ev:[{type:'rest', staff:1, off:0, dur:16, voice:'1', beams:[]}], key:K[2], expect:[60+((t.midi-60)%12+12)%12],
      label:`Quelle est la tonalité ${v==='min'?'mineure':'majeure'} ? Joue sa tonique (entre Do4 et Si4).`};
  });
  return mkScore('Armures — trouve la tonalité', ms, {single:true});
}
const EXO = {
  scale:{v:[['maj','Majeure'],['min','Mineure naturelle'],['harm','Mineure harmonique'],['pmaj','Pentatonique majeure'],['pmin','Pentatonique mineure'],['dor','Mode dorien'],['phr','Mode phrygien'],['lyd','Mode lydien'],['mix','Mode mixolydien'],['loc','Mode locrien'],['chro','Chromatique']], t:1},
  five:{v:[['up','1-2-3-4-5-4-3-2-1'],['third','Par tierces']], t:1},
  arp:{v:Object.entries(VL), t:1}, chords:{v:Object.entries(VL), t:1},
  cad:{v:[['a','I – IV – V – I'],['b','I – V – vi – IV']], t:1},
  int:{v:[['name','Par le nom : jouer la note'],['read','À la portée : nommer l’intervalle'],['ear','À l’oreille : nommer l’intervalle']], t:0}, key:{v:[['maj','Majeures'],['min','Mineures']], t:0}
};
const loopable = () => S.drill && !S.quiz && EXO[$('exo').value].t && S.reps!==1;
const repInfo = () => loopable() && S.steps[S.idx] ? ` · tour ${S.lap+1}/${S.reps||'∞'}` : '';
function exoUI(){
  const e = EXO[$('exo').value];
  $('variant').innerHTML = e.v.map(([a,b])=>`<option value="${a}">${b}</option>`).join(''); $('variant').hidden = e.v.length<2; $('tonic').hidden = !e.t; $('reps').hidden = !e.t; showStaffUI();
}
const showStaffUI = () => { $('showStaffL').hidden = !($('exo').value==='int' && $('variant').value==='name'); };
function genExo(){
  const x = $('exo').value, v = $('variant').value, K = KX[+$('tonic').value||0];
  S.reps = +$('reps').value; S.lap = 0; S.quiz = x==='int' && v!=='name'; S.quizT = v; S.noStaff = x==='int' && v==='name' && !$('showStaff').checked;
  $('ansBar').hidden = !S.quiz; $('kbWrap').hidden = S.quiz; $('ansReplay').hidden = v!=='ear'; $('tools').hidden = S.quiz;
  if(S.quiz){ newQ(); return; }
  useScore({scale:()=>exScale(K,v), five:()=>exFive(K,v), arp:()=>exChord(K,v,1), chords:()=>exChord(K,v,0), cad:()=>exCad(K,v), int:exInt, key:()=>exKey(v)}[x]());
}
const regen = () => { genExo(); buildKeyboard(); draw(); persist(); };
$('tonic').innerHTML = KX.map((k,i)=>`<option value="${i}">${k[0]} majeur / ${frn(deg(k,5))} mineur</option>`).join('');
$('exo').onchange = () => { exoUI(); regen(); };
$('variant').onchange = () => { showStaffUI(); regen(); }; $('tonic').onchange = regen; $('showStaff').onchange = regen;
$('ansBtns').innerHTML = IVL.map((x,i)=>`<button data-i="${i}">${x[0]}</button>`).join('');
$('ansBtns').onclick = e => { const b = e.target.closest('button'); if(b) answer(+b.dataset.i); };
$('ansReplay').onclick = playQ;
$('ansNext').onclick = () => { newQ(); draw(); };
$('exoGo').onclick = regen;
$('reps').onchange = () => { S.reps = +$('reps').value; S.lap = 0; persist(); draw(); };
function restoreExo(){                                        // dernier exercice choisi
  const e = S.ex; if(!e) return;
  if(EXO[e.x]){ $('exo').value = e.x; exoUI(); }
  if([...$('variant').options].some(o=>o.value===e.v)) $('variant').value = e.v;
  if(e.t!=null && KX[+e.t]) $('tonic').value = e.t;
  if(e.r!=null) $('reps').value = e.r;
  showStaffUI();
}
exoUI(); restoreExo();
$('ear').onchange = e => { S.ear = e.target.checked; $('replay').hidden = !S.ear; newNote(); if(S.ear) playNote(S.cur,.8,1200); draw(); };
$('replay').onclick = () => playNote(S.cur,.8,1200);
