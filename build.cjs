const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
fs.mkdirSync('public',{recursive:true});
execFileSync('tar',['-xzf','site-source.tar.gz','-C','public']);
const manifest=JSON.parse(fs.readFileSync('source-manifest.json','utf8'));
for(const [relative,expected] of Object.entries(manifest)) {
 const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join('public',relative))).digest('hex');
 if(actual!==expected)throw new Error('Source checksum mismatch: '+relative);
}
console.log('Verified '+Object.keys(manifest).length+' source files. Advanced Mathematics: 50 experiments.');
