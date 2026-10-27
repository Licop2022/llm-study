(() => {
  'use strict';
  const D = window.STUDY_DATA;
  const T = window.STUDY_TODOS;
  const KEY = 'zhiliang-study-v1';
  const $ = (q, root = document) => root.querySelector(q);
  const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const attr = esc;
  const inlineMath = text => window.STUDY_MATH_TEXT.render(text,window.katex);
  const statusLabels = {unread:'未读',reading:'在读',read:'已读'};
  const stageLabels = {unknown:'尚未自评',intro:'初步了解',explain:'能独立解释',derive:'能推导',reproduce:'能复现'};
  const englishStageLabels={unknown:'待自评',intro:'正在熟悉',explain:'能解释 / 运用'};
  const navs = [['overview','学习总览','grid'],['papers','阅读文库','book'],['concepts','概念笔记','nodes'],['english','文献英语','book'],['compare','方法对比','compare'],['todos','待办提醒','clock'],['experiments','实验与代码','layers'],['journal','学习日志','pen']];
  const paths = {
    grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    book:'M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1z M12 5v15',
    nodes:'M8 8l8 8 M16 8l-8 8 M12 5v14 M5 12h14 M5 5h0 M19 5h0 M5 19h0 M19 19h0',
    compare:'M4 5h16 M4 12h16 M4 19h16 M9 3v18 M16 3v18',
    pen:'M14 4l6 6 M4 20l4-1L21 6l-4-4L4 15v5z',
    search:'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z M16 16l5 5',
    arrow:'M5 12h14 M14 7l5 5-5 5',
    star:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',
    check:'M5 12l4 4L19 6',
    clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',
    download:'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',
    upload:'M12 16V4 M7 9l5-5 5 5 M4 16v5h16v-5',
    info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 11v6 M12 7h.01',
    external:'M14 3h7v7 M21 3l-9 9 M10 3H3v18h18v-7',
    menu:'M4 6h16 M4 12h16 M4 18h16',
    layers:'M12 3l10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`;
  const now = () => new Date().toISOString();
  function today() { const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()); return ['year','month','day'].map(k => parts.find(p=>p.type===k).value).join('-'); }
  function blankState() { return {version:1,papers:{},concepts:{},english:{},logs:[],todos:[],appliedUpdates:[],updatedAt:now()}; }
  function cleanState(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== 1) throw new Error('备份版本不支持；请使用知量导出的学习记录。');
    const out = blankState();
    for (const group of ['papers','concepts','english']) {
      if (raw[group] && typeof raw[group] === 'object' && !Array.isArray(raw[group])) {
        for (const [id, record] of Object.entries(raw[group])) {
          if (!/^[a-z0-9-]{1,80}$/.test(id) || !record || typeof record !== 'object' || Array.isArray(record)) continue;
          const r = {};
          for (const field of ['status','stage','readDate','understanding','evidence','questions','notes','updatedAt']) {
            if (typeof record[field] === 'string' && record[field].length <= 100000) r[field] = record[field];
          }
          if (r.status && !Object.hasOwn(statusLabels,r.status)) delete r.status;
          if (r.stage && !Object.hasOwn(stageLabels,r.stage)) delete r.stage;
          if(group==='english'&&r.stage&&!Object.hasOwn(englishStageLabels,r.stage))delete r.stage;
          if (r.readDate && !/^\d{4}-\d{2}-\d{2}$/.test(r.readDate)) delete r.readDate;
          if (typeof record.starred === 'boolean') r.starred = record.starred;
          out[group][id] = r;
        }
      }
    }
    if (Array.isArray(raw.logs)) out.logs = raw.logs.filter(l=>l && typeof l === 'object' && typeof l.id==='string' && typeof l.text==='string' && /^\d{4}-\d{2}-\d{2}$/.test(l.date)).slice(0,10000).map(l=>({id:l.id.slice(0,100),date:l.date,title:String(l.title || '学习记录').slice(0,200),text:l.text.slice(0,100000),paper:typeof l.paper==='string'?l.paper:'',kind:['阅读','复习','推导','实验','想法'].includes(l.kind)?l.kind:'阅读',createdAt:typeof l.createdAt==='string'?l.createdAt:now()}));
    out.todos=T.normalize(raw.todos);
    out.appliedUpdates = Array.isArray(raw.appliedUpdates) ? raw.appliedUpdates.filter(id=>typeof id==='string'&&/^[a-z0-9-]{1,80}$/.test(id)) : [];
    out.updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : now();
    if(raw.workspace && typeof raw.workspace==='object' && !Array.isArray(raw.workspace))out.workspace=raw.workspace;
    return out;
  }
  let state = blankState(), storageOK = true, corruptState = false;
  try { const saved = localStorage.getItem(KEY); if(saved) state=cleanState(JSON.parse(saved)); } catch(e) { storageOK=false; corruptState=true; }
  const paper = id => D.papers.find(p=>p.id===id);
  const concept = id => D.concepts.find(c=>c.id===id);
  const englishEntries=()=>[...D.english.terms,...D.english.phrases,...D.english.sentences];
  const englishEntry=id=>englishEntries().find(e=>e.id===id);
  const es=e=>({stage:'unknown',notes:'',...state.english[e.id]});
  const ps = p => ({status:p.initialStatus,stage:'unknown',readDate:'',starred:false,...state.papers[p.id]});
  const cs = c => ({stage:'unknown',notes:'',...state.concepts[c.id]});
  let route = 'overview', paperFilter='all', paperSearch='', statusFilter='all', conceptFilter='all', conceptSearch='', conceptStage='all', detail=null, detailTab='summary', toastTimer, journalDraft=null;
  let conceptSelected='', englishSelected='', readerScheduleOpen=false;
  let readingPaper='', workspaceTab='guide', workspaceAside='notes', workspaceFont=19, workspaceFocus=false, workspaceShelfQuery='';
  let scheduleDate=today(), scheduleMonth=today().slice(0,7), scheduleOpen=false, scheduleDraft=null;
  let todoDraft=null, todoEditing='', todoFilter='open', reminderBusy=false;
  let englishMode='terms',englishPaper='all',englishQuery='',englishDirection='en-zh',englishPracticeID=null,englishAnswerShown=false;
  function persist() {
    state.updatedAt=now();
    if (corruptState) return false;
    try { localStorage.setItem(KEY,JSON.stringify(state)); storageOK=true; return true; }
    catch(e) { storageOK=false; toast('浏览器未能保存，请立即导出学习记录备份。'); return false; }
  }
  // 仅一次写入用户明确提供的阅读事实；保留其他个人笔记。
  if (!corruptState) {
    let changed=false;
    for (const u of D.readingUpdates || []) {
      if(state.appliedUpdates.includes(u.id)) continue;
      if(!state.logs.some(l=>l.id===u.id)) state.logs.push({id:u.id,date:u.date,title:u.title,text:u.text,paper:u.paper,kind:'阅读',createdAt:now()});
      state.papers[u.paper]={...state.papers[u.paper],status:'read',readDate:u.date,updatedAt:now()};
      state.appliedUpdates.push(u.id);changed=true;
    }
    if(changed)persist();
  }
  function updateRecord(group,id,field,value) {
    state[group][id] = {...state[group][id],[field]:value,updatedAt:now()};
    const saved=persist();
    const indicator=$('#save-indicator');
    for(const node of document.querySelectorAll('#save-indicator,#reader-save-indicator'))node.textContent=saved?'已保存':'未持久保存，请导出备份';
  }
  function toast(message) { const t=$('#toast');t.textContent=message;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),3200); }
  const stageOptions = value => Object.entries(stageLabels).map(([k,v])=>`<option value="${k}" ${value===k?'selected':''}>${v}</option>`).join('');
  const statusOptions = value => Object.entries(statusLabels).map(([k,v])=>`<option value="${k}" ${value===k?'selected':''}>${v}</option>`).join('');
  const badge = p => `<span class="badge ${ps(p).status}">${ps(p).status==='read'?icon('check'):''}${statusLabels[ps(p).status]}</span>`;
  const symbol = p => `<span class="paper-symbol ${p.color}">${p.name==='LLM.int8()'?'int8':p.name==='SmoothQuant'?'SQ':p.name==='GPTQ'?'GQ':p.name==='AWQ'?'AQ':p.id==='qera'?'QR':p.id==='lqer'?'LQ':p.id==='eora'?'ER':p.id==='zeroquant-v2'?'ZQ':p.id==='attention-2017'?'TF':p.id==='tensor-ring'?'TR':p.phase==='T3'?'SOH':'TN'}</span>`;
  const star = p => `<button class="star-button ${ps(p).starred?'on':''}" data-action="star" data-id="${p.id}" aria-label="${ps(p).starred?'取消收藏':'收藏'} ${attr(p.name)}" aria-pressed="${ps(p).starred}">${icon('star')}</button>`;
  function pdfURL(p,page=1) { return p.pdf.split('/').map(encodeURIComponent).join('/')+`#page=${page}`; }
  const pdfLink = (p,page,label) => `<a class="source-link" href="${pdfURL(p,page)}" target="_blank" rel="noopener">${esc(label || `${p.name} · PDF 第 ${page} 页`)} ${icon('external')}</a>`;
  const refs = list => list.map(r=>pdfLink(paper(r.paper),r.page)).join('');
  function equation(record) {
    let content=esc(record.formula),rendered=false;
    if(record.latex&&window.katex){
      try{content=window.katex.renderToString(record.latex,{displayMode:true,throwOnError:true,trust:false,strict:'warn',output:'htmlAndMathml'});rendered=true;}
      catch(error){console.error('公式渲染失败：'+record.id,error.message);}
    }
    return `<div class="equation"><div class="equation-formula" data-math-rendered="${rendered}">${content}</div><div class="equation-footer"><span>${record.latex&&!rendered?'公式排版不可用 · ':''}行样本：Y = XW</span>${record.latex?`<button data-action="copy-formula" data-id="${record.id}" data-kind="${record.title?'paper':'concept'}">复制 LaTeX</button>`:''}</div></div>`;
  }
  function heading(title,_subtitle,extra='') { return `<div class="page-heading"><h1>${title}</h1>${extra}</div>`; }
  function renderNavigation() {
    $('#navigation').innerHTML = navs.map(([id,label,img])=>`<a class="nav-link ${route===id?'active':''}" href="#${id}" ${route===id?'aria-current="page"':''}>${icon(img)}<span>${label}</span>${id==='papers'?`<span class="nav-count">${D.papers.length}</span>`:id==='concepts'?`<span class="nav-count">${D.concepts.length}</span>`:id==='english'?`<span class="nav-count">${D.english.terms.length}</span>`:''}</a>`).join('');
    $('#page-label').textContent=readingPaper&&route==='papers'?paper(readingPaper).name:navs.find(n=>n[0]===route)[1];
    renderWorkspaceLibrary();
    $('#workspace-schedule-toggle').setAttribute('aria-expanded',String(readerScheduleOpen));
  }
  function renderWorkspaceLibrary() {
    const host=$('#workspace-library'),openGroups={};
    host.querySelectorAll('details').forEach(el=>openGroups[el.dataset.phase]=el.open);
    const scroll=host.querySelector('.workspace-shelf-list')?.scrollTop||0;
    host.innerHTML=`<div class="workspace-shelf-heading"><span>我的文库</span><small>${D.papers.length}</small></div><label class="workspace-shelf-search">${icon('search')}<input id="workspace-shelf-search" aria-label="筛选侧栏文库" placeholder="查找文献…" value="${attr(workspaceShelfQuery)}"></label><div class="workspace-shelf-list">${[['P3','误差补偿进阶'],['P2','误差重构'],['P1','量化与模型基础'],['T1','张量基础'],['T2','张量网络'],['T3','张量应用']].map(([phase,label])=>`<details data-phase="${phase}" ${openGroups[phase]===false&&!workspaceShelfQuery?'':'open'}><summary>${label}<small>${D.papers.filter(p=>p.phase===phase).length}</small></summary>${D.papers.filter(p=>p.phase===phase).map(p=>`<button class="workspace-shelf-paper ${readingPaper===p.id&&route==='papers'?'selected':''}" data-action="workspace-open" data-id="${p.id}" aria-pressed="${readingPaper===p.id&&route==='papers'}" ${workspaceShelfQuery&&!`${p.name} ${p.title}`.toLowerCase().includes(workspaceShelfQuery.toLowerCase())?'hidden':''}>${symbol(p)}<span><strong>${esc(p.name)}</strong><small>${p.year} · ${p.pages} 页</small></span>${ps(p).starred?'<i aria-label="已收藏">✦</i>':''}</button>`).join('')}</details>`).join('')}</div>`;
    $('.workspace-shelf-list',host).scrollTop=scroll;
  }
  function workspaceSections(p) {
    return [['研究问题','这篇论文解决什么问题',`<p>${esc(p.question)}</p>`],['核心机制','方法如何工作',`<p>${esc(p.mechanism)}</p>`],['公式理解','把方法写成公式',equation(p)],['实验依据','回到实验与证据',`<p>${esc(p.evidence)}</p>`],['适用边界','结论成立的边界',`<p>${esc(p.caveat)}</p>`],['原文与自测','读完之后，回到原文',`<div class="source-links">${p.reading.map(r=>pdfLink(p,r.page,`${r.label} · p.${r.page}`)).join('')}</div><p class="source-note">${esc(p.source)}<br>版本：${esc(p.version)}</p><ol class="workspace-checks">${p.checks.map(q=>`<li>${esc(q)}</li>`).join('')}</ol>`]];
  }
  function workspaceNotes(p) {
    const s=ps(p);
    return `<div class="save-indicator" id="save-indicator">${storageOK?'自动保存':'请导出备份以保存记录'}</div><div class="workspace-note-meta"><label class="field"><span>阅读状态</span><select data-record="papers" data-id="${p.id}" data-field="status">${statusOptions(s.status)}</select></label><label class="field"><span>掌握程度 · 自评</span><select data-record="papers" data-id="${p.id}" data-field="stage">${stageOptions(s.stage)}</select></label><label class="field"><span>阅读完成日期</span><input type="date" data-record="papers" data-id="${p.id}" data-field="readDate" value="${attr(s.readDate)}"></label></div>${[['understanding','我的理解','方法、公式、关键假设'],['evidence','证据与实验记录','模型、位宽、rank、实验结果'],['questions','疑问与下一步','待确认的问题']].map(([field,label,placeholder])=>`<label class="field"><span>${label}</span><textarea maxlength="100000" data-record="papers" data-id="${p.id}" data-field="${field}" aria-label="${label}" placeholder="${placeholder}">${esc(s[field]||'')}</textarea></label>`).join('')}<button class="button small" data-action="export">${icon('download')} 导出全部个人记录</button>`;
  }
  function renderWorkspacePaper(p) {
    const sections=workspaceSections(p),words=byImportOrder(D.english.terms).filter(e=>e.refs.some(r=>r.paper===p.id));
    const header=`<header class="workspace-article-heading"><div class="workspace-article-meta"><span>${esc(p.category)}</span><span>${p.year} · ${p.pages} 页</span>${badge(p)}</div><h1>${esc(p.name)}</h1><p class="workspace-full-title" lang="en">${esc(p.title)}</p><p class="workspace-lead">${esc(p.tagline)}</p><div class="workspace-author">${esc(p.authors)}</div></header>`;
    let content=header;
    if(workspaceTab==='guide')content+=sections.map(([label,title,body],i)=>`<section class="workspace-guide-section" id="workspace-section-${i}"><h2><span>0${i+1}</span>${title}<button data-action="workspace-write" aria-label="记录${label}笔记">${icon('pen')}</button></h2>${body}</section>`).join('')+`<div class="workspace-reading-end"><button class="button" data-action="workspace-write">${icon('pen')} 写笔记</button></div>`;
    if(workspaceTab==='concepts')content+=`<div class="workspace-related-list">${byImportOrder(p.concepts.map(concept)).map(c=>`<button data-action="concept" data-id="${c.id}"><span class="workspace-item-order">${c.importOrder}</span><div><h2>${esc(c.name)}</h2><small>${esc(c.english)}</small><p>${esc(c.summary)}</p></div>${icon('arrow')}</button>`).join('')}</div>`;
    if(workspaceTab==='english')content+=`<div class="workspace-related-list">${words.map(e=>`<button data-action="english-detail" data-id="${e.id}"><span class="workspace-item-order">${e.importOrder}</span><div><h2 lang="en">${esc(e.name)}</h2><small>${esc(e.meaning)}</small><p>${esc(e.usage)}</p></div>${icon('arrow')}</button>`).join('')}</div>`;
    if(workspaceTab==='pdf')content+=`<div class="source-links">${p.reading.map(r=>pdfLink(p,r.page,`p.${r.page} · ${r.label}`)).join('')}</div><iframe class="pdf-viewer workspace-pdf" title="${attr(p.name)} 原文 PDF" src="${pdfURL(p)}"></iframe><p class="source-note">浏览器若未显示 PDF，请用上方“独立打开原文”。</p>`;
    return `<div class="workspace-document-bar"><div class="workspace-document-tabs" role="tablist" aria-label="阅读工作区">${[['guide','文献导读'],['concepts','关联概念'],['english','词汇积累'],['pdf','PDF 原文']].map(([id,label])=>`<button role="tab" aria-selected="${workspaceTab===id}" data-action="workspace-tab" data-value="${id}">${label}</button>`).join('')}</div><div class="workspace-reading-tools"><div class="workspace-font"><button data-action="workspace-font-down" aria-label="缩小阅读字号" ${workspaceFont<=17?'disabled':''}>A−</button><span>${workspaceFont}px</span><button data-action="workspace-font-up" aria-label="放大阅读字号" ${workspaceFont>=23?'disabled':''}>A+</button></div><button data-action="workspace-focus" aria-pressed="${workspaceFocus}">${workspaceFocus?'退出专注':'专注阅读'}</button><a href="${pdfURL(p)}" target="_blank" rel="noopener">独立打开原文 ↗</a></div></div>${workspaceTab==='guide'?`<nav class="workspace-section-nav" aria-label="导读章节">${sections.map(([label],i)=>`<button data-action="workspace-section" data-value="${i}"><span>0${i+1}</span>${label}</button>`).join('')}</nav>`:''}<div class="workspace-reading"><article class="workspace-article">${content}</article><aside class="workspace-side" aria-label="随读笔记与术语"><div class="workspace-side-tabs"><button data-action="workspace-aside" data-value="terms" aria-pressed="${workspaceAside==='terms'}">随读术语 <small>${words.length}</small></button><button data-action="workspace-aside" data-value="notes" aria-pressed="${workspaceAside==='notes'}">我的笔记</button></div><div class="workspace-side-content">${workspaceAside==='notes'?workspaceNotes(p):`${words.map(e=>`<button class="workspace-word" data-action="english-detail" data-id="${e.id}"><small>${e.importOrder}</small><span><strong lang="en">${esc(e.name)}</strong><span>${esc(e.meaning)}</span></span>${icon('arrow')}</button>`).join('')||'<p>这篇文献尚未关联英语条目。</p>'}`}</div></aside></div>`;
  }
  function paperRow(p) { return `<div class="paper-row" data-action="paper" data-id="${p.id}" role="button" tabindex="0" aria-label="查看 ${attr(p.name)}">${symbol(p)}<div><div class="paper-name">${esc(p.name)}</div><div class="paper-meta">${esc(p.category)} · ${esc(p.year)}</div></div><div class="row-right">${badge(p)}</div></div>`; }
  function renderOverview() {
    const read=D.papers.filter(p=>ps(p).status==='read').length;
    const recent=[...state.logs].sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt)).slice(0,3);
    return heading('总览','',`<span class="date-tag">${today().replaceAll('-',' / ')}</span>`)+`
      <section class="overview-stats" aria-label="学习统计">${[
        [D.papers.length,'文献','papers'],[read,'已读','papers'],[D.concepts.length,'概念','concepts'],[state.logs.length,'日志','journal']
      ].map(([n,label])=>`<div class="overview-stat"><strong>${n}</strong><span>${label}</span></div>`).join('')}</section>
      <div class="overview-grid"><section class="panel"><div class="section-heading"><h2>阅读文库</h2><a class="text-link" href="#papers">全部文献 ${icon('arrow')}</a></div>${[...D.papers].reverse().slice(0,5).map(paperRow).join('')}</section>
      <div class="overview-side"><section class="panel overview-todos">${todoWidget()}</section><section class="panel"><div class="section-heading"><h2>最近记录</h2><a class="text-link" href="#journal">全部记录 ${icon('arrow')}</a></div>${recent.map(l=>`<a class="overview-log" href="#journal"><span>${esc(l.title)}</span><time>${esc(l.date)}</time></a>`).join('')||'<p class="overview-empty">暂无记录</p>'}</section><section class="panel"><div class="section-heading"><h2>常用概念</h2><a class="text-link" href="#concepts">全部 ${icon('arrow')}</a></div><div class="concept-strip">${['outliers','scaling','output-error','second-order','svd','qera-exact'].map(id=>`<button class="concept-chip" data-action="concept" data-id="${id}">${esc(concept(id).name)}</button>`).join('')}</div></section></div></div>`;
  }

  function renderExperiments() {
    const entries=D.experimentLearning?.entries||[];
    const id=location.hash.slice(1).split('/')[1]||'';
    const selected=entries.find(e=>e.id===id)||entries.find(e=>e.status==='running')||entries[0];
    if(!selected)return heading('实验与代码','')+'<div class="empty">暂无实验记录。</div>';
    const labels={recorded:'已有记录',running:'启动确认 · 待最终结果',teaching:'教学材料 · 待自评'};
    const list=entries.filter(e=>e.kind===selected.kind).sort((a,b)=>a.importOrder-b.importOrder);
    const experimental=entries.filter(e=>e.kind==='experiment');
    const code=entries.find(e=>e.kind==='code');
    return heading('实验与代码','',`<a class="button" href="#journal">学习日志 ${icon('pen')}</a>`)+
      `<nav class="experiment-tabs" aria-label="实验与代码分类"><a class="${selected.kind==='experiment'?'active':''}" href="#experiments/${experimental.at(-1)?.id||''}">实验记录 <small>${experimental.length}</small></a><a class="${selected.kind==='code'?'active':''}" href="#experiments/${code?.id||''}">代码语法 <small>${entries.filter(e=>e.kind==='code').length}</small></a></nav>
      <div class="experiment-layout"><aside class="experiment-list" aria-label="实验与代码条目">${list.map(e=>`<a href="#experiments/${attr(e.id)}" class="experiment-row ${selected.id===e.id?'selected':''}" ${selected.id===e.id?'aria-current="page"':''}><time>${esc(e.date)}</time><strong>${esc(e.title)}</strong><span>${esc(labels[e.status]||e.status)}</span></a>`).join('')}</aside>
      <article class="experiment-detail" data-experiment-id="${attr(selected.id)}"><header class="experiment-header"><p>${esc(selected.date)} · ${esc(labels[selected.status]||selected.status)}</p><h2>${esc(selected.title)}</h2><p>${esc(selected.summary)}</p><div class="experiment-actions"><button class="button primary" data-action="experiment-review" data-id="${attr(selected.id)}">写复盘</button><a class="button" href="${attr(selected.markdown)}" download>下载 Markdown</a>${selected.paper?`<a class="text-link" href="#papers/${attr(selected.paper)}">关联论文 ↗</a>`:""}</div></header>
      <div class="experiment-body">${selected.bodyHtml}</div>${selected.evidence?.length?`<details class="experiment-evidence"><summary>原始截图 · ${selected.evidence.length} 张</summary>${selected.evidence.map(e=>`<figure><a href="${attr(e.url)}" target="_blank" rel="noopener"><img loading="lazy" src="${attr(e.url)}" alt="${attr(e.label)}"></a><figcaption>${esc(e.label)}</figcaption></figure>`).join('')}</details>`:''}
      <footer class="experiment-footer"><button class="button" data-action="experiment-review" data-id="${attr(selected.id)}">写复盘</button><a class="text-link" href="#journal">查看我的学习日志 ↗</a></footer></article></div>`;
  }

  function renderPapers() {
    if(readingPaper&&paper(readingPaper))return renderWorkspacePaper(paper(readingPaper));
    const list=D.papers.filter(p=>(paperFilter==='all'||(paperFilter==='starred'?ps(p).starred:p.phase===paperFilter))&&(statusFilter==='all'||ps(p).status===statusFilter)&&`${p.name} ${p.title} ${p.tags.join(' ')}`.toLowerCase().includes(paperSearch.toLowerCase()));
    return heading('阅读文库','让每篇论文都有原件、导读、疑问，以及自己的理解。',`<a class="button" href="notes/P1_打地基_四篇论文学习笔记.pdf" target="_blank" rel="noopener">${icon('book')} 四篇基础学习笔记</a>`)+`
      <div class="toolbar"><div class="filter-tabs" aria-label="论文分类">${[['all','全部论文'],['P1','量化与模型基础'],['P2','误差重构'],['P3','误差补偿进阶'],['T1','张量基础'],['T2','张量网络'],['T3','张量应用'],['starred','我的收藏']].map(([id,t])=>`<button class="filter-tab ${paperFilter===id?'active':''}" data-action="paper-filter" data-value="${id}">${t}</button>`).join('')}</div><select id="paper-status-filter" class="field-input" aria-label="按阅读状态筛选"><option value="all">全部阅读状态</option>${statusOptions(statusFilter)}</select><input class="field-input search-field" id="paper-search" placeholder="搜索标题或标签" aria-label="搜索论文" value="${attr(paperSearch)}"></div>
      <div class="paper-library-list">${list.map(p=>`<article class="library-item">${symbol(p)}<div class="library-item-info"><button class="library-title text-link" data-action="paper" data-id="${p.id}">${esc(p.name)}</button><div class="paper-meta">${esc(p.category)} · ${esc(p.venue)} · ${p.pages} 页</div></div><div class="library-item-status">${badge(p)}<small>${ps(p).readDate?esc(ps(p).readDate):'日期未填写'}</small></div><div class="library-item-actions">${star(p)}<a class="button small" href="${pdfURL(p)}" target="_blank" rel="noopener">PDF 原文 ↗</a></div></article>`).join('')}</div>${list.length?'':'<div class="empty">没有符合条件的论文，试试其他分类或关键词。</div>'}<details class="notation"><summary>矩阵约定</summary><p>${esc(D.notation)}</p></details>`;
  }
  // 旧记录保持固定序号；未编号的新导入项依数组顺序接在末尾。
  function byImportOrder(records) { return [...records].sort((a,b)=>(a.importOrder??Number.MAX_SAFE_INTEGER)-(b.importOrder??Number.MAX_SAFE_INTEGER)); }
  function conceptList() { return byImportOrder(D.concepts).filter(c=>(conceptFilter==='all'||(conceptFilter==='collected'?c.captures?.length:c.group===conceptFilter))&&(conceptStage==='all'||(conceptStage==='review'?['unknown','intro'].includes(cs(c).stage):['explain','derive','reproduce'].includes(cs(c).stage)))&&`${c.name} ${c.english} ${c.summary}`.toLowerCase().includes(conceptSearch.toLowerCase())); }
  function readerActions() { return `<div class="reader-actions"><button class="button" data-action="reader-latest">跳到最新</button><button class="button" data-action="reader-schedule" aria-expanded="${readerScheduleOpen}">${readerScheduleOpen?'收起':'展开'}日程与待办</button></div>`; }
  function inlineDetail(record,kind,list) {
    if(!record)return '<section class="dictionary-detail"><div class="empty">没有符合条件的条目，请调整筛选。</div></section>';
    const index=list.findIndex(r=>r.id===record.id);
    let html=kind==='concept'?conceptDetail(record):englishDetail(record);
    html=html.replace('<button class="icon-button" data-action="close-detail" aria-label="关闭卡片">×</button>','').replaceAll('id="detail-title"','id="reader-title"').replaceAll('id="save-indicator"','id="reader-save-indicator"').replaceAll('id="concept-explanation"','id="reader-concept-explanation"').replaceAll('id="capture-','id="reader-capture-').replaceAll('aria-controls="capture-','aria-controls="reader-capture-');
    return `<section class="dictionary-detail" data-reader-id="${record.id}" aria-label="条目详细解释"><div class="reader-pager"><span>${index+1} / ${list.length}</span><div><button class="button small" data-action="reader-prev" ${index===0?'disabled':''}>上一条</button><button class="button small" data-action="reader-next" ${index===list.length-1?'disabled':''}>下一条</button></div></div>${html}</section>`;
  }
  function renderConcepts() {
    const groups=[...new Set(D.concepts.map(c=>c.group))],list=conceptList();
    if(!list.some(c=>c.id===conceptSelected))conceptSelected=list[0]?.id||'';
    return heading('概念笔记','按导入顺序浏览，点击条目即可连续阅读。',readerActions())+`
      <div class="toolbar"><div class="filter-tabs">${[['all','全部'],['review','待理解 / 复习'],['mastered','能解释以上']].map(([id,t])=>`<button class="filter-tab ${conceptStage===id?'active':''}" data-action="concept-stage" data-value="${id}">${t}</button>`).join('')}</div><input class="field-input search-field" id="concept-search" value="${attr(conceptSearch)}" placeholder="搜索概念或英文名" aria-label="搜索概念"><button class="button" data-action="review">复习一个概念</button></div>
      <div class="dictionary-layout"><aside class="dictionary-categories" aria-label="概念分类">${['all','collected',...groups].map(g=>`<button class="category-button ${conceptFilter===g?'active':''}" data-action="concept-filter" data-value="${g}">${g==='all'?'全部概念':g==='collected'?'我的名词积累':esc(g)}<small>${g==='all'?D.concepts.length:g==='collected'?D.concepts.filter(c=>c.captures?.length).length:D.concepts.filter(c=>c.group===g).length}</small></button>`).join('')}</aside><div class="dictionary-list" aria-label="概念条目列表">${list.map(c=>`<button class="dictionary-row ${conceptSelected===c.id?'selected':''}" data-action="reader-select" data-kind="concept" data-id="${c.id}" aria-pressed="${conceptSelected===c.id}"><span class="dictionary-order">${c.importOrder||''}</span><span><strong>${esc(c.name)}</strong><span class="dictionary-translation">${esc(c.english)}</span><small>${stageLabels[cs(c).stage]}</small></span></button>`).join('')||'<div class="empty">没有匹配条目。</div>'}</div>${inlineDetail(concept(conceptSelected),'concept',list)}</div>`;
  }
  function englishMatches(e){return (englishPaper==='all'||(englishPaper==='collected'?e.collected:e.refs.some(r=>r.paper===englishPaper)))&&`${e.name} ${e.meaning} ${e.quote||''} ${e.example||''} ${e.usage||''} ${e.caution||''}`.toLowerCase().includes(englishQuery.toLowerCase());}
  function chooseEnglishQuestion(){
    const all=[...D.english.terms,...D.english.phrases].filter(englishMatches);
    const unmastered=all.filter(e=>es(e).stage!=='explain');
    const candidates=(unmastered.length?unmastered:all).filter(e=>e.id!==englishPracticeID);
    const pool=candidates.length?candidates:all;
    englishPracticeID=pool.length?pool[Math.floor(Math.random()*pool.length)].id:null;englishAnswerShown=false;
  }
  function renderEnglish(){
    const all=englishEntries(),learned=all.filter(e=>es(e).stage==='explain').length;
    const modes=[['terms','词汇与术语'],['phrases','语法与表达'],['sentences','原文精读'],['practice','记忆练习']];
    let content='';
    if(englishMode!=='practice'){
      const list=byImportOrder(D.english[englishMode]).filter(englishMatches);
      if(!list.some(e=>e.id===englishSelected))englishSelected=list[0]?.id||'';
      content=`<div class="dictionary-layout"><aside class="dictionary-categories" aria-label="英语分类"><h3>内容分类</h3>${['terms','phrases','sentences'].map(mode=>`<button class="category-button ${englishMode===mode?'active':''}" data-action="english-mode" data-value="${mode}">${{terms:'词汇与术语',phrases:'语法与表达',sentences:'原文精读'}[mode]}<small>${D.english[mode].length}</small></button>`).join('')}<button class="category-button ${englishPaper==='collected'?'active':''}" data-action="reader-collected">我的截图积累</button></aside><div class="dictionary-list" aria-label="英语条目列表">${list.map(e=>`<button class="dictionary-row ${englishSelected===e.id?'selected':''}" data-action="reader-select" data-kind="english" data-id="${e.id}" aria-pressed="${englishSelected===e.id}"><span class="dictionary-order">${e.importOrder||''}</span><span><strong lang="en">${esc(e.name)}</strong><span class="dictionary-translation">${esc(e.meaning)}</span><small>${e.collected?'我的积累 · ':''}${englishStageLabels[es(e).stage]}</small></span></button>`).join('')||'<div class="empty">没有匹配条目。</div>'}</div>${inlineDetail(englishEntry(englishSelected),'english',list)}</div>`;
    }else{
      if(!englishPracticeID||!englishEntry(englishPracticeID)||!englishMatches(englishEntry(englishPracticeID)))chooseEnglishQuestion();
      const e=englishEntry(englishPracticeID);
      content=e?`<section class="english-practice"><div class="english-practice-head"><div><h2>记忆练习</h2></div><select id="english-direction" class="field-input" aria-label="英语记忆练习方向"><option value="en-zh" ${englishDirection==='en-zh'?'selected':''}>看英文 → 想中文与用法</option><option value="zh-en" ${englishDirection==='zh-en'?'selected':''}>看中文 → 回忆英文</option></select></div><div class="english-prompt" ${englishDirection==='en-zh'?'lang="en"':''}>${esc(englishDirection==='en-zh'?e.name:e.meaning)}</div><p class="english-practice-hint">${englishDirection==='en-zh'?'试着解释它在论文中的意思，并想一个搭配或例句。':'试着回忆英文术语或表达，再说出一句与论文相关的例句。'}</p><div class="english-practice-actions"><button class="button primary" data-action="english-reveal">${englishAnswerShown?'解释已展开':'显示解释'}</button><button class="button" data-action="english-next">换一张 ${icon('arrow')}</button></div>${englishAnswerShown?`<div class="english-answer"><h3>${esc(e.name)} <span>${esc(e.meaning)}</span></h3><p>${esc(e.usage)}</p><blockquote lang="en">${esc(e.example)}</blockquote><p>${esc(e.translation)}</p><small>教学例句 · 非论文原句</small><div class="english-self-rating"><span>由你自评：</span><button class="button small" data-action="english-rate" data-id="${e.id}" data-value="intro">还需要复习</button><button class="button small primary" data-action="english-rate" data-id="${e.id}" data-value="explain">已能解释 / 运用</button></div></div>`:''}<button class="text-link" style="margin-top:24px" data-action="english-detail" data-id="${e.id}">查看原文来源与个人笔记 ↗</button></section>`:'<div class="empty">当前筛选下没有可练习的词汇或表达。</div>';
    }
    return heading('文献英语','按导入顺序积累词汇与表达 · 筛选后保持原顺序。',readerActions()+`<button class="button" data-action="english-mode" data-value="practice">${icon('clock')} 开始记忆练习</button>`)+`<div class="english-overview"><div class="english-metric"><strong>${D.english.terms.length}</strong><span>词汇与术语</span></div><div class="english-metric"><strong>${D.english.phrases.length}</strong><span>语法与表达</span></div><div class="english-metric"><strong>${D.english.sentences.length}</strong><span>原文短句</span></div><div class="english-metric"><strong>${learned}<small> / ${all.length}</small></strong><span>自评能解释 / 运用</span></div></div><div class="toolbar"><div class="filter-tabs">${modes.map(([id,name])=>`<button class="filter-tab ${englishMode===id?'active':''}" data-action="english-mode" data-value="${id}">${name}</button>`).join('')}</div><select id="english-paper-filter" class="field-input" aria-label="按关联论文筛选英语"><option value="all" ${englishPaper==='all'?'selected':''}>全部内容</option><option value="collected" ${englishPaper==='collected'?'selected':''}>我的截图积累</option>${D.papers.map(p=>`<option value="${p.id}" ${englishPaper===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select><input id="english-search" class="field-input search-field" placeholder="搜索英文或中文" aria-label="搜索文献英语" value="${attr(englishQuery)}"></div>${content}`;
  }
  function renderCompare() {
    const quantPapers=D.papers.filter(p=>p.phase.startsWith('P'));
    const tensorPapers=D.papers.filter(p=>p.phase.startsWith('T'));
    const dims=[['target','量化对象'],['objective','核心目标'],['statistic','使用的统计'],['operation','关键操作'],['calibration','校准的用途'],['extra','推理结构 / 成本'],['limit','适用边界']];
    return heading('方法对比','看清各自处理的变量与目标，再比较误差和部署成本。')+`
      <div class="callout">${icon('info')}<div>这是一张方法地图。不同位宽、模型、校准数据、内核和硬件下的实验数值，不能直接用来排高低。</div></div>
      <h2 style="margin-bottom:18px">LLM 量化与误差重构</h2><div class="compare-wrap"><table class="compare-table"><thead><tr><th scope="col">比较维度</th>${quantPapers.map(p=>`<th scope="col"><button class="text-link" data-action="paper" data-id="${p.id}">${esc(p.name)}</button><small class="muted">${esc(p.venue)}</small></th>`).join('')}</tr></thead><tbody>${dims.map(([key,label])=>`<tr><th scope="row">${label}</th>${quantPapers.map(p=>`<td>${esc(p.comparison[key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <div class="comparison-pairs"><article class="panel"><h3>LLM.int8() ↔ SmoothQuant</h3><p>共同关注激活异常值。前者分离少数高精度路径，后者通过缩放让权重与激活共同承担量化难度。</p><button class="text-link" style="margin-top:12px" data-action="concept" data-id="outliers">回到异常值概念 ${icon('arrow')}</button></article><article class="panel"><h3>SmoothQuant ↔ AWQ</h3><p>共享等价缩放的代数形式。前者为 W8A8 平滑激活，后者用激活信息保护低位权重的敏感通道。</p><button class="text-link" style="margin-top:12px" data-action="concept" data-id="scaling">查看等价缩放 ${icon('arrow')}</button></article><article class="panel"><h3>GPTQ ↔ QERA</h3><p>都关心输入统计如何放大误差。前者在量化中更新剩余权重，后者固定量化主体并另加低秩重构项。</p><button class="text-link" style="margin-top:12px" data-action="concept" data-id="output-error">理解两种误差目标 ${icon('arrow')}</button></article></div><article class="panel" style="margin-top:24px"><h3>LQER / L²QER ↔ QERA</h3><p>LQER 对权重误差直接做 SVD；L²QER 用经验激活幅度加权后重构。QERA 以期望层输出误差为目标：exact 使用完整二阶矩，approx 在原文假设下使用通道 RMS。形式相近，但缩放依据与最优性结论不同。</p><button class="text-link" style="margin-top:12px" data-action="concept" data-id="lqer-weighted">查看加权重构与统计区别 ↗</button></article><article class="panel" style="margin-top:24px"><h3>EoRA ↔ QERA-exact</h3><p>二者均将输入统计进入低秩输出重构。EoRA 用特征基与特征值平方根进行加权，QERA-exact 使用二阶矩平方根；在相同统计和可逆条件下可对应到同一类目标。具体校准估计、数值处理和推理实现需要分别核对。EoRA 还处理剪枝，并强调任务特定补偿。</p><button class="text-link" data-action="concept" data-id="eora-eigenspace">查看朝向转换与条件 ↗</button></article><article class="panel" style="margin-top:24px"><h3>ZeroQuant-V2 / LoRC ↔ 加权重构</h3><p>LoRC 直接截断权重误差的 SVD；L²QER 用经验激活缩放，QERA 与 EoRA 将输入二阶统计进入输出重构目标。ZeroQuant-V2 还系统研究量化覆盖、粒度和模型家族，不只是一条补偿公式。</p><button class="text-link" data-action="concept" data-id="zeroquant-v2-baseline">查看 LoRC 构造与原文 ↗</button></article><section class="panel" style="margin-top:24px"><div class="section-heading"><h2>张量方法与应用</h2></div><p class="muted">先比较表示对象与结构；综述和应用论文的实验不能直接排名。</p><div class="compare-wrap"><table class="compare-table"><thead><tr><th>文献</th><th>核心结构 / 操作</th><th>证据与边界</th></tr></thead><tbody>${tensorPapers.map(p=>`<tr><th><button class="text-link" data-action="paper" data-id="${p.id}">${esc(p.name)}</button></th><td>${esc(p.mechanism)}</td><td>${esc(p.caveat)}</td></tr>`).join('')}</tbody></table></div><h3 style="margin-top:20px">连接 QERA 与张量分解</h3><p>QERA 对矩阵量化误差做低秩补偿；CP、Tucker、TT、TR 对多阶张量施加不同结构。共同的问题是秩、目标误差和参数成本；矩阵截断 SVD 的最优性不能直接推广给所有张量分解。</p></section><div class="notation">教学对比依据各论文方法部分。QERA-exact / approx 的区别可从 QERA 卡片进入；公式采用统一行样本约定。</div>`;
  }
  function backupBar() { return `<div class="backup-bar"><div><h3 style="font-size:13px">备份</h3><p>更换浏览器或清理缓存前，请导出记录。</p></div><div class="backup-actions"><button class="button small" data-action="export">${icon('download')} 导出记录</button><button class="button small" data-action="import">${icon('upload')} 导入备份</button></div></div>`; }
  function renderJournal() {
    const logs=[...state.logs].sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt));
    return heading('学习日志','记录真正发生过的阅读、推导和实验，让理解的变化看得见。')+backupBar()+`
      <div class="log-layout"><section class="panel"><div class="section-heading"><h2>写一条学习记录</h2></div><form id="journal-form"><label class="field"><span>标题</span><input name="title" maxlength="200" placeholder="例如：终于分清 AWQ 与 SmoothQuant" required></label><div class="detail-forms" style="grid-template-columns:1fr 1fr;margin-bottom:17px"><label class="field"><span>日期</span><input name="date" type="date" value="${today()}" required></label><label class="field"><span>类型</span><select name="kind">${['阅读','复习','推导','实验','想法'].map(k=>`<option>${k}</option>`).join('')}</select></label></div><label class="field"><span>关联论文</span><select name="paper"><option value="">不关联特定论文</option>${D.papers.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><label class="field"><span>今天学到了什么？</span><textarea name="text" required maxlength="100000" placeholder="记录理解、卡住的地方，或实验设置与结果。" style="min-height:150px"></textarea></label><button class="button primary" type="submit">${icon('pen')} 保存学习记录</button></form></section><section class="panel"><div class="section-heading"><h2>我的记录 <small>${logs.length} 条</small></h2></div>${logs.map(l=>`<article class="log-entry"><div class="log-entry-head"><span class="badge neutral">${esc(l.kind)}</span><h3 style="font-size:13px">${esc(l.title)}</h3><span class="log-date">${esc(l.date)}</span></div><p>${esc(l.text)}</p><div class="log-footer">${paper(l.paper)?`<button class="text-link" data-action="paper" data-id="${l.paper}">${esc(paper(l.paper).name)} ↗</button>`:'<span></span>'}<button class="danger-link" data-action="delete-log" data-id="${attr(l.id)}">删除记录</button></div></article>`).join('')||'<div class="empty">暂无记录</div>'}</section></div>`;
  }
  function todoTime(value) { return value?T.localInput(value).replace('T',' '):'未设置'; }
  function captureTodoDraft() { const f=$('#todo-form');if(f)todoDraft=Object.fromEntries(new FormData(f)); }
  function todoStatus(t) { return t.done?'已完成':t.archived?'已归档':t.dueAt&&Date.parse(t.dueAt)<Date.now()?'已逾期':T.due(t)?'提醒时间已到':'待完成'; }
  function todoWidget() {
    const open=state.todos.filter(t=>!t.done&&!t.archived).sort((a,b)=>(a.dueAt||'9999').localeCompare(b.dueAt||'9999'));
    return `<section class="todo-widget"><div class="todo-widget-head"><h3>待办事项 <small>${open.length}</small></h3><a class="text-link" href="#todos">管理 / 新增 ↗</a></div>${open.slice(0,2).map(t=>`<div class="todo-mini ${T.due(t)?'is-due':''}"><strong>${esc(t.title)}</strong><small>${esc(todoStatus(t))} · ${t.dueAt?esc(todoTime(t.dueAt)):'不限日期'}</small><button class="text-link" data-action="todo-done" data-id="${t.id}">标记完成</button></div>`).join('')||'<p class="schedule-help">暂无待办</p>'}</section>`;
  }
  function renderTodos() {
    const list=state.todos.filter(t=>todoFilter==='all'||(todoFilter==='done'?t.done&&!t.archived:todoFilter==='archive'?t.archived:!t.done&&!t.archived)).sort((a,b)=>(a.dueAt||'9999').localeCompare(b.dueAt||'9999'));
    const permission='Notification' in window?Notification.permission:'unsupported';
    const notificationText=permission==='granted'?'系统通知已获允许':permission==='denied'?'系统通知被浏览器禁用；仍显示页内提醒':permission==='unsupported'?'当前浏览器仅支持页内提醒':'可启用系统通知';
    return heading('待办与提醒','把学习的下一步记下来，按截止时间安排。')+`<div class="todo-reminder-help"><strong>${notificationText}</strong><p>网页打开时检查到期事项；后台或电脑休眠可能延迟。关闭网页后不会运行提醒，重新打开会补查。需要关闭网页后提醒，可将事项导出并导入系统日历。导出后若修改或完成事项，请在日历中同步更新或取消。</p><button class="button" data-action="todo-notifications">启用 / 检查系统通知</button><span class="todo-timezone">所有时间均为北京时间</span></div><div class="todo-layout"><section class="panel todo-editor"><h2>${todoEditing?'编辑待办':'新增待办'}</h2><form id="todo-form"><label class="field"><span>事项标题</span><input name="title" maxlength="200" placeholder="例如：推导 QERA 的加权 SVD 解" required></label><label class="field"><span>截止时间 · 可留空</span><input name="dueAt" type="datetime-local"></label><label class="field"><span>提醒时间 · 可留空</span><input name="remindAt" type="datetime-local"></label><p class="schedule-help">提醒时间可以早于截止时间。未设置提醒时间时，仅列入待办清单。</p><label class="field"><span>关联论文</span><select name="paper"><option value="">不关联特定论文</option>${D.papers.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><label class="field"><span>说明</span><textarea name="notes" maxlength="10000" placeholder="具体要完成什么，或需要准备什么？"></textarea></label><div class="todo-form-actions"><button class="button primary" type="submit">${todoEditing?'保存修改':'添加待办'}</button><button class="button" type="button" data-action="todo-reset">${todoEditing?'取消编辑':'清空'}</button></div></form></section><section class="todo-list"><div class="filter-tabs">${[['open','待完成'],['done','已完成'],['archive','已归档'],['all','全部']].map(([v,label])=>`<button class="filter-tab ${todoFilter===v?'active':''}" data-action="todo-filter" data-value="${v}">${label}</button>`).join('')}</div>${list.map(t=>`<article class="todo-card ${t.done?'is-done':''} ${T.due(t)?'is-due':''}"><div class="todo-card-head"><span class="badge">${esc(todoStatus(t))}</span><h3>${esc(t.title)}</h3></div><p class="todo-dates">截止：${esc(todoTime(t.dueAt))}<br>提醒：${esc(todoTime(t.remindAt))}</p>${t.notes?`<p class="todo-notes">${esc(t.notes)}</p>`:''}${paper(t.paper)?`<button class="text-link" data-action="paper" data-id="${t.paper}">${esc(paper(t.paper).name)} ↗</button>`:''}<div class="todo-actions"><button class="button small" data-action="todo-done" data-id="${t.id}">${t.done?'恢复待办':'标记完成'}</button><button class="button small" data-action="todo-edit" data-id="${t.id}">编辑</button>${!t.done&&!t.archived&&T.due(t)?`<button class="button small" data-action="todo-snooze" data-id="${t.id}">10 分钟后提醒</button>`:''}${t.dueAt?`<button class="text-link" data-action="todo-calendar" data-id="${t.id}">导出日历</button>`:''}<button class="text-link" data-action="todo-archive" data-id="${t.id}">${t.archived?'恢复归档':'归档'}</button></div></article>`).join('')||'<div class="empty">暂无待办</div>'}</section></div>`+backupBar();
  }
  function renderReminderBanner() {
    const list=state.todos.filter(t=>T.due(t));
    $('#todo-reminders').hidden=!list.length;
    $('#todo-reminders').innerHTML=list.length?`<div class="reminder-banner" role="status"><strong>有 ${list.length} 项待办已到提醒时间</strong><span>${list.slice(0,2).map(t=>esc(t.title)).join('；')}</span><a class="button small" href="#todos">查看与处理</a></div>`:'';
  }
  async function checkTodoReminders() {
    if(reminderBusy||corruptState)return;reminderBusy=true;
    const run=()=>{
      // 在锁内读最新状态，减少同一浏览器多个页面的重复通知。
      if(storageOK)try{const raw=localStorage.getItem(KEY);if(raw)state.todos=cleanState(JSON.parse(raw)).todos;}catch(e){}
      const pending=T.pending(state.todos);
      if(pending.length){for(const t of pending){t.notifiedFor=t.remindAt;t.updatedAt=now();}persist();
        toast(`${pending.length} 项待办已到提醒时间，请查看待办提醒。`);
        if('Notification' in window&&Notification.permission==='granted')try{
          const notification=new Notification('学习待办提醒',{body:pending.slice(0,3).map(t=>t.title).join('；'),tag:'zhiliang-study-todos'});
          notification.onclick=()=>{window.focus();location.hash='todos';notification.close();};
          notification.onerror=()=>toast('系统通知未能显示，待办仍保留在页内提醒中。');
        }catch(e){toast('系统通知不可用，请查看页内待办提醒。');}
      }
      renderReminderBanner();
    };
    try{if(navigator.locks)await navigator.locks.request('zhiliang-todo-reminders',run);else run();}finally{reminderBusy=false;}
  }
  function captureScheduleDraft() {
    const form=$('#schedule-form');
    if(form)scheduleDraft=Object.fromEntries(new FormData(form));
  }
  function eventsOn(date) {
    const logs=state.logs.filter(l=>l.date===date).map(l=>({...l,recordType:'log'}));
    const read=D.papers.filter(p=>ps(p).readDate===date&&!logs.some(l=>l.paper===p.id&&l.kind==='阅读')).map(p=>({title:p.name+' · 阅读完成',kind:'阅读',text:'来自论文卡片的阅读日期。',paper:p.id,recordType:'paper'}));
    const todos=state.todos.filter(t=>!t.archived&&t.dueAt&&T.day(t.dueAt)===date).map(t=>({title:t.title,kind:t.done?'已完成待办':'待办',text:'截止 '+todoTime(t.dueAt),paper:t.paper,recordType:'todo'}));
    return [...logs,...read,...todos];
  }
  function renderSchedule(capture=true) {
    if(capture)captureScheduleDraft();
    const [year,month]=scheduleMonth.split('-').map(Number);
    const offset=(new Date(year,month-1,1).getDay()+6)%7;
    const days=new Date(year,month,0).getDate();
    const dateOf=n=>`${scheduleMonth}-${String(n).padStart(2,'0')}`;
    const entries=eventsOn(scheduleDate);
    $('#study-schedule').innerHTML=`<button class="button reader-dismiss" data-action="reader-schedule">收起日程 ×</button><div class="schedule-heading"><h2>学习日程</h2><button class="schedule-today" data-action="schedule-today">今天</button></div>${todoWidget()}<div class="calendar-month"><button class="calendar-arrow" data-action="schedule-month" data-value="-1" aria-label="上一个月">‹</button><strong>${year} 年 ${month} 月</strong><button class="calendar-arrow" data-action="schedule-month" data-value="1" aria-label="下一个月">›</button></div><div class="calendar-grid" role="group" aria-label="${year}年${month}月学习日期">${['一','二','三','四','五','六','日'].map(day=>`<span class="calendar-weekday">${day}</span>`).join('')}${'<span aria-hidden="true"></span>'.repeat(offset)}${Array.from({length:days},(_,i)=>{const date=dateOf(i+1),count=eventsOn(date).length;return `<button class="calendar-day ${date===today()?'is-today':''} ${date===scheduleDate?'selected':''} ${count?'has-record':''}" data-action="schedule-date" data-value="${date}" aria-pressed="${date===scheduleDate}" aria-label="${date}${date===today()?' 今天':''}${count?'，'+count+' 条学习记录':''}">${i+1}</button>`;}).join('')}</div><p class="calendar-legend">圆点表示有学习记录或到期待办</p><h3 class="schedule-day-heading">${esc(scheduleDate.replaceAll('-',' / '))}<span>${entries.length} 条记录</span></h3><div class="schedule-events">${entries.map(e=>`<article class="schedule-event"><small>${esc(e.kind)}</small><strong>${esc(e.title)}</strong><p>${esc(e.text.length>130?e.text.slice(0,130)+'…':e.text)}</p>${paper(e.paper)?`<button class="text-link" data-action="paper" data-id="${attr(e.paper)}">${esc(paper(e.paper).name)} ↗</button>`:''}</article>`).join('')||'<p class="schedule-empty">暂无记录</p>'}</div>${scheduleOpen?`<form id="schedule-form" class="schedule-form"><label class="field"><span>记录日期</span><input type="date" name="date" value="${scheduleDate}" required></label><label class="field"><span>标题</span><input name="title" maxlength="200" placeholder="今天读了什么？" required></label><label class="field"><span>类型</span><select name="kind">${['阅读','复习','推导','实验','想法'].map(k=>`<option>${k}</option>`).join('')}</select></label><label class="field"><span>关联论文</span><select name="paper"><option value="">不关联特定论文</option>${D.papers.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><label class="field"><span>学习内容</span><textarea name="text" required maxlength="100000" placeholder="收获、疑问，或下一步准备做什么。"></textarea></label><div class="schedule-form-actions"><button type="submit" class="button primary">保存记录</button><button type="button" class="button" data-action="schedule-cancel">收起</button></div><p class="schedule-help">保存后会同步显示在学习日志中。</p></form>`:'<button class="button primary schedule-add" data-action="schedule-add">+ 添加学习记录</button>'}`;
    const form=$('#schedule-form');
    if(form&&scheduleDraft)for(const [name,value] of Object.entries(scheduleDraft)){const field=form.elements.namedItem(name);if(field)field.value=value;}
  }
  function render() {
    const sideScroll=$('.workspace-side')?.scrollTop||0;
    const listScroll=$('.dictionary-list')?.scrollTop||0;
    const readerScroll=$('.dictionary-detail')?.scrollTop||0, priorReaderID=$('.dictionary-detail')?.dataset.readerId;
    captureTodoDraft();
    const priorForm=$('#journal-form');
    if(priorForm) journalDraft=Object.fromEntries(new FormData(priorForm));
    $('#main').className='route-'+route;
    $('#main').classList.toggle('workspace-paper-open',route==='papers'&&!!readingPaper);
    document.body.classList.toggle('workspace-focus',workspaceFocus&&route==='papers'&&!!readingPaper);
    document.documentElement.style.setProperty('--workspace-reading-size',workspaceFont+'px');
    $('.learning-layout').classList.toggle('reader-mode',['concepts','english','experiments'].includes(route));
    $('.learning-layout').classList.toggle('reader-schedule-open',readerScheduleOpen);
    renderNavigation();$('#main').innerHTML=({overview:renderOverview,papers:renderPapers,concepts:renderConcepts,english:renderEnglish,compare:renderCompare,todos:renderTodos,journal:renderJournal,experiments:renderExperiments})[route]();
    if($('.workspace-side'))$('.workspace-side').scrollTop=sideScroll;
    const freshForm=$('#journal-form');
    if(freshForm&&journalDraft)for(const [name,value] of Object.entries(journalDraft)){const field=freshForm.elements.namedItem(name);if(field)field.value=value;}
    if($('.dictionary-list'))$('.dictionary-list').scrollTop=listScroll;
    if(priorReaderID&&$('.dictionary-detail')?.dataset.readerId===priorReaderID)$('.dictionary-detail').scrollTop=readerScroll;
    renderSchedule();
    const todoForm=$('#todo-form');if(todoForm&&todoDraft)for(const [name,value] of Object.entries(todoDraft)){const field=todoForm.elements.namedItem(name);if(field)field.value=value;}
    renderReminderBanner();
    if(!storageOK) $('#main').insertAdjacentHTML('afterbegin',`<div class="callout" style="margin-bottom:20px">${icon('info')}<span>${corruptState?'检测到旧记录无法解析，已保留原始存储且暂停覆盖。请先导出原始记录，再检查备份。':'浏览器存储不可用，记录仅保留在本次打开的页面中。请导出备份。'}</span><button class="button small" data-action="export">导出记录</button></div>`);
  }
  function navigate() { const [target,id]=location.hash.slice(1).split('/');route=navs.some(n=>n[0]===target)?target:'overview';const next=route==='papers'&&paper(id)?id:'';if(next!==readingPaper){workspaceTab='guide';workspaceFocus=false;}readingPaper=next;render();$('#sidebar').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');window.scrollTo(0,0); }
  function openDetail(kind,id,tab='summary') {
    const r=kind==='paper'?paper(id):kind==='english'?englishEntry(id):concept(id);if(!r)return;
    if(kind==='paper'){$('#sidebar').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');if($('#detail-dialog').open)$('#detail-dialog').close();if($('#search-dialog').open)$('#search-dialog').close();workspaceTab=tab==='pdf'?'pdf':'guide';if(tab==='notes')workspaceAside='notes';if(location.hash==='#papers/'+id){readingPaper=id;route='papers';render();}else location.hash='papers/'+id;return;}
    detail={kind,id};detailTab=tab;renderDetail();const dialog=$('#detail-dialog');if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
  }
  function renderDetail() {
    const r=detail.kind==='paper'?paper(detail.id):detail.kind==='english'?englishEntry(detail.id):concept(detail.id);
    $('#detail-content').innerHTML=detail.kind==='paper'?paperDetail(r):detail.kind==='english'?englishDetail(r):conceptDetail(r,detailTab==='review');
  }
  function captureSources(record) {
    if(!record.captures?.length)return '';
    return `<section class="detail-section collection-sources"><h3>我的积累来源</h3><button class="button capture-toggle" data-action="capture-toggle" aria-expanded="false" aria-controls="capture-${record.id}">查看原始截图 · ${record.captures.length} 张</button><div class="capture-gallery" id="capture-${record.id}" hidden>${record.captures.map(file=>{const url=file.split('/').map(encodeURIComponent).join('/');return `<figure><img src="${attr(url)}" alt="${attr(record.name)} 的积累截图" loading="lazy"><figcaption><a class="source-link" href="${attr(url)}" target="_blank" rel="noopener">独立查看原始截图 ↗</a></figcaption></figure>`;}).join('')}</div></section>`;
  }
  function englishDetail(e){
    const s=es(e);
    const body=e.englishType==='sentence'?`<div class="detail-section"><h3>论文原文 · 短句</h3><blockquote class="english-quote" lang="en">${esc(e.quote)}</blockquote><button class="button small" data-action="english-speak" data-id="${e.id}">本机朗读英文</button></div><div class="detail-section"><h3>中文解释</h3><p>${esc(e.meaning)}</p></div><div class="detail-section"><h3>句子拆解</h3><ol class="english-analysis">${e.analysis.map(a=>`<li>${esc(a)}</li>`).join('')}</ol></div>`:`<div class="detail-section"><h3>意思与用法</h3><p>${esc(e.meaning)} · ${esc(e.usage)}</p><button class="button small" style="margin-top:12px" data-action="english-speak" data-id="${e.id}">本机朗读英文</button></div><div class="detail-section"><h3>教学例句 · 非论文原句</h3><blockquote class="english-quote" lang="en">${esc(e.example)}</blockquote><p>${esc(e.translation)}</p></div><div class="detail-section"><h3>阅读时注意</h3><p>${esc(e.caution)}</p></div>`;
    return `<div class="detail-header"><div class="detail-topline"><span class="eyebrow">${esc(e.group)}</span><button class="icon-button" data-action="close-detail" aria-label="关闭卡片">×</button></div><h2 id="detail-title" ${e.englishType==='sentence'?'':'lang="en"'}>${esc(e.name)}</h2></div><div class="detail-body">${body}${captureSources(e)}<div class="detail-section"><h3>${e.englishType==='sentence'?'原文位置':'关联阅读 · 技术语境'}</h3><div class="source-links">${refs(e.refs)}</div></div><label class="field"><span>我的掌握程度 · 自评</span><select data-record="english" data-id="${e.id}" data-field="stage">${Object.entries(englishStageLabels).map(([k,v])=>`<option value="${k}" ${s.stage===k?'selected':''}>${v}</option>`).join('')}</select></label><div class="save-indicator" id="save-indicator">${storageOK?'自动保存':'请导出备份以保存记录'}</div><label class="field"><span>我的搭配、例句与疑问</span><textarea maxlength="100000" data-record="english" data-id="${e.id}" data-field="notes" placeholder="用这个术语写一句话，或记录容易混淆的意思。">${esc(s.notes)}</textarea></label><button class="button" data-action="export">${icon('download')} 导出全部个人记录</button></div>`;
  }
  function speakEnglish(id){
    const e=englishEntry(id),engine=window.speechSynthesis;
    if(!engine){toast('当前浏览器不支持本机语音，可继续使用文字练习。');return;}
    const voice=engine.getVoices().find(v=>/^en(?:-|_)/i.test(v.lang)&&v.localService);
    if(!voice){toast('未找到本地英语语音，可继续使用文字练习。');return;}
    const utterance=new SpeechSynthesisUtterance(e.quote||e.example||e.name);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.88;engine.cancel();engine.speak(utterance);
  }
  function detailHeader(r,isPaper) { return `<div class="detail-header"><div class="detail-topline"><span class="eyebrow">${isPaper?esc(r.phase+' · '+r.category):esc(r.group+'')}</span><button class="icon-button" data-action="close-detail" aria-label="关闭卡片">×</button></div><h2 id="detail-title">${esc(isPaper?r.name:r.name)}</h2><p class="detail-title-full">${esc(isPaper?r.title:r.english)}</p>${isPaper?`<div class="detail-tabs" role="tablist" aria-label="论文卡片内容">${[['summary','论文导读'],['notes','我的笔记'],['pdf','PDF 原文']].map(([id,label])=>`<button class="detail-tab ${detailTab===id?'active':''}" role="tab" aria-selected="${detailTab===id}" data-action="detail-tab" data-value="${id}">${label}</button>`).join('')}</div>`:''}</div>`; }
  function paperDetail(p) {
    let body='';const s=ps(p);
    if(detailTab==='summary') body=`<div class="detail-section"><h3>它回答什么问题</h3><p>${esc(p.question)}</p></div><div class="detail-section"><h3>方法如何工作</h3><p>${esc(p.mechanism)}</p>${equation(p)}</div><div class="detail-section"><h3>一条实验依据</h3><p>${esc(p.evidence)}</p></div><div class="detail-section"><h3>理解时保留的边界</h3><p>${esc(p.caveat)}</p></div><div class="detail-section"><h3>回到原文</h3><div class="source-links">${p.reading.map(r=>pdfLink(p,r.page,r.label+` · p.${r.page}`)).join('')}</div><p class="source-note">${esc(p.source)}<br>原文版本：${esc(p.version)} · ${p.pages} 页；年份为首次预印本年，会议年份另列。</p></div><div class="detail-section"><h3>关联概念</h3><div class="concept-strip" style="margin-top:0">${p.concepts.map(id=>`<button class="concept-chip" data-action="concept" data-id="${id}">${esc(concept(id).name)}</button>`).join('')}</div></div><div class="detail-section"><h3>读完试着独立回答</h3>${p.checks.map((q,i)=>`<div class="question-item"><p>${i+1}. ${esc(q)}</p><small>可把你的答案记入“我的笔记”，再对照原文。</small></div>`).join('')}</div><button class="button primary" data-action="detail-tab" data-value="notes">${icon('pen')} 写笔记</button>`;
    if(detailTab==='notes') body=`<div class="save-indicator" id="save-indicator">${storageOK?'已保存':'请导出备份以保存记录'}</div><div class="detail-forms"><label class="field"><span>阅读状态</span><select data-record="papers" data-id="${p.id}" data-field="status">${statusOptions(s.status)}</select></label><label class="field"><span>掌握程度 · 自评</span><select data-record="papers" data-id="${p.id}" data-field="stage">${stageOptions(s.stage)}</select></label><label class="field"><span>阅读完成日期</span><input type="date" data-record="papers" data-id="${p.id}" data-field="readDate" value="${attr(s.readDate)}"></label></div><p class="notes-intro" style="margin-top:15px">阅读状态、日期与掌握程度由你记录；以下保存你的输入，与论文导读独立。</p>${[['understanding','我的理解','用自己的话解释研究问题、方法和关键公式。'],['evidence','证据与实验记录','写明模型、校准数据、位宽、group size、rank 和评估设置。'],['questions','疑问与下一步','还不能解释什么？准备怎样推导或验证？']].map(([key,label,placeholder])=>`<label class="field"><span>${label}</span><textarea maxlength="100000" data-record="papers" data-id="${p.id}" data-field="${key}" placeholder="${placeholder}">${esc(s[key]||'')}</textarea></label>`).join('')}<button class="button" data-action="export">${icon('download')} 导出全部个人记录</button>`;
    if(detailTab==='pdf') body=`<div class="section-heading"><div><h3>本地归档原件</h3><small class="muted">${p.pages} 页 · ${esc(p.version)}</small></div><a class="button" href="${pdfURL(p)}" target="_blank" rel="noopener">独立打开 ${icon('external')}</a></div><div class="source-links">${p.reading.map(r=>pdfLink(p,r.page,`p.${r.page} · ${r.label}`)).join('')}</div><iframe class="pdf-viewer" title="${attr(p.name)} 原文 PDF" src="${pdfURL(p)}"></iframe><p class="source-note">如果浏览器未显示内嵌 PDF，请点击“独立打开”。原件路径：${esc(p.pdf)}</p>`;
    return detailHeader(p,true)+`<div class="detail-body">${body}</div>`;
  }
  function conceptDetail(c,review=false) {
    const s=cs(c);
    return detailHeader(c,false)+`<div class="detail-body">${review?`<section class="review-panel"><h3>先试着回答</h3><p>${esc(c.question)}</p><button class="button small" data-action="show-answer">查看概念导读</button><div id="review-answer" class="review-answer" hidden>对照讲解后自评。</div></section>`:''}<div id="concept-explanation" ${review?'hidden':''}>${conceptTeaching(c)}<div class="detail-section"><h3>容易混淆</h3><p>${esc(c.misconception)}</p></div>${c.lesson?`<section class="detail-section"><h3>自测</h3><details class="lesson-check"><summary>${inlineMath(c.lesson.check.question)}</summary><div>${lessonText(c.lesson.check.answer)}</div></details></section>`:''}<div class="detail-section"><h3>原文来源</h3><div class="source-links">${refs(c.refs)}</div></div><div class="detail-section"><h3>相关概念</h3><div class="concept-strip" style="margin-top:0">${c.related.map(id=>`<button class="concept-chip" data-action="concept" data-id="${id}">${esc(concept(id).name)}</button>`).join('')}</div></div></div>${captureSources(c)}<div class="concept-detail-top"><label class="field"><span>我的掌握程度</span><select data-record="concepts" data-id="${c.id}" data-field="stage">${stageOptions(s.stage)}</select></label><button class="button small" data-action="review-next">下一个概念 ${icon('arrow')}</button></div><div class="save-indicator" id="save-indicator">${storageOK?'自动保存':'请导出备份以保存记录'}</div><label class="field"><span>我的解释、例子与疑问</span><textarea maxlength="100000" data-record="concepts" data-id="${c.id}" data-field="notes" aria-label="我的解释、例子与疑问" placeholder="写下你的理解或问题。">${esc(s.notes)}</textarea></label><div class="source-links">${[...new Set(c.refs.map(r=>r.paper))].map(id=>`<button class="button small" data-action="paper" data-id="${id}">${esc(paper(id).name)} ↗</button>`).join('')}</div></div>`;
  }
  function lessonText(text) {
    return String(text||'').split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${inlineMath(p)}</p>`).join('');
  }
  function lessonMath(latex) {
    if(!latex)return '';
    let html=esc(latex),rendered=false;
    if(window.katex){try{html=window.katex.renderToString(latex,{displayMode:true,throwOnError:true,trust:false,strict:'warn',output:'htmlAndMathml'});rendered=true;}catch(error){console.error('教学公式排版失败',error.message);}}
    return `<div class="equation lesson-equation" data-math-rendered="${rendered}">${html}</div>`;
  }
  function conceptTeaching(c) {
    const l=c.lesson;
    if(!l)return `<div class="detail-section"><h3>定义</h3><p>${esc(c.summary)}</p></div><div class="detail-section"><h3>直观理解</h3><p>${esc(c.explanation)}</p>${equation(c)}</div>`;
    return `<section class="detail-section"><h3>定义</h3><p>${esc(c.summary)}</p></section><section class="detail-section"><h3>直观理解</h3>${lessonText(l.intuition)}${equation(c)}<details class="lesson-symbols"><summary>符号与维度</summary><div><table><thead><tr><th scope="col">符号</th><th scope="col">含义</th></tr></thead><tbody>${l.symbols.map(([symbol,meaning])=>`<tr><th scope="row">${inlineMath(symbol)}</th><td>${inlineMath(meaning)}</td></tr>`).join('')}</tbody></table></div></details></section><section class="detail-section"><h3>推导与步骤 · 教学补充</h3><ol class="lesson-steps">${l.steps.map(s=>`<li><h4>${inlineMath(s.title)}</h4>${lessonText(s.text)}${lessonMath(s.latex)}</li>`).join('')}</ol></section><section class="detail-section lesson-example"><h3>教学例子</h3>${lessonText(l.example.text)}${lessonMath(l.example.latex)}</section><section class="detail-section"><h3>与其他方法的联系</h3>${lessonText(l.connection)}</section>`;
  }
  function openSearch() { $('#search-dialog').showModal();$('#global-search').value='';searchResults('');$('#global-search').focus(); }
  function searchResults(q) {
    const term=q.trim().toLowerCase();
    const results=[...D.papers.map(p=>({kind:'paper',id:p.id,name:p.name,sub:p.tagline,text:`${p.name} ${p.title} ${p.tags.join(' ')}`})),...D.concepts.map(c=>({kind:'concept',id:c.id,name:c.name,sub:c.english,text:`${c.name} ${c.english} ${c.summary} ${c.explanation}`})),...englishEntries().map(e=>({kind:'english',id:e.id,name:e.name,sub:e.meaning,text:`${e.name} ${e.meaning} ${e.quote||''} ${e.example||''}`})),...(D.experimentLearning?.entries||[]).map(e=>({kind:'experiment',id:e.id,name:e.title,sub:e.summary,text:e.searchText}))].filter(r=>!term||r.text.toLowerCase().includes(term));
    $('#search-results').innerHTML=results.map(r=>`<button class="search-result" data-action="search-result" data-kind="${r.kind}" data-id="${r.id}"><span class="search-result-type">${r.kind==='paper'?'论文':r.kind==='english'?'英语':r.kind==='experiment'?'实验/代码':'概念'}</span><span>${esc(r.name)}<small>${esc(r.sub)}</small></span>${icon('arrow')}</button>`).join('')||'<div class="empty">未找到匹配内容，试试其他关键词。</div>';
  }
  async function copyFormula(kind,id) {
    const r=kind==='paper'?paper(id):concept(id);
    try { await navigator.clipboard.writeText(r.latex);toast('LaTeX 公式已复制'); }
    catch(e) { const temp=document.createElement('textarea');temp.value=r.latex;document.body.append(temp);temp.select();const ok=document.execCommand('copy');temp.remove();toast(ok?'LaTeX 公式已复制':'复制失败，请从 data.js 中查看 LaTeX 字段。'); }
  }
  function exportBackup(raw=false) {
    let output=state;
    if(corruptState || raw) { try { output={unparsedRecord:localStorage.getItem(KEY),exportedAt:now(),notice:'原始记录解析失败，保留用于恢复。'}; } catch(e) { output=state; } }
    else output={...state,exportedAt:now(),libraryUpdatedAt:D.updatedAt};
    const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download=`知量-学习记录-${today()}-${Date.now()}${corruptState?'-原始恢复':''}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已导出，请把备份保存在 backups 文件夹');
  }
  function reviewNext() {
    const candidates=D.concepts.filter(c=>['unknown','intro'].includes(cs(c).stage));
    const pool=(candidates.length?candidates:D.concepts).filter(c=>c.id!==detail?.id);
    openDetail('concept',(pool.length?pool:D.concepts)[Math.floor(Math.random()*(pool.length||D.concepts.length))].id,'review');
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('#navigation a')){$('#sidebar').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');}
    const el=event.target.closest('[data-action]');if(!el)return;
    const {action,id,value,kind}=el.dataset;
    if(action==='experiment-review') {
      const record=D.experimentLearning?.entries.find(e=>e.id===id);if(!record)return;
      if(!journalDraft||(!journalDraft.title?.trim()&&!journalDraft.text?.trim()))journalDraft={date:today(),title:'复盘：'+record.title,text:'',kind:record.kind==='experiment'?'实验':'复习',paper:record.paper};
      else toast('已保留原有学习日志草稿。');
      if(location.hash==='#journal'){route='journal';render();}else location.hash='journal';
      return;
    }
    if(action.startsWith('workspace-')) {
      if(action==='workspace-open'){openDetail('paper',id);return;}
      if(action==='workspace-schedule'){readerScheduleOpen=!readerScheduleOpen;render();return;}
      if(action==='workspace-tab'){workspaceTab=value;render();return;}
      if(action==='workspace-aside'){workspaceAside=value;render();return;}
      if(action==='workspace-write'){workspaceAside='notes';workspaceFocus=false;render();$('.workspace-side textarea')?.focus();return;}
      if(action==='workspace-section'){$('#workspace-section-'+value)?.scrollIntoView({behavior:'smooth',block:'start'});return;}
      if(action==='workspace-focus'){workspaceFocus=!workspaceFocus;render();return;}
      if(action==='workspace-font-up'||action==='workspace-font-down'){workspaceFont=Math.max(17,Math.min(23,workspaceFont+(action==='workspace-font-up'?1:-1)));render();return;}
      return;
    }
    if(action.startsWith('reader-')) {
      if(action==='reader-schedule'){readerScheduleOpen=!readerScheduleOpen;render();return;}
      if(action==='reader-collected'){englishPaper=englishPaper==='collected'?'all':'collected';render();return;}
      if(action==='reader-latest'&&englishMode==='practice')englishMode='terms';
      const readerKind=route==='concepts'?'concept':'english';
      const list=readerKind==='concept'?conceptList():byImportOrder(D.english[englishMode]||[]).filter(englishMatches);
      const selected=readerKind==='concept'?conceptSelected:englishSelected,index=list.findIndex(r=>r.id===selected);
      const next=action==='reader-select'?id:action==='reader-latest'?list.at(-1)?.id:action==='reader-next'?list[index+1]?.id:list[index-1]?.id;
      if(next){if(readerKind==='concept')conceptSelected=next;else englishSelected=next;render();$('.dictionary-list .selected')?.scrollIntoView({block:'nearest'});}
      return;
    }
    if(action.startsWith('todo-')) {
      const t=state.todos.find(t=>t.id===id);
      if(action==='todo-filter'){todoFilter=value;render();return;}
      if(action==='todo-reset'){todoEditing='';todoDraft=null;$('#todo-form')?.remove();render();return;}
      if(action==='todo-edit'&&t){$('#todo-form')?.remove();todoEditing=id;todoDraft={title:t.title,notes:t.notes,paper:t.paper,dueAt:T.localInput(t.dueAt),remindAt:T.localInput(t.remindAt)};render();$('#todo-form [name="title"]').focus();return;}
      if(action==='todo-notifications'){
        if(!('Notification' in window)){toast('当前浏览器不支持系统通知，可使用页内提醒或导出日历。');return;}
        if(Notification.permission==='denied'){toast('请在浏览器的网站设置中允许通知；页内提醒仍可用。');return;}
        Notification.requestPermission().then(permission=>{toast(permission==='granted'?'已允许系统通知，页面需保持打开。':'未启用系统通知，继续使用页内提醒。');render();}).catch(()=>toast('系统通知不可用，可导出到系统日历。'));return;
      }
      if(!t)return;
      if(action==='todo-calendar'){
        const url=URL.createObjectURL(new Blob([T.calendar(t)],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`学习待办-${t.id}.ics`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('请将日历文件导入系统日历，并确认该日历启用了提醒。');return;
      }
      if(action==='todo-done')t.done=!t.done;
      if(action==='todo-archive')t.archived=!t.archived;
      if(action==='todo-snooze'){t.remindAt=new Date(Date.now()+600000).toISOString();t.notifiedFor='';}
      t.updatedAt=now();persist();render();checkTodoReminders();return;
    }
    if(action.startsWith('schedule-')) {
      captureScheduleDraft();
      if(action==='schedule-month') {const [y,m]=scheduleMonth.split('-').map(Number);const date=new Date(y,m-1+Number(value),1);scheduleMonth=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;}
      if(action==='schedule-date'||action==='schedule-today') {scheduleDate=action==='schedule-today'?today():value;scheduleMonth=scheduleDate.slice(0,7);if(scheduleDraft)scheduleDraft.date=scheduleDate;}
      if(action==='schedule-add') {scheduleOpen=true;scheduleDraft={...(scheduleDraft||{}),date:scheduleDate};}
      if(action==='schedule-cancel')scheduleOpen=false;
      renderSchedule(false);
      if(action==='schedule-add')$('#schedule-form [name="title"]').focus();
      return;
    }
    if(action==='concept'&&route==='concepts'&&!$('#detail-dialog').open){conceptSelected=id;if(!conceptList().some(c=>c.id===id)){conceptFilter='all';conceptSearch='';conceptStage='all';}render();$('.dictionary-list .selected')?.scrollIntoView({block:'nearest'});}
    else if(action==='paper'||action==='concept') openDetail(action,id);
    else if(action==='english-detail')openDetail('english',id);
    else if(action==='english-mode'){englishMode=value;render();}
    else if(action==='english-reveal'){englishAnswerShown=true;render();}
    else if(action==='english-next'){chooseEnglishQuestion();render();}
    else if(action==='english-rate'){updateRecord('english',id,'stage',value);chooseEnglishQuestion();render();toast('已保存你的英语学习自评');}
    else if(action==='english-speak')speakEnglish(id);
    else if(action==='capture-toggle'){const gallery=$('#'+el.getAttribute('aria-controls'));gallery.hidden=!gallery.hidden;el.setAttribute('aria-expanded',String(!gallery.hidden));}
    else if(action==='close-detail') $('#detail-dialog').close();
    else if(action==='close-search') $('#search-dialog').close();
    else if(action==='detail-tab') {detailTab=value;renderDetail();$('#detail-dialog').scrollTop=0;}
    else if(action==='star') {updateRecord('papers',id,'starred',!ps(paper(id)).starred);render();}
    else if(action==='paper-filter') {paperFilter=value;render();}
    else if(action==='concept-filter') {conceptFilter=value;render();}
    else if(action==='concept-stage') {conceptStage=value;render();}
    else if(action==='copy-formula') copyFormula(kind,id);
    else if(action==='export') exportBackup();
    else if(action==='import') $('#import-file').click();
    else if(action==='review'||action==='review-next') reviewNext();
    else if(action==='show-answer') {$('#concept-explanation').hidden=false;$('#review-answer').hidden=false;el.hidden=true;}
    else if(action==='search-result') {$('#search-dialog').close();if(kind==='experiment')location.hash='experiments/'+id;else openDetail(kind,id);}
    else if(action==='delete-log') {if(confirm('删除这条学习记录？建议先导出备份。')){state.logs=state.logs.filter(l=>l.id!==id);persist();render();toast('记录已删除');}}
  });
  document.addEventListener('input',event=>{
    const el=event.target;
    if(el.id==='workspace-shelf-search'){workspaceShelfQuery=el.value;document.querySelectorAll('.workspace-shelf-paper').forEach(button=>{const p=paper(button.dataset.id);button.hidden=!`${p.name} ${p.title}`.toLowerCase().includes(el.value.toLowerCase());});if(el.value)document.querySelectorAll('.workspace-shelf-list details').forEach(group=>group.open=true);}
    if(el.dataset.record) updateRecord(el.dataset.record,el.dataset.id,el.dataset.field,el.value);
    if(el.id==='global-search') searchResults(el.value);
    if(el.id==='paper-search'||el.id==='concept-search'||el.id==='english-search') {
      const id=el.id,pos=el.selectionStart;
      if(id==='paper-search')paperSearch=el.value;else if(id==='concept-search')conceptSearch=el.value;else englishQuery=el.value;
      render();const input=$('#'+id);input.focus();try{input.setSelectionRange(pos,pos);}catch(e){}
    }
  });
  document.addEventListener('change',event=>{
    const el=event.target;
    if(el.id==='paper-status-filter'){statusFilter=el.value;render();}
    if(el.id==='english-paper-filter'){englishPaper=el.value;englishPracticeID=null;render();}
    if(el.id==='english-direction'){englishDirection=el.value;englishAnswerShown=false;render();}
    if(el.dataset.record){updateRecord(el.dataset.record,el.dataset.id,el.dataset.field,el.value);render();}
  });
  document.addEventListener('submit',event=>{
    if(event.target.id==='todo-form') {
      event.preventDefault();const form=event.target,values=new FormData(form),title=String(values.get('title')||'').trim();
      if(!title){toast('请填写待办标题。');return;}
      const dueInput=String(values.get('dueAt')||''),remindInput=String(values.get('remindAt')||'');
      const dueAt=T.fromInput(dueInput),remindAt=T.fromInput(remindInput);
      if((dueInput&&!dueAt)||(remindInput&&!remindAt)){toast('请填写有效日期和时间。');return;}
      const previous=state.todos.find(t=>t.id===todoEditing);
      const t={id:previous?.id||(crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`),title,notes:String(values.get('notes')||'').trim(),paper:String(values.get('paper')||''),dueAt,remindAt,done:previous?.done||false,archived:previous?.archived||false,createdAt:previous?.createdAt||now(),updatedAt:now(),notifiedFor:previous?.remindAt===remindAt?previous.notifiedFor:''};
      if(previous)Object.assign(previous,t);else state.todos.push(t);
      const saved=persist();todoEditing='';todoDraft=null;form.remove();render();toast(saved?'待办已保存':'暂存在本次页面，请立即导出备份');checkTodoReminders();return;
    }
    if(!['journal-form','schedule-form'].includes(event.target.id))return;event.preventDefault();const form=event.target;const data=new FormData(form);
    const title=String(data.get('title')).trim(),text=String(data.get('text')).trim();if(!title||!text){toast('请填写标题与学习内容。');return;}
    state.logs.push({id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,date:String(data.get('date')),title,text,kind:String(data.get('kind')),paper:String(data.get('paper')),createdAt:now()});persist();
    scheduleDate=String(data.get('date'));scheduleMonth=scheduleDate.slice(0,7);
    if(form.id==='schedule-form'){scheduleDraft=null;scheduleOpen=false;form.remove();}else{journalDraft=null;form.reset();}
    render();toast('学习记录已保存');
  });
  $('#import-file').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try {
      if(file.size>5*1024*1024)throw new Error('备份文件超过 5 MB，无法导入。');
      const incoming=cleanState(JSON.parse(await file.text()));
      if(!confirm('导入并合并备份？同一卡片和待办保留更新时间较新的记录；日志按 ID 合并。当前记录会先自动导出一份备份。')){event.target.value='';return;}
      exportBackup();
      for(const group of ['papers','concepts','english'])for(const [id,r] of Object.entries(incoming[group]))if(!state[group][id]||(r.updatedAt||'')>=(state[group][id].updatedAt||''))state[group][id]=r;
      if(incoming.workspace&&(!state.workspace||(incoming.workspace.updatedAt||'')>(state.workspace.updatedAt||'')))state.workspace={...state.workspace,...incoming.workspace};
      state.todos=T.normalize([...state.todos,...incoming.todos]);
      state.appliedUpdates=[...new Set([...state.appliedUpdates,...incoming.appliedUpdates])];
      const logs=new Map(state.logs.map(l=>[l.id,l]));for(const l of incoming.logs)if(!logs.has(l.id))logs.set(l.id,l);state.logs=[...logs.values()];
      corruptState=false;persist();render();if(detail&&$('#detail-dialog').open)renderDetail();toast('备份已导入并合并');
    } catch(e) {toast('导入失败：'+e.message);}finally{event.target.value='';}
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#detail-dialog').open&&!$('#search-dialog').open){e.preventDefault();openSearch();}
    const row=e.target.closest('.paper-row');if(row&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openDetail('paper',row.dataset.id);}
  });
  $('#detail-dialog').addEventListener('close',()=>render());
  for(const selector of ['#detail-dialog','#search-dialog'])$(selector).addEventListener('click',e=>{if(e.target!==$(selector))return;const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();});
  $('#search-button').addEventListener('click',openSearch);$('#search-icon').innerHTML=icon('search');
  $('#menu-button').innerHTML=icon('menu');$('#menu-button').addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');$('#menu-button').setAttribute('aria-expanded',String(open));});
  $('#updated-date').textContent=D.updatedAt;
  if(window.speechSynthesis)window.speechSynthesis.getVoices();
  window.addEventListener('hashchange',navigate);
  window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{state=cleanState(JSON.parse(e.newValue));render();if(detail&&$('#detail-dialog').open&&document.activeElement.tagName!=='TEXTAREA')renderDetail();}catch(err){toast('另一个页面的记录格式异常，请先导出备份。');}}});
  navigate();
  checkTodoReminders();
  setInterval(checkTodoReminders,15000);
  window.addEventListener('focus',checkTodoReminders);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkTodoReminders();});
})();
