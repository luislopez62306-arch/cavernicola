// Renderiza reel.html cuadro por cuadro y arma el MP4. Uso: node grabar.js [segundos=14] [fps=30]
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
(async () => {
  const dur = +(process.argv[2] || 13.5), fps = +(process.argv[3] || 30);
  const dir = path.join(__dirname, 'frames'); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'reel.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  const n = Math.round(dur * fps);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => window.render(t), i / fps);
    await p.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  await b.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${fps} -i ${dir}/f%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart ${path.join(__dirname, 'picnic-reel.mp4')}`);
  fs.rmSync(dir, { recursive: true });
  console.log('ok', n, 'cuadros');
})();
