const fs=require('node:fs');
const revision='20261113-notice500';
const {labs,render}=require('./advanced-expansion/context.cjs')();
if(labs.length!==50)throw Error('Expected fifty added advanced experiments');
for(const l of labs){const result=render(l,{});if(/NaN|Infinity|undefined/.test(result.svg+result.metrics))throw Error('Invalid experiment: '+l.id);fs.writeFileSync('public/advanced-math/thumbs/'+l.id+'.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 450"><style>text{font:14px system-ui;fill:#536777}.label{font-weight:700}</style>'+result.svg.replaceAll('var(--ui-sheet)','#fff').replaceAll('var(--ui-grid)','#e4eaf2').replaceAll('var(--ui-muted)','#5a6880')+'</svg>')}
for(const kind of ['labs','render'])fs.writeFileSync('public/advanced-math/expanded-'+kind+'.js',fs.readFileSync('advanced-expansion/'+kind+'.js','utf8')+'\n'+fs.readFileSync('advanced-expansion/milestone-'+kind+'.js','utf8')); 
let advanced=fs.readFileSync('public/advanced-math/index.html','utf8');
advanced=advanced.replace('<script src="render.js?v=50-1"></script>','<script src="expanded-labs.js?v='+revision+'"></script><script src="render.js?v='+revision+'"></script><script src="expanded-render.js?v='+revision+'"></script>');
advanced=advanced.replaceAll('50개','100개').replaceAll('50가지','100가지').replaceAll('7개 영역','9개 영역');
fs.writeFileSync('public/advanced-math/index.html',advanced);
let renderer=fs.readFileSync('public/advanced-math/render.js','utf8').replace('function extraDraw(){','function extraDraw(){if(EXPANSION_IDS.has(current.id))return expandedDraw();');fs.writeFileSync('public/advanced-math/render.js',renderer);
let catalogue=fs.readFileSync('public/atelier.js','utf8');const groupCounts={};const entries=labs.map(l=>({id:'advanced-'+l.id,grade:18,unit:l.group,lesson:l.group+'.'+(100+(groupCounts[l.group]=(groupCounts[l.group]||0)+1)),module:'advanced-math',title:l.name,type:'조작',time:'15분',color:'#007c78',tags:['고급수학','영재고',l.name],desc:l.desc,obs:[l.teacher],q:l.questions[0],formula:l.formula,links:[],npred:3}));
catalogue=catalogue.replace('for (const lab of PLUS_LABS)','M[18].push([8,"확률과 정보"],[9,"미분방정식과 동역학"]);\ng.push(...'+JSON.stringify(entries)+');\nfor (const lab of PLUS_LABS)').replaceAll('심화 탐구 50개','심화 탐구 100개');fs.writeFileSync('public/atelier.js',catalogue);
let root=fs.readFileSync('public/index.html','utf8').replace(/atelier\.js\?[^"']*/g,'atelier.js?v='+revision);fs.writeFileSync('public/index.html',root);
let policy=fs.readFileSync('public/updates/notice-policy.js','utf8').replace('motion3-hidden-day','notice500-hidden-day');fs.writeFileSync('public/updates/notice-policy.js',policy);
let sw=fs.readFileSync('public/sw.js','utf8').replace(/const VERSION = "[^"]+";/,'const VERSION = "'+revision+'";').replace('const CORE = [','const CORE = ["/advanced-math/expanded-labs.js?v='+revision+'", "/advanced-math/expanded-render.js?v='+revision+'", "/advanced-math/render.js?v='+revision+'", ');fs.writeFileSync('public/sw.js',sw);
console.log('Advanced mathematics: 100 experiments / Paper folding: 500 activities across 50 topics.');
