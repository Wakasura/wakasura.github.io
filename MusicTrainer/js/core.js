/* =====================================================================
   PIANO TRAINER — organisation des fichiers (scripts classiques, chargés dans cet ordre,
   ils partagent le même espace global : S, $, etc.)
     js/theory-data.js  texte HTML des leçons + banque de questions des quiz
     js/core.js         constantes, utilitaires, import MusicXML (zip -> modèle)
     js/game.js         état global S, logique de jeu, son, écoute, métronome
     js/render.js       affichage VexFlow / OSMD, clavier à l'écran
     js/ui.js           bibliothèque (IndexedDB), réglages, modes, navigation
     js/theory-ui.js    pages de théorie : sommaire, leçons, mini-quiz, boutons d'écoute
     js/exercises.js    exercices générés (gammes, accords, cadences, intervalles, armures)
     js/app.js          entraînement lié à la théorie, clavier PC, MIDI, démarrage
   Le rendu est isolé dans drawGame / drawPartition / drawQ : c'est là
   qu'on brancherait un autre moteur (ex. Verovio) sans toucher au reste.
   ===================================================================== */
const {Renderer, Stave, StaveNote, Voice, Formatter, Accidental, StaveConnector, Beam, StaveTie, Fraction} = Vex.Flow;
const $ = id => document.getElementById(id);

