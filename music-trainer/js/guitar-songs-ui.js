/* =====================================================================
   GUITARE — mode « Morceaux » : bibliothèque (collection de base + fichiers importés), tablature, jeu « attendre la bonne note »
   Dépend de guitar.js (GT, GC, gRender, gfb…), guitar-songs.js et guitar-tab.js.
   Formats : MusicXML (.mxl .musicxml .xml) lu directement ; Guitar Pro (.gp3 .gp4 .gp5 .gpx .gp) lu par alphaTab, chargé à la demande.
   ===================================================================== */
const GSG = {song:null, parsed:null, id:'', sidx:0, loop:{a:null,b:null}, timers:[], listening:false, sys:[], sysW:0, sysFor:null};
let GLIBS = [];                                                // tablatures importées : {name, buf, kind, parsed?}
const gdbOp = (mode, fn) => new Promise((res,rej)=>{
  const r = indexedDB.open('guitar-trainer',1);
  r.onupgradeneeded = () => r.result.createObjectStore('f',{keyPath:'name'});
  r.onerror = () => rej(r.error);
  r.onsuccess = () => { const t = r.result.transaction('f',mode), q = fn(t.objectStore('f')); t.oncomplete = () => res(q?.result); t.onerror = () => rej(t.error); };
});
const gKind = name => /\.(mxl|musicxml|xml)$/i.test(name) ? 'xml' : /\.gp\w*$/i.test(name) ? 'gp' : null;

let gAtPromise = null;                                         // alphaTab : chargé seulement au premier fichier Guitar Pro
const gLoadAlphaTab = () => window.alphaTab ? Promise.resolve() : (gAtPromise ||= new Promise((res,rej)=>{
  const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@1/dist/alphaTab.min.js';
  s.onload = () => window.alphaTab ? res() : rej(new Error('alphaTab introuvable'));
  s.onerror = () => { gAtPromise = null; rej(new Error('alphaTab n’a pas pu être chargé (connexion internet ?)')); };
  document.head.appendChild(s); }));
async function gParseEntry(e){
  if(e.kind==='xml') return gParseXMLTab(await bufToXml(e.name, e.buf), e.name.replace(/\.\w+$/,''));
  await gLoadAlphaTab();
  return gFromAlphaTab(alphaTab.importer.ScoreLoader.loadScoreFromBytes(new Uint8Array(e.buf), new alphaTab.Settings()));
}

/* ---------- bibliothèque ---------- */
function gLibFill(){
  const sel = $('gLib'), cur = GC.song || '', add = (parent, value, text) => { const o = document.createElement('option'); o.value = value; o.textContent = text; parent.appendChild(o); };
  sel.innerHTML = '';
  const g1 = document.createElement('optgroup'); g1.label = 'Collection de base'; GSONGS.forEach(d=>add(g1, 'b:'+d.id, `${d.title} · ${d.level}`)); sel.appendChild(g1);
  if(GLIBS.length){ const g2 = document.createElement('optgroup'); g2.label = 'Mes tablatures'; GLIBS.forEach(e=>add(g2, 'f:'+e.name, e.name.replace(/\.\w+$/,''))); sel.appendChild(g2); }
  if([...sel.options].some(o=>o.value===cur)) sel.value = cur;
  $('gDel').hidden = !String(sel.value).startsWith('f:');
}
async function gSongOpen(id, track){
  gSongLeave();
  try{
    let parsed;
    if(id.startsWith('b:')){ const d = GSONGS.find(x=>'b:'+x.id===id); if(!d) throw new Error('morceau introuvable'); parsed = gParsedFromDef(d); GSG.info = d.info; }
    else{ const e = GLIBS.find(x=>'f:'+x.name===id); if(!e) throw new Error('fichier introuvable'); gfb('Lecture de '+e.name+'…', true); parsed = e.parsed || (e.parsed = await gParseEntry(e)); GSG.info = ''; }
    GSG.parsed = parsed; GSG.id = id; GC.song = id; gSave();
    const tr = $('gTrack'); tr.innerHTML = parsed.tracks.map((t,i)=>`<option value="${i}">${gEsc(t.name)}</option>`).join(''); tr.hidden = parsed.tracks.length<2;
    $('gLib').value = id; $('gDel').hidden = !id.startsWith('f:');
    gSongUse(Math.max(0, Math.min(track||0, parsed.tracks.length-1)));
    if(GSG.info) gfb(GSG.info, true);
  }catch(e){ console.error(e); gfb('Erreur : '+e.message, false); }
}
function gSongUse(i){
  const P = GSG.parsed; GC.track = i; $('gTrack').value = i;
  GSG.song = gMakeSong(P.tracks[i], {title:P.title || 'Sans titre'}); GSG.sidx = 0; GSG.loop = {a:null,b:null}; GSG.sys = []; GT.got = new Set();
  $('gLoop').textContent = 'Boucle'; $('gSongBpm').value = (GC.sbpm||{})[GSG.id] || P.tempo || 80; gRender();
}
function gSongEnter(){ gLibFill(); $('gSongHints').checked = GC.shints!==false; if(GSG.song) gRender(); else gSongOpen(GC.song || 'b:'+GSONGS[0].id, GC.track); }
async function gImport(files){
  let last = null;
  for(const f of files){
    try{
      const kind = gKind(f.name); if(!kind) throw new Error('format non reconnu (.gp, .gp5, .gpx, .mxl, .musicxml)');
      gfb('Import de '+f.name+'…', true);
      const e = {name:f.name, buf:await f.arrayBuffer(), kind}; e.parsed = await gParseEntry(e);          // on vérifie que le fichier est lisible avant de le garder
      GLIBS = GLIBS.filter(x=>x.name!==f.name); GLIBS.push(e); last = e;
      gdbOp('readwrite', s=>s.put({name:e.name, buf:e.buf})).catch(()=>{});
    }catch(err){ console.error(err); gfb(`Erreur ${f.name} : ${err.message}`, false); }
  }
  if(last){ gLibFill(); await gSongOpen('f:'+last.name); }
}

