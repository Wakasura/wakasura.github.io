/* =====================================================
   ÉTAT + LOGIQUE
   ===================================================== */
/* État global (tout est ici ; champs ajoutés à la volée : q, quizT, lap, reps, ui, drill, noStaff, listening)
   mode : 'game'|'partition' · ui : 'game'|'partition'|'drill' · cur : note MIDI du jeu · lo/hi : plage du jeu
   pLo/pHi : plage du clavier en partition · raw : pas de lecture · steps : pas filtrés par main
   idx : pas courant · measures : modèle de mesures · loop : {a,b} · hit : zones cliquables · q : question de quiz */
const S = {mode:'game', cur:60, streak:0, best:0, err:{}, snd:true, solfege:false, labels:false, corr:false, acc:true, clef:'both',
  lo:48, hi:84, pLo:21, pHi:108, raw:[], steps:[], idx:0, pressed:new Set(), measures:[], hasBass:false, title:'',
  hand:0, loop:{a:null,b:null}, si:-1, hit:[], W:800};
try{ Object.assign(S, JSON.parse(localStorage.getItem('pt')||'{}')); }catch(e){}
const persist = () => { try{ localStorage.setItem('pt', JSON.stringify({best:S.best, err:S.err, snd:S.snd, solfege:S.solfege, lo:S.lo, hi:S.hi, clef:S.clef, acc:S.acc, labels:S.labels, count:S.count, gameType:S.gameType, chordSet:S.chordSet, chordInv:S.chordInv, chordKey:S.chordKey, chordDeg:S.chordDeg, chordShow:S.chordShow, theme:S.theme, hand:S.hand, corr:S.corr, bpms:S.bpms, lastMode:S.lastMode, lastScore:S.lastScore,
    ex:{x:$('exo').value, v:$('variant').value, t:$('tonic').value, r:$('reps').value}})); }catch(e){} };
let LIB = [];

/* ---------- jeu des accords ---------- */
/* orthographe musicale : chaque note de l'accord garde sa lettre (tierce = lettre +2, quinte = +4, septième = +6)
   -> C♯m = Do♯ – Mi – Sol♯ ; E♭dim = Mi♭ – Sol♭ – Si♭♭ ; B♭7 = Si♭ – Ré – Fa – La♭ */
const CACC = {'-2':'♭♭','-1':'♭','0':'','1':'♯','2':'♯♯'};
const cfr = n => FR[LET.indexOf(n.step)] + CACC[n.alter], csy = n => n.step + CACC[n.alter];     // « Mi♭ » / « E♭ »
const pcName = (pc,fl) => (fl ? ['Do','Ré♭','Ré','Mi♭','Mi','Fa','Sol♭','Sol','La♭','La','Si♭','Si'] : ['Do','Do♯','Ré','Ré♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'])[pc];
/* fondamentales usuelles (indice = classe de hauteur) : D♭ E♭ F♯ A♭ B♭ pour les accords majeurs, augmentés et de septième ;
   C♯ E♭ F♯ G♯ B♭ pour les accords mineurs et diminués */
const R_MAJ = [['C',0],['D',-1],['D',0],['E',-1],['E',0],['F',0],['F',1],['G',0],['A',-1],['A',0],['B',-1],['B',0]];
const R_MIN = [['C',0],['C',1],['D',0],['E',-1],['E',0],['F',0],['F',1],['G',0],['G',1],['A',0],['B',-1],['B',0]];
const CT = {maj:{o:[0,4,7], n:'majeur', s:'', R:R_MAJ}, min:{o:[0,3,7], n:'mineur', s:'m', R:R_MIN}, dim:{o:[0,3,6], n:'diminué', s:'dim', R:R_MIN},
  aug:{o:[0,4,8], n:'augmenté', s:'aug', R:R_MAJ}, dom7:{o:[0,4,7,10], n:'septième', s:'7', R:R_MAJ}};
