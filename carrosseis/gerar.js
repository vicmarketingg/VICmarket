/* Gera os carrosséis em PNG (1080×1350) a partir de conteudo.js.
 * Layout editorial de colagem, na identidade da Lívia: azul-marinho, rosé, rosé-dourado, mármore,
 * Playfair Display nos títulos e Jost nos textos de apoio.
 * Uso: NODE_PATH=<pasta com playwright> node carrosseis/gerar.js
 * Opcional: carrosseis/logo.png (logotipo original) e photo: 'fotos/x.jpg' em lâminas cover/faixa.
 * Saída: carrosseis/<slug>/01.png, 02.png… e legenda.txt */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const carrosseis = require('./conteudo');

const W = 1080, H = 1350;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/(^|[^\w])_(.+?)_(?=[^\w]|$)/g, '$1<u>$2</u>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/\n/g, '<br>');
const dataUrl = (file) => `data:image/${path.extname(file).slice(1).replace('jpg', 'jpeg')};base64,${fs.readFileSync(file).toString('base64')}`;
const logoFile = path.join(__dirname, 'logo.png');
const logo = fs.existsSync(logoFile) ? dataUrl(logoFile) : null;

let uid = 0;
const id = (p) => `${p}${++uid}`;

/* ---------- Peças gráficas ---------- */
// Gradiente metálico rosé-dourado (moldura, clipe, ornamentos).
function metal(gid) {
  return `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#F3E1CF"/><stop offset=".28" stop-color="#C8A586"/><stop offset=".5" stop-color="#8F6B50"/>
    <stop offset=".72" stop-color="#E7CDB4"/><stop offset="1" stop-color="#A9825F"/></linearGradient>`;
}
// Mármore rosé dentro de um retângulo (x, y, w, h).
function marbleRect(x, y, w, h, seed, strong) {
  const m = id('m'), v = id('v');
  const box = `x="${x}" y="${y}" width="${w}" height="${h}" filterUnits="userSpaceOnUse"`;
  return `<filter id="${m}" ${box}>
      <feTurbulence type="fractalNoise" baseFrequency="0.0028 0.0045" numOctaves="4" seed="${seed}"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.91  0 0 0 0 0.68  0 0 0 0 0.69  1.8 0 0 0 -0.62"/></filter>
    <filter id="${v}" ${box}>
      <feTurbulence type="turbulence" baseFrequency="0.0019 0.0052" numOctaves="5" seed="${seed + 11}"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.50  0 0 0 0 0.52  -2.6 0 0 0 0.66"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.75 0.22 0 0 0 0 0 0 0"/></feComponentTransfer></filter>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FAE6E2"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#${m})" opacity="${strong ? 1 : 0.8}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#${v})" opacity="${strong ? 0.75 : 0.5}"/>`;
}
// Brilho de quatro pontas (no lugar das ilustrações do modelo).
function sparkle(x, y, s) {
  const g = id('g');
  const star = (dx, dy, k) => `<path transform="translate(${x + dx} ${y + dy}) scale(${s * k})" d="M0 -40 C3 -9 9 -3 40 0 C9 3 3 9 0 40 C-3 9 -9 3 -40 0 C-9 -3 -3 -9 0 -40Z" fill="url(#${g})"/>`;
  return `<defs>${metal(g)}</defs>${star(0, 0, 1)}${star(46 * s, -38 * s, 0.38)}${star(-40 * s, 34 * s, 0.26)}`;
}
// Clipe de papel metálico.
function clip(x, y, rot) {
  const g = id('g');
  return `<defs>${metal(g)}</defs><g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="M14 18 V150 A22 22 0 0 0 58 150 V30 A16 16 0 0 0 26 30 V140" fill="none" stroke="#3B2B20" stroke-opacity=".25" stroke-width="7" stroke-linecap="round" transform="translate(4 6)"/>
    <path d="M14 18 V150 A22 22 0 0 0 58 150 V30 A16 16 0 0 0 26 30 V140" fill="none" stroke="url(#${g})" stroke-width="6" stroke-linecap="round"/></g>`;
}
// Card com borda ondulada (selo).
function scallop(x, y, w, h, r, fill) {
  const nx = Math.round(w / (2 * r)), ny = Math.round(h / (2 * r));
  const sx = w / nx, sy = h / ny;
  let d = `M${x} ${y}`;
  for (let i = 0; i < nx; i++) d += ` a${sx / 2} ${r} 0 0 1 ${sx} 0`;
  for (let i = 0; i < ny; i++) d += ` a${r} ${sy / 2} 0 0 1 0 ${sy}`;
  for (let i = 0; i < nx; i++) d += ` a${sx / 2} ${r} 0 0 1 ${-sx} 0`;
  for (let i = 0; i < ny; i++) d += ` a${r} ${sy / 2} 0 0 1 0 ${-sy}`;
  return `<path d="${d}Z" fill="#0E1A2C" opacity=".28" transform="translate(10 18)" filter="url(#soft)"/><path d="${d}Z" fill="${fill}"/>`;
}
// Faixas curvas translúcidas.
const bands = (o = 0.13) => `<path d="M700 -60 Q 470 420 -80 700" stroke="#FFFFFF" stroke-opacity="${o}" stroke-width="64" fill="none"/>
  <path d="M1160 820 Q 780 1060 520 1420" stroke="#FFFFFF" stroke-opacity="${o}" stroke-width="64" fill="none"/>`;
