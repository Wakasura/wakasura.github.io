/* =====================================================
   AFFICHAGE (VexFlow)
   ===================================================== */
function newCtx(w,h){
  $('score').innerHTML='';
  const r = new Renderer($('score'), Renderer.Backends.SVG); r.resize(w,h); return r.getContext();
}
function drawChord(){                                         // jeu des accords : le nom, et les notes déjà trouvées
  if(!S.chord) newChord();
  const C = S.chord, got = new Set([...S.pressed].map(x=>x%12)), dots = C.pcs.map(pc=>got.has(pc)?'●':'○').join(' ');
  const p = document.createElement('p'), mk = (txt,css)=>{ const e = document.createElement('div'); e.textContent = txt; e.style.cssText = css; p.appendChild(e); };
  const byDeg = S.chordShow==='deg' && C.dg;                                // « V en Do majeur » au lieu du nom
  mk(byDeg ? C.dg : C.label, 'font:700 42px/1.2 Newsreader,Georgia,serif;color:#15181d');
  mk(byDeg ? 'en '+C.keyName : C.sym, 'font:600 24px/1.4 Figtree,system-ui,sans-serif;color:#4a505b');
  if(C.dg && !byDeg) mk(`${C.dg} en ${C.keyName}`, 'font:600 18px/1.4 Figtree,system-ui,sans-serif;color:#2d5bb0');
  if(C.inv) mk(C.inv, 'font:600 20px/1.4 Figtree,system-ui,sans-serif;color:#2d5bb0');
  mk(dots, 'font-size:26px;letter-spacing:.25em;color:#2d5bb0;margin-top:6px');
  p.style.margin = 0; $('score').textContent = ''; $('score').appendChild(p);
}
function drawGame(){
  if(S.gameType==='chord') return drawChord();
  const W = Math.max(300, Math.min($('score').clientWidth-10, 480)), ctx = newCtx(W,330);
  const tr = new Stave(30,50,W-40).addClef('treble').setContext(ctx).draw();
  const ba = new Stave(30,170,W-40).addClef('bass').setContext(ctx).draw();
  new StaveConnector(tr,ba).setType('brace').setContext(ctx).draw();
  new StaveConnector(tr,ba).setType('singleLeft').setContext(ctx).draw();
  const bassNote = S.cur<60, n = new StaveNote({keys:[midiKey(S.cur)], duration:'q', clef:bassNote?'bass':'treble'});
  if(NAMES[S.cur%12].includes('#')) n.addModifier(0,new Accidental('#'));
  if(!S.ear) Formatter.FormatAndDraw(ctx, bassNote?ba:tr, [n]);
}

const BASEU = {w:16,h:8,q:4,'8':2,'16':1,'32':.5,'64':.25};
function glyphOf(s){                                  // figure + points, cohérents avec la durée réelle
  const nd = MUSICXML_DURS[s.notation], nk = Number.isInteger(s.dots) ? s.dots : 0;
  if(nd && (s.tm || !(nd in BASEU) || Math.abs(BASEU[nd]*(2-Math.pow(2,-nk))-s.dur)<.01)) return {d:nd, k:nk};
  for(const d in BASEU) for(let k=0;k<3;k++) if(Math.abs(BASEU[d]*(2-Math.pow(2,-k))-s.dur)<.01) return {d, k};
  if(nd) return {d:nd, k:nk};
  const f = snap(s.dur); return {d:f.replace('d',''), k:f.includes('d')?1:0};
}
function mkSlot(s, clef, hot, dir){
  const {d,k} = glyphOf(s), notes = s.rest ? [] : [...s.notes].sort((a,b)=>a.midi-b.midi);
  const keys = s.rest ? [clef==='bass'?'d/3':'b/4'] : notes.map(e=>e.step.toLowerCase()+(ACC[e.alter]??'')+'/'+e.oct);
  const o = {keys, duration:d+'d'.repeat(k)+(s.rest?'r':''), clef};
  if(dir) o.stem_direction = dir; else o.auto_stem = true;                    // hampes automatiques / par voix
  const n = new StaveNote(o);
  for(let i=0;i<k;i++) n.addDotToAll();
  const std = BASEU[d]*(2-Math.pow(2,-k));                                    // durée normale de la figure
  if(!(std>0) || Math.abs(std-s.dur)>.01) n.setIntrinsicTicks(Math.round(s.dur*1024)); // nolets / durées atypiques seulement
  notes.forEach((e,i)=>{ const c = e.tie ? '#999' : hot ? '#d22' : null; if(c) n.setKeyStyle(i,{fillStyle:c,strokeStyle:c}); });
  return n;
}