/* ---------- navigation, jeu ---------- */
const gStepOfBar = m => { const i = GSG.song.steps.findIndex(s=>s.bar>=m); return i<0 ? GSG.song.steps.length : i; };
const gCurBar = () => { const st = GSG.song && GSG.song.steps[GSG.sidx]; return st ? st.bar : (GSG.song ? GSG.song.bars.length-1 : 0); };
function gGoBar(m){ if(!GSG.song) return; gSongStop(); GSG.sidx = gStepOfBar(Math.max(0, Math.min(GSG.song.bars.length-1, m))); GT.got = new Set(); gRender(); }
function gAfterAdvance(){ const L = GSG.loop, st = GSG.song.steps[GSG.sidx]; if(L.a==null || L.b==null) return; if(!st || st.bar>L.b) GSG.sidx = gStepOfBar(L.a); }
function gSongClick(s,f){
  const sg = GSG.song, st = sg && sg.steps[GSG.sidx]; if(!st || GSG.listening) return;
  gSound(sg.tuning[s]+f, .8, 1400);
  const key = `${s}:${f}`, want = st.pos.map(p=>p.join(':'));
  if(want.includes(key)){ GT.got.add(key);
    if(want.every(k=>GT.got.has(k))){ gScore(true); GT.got = new Set(); GSG.sidx++; gAfterAdvance(); } }
  else{ GT.got = new Set(); gScore(false); gFlash(s, f, 'ko'); gfb(`Joué : ${gn(sg.tuning[s]+f)} — attendu : ${st.label}`, false); }
  gRender();
}
function gSongRender(){
  const sg = GSG.song, box = $('gTab');
  if(!sg){ box.innerHTML = '<p>Choisis un morceau, ou importe une tablature (.gp, .gp5, .gpx, .mxl, .musicxml).</p>'; $('gQuestion').innerHTML = ''; $('gInfo').textContent = ''; $('gBoard').innerHTML = ''; return; }
  const st = sg.steps[GSG.sidx], bar = gCurBar(), avail = Math.max(320, (box.clientWidth||700)-24);
  if(!GSG.sys.length || GSG.sysW!==avail || GSG.sysFor!==sg){ GSG.sys = gTabLayout(sg, avail); GSG.sysW = avail; GSG.sysFor = sg; }
  const k = Math.max(0, GSG.sys.findIndex(s=>s.bars.includes(bar)));
  box.innerHTML = [GSG.sys[k], GSG.sys[k+1]].filter(Boolean).map(s=>gTabSystemSVG(sg, s, {cur:st, loop:GSG.loop})).join('');
  $('gQuestion').innerHTML = st ? '' : '✔ Morceau terminé ! <button id="gAgain" class="btn" type="button">⟲ Recommencer</button>';
  $('gInfo').textContent = `${sg.title}${GSG.parsed.tracks.length>1 ? ' — '+sg.name : ''} — mesure ${bar+1}/${sg.bars.length}${GSG.loop.b!=null ? ` · boucle ${GSG.loop.a+1}→${GSG.loop.b+1}` : ''} · clique une mesure pour y aller`;
  $('gBoard').innerHTML = gBoardSVG(sg.nf, gMarks());
}
function gSongStop(){ GSG.timers.forEach(clearTimeout); GSG.timers = []; GSG.listening = false; $('gSongListen').textContent = '▶ Écouter'; }
function gSongListen(){
  if(GSG.listening) return gSongStop();
  const sg = GSG.song; if(!sg || !sg.steps.length) return;
  if(!sg.steps[GSG.sidx]) GSG.sidx = 0;
  const from = GSG.sidx, t0 = sg.steps[from].t, u = 60000/Math.max(30, Math.min(240, +$('gSongBpm').value||80))/4;   // u = ms par double-croche
  GSG.listening = true; $('gSongListen').textContent = '⏹ Stop'; GT.got = new Set();
  sg.steps.slice(from).forEach((st,k)=>GSG.timers.push(setTimeout(()=>{
    GSG.sidx = from+k;
    st.pos.slice().sort((a,b)=>a[0]-b[0]).forEach(([s,f],j)=>setTimeout(()=>{ gSound(sg.tuning[s]+f, .75, Math.max(300, st.dur*u*.95)); }, j*18));
    gRender(); }, (st.t-t0)*u)));
  const last = sg.steps[sg.steps.length-1];
  GSG.timers.push(setTimeout(()=>{ gSongStop(); GSG.sidx = from; gRender(); }, (last.t-t0+last.dur)*u+250));
}
let gmt = null;
function gMetro(){                                             // métronome : planification sur l'horloge audio (comme au piano)
  if(gmt){ clearInterval(gmt); gmt = null; $('gMetro').setAttribute('aria-pressed', false); return; }
  $('gMetro').setAttribute('aria-pressed', true);
  actx = actx || new (window.AudioContext||window.webkitAudioContext)(); actx.resume();
  let b = 0, next = actx.currentTime+.05;
  const bpm = () => Math.max(30, Math.min(240, +$('gSongBpm').value||80));
  const click = (t,hi) => { const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = hi ? 1200 : 800;
    g.gain.setValueAtTime(.2,t); g.gain.exponentialRampToValueAtTime(.0001,t+.05); o.connect(g).connect(actx.destination); o.start(t); o.stop(t+.06); };
  gmt = setInterval(()=>{ while(next < actx.currentTime+.15){ const n = (GSG.song && GSG.song.bars[gCurBar()] && GSG.song.bars[gCurBar()].ts[0]) || 4; click(next, b++%n===0); next += 60/bpm(); } }, 25);
}
function gSongLeave(){ gSongStop(); if(gmt) gMetro(); }        // quitter la page ou changer de mode : coupe l'écoute et le métronome

