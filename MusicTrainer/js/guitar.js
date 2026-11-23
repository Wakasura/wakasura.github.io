/* =====================================================================
   GUITARE — interface : jeu (manche interactif), exercices, leçons de théorie
   Données et dessins : guitar-core.js · textes des leçons : guitar-theory-data.js
   ===================================================================== */
const GT = {streak:0, q:null, chord:null, sel:[null,null,null,null,null,null], cheat:false, lock:false, flash:null,
  correct:-1, ex:null, idx:0, got:new Set(), timers:[], listening:false};
const GC = {mode:'game', game:'find', frets:12, acc:true, labels:false, set:'open', exo:'scale', variant:'pmin', tonic:'9', pos:'0', hints:true, bpm:80, best:0, song:'', track:0, sbpm:{}, shints:true, a4:440, tstr:'auto', gsound:'pluck'};
try{ Object.assign(GC, JSON.parse(localStorage.getItem('ptg')||'{}')); }catch(e){}
const gSave = () => { try{ localStorage.setItem('ptg', JSON.stringify(GC)); }catch(e){} };
let gfbT; function gfb(t,ok){ const f = $('gfb'); f.textContent = t; f.style.color = ok ? 'var(--ok)' : 'var(--bad)'; clearTimeout(gfbT); gfbT = setTimeout(()=>f.textContent='', 2800); }
const gScore = ok => { if(ok){ GT.streak++; GC.best = Math.max(GC.best, GT.streak); } else GT.streak = 0; gSave(); };
const gSound = (m, vel=.8, dur=1400) => { if(!S.snd) return; if(GC.gsound==='piano' || !gGuitarNote(m, vel)) playNote(m, vel, dur); };   // corde pincée, ou piano en repli
const gPlay = (s,f) => gSound(GS[s]+f);
const gStrum = pos => pos.slice().sort((a,b)=>a[0]-b[0]).forEach(([s,f],i)=>setTimeout(()=>gPlay(s,f), i*45));
const gRand = n => Math.floor(Math.random()*n);
const gEmptySel = () => [null,null,null,null,null,null];

