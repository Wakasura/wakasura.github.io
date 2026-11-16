document.querySelector('#theoryPage .theory').innerHTML = THEORY_HTML;   // leçons : voir theory-data.js
const theorySections = [...document.querySelectorAll('#theoryPage .theory > section')];
let currentTheory = 0;
function addTheoryClef(svg, clef){
  const holder = document.createElement('div');
  const renderer = new Renderer(holder, Renderer.Backends.SVG);
  renderer.resize(100,150);
  new Stave(10,20,80).addClef(clef).setContext(renderer.getContext()).draw();
  const source = [...holder.querySelectorAll('path')]
    .sort((a,b)=>b.getAttribute('d').length-a.getAttribute('d').length)[0];
  if(!source) throw new Error(`Impossible de dessiner la clé ${clef}`);
  const glyph = source.cloneNode();
  glyph.classList.add('staff-note');
  glyph.setAttribute('aria-hidden','true');
  if(clef==='bass') glyph.setAttribute('transform','translate(0 -20)');
  svg.querySelector('.staff-lines').after(glyph);
}
addTheoryClef(document.querySelector('#theoryPage svg[aria-labelledby^="trebleTitle"]'),'treble');
addTheoryClef(document.querySelector('#theoryPage svg[aria-labelledby^="bassTitle"]'),'bass');
function showTheoryIndex(){
  $('theoryIndex').hidden = false;
  $('theoryLessonNav').hidden = true;
  $('theoryIndex').className = 'theory-index';
  theorySections.forEach(section=>section.hidden=true);
}
function openTheorySection(index){
  currentTheory = index;
  $('theoryIndex').hidden = true;
  $('theoryLessonNav').hidden = false;
  theorySections.forEach((section,i)=>section.hidden=i!==index);
  $('theoryPrev').disabled = index===0;
  $('theoryNext').disabled = index===theorySections.length-1;
  window.scrollTo(0,0);
}
let TQ = {}; try{ TQ = JSON.parse(localStorage.getItem('ptq')||'{}'); }catch(e){}
const badges = [];
function badge(i){ if(badges[i]) badges[i].textContent = TQ[i]!=null ? `✓ Quiz : ${TQ[i]}/${QN}` : ''; }
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; };
const drawQuiz = i => shuffle(TQUIZ[i]).slice(0,QN).map(([q,opts,why])=>{          // tirage + mélange des réponses
  const o = shuffle(opts.map((t,k)=>({t, ok:k===0}))); return [q, o.map(x=>x.t), o.findIndex(x=>x.ok), why]; });
function theoryQuiz(sec,i){                                    // mini-quiz en fin de leçon
  if(!TQUIZ[i]) return;
  const box = document.createElement('div'); box.className = 'example tquiz'; sec.appendChild(box);
  let qs = drawQuiz(i), k = 0, score = 0;
  const show = () => {
    box.textContent = '';
    if(k>=qs.length){
      TQ[i] = Math.max(TQ[i]||0,score); try{ localStorage.setItem('ptq',JSON.stringify(TQ)); }catch(e){} badge(i);
      const b = document.createElement('b'); b.textContent = `Quiz terminé : ${score}/${qs.length} `;
      const r = document.createElement('button'); r.textContent = 'Nouveau quiz'; r.onclick = () => { qs = drawQuiz(i); k = 0; score = 0; show(); };
      box.append(b,r); return;
    }
    const [q,opts,good,why] = qs[k], h = document.createElement('b'), t = document.createElement('p'), row = document.createElement('div');
    h.textContent = `Quiz ${k+1}/${qs.length}`; t.textContent = q; row.className = 'ans-grid';
    opts.forEach((o,j)=>{ const b = document.createElement('button'); b.textContent = o; b.onclick = () => {
      [...row.children].forEach((x,n)=>{ x.disabled = true; if(n===good) x.classList.add('ok'); else if(n===j) x.classList.add('ko'); });
      if(j===good) score++;
      const f = document.createElement('p'), nx = document.createElement('button');
      f.textContent = (j===good ? 'Correct. ' : 'Pas tout à fait. ')+why; nx.className = 'btn'; nx.textContent = k+1<qs.length ? 'Suivant ▶' : 'Terminer'; nx.onclick = () => { k++; show(); };
      box.append(f,nx); }; row.appendChild(b); });
    box.append(h,t,row);
  };
  show();
}
document.addEventListener('click', e=>{                        // boutons « écouter » des leçons : data-play, data-vel, data-gap, data-dur, data-chord
  const b = e.target.closest('[data-play],[data-seq]'); if(!b) return;
  const play = b.closest('#gTheoryPage') && typeof gSound==='function' ? gSound : playNote;        // leçons de guitare : son de guitare
  if(b.dataset.seq){ const gap = +b.dataset.gap||900, dur = +b.dataset.dur||gap*.95;               // data-seq : accords séparés par |, notes par ,
    b.dataset.seq.split('|').forEach((g,i)=>g.split(',').forEach(m=>setTimeout(()=>play(+m,.7,dur), i*gap))); return; }
  const ms = b.dataset.play.split(',').map(Number), vs = (b.dataset.vel||'.7').split(',').map(Number), gap = +b.dataset.gap||450, dur = +b.dataset.dur||gap*1.6;
  ms.forEach((m,i)=>setTimeout(()=>play(m, vs[i]??vs[0], dur), b.dataset.chord ? 0 : i*gap));
});
theorySections.forEach((section,index)=>{
  const heading = section.querySelector('h2').textContent;
  const summary = section.dataset.summary || section.querySelector('p')?.textContent.trim() || '';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theory-topic';
  const title = document.createElement('strong');
  title.textContent = heading;
  const description = document.createElement('span');
  description.textContent = summary.length>115 ? summary.slice(0,112)+'…' : summary;
  const bd = document.createElement('em'); badges[index] = bd; badge(index); button.append(title,description,bd); theoryQuiz(section,index);
  button.addEventListener('click',()=>openTheorySection(index));
  $('theoryIndex').appendChild(button);
});
$('theoryBack').onclick = showTheoryIndex;
$('theoryPrev').onclick = () => { if(currentTheory>0) openTheorySection(currentTheory-1); };
$('theoryNext').onclick = () => { if(currentTheory<theorySections.length-1) openTheorySection(currentTheory+1); };
showTheoryIndex();
