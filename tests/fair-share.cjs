const assert=require('node:assert/strict');const {allocate}=require('../fair-share/math.js');
assert.deepEqual(allocate([1500,1500,900,500,500,200],25).rows.map(r=>r.seats),[7,7,4,3,3,1]);
assert.deepEqual(allocate([1500,1500,900,500,500,200],26).rows.map(r=>r.seats),[8,8,5,2,2,1]);
assert.deepEqual(allocate([1,1,1],2).rows.map(r=>r.seats),[1,1,0]);
let tests=0;for(let seed=0;seed<200;seed++)for(let seats=1;seats<=61;seats++){let w=Array.from({length:2+seed%5},(_,i)=>(seed*31+i*7)%47);const a=allocate(w,seats);assert.equal(a.rows.reduce((s,r)=>s+r.seats,0),seats);for(const r of a.rows){assert(r.seats>=Math.floor(r.quota)&&r.seats<=Math.ceil(r.quota));assert(r.w!==0||r.seats===0)}tests++}
assert.throws(()=>allocate([0,0],3));assert.throws(()=>allocate([1.1,2],3));assert.throws(()=>allocate([-1,2],3));console.log(tests+' allocation cases passed: sum, quota, zero weight, exact ties and Alabama example.');