const INV = ['position fondamentale','1er renversement','2ᵉ renversement','3ᵉ renversement'];
function voice(pcs, k){                                        // notes de l'accord en partant de la basse voulue, vers l'aigu
  const o = pcs.slice(k).concat(pcs.slice(0,k)); let m = 60+o[0]; const out = [m];
  o.slice(1).forEach(pc=>{ m += ((pc-m%12)+12)%12 || 12; out.push(m); }); return out;
}
const DEGN = ['I','ii','iii','IV','V','vi','vii°'], DEGSETS = {all:[0,1,2,3,4,5,6], main:[0,3,4], pop:[0,3,4,5]};
function newChord(){
  const im = S.chordInv || 'free', ki = /^\d+$/.test(S.chordKey) ? +S.chordKey : -1, prev = S.chord;
  let t, notes, dg = null, keyName = null;
  if(ki>=0 && KX[ki]){                                           // accords diatoniques d'une tonalité majeure (orthographe de la gamme)
    const K = KX[ki], set = DEGSETS[S.chordDeg] || DEGSETS.all; let d, n = 0;
    do{ d = set[Math.floor(Math.random()*set.length)]; n++; } while(n<30 && set.length>1 && prev && prev.dg===DEGN[d] && prev.keyName===K[0]+' majeur');
    notes = [0,2,4].map(j=>deg(K,d+j));
    t = {'4,7':'maj', '3,7':'min', '3,6':'dim'}[[notes[1].midi-notes[0].midi, notes[2].midi-notes[0].midi]];
    dg = DEGN[d]; keyName = K[0]+' majeur';
  } else {                                                       // toutes tonalités : fondamentales usuelles
    const set = {mm:['maj','min'], maj:['maj'], min:['min'], all:['maj','min','dim','aug','dom7']}[S.chordSet] || ['maj','min'];
    let r, n = 0;
    do{ r = Math.floor(Math.random()*12); t = set[Math.floor(Math.random()*set.length)]; n++; }
    while(n<60 && ((!S.acc && [1,3,6,8,10].includes(r)) || (prev && prev.r===r && prev.t===t)));
    const li = LET.indexOf(CT[t].R[r][0]);
    notes = CT[t].o.map((o,i)=>spell(60+r+o, li+[0,2,4,6][i]));
  }
  const T = CT[t], pcs = notes.map(x=>x.midi%12);
  const k = im==='free' || im==='root' ? 0 : im==='rand' ? Math.floor(Math.random()*pcs.length) : Math.min(+im, pcs.length-1);
  const label = cfr(notes[0])+' '+T.n;
  S.chord = {r:pcs[0], t, pcs, k, bass: im==='free' ? null : pcs[k], voicing:voice(pcs,k), id:((prev?.id)||0)+1,
    label, sym:csy(notes[0])+T.s, dg, keyName, ask: S.chordShow==='deg' && dg ? `${dg} en ${keyName}` : label,
    inv: im==='free' ? '' : INV[k], names:notes.map(cfr), bassName:cfr(notes[k]), flats:notes.some(x=>x.alter<0)};
  S.pressed.clear();
}
const playChord = () => S.chord?.voicing.forEach(m=>playNote(m,.7,1500));
function newNote(){
  const pool = [];
  for(let m=S.lo;m<=S.hi;m++){
    if(m===S.cur || (!S.acc && NAMES[m%12].includes('#')) || (S.clef==='treble' && m<60) || (S.clef==='bass' && m>=60)) continue;
    pool.push(m);
  }
  if(!pool.length){ S.cur = 60; return; }
  const w = pool.map(m=>1+2*(S.err[m]||0));                                  // les notes ratées reviennent plus souvent
  let r = Math.random()*w.reduce((a,b)=>a+b,0);
  for(let i=0;i<pool.length;i++){ r -= w[i]; if(r<=0){ S.cur = pool[i]; return; } }
  S.cur = pool[pool.length-1];
}
const expected = () => S.quiz ? [] : S.mode==='game' ? (S.gameType==='chord' ? (S.chord?.voicing||[]) : [S.cur]) : (S.steps[S.idx]?.midis || []);
const stepOf = m => { const i = S.steps.findIndex(s=>s.m>=m); return i<0 ? Math.max(0,S.steps.length-1) : i; };
function applyHand(keepM){
  S.rev = (S.rev||0)+1;
  S.steps = S.raw.map(s=>({...s, midis:[...new Set(s.notes.filter(n=>!S.hand||n.staff===S.hand).map(n=>n.midi))]})).filter(s=>s.midis.length);
  S.idx = keepM==null ? 0 : stepOf(keepM); S.pressed.clear();
}
function goMeasure(m){ stopListen(); S.lap = 0; S.idx = stepOf(Math.max(0,Math.min(S.measures.length-1,m))); S.pressed.clear(); draw(); }
function afterAdvance(){
  if(!S.steps[S.idx] && loopable()){ S.lap++; if(!S.reps || S.lap<S.reps){ S.idx = 0; S.pressed.clear(); } return; }   // exercice répété
  const L = S.loop; if(L.a==null || L.b==null) return;
  const c = S.steps[S.idx]; if(!c || c.m>L.b) S.idx = stepOf(L.a);
}

