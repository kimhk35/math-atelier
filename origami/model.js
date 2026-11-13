'use strict';
const PM=(()=>{const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a.x*b.y-a.y*b.x},0))/2;const line=(a,b,c,side=1)=>{const n=Math.hypot(a,b);if(n<1e-9)throw Error('두 점을 떨어뜨려 주세요');return{a:a/n,b:b/n,c:c/n,side}};const sheet=(w=2,h=2)=>[{flip:false,layer:0,pts:[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([x,y])=>({x,y,u:x,v:y}))}];function clip(p,l,k){let out=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length],d=(l.a*a.x+l.b*a.y-l.c)*l.side*k,e=(l.a*b.x+l.b*b.y-l.c)*l.side*k;if(d>=-1e-9)out.push({...a});if(d*e< -1e-18){let t=d/(d-e),v={};for(let key of ['x','y','u','v'])v[key]=a[key]+(b[key]-a[key])*t;out.push(v)}}return out.length>=3&&area(out)>1e-12?out:[]}function split(fs,l){let fixed=[],moving=[];for(let f of fs){let a=clip(f.pts,l,-1),b=clip(f.pts,l,1);if(a.length)fixed.push({...f,pts:a});if(b.length)moving.push({...f,pts:b})}return{fixed,moving}}function fold(fs,l,open=false){let{fixed,moving}=split(fs,l);if(open)return [...fixed,...moving];let layers=[...new Set(moving.map(f=>f.layer))].sort((a,b)=>a-b),base=Math.max(-1,...fixed.map(f=>f.layer))+1;return [...fixed,...moving.reverse().map(f=>({flip:!f.flip,layer:base+layers.length-1-layers.indexOf(f.layer),pts:f.pts.map(p=>{let d=l.a*p.x+l.b*p.y-l.c;return {...p,x:p.x-2*d*l.a,y:p.y-2*d*l.b}})}))]}function replay(w,h,steps){let f=sheet(w,h);for(let s of steps){f=fold(f,s.line,s.open);if(f.length>4096)throw Error('접는 조각이 너무 많습니다')}return f}return{area,line,sheet,clip,split,fold,replay}})();
const TOPICS=['선대칭의 발견','점과 점 포개기','각의 이등분','분수와 넓이','반복 이등분','직사각형 격자','대각선 격자','모서리 삼각형','마주 보는 모서리','중심으로 모으기','두 대칭축과 회전','평행선과 이동','등비수열 접기','피타고라스의 길이','종횡비와 닮음','제곱근의 구성','포물선의 접선','각도 부채','영역과 확률','기본형의 기하'];
const ACTS=[],fnum=x=>Number(x.toFixed(3)).toString(),st=(a,b,c,text='금색 선을 따라 표시된 쪽을 접으세요.',open=false)=>({line:PM.line(a,b,c),text,open});
for(let g=0;g<20;g++)for(let k=0;k<10;k++){let n=k+2,r=1/n,t=k*Math.PI/20,d=.2+k*.1,w=2,h=2,steps=[],title='',formula='',q='',explain='',points=[],rays=[];
switch(g){
case 0:title=k*9+'° 대칭축';steps=[st(-Math.sin(t),Math.cos(t),0)];formula='대응점을 잇는 선분 ⊥ 접는 선';q='축 위의 점은 왜 움직이지 않을까요?';explain='접는 선은 대응점 두 개를 잇는 선분의 수직이등분선입니다. 대칭이동은 거리를 보존합니다.';break;
case 1:{let p={x:-.8+k*.03,y:-.6+k*.08,label:'P'},v={x:.75-k*.025,y:.65-k*.04,label:'Q'};points=[p,v];title='P와 Q 포개기 '+(k+1);steps=[st(v.x-p.x,v.y-p.y,(v.x*v.x+v.y*v.y-p.x*p.x-p.y*p.y)/2,'Q를 P 위에 포개세요.')];formula='접는 선 위에서는 XP = XQ';q='두 점의 중점과 접는 선은 어떤 관계일까요?';explain='두 점까지의 거리가 같은 점들의 자취는 수직이등분선입니다.';break}
case 2:{let a=20+k*10;t=a*Math.PI/360;title=a+'°를 반으로';rays=[0,a];steps=[st(-Math.sin(t),Math.cos(t),0,'두 방향 사이의 이등분선을 접고 펼치세요.',true)];formula='나뉜 각 = '+a/2+'°';q='두 방향을 포갰을 때 각이 같아지는 이유는 무엇일까요?';explain='원점에서 시작하는 두 방향을 표시했습니다. 그 사이의 각을 반으로 나누는 선입니다.';break}
case 3:title='종이의 1/'+n+' 접기';steps=[st(1,0,1-2*r,'오른쪽의 1/'+n+' 넓이 부분을 접으세요.')];formula='움직이는 넓이 / 전체 = 1/'+n;q='접힌 넓이와 보이는 넓이는 어떻게 다를까요?';explain='눈금으로 지정한 세로선입니다. 눈금 없이 임의의 등분을 작도하는 절차와는 다릅니다.';break;
case 4:title=(k+1)+'번 반으로 접기';for(let j=1;j<=k+1;j++)steps.push(st(1,0,-1+2/2**j,j+'번째로 오른쪽을 왼쪽에 포개세요.'));formula='가로 폭은 1/'+2**(k+1)+'배';q='폭과 겹 수는 각각 어떤 수열을 이룰까요?';explain='이상적인 얇은 종이의 반복 이등분입니다. 실제 종이에는 두께에 따른 접기 한계가 있습니다.';break;
case 5:{let [a,b]=[[2,2],[2,3],[2,4],[3,3],[3,4],[3,5],[4,4],[4,5],[4,6],[5,6]][k];title=a+' × '+b+' 넓이 격자';for(let j=1;j<a;j++)steps.push(st(1,0,-1+2*j/a,'세로 '+j+'/'+a+' 위치를 접고 펼치세요.',true));for(let j=1;j<b;j++)steps.push(st(0,1,-1+2*j/b,'가로 '+j+'/'+b+' 위치를 접고 펼치세요.',true));formula='작은 칸의 넓이 = 전체 / '+a*b;q='칸 수는 왜 두 분할 수의 곱일까요?';explain='눈금으로 지정한 등간격 접는 선입니다. 각 칸은 합동인 직사각형입니다.';break}
case 6:title=n+'단계 대각선 격자';for(let j=1;j<n;j++){steps.push(st(1,1,-2+4*j/n,'첫 방향의 대각선을 접고 펼치세요.',true),st(1,-1,-2+4*j/n,'직교하는 대각선을 접고 펼치세요.',true))}formula='두 대각선 방향의 내적 = 0';q='모서리에서 잘린 칸도 가운데 칸과 넓이가 같을까요?';explain='내부의 완전한 마름모는 합동입니다. 경계의 잘린 칸은 다른 넓이를 가질 수 있습니다.';break;
case 7:title='모서리 길이 '+fnum(d)+' 삼각형';steps=[st(1,1,2-d)];formula='접히는 넓이 = '+fnum(d*d/2);q='직각변의 길이가 두 배이면 넓이는 몇 배일까요?';explain='한 변 2인 정사각형에서 직각변 길이가 '+fnum(d)+'인 이등변직각삼각형을 접습니다.';break;
case 8:d=.35+.07*k;title='마주 보는 두 모서리 '+(k+1);steps=[st(1,1,2-d),st(-1,-1,2-d)];formula='두 삼각형의 넓이 합 = '+fnum(d*d);q='두 모서리는 어떤 회전으로 대응할까요?';explain='원점 중심 180° 회전으로 대응하는 합동인 삼각형입니다.';break;
case 9:d=1+.04*k;title='네 모서리 안으로 '+(k+1);steps=[[1,1],[-1,1],[-1,-1],[1,-1]].map(([a,b])=>st(a,b,d));formula='접는 선: ±x±y = '+fnum(d);q='중심에 모이는 경우와 팔각형이 남는 경우를 비교하세요.';explain='d=1이면 네 꼭짓점이 중심에 모입니다. d>1이면 꼭짓점이 중심까지 닿지 않습니다.';break;
case 10:t=(k+1)*Math.PI/20;title='두 축 사이 '+(k+1)*9+'°';steps=[st(0,1,0,'첫 축을 접고 펼치세요.',true),st(-Math.sin(t),Math.cos(t),0,'둘째 축을 접고 펼치세요.',true)];formula='두 반사의 합성 회전각 = '+(k+1)*18+'°';q='축을 적용하는 순서를 바꾸면 어떻게 될까요?';explain='두 자국을 대칭축으로 생각합니다. 두 축의 교점을 중심으로 두 배 각의 회전이 만들어집니다.';break;
case 11:d=.1+.075*k;title='간격 '+fnum(d)+'인 평행선';steps=[st(1,0,-d/2,'첫 평행선을 접고 펼치세요.',true),st(1,0,d/2,'둘째 평행선을 접고 펼치세요.',true)];formula='합성 이동거리 = '+fnum(2*d);q='평행한 두 축으로 연속 대칭하면 회전이 생길까요?';explain='평행축에 대한 두 반사의 합성은 축 간격의 두 배만큼의 평행이동입니다.';break;
case 12:r=.25+.05*k;title='공비 '+fnum(r)+'의 자국';for(let j=1;j<=5;j++)steps.push(st(1,0,-1+2*r**j,j+'번째 위치를 접고 펼치세요.',true));formula='왼쪽에서의 거리 = 2 × '+fnum(r)+'ⁿ';q='인접한 간격의 비도 일정할까요?';explain='인접한 간격은 2rⁿ(1−r)이므로 그 비도 r입니다. 위치는 눈금으로 지정합니다.';break;
case 13:{let[a,b]=[[1,1],[1,2],[2,3],[3,4],[4,5],[5,12],[3,5],[2,5],[5,7],[7,8]][k];w=2*a/Math.max(a,b);h=2*b/Math.max(a,b);title=a+' : '+b+' 직사각형 대각선';steps=[st(h,-w,0,'대각선을 접고 펼치세요.',true)];formula='대각선 길이의 비 = √'+(a*a+b*b);q='대각선은 두 삼각형의 어떤 변일까요?';explain='피타고라스 정리로 길이를 구합니다. 화면은 같은 비율로 축소한 종이입니다.';break}
case 14:r=[1,Math.SQRT2,Math.sqrt(3),2,Math.sqrt(5),(1+Math.sqrt(5))/2,1.25,1.5,1.75,2.5][k];h=2/r;title=['1','√2','√3','2','√5','황금비','5/4','3/2','7/4','5/2'][k]+' 종횡비 반 접기';steps=[st(1,0,0)];formula='접은 뒤 가로/세로 = '+fnum(r/2);q='접고 돌렸을 때 원래 종이와 닮은 경우는 언제일까요?';explain='r/2=1/r에서 r²=2입니다. √2 비율의 종이를 반으로 접고 돌리면 원래와 닮습니다.';break;
case 15:n=k+1;h=2/n;title='√'+(n*n+1)+' 길이 찾기';steps=[st(h,-2,0,'대각선을 접고 펼치세요.',true)];formula='빗변 = √('+n+'²+1)';q='길이를 n배 확대하면 대각선도 n배일까요?';explain='가로 n과 세로 1인 직사각형을 화면에서는 가로 2로 축소했습니다.';break;
case 16:{let f=.15+.05*k;title='초점 높이 '+fnum(f)+' 포물선';points=[{x:0,y:f,label:'F'}];for(let j=0;j<9;j++){let x=-.8+.2*j;steps.push(st(x,-2*f,x*x/2,'준선의 점을 F에 포갠 뒤 펼치세요.',true))}formula='포락선: y=x²/'+fnum(4*f);q='직선 자국들이 감싸는 경계는 왜 곡선처럼 보일까요?';explain='초점 (0 '+fnum(f)+')과 준선 y=−'+fnum(f)+'를 사용합니다. 준선 위 점을 초점에 포개는 수직이등분선은 포물선의 접선입니다. 유한한 자국은 곡선 전체가 아닙니다.';break}
case 17:{let a=[30,45,60,72,90,108,120,135,150,180][k],p=2+k%5;title=a+'°를 '+p+'부분으로';rays=[0,a];for(let j=1;j<p;j++){let t=a*j/p*Math.PI/180;steps.push(st(-Math.sin(t),Math.cos(t),0,j+'번째 방향을 접고 펼치세요.',true))}formula='한 부분 = '+fnum(a/p)+'°';q='직선 양쪽과 부채 안쪽의 구역 수는 같을까요?';explain='각도 눈금으로 지정한 등분선입니다. 임의의 각을 눈금 없이 등분하는 작도 절차와는 다릅니다.';break}
case 18:r=(k+1)/11;title=(k+1)+'/22 확률 영역';steps=[st(1,0,-1+2*r,'세로선을 접고 펼치세요.',true),st(0,1,0,'가로 중심선을 접고 펼치세요.',true)];formula='왼쪽이면서 아래쪽일 확률 = '+(k+1)+'/22';q='확률을 넓이의 비로 계산하려면 어떤 가정이 필요할까요?';explain='종이 위의 점을 균일하게 고른다고 가정합니다. 왼쪽 비율 '+(k+1)+'/11과 아래쪽 비율 1/2의 곱입니다.';break;
case 19:{const specs=[['책 접기',[[1,0,0]]],['삼각 기본형',[[1,-1,0]]],['문 접기',[[1,0,.5],[-1,0,.5]]],['중심 네 자국',[[1,0,0],[0,1,0],[1,1,0],[1,-1,0]]],['방석 기본형',[[1,1,1],[-1,1,1],[-1,-1,1],[1,-1,1]]],['네 칸 소책자',[[1,0,0],[0,1,0]]],['삼각형 네 겹',[[1,-1,0],[1,1,0]]],['오각형 모서리형',[[1,1,1]]],['육각형 양끝형',[[1,1,1],[-1,-1,1]]],['창문 네 변형',[[1,0,.5],[-1,0,.5],[0,1,.5],[0,-1,.5]]]];title=specs[k][0];steps=specs[k][1].map(([a,b,c],j)=>st(a,b,c,(j+1)+'번째 금색 선을 따라 접으세요.',k===3));formula='거리 보존과 면적 보존';q='바깥 윤곽과 겹 수를 비교하고 펼친 자국에서 이유를 찾아보세요.';explain='기본형에서 생기는 도형을 탐구합니다. 변의 수가 같아도 모든 변과 각이 같은 정다각형인 것은 아닙니다.';break}}
ACTS.push({id:'paper-'+String(g*10+k+1).padStart(3,'0'),number:g*10+k+1,group:g+1,topic:TOPICS[g],title,steps,formula,q,explain,w,h,points,rays});}

