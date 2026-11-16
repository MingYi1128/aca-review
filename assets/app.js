/* App shell: manifest-driven hash router (#/, #/lecture/<id>, #/lab, #/exam/<id>), markdown + math rendering.
   Content is never hard-coded here — it comes from content/manifest.json. */
window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'local'},
  startup:{typeset:false,ready(){MathJax.startup.defaultReady();window.__mjReady=true;(window.__mjQueue||[]).forEach(typeset);window.__mjQueue=[];}}};
function typeset(el){
  if(!el.isConnected){setTimeout(()=>typeset(el),0);return;}
  if(window.__mjReady){MathJax.typesetPromise([el]).catch(()=>{});}else{(window.__mjQueue=window.__mjQueue||[]).push(el);}
}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
/* Protect $...$ / $$...$$ from marked, then restore as MathJax delimiters. */
function md(src){
  const math=[];
  src=src.replace(/\$\$([\s\S]+?)\$\$/g,(m,t)=>{math.push([1,t]);return '@@M'+(math.length-1)+'@@';})
         .replace(/\$([^\$\n]+?)\$/g,(m,t)=>{math.push([0,t]);return '@@M'+(math.length-1)+'@@';});
  let html=window.marked?marked.parse(src,{gfm:true}):'<pre>'+esc(src)+'</pre>';
  html=html.replace(/@@M(\d+)@@/g,(m,k)=>{const [d,t]=math[+k];return d?'\\['+esc(t)+'\\]':'\\('+esc(t)+'\\)';});
  return html.replace(/<table>/g,'<div class="tw"><table>').replace(/<\/table>/g,'</table></div>');
}
function mdInto(el,src){el.classList.add('md');el.innerHTML=md(src);typeset(el);}

const App=(()=>{
  let M=null;const view=()=>document.getElementById('view');
  const cache={};
  const getText=async p=>{if(cache[p])return cache[p];const r=await fetch(p);if(!r.ok)throw new Error(p+' ('+r.status+')');return cache[p]=await r.text();};
  const link=(h,t)=>`<a href="${h}">${esc(t)}</a>`;

  function nav(route){
    const t=document.getElementById('tabs');t.innerHTML='';
    const items=[...M.lectures.map(l=>['#/lecture/'+l.id,l.tab||l.title]),['#/lab','互動演練'],...M.exams.map(e=>['#/exam/'+e.id,e.tab||e.title])];
    items.forEach(([h,l])=>{const a=document.createElement('a');a.className='tab';a.href=h;a.textContent=l;
      a.setAttribute('aria-selected',String(location.hash===h));t.appendChild(a);});
  }
  function home(v){
    v.innerHTML=`<div class="read"><div class="md"><h1>${esc(M.site.title)}</h1>
      <p>${esc(M.site.subtitle)}｜講義、互動演練、模擬考三合一。模擬考請限時、寫在紙上，寫完再打開解答。</p></div>
      <h2 class="sec">講義</h2><div class="cards">${M.lectures.map(l=>`<a class="hcard" href="#/lecture/${l.id}"><b>${esc(l.title)}</b><span>${esc(l.summary||'')}</span></a>`).join('')}</div>
      <h2 class="sec">互動演練</h2><div class="cards"><a class="hcard" href="#/lab"><b>演算法逐步演練</b><span>二元搜尋、插入排序、Big-O 驗算（另有選擇／快速排序）。</span></a></div>
      <h2 class="sec">模擬考</h2><div class="cards">${M.exams.map(e=>`<a class="hcard" href="#/exam/${e.id}"><b>${esc(e.title)}</b><span>建議 ${e.minutes} 分鐘${e.summary?'｜'+esc(e.summary):''}</span></a>`).join('')}</div></div>`;
  }
  async function lecture(v,l){
    const wrap=document.createElement('div');wrap.className='read';
    const toc=document.createElement('nav');toc.className='toc';const body=document.createElement('div');
    mdInto(body,await getText(l.file));
    body.querySelectorAll('h2').forEach(h=>{const a=document.createElement('a');a.href='#';
      a.textContent=h.textContent.replace(/（.*?）/g,'').slice(0,18);a.onclick=e=>{e.preventDefault();h.scrollIntoView({behavior:'smooth'});};toc.appendChild(a);});
    wrap.append(toc,body);v.appendChild(wrap);
  }
  async function exam(v,ex){
    const wrap=document.createElement('div');wrap.className='read';
    const head=document.createElement('div');head.className='exam-head';
    head.innerHTML=`<div class="row"><span class="timer">${ex.minutes}:00</span><button class="btn primary" data-a="s">開始計時</button><button class="btn" data-a="r">重設</button></div>
      <div style="font-size:13px;color:var(--muted)">建議 ${ex.minutes} 分鐘・寫在紙上・寫完再看解答</div>`;
    const paper=document.createElement('div');mdInto(paper,await getText(ex.file));
    const gate=document.createElement('div');gate.className='ans-gate';
    gate.innerHTML='<p>寫完了嗎？先自己對完一次再打開。</p><button class="btn primary">顯示解答</button>';
    const ans=document.createElement('div');ans.className='ans';ans.hidden=true;
    gate.querySelector('button').onclick=async()=>{if(!ans.innerHTML)mdInto(ans,await getText(ex.solution));ans.hidden=false;gate.hidden=true;};
    wrap.append(head,paper,gate,ans);v.appendChild(wrap);
    let left=ex.minutes*60,run=null;const tEl=head.querySelector('.timer'),sB=head.querySelector('[data-a=s]');
    const fmt=()=>{const a=Math.abs(left);tEl.textContent=(left<0?'-':'')+Math.floor(a/60)+':'+String(a%60).padStart(2,'0');tEl.classList.toggle('over',left<0);};
    sB.onclick=()=>{if(run){clearInterval(run);run=null;sB.textContent='繼續';}else{run=setInterval(()=>{left--;fmt();},1000);sB.textContent='暫停';}};
    head.querySelector('[data-a=r]').onclick=()=>{clearInterval(run);run=null;left=ex.minutes*60;sB.textContent='開始計時';fmt();};
  }
  async function route(){
    const v=view();v.innerHTML='';const [,kind,id]=(location.hash.slice(1)||'/').split('/');
    nav();window.scrollTo(0,0);
    try{
      if(kind==='lecture'&&M.lectures.find(l=>l.id===id)) await lecture(v,M.lectures.find(l=>l.id===id));
      else if(kind==='exam'&&M.exams.find(e=>e.id===id)) await exam(v,M.exams.find(e=>e.id===id));
      else if(kind==='lab'){const s=document.createElement('section');v.appendChild(s);buildLab(s);}
      else home(v);
    }catch(e){v.innerHTML=`<div class="read"><p class="err">載入失敗：${esc(e.message)}。請用 HTTP 伺服器開啟（python3 -m http.server），不要直接點開 index.html。</p></div>`;}
  }
  return{async start(){
    try{M=JSON.parse(await getText('content/manifest.json'));}
    catch(e){view().innerHTML=`<div class="read"><p class="err">無法讀取 content/manifest.json：${esc(e.message)}。請用 HTTP 伺服器開啟。</p></div>`;return;}
    const b=document.getElementById('brand');b.innerHTML=esc(M.site.title)+'<small>'+esc(M.site.subtitle)+'</small>';document.title=M.site.title;
    window.addEventListener('hashchange',route);route();}};
})();
