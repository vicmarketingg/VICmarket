/* Gera os carrosséis em PNG (1080×1350) a partir de conteudo.js.
 * Identidade da Lívia: azul-marinho, rosé, rosé-dourado, mármore, Playfair Display nos títulos e Jost nos textos.
 * Cada carrossel tem um formato próprio (mito × verdade, comparativo, trilha), montado com os tipos de lâmina abaixo.
 * Uso: NODE_PATH=<pasta com playwright> node carrosseis/gerar.js
 * Opcional: carrosseis/logo.png (logotipo original) e photo: 'fotos/x.jpg' (cover, foto, passo).
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
// Gradiente metálico rosé-dourado.
function metal(gid) {
  return `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#F3E1CF"/><stop offset=".28" stop-color="#C8A586"/><stop offset=".5" stop-color="#8F6B50"/>
    <stop offset=".72" stop-color="#E7CDB4"/><stop offset="1" stop-color="#A9825F"/></linearGradient>`;
}
// Mármore rosé dentro de um retângulo (x, y, w, h).
function marbleRect(x, y, w, h, seed) {
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
    <rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#${m})"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#${v})" opacity=".75"/>`;
}
// Rosé-gold metálico na horizontal, com reflexos ao longo da largura da lâmina (trilha e marcadores).
function metalH(gid) {
  return `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0">
    <stop offset="0" stop-color="#A9825F"/><stop offset=".18" stop-color="#F3E1CF"/><stop offset=".36" stop-color="#B08463"/>
    <stop offset=".55" stop-color="#EBD3BC"/><stop offset=".74" stop-color="#9E7657"/><stop offset=".9" stop-color="#F0DCC7"/><stop offset="1" stop-color="#B08463"/></linearGradient>`;
}
// Brilho de quatro pontas.
function sparkle(x, y, s) {
  const g = id('g');
  const star = (dx, dy, k) => `<path transform="translate(${x + dx} ${y + dy}) scale(${s * k})" d="M0 -40 C3 -9 9 -3 40 0 C9 3 3 9 0 40 C-3 9 -9 3 -40 0 C-9 -3 -3 -9 0 -40Z" fill="url(#${g})"/>`;
  return `<defs>${metal(g)}</defs>${star(0, 0, 1)}${star(46 * s, -38 * s, 0.38)}${star(-40 * s, 34 * s, 0.26)}`;
}
// Faixas curvas translúcidas.
const bands = (o = 0.13) => `<path d="M700 -60 Q 470 420 -80 700" stroke="#FFFFFF" stroke-opacity="${o}" stroke-width="64" fill="none"/>
  <path d="M1160 820 Q 780 1060 520 1420" stroke="#FFFFFF" stroke-opacity="${o}" stroke-width="64" fill="none"/>`;
const glow = (gid, cx, cy, o = 0.38) => `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r=".6"><stop offset="0" stop-color="#C8A586" stop-opacity="${o}"/><stop offset="1" stop-color="#C8A586" stop-opacity="0"/></radialGradient>
  <rect width="${W}" height="${H}" fill="url(#${gid})"/>`;
// Número grande vazado, como marca-d'água.
const ghostNum = (n, stroke) => `<text x="1060" y="1190" text-anchor="end" font-family="Playfair Display" font-style="italic" font-size="560"
  fill="none" stroke="${stroke}" stroke-width="3">${esc(n)}</text>`;
const svg = (inner) => `<svg class="art" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter></defs>${inner}</svg>`;

// Trilha ondulada do carrossel de passos: o período é a largura da lâmina, então a linha continua de uma lâmina para a outra.
const PATH_Y = 520, PATH_A = 46;
const pathY = (x) => PATH_Y + PATH_A * Math.sin((2 * Math.PI * x) / W);
const pathD = (x0, x1) => { let d = ''; for (let x = x0; x <= x1; x += 12) d += `${d ? 'L' : 'M'}${x} ${pathY(x).toFixed(1)} `; return d; };
const STEP_X = [190, 365, 540, 715, 890];

const meta = (dark) => `<div class="meta ${dark ? 'on-dark' : ''}">
  <span>Dra. Lívia<br>Serpa</span><span>Tecnologias<br>aplicadas</span><span>Sistema<br>RCE®</span><span>${logo ? `<img src="${logo}" alt="Lívia Serpa">` : 'Educação<br>profissional'}</span></div>`;
const tag = (icon, text) => `<p class="tag"><i>${icon}</i>${rich(text)}</p>`;

/* ---------- Lâminas gerais ---------- */
// Foto inteira na lâmina, com o texto na base sobre degradê azul-marinho.
function photoSlide(s, seed, photo) {
  const art = svg(`<image href="${photo}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`);
  const kicker = s.kicker ? `<p class="pkicker"><i></i>${rich(s.kicker)}</p>` : '';
  return `<section class="slide dark photo">${art}
    <div class="content">${kicker}<h1>${rich(s.title)}</h1>${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ''}</div>${meta(true)}</section>`;
}
// Fechamento escuro.
function end(s, seed) {
  const art = svg(`${glow(`eg${seed}`, '.85', '.45', 0.35)}${bands()}
    <line x1="110" y1="402" x2="300" y2="402" stroke="#EBDDE3" stroke-opacity=".75" stroke-width="2"/>`);
  return `<section class="slide dark end">${art}<p class="kicker">${rich(s.kicker)}</p>
    <div class="content"><h1>${rich(s.title)}</h1><p class="sub">${rich(s.sub)}</p></div>${meta(true)}</section>`;
}