function layout(avail){
  const pages = []; let ms=[], ws=[], sum=0;
  const flush = () => { if(ms.length){ const k=Math.max(1,avail/sum); pages.push({ms, w:ws.map(w=>w*k)}); ms=[]; ws=[]; sum=0; } };
  S.measures.forEach((M,i)=>{
    if(S.single) flush();
    const all = [1,2].flatMap(s=>M.slots[s].flat()), nDot = Math.max(0,...[1,2].flatMap(s=>M.slots[s].map(a=>a.filter(x=>x.dots>0).length)));
    const minD = Math.max(1,Math.min(16,...all.map(x=>x.dur)));
    let w = Math.max(56 + 32*M.n, 50 + 32*Math.min(M.real/minD,16)) + 26*nDot; const extra = 60 + 12*Math.abs(M.key) + 34;
    if(sum + w + (ms.length?0:extra) > avail) flush();
    if(!ms.length) w += extra;
    ms.push(i); ws.push(w); sum += w;
  });
  flush(); return pages;
}



function drawPartition(){
  const sc = $('score'); S.hit = [];
  if(!S.measures.length){ sc.innerHTML = '<p>Importe un fichier <b>.mxl</b> (bouton ci-dessus ou glisser-déposer sur la page).</p>'; return; }
  const cur = S.steps[S.idx];
  if(S.noStaff && cur){ sc.innerHTML = '<p style="font-size:26px;font-weight:700">'+cur.label+'</p>'; return; }
  if(!cur){ sc.innerHTML = '<p>Partition terminée ! <button id="again">⟲ Recommencer</button></p>'; $('again').onclick = () => S.drill && /^(int|key)$/.test($('exo').value) ? regen() : goMeasure(0); return; }
  const pages = layout(Math.max(1,sc.clientWidth-36));
  const page = pages.find(p=>p.ms.includes(cur.m)), W = S.W = page.w.reduce((a,b)=>a+b,0)+20, H = S.hasBass ? 330 : 180;
  const ctx = newCtx(W,H), groups = [], active = new Map(), draws = [], fixed = new WeakSet(), lastN = new Map(), ties = [];
  let x = 10;
  page.ms.forEach((mi,k)=>{
    const M = S.measures[mi], w = page.w[k], first = k===0, KEY = KEYS[M.key+7];
    const sts = [new Stave(x,50,w)]; if(S.hasBass) sts.push(new Stave(x,170,w));
    sts.forEach((st,si)=>{
      if(first || M.clefChg[si+1]) st.addClef(M.clefs[si+1]);
      if(first || M.keyChg) st.addKeySignature(KEY);
      if(first || M.tsChg) st.addTimeSignature(`${M.ts[0]}/${M.ts[1]}`);
      st.setContext(ctx).draw();
    });
    if(S.hasBass && first) ['brace','singleLeft'].forEach(t=>new StaveConnector(sts[0],sts[1]).setType(t).setContext(ctx).draw());
    S.hit.push({x0:x, x1:x+w, mi});
    const vs = [];
    sts.forEach((st,si)=>{
      const staff = si+1, multi = M.slots[staff].length>1;
      M.slots[staff].forEach((slots,vi)=>{                                   // une Voice VexFlow par voix MusicXML
        const tk = slots.map(s=>{
          const note = mkSlot(s, M.clefs[staff], mi===cur.m && s.off===cur.off && !s.rest, multi ? (vi===0?1:-1) : 0);
          if(multi) fixed.add(note);
          const markers = new Map();
          s.notes.forEach(e=>e.beams.forEach(b=>{ if(b.number===1) markers.set(e.voice,b.value); }));
          markers.forEach((val,voice)=>{
            const id = `${staff}:${voice}`;
            if(val==='begin'){ const p = active.get(id); if(p?.length>1) groups.push(p); active.set(id,[note]); }
            else if(val==='continue' || val==='end'){
              const g = active.get(id)||[]; if(g[g.length-1]!==note) g.push(note);
              if(val==='end'){ if(g.length>1) groups.push(g); active.delete(id); } else active.set(id,g);
            }
          });
          if(!s.rest) [...s.notes].sort((a,b)=>a.midi-b.midi).forEach((e,i)=>{   // liaisons (y compris entre mesures)
            const key = `${staff}:${slots.v}:${e.midi}`, p = lastN.get(key);
            if(e.tie && p) ties.push(new StaveTie({first_note:p.n, last_note:note, first_indices:[p.i], last_indices:[i]}));
            lastN.set(key,{n:note,i});
          });
          return note;
        });
        const v = new Voice({num_beats:M.len, beat_value:16}).setStrict(false).addTickables(tk);
        Accidental.applyAccidentals([v], KEY); vs.push({v, st});
      });
    });
    const f = new Formatter(); vs.forEach(o=>f.joinVoices([o.v]));
    f.format(vs.map(o=>o.v), sts[0].getNoteEndX()-sts[0].getNoteStartX()-14);
    draws.push(...vs); x += w;
  });
  active.forEach(g=>{ if(g.length>1) groups.push(g); });
  const beams = groups.map(g=>new Beam(g, !fixed.has(g[0])));
  draws.forEach(o=>o.v.draw(ctx,o.st)); beams.forEach(b=>b.setContext(ctx).draw());
  ties.forEach(t=>{ try{ t.setContext(ctx).draw(); }catch(e){} });
}