function press(m, vel=.8, dur=1000){
  if(S.snd) playNote(m,vel,dur);
  const exp = expected(); if(!exp.length) return;
  if(S.mode==='game' && S.gameType==='chord'){                               // jeu des accords : octave et renversement libres
    const C = S.chord;
    if(!C.pcs.includes(m%12)){ S.pressed.clear(); if(!S.corr) S.streak = 0; persist();
      feedback(`Joué : ${pcName(m%12, C.flats)} — absent de ${C.ask}`, false); flash(m); return draw(); }
    S.pressed.add(m);
    if(new Set([...S.pressed].map(x=>x%12)).size===C.pcs.length){
      if(C.bass!=null && Math.min(...S.pressed)%12!==C.bass){                // renversement imposé : la note la plus grave compte
        S.pressed.clear(); if(!S.corr) S.streak = 0; persist();
        feedback(`${C.inv} : la note la plus grave doit être ${C.bassName}`, false); return draw(); }
      if(!S.corr){ S.streak++; S.best = Math.max(S.best,S.streak); }
      persist(); feedback(`Correct ! ${C.sym} : ${C.names.join(' – ')}`, true); newChord();
    }
    return draw();
  }
  let ok;
  if(S.mode==='game'){
    ok = m===S.cur;
    if(ok){ S.err[m] = Math.max(0,(S.err[m]||0)-.5); newNote(); } else S.err[S.cur] = (S.err[S.cur]||0)+1;
    if(S.ear) setTimeout(()=>playNote(S.cur,.8,1200),500);
  } else if(exp.includes(m)){ ok = true; S.pressed.add(m);
    if(S.pressed.size===exp.length){ S.pressed.clear(); S.idx++; afterAdvance(); } }
  else { ok = false; S.pressed.clear(); }
  if(!S.corr){ if(ok){ S.streak++; S.best = Math.max(S.best,S.streak); } else S.streak = 0; }
  persist(); feedback(ok ? 'Correct !' : 'Joué : '+midiName(m), ok);
  if(!ok) flash(m);
  draw();
}

