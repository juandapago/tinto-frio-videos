const { chromium } = require('playwright'); const DAY=JSON.parse(require('fs').readFileSync('ep.json','utf8')).day;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:600,height:1100}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file:///home/claude/brayan-dia-'+DAY+'.html');await p.evaluate(()=>document.fonts.ready);
const ts=JSON.parse(process.argv[3]);
for(const t of ts){const d=await p.evaluate(t=>{renderAt(t);return document.getElementById('c').toDataURL('image/jpeg',.8)},t);
require('fs').writeFileSync(`${process.argv[2]}/k_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));}
console.log('errors',JSON.stringify(errs),await p.evaluate(()=>TOTAL));await b.close();})();
