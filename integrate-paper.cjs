const fs=require('node:fs');
const {PM,TOPICS,ACTS}=require('./origami/model.js');
fs.cpSync('origami','public/origami',{recursive:true});
fs.mkdirSync('public/origami/thumbs',{recursive:true});
for(const a of ACTS){const faces=PM.replay(a.w,a.h,a.steps);const polys=faces.slice(-150).map(f=>'<polygon points="'+f.pts.map(p=>(200+p.x*90)+','+(150-p.y*90)).join(' ')+'" fill="'+(f.flip?'#d39a7c':'#f7edd4')+'" stroke="#917d59" stroke-width="1"/>').join('');fs.writeFileSync('public/origami/thumbs/'+a.id+'.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e2e7dd"/>'+polys+'</svg>')}
let src=fs.readFileSync('public/atelier.js','utf8');
const replace=(old,value)=>{if(!src.includes(old))throw Error('Integration anchor missing: '+old.slice(0,70));src=src.replace(old,value)};
replace('var COURSES = {','var COURSES = {\n19:{short:"종이접기",name:"수학 종이접기 공방",en:"Mathematical Paper Folding",color:"#a45c42",level:"융합 탐구"},');
replace('var GRADES = [','var GRADES = [19,');
replace('var GROUPS = [','var GROUPS = [["종이접기 탐구", [19]],');
replace('["advanced", "고급수학"','["paper", "종이접기", "수학 종이접기 공방", [19]], ["advanced", "고급수학"');
const labs=ACTS.map(a=>({id:a.id,grade:19,unit:a.group,lesson:a.group+'.'+((a.number-1)%10+1),module:'paper-fold',title:a.title,type:'조작',time:'10분',color:'#a45c42',tags:['종이접기',a.topic,a.title],desc:a.q,obs:[a.explain],q:a.q,formula:a.formula,links:[],npred:1}));
replace('for (const lab of PLUS_LABS)','M[19]='+JSON.stringify(TOPICS.map((t,i)=>[i+1,t]))+';\ng.push(...'+JSON.stringify(labs)+');\nfor (const lab of PLUS_LABS)');
replace('function thumbOf(t) {','function thumbOf(t) {\nif(t.module === "paper-fold") return `<svg viewBox="0 0 400 300"><image href="origami/thumbs/${t.id}.svg" width="400" height="300"/></svg>`;');
replace('if(e[0] === "lab" && a?.module === "advanced-math")','if(e[0] === "lab" && a?.module === "paper-fold") { location.replace("origami/#" + a.id); return; }\n  if(e[0] === "lab" && a?.module === "advanced-math")');
replace('o===18?"advanced-math/thumbs/linear.svg"','o===19?"origami/thumbs/paper-195.svg":o===18?"advanced-math/thumbs/linear.svg"');
replace('<div class="v3-rcrow"><a class="v3-rc v3-start" href="#/list?grade=18">','<div class="v3-rcrow"><a class="v3-rc v3-start" href="origami/"><span class="v3-start-ic">${IC.course}</span><span class="v3-rc-tx"><b>수학 종이접기 공방</b><small>종이 질감으로 접는 200개 활동</small></span></a><a class="v3-rc v3-start" href="origami/#free"><span class="v3-start-ic">${IC.course}</span><span class="v3-rc-tx"><b>자유접기 작업대</b><small>나만의 접는 선과 과정 저장</small></span></a><a class="v3-rc v3-start" href="#/list?grade=18">');
fs.writeFileSync('public/atelier.js',src);
let html=fs.readFileSync('public/index.html','utf8').replace(/atelier\.js(?:\?[^"']*)?/g,'atelier.js?v=paper-200-r1');fs.writeFileSync('public/index.html',html);
if(fs.existsSync('public/sw.js')){let sw=fs.readFileSync('public/sw.js','utf8');sw='// Paper workshop 200 release 2026-11-13\n'+sw;sw=sw.replace(/(const\s+(?:CACHE|VERSION|CACHE_NAME)\s*=\s*["'])([^"']+)/,(_,a,b)=>a+b+'-paper200');sw=sw.replace('const CORE = [','const CORE = ["/origami/", "/origami/app.js", "/origami/model.js", ');fs.writeFileSync('public/sw.js',sw)}
console.log('Paper workshop: 200 activities. Free folding ready.');
