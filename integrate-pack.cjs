const fs=require('node:fs');
const items=['decision','data','logic'].flatMap(name=>JSON.parse(fs.readFileSync(`exploration-pack/data-${name}.json`,'utf8')));
require('./exploration-pack/engine.js').validate(items);
fs.mkdirSync('public/exploration-pack',{recursive:true});
for(const f of ['index.html','style.css','engine.js','app.js'])fs.copyFileSync('exploration-pack/'+f,'public/exploration-pack/'+f);
for (const directory of ['denominator', 'classroom']) {
  fs.cpSync('exploration-pack/' + directory, 'public/exploration-pack/' + directory, {recursive:true});
}
fs.writeFileSync('public/exploration-pack/data.js','window.InquiryActivities='+JSON.stringify(items)+';');
console.log('60 distinct inquiry activities integrated across 3 learning domains.');
