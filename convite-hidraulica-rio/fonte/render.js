const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = __dirname;
  const args = process.argv.slice(2);
  const fps = 30, DUR = 35;
  const outDir = path.join(dir, args[0] === 'preview' ? 'preview' : 'frames');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', m => console.log('page:', m.text()));
  page.on('pageerror', e => console.log('ERR', e.message));
  await page.goto('file://' + path.join(dir, 'scene.html'));
  await page.evaluate(() => window.ready);
  let times;
  if (args[0] === 'preview') times = args.slice(1).map(Number);
  else { const a = +(args[0] || 0), b = +(args[1] || DUR * fps); times = []; for (let i = a; i < b; i++) times.push(i / fps); }
  for (const t of times) {
    const url = await page.evaluate(t => window.grab(t), t);
    const name = args[0] === 'preview' ? `p_${t.toFixed(2)}.jpg` : `f_${String(Math.round(t * fps)).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(outDir, name), Buffer.from(url.split(',')[1], 'base64'));
  }
  await browser.close();
})();
