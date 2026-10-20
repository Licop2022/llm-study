(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.STUDY_MATH_TEXT=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Only explicit math delimiters are interpreted. Prose and user HTML stay escaped.
  function segments(text){
    const result=[],source=String(text??'');
    const pattern=/\\\(([\s\S]*?)\\\)/g;
    let cursor=0,match;
    while((match=pattern.exec(source))){
      if(match.index>cursor)result.push({kind:'text',text:source.slice(cursor,match.index)});
      result.push({kind:'math',text:match[1]});cursor=pattern.lastIndex;
    }
    if(cursor<source.length)result.push({kind:'text',text:source.slice(cursor)});
    return result;
  }
  function render(text,katex){
    return segments(text).map(part=>{
      if(part.kind==='text')return escape(part.text);
      try{
        if(!katex)throw Error('KaTeX unavailable');
        const html=katex.renderToString(part.text,{displayMode:false,throwOnError:true,trust:false,strict:'warn',output:'htmlAndMathml'});
        return `<span class="inline-math${part.text.length>70?' inline-math-wide':''}" data-math-inline="true">${html}</span>`;
      }catch(error){
        return `<span class="inline-math math-unavailable" data-math-inline="false">${escape('\\('+part.text+'\\)')}</span>`;
      }
    }).join('');
  }
  return {segments,render};
});
