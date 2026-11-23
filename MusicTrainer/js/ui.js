/* =====================================================
   BIBLIOTHÈQUE (IndexedDB) + UI
   ===================================================== */
const dbOp = (mode,fn) => new Promise((res,rej)=>{
  const r = indexedDB.open('piano-trainer',1);
  r.onupgradeneeded = () => r.result.createObjectStore('f',{keyPath:'name'});
  r.onerror = () => rej(r.error);
  r.onsuccess = () => { const t = r.result.transaction('f',mode), q = fn(t.objectStore('f'));
    t.oncomplete = () => res(q?.result); t.onerror = () => rej(t.error); };
});
function refreshLib(){
  $('lib').innerHTML = `<option value="">Mes partitions (${LIB.length})</option>` + LIB.map((s,i)=>`<option value="${i}">${s.title}</option>`).join('');
  $('lib').hidden = !LIB.length; $('lib').value = S.si>=0 && LIB[S.si] ? S.si : '';
  $('del').hidden = S.si<0 || !LIB[S.si];
  const sc = LIB[S.si]; $('partSel').hidden = !sc || sc.names.length<2;
  if(sc && sc.names.length>1) $('partSel').innerHTML = sc.names.map((n,i)=>`<option value="${i}">${n}</option>`).join('') + '<option value="0,1">Parties 1 + 2</option>';
  if(sc) $('partSel').value = sc.sel.join(',');
}
async function importFiles(files){
  for(const f of files){
    try{
      feedback('Import de '+f.name+'…', true); await new Promise(r=>setTimeout(r,20));
      const buf = await f.arrayBuffer(), sc = await scoreFrom(f.name,buf);
      LIB = LIB.filter(s=>s.fname!==f.name); LIB.push(sc);
      dbOp('readwrite',s=>s.put({name:f.name, buf})).catch(()=>{});
      feedback('Importé : '+f.name, true);
    }catch(e){ console.error(e); feedback('Erreur '+f.name+' : '+e.message, false); }
  }
  if(LIB.length) openScore(LIB.length-1);
}
function useScore(sc){
  stopListen(); S.rev = (S.rev||0)+1;
  if(!sc){ Object.assign(S,{measures:[],raw:[],steps:[],hasBass:false,title:'',single:false,idx:0}); return; }
  Object.assign(S,{measures:sc.measures, raw:sc.steps, hasBass:sc.hasBass, title:sc.title, single:!!sc.single, loop:{a:null,b:null}});
  const ms = sc.steps.flatMap(s=>s.notes.map(n=>n.midi));
  S.pLo = Math.max(21, Math.floor(Math.min(...ms)/12)*12);
  S.pHi = Math.min(108, Math.max(Math.ceil((Math.max(...ms)+1)/12)*12, S.pLo+24));
  $('bpm').value = S.bpms?.[bpmKey()] || sc.tempo || 80; $('loop').textContent = 'Boucle'; applyHand();
}
function openScore(i){ S.si = i; S.lastScore = LIB[i]?.fname; refreshLib(); setMode('partition'); }
function setMode(m){ S.rev = (S.rev||0)+1; S.full = !!S.keepFull; S.keepFull = false;
  S.ui = m; S.quiz = false; $('kbWrap').hidden = false; S.noStaff = false; $('ansBar').hidden = true; S.drill = m==='drill'; S.mode = m==='game' ? 'game' : 'partition'; stopListen();
  document.querySelectorAll('#modeSeg button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.mode===m)); S.lastMode = m; persist();
  $('scoreBar').hidden = m!=='partition'; $('tools').hidden = m==='game'; $('gameBar').hidden = m!=='game'; $('exoBar').hidden = m!=='drill';
  if(m==='drill') genExo(); else if(m==='partition') useScore(LIB[S.si]);
  buildKeyboard(); draw();
}
const tog = (id,key,after) => $(id).onclick = e => { S[key] = !S[key]; e.currentTarget.setAttribute('aria-pressed',S[key]); persist(); after&&after(); };

function toggleMenu(open){
  open = open ?? !$('drawer').classList.contains('open');
  $('drawer').classList.toggle('open',open); $('drawerOv').classList.toggle('open',open);
  $('drawer').setAttribute('aria-hidden',!open); $('menuBtn').setAttribute('aria-expanded',open);
}
$('menuBtn').onclick = () => toggleMenu();
$('drawerOv').onclick = $('drawerClose').onclick = () => toggleMenu(false);
addEventListener('keydown', e => { if(e.key==='Escape') toggleMenu(false); });
$('file').onchange = e => { importFiles([...e.target.files]); e.target.value=''; };
$('lib').onchange = e => { if(e.target.value!=='') openScore(+e.target.value); };
$('partSel').onchange = e => {
  const sc = LIB[S.si];
  try{ const n = parseMusicXML(sc.xml, sc.title, e.target.value.split(',').map(Number)); LIB[S.si] = Object.assign(n,{fname:sc.fname, buf:sc.buf}); openScore(S.si); }
  catch(err){ feedback(err.message,false); }
};
$('del').onclick = () => {
  const sc = LIB[S.si]; if(!sc || !confirm('Supprimer « '+sc.title+' » ?')) return;
  dbOp('readwrite',s=>s.delete(sc.fname)).catch(()=>{}); LIB.splice(S.si,1); S.si = -1; S.measures = []; S.steps = []; S.raw = []; refreshLib(); draw();
};
document.addEventListener('dragover', e=>e.preventDefault());
document.addEventListener('drop', e=>{ e.preventDefault(); importFiles([...e.dataTransfer.files]); });
$('modeSeg').onclick = e => { const b = e.target.closest('button'); if(b && b.dataset.mode!==S.ui) setMode(b.dataset.mode); };
$('range').onchange = e => { [S.lo,S.hi] = e.target.value.split(',').map(Number); persist(); newNote(); buildKeyboard(); draw(); };
$('clef').onchange = e => { S.clef = e.target.value; persist(); newNote(); draw(); };
$('acc').onchange = e => { S.acc = e.target.checked; persist(); newNote(); if(S.gameType==='chord') newChord(); draw(); };
function syncGameUI(){                                          // contrôles propres à chaque jeu
  const c = S.gameType==='chord';
  ['range','clef'].forEach(id=>$(id).hidden = c); $('ear').closest('label').hidden = c;
  const kk = c && /^\d+$/.test(S.chordKey);                      // tonalité choisie : accords diatoniques
  $('replay').hidden = c || !S.ear; $('chordKey').hidden = !c; $('chordSet').hidden = !c || kk; $('chordDeg').hidden = !kk; $('chordShow').hidden = !kk;
  $('acc').closest('label').hidden = kk; $('chordInv').hidden = !c; $('chordHear').hidden = !c;
  document.querySelectorAll('#gameSeg button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.game===(c?'chord':'note')));
}
$('gameSeg').onclick = e => { const b = e.target.closest('button'); if(!b || b.dataset.game===(S.gameType||'note')) return;
  S.gameType = b.dataset.game; S.pressed.clear(); persist(); syncGameUI(); S.gameType==='chord' ? newChord() : newNote(); draw(); };
$('kbLeft').onclick = () => $('kbScroll').scrollBy({left:-7*(S.kbWW||30), behavior:'smooth'});       // une octave
$('kbRight').onclick = () => $('kbScroll').scrollBy({left:7*(S.kbWW||30), behavior:'smooth'});
$('chordKey').onchange = e => { S.chordKey = e.target.value; persist(); syncGameUI(); newChord(); draw(); };
$('chordDeg').onchange = e => { S.chordDeg = e.target.value; persist(); newChord(); draw(); };
$('chordShow').onchange = e => { S.chordShow = e.target.value; persist(); newChord(); draw(); };
$('chordInv').onchange = e => { S.chordInv = e.target.value; persist(); newChord(); draw(); };
$('chordSet').onchange = e => { S.chordSet = e.target.value; persist(); newChord(); draw(); };
$('chordHear').onclick = playChord;
$('snd').onchange = e => { S.snd = e.target.checked; persist(); };
tog('labels','labels',()=>{ buildKeyboard(); draw(); });
tog('solf','solfege',()=>{ buildKeyboard(); draw(); });
tog('corr','corr',draw);
tog('countBtn','count');
$('hand').onchange = e => { S.hand = +e.target.value; applyHand(S.steps[S.idx]?.m); persist(); draw(); };
$('prev').onclick = () => goMeasure((S.steps[S.idx]?.m ?? 0)-1);
$('next').onclick = () => goMeasure((S.steps[S.idx]?.m ?? 0)+1);
$('restart').onclick = () => goMeasure(0);
$('listen').onclick = listen;
function setFull(v){                                           // vue « partition complète » : toute la partition, sans clavier
  S.full = v;
  $('kbWrap').hidden = v; if(v) fillPgScore(); else buildKeyboard(); draw(); if(v) window.scrollTo({top:0, behavior:'smooth'});
}
function fillPgScore(){                                        // liste des partitions, à côté des boutons de page
  const sel = $('pgScore'); sel.textContent = '';
  LIB.forEach((sc,i)=>{ const o = document.createElement('option'); o.value = i; o.textContent = sc.title; sel.appendChild(o); });
  sel.value = S.si;
}
$('pgScore').onchange = e => { S.keepFull = true; openScore(+e.target.value); setFull(true); };
$('full').onclick = () => {                                    // Réglages > Mes partitions : entrer / sortir de la vue complète
  toggleMenu(false);
  if(S.full) return setFull(false);
  if(!LIB.length){ feedback('Importe d’abord une partition (.mxl)',false); return $('file').click(); }
  if(S.ui!=='partition' || !LIB[S.si]){ S.keepFull = true; openScore(LIB[S.si] ? S.si : LIB.length-1); }
  setFull(true);
};
$('metro').onclick = metro;
const bpmKey = () => S.ui==='partition' ? LIB[S.si]?.fname : 'exo';       // tempo mémorisé par partition (et pour les exercices)
$('bpm').onchange = () => { if(window.Tone) Tone.Transport.bpm.value = tempo(); const k = bpmKey(); if(k){ (S.bpms ||= {})[k] = tempo(); persist(); } };
$('loop').onclick = () => {
  const m = S.steps[S.idx]?.m ?? 0, L = S.loop;
  if(L.a==null) L.a = m; else if(L.b==null){ if(m<L.a){ L.b = L.a; L.a = m; } else L.b = m; } else L.a = L.b = null;
  $('loop').textContent = L.a==null ? 'Boucle' : L.b==null ? `A=${L.a+1}, choisis B` : `${L.a+1}→${L.b+1}`; draw();
};
$('score').addEventListener('click', e=>{                                    // clic sur une mesure = y aller
  const svg = $('score').querySelector('svg'); if(osmdActive() || S.mode!=='partition' || !svg || !S.hit.length) return;
  const r = svg.getBoundingClientRect(), x = (e.clientX-r.left)*(S.W/r.width), h = S.hit.find(h=>x>=h.x0 && x<h.x1);
  if(h) goMeasure(h.mi);
});

const PAGES = {trainer:['trainerPage','trainerTab'], theory:['theoryPage','theoryTab'], guitar:['guitarPage','guitarTab'], gtheory:['gTheoryPage','gTheoryTab']};
function showPage(page){
  toggleMenu(false); if(page!=='guitar' && typeof gxStop==='function'){ gxStop(); if(typeof gMicStop==='function') gMicStop(); }
  for(const [k,[p,t]] of Object.entries(PAGES)){ $(p).hidden = k!==page; $(t).setAttribute('aria-current', k===page ? 'page' : 'false'); }
  if(page==='trainer'){ buildKeyboard(); draw(); }
  else if(page==='theory') showTheoryIndex();
  else if(page==='guitar') gShow();
  else gtShowIndex();
}
$('trainerTab').onclick = () => showPage('trainer');
$('theoryTab').onclick = () => showPage('theory');
$('guitarTab').onclick = () => showPage('guitar');
$('gTheoryTab').onclick = () => showPage('gtheory');
