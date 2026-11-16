/* Non-destructive presentation layer: no changes to lab calculations or saved work. */
(() => {
  'use strict';
  const el=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls||'';if(text)n.textContent=text;return n};
  let groupChoice='전체';
  function enhance(){
    const courses=document.querySelector('.v3-courses');
    if(courses&&!courses.querySelector('.ae-discovery')){
      const groups=[...courses.querySelectorAll('.v3-cgroup')];
      groups.forEach(g=>g.dataset.exploreGroup=g.querySelector('h3')?.textContent||'');
      const bar=el('div','ae-discovery');
      const intro=el('div','ae-discovery-intro');intro.append(el('span','ae-kicker','FIND YOUR PATH'),el('h3','','나에게 맞는 수학부터'),el('p','','영역을 좁혀 과정을 고르고, 그림을 움직이며 탐구해 보세요.'));
      const filters=el('div','ae-filters');filters.setAttribute('role','group');filters.setAttribute('aria-label','과정 영역 좁히기');
      const status=el('p','ae-result');status.setAttribute('role','status');
      const names=['전체',...groups.map(g=>g.dataset.exploreGroup).filter(Boolean)];
      if(!names.includes(groupChoice))groupChoice='전체';
      const apply=name=>{groupChoice=name;let count=0;groups.forEach(g=>{const show=name==='전체'||g.dataset.exploreGroup===name;g.hidden=!show;if(show)count+=g.querySelectorAll('a').length});filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.group===name)));status.textContent=`${name} · ${count}개 과정 표시`;};
      names.forEach((name,i)=>{const b=el('button','ae-filter',name);b.type='button';b.dataset.group=name;b.onclick=()=>apply(name);filters.append(b)});
      bar.append(intro,filters,status);courses.querySelector('.v3-sec-head').after(bar);apply(groupChoice);
      groups.forEach((g,i)=>{g.style.setProperty('--ae-accent',['#366fc0','#9564b4','#237f78','#bc693c'][i%4]);const heading=g.querySelector('h3');const count=el('span','ae-group-count',`${g.querySelectorAll('a').length} 과정`);heading?.append(count)});
    }
    const hero=document.querySelector('.v3-hero-main');
    if(hero&&!hero.querySelector('.ae-process')){
      const row=el('ol','ae-process');row.setAttribute('aria-label','탐구하는 방법');
      [['01','예측하기','어떻게 달라질까?'],['02','움직이기','조건을 직접 바꿔요'],['03','설명하기','발견한 이유를 기록해요']].forEach(([n,t,d])=>{const li=el('li');li.append(el('span','ae-step',n),el('b','',t),el('small','',d));row.append(li)});hero.append(row);
    }
    document.querySelectorAll('.v3-chips [data-filter]').forEach(b=>{const val=String(b.classList.contains('active'));if(b.getAttribute('aria-pressed')!==val)b.setAttribute('aria-pressed',val)});
    const count=document.querySelector('#count');if(count&&!count.hasAttribute('role')){count.setAttribute('role','status');count.setAttribute('aria-live','polite')}
  }
  let pending=false;const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhance()})};
  const start=()=>{enhance();const root=document.getElementById('lab-app');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
