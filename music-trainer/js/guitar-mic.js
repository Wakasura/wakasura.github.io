/* =====================================================================
   GUITARE — micro : accordeur, validation des notes et accords joués sur la vraie guitare
   Dépend de guitar-audio.js (détection), guitar.js (GT, GC, gRender…) et guitar-songs-ui.js (GSG).
   ===================================================================== */
const GM = {validate:false, tuner:false, on:false, stream:null, ctx:null, an:null, buf:null, timer:null, hist:[], armed:true, prevRms:0, freqs:[], lastSig:0};

async function gMicStart(){
  if(GM.on) return;
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('micro indisponible (navigateur ou page non sécurisée : utilise https ou localhost)');
  try{ GM.stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false, noiseSuppression:false, autoGainControl:false}}); }
  catch(e){ throw new Error(e && e.name==='NotAllowedError' ? 'accès au micro refusé (autorise-le dans le navigateur)' : 'micro introuvable'); }
  GM.ctx = new (window.AudioContext||window.webkitAudioContext)(); await GM.ctx.resume();
  GM.an = GM.ctx.createAnalyser(); GM.an.fftSize = 8192; GM.ctx.createMediaStreamSource(GM.stream).connect(GM.an);
  GM.buf = new Float32Array(GM.an.fftSize); GM.hist = []; GM.armed = true; GM.on = true;
  GM.timer = setInterval(() => { GM.an.getFloatTimeDomainData(GM.buf); gMicProcess(GM.buf, GM.ctx.sampleRate); }, 60);
}
function gMicStop(){
  clearInterval(GM.timer); GM.timer = null;
  if(GM.stream) GM.stream.getTracks().forEach(t=>t.stop());
  if(GM.ctx) GM.ctx.close().catch(()=>{});
  GM.stream = GM.ctx = GM.an = null; GM.on = GM.validate = GM.tuner = false; gMicUI();
}
const gMicWanted = () => { if(!GM.validate && !GM.tuner) gMicStop(); else gMicUI(); };
function gMicUI(){
  $('gMic').setAttribute('aria-pressed', !!GM.validate);
  if(!GM.validate) $('gHeard').hidden = true;
  if(GC.mode==='tuner') gTunerRender();
}

/* ---------- ce que le micro doit entendre ---------- */
const gPcsOf = (pos, tun) => [...new Set(pos.map(([s,f])=>(tun[s]+f)%12))];
function gMicExpect(){                                         // {pcs:[…]} : une note (1 classe de hauteur) ou un accord ; octave libre
  const m = GC.mode;
  if(m==='game' && GC.game==='find' && GT.q && !GT.lock) return {pcs:[GT.q.pc]};
  if(m==='game' && GC.game==='chord' && GT.chord && !GT.lock) return {pcs:GT.chord.pcs.slice()};
  if(m==='drill' && GT.ex){ const st = GT.ex.steps[GT.idx]; if(st) return {pcs:gPcsOf(st.pos, GS)}; }
  if(m==='song' && GSG.song && !GSG.listening){ const st = GSG.song.steps[GSG.sidx]; if(st) return {pcs:gPcsOf(st.pos, GSG.song.tuning)}; }
  return null;
}
function gMicAccept(){                                         // le micro a entendu ce qui était attendu : même effet qu'un clic juste
  const m = GC.mode;
  if(m==='game' && GC.game==='find'){ GT.lock = true; gScore(true); gfb('Correct ! (micro : seule la note est vérifiée, pas la corde)', true); setTimeout(gNext, 600); }
  else if(m==='game' && GC.game==='chord'){ GT.lock = true; if(!GT.cheat) gScore(true); gfb(`Correct ! ${GT.chord.sym}`, true); setTimeout(gNext, 1300); }
  else if(m==='drill'){ const ex = GT.ex; gScore(true); GT.idx++; GT.got = new Set(); gfb(GT.idx>=ex.steps.length ? 'Exercice terminé !' : 'Correct !', true); }
  else if(m==='song'){ gScore(true); GSG.sidx++; GT.got = new Set(); gAfterAdvance(); }
  gRender();
}
function gMicShow(info){
  if(!GM.validate) return; const el = $('gHeard'); el.hidden = false;
  el.textContent = info ? `Entendu : ${info.midi!=null ? gs(info.midi)+(Math.floor(info.midi/12)-1) : Math.round(info.freq)+' Hz'}` : 'Écoute…';
}

/* ---------- traitement d'une fenêtre audio (appelé toutes les 60 ms) ---------- */
function gMicProcess(buf, sr){
  const a4 = GC.a4 || 440, exp = GM.tuner ? null : gMicExpect();
  const a = gAnalyze(buf, sr, a4, !!(exp && exp.pcs.length>1)), rms = a.rms, rise = rms > GM.prevRms*1.5+.01;
  GM.prevRms = GM.prevRms*.6 + rms*.4;
  if(rms<.01){ GM.armed = true; GM.hist = []; if(GM.tuner) gTunerUpdate(null); else gMicShow(null); return; }   // silence
  if(rise && rms>.02){ GM.armed = true; GM.hist = []; }                                                       // nouvelle attaque
  const p = a.pitch && a.pitch.clarity>.85 ? a.pitch : null;
  if(GM.tuner){ gTunerUpdate(p ? p.freq : null); return; }
  let hm = null; if(p){ const mf = gHzMidi(p.freq, a4); if(Math.abs(mf-Math.round(mf))<.45) hm = Math.round(mf); }
  gMicShow(p ? {midi:hm, freq:p.freq} : null);
  if(!exp || !GM.armed) return;
  let ok;
  if(exp.pcs.length===1){ GM.hist.push(hm); GM.hist = GM.hist.slice(-3); ok = GM.hist.length===3 && GM.hist.every(x=>x!=null && ((x%12)+12)%12===exp.pcs[0]); }
  else{ GM.hist.push(gChordMatch(a.chroma, exp.pcs)); GM.hist = GM.hist.slice(-2); ok = GM.hist.length===2 && GM.hist.every(Boolean); }
  if(ok){ GM.armed = false; GM.hist = []; gMicAccept(); }
}

