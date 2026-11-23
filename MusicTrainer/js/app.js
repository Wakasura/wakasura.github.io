/* ---------- entraînement lié à la théorie ---------- */
const PRESETS = [{r:'48,84'},{r:'48,84',c:'treble'},{r:'48,84',c:'bass'},{r:'36,96',x:'scale'},{r:'48,84',x:'chords'},{r:'48,84'},{r:'36,96',x:'scale'},{r:'48,84',x:'cad'},{r:'21,108'}];
theorySections.forEach((sec,i)=>{
  const b = document.createElement('button'); b.className = 'btn'; b.style.marginTop = '14px'; b.textContent = "S'entraîner";
  b.onclick = () => {
    const p = PRESETS[i] || PRESETS[0]; S.clef = p.c || 'both'; [S.lo,S.hi] = p.r.split(',').map(Number);
    $('range').value = p.r; $('clef').value = S.clef; newNote(); if(p.x){ $('exo').value = p.x; exoUI(); setMode('drill'); } else setMode('game'); showPage('trainer');
  };
  sec.appendChild(b);
});

/* ---------- clavier d'ordinateur ---------- */
const KM = 'awsedftgyhujkolp;'; let kbase = 60;
addEventListener('keydown', e=>{
  if(e.repeat || e.ctrlKey || e.metaKey || e.altKey || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || $('trainerPage').hidden) return;
  const k = e.key.toLowerCase();
  if(k==='z' || k==='x'){ kbase = Math.max(24, Math.min(96, kbase+(k==='x'?12:-12))); feedback('Clavier PC : a = '+midiName(kbase), true); return; }
  const i = KM.indexOf(k); if(i>=0){ e.preventDefault(); press(kbase+i,.8,Infinity); }
});
addEventListener('keyup', e=>{ const i = KM.indexOf(e.key.toLowerCase()); if(i>=0) releaseNote(kbase+i); });

/* ---------- MIDI (vélocité + note-off) ---------- */
$('midiBtn').onclick = async () => {
  try{
    const acc = await navigator.requestMIDIAccess(); let n = 0;
    acc.inputs.forEach(inp=>{ n++; inp.onmidimessage = ev=>{
      const [s,note,vel] = ev.data, c = s&0xF0;
      if(c===0x90 && vel>0) press(note, vel/127, Infinity); else if(c===0x80 || (c===0x90 && !vel)) releaseNote(note);
      /* CC64 = pédale de sustain */
      else if(c===0xB0 && note===64) setPedal(vel>=64); }; });
    feedback(n ? n+' clavier(s) MIDI connecté(s)' : 'Aucun clavier détecté', !!n);
  }catch(e){ feedback('MIDI indisponible (Chrome/Edge, page en https ou localhost)', false); }
};

/* ---------- démarrage ---------- */
let rt; window.addEventListener('resize', ()=>{ clearTimeout(rt); rt = setTimeout(()=>{ buildKeyboard(); draw(); },120); });
$('snd').checked = S.snd; $('solf').setAttribute('aria-pressed', S.solfege);
$('labels').setAttribute('aria-pressed', S.labels); $('acc').checked = S.acc; $('clef').value = S.clef; $('range').value = S.lo+','+S.hi;
const THEMES = ['auto','light','dark'], THL = {auto:'automatique', light:'clair', dark:'sombre'};
function applyTheme(){ const t = THEMES.includes(S.theme) ? S.theme : 'auto';
  t==='auto' ? document.documentElement.removeAttribute('data-theme') : document.documentElement.setAttribute('data-theme',t);
  $('theme').textContent = 'Thème : '+THL[t]; }
$('theme').onclick = () => { S.theme = THEMES[(THEMES.indexOf(S.theme||'auto')+1)%3]; applyTheme(); persist(); };
$('resetStats').onclick = () => { if(!confirm('Remettre à zéro le meilleur score et les notes ratées ?')) return;
  S.best = 0; S.streak = 0; S.err = {}; persist(); toggleMenu(false); draw(); feedback('Statistiques réinitialisées', true); };
applyTheme();
const SAVED = {m:S.lastMode, f:S.lastScore};                    // dernier mode / dernière partition
$('hand').value = S.hand||0; $('corr').setAttribute('aria-pressed', !!S.corr); $('countBtn').setAttribute('aria-pressed', !!S.count);
KX.forEach((k,i)=>{ const o = document.createElement('option'); o.value = i; o.textContent = k[0]+' majeur'; $('chordKey').appendChild(o); });
$('chordKey').value = S.chordKey || 'any'; $('chordDeg').value = S.chordDeg || 'all'; $('chordShow').value = S.chordShow || 'name';
$('chordSet').value = S.chordSet || 'mm'; $('chordInv').value = S.chordInv || 'free'; syncGameUI();
newNote(); setMode(SAVED.m==='drill' ? 'drill' : 'game');
dbOp('readonly',s=>s.getAll()).then(async rows=>{
  for(const r of rows||[]){ try{ LIB.push(await scoreFrom(r.name,r.buf)); }catch(e){} }
  refreshLib();
  if(SAVED.m==='partition'){ const i = LIB.findIndex(x=>x.fname===SAVED.f); if(i>=0) openScore(i); }
}).catch(()=>{});
