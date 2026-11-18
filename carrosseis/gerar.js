/* Gera os carrosséis em PNG (1080×1350) a partir de conteudo.js, na identidade visual da Lívia:
 * mármore rosé, Playfair Display com negrito/itálico/sublinhado, texto azul-marinho, assinatura ao pé.
 * Uso: NODE_PATH=<pasta com playwright> node carrosseis/gerar.js
 * Opcional: carrosseis/logo.png (logotipo original) e fotos em carrosseis/fotos/.
 * Saída: carrosseis/<slug>/01.png, 02.png… e legenda.txt */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const carrosseis = require('./conteudo');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/(^|[^\w])_(.+?)_(?=[^\w]|$)/g, '$1<u>$2</u>')
  .replace(/\*(.+?)\*/g, '<i>$1</i>');

const dataUrl = (file) => `data:image/${path.extname(file).slice(1).replace('jpg', 'jpeg')};base64,${fs.readFileSync(file).toString('base64')}`;
const logoFile = path.join(__dirname, 'logo.png');
const logo = fs.existsSync(logoFile) ? dataUrl(logoFile) : null;

// Mármore rosé: manchas suaves + veios finos, com semente diferente por lâmina.
function marble(seed) {
  return `<svg class="bg" viewBox="0 0 1080 1350" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter id="m${seed}" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.0035" numOctaves="4" seed="${seed}"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.93  0 0 0 0 0.71  0 0 0 0 0.71  1.7 0 0 0 -0.6"/>
      </filter>
      <filter id="v${seed}" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="turbulence" baseFrequency="0.0016 0.0042" numOctaves="5" seed="${seed + 7}"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.80  0 0 0 0 0.62  0 0 0 0 0.60  -2.4 0 0 0 0.62"/>
        <feComponentTransfer><feFuncA type="table" tableValues="0 0.55 0.18 0 0 0 0 0 0 0"/></feComponentTransfer>
      </filter>
    </defs>
    <rect width="1080" height="1350" fill="#FCEBE8"/>
    <rect width="1080" height="1350" filter="url(#m${seed})" opacity=".85"/>
    <rect width="1080" height="1350" filter="url(#v${seed})" opacity=".45"/>
    <rect width="1080" height="1350" fill="url(#g${seed})"/>
    <radialGradient id="g${seed}" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#FFF7F5" stop-opacity=".55"/><stop offset="1" stop-color="#FFF7F5" stop-opacity="0"/></radialGradient>
  </svg>`;
}

const CSS = `
:root { --ink:#0D1130; --rose-gold:#C8A586; --box:#E4DACE; --serif:'Playfair Display', Georgia, serif; }
* { box-sizing:border-box; margin:0; }
.slide { width:1080px; height:1350px; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:center; align-items:center;
  padding:150px 110px 210px; text-align:center; font-family:var(--serif); color:var(--ink); background:#FCEBE8; }
.bg, .photo, .shade { position:absolute; inset:0; width:100%; height:100%; }
.photo { object-fit:cover; }
.shade { background:linear-gradient(180deg, rgba(8,10,28,.25) 0%, rgba(8,10,28,.15) 45%, rgba(8,10,28,.6) 100%); }
.content { position:relative; width:100%; }
p { font-size:62px; line-height:1.28; letter-spacing:-.012em; font-weight:400; }
p + p { margin-top:64px; font-size:52px; line-height:1.32; }
b { font-weight:700; } i { font-style:italic; }
u { text-decoration:underline; text-decoration-thickness:2.5px; text-underline-offset:9px; }
.sign { position:absolute; bottom:86px; left:0; right:0; display:flex; flex-direction:column; align-items:center; gap:14px; }
.sign img { max-width:230px; max-height:120px; }
.sign span { font-size:22px; letter-spacing:.42em; padding-left:.42em; color:var(--ink); }
.sign i { width:56px; height:1.5px; background:var(--rose-gold); display:block; }

.cover p { font-size:92px; line-height:1.16; letter-spacing:-.018em; }
.step .num { display:block; font-style:italic; font-weight:400; font-size:230px; line-height:.9; color:var(--rose-gold); margin-bottom:40px; }
.list p:first-child { margin-bottom:56px; }
.items { list-style:none; padding:0; display:flex; flex-direction:column; gap:34px; }
.items li { font-size:48px; line-height:1.3; letter-spacing:-.01em; }
.items em { font-style:italic; font-weight:700; color:var(--rose-gold); margin-right:14px; }
.end .box { background:rgba(228,218,206,.88); padding:70px 64px; box-shadow:0 30px 60px -40px rgba(13,17,48,.35); }
.end .box p { font-size:58px; }
.end .note { margin-top:56px; font-size:40px; font-style:italic; font-weight:700; color:var(--ink); }

.has-photo { color:#fff; }
.has-photo .sign span, .has-photo .end .note { color:#fff; }
.has-photo .end .box p { color:var(--ink); }
`;

function slideHTML(s, i, c) {
  const photo = s.photo ? path.join(__dirname, s.photo) : null;
  if (photo && !fs.existsSync(photo)) throw new Error(`Foto não encontrada: ${s.photo}`);
  const bg = photo ? `<img class="photo" src="${dataUrl(photo)}" alt=""><div class="shade"></div>` : marble(c * 20 + i + 3);
  const sign = `<div class="sign">${logo ? `<img src="${logo}" alt="Lívia Serpa">` : '<i></i><span>LÍVIA SERPA</span>'}</div>`;
  const paras = (s.paras || []).map((p) => `<p>${rich(p)}</p>`).join('');
  let inner;
  switch (s.type) {
    case 'cover': case 'text': inner = paras; break;
    case 'step': inner = `<span class="num">${esc(s.num)}</span>${paras}`; break;
    case 'list': inner = `${paras}<ol class="items">${s.items.map((t, k) => `<li><em>${k + 1}.</em>${rich(t)}</li>`).join('')}</ol>`; break;
    case 'end': inner = `<div class="box">${paras}</div>${s.note ? `<p class="note">${rich(s.note)}</p>` : ''}`; break;
    default: throw new Error(`Tipo de lâmina desconhecido: ${s.type}`);
  }
  return `<section class="slide ${s.type}${photo ? ' has-photo' : ''}">${bg}<div class="content">${inner}</div>${sign}</section>`;
}

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const [c, car] of carrosseis.entries()) {
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
      <style>${CSS}</style></head><body>${car.slides.map((s, i) => slideHTML(s, i, c)).join('')}</body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const ok = await page.evaluate(() => [...document.fonts].some((f) => f.status === 'loaded' && /Playfair/.test(f.family)));
    if (!ok) throw new Error('A fonte Playfair Display não carregou; as imagens sairiam com fonte substituta.');
    // Avisa se algum texto passou do espaço da lâmina (encostando na assinatura).
    const overflow = await page.$$eval('.slide', (els) => els.map((el, k) => {
      const c = el.querySelector('.content').getBoundingClientRect(); const s = el.querySelector('.sign').getBoundingClientRect();
      return c.bottom > s.top - 30 || c.top < el.getBoundingClientRect().top + 60 ? k + 1 : 0;
    }).filter(Boolean));
    if (overflow.length) throw new Error(`${car.slug}: texto grande demais nas lâminas ${overflow.join(', ')}`);
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