/* ---------- questions ---------- */
function gPickChord(set, prev){
  if(set==='barre'){ let c, n = 0; do{ c = gBarreChord(gRand(12), Math.random()<.5); n++; } while(n<30 && prev && prev.sym===c.sym); return c; }
  const pool = GLIB.filter(c => set==='open' ? c[3]==='o' : (c[3]==='o' || c[3]==='7'));
  let c, n = 0; do{ c = pool[gRand(pool.length)]; n++; } while(n<30 && prev && prev.sym===c[0]);
  return gChordObj(c[0], c[1], c[2], c[3], c[4]);
}
function gAnswers(labels, correct){
  GT.correct = correct; $('gAnsBtns').innerHTML = labels.map((l,i)=>`<button data-i="${i}">${l}</button>`).join(''); $('gAns').hidden = false;
}
function gNext(){
  GT.flash = null; GT.lock = false; GT.cheat = false; GT.sel = gEmptySel(); $('gNext').hidden = true;
  const g = GC.game;
  if(g==='find' || g==='name'){
    let s, f, pc, n = 0;
    do{ s = gRand(6); f = gRand(GC.frets+1); pc = (GS[s]+f)%12; n++; }
    while(n<80 && ((!GC.acc && BLK.has(pc)) || (GT.q && GT.q.s===s && GT.q.f===f)));
    GT.q = {s, f, pc, done:false};
    if(g==='name') gAnswers([...Array(12)].map((_,i)=>gn(i)), pc);
  } else {
    GT.chord = gPickChord(GC.set, GT.chord);
    if(g==='chordName'){
      const opts = [GT.chord]; let n = 0;
      while(opts.length<4 && n++<80){ const c = gPickChord(GC.set, null); if(!opts.some(o=>o.sym===c.sym)) opts.push(c); }
      const order = shuffle(opts); gAnswers(order.map(c=>`${c.label} · ${c.sym}`), order.indexOf(GT.chord));
    }
  }
  gRender();
}
function gAnswer(i){
  if(GT.lock || GC.mode!=='game') return; GT.lock = true;
  const ok = i===GT.correct, bs = $('gAnsBtns').children;
  bs[i].classList.add(ok ? 'ok' : 'ko'); if(!ok) bs[GT.correct].classList.add('ok');
  gScore(ok);
  if(GC.game==='name'){ GT.q.done = true; gPlay(GT.q.s, GT.q.f); }
  if(ok){ gfb('Correct !', true); setTimeout(()=>{ if(GT.lock) gNext(); }, 650); }
  else{ gfb(GC.game==='name' ? `Non : c’était ${gn(GT.q.pc)}` : `Non : c’était ${GT.chord.label} (${GT.chord.sym})`, false); $('gNext').hidden = false; }
  gRender();
}
function gFlash(s,f,c){ const fl = GT.flash = {s, f, c, t:gs(GS[s]+f)}; setTimeout(()=>{ if(GT.flash===fl){ GT.flash = null; gRender(); } }, 650); }
function gClick(s,f){
  if(GC.mode==='song') return gSongClick(s,f);
  gPlay(s,f);
  if(GC.mode==='drill') return gDrillClick(s,f);
  const g = GC.game;
  if(g==='find'){
    const q = GT.q; if(!q || GT.lock) return;
    const ok = s===q.s && (GS[s]+f)%12===q.pc; gScore(ok);
    if(ok){ GT.lock = true; GT.flash = {s, f, c:'ok', t:gs(GS[s]+f)}; gfb('Correct !', true); setTimeout(gNext, 550); }
    else{ gFlash(s,f,'ko'); gfb(`Joué : ${gn(GS[s]+f)} (${GSO[s]} corde, case ${f})`, false); }
    gRender();
  } else if(g==='chord'){ GT.sel[s] = GT.sel[s]===f ? null : f; gRender(); }
}
function gValidate(){
  const C = GT.chord; if(!C || GC.game!=='chord') return;
  const snd = gShapePos(GT.sel.map(f=>f==null ? -1 : f));
  if(snd.length<3) return gfb('Place au moins 3 notes sur le manche.', false);
  gStrum(snd);
  const got = new Set(snd.map(([s,f])=>(GS[s]+f)%12)), allowed = new Set([...C.pcs, ...C.extra]);
  const miss = C.pcs.filter(p=>!got.has(p)), extra = [...got].filter(p=>!allowed.has(p));
  if(!miss.length && !extra.length){
    if(!GT.cheat) gScore(true);
    gfb(`Correct ! ${C.sym} — forme usuelle : ${gShapeStr(C.shape)}`, true); setTimeout(gNext, 1500);
  } else{
    gScore(false);
    gfb((miss.length ? `Il manque : ${miss.map(gs).join(', ')}. ` : '') + (extra.length ? `En trop : ${extra.map(gs).join(', ')}.` : ''), false);
  }
  gRender();
}