// Ten new investigations. Each includes ten explicitly labelled parameter variants.
TOPICS.push('삼각형의 외심','삼각형의 무게중심','삼각형의 수심','원의 접선 포락선','타원의 접선 포락선','쌍곡선의 접선','조건부확률 영역','포함과 배제','이진수로 위치 찾기','제곱수와 차분');
for(let g=20;g<30;g++)for(let k=0;k<10;k++){
 let steps=[],points=[],rays=[],w=2,h=2,title='',formula='',q='',explain='';
 const mark=(x,y,label)=>({x,y,label}),crease=(a,b,c,text)=>st(a,b,c,text||'표시된 선을 접고 펼쳐 자국을 남기세요.',true);
 const P=mark(-.8,-.6,'A'),Q=mark(.8,-.6,'B'),R=mark(-.6+k*.13,.8,'C');
 const join=(p,r,text)=>crease(r.y-p.y,p.x-r.x,(r.y-p.y)*p.x+(p.x-r.x)*p.y,text);
 if(g===20){
  points=[P,Q,R];let O=mark(0,(R.x*R.x+R.y*R.y-P.x*P.x-P.y*P.y)/(2*(R.y-P.y)),'O');points.push(O);
  for(const [a,b] of [[P,Q],[Q,R],[R,P]])steps.push(crease(b.x-a.x,b.y-a.y,(b.x*b.x+b.y*b.y-a.x*a.x-a.y*a.y)/2,b.label+'를 '+a.label+'에 포갠 뒤 펼치세요.'));
  title='외심과 같은 거리 '+(k+1);formula='OA = OB = OC';q='세 수직이등분선이 한 점을 지나는 이유는 무엇일까요?';explain='삼각형의 꼭짓점을 두 개씩 포개는 자국입니다. 두 자국의 교점 O는 세 꼭짓점까지의 거리가 같습니다. 화면의 점은 접기 전 종이의 기준점입니다.';
 }else if(g===21){
  points=[P,Q,R,mark(R.x/3,(P.y+Q.y+R.y)/3,'G')];
  for(const [a,b,c] of [[P,Q,R],[Q,R,P],[R,P,Q]])steps.push(join(a,{x:(b.x+c.x)/2,y:(b.y+c.y)/2},a.label+'와 마주 보는 변의 중점을 잇는 선을 접고 펼치세요.'));
  title='중선의 2 대 1 분할 '+(k+1);formula='AG : GM = 2 : 1';q='꼭짓점을 옮겨도 무게중심의 분할비는 같을까요?';explain='중점 좌표를 이용해 지정한 중선을 접습니다. 세 꼭짓점 좌표의 평균이 G입니다. 균일한 삼각형 판의 질량중심에 해당합니다. 정사각형 종이 전체의 질량중심을 뜻하지 않습니다.';
 }else if(g===22){
  points=[P,Q,R,mark(R.x,-.6+(.64-R.x*R.x)/1.4,'H')];
  for(const [a,b,c] of [[P,Q,R],[Q,R,P],[R,P,Q]])steps.push(crease(c.x-b.x,c.y-b.y,(c.x-b.x)*a.x+(c.y-b.y)*a.y,a.label+'를 지나고 맞은편 변에 수직인 자국을 남기세요.'));
  title='세 높이의 교점 '+(k+1);formula='AH ⟂ BC / BH ⟂ AC / CH ⟂ AB';q='수심과 무게중심은 항상 같은 점일까요?';explain='높이는 꼭짓점에서 맞은편 변의 직선에 내린 수선입니다. 서로 다른 세 높이가 H에서 만납니다. 선의 위치는 좌표로 지정했습니다.';
 }else if(g===23){
  let r=.3+.05*k;points=[mark(0,0,'O')];for(let j=0;j<12;j++){let t=j*Math.PI/6;steps.push(crease(Math.cos(t),Math.sin(t),r,'반지름에 수직인 '+(j+1)+'번째 접선을 접고 펼치세요.'))}
  title='반지름 '+fnum(r)+' 원의 접선';formula='x cos θ + y sin θ = r';q='접선의 수를 늘리면 안쪽 경계는 어떻게 변할까요?';explain='중심에서 접는 직선까지의 거리는 r입니다. 12개 접선이 만드는 안쪽 다각형은 원에 외접합니다. 유한한 자국의 경계는 원 그 자체가 아닙니다.';
 }else if(g===24){
  let a=.9,b=.25+.05*k,c=Math.sqrt(a*a-b*b);points=[mark(-c,0,'F₁'),mark(c,0,'F₂')];
  for(let j=0;j<16;j++){let t=j*Math.PI/8;steps.push(crease(Math.cos(t)/a,Math.sin(t)/b,1,'타원 위 점에 대응하는 접선을 접고 펼치세요.'))}
  title='단축 '+fnum(2*b)+' 타원의 접선';formula='x cos θ / a + y sin θ / b = 1';q='두 초점을 가까이 옮기면 접선 자국의 경계는 어떻게 될까요?';explain='타원 (a cos θ  b sin θ)의 접선을 좌표로 지정했습니다. a=0.9이며 두 초점은 ±√(a²−b²)입니다. 자국은 곡선의 일부를 둘러싸는 유한한 근사입니다.';
 }else if(g===25){
  let a=.22+.02*k,b=.25,c=Math.hypot(a,b);points=[mark(-c,0,'F₁'),mark(c,0,'F₂')];
  for(const sign of [-1,1])for(let j=0;j<6;j++){let t=-.8+j*.32;steps.push(crease(sign*Math.cosh(t)/a,-Math.sinh(t)/b,1,'쌍곡선의 '+(sign>0?'오른쪽':'왼쪽')+' 가지 접선을 접고 펼치세요.'))}
  title='쌍곡선 양쪽 접선 탐구 '+(k+1);formula='xx₀/a² − yy₀/b² = 1';q='두 가지 사이의 빈 공간과 접선의 기울기는 어떻게 변할까요?';explain='x²/a²−y²/b²=1의 두 가지에서 선택한 12개 점의 접선을 표시합니다. 유한한 범위만 관찰합니다. 쌍곡선 전체를 실제 종이 위에 그리는 절차는 아닙니다.';
 }else if(g===26){
  let a=(k+1)/11,b=.25+.05*k;steps=[crease(1,0,-1+2*a,'왼쪽 영역 A의 경계선을 접고 펼치세요.'),crease(0,1,-1+2*b,'아래 영역 B의 경계선을 접고 펼치세요.')];points=[mark(-1+a,-1+b,'A∩B')];
  title='A 안에서 B일 확률 '+(k+1);formula='P(B|A) = P(A∩B)/P(A) = '+fnum(b);q='전체 종이 대신 A만 표본공간으로 삼으면 분모가 어떻게 바뀔까요?';explain='균일한 점 선택을 가정합니다. A는 왼쪽 세로 띠이며 B는 아래 가로 띠입니다. 두 사건은 독립이므로 조건부확률은 B의 높이 비율과 같습니다. 모든 사건이 독립인 것은 아닙니다.';
 }else if(g===27){
  let a=(k+1)/11,b=(10-k)/11;steps=[crease(1,0,-1+2*a,'왼쪽 띠 A의 경계를 접고 펼치세요.'),crease(0,1,-1+2*b,'아래 띠 B의 경계를 접고 펼치세요.')];points=[mark(-1+a,-1+b,'겹침')];
  title='겹친 넓이 한 번 빼기 '+(k+1);formula='P(A∪B) = a+b−ab = '+fnum(a+b-a*b);q='두 영역의 넓이를 더하면 어디를 두 번 세게 될까요?';explain='한 변 2인 종이에서 각 비율 a와 b를 사용합니다. 겹친 직사각형 비율 ab를 한 번 빼야 합집합 비율을 얻습니다. 눈금으로 경계를 지정합니다.';
 }else if(g===28){
  let r=(k+1)/11,lo=0,hi=1,bits='';points=[mark(-1+2*r,0,'P')];for(let j=0;j<6;j++){let mid=(lo+hi)/2;bits+=r>=mid?'1':'0';steps.push(crease(1,0,-1+2*mid,(j+1)+'번째 구간의 중점을 접고 P가 있는 반쪽을 선택하세요.'));if(r>=mid)lo=mid;else hi=mid}
  title=(k+1)+'/11의 이진 위치';formula='0.'+bits+'…₂ / 구간 폭 1/64';q='6번 이등분한 구간이 원래 위치를 정확히 포함하나요?';explain='전체 가로 길이를 1로 정규화한 좌표입니다. P를 포함한 구간을 반복 이등분합니다. 각 단계는 접고 펼쳐 자국만 남깁니다. 유한한 이진 근사와 원래 유리수의 무한 전개를 구별하세요.';
 }else{
  let n=k+6;for(let j=1;j<=5;j++)steps.push(crease(1,0,-1+2*(j/n)**2,j+'²/'+n+'² 위치를 접고 펼치세요.'));
  title='제곱수 간격과 두 번째 차분 '+(k+1);formula='xⱼ = −1+2j²/'+n+'² / Δ²x = '+fnum(4/n**2);q='간격은 일정하지 않은데 간격의 차이는 일정할까요?';explain='제곱수의 첫 차분은 연속한 홀수입니다. 좌표를 일정 비율로 축소해도 두 번째 차분이 일정하다는 성질은 유지됩니다. 위치는 눈금으로 지정합니다.';
 }
 ACTS.push({id:'paper-'+String(g*10+k+1).padStart(3,'0'),number:g*10+k+1,group:g+1,topic:TOPICS[g],title,steps,formula,q,explain,w,h,points,rays});
}
// Twenty further geometric investigations with ten parameter variants apiece.
TOPICS.push('삼각형의 내심','오일러 직선','구점원의 중심','수선의 발 삼각형','삼각형 넓이의 분할','체바 정리','메넬라우스 정리','안팎의 각이등분선','점에서 직선까지 거리','대칭이동과 거리','미끄럼반사의 합성','정다각형과 내접원','별다각형의 순환','다각형의 삼각분할','현의 길이와 중심각','원 안의 점과 현의 곱','산술평균과 기하평균','황금비 길이 작도','은비와 대각선','라디안과 호의 길이');
for(let g=30;g<50;g++)for(let k=0;k<10;k++){
 let steps=[],points=[],rays=[],guides=[],w=2,h=2,title='',formula='',q='',explain='';
 const pt=(x,y,label='')=>({x,y,label}),P=pt(-.8,-.6,'A'),Q=pt(.8,-.6,'B'),R=pt(-.6+.13*k,.8,'C');
 const mid=(a,b)=>pt((a.x+b.x)/2,(a.y+b.y)/2),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),crease=(a,b,c,text)=>st(a,b,c,text||'표시된 직선을 접고 펼쳐 자국을 남기세요.',true),join=(a,b,text)=>crease(b.y-a.y,a.x-b.x,(b.y-a.y)*a.x+(a.x-b.x)*a.y,text),bisect=(a,b)=>crease(b.x-a.x,b.y-a.y,(b.x*b.x+b.y*b.y-a.x*a.x-a.y*a.y)/2,'두 점을 포갠 뒤 펼치세요.');
 const closed=ps=>guides.push([...ps,ps[0]]),arc=(cx,cy,r,a=0,b=2*Math.PI)=>guides.push(Array.from({length:121},(_,j)=>pt(cx+r*Math.cos(a+(b-a)*j/120),cy+r*Math.sin(a+(b-a)*j/120))));
 const foot=(a,b,c)=>{let dx=c.x-b.x,dy=c.y-b.y,t=((a.x-b.x)*dx+(a.y-b.y)*dy)/(dx*dx+dy*dy);return pt(b.x+t*dx,b.y+t*dy)};
 const O=pt(0,(R.x*R.x-.36)/2.8,'O'),G=pt(R.x/3,-.4/3,'G'),H=pt(R.x,-.6+(.64-R.x*R.x)/1.4,'H');
 if(g===30){
  let a=dist(Q,R),b=dist(R,P),c=dist(P,Q),I=pt((a*P.x+b*Q.x+c*R.x)/(a+b+c),(a*P.y+b*Q.y+c*R.y)/(a+b+c),'I');points=[P,Q,R,I];closed([P,Q,R]);
  for(const [p,u,v]of[[P,Q,R],[Q,R,P],[R,P,Q]]){let d1=dist(p,u),d2=dist(p,v),end=pt(p.x+(u.x-p.x)/d1+(v.x-p.x)/d2,p.y+(u.y-p.y)/d1+(v.y-p.y)/d2);steps.push(join(p,end,'꼭짓점 '+p.label+'의 내각 이등분선을 접고 펼치세요.'))}arc(I.x,I.y,I.y+.6);
  title='세 변에서 같은 거리 '+(k+1);formula='내심에서 세 변까지의 거리 = 내접원 반지름';q='외심에서 같은 것은 꼭짓점까지의 거리였습니다. 내심은 무엇이 같을까요?';explain='세 내각 이등분선은 내심 I에서 만납니다. 이 실험의 이등분선은 두 변의 단위방향 벡터 합으로 계산했습니다. 원은 관찰용 기준선입니다.';
 }else if(g===31){
  points=[P,Q,R,O,G,H];closed([P,Q,R]);guides.push([O,H]);steps=[bisect(P,Q),bisect(Q,R),join(R,foot(R,P,Q)),join(O,H,'O와 H를 지나는 직선을 접고 펼치세요.')];
  title='외심과 무게중심과 수심 '+(k+1);formula='OG : GH = 1 : 2';q='삼각형을 바꾸어도 세 중심은 한 직선 위에 있을까요?';explain='정삼각형이 아닌 사례에서 외심 O와 무게중심 G 및 수심 H는 오일러 직선 위에 놓입니다. 정삼각형에서는 세 중심이 같아져 이 직선이 하나로 정해지지 않습니다.';
 }else if(g===32){
  let D=mid(P,Q),E=mid(Q,R),F=mid(R,P),N=mid(O,H);D.label='D';E.label='E';F.label='F';N.label='N';points=[P,Q,R,D,E,F,N];closed([P,Q,R]);closed([D,E,F]);arc(N.x,N.y,dist(O,P)/2);steps=[bisect(D,E),bisect(E,F),bisect(F,D)];
  title='중점 삼각형의 외심 '+(k+1);formula='구점원 반지름 = 외접원 반지름 / 2';q='세 변의 중점이 놓이는 원의 중심은 O와 H 사이 어디일까요?';explain='세 변의 중점으로 만든 삼각형의 외심 N은 OH의 중점입니다. 이 원은 높이의 발과 꼭짓점에서 수심까지의 중점도 지나지만 여기서는 세 변의 중점을 먼저 확인합니다.';
 }else if(g===33){
  let D=foot(P,Q,R),E=foot(Q,R,P),F=foot(R,P,Q);D.label='D';E.label='E';F.label='F';points=[P,Q,R,D,E,F];closed([P,Q,R]);closed([D,E,F]);steps=[join(P,D),join(Q,E),join(R,F),join(D,E),join(E,F),join(F,D)];
  title='세 높이의 발을 잇기 '+(k+1);formula='AD ⟂ BC / BE ⟂ CA / CF ⟂ AB';q='발로 만든 작은 삼각형의 꼭짓점은 어느 변 위에 있을까요?';explain='예각삼각형의 각 꼭짓점에서 맞은편 변으로 내린 수선의 발을 잇습니다. 일반적인 둔각삼각형에서는 발이 변의 연장선 위에 올 수 있습니다.';
 }else if(g===34){
  let r=(k+1)/11,D=pt(P.x+(Q.x-P.x)*r,P.y,'D');points=[P,Q,R,D];closed([P,Q,R]);steps=[join(R,D,'C에서 밑변의 지정한 점 D까지 접고 펼치세요.')];
  title='밑변 비율 '+(k+1)+' 대 '+(10-k);formula='[ACD] : [BCD] = AD : DB';q='밑변이 달라도 높이가 같다면 넓이비는 어떻게 정해질까요?';explain='C에서 AB로 내린 높이가 두 삼각형에 공통입니다. 같은 높이를 갖는 삼각형의 넓이는 밑변 길이에 비례합니다. D는 눈금으로 지정했습니다.';
 }else if(g===35){
  let r=.3+.1*k,s=1.2,t=1/(r*s),D=pt((Q.x+r*R.x)/(1+r),(Q.y+r*R.y)/(1+r),'D'),E=pt((R.x+s*P.x)/(1+s),(R.y+s*P.y)/(1+s),'E'),F=pt((P.x+t*Q.x)/(1+t),(P.y+t*Q.y)/(1+t),'F');points=[P,Q,R,D,E,F];closed([P,Q,R]);steps=[join(P,D),join(Q,E),join(R,F)];
  title='세 선의 한 점 모임 '+(k+1);formula='(BD/DC)(CE/EA)(AF/FB) = 1';q='세 분할비 중 두 개를 정하면 나머지는 어떻게 정해야 할까요?';explain='세 점이 각각 변의 내부에 있는 체바 정리의 사례입니다. 세 꼭짓점에서 마주 보는 분할점을 이은 선은 한 점에서 만납니다. 세 비율은 눈금으로 지정했습니다.';
 }else if(g===36){
  let r=.28+.02*k,s=.62+.02*k,D=pt(P.x+r*(Q.x-P.x),P.y,'D'),E=pt(P.x+s*(R.x-P.x),P.y+s*(R.y-P.y),'E');
  let u={x:E.x-D.x,y:E.y-D.y},v={x:R.x-Q.x,y:R.y-Q.y},cross=(a,b)=>a.x*b.y-a.y*b.x,t=cross({x:Q.x-D.x,y:Q.y-D.y},v)/cross(u,v),F=pt(D.x+t*u.x,D.y+t*u.y,'F');
  let list=[P,Q,R,D,E,F],xmin=Math.min(...list.map(p=>p.x)),xmax=Math.max(...list.map(p=>p.x)),ymin=Math.min(...list.map(p=>p.y)),ymax=Math.max(...list.map(p=>p.y)),scale=1.6/Math.max(xmax-xmin,ymax-ymin);for(let p of list){p.x=(p.x-(xmin+xmax)/2)*scale;p.y=(p.y-(ymin+ymax)/2)*scale}
  points=list;closed([P,Q,R]);guides.push([Q,F]);steps=[join(D,E,'두 분할점을 지나는 직선을 접고 펼치세요.')];title='한 직선의 세 교점 '+(k+1);formula='(AD/DB)(BF/FC)(CE/EA) = 1';q='한 점이 변의 연장선 위에 놓이는 이유는 무엇일까요?';explain='D와 E는 두 변 내부에 있고 F는 나머지 변의 연장선에 있는 메넬라우스 정리의 사례입니다. 식은 양의 길이로 쓴 곱이며 유향선분의 부호 규약에서는 −1로 표현합니다. 보기 좋게 전체 도형을 같은 비율로 축소했습니다.';
 }else if(g===37){
  let a=(30+10*k)*Math.PI/180;points=[pt(0,0,'O')];rays=[0,30+10*k];steps=[crease(-Math.sin(a/2),Math.cos(a/2),0,'안쪽 이등분선을 접고 펼치세요.'),crease(Math.cos(a/2),Math.sin(a/2),0,'바깥쪽 이등분선을 접고 펼치세요.')];
  title='내각과 외각의 이등분선 '+(k+1);formula='두 이등분선이 이루는 각 = 90°';q='원래 각이 달라져도 두 이등분선은 수직일까요?';explain='내각과 인접 외각의 합이 180°이므로 각각의 절반을 더하면 90°입니다. 접는 선은 각도 좌표로 지정합니다.';
 }else if(g===38){
  let t=k*Math.PI/30,a=-Math.sin(t),b=Math.cos(t),c=-.15,p=pt(.25,.65,'P'),d=a*p.x+b*p.y-c,hp=pt(p.x-d*a,p.y-d*b,'H');points=[p,hp];guides.push([p,hp]);steps=[crease(a,b,c,'기준 직선을 접고 펼치세요.'),join(p,hp,'P를 지나고 기준선에 수직인 직선을 접고 펼치세요.')];
  title='가장 짧은 길이 '+(k+1);formula='PH = |aPₓ+bPᵧ−c| / √(a²+b²)';q='직선 위 다른 점으로 가는 길이보다 PH가 짧은 이유는 무엇일까요?';explain='점에서 직선까지의 거리는 수선의 발까지의 거리입니다. 수직 성분과 평행 성분으로 나누어 피타고라스 정리로 최소성을 증명할 수 있습니다.';
 }else if(g===39){
  let c=-.1+.025*k,p=pt(-.6,-.4,'P'),v=pt(.4,.5,'Q'),p1=pt(2*c-p.x,p.y,'P′'),v1=pt(2*c-v.x,v.y,'Q′');points=[p,v,p1,v1];guides.push([p,v],[p1,v1]);steps=[crease(1,0,c,'P와 P′가 포개지는 축을 접고 펼치세요.')];
  title='두 점의 거리가 보존되는가 '+(k+1);formula='PQ = P′Q′';q='점의 위치가 달라져도 어떤 길이와 각은 그대로일까요?';explain='x=c에 대한 대칭이동은 (x y)를 (2c−x y)로 보냅니다. 두 점 차이의 첫 성분은 부호만 바뀌므로 거리의 제곱이 보존됩니다.';
 }else if(g===40){
  let d=.1+.02*k,p=pt(-.5,-.35,'P'),p1=pt(p.x+2*d,-p.y,'P′');points=[p,p1];guides.push([p,p1]);steps=[crease(1,0,-d/2,'첫 세로축 자국을 남기세요.'),crease(1,0,d/2,'둘째 세로축 자국을 남기세요.'),crease(0,1,0,'가로축 자국을 남기세요.')];
  title='이동과 반사가 함께 '+(k+1);formula='(x y) → (x+2d −y)';q='이 변환에서 움직이지 않는 점을 찾을 수 있을까요?';explain='세 자국을 대칭축으로 순서대로 적용하면 가로 2d 이동 후 가로축 반사가 됩니다. d>0이므로 고정점이 없습니다. 종이 자체를 세 번 연속 이동시키는 대신 자국과 기준점을 비교합니다.';
 }else if(g===41){
  let n=k+3,r=.85,verts=Array.from({length:n},(_,j)=>pt(r*Math.cos(2*Math.PI*j/n),r*Math.sin(2*Math.PI*j/n))),apothem=r*Math.cos(Math.PI/n);closed(verts);arc(0,0,apothem);points=[pt(0,0,'O')];for(let j=0;j<n;j++)steps.push(join(verts[j],verts[(j+1)%n]));
  title='정'+n+'각형과 안쪽 원';formula='넓이 = 둘레 × 내접원 반지름 / 2';q='중심에서 변까지 거리가 같으면 넓이를 어떻게 나눌 수 있을까요?';explain='원의 반지름 0.85 위에 꼭짓점을 배치한 정다각형입니다. 변을 접는 자국으로 표시합니다. 원의 접점은 각 변의 중점이며 중심에서 만든 삼각형의 높이가 같습니다.';
 }else if(g===42){
  let n=k+5,step=2,verts=Array.from({length:n},(_,j)=>pt(.85*Math.cos(2*Math.PI*j/n),.85*Math.sin(2*Math.PI*j/n))),j=0,seen=new Set(),seq=[];while(!seen.has(j)){seen.add(j);seq.push(j);let next=(j+step)%n;steps.push(join(verts[j],verts[next]));j=next}closed(seq.map(i=>verts[i]));points=verts.map((p,j)=>pt(p.x,p.y,String(j)));
  title=n+'개 점에서 두 칸씩 잇기';formula='한 순환의 꼭짓점 수 = n / gcd(n 2)';q='점의 수가 짝수일 때와 홀수일 때 모든 점을 방문하나요?';explain='한 꼭짓점에서 시작해 두 칸씩 건너뜁니다. 홀수 n에서는 모든 꼭짓점을 방문하고 짝수 n에서는 두 순환으로 분리됩니다. 화면은 시작점 0의 한 순환을 표시합니다.';
 }else if(g===43){
  let n=k+3,v=Array.from({length:n},(_,j)=>pt(.85*Math.cos(2*Math.PI*j/n),.85*Math.sin(2*Math.PI*j/n)));closed(v);for(let j=0;j<n;j++)steps.push(join(v[j],v[(j+1)%n]));for(let j=2;j<n-1;j++)steps.push(join(v[0],v[j],'한 꼭짓점에서 대각선을 접고 펼치세요.'));
  title=n+'각형을 삼각형으로';formula='삼각형 수 = n−2 / 내부 대각선 수 = n−3';q='종이 전체의 조각 수와 다각형 안의 삼각형 수는 같을까요?';explain='볼록 정다각형 내부만 셉니다. 하나의 꼭짓점에서 삼각분할하면 내부 삼각형은 n−2개입니다. 정사각형 종이의 바깥 조각은 포함하지 않습니다.';
 }else if(g===44){
  let a=(20+15*k)*Math.PI/180,r=.8,A=pt(r,0,'A'),B=pt(r*Math.cos(a),r*Math.sin(a),'B');points=[pt(0,0,'O'),A,B];arc(0,0,r);guides.push([A,pt(0,0),B]);steps=[join(A,B),bisect(A,B)];
  title=(20+15*k)+'° 중심각의 현';formula='현의 길이 = 2r sin(θ/2)';q='중심각이 두 배면 현의 길이도 두 배일까요?';explain='현의 중점으로 내린 수선이 중심각을 이등분합니다. 반쪽 이등변삼각형에서 사인 비율로 길이를 구합니다. 각도는 도 단위로 표시합니다.';
 }else if(g===45){
  let r=.8,p=pt(.2+.02*k,0,'P'),t=(10+8*k)*Math.PI/180,u={x:Math.cos(t),y:Math.sin(t)},b=p.x*u.x,root=Math.sqrt(b*b+r*r-p.x*p.x),lo=-b-root,hi=-b+root,A=pt(p.x+lo*u.x,lo*u.y,'A'),B=pt(p.x+hi*u.x,hi*u.y,'B');points=[pt(0,0,'O'),p,A,B];arc(0,0,r);steps=[join(A,B),bisect(A,B)];
  title='한 점을 지나는 현의 곱 '+(k+1);formula='PA × PB = r²−OP²';q='현의 방향이 달라도 두 길이의 곱은 일정할까요?';explain='P는 원 내부에 있고 A와 B는 P를 지나는 직선과 원의 교점입니다. 식은 양의 거리의 곱입니다. 유향선분을 쓰는 점의 멱은 OP²−r²로 음수입니다.';
 }else if(g===46){
  let a=.2+.16*k,b=2-a,x=a-1,hv=Math.sqrt(a*b);points=[pt(-1,0,'A'),pt(1,0,'B'),pt(x,0,'P'),pt(x,hv,'Q')];arc(0,0,1,0,Math.PI);guides.push([pt(-1,0),pt(x,hv),pt(1,0)]);steps=[crease(0,1,0),crease(1,0,x)];
  title='두 길이 '+fnum(a)+'와 '+fnum(b)+'의 평균';formula='√(ab) ≤ (a+b)/2 = 1';q='반원 위 점의 높이가 반지름을 넘을 수 있을까요?';explain='지름 길이 a+b=2인 반원에서 밑변을 a와 b로 나누는 수선의 높이는 √(ab)입니다. 점 Q가 반원 위에 놓인다는 기하 조건을 사용한 설명입니다.';
 }else if(g===47){
  let r=.25+.035*k,A=pt(-.6,-.5,'A'),B=pt(-.6+r,-.5,'B'),C=pt(-.6+r,-.5+r,'C'),D=pt(-.6,-.5+r,'D'),M=mid(A,B),E=pt(M.x+r*Math.sqrt(5)/2,M.y,'E');M.label='M';points=[A,B,C,D,M,E];closed([A,B,C,D]);arc(M.x,M.y,r*Math.sqrt(5)/2,0,Math.atan2(1,.5));steps=[bisect(A,B),join(M,C),join(A,E)];
  title='정사각형에서 황금비 '+(k+1);formula='AE/AB = (1+√5)/2';q='밑변의 중점에서 위 꼭짓점까지의 길이는 얼마일까요?';explain='한 변 r인 정사각형에서 MC=√5 r/2입니다. M 중심의 이 길이를 밑변 방향으로 옮긴 E를 계산해 표시합니다. 원호는 길이 이동의 기준선이며 눈금 없는 종이접기만으로 E를 찾아내는 절차와는 구분합니다.';
 }else if(g===48){
  let r=.18+.02*k,A=pt(-.6,-.5,'A'),B=pt(-.6+r,-.5,'B'),C=pt(-.6+r,-.5+r,'C'),D=pt(-.6,-.5+r,'D'),E=pt(B.x+Math.SQRT2*r,B.y,'E');points=[A,B,C,D,E];closed([A,B,C,D]);arc(B.x,B.y,Math.SQRT2*r,0,3*Math.PI/4);steps=[join(B,D),join(A,E),bisect(A,B)];
  title='정사각형에서 은비 '+(k+1);formula='AE/AB = 1+√2';q='정사각형의 대각선을 한 변 옆에 더하면 어떤 비율이 될까요?';explain='BD=√2 r이며 AE=r+BD입니다. 길이를 원호로 옮기는 기준선을 함께 표시합니다. 은비는 δ²=2δ+1을 만족합니다. 좌표로 구성한 탐구이며 무표식 접기만의 작도 절차는 아닙니다.';
 }else{
  let degrees=15+20*k,t=degrees*Math.PI/180,r=.75,A=pt(r,0,'A'),B=pt(r*Math.cos(t),r*Math.sin(t),'B');points=[pt(0,0,'O'),A,B];arc(0,0,r,0,t);rays=[0,degrees];steps=[crease(0,1,0),join(pt(0,0),B)];
  title=degrees+'°를 라디안으로';formula='θ = '+fnum(t)+' rad / 호 길이 = rθ';q='반지름이 바뀌어도 호 길이를 반지름으로 나눈 비는 같을까요?';explain='라디안은 호의 길이와 반지름의 비입니다. 같은 끝점을 잇는 현의 길이와 호의 길이는 다릅니다. 표시된 호는 0°부터 지정 각도까지 반시계 방향입니다.';
 }
 ACTS.push({id:'paper-'+String(g*10+k+1).padStart(3,'0'),number:g*10+k+1,group:g+1,topic:TOPICS[g],title,steps,formula,q,explain,w,h,points,rays,guides});
}

if(typeof module!=='undefined')module.exports={PM,TOPICS,ACTS};