/* ---------- constantes ---------- */
const NAMES = ['c','c#','d','d#','e','f','f#','g','g#','a','a#','b'];
const SOL = ['Do','Do#','Ré','Ré#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];
const STEP = {C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const KEYS = ['Cb','Gb','Db','Ab','Eb','Bb','F','C','G','D','A','E','B','F#','C#'];
const ACC = {'-2':'bb','-1':'b','0':'','1':'#','2':'##'};
const DURS = [[0.5,'32'],[1,'16'],[2,'8'],[3,'8d'],[4,'q'],[6,'qd'],[8,'h'],[12,'hd'],[16,'w']]; // unités = doubles-croches
const MUSICXML_DURS = {whole:'w',half:'h',quarter:'q',eighth:'8','16th':'16','32nd':'32','64th':'64','128th':'128','256th':'256'};
const snap = d => DURS.reduce((a,b)=>Math.abs(b[0]-d)<Math.abs(a[0]-d)?b:a)[1];
const midiKey = m => `${NAMES[m%12]}/${Math.floor(m/12)-1}`;
const midiName = m => (S.solfege ? SOL[m%12] : NAMES[m%12].toUpperCase()) + (Math.floor(m/12)-1);
const r3 = x => Math.round(x*1000)/1000;

/* =====================================================
   IMPORT MXL (zip -> MusicXML -> structure), parties, voix, reprises
   ===================================================== */
async function bufToXml(name, buf){
  if(!/\.mxl$/i.test(name)) return new TextDecoder().decode(buf);
  const zip = await JSZip.loadAsync(buf); let path = null; const c = zip.file('META-INF/container.xml');
  if(c){ const d = new DOMParser().parseFromString(await c.async('string'),'text/xml'); path = d.querySelector('rootfile')?.getAttribute('full-path'); }
  if(!path) path = Object.keys(zip.files).find(n=>/\.(xml|musicxml)$/i.test(n) && !n.startsWith('META-INF'));
  if(!path) throw new Error('aucun MusicXML dans le .mxl');
  return zip.file(path).async('string');
}
async function scoreFrom(name, buf){
  const sc = parseMusicXML(await bufToXml(name,buf), name.replace(/\.\w+$/,''));
  return Object.assign(sc,{fname:name, buf});
}

function toPartwise(doc){                                   // score-timewise -> score-partwise
  const tw = doc.querySelector('score-timewise'); if(!tw) return doc;
  const out = new DOMParser().parseFromString('<score-partwise/>','text/xml'), root = out.documentElement, parts = {};
  [...tw.children].filter(e=>e.tagName!=='measure').forEach(e=>root.appendChild(out.importNode(e,true)));
  tw.querySelectorAll(':scope > measure').forEach(m=>m.querySelectorAll(':scope > part').forEach(p=>{
    const id = p.getAttribute('id'); let P = parts[id];
    if(!P){ P = parts[id] = out.createElement('part'); P.setAttribute('id',id); root.appendChild(P); }
    const me = out.createElement('measure'); [...m.attributes].forEach(a=>me.setAttribute(a.name,a.value));
    [...p.childNodes].forEach(c=>me.appendChild(out.importNode(c,true))); P.appendChild(me);
  }));
  return out;
}
function parseMusicXML(xml, fb, sel){
  let doc = new DOMParser().parseFromString(xml,'text/xml');
  if(doc.querySelector('parsererror')) throw new Error('XML invalide');
  doc = toPartwise(doc);
  const all = [...doc.querySelectorAll('score-partwise > part')];
  if(!all.length) throw new Error('format non supporté (score-partwise attendu)');
  const names = [...doc.querySelectorAll('part-list > score-part')].map((p,i)=>p.querySelector('part-name')?.textContent||'Partie '+(i+1));
  sel = sel || (all.length<=2 ? all.map((_,i)=>i) : [0]);
  const txt = (el,q) => el.querySelector(q)?.textContent, measures = []; let staffBase = 0, tempo = 0;

  sel.map(i=>all[i]).forEach((part,pi)=>{
    let div=1, nSt=1, pos=0, last=0, end1=false;
    [...part.children].filter(e=>e.tagName==='measure').forEach((me,mi)=>{
      const M = measures[mi] ||= {events:[], clefs:{}, ts:null, key:null}; pos = last = 0;
      const bars = [...me.querySelectorAll('barline')];                       // reprises + 1res fins
      bars.forEach(b=>{ const e=b.querySelector('ending'); if(e?.getAttribute('type')==='start') end1=(e.getAttribute('number')||'').split(/[\s,]+/).includes('1'); });
      M.end1 = end1;
      bars.forEach(b=>{ const e=b.querySelector('ending'), r=b.querySelector('repeat');
        if(['stop','discontinue'].includes(e?.getAttribute('type'))) end1=false;
        if(r) M[r.getAttribute('direction')==='forward'?'repF':'repB'] = true; });
      for(const el of me.children){
        const tg = el.tagName;
        if(tg==='attributes'){
          if(txt(el,'divisions')) div = +txt(el,'divisions');
          if(txt(el,'staves')) nSt = +txt(el,'staves');
          if(txt(el,'time beats')) M.ts = [+txt(el,'time beats'), +txt(el,'time beat-type')];
          if(txt(el,'key fifths')) M.key = +txt(el,'key fifths');
          el.querySelectorAll('clef').forEach(c=>{ M.clefs[staffBase+(+c.getAttribute('number')||1)] = txt(c,'sign')==='F'?'bass':'treble'; });
        } else if(tg==='direction' || tg==='sound'){
          const t = tg==='sound' ? el : el.querySelector('sound[tempo]');
          if(t?.getAttribute('tempo') && !tempo) tempo = Math.round(+t.getAttribute('tempo'));
        } else if(tg==='backup') pos -= +txt(el,'duration');
        else if(tg==='forward') pos += +txt(el,'duration');
        else if(tg==='note'){
          if(el.querySelector('grace')) continue;
          const d = +txt(el,'duration')||0, chord = !!el.querySelector('chord');
          const start = chord ? last : pos; if(!chord){ last = pos; pos += d; }
          const ev = {off:r3(start*4/div), dur:r3(d*4/div), staff:staffBase+(+txt(el,'staff')||1), voice:txt(el,'voice')||'1',
            notation:txt(el,'type'), dots:el.querySelectorAll('dot').length, tm:!!el.querySelector('time-modification'),
            beams:[...el.querySelectorAll('beam')].map(b=>({number:+b.getAttribute('number')||1, value:b.textContent.trim()}))};
          if(el.querySelector('rest')) ev.type='rest';
          else {
            const step = txt(el,'pitch step'), alter = Math.round(+txt(el,'pitch alter')||0), oct = +txt(el,'pitch octave');
            Object.assign(ev,{type:'note',step,alter,oct,midi:(oct+1)*12+STEP[step]+alter, tie:!!el.querySelector('tie[type="stop"]')});
          }
          M.events.push(ev);
        }
      }
    });
    if(pi===0) staffBase = nSt;
  });

  let ts=[4,4], key=0, cl={1:'treble',2:'bass'};
  measures.forEach((M,i)=>{
    const nts = M.ts||ts, nk = M.key ?? key;
    M.tsChg = i>0 && nts.join()!==ts.join(); M.keyChg = i>0 && nk!==key; M.clefChg = {};
    for(const s of [1,2]){ const c = M.clefs[s]||cl[s]; M.clefChg[s] = i>0 && c!==cl[s]; cl[s]=c; }
    ts = M.ts = nts; key = M.key = nk; M.clefs = {...cl}; M.len = ts[0]*16/ts[1];
    M.events = M.events.filter(e=>e.staff<=2);
    const end = Math.max(0,...M.events.map(e=>e.off+e.dur));
    M.real = i===0 && end>0 && end<M.len ? end : M.len;                      // mesure d'anacrouse
    M.slots = {};                                                             // une suite de notes par voix
    for(const s of [1,2]){
      const vs = [...new Set(M.events.filter(e=>e.staff===s).map(e=>e.voice))].sort();
      M.slots[s] = (vs.length?vs:['1']).map(v=>buildSlots(M,s,v));
    }
    M.n = Math.max(...[1,2].flatMap(s=>M.slots[s].map(a=>a.length)));
  });
  const hasBass = measures.some(M=>M.events.some(e=>e.staff===2));

  const order = playOrder(measures), steps = []; let base = 0;                // reprises dépliées
  order.forEach(mi=>{
    const M = measures[mi], ns = M.events.filter(e=>e.type==='note' && !e.tie);
    [...new Set(ns.map(e=>e.off))].sort((a,b)=>a-b).forEach(o=>steps.push({m:mi, off:o, t:base+o,
      notes:ns.filter(e=>e.off===o).map(e=>({midi:e.midi, staff:e.staff, dur:e.dur}))}));
    base += M.real;
  });
  if(!steps.length) throw new Error('aucune note trouvée');
  return {title:txt(doc,'work-title')||txt(doc,'movement-title')||fb, measures, steps, hasBass, tempo, names, sel, xml};
}

function playOrder(ms){
  const o = []; let i=0, st=0, j=false;
  while(i<ms.length){
    const M = ms[i];
    if(M.end1 && j){ i++; continue; }
    if(M.repF){ if(i!==st) j=false; st=i; }
    o.push(i);
    if(M.repB){ if(!j){ j=true; i=st; continue; } j=false; }
    i++;
  }
  return o;
}

function buildSlots(M, st, v){
  const evs = M.events.filter(e=>e.staff===st && e.voice===v), out = [];
  const offs = [...new Set(evs.map(e=>e.off))].sort((a,b)=>a-b);
  if(!offs.length || offs[0]>0) out.push({off:0, dur:offs.length?offs[0]:M.len, rest:true, notes:[]});   // (bug corrigé : notes:[])
  offs.forEach((o,i)=>{
    const g = evs.filter(e=>e.off===o), nx = i+1<offs.length ? offs[i+1] : M.len;
    const notes = g.filter(e=>e.type==='note');
    const sh = g.reduce((a,b)=>b.dur<a.dur?b:a);              // l'événement le plus court donne la figure
    out.push({off:o, dur:Math.max(0.5,Math.min(sh.dur, nx-o)), notes, rest:!notes.length,
      notation:sh.notation, dots:sh.dots||0, tm:!!sh.tm});
  });
  out.v = v; return out;
}