/* ---------- exercices ---------- */
const GEXO = {
  scale:{v:[['pmin','Pentatonique mineure'],['pmaj','Pentatonique majeure'],['blues','Gamme blues'],['min','Mineure naturelle'],['maj','Majeure']], t:'pc', pos:true, n:'Gammes'},
  chromo:{v:GSN.map((n,i)=>[String(i), `${GSO[i]} corde (${n})`]), t:null, n:'Chromatique sur une corde'},
  arp:{v:[['up','Montée et descente']], t:'chord', n:'Arpèges d’accords ouverts'},
  prog:{v:[['IVV','I – IV – V – I'],['pop','I – V – vi – IV'],['fif','I – vi – IV – V']], t:'key', n:'Enchaînements d’accords'}
};
function gxUI(){
  const e = GEXO[GC.exo] || GEXO.scale, vs = $('gxVariant'), tn = $('gxTonic');
  $('gxType').value = GC.exo;
  vs.innerHTML = e.v.map(([a,b])=>`<option value="${a}">${b}</option>`).join(''); vs.hidden = e.v.length<2;
  if(![...vs.options].some(o=>o.value===GC.variant)) GC.variant = vs.options[0].value; vs.value = GC.variant;
  const tl = e.t==='pc' ? [...Array(12)].map((_,i)=>[String(i), gn(i)])
    : e.t==='chord' ? GLIB.filter(c=>c[3]==='o' || c[3]==='7').map(c=>[c[0], `${c[1]} (${c[0]})`])
    : e.t==='key' ? Object.keys(GPROG).map(k=>[k, GLIBM[k][1]]) : [];
  tn.innerHTML = tl.map(([a,b])=>`<option value="${a}">${b}</option>`).join(''); tn.hidden = !tl.length;
  if(tl.length){ if(!tl.some(x=>x[0]===GC.tonic)) GC.tonic = tl[0][0]; tn.value = GC.tonic; }
  $('gxPos').hidden = !e.pos; $('gxPos').value = GC.pos; $('gxHints').checked = GC.hints; $('gxBpm').value = GC.bpm;
}
function gxBuild(){
  const v = GC.variant;
  return GC.exo==='scale' ? gxScale(+GC.tonic, v, +GC.pos) : GC.exo==='chromo' ? gxChromo(+v) : GC.exo==='arp' ? gxArp(GC.tonic) : gxProg(GC.tonic, v);
}
function gxGo(){ gxStop(); GT.ex = gxBuild(); GT.idx = 0; GT.got = new Set(); GT.flash = null; gRender(); }
function gDrillClick(s,f){
  const ex = GT.ex, st = ex && ex.steps[GT.idx]; if(!st) return;
  const key = `${s}:${f}`, want = st.pos.map(p=>p.join(':'));
  if(want.includes(key)){
    GT.got.add(key);
    if(want.every(k=>GT.got.has(k))){ gScore(true); GT.idx++; GT.got = new Set(); gfb(GT.idx>=ex.steps.length ? 'Exercice terminé !' : 'Correct !', true); }
  } else{
    GT.got = new Set(); gScore(false); gFlash(s,f,'ko'); gfb(`Joué : ${gn(GS[s]+f)} — attendu : ${st.label}`, false);
  }
  gRender();
}
function gxStop(){ GT.timers.forEach(clearTimeout); GT.timers = []; GT.listening = false; $('gxListen').textContent = '▶ Écouter'; if(typeof gSongLeave==='function') gSongLeave(); }
function gxListen(){
  if(GT.listening) return gxStop();
  const ex = GT.ex; if(!ex) return; GT.listening = true; $('gxListen').textContent = '⏹ Stop';
  const beat = 60000/Math.max(30, Math.min(240, +$('gxBpm').value||80)); let t = 0;
  ex.steps.forEach(st=>{ const p = st.pos; GT.timers.push(setTimeout(()=>p.length>1 ? gStrum(p) : gPlay(p[0][0], p[0][1]), t)); t += p.length>1 ? beat*2 : beat; });
  GT.timers.push(setTimeout(gxStop, t+300));
}