/* ---------- partitions importées : OpenSheetMusicDisplay (repli automatique sur VexFlow si échec) ---------- */
const osmdActive = () => S.ui==='partition' && !S.quiz && S.measures.length>0 && !!window.opensheetmusicdisplay && !!LIB[S.si] && !LIB[S.si].noOsmd;
function osmdPositions(o){                                    // positions du curseur : {m: mesure, o: décalage en rondes depuis le début de la mesure}
  const c = o.cursor, pos = [], first = {}; c.reset();
  const it = () => c.Iterator || c.iterator;                    // reset() recrée l'itérateur : toujours relire
  for(let n=0; !it().EndReached && n<50000; n++){ const i = it();
    pos.push({m:i.CurrentMeasureIndex, t:(i.CurrentSourceTimestamp||i.currentTimeStamp).RealValue}); c.next(); }
  c.reset(); pos.forEach(p=>{ if(first[p.m]==null) first[p.m] = p.t; p.o = p.t-first[p.m]; }); return pos;
}
/* vue « partition complète » : pages A4 portrait (OSMD pageFormat), une page à l'écran, navigation page par page */
function updPage(){
  const O = S.osmdP, box = $('score'); if(!O?.pgs?.length || !S.full) return;
  const y = box.getBoundingClientRect().top + box.clientHeight/2;
  let i = O.pgs.findIndex(x=>{ const q = x.getBoundingClientRect(); return y>=q.top && y<q.bottom; }); if(i<0) i = 0;
  O.cur = i; $('pgInfo').textContent = `Page ${i+1}/${O.pgs.length}`;
}
const pageTop = (O,i) => O.pgs[i].getBoundingClientRect().top - $('score').getBoundingClientRect().top + $('score').scrollTop;
function gotoPage(d){ const O = S.osmdP; if(!O?.pgs?.length) return; const i = Math.max(0,Math.min(O.pgs.length-1,(O.cur||0)+d)); $('score').scrollTo({top:pageTop(O,i), behavior:'smooth'}); }
function pagedView(O, el, box){
  O.pgs = [...O.div.querySelectorAll('svg')].filter(x=>x.getBoundingClientRect().height>100);
  box.style.overflowY = 'auto'; box.style.maxHeight = ''; box.style.scrollSnapType = 'y mandatory';
  O.pgs.forEach(x=>{ x.style.boxShadow = '0 0 0 1px #b8bcc4'; x.style.scrollSnapAlign = 'start'; });
  if(O.pgs.length) box.style.height = Math.round(O.pgs[0].getBoundingClientRect().height+2)+'px';
  if(el){ const r = el.getBoundingClientRect(), cy = r.top+r.height/2;           // la page change toute seule quand le curseur change de page
    const i = O.pgs.findIndex(x=>{ const q = x.getBoundingClientRect(); return cy>=q.top && cy<q.bottom; });
    if(i>=0 && i!==O.page){ O.page = i; box.scrollTo({top:pageTop(O,i), behavior:'smooth'}); } }
  updPage();
}
$('score').addEventListener('scroll', updPage);
$('pgPrev').onclick = () => gotoPage(-1); $('pgNext').onclick = () => gotoPage(1);

