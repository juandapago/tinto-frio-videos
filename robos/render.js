const { chromium } = require('playwright'); const { spawn } = require('child_process');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:600,height:1100}});
await p.goto('file://'+process.cwd()+'/robos.html');await p.waitForFunction(()=>window.renderAt,null,{timeout:60000});
const T=await p.evaluate(()=>TOTAL), fps=30, n=Math.ceil(T*fps);
const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-i','st_norm.wav',
 '-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',process.argv[2]||'/home/claude/robos.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<n;i++){const d=await p.evaluate(t=>{renderAt(t);return document.getElementById('c').toDataURL('image/jpeg',.93)},i/fps);
 if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64'))) await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); console.log('frames',n);})();
