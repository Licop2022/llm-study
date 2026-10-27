(() => {
  'use strict';
  const data = window.STUDY_DATA;
  const assetBase = '';
  const storage=window.STUDY_WORKSPACE_STORAGE, saved=storage.snapshot();
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const prose = value => window.STUDY_MATH_TEXT.render(value || '', window.katex);
  const formula = value => value ? `<div class="formula">${window.katex.renderToString(value, {displayMode:true,throwOnError:true,trust:false})}</div>` : '';
  const ordered = items => [...items].sort((a,b) => (a.importOrder ?? 0) - (b.importOrder ?? 0));
  const projects = [{id:'quant',realm:'papers',name:'量化与模型基础'},{id:'tensor',realm:'papers',name:'张量方法与应用'},{id:'battery',realm:'practice',name:'电池健康预测 · D2'},{id:'rag',realm:'practice',name:'RAG 实战'}];
  const areas = {papers:'论文学习',practice:'项目实践'};
  const navigation = {
    papers:{overview:'学习总览',reading:'论文阅读',roadmap:'学习路线',concepts:'概念库',english:'英语积累',drill:'专项复习',review:'复习计划',notes:'阅读笔记'},
    practice:{overview:'项目总览',roadmap:'学习路线',tasks:'任务看板',experiments:'实验记录',code:'代码学习',notes:'项目复盘'}
  };
  const areaPaths = {papers:'#papers/quant/overview',practice:'#practice/rag/overview'};
  const sections = {overview:'总览',tasks:'任务看板',reading:'论文阅读',concepts:'概念库',english:'英语积累',experiments:'实验记录',code:'代码学习',review:'复习计划',notes:'笔记',roadmap:'学习路线',graph:'知识图谱',drill:'专项复习'};
  const sectionName = () => navigation[route.realm][route.section] || sections[route.section];
  const types = {paper:'论文',concept:'概念',english:'英语',case:'实验与代码'};
  const englishDomains = data.english.domains;
  const englishDomain = x => x.raw.learningDomain;
  const englishType = x => englishDomains[englishDomain(x)].types[x.group];
  const recordStatus = value => ({recorded:'已归档',running:'已启动 · 结果待补',teaching:'教学整理'}[value] || value || '');
  const paper = id => data.papers.find(p => p.id === id);
  const items = [
    ...data.papers.map(p => ({kind:'paper',id:p.id,title:p.name,subtitle:p.title,summary:p.tagline,raw:p})),
    ...ordered(data.concepts).map(c => ({kind:'concept',id:c.id,title:c.name,subtitle:c.english,summary:c.summary,raw:c})),
    ...['terms','phrases','sentences'].flatMap(group => ordered(data.english[group]).map(e => ({kind:'english',id:e.id,title:e.name || e.quote,subtitle:e.meaning,summary:e.usage || e.meaning,group,raw:e}))),
    ...ordered(data.experimentLearning.entries).map(e => ({kind:'case',id:e.id,title:e.title,subtitle:recordStatus(e.status),summary:e.summary,raw:e}))
  ].map(x => ({...x,key:`${x.kind}:${x.id}`,search:[x.title,x.subtitle,x.summary,x.raw.usage,...(x.raw.tags || [])].join(' ').normalize('NFKC').toLocaleLowerCase()}));
  const byKey = key => items.find(x => x.key === key);
  const refs = x => x.kind === 'paper' ? [{paper:x.id,page:1}] : x.raw.refs || (x.raw.paper ? [{paper:x.raw.paper,page:x.raw.page || 1}] : []);
  function belongs(x,project) {
    if (!x) return false;
    if (x.kind === 'case') return project === (x.id.startsWith('rag-') ? 'rag' : 'battery');
    return ['quant','tensor'].includes(project) && refs(x).some(r => paper(r.paper)?.phase.startsWith(project === 'quant' ? 'P' : 'T'));
  }
  const homeProject = x => projects.find(p => belongs(x,p.id))?.id || 'quant';
  const sectionOf = x => x.kind === 'case' ? (x.raw.kind === 'code' ? 'code' : 'experiments') : ({paper:'reading',concept:'concepts',english:'english'}[x.kind]);
  const path = (section,id = '',project = route.project) => `#${projects.find(p => p.id === project).realm}/${project}/${section}${id ? `/${id}` : ''}`;
  const url = (x,project = route.project) => path(sectionOf(x),x.id,belongs(x,project) ? project : homeProject(x));
  const source = r => paper(r.paper) ? `<a href="${assetBase}${encodeURI(paper(r.paper).pdf)}#page=${r.page}" target="_blank" rel="noopener">${esc(paper(r.paper).name)} · p.${esc(r.page)} ↗</a>` : '';
  const today = () => new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());

  // Version 1 personal records remain in the same origin and storage key.
  const tasks = saved.tasks, notes = new Map(saved.notes), plans = new Map(saved.plans), levels = new Map(saved.levels), listStates = new Map(), visited = saved.visited || [], scrolls = new Map();
  let route = {}, previousHash = '', observer, lastReading=saved.lastReading, readingSize = saved.readingSize || 20, serial = Date.now(), toastTimer, dialogOrigin;
  function notify(message) { $('#message').textContent = message; $('#message').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#message').classList.remove('visible'),2600); }
  function listState() { const key = `${route.project}/${route.section}`; if (!listStates.has(key)) listStates.set(key,{q:'',tab:'concept'}); return listStates.get(key); }
  function readRoute() {
    let [realm,project,section,id] = location.hash.slice(1).split('/');
    if(['journal','todos','compare'].includes(realm)){location.replace('classic.html'+location.hash);return {realm:'papers',project:'quant',section:'overview'};}
    if(realm==='papers'&&(!project||!['quant','tensor'].includes(project))){const x=byKey('paper:'+project);id=x?.id;project=x?homeProject(x):'quant';section='reading';}
    if(['concepts','english','experiments'].includes(realm)){const kind={concepts:'concept',english:'english',experiments:'case'}[realm],x=byKey(kind+':'+project);section=realm;id=x?.id;project=x?homeProject(x):realm==='experiments'?'rag':'quant';realm=projects.find(p=>p.id===project).realm;if(x)section=sectionOf(x);} 
    if (!areas[realm]) {
      const oldProject = realm, oldSection = project, part = section;
      project = oldProject === 'rag' ? 'rag' : oldProject === 'tensor' && oldSection === 'experiments' ? 'battery' : oldProject === 'tensor' ? 'tensor' : 'quant';
      realm = projects.find(p => p.id === project).realm;
      section = oldSection === 'knowledge' ? (part === 'english' ? 'english' : 'concepts') : oldSection;
      id = oldSection === 'knowledge' ? id : part;
      if (section === 'experiments' && byKey(`case:${id}`)?.raw.kind === 'code') section = 'code';
    }
    if (!projects.some(p => p.id === project && p.realm === realm)) project = realm === 'practice' ? 'rag' : 'quant';
    if (!navigation[realm][section] && section !== 'graph') section = 'overview';
    const kind = {reading:'paper',concepts:'concept',english:'english',experiments:'case',code:'case'}[section];
    const item = byKey(`${kind}:${id}`);
    const topic = section === 'roadmap' ? window.STUDY_LEARNING.topics.find(t => t.id === id && t.projects.includes(project)) : null;
    return {realm,project,section,topic,item:item && belongs(item,project) && sectionOf(item) === section ? item : null};
  }
  function shell() {
    const currentProject = projects.find(p => p.id === route.project), projectItems = items.filter(x => belongs(x,route.project));
    const counts = {tasks:tasks.filter(t => t.project === route.project && !t.done).length,reading:projectItems.filter(x => x.kind === 'paper').length,concepts:projectItems.filter(x => x.kind === 'concept').length,english:projectItems.filter(x => x.kind === 'english').length,experiments:projectItems.filter(x => sectionOf(x) === 'experiments').length,code:projectItems.filter(x => sectionOf(x) === 'code').length,review:[...plans.values()].filter(p => p.project === route.project && p.date <= today()).length,notes:[...notes.values()].filter(n => n.project === route.project && n.text.trim()).length};
    $('#sidebar').innerHTML = `<div class="brand"><img src="${assetBase}assets/gdut-logo-footer.png" alt="广东工业大学校徽"><strong>科研工作台</strong></div><div class="project-picker"><label for="project">${route.realm === 'papers' ? '研究方向' : '实践项目'}</label><select id="project">${projects.filter(p => p.realm === route.realm).map(p => `<option value="${p.id}" ${p.id === route.project ? 'selected' : ''}>${p.name}</option>`).join('')}</select></div><nav class="section-nav" aria-label="${areas[route.realm]}导航">${Object.entries(navigation[route.realm]).map(([key,label]) => `<a href="${path(key)}" ${(key === route.section || key === 'roadmap' && route.section === 'graph') ? 'aria-current="page"' : ''}><span>${label}</span>${key in counts ? `<span class="nav-count">${counts[key]}</span>` : ''}</a>`).join('')}</nav><div class="side-context" id="side-context"></div><div class="side-footer"><button data-record-manager>记录与备份</button></div>`;
    $('#area-nav').innerHTML = Object.entries(areas).map(([id,name]) => `<a href="${areaPaths[id]}" ${route.realm === id ? 'aria-current="page"' : ''}>${name}</a>`).join('');
    $('#breadcrumbs').innerHTML = `<span>${areas[route.realm]}</span><span>/</span><a href="${path('overview')}">${esc(currentProject.name)}</a><span>/</span>${(route.item || route.topic) ? `<a href="${path(route.section)}">${sectionName()}</a><span>/</span><span class="crumb-current" aria-current="page">${esc((route.item || route.topic).title)}</span>` : `<span aria-current="page">${sectionName()}</span>`}`;
    $('#context-tool').dataset.tool = route.realm === 'papers' ? 'continue' : 'tasks';
    $('#context-tool').textContent = route.realm === 'papers' ? '继续阅读' : '任务看板';
    $('#notes-tool').textContent = route.realm === 'papers' ? '阅读笔记' : '项目复盘';
    const related = visited.map(byKey).filter(x => belongs(x,route.project)).slice(0,4);
    $('#side-context').innerHTML = `<h2>${route.realm === 'papers' ? '最近阅读' : '最近查看'}</h2>${related.map(x => `<a href="${url(x)}">${esc(x.title)}</a>`).join('') || `<p>${route.realm === 'papers' ? '打开文献、概念或英语后显示在这里。' : '打开实验或代码记录后显示在这里。'}</p>`}`;
  }
  const heading = (title,sub = '',actions = '') => `<div class="page-heading"><div><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div>${actions ? `<div class="actions">${actions}</div>` : ''}</div>`;
  const action = (name,key,label) => `<button data-action="${name}" data-key="${esc(key)}">${label}</button>`;
  const taskRows = rows => rows.map(t => `<div class="task-row ${t.done ? 'done' : ''}"><input type="checkbox" data-done="${t.id}" ${t.done ? 'checked' : ''} aria-label="完成任务：${esc(t.title)}"><div><p>${esc(t.title)}</p><small>${t.material && byKey(t.material) ? `<a href="${url(byKey(t.material),t.project)}">${esc(byKey(t.material).title)}</a>` : ''}${t.due ? `　<span class="${!t.done && t.due < today() ? 'overdue' : ''}">${esc(t.due)}${!t.done && t.due < today() ? ' · 逾期' : ''}</span>` : ''}</small></div><button data-delete-task="${t.id}" aria-label="删除任务：${esc(t.title)}">×</button></div>`).join('');
  function noteRows(rows) {
    return rows.map(([key,n]) => `<button class="note-card" data-action="note" data-key="${esc(key)}"><strong>${esc(n.title)}</strong><p>${esc(n.text.slice(0,150))}</p></button>`).join('');
  }
  function overview() {
    const own = items.filter(x => belongs(x,route.project)), isPaper = route.realm === 'papers';
    const resources = own.filter(x => sectionOf(x) === (isPaper ? 'reading' : 'experiments'));
    const ownTasks = tasks.filter(t => t.project === route.project), ownPlans = [...plans.values()].filter(p => p.project === route.project && p.date <= today());
    const ownNotes = [...notes.entries()].filter(([key,n]) => (n.project === route.project || belongs(byKey(key),route.project)) && n.text.trim());
    const metrics = isPaper ? [['reading',resources.length,'篇论文'],['concepts',own.filter(x => x.kind === 'concept').length,'个概念'],['english',own.filter(x => x.kind === 'english').length,'项英语'],['review',ownPlans.length,'项待复习']] : [['tasks',ownTasks.filter(t => !t.done).length,'项未完成'],['experiments',resources.length,'份实验记录'],['code',own.filter(x => sectionOf(x) === 'code').length,'节代码学习'],['notes',ownNotes.length,'篇复盘']];
    $('#main').innerHTML = `${heading(projects.find(p => p.id === route.project).name,'',isPaper ? `<a class="primary" href="${path('reading')}">打开论文库</a>` : `<button class="primary" data-new-task>新建任务</button><button data-project-note>写项目复盘</button>`)}<div class="stats">${metrics.map(([section,count,label]) => `<a href="${path(section)}"><strong>${count}</strong><span>${label} →</span></a>`).join('')}</div><div class="dashboard"><div><section class="panel"><header><h2>${isPaper ? '论文阅读' : '实验与实践记录'}</h2><a href="${path(isPaper ? 'reading' : 'experiments')}">全部 →</a></header>${isPaper && lastReading && belongs(byKey(lastReading.key),route.project) ? `<a class="entry-row row-link" href="${url(byKey(lastReading.key))}"><div><span class="tag">继续阅读</span><strong>${esc(byKey(lastReading.key).title)}</strong></div><span>接着读 →</span></a>` : ''}${resources.map(x => `<a class="entry-row row-link" href="${url(x)}"><div><strong>${esc(x.title)}</strong><p>${esc(x.summary)}</p></div><small>${isPaper ? `${x.raw.year} · ${x.raw.initialStatus === 'read' ? '已读' : '待读'}` : esc(x.raw.date || '')}</small></a>`).join('')}</section>${!isPaper ? `<section class="panel"><header><h2>代码学习</h2><a href="${path('code')}">全部 →</a></header>${own.filter(x => sectionOf(x) === 'code').map(x => `<a class="entry-row row-link" href="${url(x)}"><div><strong>${esc(x.title)}</strong><p>${esc(x.summary)}</p></div><span>查看 →</span></a>`).join('') || '<div class="empty">该项目暂未收录独立的代码讲解。</div>'}</section>` : ''}</div><div>${isPaper ? `<section class="panel"><header><h2>今日待复习 <span class="tag">${ownPlans.length}</span></h2><a href="${path('review')}">全部计划 →</a></header>${ownPlans.length ? planRows(ownPlans) : '<div class="empty">暂无到期内容。阅读页可安排复习日期。</div>'}</section><section class="panel"><header><h2>查阅与积累</h2></header><a class="entry-row row-link" href="${path('roadmap')}"><div><strong>专题学习路线</strong><p>从前置知识走到论文与应用</p></div><span>→</span></a><a class="entry-row row-link" href="${path('drill')}"><div><strong>词汇与概念专项</strong><p>回忆、自测与薄弱项复练</p></div><span>→</span></a><a class="entry-row row-link" href="${path('concepts')}"><div><strong>概念库</strong><p>定义、公式推导、教学算例与原文来源</p></div><span>→</span></a><a class="entry-row row-link" href="${path('english')}"><div><strong>英语积累</strong><p>词汇、学术表达与原文短句</p></div><span>→</span></a></section>` : `<section class="panel"><header><h2>下一步任务 <span class="tag">${ownTasks.filter(t => !t.done).length}</span></h2><a href="${path('tasks')}">看板 →</a></header><div class="panel-body"><form id="quick-task" class="inline-form"><input type="text" name="title" aria-label="下一步任务" placeholder="写下项目下一步…" required maxlength="240"><button class="primary">添加</button></form></div>${ownTasks.some(t => !t.done) ? taskRows(ownTasks.filter(t => !t.done).slice(0,5)) : '<div class="empty">暂无任务，可从实验或代码页关联资料。</div>'}</section>`}<section class="panel"><header><h2>${isPaper ? '阅读笔记与疑问' : '项目复盘'}</h2><a href="${path('notes')}">全部 →</a></header>${ownNotes.length ? noteRows(ownNotes.slice(0,3)) : `<div class="empty">${isPaper ? '记录阅读理解、推导过程与疑问。' : '记录项目过程、问题、结论与后续计划。'}</div>`}<div class="panel-body"><button data-project-note>${isPaper ? '新建阅读笔记' : '写项目复盘'}</button></div></section></div></div>`;
  }
  function notesPage() {
    const own = [...notes.entries()].filter(([key,n]) => (n.project === route.project || belongs(byKey(key),route.project)) && n.text.trim());
    $('#main').innerHTML = `${heading(sectionName(),'',`<button class="primary" data-project-note>${route.realm === 'papers' ? '新建阅读笔记' : '新建项目复盘'}</button>`)}<div class="note-list">${own.length ? noteRows(own) : `<div class="panel empty">${route.realm === 'papers' ? '暂无阅读笔记。在论文或概念页点击“笔记”记录理解与疑问。' : '暂无项目复盘。在实验或代码页点击“写复盘”记录过程与结论。'}</div>`}</div>`;
  }
  function tasksPage() {
    const state = listState(), own = tasks.filter(t => t.project === route.project), filtered = own.filter(t => state.tab === 'all' || (state.tab === 'done' ? t.done : !t.done));
    $('#main').innerHTML = `${heading('任务看板',`${own.filter(t => t.done).length} / ${own.length} 已完成`,`<button class="primary" data-new-task>新建任务</button>`)}<div class="list-toolbar"><div class="tabbar">${[['open','未完成'],['done','已完成'],['all','全部']].map(([k,t]) => `<button data-task-tab="${k}" aria-pressed="${(state.tab === k) || (k === 'open' && !['done','all'].includes(state.tab))}">${t}</button>`).join('')}</div></div><div class="data-list">${filtered.length ? taskRows(filtered) : '<div class="empty">没有这类任务。</div>'}</div>`;
  }
  function listPage() {
    const state = listState(), english = route.section === 'english';
    if(english && !state.domain)state.domain='general';
    const domain=englishDomains[state.domain], own=items.filter(x=>x.kind==='english'&&belongs(x,route.project));
    $('#main').innerHTML = `${heading(sectionName())}${english?`<div class="english-domains" role="group" aria-label="英语学习范畴">${Object.entries(englishDomains).map(([id,d])=>`<button data-english-domain="${id}" aria-pressed="${state.domain===id}">${esc(d.name)}<span>${own.filter(x=>englishDomain(x)===id).length}</span></button>`).join('')}</div>`:''}<div class="list-toolbar"><input type="search" id="list-search" aria-label="搜索当前栏目" value="${esc(state.q)}" placeholder="在${english?domain.name:sectionName()}中搜索…">${english ? `<select id="english-group" aria-label="英语类别"><option value="">全部${esc(domain.name)}</option>${Object.entries(domain.types).map(([k,t]) => `<option value="${k}" ${state.group === k ? 'selected' : ''}>${t}</option>`).join('')}</select>` : ''}<span id="result-count" class="result-count"></span></div><div id="list-results"></div>`;
    listResults();
  }
  function listResults() {
    const state = listState(), knowledge = ['concepts','english'].includes(route.section);
    const tokens = state.q.trim().normalize('NFKC').toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const found = items.filter(x => belongs(x,route.project) && sectionOf(x) === route.section && tokens.every(t => x.search.includes(t)) && (x.kind !== 'english' || englishDomain(x)===(state.domain||'general') && (!state.group || state.group === x.group)));
    $('#result-count').textContent = `${found.length} 项${knowledge ? ' · 按导入顺序' : ''}`;
    $('#list-results').innerHTML = `<div class="data-list ${knowledge ? 'knowledge-list' : ''}">${found.map(x => `<a class="data-row" href="${url(x)}"><div><h2>${esc(x.title)}</h2><p>${esc(x.subtitle)}</p>${x.kind !== 'english' ? `<p class="summary">${esc(x.summary)}</p>` : ''}</div>${!knowledge ? `<span>${x.kind === 'paper' ? `${x.raw.phase} · ${x.raw.year}` : esc(x.raw.date || '')}</span><span class="open">${x.kind === 'paper' ? '阅读' : '查看'} →</span>` : `<span class="tag">${esc(x.kind === 'concept' ? x.raw.group : englishType(x))}</span>`}</a>`).join('') || `<div class="empty">${state.q ? '没有匹配的内容。' : '当前' + (route.realm === 'papers' ? '方向' : '项目') + '暂无这类资料。'}</div>`}</div>`;
  }
  function collectionSources(x) {
    return x.captures?.length ? `<details><summary>我的积累截图（${x.captures.length}）</summary><div class="source">${x.captures.map((file,i)=>`<a href="${esc(assetBase+encodeURI(file))}" target="_blank" rel="noopener">截图 ${i+1} ↗</a>`).join('')}</div></details>` : '';
  }
  function lesson(c) {
    const l = c.lesson;
    if (!l) return `<p>${prose(c.explanation)}</p>${collectionSources(c)}`;
    return `<p>${prose(l.intuition)}</p><dl class="symbols">${(l.symbols || []).map(([s,t]) => `<dt>${prose(s)}</dt><dd>${prose(t)}</dd>`).join('')}</dl>${l.steps.map(s => `<h3>${esc(s.title)}</h3><p>${prose(s.text)}</p>${formula(s.latex)}`).join('')}<div class="example"><h3>教学算例</h3><p>${prose(l.example.text)}</p>${formula(l.example.latex)}</div><h3>方法联系</h3><p>${prose(l.connection)}</p><details><summary>自测：${prose(l.check.question)}</summary><p>${prose(l.check.answer)}</p></details><div class="source"><span>讲解与算例为教学整理</span>${(c.refs || []).map(source).join('')}</div>${collectionSources(c)}`;
  }
  function englishBody(x) {
    return `<p class="lead">${prose(x.meaning)}</p>${x.quote ? `<h2>原文节选</h2><blockquote lang="en">${esc(x.quote)}</blockquote>` : ''}${x.usage ? `<h2>用法</h2><p>${prose(x.usage)}</p>` : ''}${x.example ? `<h2>教学例句</h2><p lang="en">${esc(x.example)}</p><p>${esc(x.translation)}</p>` : ''}${x.analysis ? `<h2>句子分析</h2>${Array.isArray(x.analysis) ? `<ul>${x.analysis.map(text=>`<li>${prose(text)}</li>`).join('')}</ul>` : `<p>${prose(x.analysis)}</p>`}` : ''}${x.caution ? `<h2>易混之处</h2><p>${prose(x.caution)}</p>` : ''}<div class="source">${(x.refs || []).map(source).join('')}</div>${collectionSources(x)}`;
  }
  function assessControls(key) {
    return `<div class="self-actions"><span>掌握程度</span>${[['weak','待巩固'],['clear','能独立解释']].map(([level,text]) => `<button data-level="${level}" data-key="${key}" aria-pressed="${levels.get(key) === level}">${text}</button>`).join('')}<span class="muted">${levels.has(key) ? '' : '未自评'}</span></div>`;
  }
  function itemPage(x) {
    const raw = x.raw;
    visited.splice(0,visited.length,...[x.key,...visited.filter(k => k !== x.key)]);
    let body, toc = [];
    if (x.kind === 'paper') {
      const concepts = raw.concepts.map(id => data.concepts.find(c => c.id === id)).filter(c => c && (x.id !== 'attention-2017' || c.id.startsWith('tr-')));
      toc = [{id:'paper-intro',title:'问题与思路'},...concepts.map(c => ({id:`concept-${c.id}`,title:c.name})),{id:'paper-evidence',title:'实验与边界'}];
      body = `<h1>${esc(raw.name)}</h1><p class="paper-title">${esc(raw.title)}</p><div class="source"><span>${esc(raw.authors)} · ${raw.year} · ${esc(raw.venue)}</span>${source({paper:raw.id,page:1})}</div><section id="paper-intro"><h2>问题与思路</h2><p class="lead">${prose(raw.question)}</p><p>${prose(raw.mechanism)}</p>${formula(raw.latex)}<div class="related-buttons">${concepts.map(c => `<button data-peek="concept:${c.id}">${esc(c.name)}</button>`).join('')}</div></section>${concepts.map((c,i) => `<section id="concept-${c.id}"><h2><span class="section-label">${String(i+1).padStart(2,'0')}</span>${esc(c.name)}</h2>${formula(c.latex)}${lesson(c)}</section>`).join('')}<section id="paper-evidence"><h2>实验与边界</h2><p>${prose(raw.evidence)}</p><p>${prose(raw.caveat)}</p>${raw.checks?.length ? `<h3>回顾问题</h3><ol>${raw.checks.map(t => `<li>${prose(t)}</li>`).join('')}</ol>` : ''}</section>`;
      lastReading = {key:x.key,project:route.project,chapter:lastReading?.key === x.key ? lastReading.chapter : ''};
    } else if (x.kind === 'concept') {
      body = `<h1>${esc(x.title)}</h1><p class="paper-title" lang="en">${esc(x.subtitle)}</p><p class="lead">${prose(raw.summary)}</p>${formula(raw.latex)}${lesson(raw)}<h2>相关文献</h2><div class="related-buttons">${data.papers.filter(p => p.concepts.includes(x.id)).map(p => `<a class="secondary" href="${url(byKey(`paper:${p.id}`))}">${esc(p.name)} →</a>`).join('')}</div>`;
    } else if (x.kind === 'english') {
      if(listState().domain!==englishDomain(x)){listState().domain=englishDomain(x);listState().group='';listState().q='';}
      body = `<span class="tag">${esc(englishDomains[englishDomain(x)].name)} · ${esc(englishType(x))}</span><h1 lang="en">${esc(x.title)}</h1>${englishBody(raw)}`;
    } else {
      body = `<h1>${esc(x.title)}</h1><p class="paper-title">${esc(raw.date)} · ${esc(recordStatus(raw.status))}</p><p class="lead">${esc(raw.summary)}</p>${raw.bodyHtml.replaceAll('notes/',assetBase+'notes/')}<p><a href="${assetBase}${encodeURI(raw.markdown)}" target="_blank" rel="noopener">打开 Markdown ↗</a></p>`;
    }
    $('#main').innerHTML = `<div class="content-toolbar"><a href="${path(route.section)}">← ${sectionName()}列表</a><div class="actions"><button data-size="-1" aria-label="缩小正文">A−</button><button data-size="1" aria-label="放大正文">A＋</button><button data-focus>专注</button>${(x.kind === 'concept' || x.kind === 'english' && x.group === 'terms') ? `<button data-start-drill="${x.key}">专项复习</button>` : ''}${action('note',x.key,route.realm === 'papers' ? '笔记' : '写复盘')}${route.realm === 'papers' ? action('plan',x.key,'安排复习') : action('task',x.key,'加任务')}</div></div><article class="reader" id="article">${body}${route.realm === 'papers' ? assessControls(x.key) : ''}</article>`;
    $('#article').style.setProperty('--reading-size',`${readingSize}px`);
    document.querySelectorAll('#article table').forEach(table => { const wrap = document.createElement('div'); wrap.className = 'table-scroll'; table.before(wrap); wrap.append(table); });
    if (x.kind === 'case') {
      toc = [...document.querySelectorAll('#article h2')].map((h,i) => { h.id = `record-section-${i}`; h.style.scrollMarginTop = '168px'; return {id:h.id,title:h.textContent}; });
    }
    if (toc.length) {
      $('#side-context').innerHTML = `<h2>本篇目录</h2><nav aria-label="本篇目录">${toc.map(t => `<a href="${url(x)}" data-jump="${t.id}">${esc(t.title)}</a>`).join('')}</nav>`;
      observer = new IntersectionObserver(entries => entries.forEach(e => { if (!e.isIntersecting) return; document.querySelectorAll('[data-jump]').forEach(a => a.classList.toggle('active',a.dataset.jump === e.target.id)); if (x.kind === 'paper') lastReading.chapter = e.target.id; }),{rootMargin:'-174px 0px -55% 0px'});
      toc.forEach(t => observer.observe(document.getElementById(t.id)));
    }
  }
  function planRows(rows) {
    return rows.map(p => { const x = byKey(p.key); return `<div class="plan-row"><div><a href="${url(x,p.project)}"><strong>${esc(x.title)}</strong></a><small>${p.date} · ${levels.get(p.key) === 'clear' ? '能独立解释' : levels.get(p.key) === 'weak' ? '待巩固' : '未自评'}</small></div><div class="actions">${action('plan',p.key,'改期')}<button data-plan-done="${p.key}">完成</button></div></div>`; }).join('');
  }
  function reviewPage() {
    const state = listState(), all = [...plans.values()].filter(p => p.project === route.project), due = all.filter(p => p.date <= today());
    const mode = ['all','weak'].includes(state.tab) ? state.tab : 'due';
    const rows = mode === 'all' ? all : mode === 'weak' ? items.filter(x => belongs(x,route.project) && levels.get(x.key) === 'weak') : due;
    $('#main').innerHTML = `${heading('复习计划',`今天 ${today()} · 待复习 ${due.length} 项`,`<button class="primary" data-new-plan>安排复习</button>`)}<div class="list-toolbar"><div class="tabbar">${[['due','待复习'],['all','全部计划'],['weak','待巩固']].map(([k,t]) => `<button data-review-tab="${k}" aria-pressed="${mode === k}">${t}</button>`).join('')}</div></div><div class="data-list">${rows.length ? mode === 'weak' ? rows.map(x => `<div class="plan-row"><a href="${url(x)}"><strong>${esc(x.title)}</strong></a>${action('plan',x.key,'安排日期')}</div>`).join('') : planRows(rows) : '<div class="empty">暂无内容。复习日期和掌握程度由你自行设置。</div>'}</div>`;
  }
  function render() {
    if (previousHash) scrolls.set(previousHash,window.scrollY);
    observer?.disconnect(); route = readRoute();
    const canonical = route.item ? url(route.item) : path(route.section,route.topic?.id || '');
    if (location.hash !== canonical) history.replaceState(null,'',canonical);
    areaPaths[route.realm] = canonical; previousHash = canonical; document.body.classList.remove('focus');
    shell();
    if (route.item) itemPage(route.item);
    else if (route.section === 'overview') overview();
    else if (route.section === 'tasks') tasksPage();
    else if (route.section === 'review') reviewPage();
    else if (route.section === 'notes') notesPage();
    else if (route.section === 'roadmap') learningUI.routesPage();
    else if (route.section === 'graph') learningUI.graphPage();
    else if (route.section === 'drill') learningUI.drillPage();
    else listPage();
    window.scrollTo(0,scrolls.get(location.hash) || 0);
  }
  function dialog(title,body) {
    if (!$('#dialog').open) dialogOrigin = {hash:location.hash,y:window.scrollY};
    $('#dialog-title').textContent = title; $('#dialog-body').innerHTML = body;
    if (!$('#dialog').open) $('#dialog').showModal();
  }
  function closeDialog() { $('#dialog').close(); }
  function noteDialog(key) {
    const x=byKey(key),old=notes.get(key),r=storage.record(key),isPaper=x?.kind==='paper',title=old?.title||x?.title||(route.realm==='papers'?'阅读笔记':'项目复盘');
    dialog(route.realm==='papers'?'阅读笔记':'项目复盘',`<form id="note-form" data-key="${esc(key)}"><label for="note-title">标题</label><input id="note-title" name="title" type="text" value="${esc(title)}" required>${isPaper?`<div class="paper-note-meta"><label>阅读状态<select name="status">${[['unread','未读'],['reading','在读'],['read','已读']].map(([v,t])=>`<option value="${v}" ${(r.status||x.raw.initialStatus)===v?'selected':''}>${t}</option>`).join('')}</select></label><label>阅读日期<input type="date" name="readDate" value="${esc(r.readDate||'')}"></label></div>${[['understanding','我的理解'],['evidence','证据与实验记录'],['questions','疑问与下一步']].map(([field,label])=>`<label>${label}<textarea name="${field}" rows="3">${esc(r[field]||'')}</textarea></label>`).join('')}`:''}<label for="note-text">${isPaper?'随读补充':route.realm==='papers'?'理解、问题与下一步':'过程、问题与结论'}</label><textarea id="note-text" name="text">${esc(isPaper?r.notes||'':r.notes??old?.text??'')}</textarea><p class="help">保存到当前浏览器；可导出备份。</p><button class="primary">${route.realm==='papers'?'保存笔记':'保存复盘'}</button></form>`);
  }
  function taskDialog(key = '') {
    const own = items.filter(x => belongs(x,route.project));
    dialog('新建项目任务',`<form id="task-form"><label for="task-title">任务</label><input type="text" id="task-title" name="title" placeholder="要解决什么问题？" required maxlength="240"><label for="task-material">关联资料</label><select id="task-material" name="material"><option value="">不关联资料</option>${own.map(x => `<option value="${x.key}" ${x.key === key ? 'selected' : ''}>[${types[x.kind]}] ${esc(x.title)}</option>`).join('')}</select><label for="task-due">截止日期（可选）</label><input type="date" id="task-due" name="due"><button class="primary">添加任务</button></form>`);
  }
  function planDialog(key = '') {
    const own = items.filter(x => belongs(x,route.project));
    dialog('安排复习',`<form id="plan-form"><label for="plan-item">学习内容</label><select name="key" id="plan-item">${own.map(x => `<option value="${x.key}" ${x.key === key ? 'selected' : ''}>[${types[x.kind]}] ${esc(x.title)}</option>`).join('')}</select><label for="plan-date">复习日期（北京时间）</label><input type="date" id="plan-date" name="date" value="${esc(plans.get(key)?.date || today())}" required><p class="help">到期后列入“待复习”，日期由你自行安排。日期由你手动安排。</p><button class="primary">保存计划</button></form>`);
  }
  function searchDialog() { dialog('搜索全部资料',`<input id="global-search" type="search" aria-label="搜索全部资料" placeholder="输入论文、概念、英文或实验关键词…" autocomplete="off"><div class="search-results" id="global-results"><p class="muted">搜索论文学习与项目实践，结果标明工作区和栏目。</p></div>`); $('#global-search').focus(); }
  function searchResults() {
    const query = $('#global-search').value.trim().normalize('NFKC').toLocaleLowerCase(), tokens = query.split(/\s+/).filter(Boolean);
    const score = x => x.title.toLocaleLowerCase() === query ? 0 : x.title.toLocaleLowerCase().includes(query) ? 1 : 2;
    const results = query ? items.filter(x => tokens.every(t => x.search.includes(t))).sort((a,b) => score(a) - score(b)) : [];
    $('#global-results').innerHTML = results.slice(0,50).map(x => `<a href="${url(x)}" data-close><strong>${esc(x.title)}</strong><small>${areas[projects.find(p => p.id === homeProject(x)).realm]} / ${esc(projects.find(p => p.id === (belongs(x,route.project) ? route.project : homeProject(x))).name)} / ${sections[sectionOf(x)]} · ${types[x.kind]}</small></a>`).join('') || '<p class="muted">没有匹配的内容。</p>';
  }
  function peek(key) {
    const x = byKey(key); if (!x) return;
    dialog(x.title,`<article class="reader"><p class="paper-title">${esc(x.subtitle)}</p><p class="lead">${prose(x.summary)}</p>${formula(x.raw.latex)}${x.kind === 'concept' ? lesson(x.raw) : englishBody(x.raw)}</article>`);
  }
  function refreshShell() {
    // Refresh counts without replacing an open reader or its directory/scroll position.
    const oldContext = $('#side-context').innerHTML; shell(); if (route.item) $('#side-context').innerHTML = oldContext;
  }
  function saveWorkspace() {
    const ok=storage.save({tasks,notes:[...notes],plans:[...plans],levels:[...levels],learning:learningUI.exportState(),lastReading,readingSize,visited});
    if(!ok)notify(storage.error||'记录未保存，请导出备份');
  }
  function recordManager() {
    const pending=storage.reminders().length;
    dialog('记录与备份',`<div class="record-tools"><button data-export-records>导出全部学习记录</button><button data-import-records>导入学习记录</button><a class="secondary" href="classic.html#journal">学习日志与日程</a><a class="secondary" href="classic.html#todos">待办与提醒（${pending}）</a><a class="secondary" href="classic.html#compare">方法对比</a></div><p class="help">笔记、学习进度与任务保存在当前浏览器，导出后可迁移到其他设备。导入前会下载当前记录备份。</p><p class="help">关闭网页后的待办提醒受浏览器运行状态限制。通知权限在待办页面由你主动开启。</p>${storage.blocked?'<p class="overdue">原有记录读取失败，已停止覆盖。请先导出原始记录，再导入有效备份。</p>':''}`);
  }
  function reminderBanner() {
    const newly=storage.checkReminders(),due=storage.reminders().filter(t=>window.STUDY_TODOS.due(t));
    $('#workspace-reminders').innerHTML=due.length?`<strong>到期待办 ${due.length}</strong> ${due.slice(0,2).map(t=>esc(t.title)).join(' · ')} <a href="classic.html#todos">查看待办 →</a>`:'';
    $('#workspace-reminders').hidden=!due.length;
    if(document.visibilityState==='visible'&&'Notification'in window&&Notification.permission==='granted')for(const t of newly)try{new Notification('学习待办提醒',{body:t.title,tag:'zhiliang-todo-'+t.id});}catch(e){}
  }
  const learningUI = window.createStudyLearning({items,byKey,belongs,url,path,prose,formula,esc,source,levels,plans,today,dialog,closeDialog,lesson,englishBody,notify,projects,homeProject,assetBase,savedLearning:saved.learning,getRoute:() => route});
  document.addEventListener('click', e => {
    const target = e.target.closest('button,a'); if (!target) return;
    if (learningUI.handleClick(target,e)) { saveWorkspace(); return; }
    if(target.hasAttribute('data-record-manager'))recordManager();
    if(target.hasAttribute('data-export-records')){saveWorkspace();storage.exportRecords();}
    if(target.hasAttribute('data-import-records'))$('#import-file').click();
    if (target.hasAttribute('data-close')) closeDialog();
    if (target.dataset.tool === 'search') searchDialog();
    if (target.dataset.tool === 'continue') {
      if (!lastReading) { notify('先打开一篇文献'); return; }
      const destination = url(byKey(lastReading.key),lastReading.project), chapter = lastReading.chapter;
      if (location.hash === destination) document.getElementById(chapter || 'paper-intro')?.scrollIntoView();
      else { location.hash = destination; if (chapter) setTimeout(() => document.getElementById(chapter)?.scrollIntoView(),80); }
    }
    if (target.dataset.tool === 'tasks') location.hash = path('tasks');
    if (target.dataset.tool === 'notes') location.hash = path('notes');
    if (target.hasAttribute('data-new-task')) taskDialog();
    if (target.hasAttribute('data-new-plan')) planDialog();
    if (target.hasAttribute('data-project-note')) noteDialog(`project:${route.project}:${++serial}`);
    if (target.dataset.action === 'note') noteDialog(target.dataset.key);
    if (target.dataset.action === 'task') taskDialog(target.dataset.key);
    if (target.dataset.action === 'plan') planDialog(target.dataset.key);
    if (target.dataset.peek) peek(target.dataset.peek);
    if (target.dataset.englishDomain) { listState().domain=target.dataset.englishDomain;listState().group='';listPage(); }
    if (target.dataset.taskTab) { listState().tab = target.dataset.taskTab; tasksPage(); }
    if (target.dataset.reviewTab) { listState().tab = target.dataset.reviewTab; reviewPage(); }
    if (target.dataset.jump) { e.preventDefault(); document.getElementById(target.dataset.jump)?.scrollIntoView({behavior:'smooth'}); }
    if (target.dataset.size) { readingSize = Math.max(18,Math.min(26,readingSize + Number(target.dataset.size))); $('#article')?.style.setProperty('--reading-size',`${readingSize}px`); notify(`正文 ${readingSize}px`); }
    if (target.hasAttribute('data-focus')) { const focused = document.body.classList.toggle('focus'); target.textContent = focused ? '退出专注' : '专注'; }
    if (target.dataset.level) { levels.set(target.dataset.key,target.dataset.level); target.parentElement.outerHTML = assessControls(target.dataset.key); saveWorkspace(); notify('已保存自评'); }
    if (target.dataset.planDone) { plans.delete(target.dataset.planDone); refreshShell(); route.section === 'overview' ? overview() : reviewPage(); saveWorkspace(); notify('复习已完成'); }
    if (target.dataset.deleteTask) { const index = tasks.findIndex(t => t.id === target.dataset.deleteTask); if (index >= 0) tasks.splice(index,1); refreshShell(); route.section === 'overview' ? overview() : tasksPage(); saveWorkspace(); }
  });
  document.addEventListener('input',e => {
    if(learningUI.handleInput(e.target))return;
    if (e.target.id === 'list-search') { listState().q = e.target.value; listResults(); }
    if (e.target.id === 'global-search') searchResults();
  });
  document.addEventListener('change',e => {
    if (learningUI.handleChange(e.target)) { saveWorkspace(); return; }
    if (e.target.id === 'project') location.hash = path('overview','',e.target.value);
    if (e.target.id === 'english-group') { listState().group = e.target.value; listResults(); }
    if (e.target.dataset.done) { const t = tasks.find(t => t.id === e.target.dataset.done); t.done = e.target.checked; refreshShell(); route.section === 'overview' ? overview() : tasksPage(); saveWorkspace(); }
    if (e.target.id === 'plan-item') $('#plan-date').value = plans.get(e.target.value)?.date || today();
  });
  document.addEventListener('submit',e => {
    const form = e.target, values = new FormData(form); e.preventDefault();
    if (form.id === 'task-form' || form.id === 'quick-task') {
      const title = String(values.get('title') || '').trim(); if (!title) return;
      tasks.push({id:`task-${++serial}`,project:route.project,title,material:values.get('material') || '',due:values.get('due') || '',done:false});
      if (form.id === 'task-form') closeDialog(); else form.reset();
      refreshShell(); if (!route.item) route.section === 'tasks' ? tasksPage() : overview(); saveWorkspace(); notify('已加入当前项目任务');
    }
    if (form.id === 'note-form') {
      const key=form.dataset.key,x=byKey(key),patch={notes:String(values.get('text'))};
      if(x?.kind==='paper')for(const field of ['understanding','evidence','questions','status','readDate'])patch[field]=String(values.get(field)||'');
      if(!storage.saveRecord(key,patch)){notify(storage.error||'保存失败，请导出记录');return;}
      notes.set(key,{title:String(values.get('title')).trim(),text:storage.recordText(patch),project:notes.get(key)?.project||route.project,updatedAt:new Date().toISOString()});
      closeDialog(); refreshShell(); if (route.section === 'overview') overview(); else if (route.section === 'notes') notesPage(); saveWorkspace(); notify('已保存记录');
    }
    if (form.id === 'plan-form') {
      const key = String(values.get('key')), x = byKey(key); if (!x) return;
      plans.set(key,{key,project:route.project,date:String(values.get('date'))}); closeDialog(); refreshShell();
      if (route.section === 'review') reviewPage(); else if (route.section === 'overview') overview(); saveWorkspace(); notify('已安排复习日期');
    }
  });
  document.addEventListener('keydown',e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchDialog(); } });
  $('#dialog').addEventListener('close',() => {
    const origin = dialogOrigin;
    requestAnimationFrame(() => { if (origin && location.hash === origin.hash) window.scrollTo(0,origin.y); });
  });
  $('#import-file').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{if(file.size>5*1024*1024)throw Error('备份超过5MB');const raw=JSON.parse(await file.text());if(!storage.importRecords(raw))throw Error(storage.error);location.reload();}catch(err){notify('导入失败：'+err.message);}finally{e.target.value='';}
  });
  window.addEventListener('pagehide',saveWorkspace);
  reminderBanner();setInterval(reminderBanner,60000);
  if(storage.error)notify(storage.error);
  window.addEventListener('hashchange',render);
  if (!location.hash) location.replace('#papers/quant/overview'); else render();
})();
