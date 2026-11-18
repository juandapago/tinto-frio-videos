const { chromium } = require('playwright'); const DAY=JSON.parse(require('fs').readFileSync(process.argv[2]+'/ep.json','utf8')).day; const { spawn } = require('child_process');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:600,height:1100}});
await p.goto('file:///home/claude/brayan-dia-'+DAY+'.html');await p.evaluate(()=>document.fonts.ready);
const T=await p.evaluate(()=>TOTAL), fps=30, n=Math.ceil(T*fps);
const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-i',process.argv[2]+'/st_norm.wav',
 '-c:v','libx264','-preset','medium','-crf','21','-pix_fmt','yuv420p','-profile:v','high','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709',
 '-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart','/home/claude/brayan-dia-'+DAY+'.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<n;i++){const d=await p.evaluate(t=>{renderAt(t);return document.getElementById('c').toDataURL('image/jpeg',.95)},i/fps);
 if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64'))) await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); console.log('frames',n);})();