/* ---------- son : piano échantillonné (Tone.js) avec repli oscillateur ---------- */
let actx, samp;
function playNote(m, vel=.8, dur=1000, when){
  if(dur===Infinity) sustained.delete(m);                                  // touche rejouée pendant la pédale
  if(window.Tone){
    Tone.start();
    if(!samp) samp = new Tone.Sampler({urls:{A1:'A1.mp3',C2:'C2.mp3',A2:'A2.mp3',C3:'C3.mp3',A3:'A3.mp3',C4:'C4.mp3',A4:'A4.mp3',C5:'C5.mp3',A5:'A5.mp3',C6:'C6.mp3',A6:'A6.mp3',C7:'C7.mp3'},
      baseUrl:'https://tonejs.github.io/audio/salamander/', release:1, onload:()=>feedback('Sons de piano chargés',true), onerror:()=>feedback('Échantillons indisponibles : son simplifié',false)}).toDestination();
    if(samp.loaded){ const n = Tone.Frequency(m,'midi').toNote();
      dur===Infinity ? samp.triggerAttack(n,undefined,vel) : samp.triggerAttackRelease(n,dur/1000,when,vel); return; }
  }
  actx = actx || new (window.AudioContext||window.webkitAudioContext)();
  const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime, L = Math.min(dur,1500)/1000;
  o.type='triangle'; o.frequency.value = 440*Math.pow(2,(m-69)/12);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.4*vel,t+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001,t+L);
  o.connect(g).connect(actx.destination); o.start(t); o.stop(t+L+.05);
}
/* pédale de sustain (MIDI CC64) : les notes relâchées pendant la pédale sont retenues jusqu'à son relâchement */
const sustained = new Set(); let pedal = false;
function offNote(m){ if(samp?.loaded) try{ samp.triggerRelease(Tone.Frequency(m,'midi').toNote()); }catch(e){} }
function releaseNote(m){ if(pedal) sustained.add(m); else offNote(m); }
function setPedal(on){ pedal = on; if(!on){ sustained.forEach(offNote); sustained.clear(); } }
let clkSynth; const clickSynth = () => clkSynth ||= new Tone.Synth({oscillator:{type:'square'}, envelope:{attack:.001, decay:.05, sustain:0, release:.01}, volume:-14}).toDestination();

/* ---------- écouter + métronome ---------- */
const tempo = () => Math.max(30, Math.min(240, +$('bpm').value||80));
let mt = null;
/* écoute : Tone.Transport (horloge audio précise, tempo modifiable en direct) */
function stopListen(){ if(window.Tone){ Tone.Transport.stop(); Tone.Transport.cancel(); } S.listening = false; $('listen').textContent = '▶ Écouter'; }
async function listen(){
  if(S.listening) return stopListen();
  const cur = S.steps[S.idx]; if(S.mode!=='partition' || !cur || !window.Tone) return;
  const T = Tone.Transport, u = 60/tempo()/4, rs = S.raw.filter(s=>s.t>=cur.t);   // u = secondes par double-croche
  S.listening = true; $('listen').textContent = '⏹ Stop';
  await Tone.start(); if(!S.listening) return;
  T.stop(); T.cancel(); T.bpm.value = tempo(); T.seconds = 0;
  const nb = S.count ? (S.measures[cur.m]?.ts[0]||4) : 0, cd = nb*4*u;           // décompte : une mesure de clics avant la musique
  for(let i=0;i<nb;i++) T.schedule(time=>{ clickSynth().triggerAttackRelease(i===0?'E6':'A5', .05, time);
    Tone.Draw.schedule(()=>{ if(S.listening) feedback(String(i+1), true); }, time); }, i*4*u);
  rs.forEach(s=>T.schedule(time=>{
    s.notes.forEach(n=>playNote(n.midi,.7,n.dur*u*950,time));
    Tone.Draw.schedule(()=>{ if(!S.listening) return; const i = S.steps.findIndex(x=>x.t>=s.t); if(i>=0) S.idx = i; draw(); }, time);
  }, (s.t-cur.t)*u + cd));
  T.schedule(time=>Tone.Draw.schedule(stopListen,time), (rs[rs.length-1].t-cur.t)*u + cd + .9);
  T.start();
}
function metro(){                                            // planification à l'avance sur l'horloge audio : pas de dérive
  if(mt){ clearInterval(mt); mt = null; $('metro').setAttribute('aria-pressed',false); return; }
  $('metro').setAttribute('aria-pressed',true);
  actx = actx || new (window.AudioContext||window.webkitAudioContext)(); actx.resume();
  let b = 0, next = actx.currentTime + .05;
  const click = (t,hi) => { const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = hi ? 1200 : 800; g.gain.setValueAtTime(.2,t); g.gain.exponentialRampToValueAtTime(.0001,t+.05);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t+.06); };
  mt = setInterval(()=>{ while(next < actx.currentTime + .15){
    const n = S.measures[S.steps[S.idx]?.m]?.ts[0]||4; click(next, b++%n===0); next += 60/tempo(); } }, 25);
}