async function drawOsmd(){
  const sc = LIB[S.si], box = $('score'), paged = S.full && !sc.noPaged, slot = paged ? 'osmdP' : 'osmd';
  const pw = paged ? Math.max(420, Math.min(box.clientWidth-24, Math.floor(innerHeight*.88/1.4142))) : 0;
  const key = sc.fname+'|'+sc.sel+'|'+(paged ? 'P'+pw : box.clientWidth);
  $('pageNav').hidden = !paged;
  if(S[slot]?.key!==key){
    if(S.osmdBusy===key) return; S.osmdBusy = key; box.innerHTML = '<p>Mise en page de la partition…</p>'; box.style.height = '';
    try{
      await new Promise(r=>setTimeout(r,50));                     // laisse le message s'afficher avant le calcul
      const div = document.createElement('div'); if(paged){ div.style.width = pw+'px'; div.style.margin = '0 auto'; }
      const o = new opensheetmusicdisplay.OpenSheetMusicDisplay(div,{autoResize:false, drawTitle:false, drawPartNames:false, followCursor:false,
        ...(paged ? {pageFormat:'A4 P', pageBackgroundColor:'#FFFFFF', newSystemFromXML:true, newPageFromXML:true} : {})});
      await o.load(sc.xml); if(S.osmdBusy!==key) return;
      if(paged) o.zoom = Math.min(1, pw/794);                      // page réduite = même échelle qu'une vraie A4 (794 px) : même nombre de mesures par ligne
      o.Sheet.Instruments.forEach((ins,i)=>{ ins.Visible = sc.sel.includes(i); });
      div.style.opacity = '0'; div.style.transition = 'opacity .4s'; box.innerHTML = ''; box.appendChild(div); await o.render(); o.cursor.show(); requestAnimationFrame(()=>{ div.style.opacity = '1'; });
      S[slot] = {key, o, div, pos:osmdPositions(o), k:0};
    }catch(err){ console.error('OSMD',err); if(paged) sc.noPaged = true; else sc.noOsmd = true; S[slot] = null; S.osmdBusy = null; S.sig = ''; feedback('Affichage simplifié',false); return draw(); }
    S.osmdBusy = null;
  }
  const O = S[slot]; if(O.div.parentNode!==box){ box.innerHTML = ''; box.appendChild(O.div); }
  const {o,pos} = O, c = o.cursor, cur = S.steps[S.idx];
  if(!cur){ c.hide(); feedback('Partition terminée !',true); return; }
  let k = -1, best = 1e9; pos.forEach((p,i)=>{ if(p.m===cur.m && Math.abs(p.o-cur.off/16)<best){ best = Math.abs(p.o-cur.off/16); k = i; } });
  if(k<0) return; c.show();
  if(k!==O.k){ if(k<O.k){ c.reset(); O.k = 0; } while(O.k<k){ c.next(); O.k++; } }
  const el = c.cursorElement; if(!paged) box.style.scrollSnapType = '';
  if(paged) pagedView(O,el,box);
  else if(S.full){ box.style.height = ''; box.style.maxHeight = '85vh'; box.style.overflowY = 'auto'; el?.scrollIntoView?.({block:'nearest', behavior:'smooth'}); }
  else if(el){ box.style.maxHeight = ''; const h = el.getBoundingClientRect().height;      // cadre fixe : une seule ligne
    if(h>20){ O.hmax = Math.max(O.hmax||0,h); box.style.height = Math.round(O.hmax+90)+'px'; }
    box.style.overflowY = 'hidden'; box.scrollTo({top:Math.max(0, el.getBoundingClientRect().top-box.getBoundingClientRect().top+box.scrollTop-40), behavior:'smooth'}); }
}
$('score').addEventListener('click', e=>{                      // clic sur une mesure (OSMD : unités de 10 px)
  if(!osmdActive() || !S.osmd || S.full) return;
  const svg = S.osmd.div.querySelector('svg'); if(!svg) return;
  const r = svg.getBoundingClientRect(), k = (svg.width.baseVal.value||r.width)/r.width/10, x = (e.clientX-r.left)*k, y = (e.clientY-r.top)*k;
  let hit = -1;
  try{ S.osmd.o.GraphicSheet.MeasureList.forEach((row,mi)=>row.forEach(g=>{ if(!g) return; const a = g.PositionAndShape.AbsolutePosition, z = g.PositionAndShape.Size;
    if(x>=a.x && x<=a.x+z.width && y>=a.y-2 && y<=a.y+z.height+2) hit = mi; })); }catch(err){}
  if(hit>=0) goMeasure(hit);
});