const svg = (inner) => `<svg class="art" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter></defs>${inner}</svg>`;

const meta = (dark) => `<div class="meta ${dark ? 'on-dark' : ''}">
  <span>Dra. Lívia<br>Serpa</span><span>Tecnologias<br>aplicadas</span><span>Sistema<br>RCE®</span><span>${logo ? `<img src="${logo}" alt="Lívia Serpa">` : 'Educação<br>profissional'}</span></div>`;

/* ---------- Layouts ---------- */
function cover(s, seed, photo) {
  const bg = photo
    ? `<image href="${photo}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/><rect width="${W}" height="${H}" fill="#0E1A2C" opacity=".62"/>`
    : `<radialGradient id="cg${seed}" cx=".85" cy=".15" r=".6"><stop offset="0" stop-color="#C8A586" stop-opacity=".4"/><stop offset="1" stop-color="#C8A586" stop-opacity="0"/></radialGradient>
       <rect width="${W}" height="${H}" fill="url(#cg${seed})"/>`;
  const art = svg(`${bg}${bands()}
    <line x1="110" y1="418" x2="880" y2="418" stroke="#EBDDE3" stroke-opacity=".75" stroke-width="2"/>
    <line x1="930" y1="458" x2="930" y2="590" stroke="#EBDDE3" stroke-opacity=".75" stroke-width="2"/>
    ${sparkle(930, 418, 0.9)}`);
  return `<section class="slide dark cover">${art}
    <p class="kicker k1">${rich(s.kicker)}</p>${s.kicker2 ? `<p class="kicker k2">${rich(s.kicker2)}</p>` : ''}
    <h1 class="content">${rich(s.title)}</h1>${meta(true)}</section>`;
}
function card(s, seed) {
  const dark = !!s.dark;
  const art = svg(`${dark ? `<rect width="${W}" height="${H}" fill="#13233A"/>${bands(0.1)}` : marbleRect(0, 0, W, H, seed, true)}
    ${scallop(176, 196, 728, 900, 15, dark ? '#F1E3E8' : '#172B45')}
    ${clip(842, 150, 10)}`);
  return `<section class="slide card ${dark ? 'card-dark' : ''}">${art}
    <div class="content"><svg class="spk" viewBox="-80 -80 160 160">${sparkle(0, 0, 0.95)}</svg><span class="num">${esc(s.num)}</span><h2>${rich(s.title)}</h2>${s.body.map((p) => `<p>${rich(p)}</p>`).join('')}</div>${meta(false)}</section>`;
}
function caps(s, seed) {
  const art = svg(marbleRect(972, 70, 108, 1210, seed, true));
  return `<section class="slide light caps"><div class="dots dots-tl"></div><div class="dots dots-br"></div>${art}
    <div class="content"><span class="num">${esc(s.num)}</span><h2 class="giant"><span>${rich(s.title)}</span></h2>
    <p class="lead">${rich(s.lead)}</p><p>${rich(s.body)}</p></div>${meta(false)}</section>`;
}
function faixa(s, seed, photo) {
  const strip = photo
    ? `<image href="${photo}" x="0" y="70" width="360" height="1210" preserveAspectRatio="xMidYMid slice"/>`
    : marbleRect(0, 70, 360, 1210, seed, true);
  const word = s.word && !photo ? `<text x="0" y="0" transform="translate(205 675) rotate(-90)" text-anchor="middle"
      font-family="Playfair Display" font-style="italic" font-size="118" fill="#172B45" opacity=".9">${esc(s.word)}</text>` : '';
  const art = svg(`${strip}${word}<line x1="360" y1="70" x2="360" y2="1280" stroke="#C8A586" stroke-width="3"/>${sparkle(985, 285, 0.7)}`);
  return `<section class="slide light faixa"><div class="dots dots-br"></div>${art}
    <div class="content"><span class="num">${esc(s.num)}</span><h2>${rich(s.title)}</h2>${s.body.map((p) => `<p>${rich(p)}</p>`).join('')}</div>${meta(false)}</section>`;
}
function end(s, seed) {
  const art = svg(`<radialGradient id="eg${seed}" cx=".85" cy=".45" r=".5"><stop offset="0" stop-color="#C8A586" stop-opacity=".35"/><stop offset="1" stop-color="#C8A586" stop-opacity="0"/></radialGradient>
    <rect width="${W}" height="${H}" fill="url(#eg${seed})"/>${bands()}
    <line x1="110" y1="402" x2="300" y2="402" stroke="#EBDDE3" stroke-opacity=".75" stroke-width="2"/>`);
  return `<section class="slide dark end">${art}<p class="kicker">${rich(s.kicker)}</p>
    <div class="content"><h1>${rich(s.title)}</h1><p class="sub">${rich(s.sub)}</p></div>${meta(true)}</section>`;
}

