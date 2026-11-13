'use strict';
const HundredMath={
 bary(nodes,values,x){let num=0,den=0;for(let j=0;j<nodes.length;j++){if(Math.abs(x-nodes[j])<1e-12)return values[j];let w=1;for(let k=0;k<nodes.length;k++)if(k!==j)w/=nodes[j]-nodes[k];w/=x-nodes[j];num+=w*values[j];den+=w}return num/den},
 cheb(n,x){let a=1,b=x;if(n===0)return a;for(let j=2;j<=n;j++)[a,b]=[b,2*x*b-a];return b},
 adaptive(f,eps){let leaves=[],capped=false;const S=(a,b)=>((b-a)/6)*(f(a)+4*f((a+b)/2)+f(b));function rec(a,b,old,e,d){let m=(a+b)/2,L=S(a,m),R=S(m,b),err=Math.abs(L+R-old)/15;if(err<=e||d===0){if(d===0&&err>e)capped=true;leaves.push({a,b,err});return L+R+(L+R-old)/15}return rec(a,m,L,e/2,d-1)+rec(m,b,R,e/2,d-1)}let value=rec(0,1,S(0,1),eps,12);return {value,leaves,capped}},
 dice(n){let p=[1];for(let j=0;j<n;j++){let next=Array(p.length+6).fill(0);p.forEach((v,k)=>{for(let d=1;d<=6;d++)next[k+d]+=v/6});p=next}return p},
 ruin(p,i,N=10){if(i===0)return 0;if(i===N)return 1;if(Math.abs(p-.5)<1e-10)return i/N;let r=(1-p)/p;return (1-r**i)/(1-r**N)},
 kl(p,q){return p*Math.log2(p/q)+(1-p)*Math.log2((1-p)/(1-q))},
 damped(g,t){if(Math.abs(g-1)<1e-9)return [Math.exp(-t)*(1+t),-t*Math.exp(-t)];let w=Math.sqrt(Math.abs(1-g*g)),s=g<1?Math.sin(w*t):Math.sinh(w*t),c=g<1?Math.cos(w*t):Math.cosh(w*t),e=Math.exp(-g*t);return [e*(c+g/w*s),-e*s/w]},
 lotka(x,y,T){const F=([x,y])=>[x*(1-y),y*(x-1)],ps=[[x,y]],n=Math.ceil(T/.01);if(!n)return ps;let h=T/n,p=[x,y];for(let j=0;j<n;j++){let a=F(p),b=F(p.map((v,i)=>v+h*a[i]/2)),c=F(p.map((v,i)=>v+h*b[i]/2)),d=F(p.map((v,i)=>v+h*c[i]));p=p.map((v,i)=>v+h*(a[i]+2*b[i]+2*c[i]+d[i])/6);ps.push(p)}return ps}
};
function milestoneDraw(){
 const s=state,C=colors,id=current.id,H=HundredMath;let metrics=[],legend=[],meaning=current.teacher;
 const metric=(...m)=>metrics=m,leg=(...l)=>legend=l,init=(r=3)=>graphInit(-r,r,-r,r,true),box=(x0,x1,y0,y1)=>{let h=Math.max(y1-y0,(x1-x0)*340/640),c=(y0+y1)/2;graphInit(x0,x1,c-h/2,c+h/2,true)};
 if(id==='power-method'){
  let p=[s.theta===90?0:Math.cos(rad(s.theta)),Math.sin(rad(s.theta))],ps=[p];for(let j=0;j<s.n;j++){p=[s.l*p[0],p[1]];p=vscale(p,1/Math.hypot(...p));ps.push(p)}init(1.45);circle(1,C.grey);ps.forEach((p,i)=>{line([0,0],p,C.teal,1);dot(p,C.teal,3)});arrow(ps[0],C.blue,'v₀');arrow(p,C.orange,'vₙ');
  metric(['현재 방향',fmt(Math.atan2(p[1],p[0])*180/Math.PI)+'°'],['레이리 몫',fmt(s.l*p[0]**2+p[1]**2)],['고윳값의 비',fmt(Math.min(s.l,1)/Math.max(s.l,1))]);leg([C.blue,'처음 방향'],[C.teal,'정규화한 반복'],[C.orange,'마지막 방향']);
 }
 if(id==='condition-number'){
  const v=[1,s.d/s.e];init(Math.max(1.8,Math.hypot(...v)*1.2));arrow([1,0],C.blue,'x');arrow(v,C.teal,'x+Δx');line([1,0],v,C.orange,3);
  metric(['조건수 κ₂',fmt(1/s.e)],['입력 상대오차',fmt(s.d)],['해의 상대오차',fmt(s.d/s.e)]);leg([C.blue,'원래 해'],[C.teal,'교란된 해'],[C.orange,'해의 이동']);
 }
 if(id==='qr-decomposition'){
  const u=[1,s.a],v=[s.b,1],r11=Math.hypot(...u),q1=vscale(u,1/r11),r12=vdot(q1,v),w=vadd(v,vscale(q1,-r12)),r22=Math.hypot(...w);init(2.8);arrow(u,C.blue,'a₁');arrow(v,C.orange,'a₂');arrow(q1,C.teal,'q₁');if(r22>1e-9)arrow(vscale(w,1/r22),C.teal,'q₂');line(vscale(q1,r12),v,C.grey,2,'4 4');
  metric(['r₁₁',fmt(r11)],['r₁₂',fmt(r12)],['r₂₂',r22<1e-9?'0 / 정규화 불가':fmt(r22)]);leg([C.blue,'첫 열'],[C.orange,'둘째 열'],[C.teal,'직교 단위기저']);
 }
 if(id==='ridge-regression'){
  const xs=[-2,-1,1,2],ys=[-2,-.8,1.5,2.5],cross=xs.reduce((v,x,i)=>v+x*ys[i],0),den=xs.reduce((v,x)=>v+x*x,0),m=cross/(den+s.l),rss=xs.reduce((v,x,i)=>v+(ys[i]-m*x)**2,0);graphInit(-2.5,2.5,-3,3);line([-2.5,-2.5*cross/den],[2.5,2.5*cross/den],C.grey,2,'5 4');line([-2.5,-2.5*m],[2.5,2.5*m],C.teal,3);xs.forEach((x,i)=>{line([x,m*x],[x,ys[i]],C.orange,2);dot([x,ys[i]],C.blue,6)});
  metric(['기울기 m',fmt(m)],['잔차 제곱합',fmt(rss)],['벌점을 포함한 값',fmt(rss+s.l*m*m)]);leg([C.grey,'벌점 없는 적합'],[C.teal,'릿지 적합'],[C.orange,'잔차']);
 }
 if(id==='complex-log'){
  const t=rad(s.t),arg=((t+Math.PI)%tau+tau)%tau-Math.PI,principal=Math.abs(arg+Math.PI)<1e-10?Math.PI:arg,p=[Math.log(s.r),principal];graphInit(-2.2,2.2,-7,7);line([-2,Math.PI],[2,Math.PI],C.grey,1,'4 4');line([-2,-Math.PI],[2,-Math.PI],C.grey,1,'4 4');line([p[0],-Math.PI],[p[0],Math.PI],C.teal,2);dot(p,C.orange,7);dot([p[0],t],C.blue,5);
  metric(['ln|z|',fmt(p[0])],['주편각',fmt(principal)],['연속 추적한 각',fmt(t)]);leg([C.orange,'Log z의 주값'],[C.blue,'연속 추적 로그'],[C.grey,'주편각의 경계']);
 }
 if(id==='complex-sine'){
  const F=t=>[Math.sin(t)*Math.cosh(s.y),Math.cos(t)*Math.sinh(s.y)],r=Math.cosh(s.y)*1.3;init(r);curve(samples(F,0,tau),C.teal);dot(F(s.t),C.orange,6);
  metric(['Re sin z',fmt(F(s.t)[0])],['Im sin z',fmt(F(s.t)[1])],['|sin z|',fmt(Math.hypot(...F(s.t)))]);leg([C.teal,'실수부가 한 주기 변한 상'],[C.orange,'현재 sin z']);
 }
 if(id==='lissajous'){
  init(1.35);curve(samples(t=>[Math.sin(s.a*t+rad(s.p)),Math.sin(s.b*t)],0,tau,1000),C.teal,2);dot([Math.sin(rad(s.p)),0],C.orange,6);
  metric(['진동수의 최대공약수',String(ExpansionMath.gcd(s.a,s.b))],['공통 매개변수 주기',fmt(tau/ExpansionMath.gcd(s.a,s.b))],['위상차',s.p+'°']);leg([C.teal,'진동의 합성 자취'],[C.orange,'t=0']);
 }
 if(id==='hypocycloid'){
  const r=1/s.n,F=t=>[(1-r)*Math.cos(t)+r*Math.cos((s.n-1)*t),(1-r)*Math.sin(t)-r*Math.sin((s.n-1)*t)],c=polar(1-r,s.t);init(1.35);circle(1,C.grey);curve(samples(F,0,tau,800),C.teal);curve(samples(t=>vadd(c,polar(r,t)),0,tau),C.blue,2);line(c,F(s.t),C.orange,2);dot(F(s.t),C.orange,6);
  metric(['작은 원의 반지름',fmt(r)],['첨점 수',String(s.n)],['현재 점의 거리',fmt(Math.hypot(...F(s.t)))]);leg([C.grey,'큰 원'],[C.blue,'구르는 원'],[C.teal,'점의 자취']);
 }
 if(id==='superellipse'){
  const F=t=>[Math.sign(Math.cos(t))*Math.abs(Math.cos(t))**(2/s.p),Math.sign(Math.sin(t))*Math.abs(Math.sin(t))**(2/s.p)],p=F(rad(s.t));init(1.35);curve(samples(F,0,tau,800),C.teal);dot(p,C.orange,6);line([0,0],p,C.orange,1.5);
  metric(['|x|ᵖ+|y|ᵖ',fmt(Math.abs(p[0])**s.p+Math.abs(p[1])**s.p)],['유클리드 거리',fmt(Math.hypot(...p))],['최대 노름',fmt(Math.max(...p.map(Math.abs)))]);leg([C.teal,'ℓᵖ 단위 경계'],[C.orange,'선택점']);
 }
 if(id==='jensen'){
  const x=(1-s.t)*s.a+s.t*s.b,y=(1-s.t)*Math.exp(s.a)+s.t*Math.exp(s.b);graphInit(-2.2,2.2,0,8.2);curve(samples(x=>[x,Math.exp(x)],-2,2),C.teal);line([s.a,Math.exp(s.a)],[s.b,Math.exp(s.b)],C.blue,2);line([x,Math.exp(x)],[x,y],C.orange,4);dot([x,y],C.blue);dot([x,Math.exp(x)],C.teal);
  metric(['입력 평균의 함숫값',fmt(Math.exp(x))],['함숫값의 가중평균',fmt(y)],['옌센 간격',fmt(y-Math.exp(x))]);leg([C.teal,'볼록함수'],[C.blue,'두 점을 잇는 현'],[C.orange,'두 평균의 차이']);
 }
 if(id==='mean-value'){
  const {a,b}=s,m=a*a+a*b+b*b,c=Math.sqrt(m/3);graphInit(-.1,2.1,-.3,8.5);curve(samples(x=>[x,x*x*x],0,2),C.teal);line([a,a**3],[b,b**3],C.blue,2);through([c,c**3],[.4,.4*m],C.orange);dot([c,c**3],C.orange,6);
  metric(['평균 변화율',fmt(m)],['접점 c',fmt(c)],['순간 변화율 3c²',fmt(3*c*c)]);leg([C.teal,'x³'],[C.blue,'할선'],[C.orange,'평행한 접선']);
 }
 if(id==='harmonic-bounds'){
  let sum=0,pts=[];for(let k=1;k<=s.n;k++){sum+=1/k;pts.push([k,sum])}graphInit(.5,Math.max(2,s.n+.5),0,Math.max(2,1+Math.log(s.n))*1.15);curve(pts,C.teal,2);pts.forEach(p=>dot(p,C.teal,3));curve(samples(x=>[x,Math.log(x+1)],1,Math.max(1.01,s.n)),C.blue,2);curve(samples(x=>[x,1+Math.log(x)],1,Math.max(1.01,s.n)),C.orange,2);
  metric(['아래 경계',fmt(Math.log(s.n+1))],['부분합 Hₙ',fmt(sum)],['위 경계',fmt(1+Math.log(s.n))]);leg([C.teal,'부분합'],[C.blue,'ln(n+1)'],[C.orange,'1+ln n']);
 }
 if(id==='runge-interpolation'){
  const F=x=>1/(1+25*x*x),nodes=Array.from({length:s.n+1},(_,j)=>-1+2*j/s.n),cheb=Array.from({length:s.n+1},(_,j)=>Math.cos((2*j+1)*Math.PI/(2*(s.n+1)))),vals=nodes.map(F),vs=cheb.map(F),ps=samples(x=>[x,H.bary(nodes,vals,x)],-1,1,600),qs=samples(x=>[x,H.bary(cheb,vs,x)],-1,1,600),ys=[0,1,...ps.map(p=>p[1]),...qs.map(p=>p[1])];graphInit(-1.05,1.05,Math.min(...ys)-.1,Math.max(...ys)+.15);curve(samples(x=>[x,F(x)],-1,1,600),C.grey,2);curve(ps,C.orange,2);curve(qs,C.teal,2);nodes.forEach(x=>dot([x,F(x)],C.orange,3));
  metric(['등간격 표본 최대오차',fmt(Math.max(...ps.map(([x,y])=>Math.abs(y-F(x)))))],['체비쇼프 표본 최대오차',fmt(Math.max(...qs.map(([x,y])=>Math.abs(y-F(x)))))],['보간점 수',String(s.n+1)]);leg([C.grey,'원래 함수'],[C.orange,'등간격 보간'],[C.teal,'체비쇼프 보간']);
 }
 if(id==='chebyshev'){
  graphInit(-1.1,1.1,-1.3,1.3);curve(samples(x=>[x,H.cheb(s.n,x)],-1,1,700),C.teal);for(let k=0;k<s.n;k++)dot([Math.cos((2*k+1)*Math.PI/(2*s.n)),0],C.blue,4);dot([s.x,H.cheb(s.n,s.x)],C.orange,6);
  metric(['Tₙ(x)',fmt(H.cheb(s.n,s.x))],['cos(n arccos x)',fmt(Math.cos(s.n*Math.acos(s.x)))],['서로 다른 실근',String(s.n)]);leg([C.teal,'체비쇼프 다항식'],[C.blue,'영점'],[C.orange,'확인점']);
 }
 if(id==='polar-jacobian'){
  const r0=s.r-s.d/2,r1=s.r+s.d/2,ps=[...samples(t=>polar(r0,t),0,s.t,40),...samples(t=>polar(r1,t),s.t,0,40)];init(2.6);polygon(ps,C.teal,.35);line([0,0],polar(r1,0),C.grey,1);line([0,0],polar(r1,s.t),C.grey,1);curve(samples(t=>polar(s.r,t),0,s.t),C.orange,3);
  metric(['좌표 넓이 dr dθ',fmt(s.d*s.t)],['실제 넓이',fmt(s.r*s.d*s.t)],['넓이 배율',fmt(s.r)]);leg([C.teal,'환형 부채꼴'],[C.orange,'중심 반지름의 호']);
 }
 if(id==='green-circulation'){
  init(2.6);circle(s.r,C.teal);for(let j=0;j<16;j++){let p=polar(s.r,tau*j/16),v=[-s.a*p[1],s.b*p[0]];scaledVector(p,v,C.blue,'',.18)}const value=Math.PI*s.r*s.r*(s.a+s.b);
  metric(['회전량 a+b',fmt(s.a+s.b)],['영역 넓이',fmt(Math.PI*s.r*s.r)],['반시계 순환',fmt(value)]);leg([C.teal,'반시계 경계'],[C.blue,'경계 위 벡터장']);
 }
 if(id==='divergence-flux'){
  init(2.8);polygon([[-s.w,-s.h],[s.w,-s.h],[s.w,s.h],[-s.w,s.h]],C.teal,.1);for(let j=-2;j<=2;j++)for(const p of [[s.w,j*s.h/2],[-s.w,j*s.h/2],[j*s.w/2,s.h],[j*s.w/2,-s.h]])scaledVector(p,[s.a*p[0],s.b*p[1]],C.blue,'',.16);
  metric(['발산 a+b',fmt(s.a+s.b)],['직사각형 넓이',fmt(4*s.w*s.h)],['바깥쪽 순유출',fmt(4*s.w*s.h*(s.a+s.b))]);leg([C.teal,'적분 영역'],[C.blue,'경계 벡터장']);
 }
 if(id==='ellipse-support'){
  const p=Math.cos(rad(s.t)),q=Math.sin(rad(s.t)),h=Math.hypot(s.a*p,s.b*q),point=[s.a*s.a*p/h,s.b*s.b*q/h];init(2.8);curve(samples(t=>[s.a*Math.cos(t),s.b*Math.sin(t)],0,tau),C.teal);through(point,[-q,p],C.orange);arrow([p,q],C.blue,'목적 방향');dot(point,C.orange,7);
  metric(['최댓값',fmt(h)],['접점 x',fmt(point[0])],['접점 y',fmt(point[1])]);leg([C.teal,'제약 타원'],[C.blue,'목적 방향'],[C.orange,'지지 직선']);
 }
 if(id==='secant-method'){
  const F=x=>x*x-2,xs=[s.a,s.b],lines=[];let status='반복 완료';for(let j=0;j<s.n;j++){const a=xs.at(-2),b=xs.at(-1);if(Math.abs(F(b))<1e-12){status='잔차 기준 도달';break}let d=F(b)-F(a);if(Math.abs(d)<1e-14){status='분모가 작아 중단';break}let c=b-F(b)*(b-a)/d;lines.push([[a,F(a)],[b,F(b)],[c,0]]);xs.push(c)}graphInit(0,3.2,-2.3,8);curve(samples(x=>[x,F(x)],0,3),C.teal);for(const [a,b,c]of lines){line(a,b,C.grey,1);line(b,c,C.blue,1.5);dot(c,C.orange,4)}
  metric(['마지막 근사',fmt(xs.at(-1))],['절대오차',fmt(Math.abs(xs.at(-1)-Math.SQRT2))],['상태',status]);leg([C.teal,'x²−2'],[C.blue,'할선 연장'],[C.orange,'새 근사']);
 }
 if(id==='adaptive-simpson'){
  const F=x=>1/(1+s.k*s.k*(x-s.c)**2),r=H.adaptive(F,s.e),exact=(Math.atan(s.k*(1-s.c))+Math.atan(s.k*s.c))/s.k;graphInit(-.03,1.03,-.03,1.15);r.leaves.forEach((v,i)=>polygon([[v.a,0],[v.b,0],[v.b,F(v.b)],[v.a,F(v.a)]],i%2?C.blue:C.teal,.18));curve(samples(x=>[x,F(x)],0,1,600),C.teal);
  metric(['적분 근사',fmt(r.value)],['실제 절대오차',fmt(Math.abs(r.value-exact))],['분할 수',String(r.leaves.length)+(r.capped?' / 깊이 한도':'')]);leg([C.teal,'적분할 함수'],[C.blue,'적응적으로 나눈 구간']);
 }
 if(id==='rk4-method'){
  const h=4/s.n,z=s.k*h,E=1-z,R=1-z+z*z/2-z**3/6+z**4/24,es=[],rs=[];for(let j=0;j<=s.n;j++){es.push([j*h,E**j]);rs.push([j*h,R**j])}let ys=[0,1,...es.map(p=>p[1]),...rs.map(p=>p[1])],lo=Math.min(...ys),hi=Math.max(...ys),pad=Math.max(.1,(hi-lo)*.1);graphInit(-.1,4.1,lo-pad,hi+pad);curve(samples(t=>[t,Math.exp(-s.k*t)],0,4),C.grey,2,'5 4');curve(es,C.orange,2);curve(rs,C.teal,2);es.forEach(p=>dot(p,C.orange,3));rs.forEach(p=>dot(p,C.teal,3));
  metric(['시간 간격',fmt(h)],['오일러 끝점 오차',fmt(Math.abs(es.at(-1)[1]-Math.exp(-4*s.k)))],['RK4 끝점 오차',fmt(Math.abs(rs.at(-1)[1]-Math.exp(-4*s.k)))]);leg([C.grey,'정확한 해'],[C.orange,'오일러'],[C.teal,'RK4']);
 }
 if(id==='dft-alias'){
  const k=s.k%s.N,ps=Array.from({length:s.N},(_,j)=>[j/s.N,Math.sin(tau*s.k*j/s.N)]);graphInit(-.03,1.03,-1.2,1.2);curve(samples(t=>[t,Math.sin(tau*s.k*t)],0,1,900),C.grey,1.5);curve(samples(t=>[t,Math.sin(tau*k*t)],0,1,700),C.teal,2);ps.forEach(p=>dot(p,C.orange,4));
  metric(['원래 진동수',String(s.k)],['나머지 모드',String(k)],['표본 최대 차이',fmt(Math.max(...ps.map(([t,y])=>Math.abs(y-Math.sin(tau*k*t)))))]);leg([C.grey,'원래 연속 파형'],[C.teal,'나머지 모드'],[C.orange,'같은 표본값']);
 }
 if(id==='pascal-parity'){
  box(-s.n/2-1,s.n/2+1,-s.n-1,1);let count=0;for(let n=0;n<=s.n;n++)for(let k=0;k<=n;k++){let odd=Math.round(ExpansionMath.choose(n,k))%2;if(n===s.n&&odd)count++;dot([k-n/2,-n],odd?C.teal:C.grey,Math.max(2,10-s.n/4))}
  metric(['마지막 행 홀수 항',String(count)],['이진수의 1 개수',String(s.n.toString(2).replaceAll('0','').length)],['마지막 행 전체 항',String(s.n+1)]);leg([C.teal,'홀수'],[C.grey,'짝수']);
 }
 if(id==='chinese-remainder'){
  graphInit(-.6,4.6,-.6,2.6,true);let solution=0;for(let x=0;x<15;x++){let p=[x%5,x%3],chosen=x%5===s.b&&x%3===s.a;dot(p,chosen?C.orange:C.teal,chosen?12:6);label(p,String(x),C.grey,-5,-14);if(chosen)solution=x}line([s.b,-.5],[s.b,2.5],C.blue,1,'4 4');line([-.5,s.a],[4.5,s.a],C.blue,1,'4 4');
  metric(['0≤x<15의 해',String(solution)],['3으로 나눈 나머지',String(solution%3)],['5로 나눈 나머지',String(solution%5)]);leg([C.teal,'15개 나머지의 대응'],[C.orange,'선택한 해']);
 }
 if(id==='dice-clt'){
  const ps=H.dice(s.n),mean=3.5*s.n,variance=35*s.n/12,F=x=>Math.exp(-((x-mean)**2)/(2*variance))/Math.sqrt(tau*variance);graphInit(s.n-.8,6*s.n+.8,0,Math.max(...ps,F(mean))*1.2);ps.forEach((p,k)=>{if(p)line([k,0],[k,p],C.teal,Math.max(1,12/s.n))});curve(samples(x=>[x,F(x)],s.n,6*s.n),C.orange,2);
  metric(['합의 평균',fmt(mean)],['합의 분산',fmt(variance)],['정확한 질량 합',fmt(ps.reduce((a,b)=>a+b,0))]);leg([C.teal,'정확한 이산 확률'],[C.orange,'정규 밀도 근사']);
 }
 if(id==='gambler-ruin'){
  graphInit(-.3,10.3,-.03,1.08);const ps=Array.from({length:11},(_,i)=>[i,H.ruin(s.p,i)]);curve(ps,C.teal,2);ps.forEach(p=>dot(p,C.teal,4));line([0,0],[10,1],C.grey,1.5,'4 4');dot([s.i,H.ruin(s.p,s.i)],C.orange,7);
  metric(['목표 10 도달확률',fmt(H.ruin(s.p,s.i))],['0에 흡수될 확률',fmt(1-H.ruin(s.p,s.i))],['시작 위치',String(s.i)]);leg([C.teal,'도달확률'],[C.grey,'공정한 보행'],[C.orange,'선택 위치']);
 }
 if(id==='exponential-wait'){
  const F=t=>s.l*Math.exp(-s.l*t),limit=Math.max(6,4/s.l);graphInit(-.1,limit,0,s.l*1.15);polygon([[0,0],...samples(t=>[t,F(t)],0,s.t),[s.t,0]],C.teal,.2);curve(samples(t=>[t,F(t)],0,limit),C.teal);line([s.t,0],[s.t,F(s.t)],C.orange,2);
  metric(['평균 대기시간',fmt(1/s.l)],['t 이내 발생확률',fmt(1-Math.exp(-s.l*s.t))],['t 초과 생존확률',fmt(Math.exp(-s.l*s.t))]);leg([C.teal,'대기시간 밀도와 누적 넓이'],[C.orange,'현재 시간']);
 }
 if(id==='kl-divergence'){
  const ps=samples(q=>[q,H.kl(s.p,q)],.02,.98);graphInit(0,1,-.05,Math.max(...ps.map(p=>p[1]))*1.15+.1);curve(ps,C.teal);dot([s.q,H.kl(s.p,s.q)],C.orange,7);dot([s.p,0],C.blue,4);
  metric(['D(P∥Q)',fmt(H.kl(s.p,s.q))],['D(Q∥P)',fmt(H.kl(s.q,s.p))],['차이',fmt(H.kl(s.p,s.q)-H.kl(s.q,s.p))]);leg([C.teal,'q에 따른 발산'],[C.orange,'선택한 q'],[C.blue,'두 분포가 같은 점']);
 }
 if(id==='damped-oscillator'){
  graphInit(-.2,10.2,-1.2,1.2);curve(samples(t=>[t,H.damped(s.g,t)[0]],0,10,600),C.teal);curve(samples(t=>[t,H.damped(s.g,t)[1]],0,10,600),C.blue,1.5,'4 4');const [x,v]=H.damped(s.g,s.t);dot([s.t,x],C.orange,6);
  metric(['감쇠 유형',Math.abs(s.g-1)<1e-9?'임계 감쇠':s.g<1?'부족 감쇠':'과도 감쇠'],['현재 변위',fmt(x)],['현재 에너지',fmt((x*x+v*v)/2)]);leg([C.teal,'변위'],[C.blue,'속도'],[C.orange,'선택 시간']);
 }
 if(id==='lotka-volterra'){
  const ps=H.lotka(s.x,s.y,s.t),Hval=p=>p[0]-Math.log(p[0])+p[1]-Math.log(p[1]),v=Hval(ps[0]),hi=Math.max(2,...ps.flat())*1.15;graphInit(0,hi,0,hi,true);line([0,1],[hi,1],C.grey,1,'4 4');line([1,0],[1,hi],C.grey,1,'4 4');curve(ps,C.teal,2);dot([s.x,s.y],C.blue,5);dot(ps.at(-1),C.orange,6);dot([1,1],C.grey,5);
  metric(['현재 먹이 개체군',fmt(ps.at(-1)[0])],['현재 포식자 개체군',fmt(ps.at(-1)[1])],['보존량 최대오차',fmt(Math.max(...ps.map(p=>Math.abs(Hval(p)-v))))]);leg([C.teal,'위상 궤적'],[C.blue,'초기점'],[C.orange,'현재점']);
 }
 finish(metrics,legend,meaning);
}
