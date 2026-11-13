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
if(typeof module!=='undefined')module.exports={PM,TOPICS,ACTS};