/* ---------- accordeur ---------- */
function gTunerRender(info){                                   // info : {name, oct, cents, freq, str} ou rien (attente)
  $('gQuestion').innerHTML = ''; $('gInfo').textContent = '';
  const idle = !info, c = idle ? 0 : Math.max(-50, Math.min(50, info.cents)), ok = !idle && Math.abs(info.cents)<=5;
  $('gTunerNote').textContent = idle ? '–' : info.name; $('gTunerOct').textContent = idle ? '' : info.oct;
  $('gNeedle').setAttribute('transform', `rotate(${c*.9} 150 140)`);
  $('gNeedle').setAttribute('class', 'gt-needle'+(idle ? ' idle' : ok ? ' good' : ''));
  $('gTunerCents').textContent = idle ? '' : (info.cents>0 ? '+' : '')+Math.round(info.cents)+' ¢';
  $('gTunerInfo').textContent = !GM.on ? 'Micro éteint : appuie sur « Activer le micro ».' : idle ? 'Pince une corde à vide…'
    : ok ? `Juste ✓ (${info.freq.toFixed(1)} Hz)` : info.cents<0 ? `Trop bas : serre la corde (${info.freq.toFixed(1)} Hz)` : `Trop haut : desserre la corde (${info.freq.toFixed(1)} Hz)`;
  document.querySelectorAll('#gTunerStrings button').forEach(b=>{ const k = b.dataset.s;
    b.setAttribute('aria-pressed', String(GC.tstr==null ? 'auto' : GC.tstr)===k); b.classList.toggle('near', !idle && info.str!=null && String(info.str)===k); });
  $('gA4').value = GC.a4 || 440; $('gTunerMic').textContent = GM.on ? 'Couper le micro' : 'Activer le micro';
}
function gTunerUpdate(freq){
  if(freq==null){ if(Date.now()-GM.lastSig>900){ GM.freqs = []; gTunerRender(); } return; }
  GM.lastSig = Date.now(); GM.freqs.push(freq); GM.freqs = GM.freqs.slice(-5);
  const f = GM.freqs.slice().sort((x,y)=>x-y)[GM.freqs.length>>1], a4 = GC.a4 || 440, sel = GC.tstr==null || GC.tstr==='auto' ? -1 : +GC.tstr;
  let mid, cents, str = -1, best = 1e9;
  GS.forEach((m,i)=>{ const c = Math.abs(gCents(f, gMidiHz(m,a4))); if(c<best){ best = c; if(c<50) str = i; } });
  if(sel>=0){ mid = GS[sel]; cents = gCents(f, gMidiHz(mid,a4)); str = sel; }
  else{ const mf = gHzMidi(f, a4); mid = Math.round(mf); cents = (mf-mid)*100; }
  gTunerRender({name:gs(mid), oct:Math.floor(mid/12)-1, cents, freq:f, str});
}
async function gTunerEnter(){ GM.tuner = true; GM.freqs = []; try{ await gMicStart(); }catch(e){ gfb('Erreur : '+e.message, false); } gTunerRender(); }
function gTunerLeave(){ if(GM.tuner){ GM.tuner = false; gMicWanted(); } }

/* ---------- événements ---------- */
$('gMic').onclick = async () => {
  if(GM.validate){ GM.validate = false; gMicWanted(); return; }
  try{ await gMicStart(); GM.validate = true; GM.armed = true; GM.hist = []; gMicShow(null); gMicUI(); }catch(e){ gfb('Erreur : '+e.message, false); }
};
$('gTunerMic').onclick = async () => { if(GM.on && GM.tuner){ GM.tuner = false; gMicWanted(); gTunerRender(); } else await gTunerEnter(); };
$('gTunerStrings').onclick = e => { const b = e.target.closest('button'); if(!b) return;
  GC.tstr = b.dataset.s==='auto' ? 'auto' : +b.dataset.s; gSave(); if(GC.tstr!=='auto') gSound(GS[GC.tstr], .8, 2000); GM.freqs = []; gTunerRender(); };
$('gA4').onchange = e => { GC.a4 = +e.target.value; gSave(); gTunerRender(); };
$('gSoundBtn').onclick = () => { GC.gsound = GC.gsound==='piano' ? 'pluck' : 'piano'; gSave(); $('gSoundBtn').textContent = 'Son guitare : '+(GC.gsound==='piano' ? 'piano' : 'corde pincée'); gSound(GS[1]+3, .8, 1500); };
$('gSoundBtn').textContent = 'Son guitare : '+(GC.gsound==='piano' ? 'piano' : 'corde pincée');