/* ---------- Formato 1: mito × verdade ---------- */
function mito(s) {
  const art = svg(ghostNum(s.num, '#E6D6C8'));
  return `<section class="slide light mito">${art}
    <div class="content">${tag('✕', `Mito ${s.num}`)}<p class="quote">“${rich(s.quote)}”</p><p class="swipe">Arraste para ver a verdade →</p></div>${meta(false)}</section>`;
}
function verdade(s, seed) {
  const art = svg(`${glow(`vg${seed}`, '.1', '.1')}${ghostNum(s.num, 'rgba(255,255,255,.07)')}`);
  return `<section class="slide dark verdade">${art}
    <div class="content">${tag('✓', `Na prática · Mito ${s.num}`)}<h2>${rich(s.title)}</h2><p class="sub">${rich(s.sub)}</p></div>${meta(true)}</section>`;
}
function resumo(s) {
  return `<section class="slide light resumo">
    <div class="content"><h2>${rich(s.title)}</h2><ol>${s.items.map((t, k) => `<li><em>${String(k + 1).padStart(2, '0')}</em><span>${rich(t)}</span></li>`).join('')}</ol>
    <p class="cta">${rich(s.cta)}</p></div>${meta(false)}</section>`;
}

/* ---------- Formato 2: comparativo ---------- */
function versus(s) {
  const art = svg(`<rect x="540" width="540" height="${H}" fill="#13233A"/>${bands(0.06)}<rect width="540" height="${H}" fill="#FBF8F6"/>
    <line x1="540" y1="300" x2="540" y2="1140" stroke="#C8A586" stroke-width="3"/>
    <circle cx="540" cy="420" r="40" fill="#C8A586"/><path d="M524 404 L556 436 M556 404 L524 436" stroke="#13233A" stroke-width="4" stroke-linecap="round"/>`);
  return `<section class="slide versus">${art}
    <div class="content"><p class="vtopic">${rich(s.topic)}</p>
      <div class="cols"><div><p class="vhead">Protocolo</p><p class="vtext">${rich(s.left)}</p></div>
      <div class="right"><p class="vhead">Raciocínio clínico</p><p class="vtext">${rich(s.right)}</p></div></div></div>${meta(false)}</section>`;
}
function checklist(s, seed) {
  const check = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#9E7657" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const art = svg(`${marbleRect(0, 0, W, H, seed)}
    <rect x="96" y="150" width="888" height="1010" rx="6" fill="#0E1A2C" opacity=".18" filter="url(#soft)"/>
    <rect x="90" y="140" width="900" height="1010" rx="6" fill="#FFFDFB"/>`);
  return `<section class="slide light checklist">${art}
    <div class="content">${tag('✓', s.kicker)}<h2>${rich(s.title)}</h2>
    <ul>${s.items.map((t) => `<li><span class="box">${check}</span><span>${rich(t)}</span></li>`).join('')}</ul></div>${meta(false)}</section>`;
}
function destaque(s, seed) {
  return `<section class="slide light destaque">${svg(marbleRect(0, 0, W, H, seed))}
    <div class="content"><h2>${rich(s.title)}</h2><p>${rich(s.sub)}</p></div>${meta(false)}</section>`;
}

/* ---------- Formato 3: trilha de passos ---------- */
function trilhaCapa(s, seed, photo) {
  const art = photo
    ? svg(`<image href="${photo}" x="0" y="${-s.photoY || 0}" width="${W}" height="${s.photoH || H}" preserveAspectRatio="xMidYMin slice"/>
        <linearGradient id="tg${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1A2C" stop-opacity=".05"/>
        <stop offset=".26" stop-color="#0E1A2C" stop-opacity=".12"/><stop offset=".4" stop-color="#0E1A2C" stop-opacity=".95"/><stop offset=".6" stop-color="#0E1A2C" stop-opacity=".985"/><stop offset="1" stop-color="#0E1A2C" stop-opacity="1"/></linearGradient>
        <rect width="${W}" height="${H}" fill="url(#tg${seed})"/>`)
    : svg(`${glow(`tg${seed}`, '.9', '.1')}${bands(0.08)}`);
  return `<section class="slide dark trilha-capa ${photo ? 'has-photo' : ''}">${art}
    <div class="content"><p class="pkicker"><i></i>${rich(s.kicker)}</p><h1>${rich(s.title)}</h1>
    <ol>${s.steps.map((t, k) => `<li><i></i><em>${String(k + 1).padStart(2, '0')}</em><span>${rich(t)}</span></li>`).join('')}</ol></div>${meta(true)}</section>`;
}
function passo(s, seed, photo, total) {
  const n = Number(s.num);
  const onPhoto = !!photo;
  const mg = id('mh');
  const line = `url(#${mg})`;
  const dots = STEP_X.slice(0, total).map((x, k) => (k + 1 === n ? ''
    : `<circle cx="${x}" cy="${pathY(x).toFixed(1)}" r="11" fill="${k + 1 < n ? line : (onPhoto ? '#0E1A2C' : '#FBF8F6')}" stroke="${line}" stroke-width="3"/>`)).join('');
  const x = STEP_X[n - 1], y = pathY(x);
  const bg = onPhoto
    ? `<image href="${photo}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/><rect width="${W}" height="${H}" fill="#0E1A2C" opacity=".45"/>
       <linearGradient id="sg${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset=".35" stop-color="#0E1A2C" stop-opacity="0"/><stop offset=".62" stop-color="#0E1A2C" stop-opacity=".9"/><stop offset="1" stop-color="#0E1A2C" stop-opacity=".97"/></linearGradient>
       <rect width="${W}" height="${H}" fill="url(#sg${seed})"/>`
    : '';
  const art = svg(`${bg}<defs>${metalH(mg)}</defs><path d="${pathD(0, W)}" fill="none" stroke="${line}" stroke-width="5" stroke-linecap="round"/>${dots}
    <circle cx="${x}" cy="${y}" r="66" fill="none" stroke="${line}" stroke-width="2" opacity=".8"/>
    <circle cx="${x}" cy="${y}" r="56" fill="#172B45" stroke="${line}" stroke-width="6"/>
    <text x="${x}" y="${y + 19}" text-anchor="middle" font-family="Playfair Display" font-style="italic" font-size="58" fill="#E7CDB4">${n}</text>
    ${sparkle(x + 82, y - 76, 0.5)}`);
  return `<section class="slide ${onPhoto ? 'dark' : 'light'} passo">${art}
    <p class="steptag"><i></i>Passo ${n} de ${total}</p>
    <div class="content"><h2>${rich(s.title)}</h2><p>${rich(s.body)}</p></div>${meta(onPhoto)}</section>`;
}
function chegada(s, seed) {
  const fx = 540, fy = pathY(fx);
  const mg = id('mh');
  const art = svg(`${glow(`cg${seed}`, '.5', '.38', 0.3)}<defs>${metalH(mg)}</defs><path d="${pathD(0, fx)}" fill="none" stroke="url(#${mg})" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${fx}" cy="${fy}" r="70" fill="none" stroke="url(#${mg})" stroke-width="4"/>${sparkle(fx, fy, 0.95)}`);
  return `<section class="slide dark chegada">${art}
    <div class="content"><p class="pkicker"><i></i>${rich(s.kicker)}</p><h1>${rich(s.title)}</h1><p class="sub">${rich(s.sub)}</p></div>${meta(true)}</section>`;
}

const CSS = `
:root { --navy:#172B45; --ink:#0D1130; --rose:#B98599; --rose-light:#EBDDE3; --gold:#C8A586; --gold-deep:#9E7657; --paper:#FBF8F6;
  --serif:'Playfair Display', Georgia, serif; --sans:'Jost', 'Avenir Next', sans-serif; }
* { box-sizing:border-box; margin:0; padding:0; }
.slide { width:${W}px; height:${H}px; position:relative; overflow:hidden; font-family:var(--sans); color:var(--ink); background:var(--paper); }
.slide::after { content:''; position:absolute; inset:0; pointer-events:none; opacity:.09; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); }
.dark { background:linear-gradient(160deg, #1B3150 0%, #13233A 55%, #0E1A2C 100%); color:#fff; }
.dark::after { mix-blend-mode:soft-light; opacity:.35; }
.art { position:absolute; inset:0; width:100%; height:100%; }
.content { position:absolute; z-index:1; }
b { font-weight:600; } u { text-decoration-thickness:2px; text-underline-offset:7px; }
em { font-style:italic; color:var(--gold-deep); }
.dark em { color:#E2C6A9; }
ol, ul { list-style:none; }

/* rodapé em grade */
.meta { position:absolute; z-index:2; left:110px; right:110px; bottom:70px; display:grid; grid-template-columns:repeat(4, 1fr); align-items:end;
  font-size:19px; line-height:1.3; letter-spacing:.07em; text-transform:uppercase; color:var(--ink); }
.meta span:nth-child(2) { text-align:center; padding-bottom:18px; } .meta span:nth-child(3) { text-align:center; } .meta span:nth-child(4) { text-align:right; }
.meta img { max-height:64px; max-width:150px; display:inline-block; }
.meta.on-dark { color:#E9EEF4; }

/* rótulos */
.tag { display:inline-flex; align-items:center; gap:20px; font-size:30px; letter-spacing:.2em; text-transform:uppercase; color:var(--gold-deep); font-weight:500; }
.tag i { width:58px; height:58px; border-radius:50%; border:2px solid currentColor; display:grid; place-items:center; font-style:normal; font-size:28px; letter-spacing:0; }
.dark .tag { color:#E2C6A9; }
.pkicker { display:flex; align-items:center; gap:22px; font-size:30px; letter-spacing:.18em; text-transform:uppercase; color:#E2C6A9; margin-bottom:26px; }
.pkicker i { width:90px; height:2px; background:#E2C6A9; display:block; flex:none; }
.sub { font-size:42px; line-height:1.4; font-weight:400; color:#E6EBF2; }

/* foto inteira */
.photo::after { opacity:.18; }
.photo .content { left:110px; right:110px; bottom:230px; }
.photo .content::before { content:''; position:absolute; z-index:-1; left:-110px; right:-110px; top:-260px; bottom:-240px;
  background:linear-gradient(180deg, rgba(14,26,44,0) 0%, rgba(14,26,44,.78) 30%, rgba(14,26,44,.92) 70%, rgba(14,26,44,.96) 100%); }
.photo h1 { font-family:var(--serif); font-weight:400; font-size:112px; line-height:1.0; letter-spacing:-.03em; color:#fff; text-shadow:0 2px 24px rgba(8,14,26,.35); }
.photo .sub { margin-top:30px; max-width:860px; }

/* fechamento */
.end .kicker { position:absolute; left:110px; top:356px; font-size:32px; letter-spacing:.2em; text-transform:uppercase; color:#E2C6A9; padding-left:210px; }
.end .content { left:110px; right:110px; top:470px; }
.end h1 { font-family:var(--serif); font-weight:400; font-size:116px; line-height:1.0; letter-spacing:-.03em; color:#fff; }
.end .sub { margin-top:56px; max-width:820px; }

/* mito × verdade */
.mito .content { left:110px; right:110px; top:300px; }
.mito .quote { margin-top:64px; font-family:var(--serif); font-style:italic; font-size:100px; line-height:1.1; letter-spacing:-.02em; color:var(--navy);
  text-decoration:line-through; text-decoration-color:rgba(185,133,153,.9); text-decoration-thickness:5px; }
.mito .swipe { margin-top:90px; font-size:28px; letter-spacing:.22em; text-transform:uppercase; color:var(--gold-deep); font-weight:500; }
.verdade .content { left:110px; right:110px; top:300px; }
.verdade h2 { margin-top:60px; font-family:var(--serif); font-weight:400; font-size:96px; line-height:1.04; letter-spacing:-.025em; }
.verdade .sub { margin-top:50px; max-width:860px; }
.resumo .content { left:110px; right:110px; top:190px; }
.resumo h2 { font-family:var(--serif); font-weight:400; font-size:96px; line-height:1.02; letter-spacing:-.025em; color:var(--navy); }
.resumo ol { margin-top:60px; }
.resumo li { display:grid; grid-template-columns:90px 1fr; align-items:baseline; padding:24px 0; border-top:1.5px solid rgba(23,43,69,.14); }
.resumo li:last-child { border-bottom:1.5px solid rgba(23,43,69,.14); }
.resumo li em { font-family:var(--serif); font-size:48px; }
.resumo li span { font-size:40px; line-height:1.3; color:var(--navy); text-decoration:line-through; text-decoration-color:rgba(185,133,153,.9); text-decoration-thickness:3px; }
.resumo .cta { display:inline-block; margin-top:56px; background:var(--navy); color:#fff; border-radius:999px; padding:24px 44px; font-size:28px; letter-spacing:.16em; text-transform:uppercase; font-weight:500; }

/* comparativo */
.versus .content { left:70px; right:70px; top:150px; }
.vtopic { width:max-content; margin:0 auto; background:var(--gold); color:var(--ink); border-radius:999px; padding:16px 40px; font-size:30px; letter-spacing:.18em; text-transform:uppercase; font-weight:600; }
.cols { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:140px; margin-top:330px; }
.vhead { height:84px; font-size:30px; line-height:1.4; letter-spacing:.18em; text-transform:uppercase; font-weight:600; color:var(--gold-deep); }
.vtext { margin-top:44px; font-family:var(--serif); font-size:64px; line-height:1.12; letter-spacing:-.02em; color:var(--navy); }
.cols .right .vhead { color:#E2C6A9; } .cols .right .vtext { color:#fff; } .cols .right em { color:#E2C6A9; }
.versus .meta span:nth-child(3), .versus .meta span:nth-child(4) { color:#E9EEF4; }
.checklist .content { left:160px; right:160px; top:220px; }
.checklist h2 { margin-top:44px; font-family:var(--serif); font-weight:400; font-size:80px; line-height:1.05; letter-spacing:-.02em; color:var(--navy); }
.checklist ul { margin-top:56px; display:flex; flex-direction:column; gap:38px; }
.checklist li { display:flex; gap:30px; align-items:flex-start; font-size:42px; line-height:1.3; color:var(--ink); }
.checklist .box { flex:none; width:56px; height:56px; border:3px solid var(--gold-deep); border-radius:8px; display:grid; place-items:center; margin-top:2px; }
.checklist .box svg { width:40px; height:40px; }
.destaque .content { left:110px; right:110px; top:250px; bottom:330px; display:flex; flex-direction:column; justify-content:center; text-align:center; }
.destaque h2 { font-family:var(--serif); font-weight:400; font-size:132px; line-height:1.0; letter-spacing:-.03em; color:var(--navy); }
.destaque p { margin:50px auto 0; max-width:800px; font-size:44px; line-height:1.38; color:var(--ink); }

/* trilha */
.trilha-capa .content { left:110px; right:110px; top:180px; }
.trilha-capa h1 { font-family:var(--serif); font-weight:400; font-size:120px; line-height:1.0; letter-spacing:-.03em; }
.trilha-capa ol { position:relative; margin-top:70px; }
.trilha-capa ol::before { content:''; position:absolute; left:15px; top:42px; bottom:42px; width:3px; background:linear-gradient(180deg, #F3E1CF, #B08463 30%, #EBD3BC 55%, #9E7657 80%, #E7CDB4); }
.trilha-capa li { position:relative; display:grid; grid-template-columns:62px 80px 1fr; align-items:center; height:86px; font-size:40px; color:#E6EBF2; }
.trilha-capa li i { width:34px; height:34px; border-radius:50%; background:radial-gradient(circle, #13233A 46%, transparent 49%), linear-gradient(135deg, #F3E1CF 0%, #C8A586 28%, #8F6B50 50%, #E7CDB4 72%, #A9825F 100%); display:block; }
.trilha-capa.has-photo .content { top:500px; }
.trilha-capa.has-photo .pkicker { margin-bottom:18px; }
.trilha-capa.has-photo h1 { font-size:96px; }
.trilha-capa.has-photo ol { margin-top:40px; }
.trilha-capa.has-photo li { height:72px; font-size:38px; }
.trilha-capa li em { font-family:var(--serif); font-size:40px; }
.passo .steptag { position:absolute; left:110px; top:200px; font-size:30px; letter-spacing:.22em; text-transform:uppercase; font-weight:600; color:#B08463; display:flex; align-items:center; gap:22px; }
.passo .steptag i { width:90px; height:3px; display:block; background:linear-gradient(90deg, #F3E1CF, #B08463 45%, #E7CDB4); }
.passo.light em { color:#B08463; }
.passo.dark .steptag { color:#E2C6A9; }
.passo .content { left:110px; right:110px; top:700px; }
.passo h2 { font-family:var(--serif); font-weight:400; font-size:92px; line-height:1.03; letter-spacing:-.025em; color:var(--navy); }
.passo.dark h2 { color:#fff; }
.passo p { margin-top:36px; font-size:42px; line-height:1.4; max-width:860px; }
.passo.dark p { color:#E6EBF2; }
.chegada .content { left:110px; right:110px; top:660px; }
.chegada h1 { font-family:var(--serif); font-weight:400; font-size:90px; line-height:1.02; letter-spacing:-.03em; }
.chegada .sub { margin-top:40px; }
`;

function slideHTML(s, i, c, total) {
  const seed = c * 20 + i + 3;
  const photo = s.photo ? dataUrl(path.join(__dirname, s.photo)) : null;
  const needPhoto = () => { if (!photo) throw new Error(`Lâmina ${s.type} precisa de photo`); return photo; };
  switch (s.type) {
    case 'cover': case 'foto': return photoSlide(s, seed, needPhoto());
    case 'end': return end(s, seed);
    case 'mito': return mito(s);
    case 'verdade': return verdade(s, seed);
    case 'resumo': return resumo(s);
    case 'versus': return versus(s);
    case 'checklist': return checklist(s, seed);
    case 'destaque': return destaque(s, seed);
    case 'trilha-capa': return trilhaCapa(s, seed, photo);
    case 'passo': return passo(s, seed, photo, total);
    case 'chegada': return chegada(s, seed);
    default: throw new Error(`Tipo de lâmina desconhecido: ${s.type}`);
  }
}

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const [c, car] of carrosseis.entries()) {
    const total = car.slides.filter((s) => s.type === 'passo').length;
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>${CSS}</style></head><body>${car.slides.map((s, i) => slideHTML(s, i, c, total)).join('')}</body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const fams = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family).join(','));
    if (!/Playfair/.test(fams) || !/Jost/.test(fams)) throw new Error('As fontes não carregaram; as imagens sairiam com fonte substituta.');
    // Texto não pode encostar no rodapé nem sair da lâmina.
    const bad = await page.$$eval('.slide', (els) => els.map((el, k) => {
      const r = el.getBoundingClientRect(), c = el.querySelector('.content').getBoundingClientRect(), m = el.querySelector('.meta').getBoundingClientRect();
      const box = el.querySelector('.content');
      return c.bottom > m.top - 24 || c.right > r.right - 40 || c.left < r.left + 40 || box.scrollHeight > box.clientHeight + 4 && el.classList.contains('destaque') ? k + 1 : 0;
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
