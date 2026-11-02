window.createStudyCourses = ctx => {
  const {esc,prose,formula,url,path,byKey,action,assessControls,notify,getRoute,save,heading}=ctx;
  const D=window.STUDY_COURSES, progress={...(ctx.savedProgress||{})};
  const labels={'not-started':'未开始',studying:'正在学习',learned:'已学过'};
  const status=u=>labels[progress[u.id]]?progress[u.id]:u.initialStatus;
  const current=()=>D.units.find(u=>status(u)==='studying')||D.units.find(u=>status(u)==='not-started')||D.units.find(u=>u.id===D.current);
  const href=u=>url(byKey('lesson:'+u.id),'d2l');
  const rows=units=>units.map(u=>`<a class="entry-row row-link" href="${href(u)}"><div><strong>${esc(u.number)} · ${esc(u.title)}</strong><p>${esc(u.summary)}</p></div><span class="tag course-status-${status(u)}">${labels[status(u)]}</span></a>`).join('');
  function overview(){
    const u=current();
    document.querySelector('#main').innerHTML=`${heading(D.title,'李沐等 · 课程笔记',`<a class="primary" href="${href(u)}">继续学习：${esc(u.title)}</a>`)}<div class="course-summary"><strong>${D.units.filter(u=>status(u)==='learned').length} 个已学单元</strong><span>当前范围：第1章至7.7节；第1—6章按章归纳</span><a href="${D.source}" target="_blank" rel="noopener">完整教材 ↗</a></div><p class="course-progress-note">${esc(D.progressNote)}</p><section class="panel"><header><h2>章节与笔记</h2><a href="${path('review')}">复习计划 →</a></header>${rows(D.units)}</section>`;
    document.querySelector('#side-context').innerHTML=`<h2>当前课程</h2><a href="${href(u)}">${esc(u.number)} · ${esc(u.title)}</a><a href="${path('notes')}">我的课程笔记</a>`;
  }
  function list(){document.querySelector('#main').innerHTML=`${heading('章节笔记')}<div class="list-toolbar"><input id="course-search" type="search" aria-label="搜索课程笔记" placeholder="搜索章节、1×1、GAP、参数量…"></div><div class="panel" id="course-results">${rows(D.units)}</div>`;}
  function search(value){const q=value.trim().normalize('NFKC').toLowerCase();document.querySelector('#course-results').innerHTML=rows(D.units.filter(u=>(u.title+' '+u.summary+' '+u.searchText).normalize('NFKC').toLowerCase().includes(q)))||'<p class="empty">没有匹配的课程笔记。</p>';}
  function itemPage(x){
    const u=x.raw, index=D.units.indexOf(u), codeView=getRoute().courseView==='code';
    const selected=codeView?u.codeSections||[]:u.sections, questions=codeView?u.codeChecks:u.checks;
    const pageHref=href(u)+(codeView?'/code':'');
    const table=t=>`<div class="table-scroll"><table><thead><tr>${t.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r=>`<tr>${r.map(v=>`<td>${prose(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const checks=questions?.length?`<section id="course-check"><h2>自测与答案</h2>${questions.map(([q,a])=>`<details><summary>${prose(q)}</summary><p>${prose(a)}</p></details>`).join('')}</section>`:'';
    const terms=!codeView&&u.terms?.length?`<section id="course-terms"><h2>术语速查</h2>${table({head:['英文','中文','本节含义'],rows:u.terms})}</section>`:'';
    const tabs=u.codeSections?.length?`<nav class="course-note-tabs" aria-label="笔记内容"><a href="${href(u)}" ${!codeView?'aria-current="page"':''}>知识点</a><a href="${href(u)}/code" ${codeView?'aria-current="page"':''}>代码学习</a>${codeView&&u.codeFile?`<a class="course-download" href="${esc(u.codeFile)}" download>下载完整 Python</a>`:''}</nav>`:'';
    document.querySelector('#main').innerHTML=`<div class="content-toolbar"><a href="${path('lessons')}">← 章节笔记</a><div class="actions"><button data-size="-1" aria-label="缩小正文">A−</button><button data-size="1" aria-label="放大正文">A＋</button><button data-focus>专注</button>${action('note',x.key,'我的笔记')}${action('plan',x.key,'安排复习')}</div></div><article class="reader" id="article"><h1>${esc(u.number)} · ${esc(u.title)}</h1><div class="course-meta"><label>学习状态 <select data-course-status="${u.id}" aria-label="本章学习状态">${Object.entries(labels).map(([id,text])=>`<option value="${id}" ${status(u)===id?'selected':''}>${text}</option>`).join('')}</select></label><span>${u.sections.length?(u.detail||'复习提要'):'讲义待整理'}</span><a href="${u.source}" target="_blank" rel="noopener">官方教材 ↗</a></div>${tabs}<p class="lead">${prose(codeView?u.codeSummary:u.summary)}</p>${selected.map(s=>`<section id="course-${s.id}"><h2>${esc(s.title)}</h2>${s.paragraphs.map(p=>`<p>${prose(p)}</p>`).join('')}${formula(s.latex)}${s.flow?`<ol class="course-flow">${s.flow.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:''}${s.table?table(s.table):''}${s.code?`<pre class="course-code"><code>${esc(s.code)}</code></pre>`:''}</section>`).join('')}${terms}${checks}<div class="source"><span>教学整理与算例；学习状态与自评分开记录</span><a href="${u.source}" target="_blank" rel="noopener">核对教材章节 ↗</a>${codeView?(u.apiSources||[]).map(([label,link])=>`<a href="${esc(link)}" target="_blank" rel="noopener">${esc(label)} API ↗</a>`).join(''):u.id==='d2l-nin'?'<a href="https://zh.d2l.ai/chapter_convolutional-neural-networks/channels.html" target="_blank" rel="noopener">前置：多输入多输出通道 ↗</a>':''}</div>${assessControls(x.key)}<nav class="course-paging" aria-label="相邻章节">${index?`<a href="${href(D.units[index-1])}">← ${esc(D.units[index-1].title)}</a>`:'<span></span>'}${index<D.units.length-1?`<a href="${href(D.units[index+1])}">${esc(D.units[index+1].title)} →</a>`:''}</nav></article>`;
    document.querySelector('#article').style.setProperty('--reading-size',`${ctx.getReadingSize()}px`);
    const toc=[...selected.map(s=>[s.id,s.title]),...(!codeView&&u.terms?.length?[['terms','术语速查']]:[]),...(questions?.length?[['check','自测与答案']]:[])];
    document.querySelector('#side-context').innerHTML=`<h2>${codeView?'代码目录':'知识点目录'}</h2><nav aria-label="本节目录">${toc.map(([id,title])=>`<a href="${pageHref}" data-jump="course-${id}">${esc(title)}</a>`).join('')}</nav>`;
  }
  function change(target){if(!target.dataset.courseStatus)return false;const id=target.dataset.courseStatus;if(!D.units.some(u=>u.id===id)||!labels[target.value])return false;progress[id]=target.value;save();notify('已保存学习状态；掌握程度由你另外自评');return true;}
  return {overview,list,search,itemPage,change,continueId:()=>current().id,exportProgress:()=>({...progress})};
};