/* ---------- affichage ---------- */
function gMarks(){
  const m = new Map(), put = (s,f,c,t='') => m.set(`${s}:${f}`, {c, t}), nm = (s,f) => gs(GS[s]+f);
  if(GC.mode==='song'){
    const sg = GSG.song, st = sg && sg.steps[GSG.sidx];
    if(st) st.pos.forEach(([s,f])=>{ const k = `${s}:${f}`, name = gs(sg.tuning[s]+f); if(GT.got.has(k)) put(s, f, 'ok', name); else if(GC.shints!==false) put(s, f, 'tg', GC.labels ? name : ''); });
  } else if(GC.mode==='game'){
    const g = GC.game;
    if(g==='find' && S.corr && GT.q) for(let f=0;f<=GC.frets;f++) if((GS[GT.q.s]+f)%12===GT.q.pc) put(GT.q.s, f, 'ghost', GC.labels ? nm(GT.q.s,f) : '');
    if(g==='name' && GT.q) put(GT.q.s, GT.q.f, 'tg', GT.q.done ? gs(GT.q.pc) : '?');
    if(g==='chord'){
      if(S.corr && GT.chord) gShapePos(GT.chord.shape).forEach(([s,f])=>put(s, f, 'ghost', GC.labels ? nm(s,f) : ''));
      GT.sel.forEach((f,s)=>{ if(f!=null) put(s, f, 'sel', nm(s,f)); });
    }
  } else if(GT.ex){
    const st = GT.ex.steps[GT.idx];
    if(st) st.pos.forEach(([s,f])=>{ const k = `${s}:${f}`; if(GT.got.has(k)) put(s, f, 'ok', nm(s,f)); else if(GC.hints) put(s, f, 'tg', GC.labels ? nm(s,f) : ''); });
  }
  if(GT.flash) put(GT.flash.s, GT.flash.f, GT.flash.c, GT.flash.t);
  return m;
}
function gRender(){
  $('gSt').textContent = GT.streak; $('gBt').textContent = GC.best;
  if(GC.mode==='song') return gSongRender();
  if(GC.mode==='tuner') return gTunerRender();
  const dr = GC.mode==='drill', g = GC.game; let q = '', info = '', nf = 7;
  if(!dr){
    if(g==='find' && GT.q){ q = `Trouve <b>${gn(GT.q.pc)}</b> sur la ${GSO[GT.q.s]} corde <small>(${GSN[GT.q.s]})</small>`; nf = GC.frets;
      info = 'Clique la bonne case. Case 0 = corde à vide (à gauche du sillet).'; }
    else if(g==='name' && GT.q){ q = 'Quelle est cette note ?'; nf = GC.frets; info = 'La note marquée sur le manche : choisis son nom.'; }
    else if(g==='chord' && GT.chord){ q = `Joue <b>${GT.chord.label}</b> <small>(${GT.chord.sym})</small>`; nf = GC.set==='barre' ? 10 : 7;
      info = 'Clique une case par corde (clique à nouveau pour l’enlever), puis « Valider ». Une corde sans note est muette.'; }
    else if(g==='chordName' && GT.chord){ q = 'Quel est cet accord ?'; info = '× = corde muette · ○ = corde à vide · points = cases à presser.'; }
    $('gDiagram').innerHTML = g==='chordName' && GT.chord ? chordDiagram(GT.chord.shape, {label:'Diagramme d’accord à reconnaître'}) : '';
  } else if(GT.ex){
    const ex = GT.ex, st = ex.steps[GT.idx]; nf = ex.nf;
    if(st){ q = `<small>Étape ${GT.idx+1}/${ex.steps.length}</small><br><b>${st.label}</b>`; info = ex.title; }
    else{ q = '✔ Exercice terminé !'; info = ex.title; }
  }
  $('gQuestion').innerHTML = q; $('gInfo').textContent = info;
  if(!$('gBoardWrap').hidden) $('gBoard').innerHTML = gBoardSVG(nf, gMarks());
}
function gSync(){
  const m = GC.mode, dr = m==='drill', so = m==='song', gm = m==='game', g = GC.game;
  document.querySelectorAll('#gModeSeg button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.gm===m));
  document.querySelectorAll('#gGameSeg button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.gg===g));
  $('gGameBar').hidden = !gm; $('gExoBar').hidden = !dr; $('gSongBar').hidden = !so; $('gSongTools').hidden = !so; $('gTab').hidden = !so;
  const nt = g==='find' || g==='name', ch = g==='chord' || g==='chordName';
  $('gFrets').hidden = !nt; $('gAcc').closest('label').hidden = !nt; $('gChordSet').hidden = !ch;
  $('gLab').closest('label').hidden = g==='name' || g==='chordName';
  $('gAns').hidden = !gm || !(g==='name' || g==='chordName') || !$('gAnsBtns').children.length;
  $('gChordActions').hidden = !gm || g!=='chord'; $('gDiagram').hidden = !gm || g!=='chordName';
  $('gBoardWrap').hidden = (gm && g==='chordName') || m==='tuner'; $('gTuner').hidden = m!=='tuner';
  $('gMic').hidden = !((gm && (g==='find' || g==='chord')) || dr || so); if($('gMic').hidden && typeof GM!=='undefined' && GM.validate){ GM.validate = false; gMicWanted(); }
  $('gFrets').value = GC.frets; $('gAcc').checked = GC.acc; $('gLab').checked = GC.labels; $('gChordSet').value = GC.set;
}
function gSetMode(m){ if(typeof gTunerLeave==='function') gTunerLeave(); GC.mode = m; gSave(); gxStop(); gSync(); if(m==='drill') gxGo(); else if(m==='song') gSongEnter(); else if(m==='tuner') gTunerEnter(); else gNext(); gSync(); }
function gSetGame(g){ GC.game = g; gSave(); GT.q = null; GT.chord = null; $('gAnsBtns').innerHTML = ''; gSync(); gNext(); gSync(); }
function gShow(){                                              // appelé à l'ouverture de la page Guitare
  gSync(); if(GC.mode==='drill'){ if(!GT.ex) gxGo(); } else if(GC.mode==='song') gSongEnter(); else if(!GT.q && !GT.chord) gNext(); gSync(); gRender();
}

/* ---------- événements ---------- */
$('gxType').innerHTML = Object.entries(GEXO).map(([k,e])=>`<option value="${k}">${e.n}</option>`).join('');
$('gModeSeg').onclick = e => { const b = e.target.closest('button'); if(b && b.dataset.gm!==GC.mode) gSetMode(b.dataset.gm); };
$('gGameSeg').onclick = e => { const b = e.target.closest('button'); if(b && b.dataset.gg!==GC.game) gSetGame(b.dataset.gg); };
$('gFrets').onchange = e => { GC.frets = +e.target.value; gSave(); gNext(); };
$('gAcc').onchange = e => { GC.acc = e.target.checked; gSave(); gNext(); };
$('gLab').onchange = e => { GC.labels = e.target.checked; gSave(); gRender(); };
$('gChordSet').onchange = e => { GC.set = e.target.value; gSave(); gNext(); };
$('gBoard').onclick = e => { const r = e.target.closest('.gb-hit'); if(r) gClick(+r.dataset.s, +r.dataset.f); };
$('gAnsBtns').onclick = e => { const b = e.target.closest('button'); if(b) gAnswer(+b.dataset.i); };
$('gNext').onclick = gNext;
$('gValidate').onclick = gValidate;
$('gClear').onclick = () => { GT.sel = gEmptySel(); gRender(); };
$('gShow').onclick = () => { if(!GT.chord) return; GT.cheat = true; GT.sel = GT.chord.shape.map(f=>f<0 ? null : f); gRender(); };
$('gHear').onclick = () => { if(GT.chord) gStrum(gShapePos(GT.chord.shape)); };
$('gxType').onchange = e => { GC.exo = e.target.value; gSave(); gxUI(); gxGo(); };
$('gxVariant').onchange = e => { GC.variant = e.target.value; gSave(); gxGo(); };
$('gxTonic').onchange = e => { GC.tonic = e.target.value; gSave(); gxGo(); };
$('gxPos').onchange = e => { GC.pos = e.target.value; gSave(); gxGo(); };
$('gxHints').onchange = e => { GC.hints = e.target.checked; gSave(); gRender(); };
$('gxBpm').onchange = e => { GC.bpm = Math.max(30, Math.min(240, +e.target.value||80)); gSave(); };
$('gxGo').onclick = gxGo; $('gxListen').onclick = gxListen;
['solf','corr'].forEach(id=>$(id).addEventListener('click', ()=>{                // réglages partagés (noms Do Ré Mi, mode correction)
  if($('guitarPage').hidden) return;
  if(GC.game==='name') [...$('gAnsBtns').children].forEach((b,i)=>{ b.textContent = gn(i); });
  gxUI(); gRender(); }));

/* ---------- théorie guitare ---------- */
let gtSecs = [], gtCur = 0, gtBest = {};
const gtBadge = (i,b) => { b.textContent = gtBest[i]!=null ? `✓ Quiz : ${gtBest[i]}/${QN}` : ''; };
const gtDraw = i => shuffle(GT_QUIZ[i]).slice(0,QN).map(([q,opts,why])=>{
  const o = shuffle(opts.map((t,k)=>({t, ok:k===0}))); return [q, o.map(x=>x.t), o.findIndex(x=>x.ok), why]; });
function gtQuiz(sec, i, badge){
  if(!GT_QUIZ[i]) return;
  const box = document.createElement('div'); box.className = 'example tquiz'; sec.appendChild(box);
  let qs = gtDraw(i), k = 0, score = 0;
  const show = () => {
    box.textContent = '';
    if(k>=qs.length){
      gtBest[i] = Math.max(gtBest[i]||0, score); try{ localStorage.setItem('ptqg', JSON.stringify(gtBest)); }catch(e){} gtBadge(i, badge);
      const b = document.createElement('b'), r = document.createElement('button'); b.textContent = `Quiz terminé : ${score}/${qs.length} `;
      r.textContent = 'Nouveau quiz'; r.onclick = () => { qs = gtDraw(i); k = 0; score = 0; show(); }; box.append(b, r); return;
    }
    const [q,opts,good,why] = qs[k], h = document.createElement('b'), t = document.createElement('p'), row = document.createElement('div');
    h.textContent = `Quiz ${k+1}/${qs.length}`; t.textContent = q; row.className = 'ans-grid';
    opts.forEach((o,j)=>{ const b = document.createElement('button'); b.textContent = o; b.onclick = () => {
      [...row.children].forEach((x,n)=>{ x.disabled = true; if(n===good) x.classList.add('ok'); else if(n===j) x.classList.add('ko'); });
      if(j===good) score++;
      const f = document.createElement('p'), nx = document.createElement('button');
      f.textContent = (j===good ? 'Correct. ' : 'Pas tout à fait. ')+why; nx.className = 'btn'; nx.textContent = k+1<qs.length ? 'Suivant ▶' : 'Terminer';
      nx.onclick = () => { k++; show(); }; box.append(f, nx); }; row.appendChild(b); });
    box.append(h, t, row);
  };
  show();
}
function gtShowIndex(){ $('gtIndex').hidden = false; $('gtNav').hidden = true; gtSecs.forEach(s=>s.hidden = true); }
function gtOpen(i){
  gtCur = i; $('gtIndex').hidden = true; $('gtNav').hidden = false; gtSecs.forEach((s,n)=>s.hidden = n!==i);
  $('gtPrev').disabled = i===0; $('gtNext').disabled = i===gtSecs.length-1; window.scrollTo(0,0);
}
const GT_PRESETS = [{m:'game', g:'find'}, {m:'game', g:'chordName'}, {m:'game', g:'chord', set:'open'}, {m:'game', g:'chord', set:'barre'},
  {m:'drill', x:'scale'}, {m:'drill', x:'chromo'}, {m:'game', g:'name'}];
function gtBuild(){
  const root = document.querySelector('#gTheoryPage .theory'); root.innerHTML = GT_HTML;
  root.querySelectorAll('[data-chord]').forEach(el=>{                       // figures d'accords : diagramme + nom + écoute
    const c = GLIBM[el.dataset.chord]; if(!c) return;
    el.classList.add('chord-fig'); el.innerHTML = chordDiagram(c[2], {label:`${c[1]} (${c[0]})`}) + `<figcaption>${c[1]} <b>${c[0]}</b></figcaption>`;
    const b = document.createElement('button'); b.className = 'play'; b.textContent = '▶'; b.setAttribute('aria-label', 'Écouter '+c[1]);
    b.dataset.play = gShapePos(c[2]).map(([s,f])=>GS[s]+f).join(','); b.dataset.gap = '45'; b.dataset.dur = '1800'; el.appendChild(b);
  });
  root.querySelectorAll('[data-gtboard]').forEach(el=>{                      // manches illustrés
    const kind = el.dataset.gtboard, marks = new Map(); let nf = +el.dataset.nf || 12;
    if(kind==='naturals') for(let s=0;s<6;s++) for(let f=0;f<=nf;f++){ const pc = (GS[s]+f)%12; if(!BLK.has(pc)) marks.set(`${s}:${f}`, {c:pc===0 ? 'root' : 'nat', t:FRS[pc]}); }
    else if(kind==='scale'){ const t = +el.dataset.t, ex = gxScale(t, el.dataset.v, +el.dataset.p||0); nf = ex.nf;
      ex.steps.forEach(st=>{ const [s,f] = st.pos[0], pc = (GS[s]+f)%12; marks.set(`${s}:${f}`, {c:pc===t ? 'root' : 'nat', t:FRS[pc]}); }); }
    el.innerHTML = '<div class="gboardwrap">'+gBoardSVG(nf, marks, false)+'</div>';
  });
  gtSecs = [...root.querySelectorAll(':scope > section')];
  try{ gtBest = JSON.parse(localStorage.getItem('ptqg')||'{}'); }catch(e){}
  gtSecs.forEach((sec,i)=>{
    const b = document.createElement('button'), t = document.createElement('strong'), d = document.createElement('span'), em = document.createElement('em');
    b.type = 'button'; b.className = 'theory-topic'; t.textContent = sec.querySelector('h2').textContent; d.textContent = sec.dataset.summary || '';
    gtBadge(i, em); b.append(t, d, em); b.onclick = () => gtOpen(i); $('gtIndex').appendChild(b);
    gtQuiz(sec, i, em);
    const tr = document.createElement('button'); tr.className = 'btn'; tr.style.marginTop = '14px'; tr.textContent = "S'entraîner";
    tr.onclick = () => { const p = GT_PRESETS[i] || GT_PRESETS[0]; GC.mode = p.m; if(p.g) GC.game = p.g; if(p.set) GC.set = p.set; if(p.x){ GC.exo = p.x; } gSave();
      GT.q = null; GT.chord = null; GT.ex = null; $('gAnsBtns').innerHTML = ''; gxUI(); showPage('guitar'); };
    sec.appendChild(tr);
  });
  $('gtBack').onclick = gtShowIndex;
  $('gtPrev').onclick = () => { if(gtCur>0) gtOpen(gtCur-1); };
  $('gtNext').onclick = () => { if(gtCur<gtSecs.length-1) gtOpen(gtCur+1); };
  gtShowIndex();
}
gtBuild(); gxUI(); gSync();
