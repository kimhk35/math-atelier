const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {labs,render,ctx}=require('../advanced-expansion/context.cjs')();
assert.equal(labs.length,50);assert.equal(new Set(labs.map(l=>l.id)).size,50);
let renders=0;
for(const l of labs){
 const states=[l.defaults,...l.presets.map(p=>({...l.defaults,...p[1]}))];
 for(const [key,,min,max] of l.params)states.push({...l.defaults,[key]:min},{...l.defaults,[key]:max});
 states.push(Object.fromEntries(l.params.map(([k,,lo])=>[k,lo])),Object.fromEntries(l.params.map(([k,,,hi])=>[k,hi])));
 for(const s of states){const out=render(l,s);assert(!/NaN|Infinity|undefined/.test(out.svg+out.metrics),l.id+' invalid SVG or metrics');assert.equal((out.metrics.match(/class="metric"/g)||[]).length,3,l.id+' must expose three metrics');assert(out.svg.includes('<path')||out.svg.includes('<polygon'),l.id+' has no rendered geometry');renders++}
}
vm.runInContext(`
 if(ExpansionMath.gcd(30,18)!==6)throw Error('GCD');
 if(Math.abs(ExpansionMath.entropy(.5)-1)>1e-12)throw Error('Entropy maximum');
 if(ExpansionMath.entropy(0)!==0||ExpansionMath.entropy(1)!==0)throw Error('Entropy limits');
 for(let n=1;n<=12;n++){const [p,q]=ExpansionMath.convergents(n).at(-1);if(Math.abs(p*p-2*q*q)!==1)throw Error('Pell identity')}
 for(let a=2;a<=30;a++)for(let b=2;b<=30;b++){const ts=ExpansionMath.tiles(a,b);if(ts.reduce((v,t)=>v+t.size*t.size,0)!==a*b)throw Error('Tile area');if(ts.at(-1).size!==ExpansionMath.gcd(a,b))throw Error('Last tile')}
 for(const [a,b] of [[1,1],[2,3],[16,16],[20,1]]){let sum=0,N=20000;for(let j=0;j<N;j++)sum+=ExpansionMath.beta((j+.5)/N,a,b)/N;if(Math.abs(sum-1)>1e-5)throw Error('Beta normalization')}
 if(ExpansionMath.bernstein(0,8)!==.5||ExpansionMath.bernstein(1,8)!==.5)throw Error('Bernstein endpoints');
`,ctx);
const {PM,ACTS,TOPICS}=require('../origami/model.js');assert.equal(ACTS.length,500);assert.equal(TOPICS.length,50);assert.equal(new Set(ACTS.map(a=>a.id)).size,500);
let steps=0;
for(const a of ACTS){let faces=PM.sheet(a.w,a.h);for(const s of a.steps){const split=PM.split(faces,s.line);if(a.number>200)assert(split.fixed.length&&split.moving.length,a.id+' fold must cross the paper');faces=PM.fold(faces,s.line,s.open);const area=faces.reduce((n,f)=>n+PM.area(f.pts),0);assert(Math.abs(area-a.w*a.h)<1e-8,a.id+' area must be conserved');assert(faces.every(f=>f.pts.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))),a.id+' finite coordinates');steps++}}
for(const a of ACTS.filter(a=>a.group===21)){
 const O=a.points[3],ds=a.points.slice(0,3).map(p=>Math.hypot(p.x-O.x,p.y-O.y));assert(Math.max(...ds)-Math.min(...ds)<1e-10,a.id+' circumcenter');
 for(const s of a.steps)assert(Math.abs(s.line.a*O.x+s.line.b*O.y-s.line.c)<1e-10,a.id+' concurrent bisectors');
}
for(const a of ACTS.filter(a=>a.group===22||a.group===23)){const p=a.points[3];for(const s of a.steps)assert(Math.abs(s.line.a*p.x+s.line.b*p.y-s.line.c)<1e-10,a.id+' concurrent lines')}
console.log(renders+' new experiment states checked. '+ACTS.length+' paper activities / '+steps+' fold steps conserve area.');
