/* =====================================================================
   GUITARE — audio : son de guitare (corde pincée synthétisée), détection de hauteur (YIN),
   reconnaissance d'accords (chromagramme). Fonctions pures, testables sans navigateur.
   ===================================================================== */
const gMidiHz = (m, a4=440) => a4*Math.pow(2, (m-69)/12);
const gHzMidi = (f, a4=440) => 69+12*Math.log2(f/a4);
const gCents = (f, target) => ((1200*Math.log2(f/target)+600)%1200+1200)%1200-600;       // écart en cents, replié sur ±600 (erreurs d'octave)
function gRms(b){ let s = 0; for(let i=0;i<b.length;i++) s += b[i]*b[i]; return Math.sqrt(s/b.length); }

/* YIN : fréquence fondamentale d'un son (buf = échantillons, sr = fréquence d'échantillonnage). Retourne {freq, clarity} ou null. */
function gYin(buf, sr, fmin=60, fmax=1200){
  const half = buf.length>>1, tauMax = Math.min(half-1, Math.floor(sr/fmin)), tauMin = Math.max(2, Math.floor(sr/fmax));
  const cm = new Float32Array(tauMax+2); cm[0] = 1; let run = 0;
  for(let tau=1; tau<=tauMax; tau++){ let sum = 0; for(let i=0;i<half;i++){ const x = buf[i]-buf[i+tau]; sum += x*x; }
    run += sum; cm[tau] = sum*tau/(run||1); }
  let tau = -1;
  for(let t=tauMin; t<tauMax; t++) if(cm[t]<.15){ while(t+1<tauMax && cm[t+1]<cm[t]) t++; tau = t; break; }
  if(tau<0){ let m = 1, mt = -1; for(let t=tauMin; t<tauMax; t++) if(cm[t]<m){ m = cm[t]; mt = t; } if(mt<0 || m>.3) return null; tau = mt; }
  const a = cm[tau-1], b = cm[tau], c = cm[tau+1], den = a-2*b+c, t = tau + (den ? (a-c)/(2*den) : 0);
  return {freq:sr/t, clarity:1-cm[tau]};
}

/* FFT (taille puissance de 2, fenêtre de Hann) -> spectre d'amplitude */
function gFFTmag(x){
  const N = x.length, re = new Float32Array(N), im = new Float32Array(N);
  for(let i=0;i<N;i++) re[i] = x[i]*(.5-.5*Math.cos(2*Math.PI*i/(N-1)));
  for(let i=1,j=0;i<N;i++){ let bit = N>>1; for(; j&bit; bit>>=1) j ^= bit; j ^= bit; if(i<j){ const t = re[i]; re[i] = re[j]; re[j] = t; } }
  for(let len=2; len<=N; len<<=1){ const ang = -2*Math.PI/len, wr = Math.cos(ang), wi = Math.sin(ang), h = len>>1;
    for(let i=0;i<N;i+=len){ let cr = 1, ci = 0;
      for(let k=0;k<h;k++){ const a = i+k, b = a+h, vr = re[b]*cr-im[b]*ci, vi = re[b]*ci+im[b]*cr;
        re[b] = re[a]-vr; im[b] = im[a]-vi; re[a] += vr; im[a] += vi; const n = cr*wr-ci*wi; ci = cr*wi+ci*wr; cr = n; } } }
  const mag = new Float32Array(N>>1); for(let i=0;i<mag.length;i++) mag[i] = Math.hypot(re[i], im[i]); return mag;
}
/* Chromagramme : énergie des pics du spectre (75–1000 Hz) répartie sur les 12 classes de hauteur */
function gChroma(buf, sr, a4=440){
  const mag = gFFTmag(buf), df = sr/buf.length, ch = new Float32Array(12); let mx = 0;
  for(let i=0;i<mag.length;i++) if(mag[i]>mx) mx = mag[i];
  if(mx<1e-6) return ch;
  for(let i=Math.max(2, Math.floor(75/df)); i<Math.min(mag.length-2, Math.ceil(1000/df)); i++){
    const m = mag[i]; if(m<.08*mx || m<mag[i-1] || m<mag[i+1] || m<mag[i-2] || m<mag[i+2]) continue;
    const den = mag[i-1]-2*m+mag[i+1], f = (i + (den ? .5*(mag[i-1]-mag[i+1])/den : 0))*df, mid = gHzMidi(f, a4), r = Math.round(mid);
    if(Math.abs(mid-r)>.35) continue;                                          // pic entre deux notes : ignoré
    ch[((r%12)+12)%12] += m; }
  return ch;
}
/* L'accord attendu (liste de classes de hauteur) est-il entendu ? */
function gChordMatch(ch, pcs){
  let tot = 0, on = 0, mn = 1e9, mxc = 0; for(let i=0;i<12;i++) tot += ch[i];
  if(tot<=0) return false;
  pcs.forEach(p=>{ on += ch[p]; mn = Math.min(mn, ch[p]); mxc = Math.max(mxc, ch[p]); });
  return on/tot>=.78 && mn>=.12*mxc;
}
function gAnalyze(buf, sr, a4=440, wantChroma=false){            // buf : au moins 4096 échantillons (8192 pour les accords)
  const y = buf.subarray(buf.length-4096);
  return {rms:gRms(y), pitch:gYin(y, sr), chroma:wantChroma ? gChroma(buf, sr, a4) : null};
}

/* Son de guitare : corde pincée (Karplus-Strong, Tone.PluckSynth), huit voix en rotation ; faux = Tone indisponible */
let gPluck = [], gPi = 0;
function gGuitarNote(m, vel=.8, when){
  if(!window.Tone || !Tone.PluckSynth) return false;
  try{
    Tone.start();
    if(!gPluck.length) for(let i=0;i<8;i++) gPluck.push(new Tone.PluckSynth({attackNoise:1.5, dampening:3200, resonance:.986}).toDestination());
    const v = gPluck[gPi++ % gPluck.length]; v.volume.value = -14 + 14*vel;
    v.triggerAttack(Tone.Frequency(m,'midi').toFrequency(), when); return true;
  }catch(e){ return false; }
}
