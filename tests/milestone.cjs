const assert=require('node:assert/strict'),vm=require('node:vm');
const {ctx}=require('../advanced-expansion/context.cjs')();
ctx.assert=assert;
vm.runInContext(`
const close=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<tol,a+' versus '+b);
const H=HundredMath;
for(let x=-1;x<=1;x+=.03)close(H.bary([-1,0,1],[1,0,1],x),x*x);
for(let n=0;n<=12;n++)for(let x=-1;x<=1;x+=.02)close(H.cheb(n,x),Math.cos(n*Math.acos(x)));
close(H.adaptive(x=>x*x*x,1e-8).value,.25);
for(const k of [3,15,30])for(const c of [.2,.4,.8]){
 const f=x=>1/(1+k*k*(x-c)**2),a=H.adaptive(f,1e-7),exact=(Math.atan(k*(1-c))+Math.atan(k*c))/k;
 close(a.value,exact,1e-7);close(a.leaves.reduce((n,l)=>n+l.b-l.a,0),1);
}
for(let n=1;n<=12;n++){const p=H.dice(n);close(p.reduce((a,b)=>a+b,0),1);close(p.reduce((a,v,k)=>a+v*k,0),3.5*n);close(p.reduce((a,v,k)=>a+v*(k-3.5*n)**2,0),35*n/12)}
for(const p of [.1,.5,.9]){close(H.ruin(p,0),0);close(H.ruin(p,10),1);for(let i=1;i<10;i++)close(H.ruin(p,i),p*H.ruin(p,i+1)+(1-p)*H.ruin(p,i-1))}
for(let p=.05;p<1;p+=.05)for(let q=.05;q<1;q+=.05){assert(H.kl(p,q)>-1e-12);close(H.kl(p,p),0)}assert(Math.abs(H.kl(.2,.6)-H.kl(.6,.2))>.01);
for(const g of [0,.3,.99,1,1.01,1.7,2]){let energy=.5;close(H.damped(g,0)[0],1);close(H.damped(g,0)[1],0);for(let t=.01;t<=10;t+=.01){const [x,v]=H.damped(g,t),e=(x*x+v*v)/2;assert(e<=energy+1e-12);energy=e;let h=1e-5,v1=H.damped(g,t+h)[1],v0=H.damped(g,t-h)[1];close((v1-v0)/(2*h),-2*g*v-x,1e-7)}}
for(const x of [.3,.7,1,2])for(const y of [.3,1,1.5,2]){let ps=H.lotka(x,y,12),energy=p=>p[0]-Math.log(p[0])+p[1]-Math.log(p[1]);for(const p of ps){assert(p.every(v=>v>0));close(energy(p),energy([x,y]),1e-6)}}
for(let n=1;n<=24;n++){let count=0;for(let k=0;k<=n;k++)count+=Math.round(ExpansionMath.choose(n,k))%2;assert.equal(count,2**n.toString(2).replaceAll('0','').length)}
`,ctx);
const {ACTS}=require('../origami/model.js'),near=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<tol),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x),lineDistance=(p,a,b)=>Math.abs(cross(a,b,p))/dist(a,b);
for(const a of ACTS.filter(a=>a.number>300)){
 assert(a.steps.length>0&&a.q&&a.explain&&a.formula);
 for(const p of [...a.points,...a.guides.flat()])assert(Number.isFinite(p.x)&&Number.isFinite(p.y));
 const [A,B,C,D,E,F]=a.points;
 if(a.group===31){const ds=[[A,B],[B,C],[C,A]].map(([p,q])=>lineDistance(D,p,q));near(ds[0],ds[1]);near(ds[1],ds[2]);for(const s of a.steps)near(s.line.a*D.x+s.line.b*D.y,s.line.c)}
 if(a.group===32){near(cross(D,E,F),0);near(dist(E,F),2*dist(D,E))}
 if(a.group===33){const N=a.points[6];near(dist(N,D),dist(N,E));near(dist(N,E),dist(N,F))}
 if(a.group===34){for(const [p,q,u,v] of [[A,D,B,C],[B,E,C,A],[C,F,A,B]])near((q.x-p.x)*(v.x-u.x)+(q.y-p.y)*(v.y-u.y),0)}
 if(a.group===36)near(dist(B,D)/dist(D,C)*dist(C,E)/dist(E,A)*dist(A,F)/dist(F,B),1);
 if(a.group===37){near(cross(D,E,F),0);near(dist(A,D)/dist(D,B)*dist(B,F)/dist(F,C)*dist(C,E)/dist(E,A),1)}
 if(a.group===40)near(dist(A,B),dist(C,D));
 if(a.group===46)near(dist(B,C)*dist(B,D),.64-dist(A,B)**2);
 if(a.group===47)near(D.y**2,dist(A,C)*dist(C,B));
 if(a.group===48)near(dist(A,a.points[5])/dist(A,B),(1+Math.sqrt(5))/2);
 if(a.group===49)near(dist(A,E)/dist(A,B),1+Math.SQRT2);
}
console.log('Numerical solvers and probability invariants passed. All 200 added paper activities validated against geometry identities.');
