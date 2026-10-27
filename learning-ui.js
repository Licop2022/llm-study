window.createStudyLearning = function(api) {
  'use strict';
  const {items,byKey,belongs,url,path,prose,formula,esc,source,levels,plans,today,dialog,closeDialog,lesson,englishBody,notify} = api;
  const data = window.STUDY_LEARNING, $ = s => document.querySelector(s), route = api.getRoute;
  const completed = new Set(api.savedLearning?.completed || []), drills = new Map(api.savedLearning?.drills || []), graphStates = new Map();
  const explorer=window.createKnowledgeExplorer(api);
  const projectName = p => api.projects.find(x => x.id === p)?.name;
  const ownTopics = () => data.topics.filter(t => t.projects.includes(route().project));
  const node = key => data.foundations[key] ? {key,title:data.foundations[key].title,summary:data.foundations[key].summary,kind:'foundation',raw:data.foundations[key]} : byKey(key);
  const nodeType = n => ({foundation:'入门补充',concept:'概念',paper:'论文',case:'实践记录',english:'英语'}[n.kind]);
  const stepKey = (topic,i) => `${route().project}/${topic.id}/${i}`;
  const progress = topic => topic.steps.filter((s,i) => completed.has(stepKey(topic,i))).length;
  function header(title,subtitle = '',extra = '') {
    return `<div class="page-heading"><div><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>` : ''}</div><div class="actions">${extra}</div></div>`;
  }
  function routeTabs(view) {
    return `<nav class="learning-tabs" aria-label="路线与图谱"><a href="${path('roadmap')}" ${view === 'routes' ? 'aria-current="page"' : ''}>专题路线</a><a href="${path('graph')}" ${view === 'graph' ? 'aria-current="page"' : ''}>知识图谱</a></nav>`;
  }
  function material(key) {
    const n = node(key);
    if (['foundation','concept'].includes(n.kind)) return `<button data-material="${esc(key)}"><span>${nodeType(n)}</span>${esc(n.title)} ↗</button>`;
    return `<a href="${url(n)}"><span>${nodeType(n)}</span>${esc(n.title)} →</a>`;
  }
  function foundationBody(f) {
    return `<p class="lead">${esc(f.summary)}</p><p>${esc(f.text)}</p>${formula(f.latex)}<div class="example"><h3>教学算例</h3><p>${esc(f.example)}</p></div><details><summary>${esc(f.check)}</summary><p>${esc(f.answer)}</p></details><p class="source">为学习路线新增的入门教学说明。</p>`;
  }
  function routesPage() {
    const selected = route().topic;
    if (!selected) {
      $('#main').innerHTML = `${header('专题学习路线','按目标学习，先补前置知识，再回到论文与实践。')}${routeTabs('routes')}<div class="route-grid">${ownTopics().map(t => `<a class="route-card" href="${path('roadmap',t.id)}"><div class="route-card-head"><span>${t.steps.length} 个步骤</span><span>${progress(t)} / ${t.steps.length} 已学</span></div><h2>${esc(t.title)}</h2><p>${esc(t.summary)}</p><div class="meter"><i style="width:${progress(t)/t.steps.length*100}%"></i></div><strong>进入路线 →</strong></a>`).join('')}</div>`;
      return;
    }
    const count = progress(selected);
    $('#main').innerHTML = `${header(selected.title,`${count} / ${selected.steps.length} 步已学`,`<a class="secondary" href="${path('roadmap')}">全部路线</a><a class="secondary" href="${path('graph')}">查看图谱</a>`)}<div class="route-target"><strong>学习目标</strong><p>${esc(selected.target)}</p><div class="meter"><i style="width:${count/selected.steps.length*100}%"></i></div></div><div class="route-steps">${selected.steps.map((s,i) => `<section class="route-step ${completed.has(stepKey(selected,i)) ? 'learned' : ''}" id="learning-step-${i}"><div class="step-number">${String(i+1).padStart(2,'0')}</div><div class="step-body"><header><h2>${esc(s.title)}</h2><button data-learn-step="${i}" aria-pressed="${completed.has(stepKey(selected,i))}">${completed.has(stepKey(selected,i)) ? '✓ 已学' : '标记本步已学'}</button></header><p>${esc(s.goal)}</p><div class="materials">${s.materials.map(material).join('')}</div><details><summary>检查理解：${esc(s.check)}</summary><p>${esc(s.answer)}</p></details></div></section>`).join('')}</div><p class="learning-note">“已学”由你手动标记；打开材料不会自动计为掌握。进度保存在当前浏览器。</p>`;
    $('#side-context').innerHTML = `<h2>路线步骤</h2>${selected.steps.map((s,i) => `<a href="${path('roadmap',selected.id)}" data-route-step="learning-step-${i}">${i+1}. ${esc(s.title)}</a>`).join('')}`;
  }
  function graphState() {
    if (!graphStates.has(route().project)) graphStates.set(route().project,{id:data.graphs.find(g => g.projects.includes(route().project))?.id || 'quant',selected:''});
    return graphStates.get(route().project);
  }
  function graphPage() { explorer.render(); }
  function drillState() {
    if (!drills.has(route().project)) drills.set(route().project,{kind:'concept',group:'',paper:'',scope:'all',size:'10',direction:'en',queue:null,index:0,revealed:false,answers:[]});
    return drills.get(route().project);
  }
  function drillPool(s) {
    return items.filter(x => belongs(x,route().project) && (s.kind === 'concept' ? x.kind === 'concept' : x.kind === 'english' && x.group === 'terms' && (!s.domain || x.raw.learningDomain===s.domain)) && (!s.paper || (x.raw.refs || []).some(r => r.paper === s.paper)) && (!s.group || x.raw.group === s.group) && (s.scope === 'all' || (s.scope === 'weak' ? levels.get(x.key) === 'weak' : !levels.has(x.key))));
  }
  function drillPage() {
    const s = drillState();
    if (s.queue && s.index < s.queue.length) { drillCard(); return; }
    if (s.queue) { drillSummary(); return; }
    const own = items.filter(x => belongs(x,route().project)), pool = drillPool(s);
    const groups = [...new Set(own.filter(x => s.kind === 'concept' ? x.kind === 'concept' : x.kind === 'english' && x.group === 'terms' && (!s.domain || x.raw.learningDomain===s.domain)).map(x => x.raw.group))];
    $('#main').innerHTML = `${header('词汇与概念专项','先回忆，再看答案；熟悉程度由你自行判断。')}<div class="drill-setup"><div class="drill-types" role="group" aria-label="专项类型"><button data-drill-type="concept" aria-pressed="${s.kind === 'concept'}"><strong>概念专项</strong><span>解释含义、公式与方法边界</span></button><button data-drill-type="word" aria-pressed="${s.kind === 'word'}"><strong>词汇专项</strong><span>英中互忆、用法与易混点</span></button></div><div class="drill-fields">${s.kind === 'word' ? `<label>英语范畴<select data-drill-field="domain"><option value="">全部英语</option>${Object.entries(window.STUDY_DATA.english.domains).map(([id,d])=>`<option value="${id}" ${s.domain===id?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label>` : ''}<label>文献范围<select data-drill-field="paper"><option value="">当前方向全部文献</option>${own.filter(x => x.kind === 'paper').map(x => `<option value="${x.id}" ${s.paper === x.id ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select></label><label>主题分组<select data-drill-field="group"><option value="">全部主题</option>${groups.map(g => `<option ${s.group === g ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select></label><label>熟悉程度<select data-drill-field="scope">${[['all','全部'],['weak','待巩固'],['unknown','未自评']].map(([v,t]) => `<option value="${v}" ${s.scope === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label>本轮数量<select data-drill-field="size">${[['10','10项'],['20','20项'],['all','全部']].map(([v,t]) => `<option value="${v}" ${s.size === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>${s.kind === 'word' ? `<label>回忆方向<select data-drill-field="direction"><option value="en" ${s.direction === 'en' ? 'selected' : ''}>看英文，想中文</option><option value="zh" ${s.direction === 'zh' ? 'selected' : ''}>看中文，想英文</option></select></label>` : ''}</div><footer><span>符合条件 ${pool.length} 项 · 按导入顺序</span><button class="primary" data-drill-begin ${pool.length ? '' : 'disabled'}>开始专项复习</button></footer></div><p class="learning-note">自评与复习记录保存在当前浏览器。不会自动安排下次日期。</p>`;
  }
  function drillCard() {
    const s = drillState(), x = byKey(s.queue[s.index]), c = x.raw;
    const prompt = s.kind === 'concept' ? x.title : s.direction === 'en' ? x.title : c.meaning;
    const answer = s.kind === 'concept' ? `<p>${prose(c.lesson?.intuition || c.summary)}</p>${formula(c.latex)}${c.lesson?.check ? `<h3>检查问题的参考回答</h3><p>${prose(c.lesson.check.answer)}</p>` : ''}<details><summary>展开推导与教学算例</summary>${lesson(c)}</details>` : `<h2>${esc(s.direction === 'en' ? c.meaning : c.name)}</h2><h3>用法</h3><p>${prose(c.usage)}</p>${c.example ? `<h3>教学例句</h3><p lang="en">${esc(c.example)}</p><p>${esc(c.translation)}</p>` : ''}${c.caution ? `<h3>易混点</h3><p>${prose(c.caution)}</p>` : ''}<div class="source">${(c.refs || []).map(source).join('')}</div>`;
    $('#main').innerHTML = `${header(s.kind === 'concept' ? '概念专项' : '词汇专项',`第 ${s.index+1} / ${s.queue.length} 项 · 本轮已复习 ${s.answers.length} 项`,`<button data-drill-exit>结束本轮</button>`)}<div class="drill-progress"><i style="width:${s.index/s.queue.length*100}%"></i></div><article class="drill-card reader"><span class="tag">${esc(c.group)}</span><h1>${esc(prompt)}</h1>${s.kind === 'concept' ? `<p class="drill-question">${prose(c.lesson?.check?.question || c.question || '请说明这个概念的含义和使用条件。')}</p>` : `<p class="drill-question">${s.direction === 'en' ? '回忆中文含义，并说出一个常见用法。' : '回忆对应英文，并检查拼写与用法。'}</p>`}${s.revealed ? `<section class="drill-answer">${answer}</section><div class="drill-rating"><button data-drill-grade="weak">还不熟</button><button class="primary" data-drill-grade="clear">能解释 / 能回忆</button></div>` : '<button class="primary reveal" data-drill-reveal>显示答案</button>'}<footer><a href="${url(x)}">打开完整条目 →</a><button data-action="plan" data-key="${x.key}">安排下次复习</button><button data-drill-skip>跳过</button></footer></article>`;
  }
  function drillSummary() {
    const s = drillState(), weak = s.answers.filter(a => a.level === 'weak'), clear = s.answers.filter(a => a.level === 'clear');
    $('#main').innerHTML = `${header('本轮复习完成')}<section class="drill-summary"><div class="summary-counts"><div><strong>${clear.length}</strong><span>本次能回忆</span></div><div><strong>${weak.length}</strong><span>本次待巩固</span></div><div><strong>${s.queue.length-s.answers.length}</strong><span>跳过</span></div></div><h2>待巩固清单</h2>${weak.length ? `<div class="weak-list">${weak.map(a => `<a href="${url(byKey(a.key))}">${esc(byKey(a.key).title)} →</a>`).join('')}</div>` : '<p>本轮没有标记待巩固的条目。</p>'}<div class="actions"><button class="primary" data-drill-retry ${weak.length ? '' : 'disabled'}>再练待巩固</button><button data-drill-exit>返回设置</button><a class="secondary" href="${path('review')}">查看复习计划</a></div><p class="learning-note">统计来自你本轮的自评，不是自动判题成绩。</p></section>`;
  }
  function startFrom(key) {
    const x = byKey(key); if (!x || !['concept','english'].includes(x.kind)) return;
    const project = belongs(x,route().project) ? route().project : api.homeProject(x);
    const fresh = {kind:x.kind === 'concept' ? 'concept' : 'word',group:'',paper:'',scope:'all',size:'10',direction:'en',queue:[key],index:0,revealed:false,answers:[]};
    drills.set(project,fresh); closeDialog();
    const destination = path('drill','',project);
    if (location.hash === destination) drillPage(); else location.hash = destination;
  }
  function handleClick(t,e) {
    if(explorer.click(t))return true;
    if (t.dataset.learnStep !== undefined) {
      const key=stepKey(route().topic,Number(t.dataset.learnStep)),y=scrollY;
      completed.has(key) ? completed.delete(key) : completed.add(key); routesPage(); window.scrollTo(0,y); return true;
    }
    if (t.dataset.routeStep) { e.preventDefault(); document.getElementById(t.dataset.routeStep)?.scrollIntoView({behavior:'smooth'}); return true; }
    if (t.dataset.material) {
      const n=node(t.dataset.material);
      dialog(n.title,`<article class="reader">${n.kind === 'foundation' ? foundationBody(n.raw) : `<p class="lead">${prose(n.summary)}</p>${formula(n.raw.latex)}${lesson(n.raw)}<p><a href="${url(n)}" data-close>打开概念页 →</a></p>`}</article>`); return true;
    }
    if (t.dataset.graph) { graphState().id=t.dataset.graph; graphState().selected=''; graphPage(); return true; }
    if (t.dataset.startDrill) { startFrom(t.dataset.startDrill); return true; }
    if (t.dataset.drillType) { const s=drillState(); s.kind=t.dataset.drillType; s.group=''; drillPage(); return true; }
    if (t.hasAttribute('data-drill-begin')) { const s=drillState(),pool=drillPool(s); s.queue=pool.slice(0,s.size === 'all' ? pool.length : Number(s.size)).map(x=>x.key);s.index=0;s.answers=[];s.revealed=false;drillPage();return true; }
    if (t.hasAttribute('data-drill-reveal')) { drillState().revealed=true;drillCard();return true; }
    if (t.dataset.drillGrade) { const s=drillState();if(!s.revealed)return true;const key=s.queue[s.index];levels.set(key,t.dataset.drillGrade);s.answers.push({key,level:t.dataset.drillGrade});s.index++;s.revealed=false;drillPage();window.scrollTo(0,0);return true; }
    if (t.hasAttribute('data-drill-skip')) { const s=drillState();s.index++;s.revealed=false;drillPage();window.scrollTo(0,0);return true; }
    if (t.hasAttribute('data-drill-retry')) { const s=drillState();s.queue=s.answers.filter(a=>a.level==='weak').map(a=>a.key);s.answers=[];s.index=0;s.revealed=false;drillPage();return true; }
    if (t.hasAttribute('data-drill-exit')) { drillState().queue=null;drillPage();return true; }
    return false;
  }
  function handleChange(t) { if(explorer.change(t))return true; if (!t.dataset.drillField) return false; drillState()[t.dataset.drillField]=t.value;if(t.dataset.drillField==='domain')drillState().group='';drillPage();return true; }
  return {routesPage,graphPage,drillPage,handleClick,handleChange,handleInput:explorer.input,exportState:()=>({completed:[...completed],drills:[...drills]}),explorer};
};
