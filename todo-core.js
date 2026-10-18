/* 待办数据与日期规则；所有输入时间采用北京时间。 */
window.STUDY_TODOS = (() => {
  const iso = value => typeof value==='string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : '';
  function normalize(items) {
    const unique=new Map();
    for(const raw of (Array.isArray(items)?items:[]).slice(0,10000)) {
      if(!raw || !/^[a-z0-9-]{1,80}$/.test(raw.id||'') || typeof raw.title!=='string' || !raw.title.trim())continue;
      const item={id:raw.id,title:raw.title.trim().slice(0,200),notes:typeof raw.notes==='string'?raw.notes.slice(0,10000):'',paper:typeof raw.paper==='string'?raw.paper.slice(0,80):'',dueAt:iso(raw.dueAt),remindAt:iso(raw.remindAt),done:raw.done===true,archived:raw.archived===true,notifiedFor:iso(raw.notifiedFor),createdAt:iso(raw.createdAt),updatedAt:iso(raw.updatedAt)};
      if(!unique.has(item.id)||item.updatedAt>=unique.get(item.id).updatedAt)unique.set(item.id,item);
    }
    return [...unique.values()];
  }
  const localInput = value => value ? new Date(Date.parse(value)+8*3600000).toISOString().slice(0,16) : '';
  const fromInput = value => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value||'') ? iso(value+':00+08:00') : '';
  const day = value => localInput(value).slice(0,10);
  const due = (item,time=Date.now()) => !item.done&&!item.archived&&!!item.remindAt&&Date.parse(item.remindAt)<=time;
  const pending = (items,time=Date.now()) => items.filter(item=>due(item,time)&&item.notifiedFor!==item.remindAt);
  function calendar(item,time=Date.now()) {
    if(!item.dueAt)throw Error('请先设置截止时间，再导出日历。');
    const stamp=value=>new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const escape=value=>String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Zhiliang//Study Todos//ZH','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+item.id+'@zhiliang.local','DTSTAMP:'+stamp(time),'DTSTART:'+stamp(item.dueAt),'DTEND:'+stamp(Date.parse(item.dueAt)+1800000),'SUMMARY:'+escape(item.title),'DESCRIPTION:'+escape(item.notes),'STATUS:'+(item.done?'CANCELLED':'CONFIRMED')];
    if(item.remindAt&&!item.done)lines.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+escape(item.title),'TRIGGER;VALUE=DATE-TIME:'+stamp(item.remindAt),'END:VALARM');
    lines.push('END:VEVENT','END:VCALENDAR');
    const fold=line=>{let out='',bytes=0;for(const ch of line){const n=new TextEncoder().encode(ch).length;if(bytes+n>73){out+='\r\n ';bytes=1;}out+=ch;bytes+=n;}return out;};
    return lines.map(fold).join('\r\n')+'\r\n';
  }
  return {normalize,localInput,fromInput,day,due,pending,calendar};
})();
