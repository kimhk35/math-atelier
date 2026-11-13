'use strict';
const ExpansionMath={
 gcd(a,b){while(b){const r=a%b;a=b;b=r}return a},
 choose(n,k){let v=1;for(let j=1;j<=k;j++)v=v*(n-j+1)/j;return v},
 entropy(p){return p===0||p===1?0:-p*Math.log2(p)-(1-p)*Math.log2(1-p)},
 beta(x,a,b){let c=1;for(let j=1;j<=a+b-1;j++)c*=j;for(let j=1;j<a;j++)c/=j;for(let j=1;j<b;j++)c/=j;return c*x**(a-1)*(1-x)**(b-1)},
 bernstein(x,n){let v=0;for(let k=0;k<=n;k++)v+=Math.abs(k/n-.5)*this.choose(n,k)*x**k*(1-x)**(n-k);return v},
 convergents(n){let p=1,q=1,rows=[];for(let j=1;j<=n;j++){rows.push([p,q]);[p,q]=[p+2*q,p+q]}return rows},
 tiles(a,b){let x=0,y=0,w=a,h=b,level=0,tiles=[];while(w&&h){level++;if(w>=h){let n=Math.floor(w/h);for(let j=0;j<n;j++)tiles.push({x:x+j*h,y,size:h,level});x+=n*h;w%=h}else{let n=Math.floor(h/w);for(let j=0;j<n;j++)tiles.push({x,y:y+j*w,size:w,level});y+=n*w;h%=w}}return tiles}
};
function expandedDraw(){
 if(MILESTONE_IDS.has(current.id))return milestoneDraw();
 const s=state,C=colors,id=current.id,M=ExpansionMath;let metrics=[],legend=[],meaning=current.teacher;
 const metric=(...rows)=>metrics=rows,leg=(...rows)=>legend=rows,init=(r=3)=>graphInit(-r,r,-r,r,true);
 const box=(x0,x1,y0,y1)=>{const h=Math.max(y1-y0,(x1-x0)*340/640),cy=(y0+y1)/2;graphInit(x0,x1,cy-h/2,cy+h/2,true)};
 if(id==='gram-schmidt'){
  const u=[1,s.a],v=[s.b,1],p=vscale(u,vdot(v,u)/vdot(u,u)),w=vadd(v,vscale(p,-1)),norm=Math.hypot(...w);init(3);through([0,0],u,C.grey,'4 4');arrow(u,C.blue,'u');arrow(v,C.orange,'v');arrow(w,C.teal,'w');line(p,v,C.teal,2,'5 4');dot(p,C.grey);
  metric(['u·w',fmt(vdot(u,w))],['|w|',fmt(norm)],['둘째 방향',norm<1e-9?'정의되지 않음':'정규화 가능']);leg([C.blue,'첫 벡터'],[C.orange,'둘째 벡터'],[C.teal,'직교 성분']);
 }
 if(id==='matrix-exp'){
  const F=t=>[Math.exp(s.a*t),Math.exp(s.b*t)],ps=samples(F,0,4);const hi=Math.max(...ps.flat())*1.15;graphInit(-.1,hi,-.1,hi,true);curve(ps,C.grey,1.5,'4 4');curve(samples(F,0,s.t),C.teal);dot([1,1],C.blue);dot(F(s.t),C.orange,7);
  metric(['x(t)',fmt(F(s.t)[0])],['y(t)',fmt(F(s.t)[1])],['면적 배율 eᵗʳ⁽ᴬ⁾ᵗ',fmt(Math.exp((s.a+s.b)*s.t))]);leg([C.grey,'0부터 4까지'],[C.teal,'현재까지 궤도'],[C.orange,'현재점']);
 }
 if(id==='jordan-power'){
  const ps=Array.from({length:s.n+1},(_,j)=>j?[j*s.l**(j-1),s.l**j]:[0,1]),hi=Math.max(...ps.flat(),1)*1.15;graphInit(-.1,hi,-.1,hi,true);curve(ps,C.teal,2);ps.forEach(p=>dot(p,C.teal,3));dot(ps.at(-1),C.orange,6);
  metric(['첫째 성분',fmt(ps.at(-1)[0])],['둘째 성분',fmt(ps.at(-1)[1])],['무한 반복',s.l<1?'원점으로':s.l===1?'선형 증가':'발산']);leg([C.teal,'반복 궤도'],[C.orange,'n번째 점']);
 }
 if(id==='cayley-hamilton'){
  const {a,b,c,d}=s,tr=a+d,det=a*d-b*c,v=[1,.5],A=p=>[a*p[0]+b*p[1],c*p[0]+d*p[1]],av=A(v),lhs=A(av),rhs=vadd(vscale(av,tr),vscale(v,-det));init(Math.max(2,Math.hypot(...lhs)*1.2));arrow(v,C.grey,'v');arrow(av,C.blue,'Av');arrow(lhs,C.teal,'A²v');dot(rhs,C.orange,4);
  const res=Math.hypot(a*a+b*c-tr*a+det,a*b+b*d-tr*b,c*a+d*c-tr*c,c*b+d*d-tr*d+det);
  metric(['tr A',fmt(tr)],['det A',fmt(det)],['행렬 잔차 노름',fmt(res)]);leg([C.teal,'A²v'],[C.orange,'tr(A)Av − det(A)v'],[C.blue,'Av']);
 }
 if(id==='curvature'){
  const {a,x}=s,p=[x,a*x*x],slope=2*a*x,k=2*a/(1+slope*slope)**1.5,R=1/k,center=[x-slope*(1+slope*slope)/(2*a),a*x*x+(1+slope*slope)/(2*a)];graphInit(-3,3,-.7,5,true);curve(samples(t=>[t,a*t*t],-3,3),C.teal);curve(samples(t=>vadd(center,polar(R,t)),0,tau,400),C.orange,2);line(p,center,C.grey,1,'5 4');through(p,[.5,.5*slope],C.blue);dot(p,C.teal,6);dot(center,C.orange,4);
  metric(['접선 기울기',fmt(slope)],['곡률 κ',fmt(k)],['곡률반지름',fmt(R)]);leg([C.teal,'포물선'],[C.orange,'접촉원'],[C.blue,'접선']);
 }
 if(id==='cycloid'){
  const {r,t}=s,F=u=>[r*(u-Math.sin(u)),r*(1-Math.cos(u))],center=[r*t,r];box(-r,7.5*r,-.3*r,3*r);line([-r,0],[8*r,0],C.grey,2);curve(samples(F,0,tau),C.grey,1,'5 4');curve(samples(F,0,t),C.teal);curve(samples(u=>vadd(center,polar(r,u)),0,tau),C.blue,2);line(center,F(t),C.orange,2);dot(F(t),C.orange,6);
  metric(['이동한 중심 거리',fmt(r*t)],['점의 높이',fmt(F(t)[1])],['순간속력',fmt(2*r*Math.abs(Math.sin(t/2)))]);leg([C.teal,'점의 자취'],[C.blue,'굴러가는 원'],[C.orange,'표시한 반지름']);
 }
 if(id==='catenary'){
  const F=x=>s.a*(Math.cosh(x/s.a)-1),P=x=>x*x/(2*s.a);graphInit(-2.2,2.2,-.1,Math.max(1,F(2))*1.15);curve(samples(x=>[x,F(x)],-2,2),C.teal);curve(samples(x=>[x,P(x)],-2,2),C.blue,2,'5 4');line([s.x,P(s.x)],[s.x,F(s.x)],C.orange,4);dot([s.x,F(s.x)],C.orange);
  metric(['현수선 높이',fmt(F(s.x))],['포물선 높이',fmt(P(s.x))],['높이 차이',fmt(F(s.x)-P(s.x))]);leg([C.teal,'현수선'],[C.blue,'포물선 근사'],[C.orange,'현재 차이']);
 }
 if(id==='involute'){
  const {r,t}=s,F=u=>[r*(Math.cos(u)+u*Math.sin(u)),r*(Math.sin(u)-u*Math.cos(u))],q=polar(r,t);init(r*7.5);circle(r,C.blue);curve(samples(F,0,t),C.teal);line(q,F(t),C.orange,3);dot(q,C.blue,5);dot(F(t),C.orange,6);
  metric(['풀린 실 길이',fmt(r*t)],['접점에서 끝점 거리',fmt(Math.hypot(...vadd(F(t),vscale(q,-1))))],['끝점의 속력',fmt(r*t)]);leg([C.blue,'기준 원'],[C.teal,'실 끝의 자취'],[C.orange,'팽팽한 실']);
 }
 if(id==='epsilon-delta'){
  const {a,e}=s,delta=Math.min(1,e/(2*Math.abs(a)+1)),L=a-delta,R=a+delta;graphInit(a-1.4,a+1.4,Math.min(-.2,a*a-e-.4),Math.max((Math.abs(a)+1.4)**2,a*a+e+.4));polygon([[a-1.4,a*a-e],[a+1.4,a*a-e],[a+1.4,a*a+e],[a-1.4,a*a+e]],C.blue,.1);polygon([[L,range.ymin],[R,range.ymin],[R,range.ymax],[L,range.ymax]],C.orange,.1);curve(samples(x=>[x,x*x],a-1.4,a+1.4),C.teal);dot([a,a*a],C.teal);line([L,L*L],[L,a*a],C.orange,2);line([R,R*R],[R,a*a],C.orange,2);
  metric(['선택한 δ',fmt(delta)],['출력 허용오차 ε',fmt(e)],['끝점의 최대 오차',fmt(Math.max(Math.abs(L*L-a*a),Math.abs(R*R-a*a)))]);leg([C.teal,'x²'],[C.blue,'출력 허용 띠'],[C.orange,'입력 허용 구간']);
 }
 if(id==='richardson'){
  const {x,h}=s,D=z=>(Math.sin(x+z)-Math.sin(x-z))/(2*z),v=D(h),half=D(h/2),rich=(4*half-v)/3,exact=Math.cos(x);graphInit(-3,3,-1.5,1.5);curve(samples(u=>[u,Math.sin(u)],-3,3),C.grey);const p=[x,Math.sin(x)];through(p,[1,v],C.blue,'6 4');through(p,[1,rich],C.teal);dot([x-h,Math.sin(x-h)],C.blue);dot([x+h,Math.sin(x+h)],C.blue);dot(p,C.orange);
  metric(['정확한 도함수',fmt(exact)],['중앙차분 절대오차',fmt(Math.abs(v-exact))],['외삽 절대오차',fmt(Math.abs(rich-exact))]);leg([C.grey,'sin x'],[C.blue,'중앙차분 기울기'],[C.teal,'외삽 기울기']);
 }
 if(id==='bernstein'){
  const F=x=>M.bernstein(x,s.n),ps=samples(x=>[x,F(x)],0,1,240),err=Math.max(...ps.map(([x,y])=>Math.abs(y-Math.abs(x-.5))));graphInit(-.05,1.05,-.03,.6);curve([[0,.5],[.5,0],[1,.5]],C.blue,2);curve(ps,C.teal);dot([s.x,F(s.x)],C.orange,6);
  metric(['현재 다항식 값',fmt(F(s.x))],['현재 오차',fmt(F(s.x)-Math.abs(s.x-.5))],['표본 최대오차',fmt(err)]);leg([C.blue,'절댓값 함수'],[C.teal,'베른슈타인 다항식'],[C.orange,'선택점']);
 }
 if(id==='beta-update'){
  const {a,b,s:success,f}=s,A=a+success,B=b+f,prior=samples(x=>[x,M.beta(x,a,b)],0,1,400),post=samples(x=>[x,M.beta(x,A,B)],0,1,400),mean=A/(A+B);graphInit(-.03,1.03,0,Math.max(...prior.map(p=>p[1]),...post.map(p=>p[1]))*1.15);polygon([[0,0],...post,[1,0]],C.teal,.12);curve(prior,C.blue,2,'5 4');curve(post,C.teal);line([mean,0],[mean,M.beta(mean,A,B)],C.orange,2,'4 4');
  metric(['사후 평균',fmt(mean)],['사후 분산',fmt(A*B/((A+B)**2*(A+B+1)))],['관측 수',String(success+f)]);leg([C.blue,'사전 밀도'],[C.teal,'사후 밀도'],[C.orange,'사후 평균 위치']);
 }
 if(id==='poisson-limit'){
  const {n,p}=s,lambda=n*p,K=Math.min(n,Math.ceil(lambda+4*Math.sqrt(lambda)+3)),bin=[],poi=[];let mass=Math.exp(-lambda);
  for(let k=0;k<=K;k++){if(k)mass*=lambda/k;bin.push(M.choose(n,k)*p**k*(1-p)**(n-k));poi.push(mass)}
  graphInit(-1,K+1,0,Math.max(...bin,...poi)*1.15);for(let k=0;k<=K;k++){line([k-.14,0],[k-.14,bin[k]],C.teal,5);line([k+.14,0],[k+.14,poi[k]],C.orange,4)}
  metric(['공통 평균 np',fmt(lambda)],['이항분산',fmt(n*p*(1-p))],['표시 구간 최대 차이',fmt(Math.max(...bin.map((v,k)=>Math.abs(v-poi[k]))))]);leg([C.teal,'이항 확률질량'],[C.orange,'푸아송 확률질량']);
 }
 if(id==='binary-entropy'){
  graphInit(-.05,1.05,-.05,1.15);curve(samples(p=>[p,M.entropy(p)],0,1),C.teal);line([s.p,0],[s.p,M.entropy(s.p)],C.orange,2,'5 4');dot([s.p,M.entropy(s.p)],C.orange,6);dot([.5,1],C.blue,4);
  metric(['평균 정보량 H',fmt(M.entropy(s.p))+' bit'],['성공의 정보량',fmt(-Math.log2(s.p))],['실패의 정보량',fmt(-Math.log2(1-s.p))]);leg([C.teal,'이진 엔트로피'],[C.orange,'선택 확률'],[C.blue,'최댓값']);
 }
 if(id==='euclid-tiles'){
  const tiles=M.tiles(s.a,s.b),shown=tiles.filter(t=>t.level<=s.step),max=Math.max(s.a,s.b);box(-1,s.a+1,-1,s.b+1);polygon([[0,0],[s.a,0],[s.a,s.b],[0,s.b]],C.grey,.06);const palette=[C.teal,C.blue,C.orange];shown.forEach(t=>{const c=palette[(t.level-1)%3];polygon([[t.x,t.y],[t.x+t.size,t.y],[t.x+t.size,t.y+t.size],[t.x,t.y+t.size]],c,.3);if(t.size/max>.09)label([t.x+t.size/2,t.y+t.size/2],String(t.size),c,-5,5)});
  metric(['최대공약수',String(M.gcd(s.a,s.b))],['전체 나눗셈 단계',String(tiles.at(-1).level)],['표시한 정사각형',String(shown.length)]);leg([C.teal,'1차 및 4차 단계'],[C.blue,'2차 및 5차 단계'],[C.orange,'3차 및 6차 단계']);
 }
 if(id==='continued-fraction'){
  const rows=M.convergents(s.n),errors=rows.map(([p,q])=>p/q-Math.SQRT2),last=rows.at(-1);graphInit(.5,Math.max(2,s.n+.5),-.45,.12);line([.5,0],[s.n+.5,0],C.grey,1,'4 4');curve(errors.map((e,i)=>[i+1,e]),C.teal,2);errors.forEach((e,i)=>dot([i+1,e],C.teal,4));dot([s.n,errors.at(-1)],C.orange,6);
  metric(['수렴분수',last[0]+' / '+last[1]],['절대오차',fmt(Math.abs(errors.at(-1)))],['p²−2q²',String(last[0]**2-2*last[1]**2)]);leg([C.teal,'부호 있는 오차'],[C.orange,'현재 수렴분수']);
 }
 if(id==='heat-modes'){
  const f=x=>Math.exp(-s.k*s.t)*Math.sin(x)+.5*Math.exp(-9*s.k*s.t)*Math.sin(3*x),initial=x=>Math.sin(x)+.5*Math.sin(3*x);graphInit(-.1,Math.PI+.1,-.65,1.65);curve(samples(x=>[x,initial(x)],0,Math.PI),C.grey,2,'4 4');curve(samples(x=>[x,f(x)],0,Math.PI),C.teal);curve(samples(x=>[x,.5*Math.exp(-9*s.k*s.t)*Math.sin(3*x)],0,Math.PI),C.orange,1.5,'5 4');
  metric(['첫 모드 진폭',fmt(Math.exp(-s.k*s.t))],['셋째 모드 진폭',fmt(.5*Math.exp(-9*s.k*s.t))],['감쇠율의 비','9']);leg([C.grey,'처음 온도'],[C.teal,'현재 온도'],[C.orange,'고주파 성분']);
 }
 if(id==='wave-modes'){
  const a=Math.cos(s.t),b=s.a*Math.cos(s.n*s.t),f=x=>a*Math.sin(x)+b*Math.sin(s.n*x);graphInit(-.1,Math.PI+.1,-2.2,2.2);curve(samples(x=>[x,a*Math.sin(x)],0,Math.PI),C.blue,1.5,'4 4');curve(samples(x=>[x,b*Math.sin(s.n*x)],0,Math.PI),C.orange,1.5,'4 4');curve(samples(x=>[x,f(x)],0,Math.PI),C.teal);dot([0,0],C.grey);dot([Math.PI,0],C.grey);
  metric(['첫 모드 계수',fmt(a)],['둘째 모드 계수',fmt(b)],['보존 총에너지',fmt(Math.PI/4*(1+s.a*s.a*s.n*s.n))]);leg([C.teal,'두 모드의 합'],[C.blue,'첫 모드'],[C.orange,'둘째 모드']);
 }
 if(id==='limit-cycle'){
  const R=t=>1/Math.sqrt(1+(1/(s.r*s.r)-1)*Math.exp(-2*t)),F=t=>polar(R(t),t);init(2.3);circle(1,C.grey,'5 4');curve(samples(F,0,s.t,500),C.teal);dot([s.r,0],C.blue);dot(F(s.t),C.orange,6);
  metric(['현재 반지름',fmt(R(s.t))],['단위원과 거리',fmt(Math.abs(R(s.t)-1))],['각속도','1 rad / 시간']);leg([C.grey,'안정한 주기궤도'],[C.teal,'현재까지 궤적'],[C.orange,'현재점']);
 }
 if(id==='logistic-map'){
  const F=x=>s.r*x*(1-x),ps=[[s.x,0]],values=[s.x];let x=s.x;for(let j=0;j<s.n;j++){const y=F(x);ps.push([x,y],[y,y]);x=y;values.push(x)}graphInit(-.05,1.05,-.05,1.05,true);line([0,0],[1,1],C.grey,2);curve(samples(x=>[x,F(x)],0,1),C.blue);curve(ps,C.teal,1.3);dot(ps.at(-1),C.orange,6);
  metric(['마지막 xₙ',fmt(x)],['비영 고정점',fmt(1-1/s.r)],['그 고정점의 도함수',fmt(2-s.r)]);leg([C.blue,'반복 함수'],[C.grey,'y=x'],[C.teal,'거미줄 경로']);
 }
 finish(metrics,legend,meaning);
}