/* ---------- événements ---------- */
$('gLib').onchange = e => gSongOpen(e.target.value);
$('gTrack').onchange = e => { gSongStop(); gSongUse(+e.target.value); };
$('gFile').onchange = e => { gImport([...e.target.files]); e.target.value = ''; };
$('gDel').onclick = async () => {
  const id = $('gLib').value; if(!id.startsWith('f:') || !confirm('Supprimer cette tablature de ta bibliothèque ?')) return;
  const name = id.slice(2); gdbOp('readwrite', s=>s.delete(name)).catch(()=>{}); GLIBS = GLIBS.filter(x=>x.name!==name);
  GSG.song = null; GC.song = 'b:'+GSONGS[0].id; gLibFill(); await gSongOpen(GC.song);
};
$('gPrevM').onclick = () => gGoBar(gCurBar()-1);
$('gNextM').onclick = () => gGoBar(gCurBar()+1);
$('gRestart').onclick = () => gGoBar(0);
$('gLoop').onclick = () => { const m = gCurBar(), L = GSG.loop;
  if(L.a==null) L.a = m; else if(L.b==null){ if(m<L.a){ L.b = L.a; L.a = m; } else L.b = m; } else L.a = L.b = null;
  $('gLoop').textContent = L.a==null ? 'Boucle' : L.b==null ? `A=${L.a+1}, choisis B` : `${L.a+1}→${L.b+1}`; gRender(); };
$('gSongListen').onclick = gSongListen;
$('gMetro').onclick = gMetro;
$('gSongBpm').onchange = e => { const v = Math.max(30, Math.min(240, +e.target.value||80)); e.target.value = v; (GC.sbpm ||= {})[GSG.id] = v; gSave(); };
$('gSongHints').onchange = e => { GC.shints = e.target.checked; gSave(); gRender(); };
$('gTab').onclick = e => { const r = e.target.closest('[data-bar]'); if(r) gGoBar(+r.dataset.bar); };
$('gQuestion').onclick = e => { if(e.target.id==='gAgain') gGoBar(0); };
addEventListener('resize', () => { if(GC.mode==='song' && !$('guitarPage').hidden) gRender(); });
gdbOp('readonly', s=>s.getAll()).then(rows=>{ GLIBS = (rows||[]).filter(r=>gKind(r.name)).map(r=>({name:r.name, buf:r.buf, kind:gKind(r.name)})); gLibFill(); }).catch(()=>{});
gLibFill();
