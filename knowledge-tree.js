window.createKnowledgeExplorer = function(api) {
  const {items,byKey,belongs,path,url,esc,prose,formula,lesson,englishBody,dialog,source} = api;
  const learning=window.STUDY_LEARNING, $=s=>document.querySelector(s);
  const prerequisites = {
    quantization:['f-matrix'],bitwidth:['concept:quantization'],granularity:['concept:quantization'],outliers:['concept:quantization'],
    'mixed-precision':['concept:outliers','concept:bitwidth'],scaling:['f-matrix','concept:outliers'],saliency:['concept:scaling','concept:calibration'],calibration:['f-stat'],
    'output-error':['f-matrix','f-rank'],'second-order':['concept:gram-psd','concept:output-error'],'low-rank':['concept:svd'],svd:['f-rank'],autocorrelation:['f-stat','concept:gram-psd'],
    'qera-exact':['concept:output-error','concept:low-rank','concept:autocorrelation'],'qera-approx':['concept:qera-exact','concept:calibration'],evaluation:['f-protocol'],
    'tensor-mode':['f-matrix'],'tensor-cp':['concept:tensor-mode','f-rank'],'tensor-tucker':['concept:tensor-mode','f-rank'],'tensor-contraction':['concept:tensor-mode'],
    'tensor-tt':['concept:tensor-contraction','concept:tensorization'],'tensor-ring-model':['concept:tensor-tt'],'tensor-als':['f-ls','concept:tensor-cp'],tensorization:['concept:tensor-mode'],
    'tensor-missing':['concept:tensor-tucker','concept:tensor-als'],'tensor-soh':['concept:tensor-missing','f-protocol'],
    'lqer-weighted':['concept:low-rank','concept:calibration'],mxint:['concept:bitwidth','concept:granularity'],'eora-eigenspace':['concept:eigendecomposition','concept:autocorrelation','concept:low-rank'],
    eigendecomposition:['f-matrix','f-rank'],'gram-psd':['f-matrix','f-stat'],'structured-sparsity':['concept:pruning'],'sparsegpt-baseline':['concept:structured-sparsity','concept:second-order'],
    'zeroquant-v2-baseline':['concept:svd','concept:quantization'],'act-s-baseline':['concept:lqer-weighted'],'apiq-baseline':['concept:output-error','f-ls'],
    'llama-model-label':['concept:tr-attention','concept:tr-ffn'],'principal-component':['concept:eigendecomposition','f-stat'],'pareto-frontier':['concept:evaluation'],
    'opt-layernorm':['concept:tr-postnorm','concept:outliers'],'zq-local':['concept:output-error','concept:quantization'],'zq-global':['concept:zq-local','concept:tr-postnorm'],rtn:['concept:quantization'],
    'bit-packing':['concept:bitwidth'],pruning:['f-matrix'],
    'tr-attention':['f-matrix','f-softmax'],'tr-heads':['concept:tr-attention'],'tr-roles':['concept:tr-attention'],'tr-mask':['concept:tr-roles'],
    'tr-position':['concept:tr-permutation'],'tr-ffn':['f-matrix'],'tr-postnorm':['concept:tr-heads','concept:tr-ffn'],'tr-permutation':['concept:tr-attention'],
    'tr-convolution':['concept:tr-attention'],'tr-dropout':['concept:tr-ffn','f-stat'],'tr-bleu':['f-protocol'],'tr-decoding':['concept:tr-mask','f-softmax']
  };
  const foundations=Object.entries(learning.foundations).map(([key,f])=>({key,id:key,kind:'foundation',title:f.title,summary:f.summary,raw:f}));
  const nodes=[...foundations,...items.filter(x=>x.kind!=='english')], lookup=key=>nodes.find(x=>x.key===key);
  const labels={foundation:'入门基础',concept:'概念',paper:'论文',case:'实践 / 代码'};
  const required = n => n.kind==='concept' ? prerequisites[n.id] || [] : n.kind==='paper' ? n.raw.concepts.filter(id=>n.id!=='attention-2017'||id.startsWith('tr-')).map(id=>'concept:'+id) : n.kind==='case' ? (n.id.startsWith('rag-') ? ['f-similarity','f-protocol'] : n.raw.kind==='code' ? ['f-matrix'] : ['concept:tensor-missing','concept:tensor-soh','f-protocol']) : ({'f-rank':['f-matrix'],'f-stat':['f-matrix'],'f-softmax':['f-matrix'],'f-ls':['f-matrix','f-rank'],'f-similarity':['f-matrix']}[n.id] || []);
  const groups=[
    {id:'basics',title:'01 前置基础',children:[{title:'数学与评测准备',keys:foundations.map(x=>x.key)}]},
    {id:'transformer',title:'02 Transformer',children:[{title:'结构、解码与评估',keys:items.filter(x=>x.kind==='concept'&&x.raw.group==='Transformer 基础').map(x=>x.key)}]},
    {id:'quant',title:'03 量化与误差重构',children:['量化基础','激活感知','误差重构','线性代数','模型与评估','实验评估'].map(g=>({title:g,keys:items.filter(x=>x.kind==='concept'&&x.raw.group===g).map(x=>x.key)}))},
    {id:'tensor',title:'04 张量与电池方法',children:['张量基础','张量网络','张量应用'].map(g=>({title:g,keys:items.filter(x=>x.kind==='concept'&&x.raw.group===g).map(x=>x.key)}))},
    {id:'papers',title:'05 文献与方法',children:[{title:'LLM 与量化',keys:items.filter(x=>x.kind==='paper'&&x.raw.phase.startsWith('P')).map(x=>x.key)},{title:'张量与电池',keys:items.filter(x=>x.kind==='paper'&&x.raw.phase.startsWith('T')).map(x=>x.key)}]},
    {id:'practice',title:'06 项目实践',children:[{title:'电池实验与代码',keys:items.filter(x=>x.kind==='case'&&!x.id.startsWith('rag-')).map(x=>x.key)},{title:'RAG 实战',keys:items.filter(x=>x.kind==='case'&&x.id.startsWith('rag-')).map(x=>x.key)}]}
  ];
  let selected='f-matrix',query='',scope='all',tab='relations';
  const locationOf=key=>groups.flatMap(g=>g.children.map(c=>({...c,group:g.title}))).find(c=>c.keys.includes(key));
  const relatedTopics=n=>learning.topics.filter(t=>t.steps.some(s=>s.materials.includes(n.key)));
  function link(key) { const n=lookup(key); return n ? `<button data-knowledge="${esc(key)}"><span>${labels[n.kind]}</span><strong>${esc(n.title)}</strong></button>` : ''; }
  function treeResults() {
    const tokens=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const found=nodes.filter(n=>(scope==='all'||n.kind==='foundation'||belongs(n,api.getRoute().project))&&tokens.every(t=>[n.title,n.summary,n.raw.english,n.raw.title].join(' ').toLowerCase().includes(t)));
    const keys=new Set(found.map(n=>n.key));
    $('#knowledge-count').textContent=`${found.length} 个条目`;
    $('#knowledge-tree').innerHTML=groups.map(g=>{
      const children=g.children.map(c=>({...c,visible:c.keys.filter(k=>keys.has(k))})).filter(c=>c.visible.length);
      if(!children.length)return '';
      const open=!!query||children.some(c=>c.keys.includes(selected))||g.id==='basics';
      return `<details class="knowledge-group" ${open?'open':''}><summary>${esc(g.title)}<span>${children.reduce((n,c)=>n+c.visible.length,0)}</span></summary>${children.map(c=>`<details class="knowledge-subgroup" ${query||c.keys.includes(selected)||g.id==='basics'?'open':''}><summary>${esc(c.title)}<span>${c.visible.length}</span></summary>${c.visible.map(k=>`<button class="knowledge-leaf" data-knowledge="${esc(k)}" aria-pressed="${k===selected}">${esc(lookup(k).title)}</button>`).join('')}</details>`).join('')}</details>`;
    }).join('')||'<p class="empty">没有匹配条目。</p>';
  }
  function detail() {
    const n=lookup(selected),where=locationOf(selected),before=required(n),after=nodes.filter(x=>required(x).includes(selected));
    const c=n.raw,related=n.kind==='concept'?(c.related||[]).map(id=>'concept:'+id):[];
    const papers=n.kind==='concept'?[...new Set((c.refs||[]).map(r=>r.paper))].map(id=>byKey('paper:'+id)):n.kind==='paper'?[n]:[];
    const comparisons=[...new Set(learning.graphs.flatMap(g=>g.edges.filter(([a,b,t])=>t==='compare'&&(a===selected||b===selected)).map(([a,b])=>a===selected?b:a)))];
    const topics=relatedTopics(n),sourceRefs=n.kind==='concept'?c.refs||[]:n.kind==='paper'?[{paper:n.id,page:1}]:[];
    let body='';
    if(tab==='explain') {
      if(n.kind==='concept')body=formula(c.latex)+lesson(c);
      if(n.kind==='foundation')body=`<p>${esc(c.text)}</p>${formula(c.latex)}<h3>教学算例</h3><p>${esc(c.example)}</p><details><summary>${esc(c.check)}</summary><p>${esc(c.answer)}</p></details><p class="source">为专题学习整理的入门说明。</p>`;
      if(n.kind==='paper')body=`<h3>研究问题</h3><p>${prose(c.question)}</p><h3>核心方法</h3><p>${prose(c.mechanism)}</p>${formula(c.latex)}<h3>证据与边界</h3><p>${prose(c.evidence)}</p><p>${prose(c.caveat)}</p>`;
      if(n.kind==='case')body=c.bodyHtml.replaceAll('notes/',api.assetBase+'notes/');
    } else {
      body=`<section><h3>建议先补</h3><div class="knowledge-links">${before.map(link).join('')||'<p>从这个基础条目开始。</p>'}</div></section><section><h3>接着学什么</h3><div class="knowledge-links">${after.map(x=>link(x.key)).join('')||'<p>可在专题路线中综合回顾。</p>'}</div></section>${related.length?`<section><h3>相关概念</h3><div class="knowledge-links">${related.map(link).join('')}</div></section>`:''}${comparisons.length?`<section><h3>方法对照</h3><div class="knowledge-links">${comparisons.map(link).join('')}</div></section>`:''}${papers.length?`<section><h3>文献与原文依据</h3><div class="knowledge-links">${papers.map(p=>link(p.key)).join('')}</div><div class="source">${sourceRefs.map(source).join('')}</div></section>`:''}${topics.length?`<section><h3>所在专题路线</h3><div class="knowledge-links">${topics.map(t=>`<a href="${path('roadmap',t.id,t.projects.includes(api.getRoute().project)?api.getRoute().project:t.projects[0])}">${esc(t.title)} →</a>`).join('')}</div></section>`:''}`;
    }
    $('#knowledge-detail').innerHTML=`<header class="knowledge-detail-head"><div class="knowledge-location">${esc(where.group)} / ${esc(where.title)}</div><span class="tag">${labels[n.kind]}</span><h2>${esc(n.title)}</h2><p>${prose(n.summary)}</p><div class="knowledge-actions">${n.kind!=='foundation'?`<a href="${url(n)}" class="primary">在阅读页打开 →</a>`:''}${n.kind==='concept'?`<button data-start-drill="${n.key}">概念专项</button>`:''}</div><nav class="knowledge-detail-tabs" aria-label="知识详情"><button data-knowledge-tab="relations" aria-pressed="${tab==='relations'}">关系与路径</button><button data-knowledge-tab="explain" aria-pressed="${tab==='explain'}">完整讲解</button></nav></header><article class="reader knowledge-body">${body}</article>`;
    $('#knowledge-detail').scrollTop=0;
    document.querySelectorAll('.knowledge-leaf').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.knowledge===selected)));
  }
  function render() {
    const current=api.getRoute().project;
    if(scope==='current'&&!belongs(lookup(selected),current)&&lookup(selected).kind!=='foundation')selected=current==='rag'?'case:rag-scholarship-overview':current==='battery'?'case:d2-cell-rank-20261018':current==='tensor'?'concept:tensor-mode':'paper:qera';
    $('#main').innerHTML=`<div class="page-heading"><h1>知识图谱</h1></div><nav class="learning-tabs" aria-label="路线与图谱"><a href="${path('roadmap')}">专题路线</a><a href="${path('graph')}" aria-current="page">知识目录</a></nav><div class="knowledge-toolbar"><input type="search" id="knowledge-search" aria-label="搜索知识目录" placeholder="搜索概念、方法或论文…" value="${esc(query)}"><select id="knowledge-scope" aria-label="目录范围"><option value="all" ${scope==='all'?'selected':''}>全部知识</option><option value="current" ${scope==='current'?'selected':''}>当前方向 / 项目</option></select><span id="knowledge-count"></span></div><div class="knowledge-layout"><aside class="knowledge-tree" id="knowledge-tree" aria-label="知识层级目录"></aside><section id="knowledge-detail" class="knowledge-detail" aria-label="当前知识条目"></section></div>`;
    treeResults();detail();
  }
  function select(key) {
    selected=key;query='';$('#knowledge-search').value='';
    const tree=$('#knowledge-tree'),scroll=tree.scrollTop;treeResults();detail();tree.scrollTop=scroll;
    const leaf=[...tree.querySelectorAll('.knowledge-leaf')].find(b=>b.dataset.knowledge===key);
    if(leaf){const box=leaf.getBoundingClientRect(),area=tree.getBoundingClientRect();if(box.top<area.top||box.bottom>area.bottom)tree.scrollTop+=box.top-area.top-38;}
  }
  function click(t) {
    if(t.dataset.knowledge){select(t.dataset.knowledge);return true;}
    if(t.dataset.knowledgeTab){tab=t.dataset.knowledgeTab;detail();return true;}
    return false;
  }
  function input(t){if(t.id==='knowledge-search'){query=t.value;treeResults();return true;}return false;}
  function change(t){if(t.id==='knowledge-scope'){scope=t.value;render();return true;}return false;}
  // Validation can inspect explicit teaching dependencies without extracting UI code.
  return {render,click,input,change,prerequisites,nodes,requirements:required};
};
