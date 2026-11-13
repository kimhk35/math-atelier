const fs=require('node:fs');
const revision='20261113-motion3';
for(const name of ['c18.gif','c18.png','c19.gif','c19.png'])fs.copyFileSync('assets/course-motion/'+name,'public/course-gif/'+name);
let app=fs.readFileSync('public/atelier.js','utf8');
function patch(before,after){if(!app.includes(before))throw new Error('Missing menu integration anchor: '+before.slice(0,70));app=app.replaceAll(before,after)}
// Course GIFs share the existing reduced-motion poster support.
patch('${o>=21?`<picture class="v3-course-motion">','${(o>=21||o===18||o===19)?`<picture class="v3-course-motion">');
patch('o===19?"origami/thumbs/paper-195.svg":o===18?"advanced-math/thumbs/linear.svg":"course-gif/c"+o+".gif"','"course-gif/c"+o+".gif"');
// Synthetic activity codes are internal identifiers rather than useful navigation labels.
patch('u === CU && CU!==0 && lessons.length > 1','h !== 18 && h !== 19 && u === CU && CU!==0 && lessons.length > 1');
patch('${t.lesson} · ${t.type}', '${t.grade===18||t.grade===19?"":t.lesson+" · "}${t.type}');
patch('${COURSES[t.grade].short} ${t.lesson}', '${COURSES[t.grade].short}${t.grade===18||t.grade===19?"":" "+t.lesson}');
patch('${GL(t.grade)} · ${t.lesson}', '${GL(t.grade)}${t.grade===18||t.grade===19?"":" · "+t.lesson}');
patch('<span class="at-map-code">${m.lesson}</span>', '${m.grade===18||m.grade===19?"":`<span class="at-map-code">${m.lesson}</span>`}');
fs.writeFileSync('public/atelier.js',app);
let root=fs.readFileSync('public/index.html','utf8').replace(/atelier\.js\?[^"']*/g,'atelier.js?v='+revision);
fs.writeFileSync('public/index.html',root);
const note='<li><h3>움직이는 과목 메뉴</h3><p>고급수학에는 행렬 변환 GIF를 넣고 종이접기에는 접고 펼치는 GIF를 넣었습니다. 과목 버튼의 그림자와 확대 효과를 보강했습니다. 고급수학과 종이접기의 숫자로만 된 하위 목록을 없애 주제별로 바로 살펴볼 수 있습니다.</p></li>';
for(const path of ['public/updates/notice-content.js','public/updates/index.html']){
 let s=fs.readFileSync(path,'utf8');s=s.replace('</ol>',note+'</ol>');fs.writeFileSync(path,s);
}
let policy=fs.readFileSync('public/updates/notice-policy.js','utf8').replace('theme2-hidden-day','motion3-hidden-day');fs.writeFileSync('public/updates/notice-policy.js',policy);
let sw=fs.readFileSync('public/sw.js','utf8').replace(/const VERSION = "[^"]+";/,'const VERSION = "'+revision+'";').replace('const CORE = [','const CORE = ["/course-gif/c18.gif", "/course-gif/c18.png", "/course-gif/c19.gif", "/course-gif/c19.png", ');fs.writeFileSync('public/sw.js',sw);
console.log('Animated course menus and simplified topic navigation integrated.');
