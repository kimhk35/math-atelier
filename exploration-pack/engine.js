(function(root){'use strict';
function validate(items){if(!Array.isArray(items)||items.length!==60)throw Error('60개 활동이 필요합니다.');const ids=new Set(),titles=new Set();for(const a of items){if(!/^[a-z][a-z0-9-]+$/.test(a.id)||ids.has(a.id)||titles.has(a.title))throw Error('중복 또는 잘못된 ID: '+a.id);ids.add(a.id);titles.add(a.title);for(const k of ['title','category','level','goal','context','prompt','hint','explanation'])if(typeof a[k]!=='string'||!a[k].trim())throw Error(a.id+' 누락: '+k);if(!Array.isArray(a.choices)||a.choices.length!==4||new Set(a.choices).size!==4||!Number.isInteger(a.answer)||a.answer<0||a.answer>3)throw Error('선지 오류: '+a.id);if(a.table&&(!Array.isArray(a.table.headers)||!Array.isArray(a.table.rows)||a.table.rows.some(r=>r.length!==a.table.headers.length)))throw Error('표 형식 오류: '+a.id)}return true}
function assess(item,choice){if(!Number.isInteger(choice)||choice<0||choice>=item.choices.length)throw Error('선택 범위 오류');return {correct:choice===item.answer,answer:item.choices[item.answer],explanation:item.explanation}}
function filter(items, category, query, remaining, done, level = '') {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(item => {
    if (category !== 'all' && item.category !== category) return false;
    if (level && item.level !== level) return false;
    if (remaining && done[item.id]) return false;
    const text = [item.title, item.goal, item.context, item.category, item.prompt].join(' ').toLowerCase();
    return terms.every(term => text.includes(term));
  });
}
const api={validate,assess,filter};if(typeof module!=='undefined')module.exports=api;else root.InquiryEngine=api;
})(typeof window==='undefined'?globalThis:window);