function draw(){
  const osmd = osmdActive(), q = S.quiz && S.q;                              // la portée ne dépend que de ces valeurs : sinon on ne la redessine pas
  const sig = osmd ? null : JSON.stringify([S.ui,S.mode,S.cur,S.ear,S.idx,S.steps.length,S.measures.length,S.title,S.quiz,S.noStaff,S.hand,S.lap,S.rev,
    q ? [q.a.midi,q.b.midi,q.done,q.ok] : 0, S.gameType, S.chord?.id, S.mode==='game' && S.gameType==='chord' ? [...S.pressed].length : 0, $('score').clientWidth]);
  if(!osmd && S.full){ S.full = false; $('kbWrap').hidden = false; buildKeyboard(); }
  $('full').textContent = S.full ? 'Revenir au clavier' : 'Mes partitions';
  if(osmd) drawOsmd();
  else if(sig!==S.sig){ S.sig = sig; $('pageNav').hidden = true; $('score').style.scrollSnapType = ''; $('score').style.height = ''; $('score').style.maxHeight = ''; $('score').style.overflowY = '';
    try{ S.quiz ? drawQ() : S.mode==='game' ? drawGame() : drawPartition(); }
    catch(err){ console.error(err); S.sig = ''; $('score').innerHTML = '<p>Erreur d’affichage : '+err.message+'<br>Le clavier reste utilisable.</p>'; } }
  $('st').textContent = S.streak; $('bt').textContent = S.best;
  const L = S.loop, cm = S.steps[S.idx]?.m;
  $('info').textContent = S.mode==='partition' && S.measures.length
    ? `${S.title} — mesure ${(cm ?? S.measures.length-1)+1}/${S.measures.length}${L.b!=null?` · boucle ${L.a+1}→${L.b+1}`:''}${repInfo()}${S.drill ? (S.steps[S.idx]?.label ? ' · '+S.steps[S.idx].label : '') : ' · clique sur une mesure pour y aller'}` : '';
  if(S.quiz){ const q = S.q;
    $('info').textContent = q?.done && S.quizT!=='ear' ? `${q.ok?'Correct':'Incorrect'} : ${IVL[q.i][0]} (${frno(q.a)} → ${frno(q.b)})` : S.quizT==='ear' ? 'Intervalles à l’oreille' : 'Quel est cet intervalle ?'; }
  if(S.mode==='game' && S.ear) $('info').textContent = 'Écoute la note, puis joue-la sur le clavier.';
  if(S.mode==='game' && S.gameType==='chord') $('info').textContent = S.chord?.bass!=null ? 'Joue l’accord dans le renversement demandé : la note la plus grave compte (toutes octaves acceptées).' : 'Joue l’accord demandé : n’importe quelle octave, n’importe quel renversement.';
  document.querySelectorAll('.hint,.prs').forEach(e=>e.classList.remove('hint','prs'));
  S.pressed.forEach(m=>document.querySelector(`[data-m="${m}"]`)?.classList.add('prs'));
  if(S.corr) expected().forEach(m=>document.querySelector(`[data-m="${m}"]`)?.classList.add('hint'));
  if(S.mode==='partition') focusKeys(expected(), true);                 // en partition, le clavier suit les notes à jouer
}

