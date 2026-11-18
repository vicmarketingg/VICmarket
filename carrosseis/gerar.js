/* Gera os carrosséis em PNG (1080×1350) a partir de conteudo.js.
 * Uso: NODE_PATH=<pasta com playwright> node carrosseis/gerar.js
 * Saída: carrosseis/<slug>/01.png, 02.png… e legenda.txt */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const carrosseis = require('./conteudo');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

const CSS = `
:root { --navy:#172B45; --navy-deep:#0F1F33; --navy-2:#243E59; --rose:#B98599; --rose-light:#EBDDE3; --rose-ink:#96647A; --off:#F6F7F8; --ink:#30343B; --muted:#6B7280;
  --serif:'Cormorant Garamond', Georgia, serif; --sans:'Jost', 'Avenir Next', sans-serif; }
* { box-sizing:border-box; margin:0; }
body { background:#fff; }
.slide { width:1080px; height:1350px; position:relative; overflow:hidden; padding:190px 104px 170px; display:flex; flex-direction:column; justify-content:center;
  font-family:var(--sans); color:var(--ink); background:var(--off); }
.slide::before { content:''; position:absolute; inset:36px; border:1.5px solid rgba(23,43,69,.12); border-radius:6px; pointer-events:none; }
.top { position:absolute; top:84px; left:104px; right:104px; display:flex; justify-content:space-between; align-items:center;
  font-size:21px; letter-spacing:.28em; text-transform:uppercase; color:var(--navy-2); }
.top .name { font-family:var(--serif); font-size:34px; letter-spacing:.02em; text-transform:none; color:var(--navy); }
.top .name em { font-style:italic; color:var(--rose-ink); }
.foot { position:absolute; bottom:84px; left:104px; right:104px; display:flex; justify-content:space-between; align-items:center;
  font-size:20px; letter-spacing:.26em; text-transform:uppercase; color:var(--muted); }
.foot::before { content:''; position:absolute; left:0; right:0; top:-28px; height:1.5px; background:rgba(23,43,69,.1); }
.eyebrow { font-size:24px; letter-spacing:.3em; text-transform:uppercase; color:var(--rose-ink); font-weight:500; margin-bottom:40px; }
h1, h2 { font-family:var(--serif); font-weight:500; color:var(--navy); line-height:1.04; letter-spacing:-.005em; }
h1 em, h2 em { font-style:italic; color:var(--rose-ink); }
p.body { font-size:38px; line-height:1.55; font-weight:300; color:var(--ink); margin-top:44px; max-width:840px; }

/* capa */
.cover { background:radial-gradient(70% 55% at 100% 0%, rgba(185,133,153,.38), transparent 62%), radial-gradient(60% 50% at 0% 100%, rgba(36,62,89,.95), transparent 70%), var(--navy); color:#fff; }
.cover::before { border-color:rgba(235,221,227,.18); }
.cover .top, .cover .foot { color:#AFBDCD; }
.cover .top .name { color:#fff; } .cover .top .name em { color:var(--rose-light); }
.cover .foot::before { background:rgba(235,221,227,.16); }
.cover .eyebrow { color:var(--rose-light); }
.cover h1 { color:#fff; font-size:122px; line-height:1.0; }
.cover h1 em { color:var(--rose-light); }
.cover .rule { width:120px; height:2px; background:var(--rose); margin-top:64px; }

/* mito */
.label { display:inline-flex; align-items:center; gap:18px; font-size:24px; letter-spacing:.3em; text-transform:uppercase; color:var(--rose-ink); font-weight:500; }
.label i { width:46px; height:46px; border-radius:50%; border:1.5px solid var(--rose); display:grid; place-items:center; font-style:normal; font-size:24px; letter-spacing:0; color:var(--rose); }
.quote { font-family:var(--serif); font-style:italic; font-size:88px; line-height:1.08; color:var(--navy); margin-top:40px; text-decoration:line-through; text-decoration-color:rgba(185,133,153,.75); text-decoration-thickness:3px; }
.truth { margin-top:70px; padding-top:50px; border-top:1.5px solid rgba(23,43,69,.14); }
.truth .k { font-size:22px; letter-spacing:.3em; text-transform:uppercase; color:var(--navy-2); font-weight:500; }
.truth p { font-size:40px; line-height:1.5; font-weight:400; color:var(--ink); margin-top:22px; }

/* afirmação */
.statement h2 { font-size:112px; }
.statement .eyebrow { margin-bottom:34px; }

/* lista */
.list h2 { font-size:88px; margin-bottom:60px; }
.items { display:flex; flex-direction:column; }
.item { display:grid; grid-template-columns:90px 1fr; align-items:baseline; padding:30px 0; border-top:1.5px solid rgba(23,43,69,.12); }
.item:last-child { border-bottom:1.5px solid rgba(23,43,69,.12); }
.item b { font-family:var(--serif); font-style:italic; font-weight:500; font-size:62px; color:var(--rose); line-height:1; }
.item span { font-size:38px; line-height:1.4; color:var(--navy); }

/* passo */
.step .num { font-family:var(--serif); font-style:italic; font-size:300px; line-height:.8; color:var(--rose); font-weight:500; }
.step h2 { font-size:96px; margin-top:50px; }

/* fechamento */
.end { background:radial-gradient(80% 60% at 100% 0%, #fff, transparent 60%), var(--rose-light); }
.end h2 { font-size:104px; }
.end .cta { display:inline-block; max-width:872px; margin-top:64px; background:var(--navy); color:#fff; border-radius:44px; padding:26px 46px; font-size:26px; line-height:1.45; letter-spacing:.16em; text-transform:uppercase; font-weight:500; }
`;

