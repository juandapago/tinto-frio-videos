const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:600,height:1100}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file://'+process.cwd()+'/robos.html');await p.waitForFunction(()=>window.renderAt,null,{timeout:60000});
const ts=JSON.parse(process.argv[3]); const t0=Date.now();
for(const t of ts){const d=await p.evaluate(t=>{renderAt(t);return document.getElementById('c').toDataURL('image/jpeg',.85)},t);
require('fs').writeFileSync(`${process.argv[2]}/k_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));}
console.log('errors',JSON.stringify(errs),'ms/frame',(Date.now()-t0)/ts.length);await b.close();})();
