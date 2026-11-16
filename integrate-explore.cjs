const fs=require('node:fs');
const version='20261116-inquiry60';
fs.cpSync('fair-share','public/fair-share',{recursive:true});
for(const file of ['index.html','advanced-math/index.html','origami/index.html','updates/index.html']){
 let html=fs.readFileSync('public/'+file,'utf8');
 const css=`<link rel="stylesheet" href="/atelier-ui/explore.css?v=${version}">`;
 html=html.includes("</head>")?html.replace("</head>",css+"</head>"):html.replace("<body",css+"<body");
 if(file==='index.html')html=html.replace('</body>',`<script src="/atelier-ui/explore.js?v=${version}"></script></body>`);
 fs.writeFileSync('public/'+file,html);
}
let sw=fs.readFileSync('public/sw.js','utf8').replace(/const VERSION = "[^"]+";/,`const VERSION = "${version}";`).replace('const CORE = [','const CORE = ["/atelier-ui/explore.css", "/atelier-ui/explore.js", ');fs.writeFileSync('public/sw.js',sw);
console.log('Discovery, hierarchy and accessibility enhancement integrated.');

require("./integrate-pack.cjs");
