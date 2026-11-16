/* Interactive lab: step players for insertion sort, binary search, Big-O checker (+ selection/quick sort). Exposes buildLab(sectionEl). */
/* ---------- step player ---------- */
function makePlayer(root,counterKeys){
  root.innerHTML=`<div class="stage"><div class="ptrs"></div><div class="cells"></div><div class="idxs"></div></div>
   <div class="extra"></div>
   <div class="info"><div class="say"></div><div class="counters"></div></div>
   <div class="controls">
     <button class="btn" data-a="first" aria-label="第一步">⏮</button><button class="btn" data-a="prev">上一步</button>
     <button class="btn primary" data-a="next">下一步</button><button class="btn" data-a="play">自動播放</button>
     <button class="btn" data-a="last" aria-label="最後一步">⏭</button>
     <input type="range" min="0" value="0" aria-label="步驟"><span class="stepno"></span></div>`;
  const P={frames:[],k:0,timer:null};
  const $=s=>root.querySelector(s), range=$('input[type=range]');
  P.render=()=>{
    const f=P.frames[P.k]; if(!f) return;
    const n=f.arr.length+(f.ghost?1:0);
    let pt='',ce='',ix='';
    for(let t=0;t<n;t++){
      const ghost=t>=f.arr.length;
      pt+=`<div>${(f.ptr[t]||[]).join(',')}</div>`;
      ce+=`<div class="cell ${ghost?'ghost':(f.cls[t]||'')}">${ghost?'':f.arr[t]}</div>`;
      ix+=`<div>${ghost?'':t+1}</div>`;
    }
    $('.ptrs').innerHTML=pt;$('.cells').innerHTML=ce;$('.idxs').innerHTML=ix;
    $('.extra').innerHTML=f.extra||'';
    $('.say').innerHTML=f.text;
    $('.counters').innerHTML=Object.entries(f.counters).map(([k,v])=>`<div class="ctr"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
    range.max=P.frames.length-1;range.value=P.k;$('.stepno').textContent=`${P.k+1} / ${P.frames.length}`;
    $('[data-a=prev]').disabled=P.k===0;$('[data-a=next]').disabled=P.k===P.frames.length-1;
  };
  P.load=fr=>{P.stop();P.frames=fr;P.k=0;P.render();};
  P.go=k=>{P.k=Math.max(0,Math.min(P.frames.length-1,k));P.render();};
  P.stop=()=>{clearInterval(P.timer);P.timer=null;$('[data-a=play]').textContent='自動播放';};
  root.querySelector('.controls').onclick=e=>{const a=e.target.dataset.a;if(!a)return;
    if(a==='play'){ if(P.timer){P.stop();} else {if(P.k===P.frames.length-1)P.k=0;P.timer=setInterval(()=>{if(P.k>=P.frames.length-1)P.stop();else P.go(P.k+1);},900);e.target.textContent='暫停';} return;}
    P.stop(); if(a==='first')P.go(0); if(a==='prev')P.go(P.k-1); if(a==='next')P.go(P.k+1); if(a==='last')P.go(P.frames.length-1);};
  range.oninput=()=>{P.stop();P.go(+range.value);};
  root.tabIndex=-1;
  root.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'&&e.target.type!=='range')return;
    if(e.key==='ArrowRight'){P.stop();P.go(P.k+1);e.preventDefault();} if(e.key==='ArrowLeft'){P.stop();P.go(P.k-1);e.preventDefault();}});
  return P;
}
const parseNums=s=>{const a=s.split(/[\s,，、]+/).filter(Boolean).map(Number);if(!a.length||a.some(x=>!Number.isFinite(x)))throw new Error('請輸入以逗號分隔的數字，例如 5, 2, 4, 6, 1, 3');if(a.length>16)throw new Error('最多 16 個數字，畫面才放得下');return a;};
const sub=k=>String(k).replace(/\d/g,d=>'₀₁₂₃₄₅₆₇₈₉'[d]);

/* ---------- insertion sort (ch2 p.19) ---------- */
function insFrames(a0){
  const a=a0.slice(),n=a.length,F=[];let C=0,M=0;
  const sorted=u=>{const c={};for(let t=0;t<u;t++)c[t]='sorted';return c;};
  const tbox=v=>`<div class="aux"><span class="aux-l">temp =</span><span class="cell small ${v===''?'hole':'pivot'}">${v}</span><span>（搬移次數 = 2 + 右移次數 d<sub>j</sub>）</span></div>`;
  const push=(text,cls,ptr,tv)=>F.push({arr:a.slice(),cls,ptr:ptr||{},text,counters:{'比較':C,'資料搬移':M},extra:tbox(tv)});
  push('初始序列。x₁ 單獨一個視為已排序（綠色）。',sorted(1),{}, '');
  for(let j=1;j<n;j++){
    const temp=a[j];M++;let i=j-1;
    push(`<b>j = ${j+1}</b>：i := j−1 = ${j}，temp := x${sub(j+1)} = ${temp}（搬移 +1）`,{...sorted(j),[j]:'hole'},{[j]:['j'],[i]:['i']},temp);
    while(true){
      if(i<0){push('i = 0，跳出 while 迴圈（這一步不算資料比較）',{...sorted(j+1)},{},temp);break;}
      C++;
      if(temp<a[i]){
        push(`比較 temp = ${temp} &lt; x${sub(i+1)} = ${a[i]}？<b>成立</b> → 要右移`,{...sorted(j+1),[i]:'cmp',[i+1]:'hole'},{[i]:['i']},temp);
        a[i+1]=a[i];M++;
        push(`x${sub(i+2)} := x${sub(i+1)}（把 ${a[i]} 往右搬，搬移 +1），i := ${i}`,{...sorted(j+1),[i+1]:'moved',[i]:'hole'},{[i-1]:i>0?['i']:[]},temp);
        i--;
      } else {
        push(`比較 temp = ${temp} &lt; x${sub(i+1)} = ${a[i]}？<b>不成立</b> → 停止`,{...sorted(j+1),[i]:'cmp',[i+1]:'hole'},{[i]:['i']},temp);break;
      }
    }
    a[i+1]=temp;M++;
    push(`x${sub(i+2)} := temp = ${temp}（搬移 +1）。前 ${j+1} 個已排好。`,{...sorted(j+1),[i+1]:'placed'},{}, '');
  }
  push(`<b>完成。</b>共比較 ${C} 次、資料搬移 ${M} 次。`,sorted(n),{}, '');
  return F;
}

/* ---------- selection sort (ch2 p.37) ---------- */
function selFrames(a0){
  const a=a0.slice(),n=a.length,F=[];let C=0,FC=0,S=0;
  const sorted=u=>{const c={};for(let t=0;t<u;t++)c[t]='sorted';return c;};
  const push=(text,cls,ptr)=>F.push({arr:a.slice(),cls,ptr,text,counters:{'比較':C,'flag 改變':FC,'交換':S},extra:''});
  push('初始序列。每一回合在 a_j..a_n 找最小值（flag f 指向目前最小），再和 a_j 交換。',{},{});
  for(let j=0;j<n-1;j++){
    let f=j;
    push(`<b>回合 j = ${j+1}</b>：f := ${j+1}（目前最小 a${sub(j+1)} = ${a[j]}）`,{...sorted(j),[f]:'minf'},{[j]:['j,f']});
    for(let k=j+1;k<n;k++){
      C++;const lt=a[k]<a[f];
      const ptr={[j]:['j']};(ptr[f]=ptr[f]||[]).push('f');(ptr[k]=ptr[k]||[]).push('k');
      push(`比較 a${sub(k+1)} = ${a[k]} &lt; a${sub(f+1)} = ${a[f]}？${lt?'<b>是</b> → f := '+(k+1)+'（flag 改變 +1）':'否'}`,{...sorted(j),[f]:'minf',[k]:'cmp'},ptr);
      if(lt){f=k;FC++;}
    }
    if(f!==j){[a[j],a[f]]=[a[f],a[j]];S++;}
    push(f!==j?`交換 a${sub(j+1)} ↔ a${sub(f+1)}，最小值 ${a[j]} 歸位`:`最小值就是 a${sub(j+1)} = ${a[j]}，不用換`,{...sorted(j+1)},{});
  }
  push(`<b>完成。</b>比較 ${C} 次（= n(n−1)/2 = ${n*(n-1)/2}，與資料無關），flag 改變 ${FC} 次。`,sorted(n),{});
  return F;
}

/* ---------- quick sort (ch2 p.42) ---------- */
function qsFrames(a0){
  const A=a0.slice(),n=A.length,F=[],done=new Set(),stack=[];let C=0,S=0;
  const push=(text,st)=>{
    const cls={},ptr={};
    for(let t=0;t<n;t++){ if(done.has(t))cls[t]='sorted'; else if(!st||t<st.f||t>st.l)cls[t]='dim'; }
    if(st){
      const {f,l,i,j,phase}=st;
      if(phase==='scan'){
        cls[f]='pivot';
        for(let t=f+1;t<=l;t++){ if(t>j&&t<i)cls[t]='le'; else if(t>=i)cls[t]='gt'; else cls[t]=''; }
        if(st.cmp!=null)cls[st.cmp]=(cls[st.cmp]?cls[st.cmp]+' ':'')+'cmp';
        const add=(p,lab)=>{(ptr[p]=ptr[p]||[]).push(lab);};
        add(f,'f');add(l,'l');if(i<=n)add(i,'i');if(st.cmp!=null)add(st.cmp,'j');
      } else if(phase==='split'){
        for(let t=f;t<=l;t++){ if(t<st.q)cls[t]='le'; else if(t>st.q)cls[t]='gt'; }
        cls[st.q]='sorted';(ptr[st.q]=['q']);
      }
    }
    F.push({arr:A.slice(),cls,ptr,ghost:true,text,counters:{'比較':C,'交換':S},
      extra:`<div class="stack">呼叫堆疊：${stack.map(([f,l])=>`Quicksort(A, ${f+1}, ${l+1})`).join(' → ')||'（空）'}</div>`});
  };
  push('初始序列。pivot 一律取子陣列最左邊 A[f]；j 由右往左掃，比 pivot 大的丟到右邊。',null);
  (function qs(f,l){
    stack.push([f,l]);
    if(f<l){
      const x=A[f];let i=l+1;
      push(`<b>Quicksort(A, ${f+1}, ${l+1})</b>：x := A[f] = ${x}，i := l+1 = ${l+2}`,{f,l,i,j:l,phase:'scan'});
      for(let j=l;j>=f+1;j--){
        C++;
        if(A[j]>x){
          push(`j = ${j+1}：A[j] = ${A[j]} &gt; x = ${x}？<b>是</b> → i := i−1 = ${i}，交換 A[${i}] ↔ A[${j+1}]`,{f,l,i,j,cmp:j,phase:'scan'});
          i--;[A[i],A[j]]=[A[j],A[i]];S++;
          push(`交換後：A[${i+1}..${l+1}] 都 &gt; ${x}（紫色）`,{f,l,i,j:j-1,cmp:null,phase:'scan'});
        } else {
          push(`j = ${j+1}：A[j] = ${A[j]} &gt; x = ${x}？否（≤ x，留在原地，綠色區）`,{f,l,i,j:j-1,cmp:j,phase:'scan'});
        }
      }
      push(`掃描結束。交換 A[i−1] = A[${i}] = ${A[i-1]} 和 pivot A[f] = A[${f+1}] = ${x}`,{f,l,i,j:f,cmp:i-1!==f?i-1:null,phase:'scan'});
      [A[i-1],A[f]]=[A[f],A[i-1]];S++;const q=i-1;done.add(q);
      push(`q := ${q+1}。pivot ${x} 歸位；左邊 A[${f+1}..${q}] ≤ ${x}，右邊 A[${q+2}..${l+1}] &gt; ${x}`,{f,l,q,phase:'split'});
      qs(f,q-1);qs(q+1,l);
    } else if(f===l){ done.add(f); push(`Quicksort(A, ${f+1}, ${l+1})：只有一個元素，f &lt; l 不成立，直接返回`,null); }
    stack.pop();
  })(0,n-1);
  push(`<b>完成。</b>共比較 ${C} 次（每次 partition 比 l−f 次）。`,null);
  return F;
}

/* ---------- binary search (ch2 p.24) ---------- */
function bsTree(a){
  const nodes=[];
  (function b(i,m,d,par){if(i>m)return;const j=Math.floor((i+m)/2);nodes.push({j,d,par});b(i,j-1,d+1,j);b(j+1,m,d+1,j);})(1,a.length,1,null);
  const q=[[1,a.length]];let no=1;const num={};
  while(q.length){const [i,m]=q.shift();if(i>m)continue;const j=Math.floor((i+m)/2);num[j]=no++;q.push([i,j-1],[j+1,m]);}
  return {nodes,num,depth:Math.max(...nodes.map(x=>x.d))};
}
function bsSvg(a,T,visited,cur,found){
  const W=Math.max(360,a.length*46),H=T.depth*66+20,X=j=>(j-0.5)*W/a.length,Y=d=>d*66-30;
  const pos={};T.nodes.forEach(nd=>pos[nd.j]=nd);
  let e='',c='';
  T.nodes.forEach(nd=>{if(nd.par){const p=pos[nd.par];const on=visited.includes(nd.j)&&visited.includes(nd.par);
    e+=`<line class="edge${on?' on':''}" x1="${X(nd.par)}" y1="${Y(p.d)}" x2="${X(nd.j)}" y2="${Y(nd.d)}"/>`;}});
  T.nodes.forEach(nd=>{const k=nd.j===found?'fnd':nd.j===cur?'cur':visited.includes(nd.j)?'vis':'';
    c+=`<g class="${k}"><circle cx="${X(nd.j)}" cy="${Y(nd.d)}" r="18"/><text class="v" x="${X(nd.j)}" y="${Y(nd.d)}">${a[nd.j-1]}</text><text class="no" x="${X(nd.j)}" y="${Y(nd.d)+31}">#${T.num[nd.j]}</text></g>`;});
  let lv='';for(let d=1;d<=T.depth;d++)lv+=`<text class="lv" x="4" y="${Y(d)+4}">L${d}</text>`;
  return `<div class="tree"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="二元搜尋樹">${lv}${e}${c}</svg></div>
   <div class="note">#數字 = level-order 編號 i；成功搜尋比較次數 = 所在層數 = ⌊lg i⌋ + 1。樹高 = ⌊lg n⌋ + 1 = ${Math.floor(Math.log2(a.length))+1}。</div>`;
}
function bsFrames(a,X){
  for(let t=1;t<a.length;t++) if(a[t]<a[t-1]) throw new Error('二元搜尋需要由小到大排好的陣列');
  const T=bsTree(a),F=[],vis=[];let i=1,m=a.length,C=0;
  const push=(text,cur,found,j)=>{const cls={};for(let t=0;t<a.length;t++){if(t+1<i||t+1>m)cls[t]='dim';}
    if(j)cls[j-1]=found?'found':'cmp';const ptr={};const add=(p,l)=>{if(p>=1&&p<=a.length+1)(ptr[p-1]=ptr[p-1]||[]).push(l);};
    add(i,'i');add(m,'m');if(j)add(j,'j');
    F.push({arr:a.slice(),cls,ptr,ghost:false,text,counters:{'比較':C,i:i,m:m},extra:bsSvg(a,T,vis.slice(),cur,found)});};
  push(`搜尋 X = ${X}。i := 1，m := ${a.length}`,null,null,null);
  while(i<=m){
    const j=Math.floor((i+m)/2);C++;vis.push(j);
    push(`j := ⌊(${i}+${m})/2⌋ = ${j}，比較 X = ${X} 與 a${sub(j)} = ${a[j-1]}`,j,null,j);
    if(X===a[j-1]){push(`X = a${sub(j)}，<b>找到了，輸出 j = ${j}</b>。共 ${C} 次比較。`,null,j,j);return F;}
    if(X<a[j-1]){m=j-1;push(`X &lt; a${sub(j)} → m := j−1 = ${m}`,j,null,null);}
    else{i=j+1;push(`X &gt; a${sub(j)} → i := j+1 = ${i}`,j,null,null);}
  }
  push(`i = ${i} &gt; m = ${m}，迴圈結束，<b>輸出 0（找不到）</b>。共 ${C} 次比較。`,null,null,null);
  return F;
}

/* ---------- Big-O checker ---------- */
function buildBigO(root){
  root.innerHTML=`<div class="inputs">
    <div class="field"><label for="bo-c">係數（最高次 → 常數）</label><input id="bo-c" class="wide" value="4, -3, 12, -8, 0, 4"></div>
    <div class="field"><label for="bo-cc">c</label><input id="bo-cc" class="narrow" value="20"></div>
    <div class="field"><label for="bo-n0">n₀</label><input id="bo-n0" class="narrow" value="1"></div>
    <button class="btn primary" id="bo-go">驗算</button></div>
    <div class="err" id="bo-err"></div><div id="bo-out" class="bo"></div>
    <p class="note">用途：證明 f(n) = O(n<sup>k</sup>) 前，先確認自己找的 c、n₀ 真的成立（表格只驗前 12 個 n，正式作答仍要用不等式證明）。預設是 9/21 隨堂練習 4n⁵−3n⁴+12n³−8n²+4。</p>`;
  const go=()=>{const err=root.querySelector('#bo-err'),out=root.querySelector('#bo-out');err.textContent='';
    try{const co=root.querySelector('#bo-c').value.split(/[\s,，]+/).filter(Boolean).map(Number);if(co.some(x=>!Number.isFinite(x))||!co.length)throw new Error('係數要是數字，用逗號分隔');
      const c=+root.querySelector('#bo-cc').value,n0=Math.max(1,Math.floor(+root.querySelector('#bo-n0').value));if(!(c>0))throw new Error('c 要是正數');
      const k=co.length-1,f=n=>co.reduce((s,a)=>s*n+a,0);const tri=co.reduce((s,a)=>s+Math.abs(a),0);
      let rows='',all=true;for(let n=n0;n<n0+12;n++){const fv=Math.abs(f(n)),g=c*n**k,ok=fv<=g;all=all&&ok;
        rows+=`<tr><td>${n}</td><td>${fv.toLocaleString()}</td><td>${g.toLocaleString()}</td><td class="${ok?'ok':'no-ok'}">${ok?'✓':'✗'}</td></tr>`;}
      out.innerHTML=`<div class="say" style="margin-top:4px">要證 |f(n)| ≤ ${c}·n<sup>${k}</sup>，∀n ≥ ${n0}。${all?'<b>表格內全部成立</b>。':'<span class="no-ok">有不成立的 n，c 或 n₀ 要調大。</span>'} 係數絕對值總和 = <b>${tri}</b>（講義 p.9 套路：c = ${tri}、n₀ = 1 一定成立）。</div>
      <div class="tw" style="overflow-x:auto"><table><tr><th>n</th><th>|f(n)|</th><th>c·n<sup>${k}</sup></th><th>成立？</th></tr>${rows}</table></div>`;}
    catch(e){err.textContent=e.message;out.innerHTML='';}};
  root.querySelector('#bo-go').onclick=go;go();
}

/* ---------- lab ---------- */
const PRESETS={
  ins:[['隨堂 10/12：5,2,4,6,1,3','5,2,4,6,1,3'],['講義 p.18：7,5,1,4,3','7,5,1,4,3'],['模擬考1 Q4','8,3,6,1,7,2'],['模擬考2 Q3（worst）','9,7,5,3,1'],['模擬考3 Q4','4,6,2,7,1,5'],['Best case','1,2,3,4,5,6']],
  sel:[['講義 p.38：7,5,1,4,3','7,5,1,4,3'],['講義 §4-1：5,2,4,6,1,3','5,2,4,6,1,3'],['練習：6,3,8,1,5,2','6,3,8,1,5,2'],['練習：5,9,2,7,3,8','5,9,2,7,3,8']],
  qs:[['講義 p.48：3,6,2,5,4,1','3,6,2,5,4,1'],['講義 p.46：2,8,7,1,3,5,6,4','2,8,7,1,3,5,6,4'],['講義 p.47：4,6,5,3,1,7,8,2','4,6,5,3,1,7,8,2'],['講義 p.49（10 個）','11,5,24,2,31,7,8,26,10,15'],['講義 §4-2：5,2,4,6,1,3','5,2,4,6,1,3'],['練習：4,7,2,6,1,5,3','4,7,2,6,1,5,3'],['練習：6,9,3,8,2,7,4,1','6,9,3,8,2,7,4,1'],['練習：10,15,3,12,7,20,1,8','10,15,3,12,7,20,1,8'],['Worst case：已排序','1,2,3,4,5,6,7,8']],
  bs:[['隨堂 10/19：搜 0','1,3,5,7,9,10,12,16|0'],['隨堂 10/19：搜 3','1,3,5,7,9,10,12,16|3'],['隨堂 10/19：搜 17','1,3,5,7,9,10,12,16|17'],['模擬考1 Q5：搜 14','2,4,6,8,10,12,14,16,18,20|14'],['模擬考1 Q6：搜 60（n=9）','2,5,8,12,16,23,38,56,72|60'],['模擬考2 Q6：搜 5（n=7）','4,9,15,21,30,36,42|5'],['模擬考2 Q4：搜 45','3,8,11,15,19,22,27,31,36,40,44,50|45'],['模擬考3 Q3：搜 35','5,10,15,20,25,30,35,40,45,50,55,60,65,70,75|35']]};
const LEG={
  ins:[['sorted','已排序'],['hole','temp 拿走的空位'],['cmp','正在比較'],['moved','剛被搬移']],
  sel:[['sorted','已歸位'],['minf','flag f 指向的目前最小'],['cmp','正在比較的 a_k']],
  qs:[['pivot','pivot x = A[f]'],['le','≤ x'],['gt','> x'],['cmp','正在看的 A[j]'],['sorted','已歸位'],['dim','不在這次 partition']],
  bs:[['cmp','a_j（正在比較）'],['found','找到'],['dim','已排除（不在 i..m）']]};
function buildLab(sec){
  sec.innerHTML=`<p class="lab-intro">四個演算法都完全照講義的虛擬碼逐步執行（Quicksort 是 ch2 p.42 那一版），計數方式也和講義一致。期中範圍是二元搜尋、插入排序和 Big-O；選擇排序與快速排序留給期末。建議先在紙上寫完，再用這裡逐步對答案。鍵盤 ← → 可切換步驟。</p>
   <div class="subtabs" role="tablist"></div><div class="card" id="lab-card"></div>`;
  const KINDS=[['bs','二元搜尋'],['ins','插入排序'],['bo','Big-O 驗算'],['sel','選擇排序（期末）'],['qs','快速排序（期末）']];
  const st=sec.querySelector('.subtabs'),card=sec.querySelector('#lab-card');const roots={};
  KINDS.forEach(([k,l])=>{const b=document.createElement('button');b.className='sub';b.textContent=l;b.dataset.k=k;b.onclick=()=>pick(k);st.appendChild(b);});
  function pick(k){[...st.children].forEach(b=>b.setAttribute('aria-selected',b.dataset.k===k));
    Object.values(roots).forEach(r=>r.hidden=true);
    if(!roots[k]){const r=document.createElement('div');card.appendChild(r);roots[k]=r;k==='bo'?buildBigO(r):buildViz(r,k);}
    roots[k].hidden=false;try{localStorage.setItem('lab-kind',k);}catch(e){}}
  let first='bs';try{first=localStorage.getItem('lab-kind')||'bs';}catch(e){}
  pick(first);
}
function buildViz(root,k){
  const isBS=k==='bs';
  root.innerHTML=`<div class="inputs">
     <div class="field"><label for="pre-${k}">題目</label><select id="pre-${k}">${PRESETS[k].map((p,t)=>`<option value="${t}">${p[0]}</option>`).join('')}</select></div>
     <div class="field"><label for="arr-${k}">${isBS?'已排序陣列':'數列'}</label><input id="arr-${k}" class="wide"></div>
     ${isBS?`<div class="field"><label for="x-${k}">X</label><input id="x-${k}" class="narrow"></div>`:''}
     <button class="btn primary" id="go-${k}">開始</button></div>
   <div class="err"></div><div class="player"></div>
   <div class="legend">${LEG[k].map(([c,t])=>`<span><i class="cell ${c}" style="width:14px;height:14px"></i>${t}</span>`).join('')}</div>`;
  const P=makePlayer(root.querySelector('.player'));
  const arrIn=root.querySelector('#arr-'+k),xIn=root.querySelector('#x-'+k),sel=root.querySelector('#pre-'+k),err=root.querySelector('.err');
  const fill=()=>{const v=PRESETS[k][+sel.value][1];if(isBS){const [a,x]=v.split('|');arrIn.value=a.replace(/,/g,', ');xIn.value=x;}else arrIn.value=v.replace(/,/g,', ');};
  const run=()=>{err.textContent='';try{const a=parseNums(arrIn.value);
      const fr=k==='ins'?insFrames(a):k==='sel'?selFrames(a):k==='qs'?qsFrames(a):bsFrames(a,(()=>{const x=Number(xIn.value);if(xIn.value.trim()===''||!Number.isFinite(x))throw new Error('X 要是數字');return x;})());
      P.load(fr);}catch(e){err.textContent=e.message;}};
  sel.onchange=()=>{fill();run();};root.querySelector('#go-'+k).onclick=run;
  [arrIn,xIn].forEach(el=>el&&el.addEventListener('keydown',e=>{if(e.key==='Enter')run();}));
  fill();run();
}