/* ---------- clavier à l'écran ---------- */
function buildKeyboard(){
  if($('kbWrap').hidden) return;
  const lo = S.mode==='game' ? S.lo : S.pLo, hi = S.mode==='game' ? S.hi : S.pHi;
  const kb = $('kb'), wrap = $('kbWrap'); kb.innerHTML=''; let whites = 0;
  const whiteCount = Array.from({length:hi-lo+1},(_,i)=>lo+i).filter(m=>!NAMES[m%12].includes('#')).length;
  const styles = getComputedStyle(wrap), framePadding = parseFloat(styles.paddingLeft)+parseFloat(styles.paddingRight);
  const availableWidth = Math.max(0, wrap.parentElement.clientWidth-framePadding);
  const MINW = 26, full = 30*whiteCount;                          // touches ≥ 26 px : au-delà, le clavier défile
  const keyboardWidth = full<=availableWidth ? full : Math.max(availableWidth, MINW*whiteCount), ww = keyboardWidth/whiteCount, bw = ww*0.6;
  const scrolls = keyboardWidth>availableWidth+1; S.kbWW = ww; $('kbNav').hidden = !scrolls;
  wrap.style.width = `${Math.min(keyboardWidth,availableWidth)+framePadding}px`;
  kb.style.setProperty('--white-key-width',ww+'px'); kb.style.setProperty('--black-key-width',bw+'px');
  kb.style.width = keyboardWidth+'px';
  for(let m=lo;m<=hi;m++){
    const d = document.createElement('div'), black = NAMES[m%12].includes('#');
    d.dataset.m = m; d.className = black?'b':'w';
    if(black) d.style.left = (whites*ww-bw/2)+'px'; else whites++;
    if(S.labels && ww>=14) d.textContent = midiName(m);
    d.addEventListener('pointerdown', e=>{ e.preventDefault(); press(m); });
    kb.appendChild(d);
  }
  focusKeys(S.mode==='game' ? [60,72] : (expected().length ? expected() : [60]), false, true);
}
/* fait défiler le clavier pour montrer ces touches ; onlyIfHidden : seulement si elles sont hors de vue */
function focusKeys(ms, onlyIfHidden, instant){
  const sc = $('kbScroll'); if(!sc || sc.scrollWidth<=sc.clientWidth+1 || !ms.length) return;
  const els = ms.map(m=>document.querySelector(`#kb [data-m="${m}"]`)).filter(Boolean); if(!els.length) return;
  const a = Math.min(...els.map(e=>e.offsetLeft)), b = Math.max(...els.map(e=>e.offsetLeft+e.offsetWidth));
  if(onlyIfHidden && a>=sc.scrollLeft+8 && b<=sc.scrollLeft+sc.clientWidth-8) return;
  sc.scrollTo({left:Math.max(0,(a+b)/2-sc.clientWidth/2), behavior:instant?'auto':'smooth'});
}
function flash(m){ const k = document.querySelector(`[data-m="${m}"]`); if(!k) return; k.classList.add('hit'); setTimeout(()=>k.classList.remove('hit'),400); }
let fbT; function feedback(t,ok){ const f=$('fb'); f.textContent=t; f.style.color=ok?'var(--ok)':'var(--bad)'; clearTimeout(fbT); fbT = setTimeout(()=>f.textContent='',2000); }
