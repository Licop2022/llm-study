/* Keep the existing personal record schema; add workspace data without dropping fields. */
window.STUDY_WORKSPACE_STORAGE = (() => {
  const KEY='zhiliang-study-v1', T=window.STUDY_TODOS, D=window.STUDY_DATA;
  const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
  const now=()=>new Date().toISOString();
  const blank=()=>({version:1,papers:{},concepts:{},english:{},logs:[],todos:[],appliedUpdates:[],updatedAt:now()});
  let blocked=false,error='';
  function read() {
    const value=localStorage.getItem(KEY);
    if(!value)return blank();
    const state=JSON.parse(value);
    if(!object(state)||state.version!==1)throw Error('个人记录格式无法读取，请先在“记录与备份”导出原始数据。');
    for(const g of ['papers','concepts','english'])if(state[g]!==undefined&&!object(state[g]))throw Error('个人记录字段损坏，已停止覆盖');
    for(const g of ['logs','todos','appliedUpdates'])if(state[g]!==undefined&&!Array.isArray(state[g]))throw Error('个人记录列表损坏，已停止覆盖');
    return {...blank(),...state};
  }
  let initial;
  try{initial=read();}catch(e){blocked=true;error=e.message;initial=blank();}
  function write(update) {
    if(blocked)return false;
    try{const current=read();update(current);current.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(current));initial=current;return true;}
    catch(e){error='保存失败：'+e.message;return false;}
  }
  const groupFor=key=>({paper:'papers',concept:'concepts',english:'english'}[key.split(':')[0]]);
  const idFor=key=>key.slice(key.indexOf(':')+1);
  function record(key) {const g=groupFor(key);return g?{...(initial[g]?.[idFor(key)]||{})}:{};}
  const recordText=r=>[r.understanding&&'我的理解：'+r.understanding,r.evidence&&'证据与实验：'+r.evidence,r.questions&&'疑问与下一步：'+r.questions,r.notes].filter(Boolean).join('\n\n');
  const entries=x=>Array.isArray(x)?x.filter(v=>Array.isArray(v)&&typeof v[0]==='string'&&v.length===2):[];
  function snapshot() {
    const w=object(initial.workspace)?initial.workspace:{};
    const notes=new Map(entries(w.notes)),levels=new Map(entries(w.levels));
    const collection=[...D.papers.map(x=>({kind:'paper',id:x.id,title:x.name,project:x.phase.startsWith('T')?'tensor':'quant'})),...D.concepts.map(x=>({kind:'concept',id:x.id,title:x.name,project:x.group.startsWith('张量')?'tensor':'quant'})),...[...D.english.terms,...D.english.phrases,...D.english.sentences].map(x=>({kind:'english',id:x.id,title:x.name||x.quote,project:(x.refs||[]).some(r=>D.papers.find(p=>p.id===r.paper)?.phase.startsWith('T'))?'tensor':'quant'}))];
    for(const x of collection){const key=`${x.kind}:${x.id}`,r=record(key),text=recordText(r);if(text&&(!notes.has(key)||(r.updatedAt||'')>(notes.get(key).updatedAt||'')))notes.set(key,{title:x.title,text,project:x.project,updatedAt:r.updatedAt||''});if(r.stage==='unknown')levels.delete(key);if(r.stage&&r.stage!=='unknown')levels.set(key,r.stage==='intro'?'weak':'clear');}
    return {...w,tasks:Array.isArray(w.tasks)?w.tasks.filter(t=>object(t)&&typeof t.id==='string'&&typeof t.title==='string'):[],notes:[...notes],levels:[...levels],plans:entries(w.plans),learning:object(w.learning)?w.learning:{}};
  }
  function save(w) {
    return write(s=>{
      s.workspace={...s.workspace,...w,version:1,updatedAt:now()};
      for(const [key,level]of entries(w.levels)){
        const group=groupFor(key),id=idFor(key);if(!group||!['weak','clear'].includes(level))continue;
        s[group]||={};const old=s[group][id]||{},before=old.stage==='intro'?'weak':old.stage&&old.stage!=='unknown'?'clear':'';
        if(before!==level)s[group][id]={...old,stage:level==='weak'?'intro':'explain',updatedAt:now()};
      }
    });
  }
  function saveRecord(key,patch){const g=groupFor(key);if(!g)return true;return write(s=>{s[g]||={};s[g][idFor(key)]={...s[g][idFor(key)],...patch,updatedAt:now()};});}
  function download(content,name,type='application/json') {const blob=new Blob([content],{type}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}
  function exportRecords(){const raw=localStorage.getItem(KEY)||JSON.stringify(blank());download(raw,'科研学习记录-'+new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())+'.json');}
  function validImport(raw){
    if(!object(raw)||raw.version!==1)throw Error('请选择此网页导出的 version=1 学习记录。');
    const out=blank();
    for(const group of ['papers','concepts','english'])if(object(raw[group]))for(const[id,r]of Object.entries(raw[group])){
      if(!/^[a-z0-9-]{1,80}$/.test(id)||!object(r))continue;
      const entry={};for(const field of ['status','stage','readDate','understanding','evidence','questions','notes','updatedAt'])if(typeof r[field]==='string'&&r[field].length<=100000)entry[field]=r[field];if(typeof r.starred==='boolean')entry.starred=r.starred;out[group][id]=entry;
    }
    out.todos=T.normalize(raw.todos);out.logs=Array.isArray(raw.logs)?raw.logs.filter(l=>object(l)&&typeof l.id==='string'&&typeof l.text==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(l.date)).slice(0,10000):[];
    out.appliedUpdates=Array.isArray(raw.appliedUpdates)?raw.appliedUpdates.filter(x=>typeof x==='string'):[];
    if(object(raw.workspace)&&raw.workspace.version===1)out.workspace=raw.workspace;
    return out;
  }
  function merge(current,incoming){
    const s=JSON.parse(JSON.stringify(current));
    for(const g of ['papers','concepts','english']){s[g]||={};for(const[id,r]of Object.entries(incoming[g]||{}))if(!s[g][id]||(r.updatedAt||'')>=(s[g][id].updatedAt||''))s[g][id]=r;}
    s.todos=T.normalize([...(s.todos||[]),...(incoming.todos||[])]);
    s.logs=[...new Map([...(incoming.logs||[]),...(s.logs||[])].map(l=>[l.id,l])).values()];
    s.appliedUpdates=[...new Set([...(s.appliedUpdates||[]),...(incoming.appliedUpdates||[])])];
    if(incoming.workspace&&(!s.workspace||(incoming.workspace.updatedAt||'')>(s.workspace.updatedAt||'')))s.workspace={...s.workspace,...incoming.workspace};
    return s;
  }
  function importRecords(raw){const incoming=validImport(raw);exportRecords();if(blocked){localStorage.setItem(KEY+'-before-import-'+Date.now(),localStorage.getItem(KEY)||'');initial=merge(blank(),incoming);localStorage.setItem(KEY,JSON.stringify(initial));blocked=false;return true;}return write(s=>Object.assign(s,merge(s,incoming)));}
  function reminders(){return T.normalize(initial.todos).filter(t=>!t.archived&&!t.done);}
  function checkReminders(){
    if(blocked)return [];
    try{initial=read();}catch(e){return [];}
    const due=T.pending(T.normalize(initial.todos));
    if(due.length&&document.visibilityState==='visible')write(s=>{s.todos=T.normalize(s.todos).map(t=>due.some(x=>x.id===t.id)?{...t,notifiedFor:t.remindAt,updatedAt:now()}:t);});
    return due;
  }
  if(!blocked){const missing=(D.readingUpdates||[]).filter(u=>!initial.appliedUpdates.includes(u.id));if(missing.length)write(s=>{for(const u of missing){if(!s.logs.some(l=>l.id===u.id))s.logs.push({id:u.id,date:u.date,title:u.title,text:u.text,paper:u.paper,kind:'阅读',createdAt:now()});s.papers[u.paper]={...s.papers[u.paper],status:'read',readDate:u.date,updatedAt:now()};s.appliedUpdates.push(u.id);}});}
  return {snapshot,save,record,recordText,saveRecord,exportRecords,importRecords,reminders,checkReminders,merge,validImport,get error(){return error;},get blocked(){return blocked;}};
})();
