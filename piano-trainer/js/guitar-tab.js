/* =====================================================================
   GUITARE — dessin de la tablature (SVG, fonctions pures)
   Dépend de guitar-songs.js (gEsc). Les couleurs sont définies dans style.css (classes gtab-*).
   ===================================================================== */
const GTAB = {pps:14, minBar:120, left:38, LS:14, Y0:42, H:140};

function gTabLayout(song, avail){                              // répartit les mesures en lignes (systèmes) selon la largeur disponible
  const T = GTAB, sys = []; let cur = {bars:[], w:[]}, sum = 0;
  song.bars.forEach((b,i)=>{
    const w = Math.max(T.minBar, b.len*T.pps);
    if(cur.bars.length && sum+w > avail-T.left){ sys.push(cur); cur = {bars:[], w:[]}; sum = 0; }
    cur.bars.push(i); cur.w.push(w); sum += w; });
  if(cur.bars.length) sys.push(cur);
  sys.forEach((s,k)=>{ if(k===sys.length-1) return; const f = Math.min(1.6, (avail-T.left)/s.w.reduce((a,b)=>a+b,0)); if(f>1) s.w = s.w.map(w=>w*f); });
  return sys;
}

function gTabSystemSVG(song, sys, o={}){                       // o : {cur: étape courante, loop:{a,b}}
  const {LS, Y0, H, left} = GTAB, tot = sys.w.reduce((a,b)=>a+b,0), W = left+tot+12, cur = o.cur, L = o.loop || {};
  const yS = s => Y0+(5-s)*LS, yBot = Y0+5*LS, xs = []; let x = left; sys.w.forEach(w=>{ xs.push(x); x += w; });
  let h = `<svg class="gtab" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Tablature">`;
  sys.bars.forEach((bi,k)=>{ if(L.a!=null && bi>=L.a && (L.b==null ? bi===L.a : bi<=L.b)) h += `<rect class="gtab-loop" x="${xs[k]}" y="${Y0-30}" width="${sys.w[k]}" height="${5*LS+66}"/>`; });
  ['T','A','B'].forEach((c,i)=>{ h += `<text class="gtab-lbl" x="${left-14}" y="${Y0+LS*(1+i*1.5)+5}" text-anchor="middle">${c}</text>`; });
  for(let s=0;s<6;s++) h += `<line class="gtab-line" x1="${left}" y1="${yS(s)}" x2="${left+tot}" y2="${yS(s)}"/>`;
  xs.concat([left+tot]).forEach(bx=>{ h += `<line class="gtab-bl" x1="${bx}" y1="${Y0}" x2="${bx}" y2="${yBot}"/>`; });
  sys.bars.forEach((bi,k)=>{
    const b = song.bars[bi], x0 = xs[k], w = sys.w[k], base = song.starts[bi];
    h += `<rect class="gtab-bar" data-bar="${bi}" x="${x0}" y="${Y0-30}" width="${w}" height="${5*LS+66}"/><text class="gtab-mn" x="${x0+3}" y="${Y0-24}">${bi+1}</text>`;
    b.beats.forEach(be=>{
      const nx = x0 + 12 + (be.off/b.len)*(w-24);
      if(be.label) h += `<text class="gtab-ch" x="${nx}" y="${Y0-10}" text-anchor="middle">${gEsc(be.label)}</text>`;
      if(!be.pos.length) return;
      const act = !!cur && cur.bar===bi && cur.off===be.off, done = !cur || bi<cur.bar || (bi===cur.bar && be.off<cur.off);
      be.pos.forEach(([s,f])=>{ const t = String(f), tw = t.length*8+6, y = yS(s);
        h += act ? `<rect class="gtab-act" x="${nx-tw/2-1}" y="${y-8}" width="${tw+2}" height="16" rx="6"/>` : `<rect class="gtab-bg" x="${nx-tw/2}" y="${y-8}" width="${tw}" height="16"/>`;
        h += `<text class="gtab-num${act ? ' gtab-actnum' : done ? ' gtab-done' : ''}" x="${nx}" y="${y}">${t}</text>`; });
      const d = be.dur, st = act ? ' act' : '', y1 = yBot+10, y2 = yBot+30;                        // hampe, crochets et point : durée de la note
      if(d<16){ h += `<line class="gtab-stem${st}" x1="${nx}" y1="${y1}" x2="${nx}" y2="${y2}"/>`;
        if(d<=3) h += `<path class="gtab-stem${st}" d="M${nx} ${y2} q7 3 6 10"/>`;
        if(d<=1.5) h += `<path class="gtab-stem${st}" d="M${nx} ${y2-6} q7 3 6 10"/>`;
        if([3,6,12].includes(d)) h += `<circle class="gtab-dot${st}" cx="${nx+6}" cy="${y2-4}" r="1.7"/>`; }
    });
  });
  return h + '</svg>';
}
