/* Gera os carrosséis em PNG (1080×1350) a partir de conteudo.js.
 * Layout editorial de colagem, na identidade da Lívia: azul-marinho, rosé, rosé-dourado, mármore,
 * Playfair Display nos títulos e Jost nos textos de apoio.
 * Uso: NODE_PATH=<pasta com playwright> node carrosseis/gerar.js
 * Opcional: carrosseis/logo.png (logotipo original) e photo: 'fotos/x.jpg' em lâminas cover/oval.
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
// Moldura oval metálica, com mármore, foto ou azul-marinho dentro.
function ovalFrame(cx, cy, rx, ry, inside, seed, word) {
  const g = id('g'), c = id('c'), glow = id('r');
  let fill;
  if (inside === 'marble') fill = marbleRect(cx - rx, cy - ry, rx * 2, ry * 2, seed, true);
  else if (inside && inside.photo) fill = `<image href="${inside.photo}" x="${cx - rx}" y="${cy - ry}" width="${rx * 2}" height="${ry * 2}" preserveAspectRatio="xMidYMid slice"/>`;
  else fill = `<radialGradient id="${glow}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#2E4A6B"/><stop offset=".6" stop-color="#172B45"/><stop offset="1" stop-color="#0E1A2C"/></radialGradient>
      <rect x="${cx - rx}" y="${cy - ry}" width="${rx * 2}" height="${ry * 2}" fill="url(#${glow})"/>`;
  const script = word ? `<text x="${cx + 10}" y="${cy + ry * 0.55}" text-anchor="middle" transform="rotate(-9 ${cx} ${cy + ry * 0.55})"
      font-family="Playfair Display" font-style="italic" font-size="${Math.round(rx * 0.27)}" fill="#EBDDE3" opacity=".95">${esc(word)}</text>` : '';
  return `<defs>${metal(g)}<clipPath id="${c}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath></defs>
    <ellipse cx="${cx + 14}" cy="${cy + 26}" rx="${rx + 22}" ry="${ry + 22}" fill="#0E1A2C" opacity=".22" filter="url(#soft)"/>
    <g clip-path="url(#${c})">${fill}${script}</g>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx + 13}" ry="${ry + 13}" fill="none" stroke="url(#${g})" stroke-width="26"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx + 31}" ry="${ry + 31}" fill="none" stroke="url(#${g})" stroke-width="3" opacity=".9"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx + 2}" ry="${ry + 2}" fill="none" stroke="#5E4434" stroke-width="2" opacity=".5"/>`;
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
  const art = svg(`<radialGradient id="cg${seed}" cx=".2" cy=".32" r=".45"><stop offset="0" stop-color="#C8A586" stop-opacity=".42"/><stop offset="1" stop-color="#C8A586" stop-opacity="0"/></radialGradient>
    <rect width="${W}" height="${H}" fill="url(#cg${seed})"/>${bands()}
    ${ovalFrame(70, 640, 290, 420, photo ? { photo } : 'marble', seed)}
    <line x1="420" y1="418" x2="880" y2="418" stroke="#EBDDE3" stroke-opacity=".75" stroke-width="2"/>
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
  const art = svg(`${marbleRect(972, 70, 108, 1210, seed, true)}${ovalFrame(1130, 690, 150, 230, 'navy', seed)}`);
  return `<section class="slide light caps"><div class="dots dots-tl"></div><div class="dots dots-br"></div>${art}
    <div class="content"><span class="num">${esc(s.num)}</span><h2 class="giant"><span>${rich(s.title)}</span></h2>
    <p class="lead">${rich(s.lead)}</p><p>${rich(s.body)}</p></div>${meta(false)}</section>`;
}
function oval(s, seed, photo) {
  const art = svg(`${marbleRect(0, 70, 240, 1210, seed, true)}${ovalFrame(300, 680, 255, 370, photo ? { photo } : 'navy', seed, photo ? null : s.word)}
    ${sparkle(600, 300, 0.75)}`);
  return `<section class="slide light oval"><div class="dots dots-br"></div>${art}
    <div class="content"><span class="num">${esc(s.num)}</span><h2>${rich(s.title)}</h2>${s.body.map((p) => `<p>${rich(p)}</p>`).join('')}</div>${meta(false)}</section>`;
}
function end(s, seed) {
  const art = svg(`<radialGradient id="eg${seed}" cx=".85" cy=".45" r=".5"><stop offset="0" stop-color="#C8A586" stop-opacity=".35"/><stop offset="1" stop-color="#C8A586" stop-opacity="0"/></radialGradient>
    <rect width="${W}" height="${H}" fill="url(#eg${seed})"/>${bands()}${ovalFrame(1040, 600, 220, 330, 'marble', seed)}
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
  font-size:15px; line-height:1.3; letter-spacing:.08em; text-transform:uppercase; color:var(--ink); }
.meta span:nth-child(2) { text-align:center; padding-bottom:18px; } .meta span:nth-child(3) { text-align:center; } .meta span:nth-child(4) { text-align:right; }
.meta img { max-height:64px; max-width:150px; display:inline-block; }
.meta.on-dark { color:#E9EEF4; }
.card .meta { color:var(--ink); } .card:not(.card-dark) .meta { color:#2A1E25; }
.card-dark .meta { color:#E9EEF4; }
.caps .meta { right:150px; } .oval .meta { left:280px; }

/* capa */
.kicker { position:absolute; font-size:32px; line-height:1.32; letter-spacing:.03em; text-transform:uppercase; color:#F3F5F8; font-weight:400; }
.cover .k1 { left:420px; top:300px; }
.cover .k2 { left:420px; top:462px; color:#CFD8E3; }
.cover h1 { left:420px; right:70px; top:640px; font-family:var(--serif); font-weight:400; font-size:118px; line-height:.98; letter-spacing:-.035em; color:#fff; }

/* card ondulado */
.card .content { left:236px; width:608px; top:236px; height:820px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; color:#F6EEF1; }
.card .spk { width:150px; height:150px; margin-bottom:26px; }
.card-dark .content { color:var(--ink); }
.card .num { display:block; font-family:var(--serif); font-size:58px; line-height:1; color:#E2C6A9; margin-bottom:10px; }
.card-dark .num { color:var(--gold-deep); }
.card h2 { font-family:var(--serif); font-weight:600; font-size:60px; line-height:1.04; letter-spacing:-.015em; margin-bottom:40px; }
.card p { font-size:31px; line-height:1.45; font-weight:300; }
.card p + p { margin-top:30px; }

/* título gigante */
.dots { position:absolute; width:620px; height:420px; background-image:radial-gradient(circle, #D8C0AA 38%, transparent 42%); background-size:15px 15px; }
.dots-tl { left:-40px; top:-30px; -webkit-mask-image:radial-gradient(ellipse at 30% 30%, #000 0%, transparent 68%); }
.dots-br { right:-40px; bottom:-40px; width:560px; height:360px; -webkit-mask-image:radial-gradient(ellipse at 70% 80%, #000 0%, transparent 68%); }
.caps .content { left:90px; width:830px; top:210px; text-align:center; }
.caps .num { display:block; font-weight:600; font-size:40px; color:var(--gold-deep); margin-bottom:26px; }
.giant { width:1400px; margin-left:-285px; transform:scaleX(.593); transform-origin:center; font-family:var(--serif); font-weight:400; font-size:172px;
  line-height:.86; letter-spacing:-.01em; text-transform:uppercase; color:var(--gold-deep); }
.giant em { color:var(--navy); font-style:normal; }
.caps .lead { font-weight:600; font-size:38px; line-height:1.3; margin:52px auto 0; max-width:640px; color:var(--ink); }
.caps p { font-size:33px; line-height:1.45; font-weight:300; margin:34px auto 0; max-width:640px; }

/* moldura oval */
.oval .content { left:620px; right:72px; top:350px; text-align:right; }
.oval .num { display:block; font-family:var(--serif); font-weight:600; font-size:64px; line-height:1; color:#7A4E5E; }
.oval h2 { font-family:var(--serif); font-weight:600; font-size:62px; line-height:1.0; letter-spacing:-.02em; color:var(--navy); margin:6px 0 40px; }
.oval p { font-size:32px; line-height:1.42; font-weight:300; }
.oval p + p { margin-top:22px; }

/* fechamento */
.end .kicker { left:110px; top:360px; font-size:26px; letter-spacing:.2em; color:#E2C6A9; padding-left:210px; }
.end .content { left:110px; width:640px; top:470px; }
.end h1 { font-family:var(--serif); font-weight:400; font-size:96px; line-height:1.0; letter-spacing:-.03em; color:#fff; }
.end .sub { margin-top:56px; font-size:32px; line-height:1.45; font-weight:300; color:#DCE3EC; max-width:600px; }
`;

function slideHTML(s, i, c) {
  const seed = c * 20 + i + 3;
  const photo = s.photo ? dataUrl(path.join(__dirname, s.photo)) : null;
  switch (s.type) {
    case 'cover': return cover(s, seed, photo);
    case 'card': return card(s, seed);
    case 'caps': return caps(s, seed);
    case 'oval': return oval(s, seed, photo);
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
      return c.bottom > m.top - 24 || c.right > r.right - 40 || c.left < r.left + 40 ? k + 1 : 0;
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