const CSS = `
:root { --navy:#172B45; --ink:#0D1130; --rose:#B98599; --rose-light:#EBDDE3; --gold:#C8A586; --gold-deep:#9E7657; --paper:#FBF8F6;
  --serif:'Playfair Display', Georgia, serif; --sans:'Jost', 'Avenir Next', sans-serif; }
* { box-sizing:border-box; margin:0; }
.slide { width:${W}px; height:${H}px; position:relative; overflow:hidden; font-family:var(--sans); color:var(--ink); background:var(--paper); }
.slide::after { content:''; position:absolute; inset:0; pointer-events:none; opacity:.09; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); }
.dark { background:linear-gradient(160deg, #1B3150 0%, #13233A 55%, #0E1A2C 100%); color:#fff; }
.dark::after { mix-blend-mode:soft-light; opacity:.35; }
.art { position:absolute; inset:0; width:100%; height:100%; }
.content { position:absolute; }
b { font-weight:600; } u { text-decoration-thickness:2px; text-underline-offset:7px; }
em { font-style:italic; color:var(--gold-deep); }
.dark em { color:#E2C6A9; }

/* rodapé em grade, como no modelo */
.meta { position:absolute; left:110px; right:110px; bottom:70px; display:grid; grid-template-columns:repeat(4, 1fr); align-items:end;
  font-size:19px; line-height:1.3; letter-spacing:.07em; text-transform:uppercase; color:var(--ink); }
.meta span:nth-child(2) { text-align:center; padding-bottom:18px; } .meta span:nth-child(3) { text-align:center; } .meta span:nth-child(4) { text-align:right; }
.meta img { max-height:64px; max-width:150px; display:inline-block; }
.meta.on-dark { color:#E9EEF4; }
.card .meta { color:var(--ink); } .card:not(.card-dark) .meta { color:#2A1E25; }
.card-dark .meta { color:#E9EEF4; }
.caps .meta { right:150px; } .faixa .meta { left:410px; font-size:16px; }

/* capa */
.kicker { position:absolute; font-size:38px; line-height:1.32; letter-spacing:.03em; text-transform:uppercase; color:#F3F5F8; font-weight:400; }
.cover .k1 { left:110px; top:286px; }
.cover .k2 { left:110px; top:462px; color:#CFD8E3; }
.cover h1 { left:110px; right:110px; top:650px; font-family:var(--serif); font-weight:400; font-size:136px; line-height:.98; letter-spacing:-.035em; color:#fff; }

/* card ondulado */
.card .content { left:216px; width:648px; top:236px; height:820px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; color:#F6EEF1; }
.card .spk { width:150px; height:150px; margin-bottom:26px; }
.card-dark .content { color:var(--ink); }
.card .num { display:block; font-family:var(--serif); font-size:66px; line-height:1; color:#E2C6A9; margin-bottom:10px; }
.card-dark .num { color:var(--gold-deep); }
.card h2 { font-family:var(--serif); font-weight:600; font-size:72px; line-height:1.04; letter-spacing:-.015em; margin-bottom:40px; }
.card p { font-size:41px; line-height:1.4; font-weight:400; }
.card p + p { margin-top:30px; }

/* título gigante */
.dots { position:absolute; width:620px; height:420px; background-image:radial-gradient(circle, #D8C0AA 38%, transparent 42%); background-size:15px 15px; }
.dots-tl { left:-40px; top:-30px; -webkit-mask-image:radial-gradient(ellipse at 30% 30%, #000 0%, transparent 68%); }
.dots-br { right:-40px; bottom:-40px; width:560px; height:360px; -webkit-mask-image:radial-gradient(ellipse at 70% 80%, #000 0%, transparent 68%); }
.caps .content { left:90px; width:830px; top:210px; text-align:center; }
.caps .num { display:block; font-weight:600; font-size:46px; color:var(--gold-deep); margin-bottom:26px; }
.giant { width:1400px; margin-left:-285px; transform:scaleX(.593); transform-origin:center; font-family:var(--serif); font-weight:400; font-size:172px;
  line-height:.86; letter-spacing:-.01em; text-transform:uppercase; color:var(--gold-deep); }
.giant em { color:var(--navy); font-style:normal; }
.caps .lead { font-weight:600; font-size:48px; line-height:1.25; margin:52px auto 0; max-width:760px; color:var(--ink); }
.caps p { font-size:42px; line-height:1.4; font-weight:400; margin:34px auto 0; max-width:760px; }

/* faixa lateral */
.faixa .content { left:430px; right:80px; top:360px; text-align:right; }
.faixa .num { display:block; font-family:var(--serif); font-weight:600; font-size:72px; line-height:1; color:#7A4E5E; }
.faixa h2 { font-family:var(--serif); font-weight:600; font-size:72px; line-height:1.0; letter-spacing:-.02em; color:var(--navy); margin:6px 0 40px; }
.faixa p { font-size:41px; line-height:1.38; font-weight:400; }
.faixa p + p { margin-top:22px; }

/* fechamento */
.end .kicker { left:110px; top:356px; font-size:32px; letter-spacing:.2em; color:#E2C6A9; padding-left:210px; }
.end .content { left:110px; right:110px; top:470px; }
.end h1 { font-family:var(--serif); font-weight:400; font-size:116px; line-height:1.0; letter-spacing:-.03em; color:#fff; }
.end .sub { margin-top:56px; font-size:42px; line-height:1.4; font-weight:400; color:#E6EBF2; max-width:820px; }
`;