function slideHTML(s, i, total) {
  const n = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const top = `<div class="top"><span class="name">Lívia <em>Serpa</em></span><span>${n}</span></div>`;
  const foot = `<div class="foot"><span>Sistema RCE®</span><span>${i + 1 < total ? 'Arraste →' : 'Salve · Compartilhe'}</span></div>`;
  let inner = '';
  switch (s.type) {
    case 'cover':
      inner = `<p class="eyebrow">${esc(s.eyebrow)}</p><h1>${rich(s.title)}</h1><div class="rule"></div>`; break;
    case 'myth':
      inner = `<span class="label"><i>✕</i>${esc(s.label)}</span><p class="quote">“${esc(s.quote)}”</p>
        <div class="truth"><span class="k">Na prática</span><p>${esc(s.truth)}</p></div>`; break;
    case 'statement':
      inner = `<p class="eyebrow">${esc(s.kicker)}</p><h2>${rich(s.title)}</h2><p class="body">${esc(s.body)}</p>`; break;
    case 'list':
      inner = `<h2>${rich(s.title)}</h2><div class="items">${s.items.map((t, k) => `<div class="item"><b>${k + 1}</b><span>${esc(t)}</span></div>`).join('')}</div>`; break;
    case 'step':
      inner = `<span class="num">${esc(s.num)}</span><h2>${rich(s.title)}</h2><p class="body">${esc(s.body)}</p>`; break;
    case 'end':
      inner = `<h2>${rich(s.title)}</h2><p class="body">${esc(s.body)}</p><span class="cta">${esc(s.cta)}</span>`; break;
    default: throw new Error(`Tipo de lâmina desconhecido: ${s.type}`);
  }
  return `<section class="slide ${s.type}">${top}<div>${inner}</div>${foot}</section>`;
}

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const c of carrosseis) {
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
      <style>${CSS}</style></head><body>${c.slides.map((s, i) => slideHTML(s, i, c.slides.length)).join('')}</body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family));
    if (!fonts.some((f) => /Cormorant/.test(f)) || !fonts.some((f) => /Jost/.test(f))) throw new Error('As fontes não carregaram; as imagens sairiam com fonte substituta.');
    const dir = path.join(__dirname, c.slug);
    fs.mkdirSync(dir, { recursive: true });
    const els = await page.$$('.slide');
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(dir, `${String(i + 1).padStart(2, '0')}.png`) });
    fs.writeFileSync(path.join(dir, 'legenda.txt'), `${c.title}\n\n${c.caption}\n`);
    console.log(`${c.slug}: ${els.length} lâminas`);
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
