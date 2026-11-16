(function(root){'use strict';
function allocate(weights,seats){
 if(!Array.isArray(weights)||weights.length<2||weights.length>8||!weights.every(x=>Number.isSafeInteger(x)&&x>=0&&x<=100000)||!Number.isSafeInteger(seats)||seats<1||seats>100)throw new Error('범위를 확인하세요.');
 const total=weights.reduce((a,b)=>a+b,0);if(!total)throw new Error('한 모둠 이상에 1명 이상을 입력하세요.');
 const rows=weights.map((w,i)=>({i,w,quota:w*seats/total,base:Math.floor(w*seats/total),remainder:(w*seats)%total,extra:0}));
 const left=seats-rows.reduce((a,r)=>a+r.base,0);
 [...rows].sort((a,b)=>b.remainder-a.remainder||a.i-b.i).slice(0,left).forEach(r=>r.extra=1);
 return {total,seats,left,rows:rows.map(r=>({...r,seats:r.base+r.extra,rounded:Math.round(r.quota)}))};
}
if(typeof module!=='undefined')module.exports={allocate};else root.FairShare={allocate};
})(typeof window==='undefined'?globalThis:window);
