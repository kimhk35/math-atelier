const fs=require('node:fs'),vm=require('node:vm');
module.exports=function(){
 const dom={};const ctx=vm.createContext({console,document:{querySelector:key=>dom[key]??(dom[key]={innerHTML:'',textContent:''})}});
 const html=fs.readFileSync('public/advanced-math/index.html','utf8');
 vm.runInContext("const $=s=>document.querySelector(s),tau=2*Math.PI,rad=a=>a*Math.PI/180,fmt=x=>Math.abs(x)<1e-12?'0':(Math.abs(x)<1e-4||Math.abs(x)>1e5)?x.toExponential(3):Number(x.toFixed(4)).toString(),esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));let current,state;",ctx);
 for(const p of ['public/advanced-math/extra.js','advanced-expansion/labs.js','advanced-expansion/milestone-labs.js','public/advanced-math/render.js','advanced-expansion/render.js','advanced-expansion/milestone-render.js'])vm.runInContext(fs.readFileSync(p,'utf8'),ctx,{filename:p});
 vm.runInContext(html.slice(html.indexOf('let pieces=[]'),html.indexOf('function draw(){')),ctx);
 const labs=vm.runInContext('EXTRA_LABS.filter(l=>EXPANSION_IDS.has(l.id))',ctx);
 return {ctx,dom,labs,render(lab,values){ctx.testLab=lab;ctx.testValues=values;vm.runInContext('current=testLab;state={...current.defaults,...testValues};expandedDraw();',ctx);return {svg:dom['#graph'].innerHTML,metrics:dom['#metrics'].innerHTML,range:vm.runInContext('range',ctx)}}};
};