function slideHTML(s, i, c) {
  const seed = c * 20 + i + 3;
  const photo = s.photo ? dataUrl(path.join(__dirname, s.photo)) : null;
  switch (s.type) {
    case 'cover': return cover(s, seed, photo);
    case 'card': return card(s, seed);
    case 'caps': return caps(s, seed);
    case 'faixa': return faixa(s, seed, photo);
    case 'end': return end(s, seed);
    default: throw new Error(`Tipo de lâmina desconhecido: ${s.type}`);
  }
}

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const [c, car] of carrosseis.entries()) {
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>${CSS}</style></head><body>${car.slides.map((s, i) => slideHTML(s, i, c)).join('')}</body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const fams = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family).join(','));
    if (!/Playfair/.test(fams) || !/Jost/.test(fams)) throw new Error('As fontes não carregaram; as imagens sairiam com fonte substituta.');
    // Texto não pode encostar no rodapé nem sair da lâmina.
    const bad = await page.$$eval('.slide', (els) => els.map((el, k) => {
      const r = el.getBoundingClientRect(), c = el.querySelector('.content').getBoundingClientRect(), m = el.querySelector('.meta').getBoundingClientRect();
      const box = el.querySelector('.content');
      return c.bottom > m.top - 24 || c.right > r.right - 40 || c.left < r.left + 40 || (el.classList.contains('card') && box.scrollHeight > box.clientHeight + 2) ? k + 1 : 0;
    }).filter(Boolean));
    if (bad.length) throw new Error(`${car.slug}: texto grande demais nas lâminas ${bad.join(', ')}`);
    const dir = path.join(__dirname, car.slug);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const els = await page.$$('.slide');
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(dir, `${String(i + 1).padStart(2, '0')}.png`) });
    fs.writeFileSync(path.join(dir, 'legenda.txt'), `${car.title}\n\n${car.caption}\n`);
    console.log(`${car.slug}: ${els.length} lâminas`);
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
