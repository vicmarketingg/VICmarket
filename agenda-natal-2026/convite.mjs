// Gera o "convite interativo": envelope animado com selo de cera que abre e mostra a agenda
// (4 páginas deslizando). Saída: pasta convite/ com index.html + capa.jpg (pré-visualização do link).
import fs from 'node:fs';
import path from 'node:path';

export async function gerarConvite({ browser, renderizado, outDir, D }) {
  fs.mkdirSync(outDir, { recursive: true });
  const style = renderizado.slice(renderizado.indexOf('<style>') + 7, renderizado.indexOf('</style>'));
  const body = renderizado.slice(renderizado.indexOf('<body>') + 6, renderizado.lastIndexOf('</body>'));
  const site = (D.site_url || '').replace(/\/+$/, '');
  const ogImg = site ? `${site}/capa.jpg` : 'capa.jpg';
  const titulo = 'Agenda de Natal 2026 — Mayara Dias | Studio Beauty';
  const desc = 'Você recebeu um convite. Toque para abrir a agenda de dezembro.';

  const CONVITE_CSS = `
html, body { margin: 0; height: 100%; background: #2B0A10; overflow: hidden; }
body { -webkit-tap-highlight-color: transparent; }
/* ---------- envelope ---------- */
.env-screen { position: fixed; inset: 0; z-index: 50; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
  background: radial-gradient(ellipse 90% 70% at 50% 40%, #A12A3A 0%, #8B1E2D 45%, #4E0C15 100%); transition: opacity .8s ease .2s; overflow: hidden; }
.env-screen::before { content: ''; position: absolute; inset: 0; background-image: var(--tex); opacity: .5; pointer-events: none; }
.env-screen::after { content: ''; position: absolute; inset: 14px; border: 1px solid rgba(198,163,106,.7); outline: .6px solid rgba(198,163,106,.35); outline-offset: -6px; pointer-events: none; }
.env-screen.gone { opacity: 0; pointer-events: none; }
.env-kicker { position: relative; font-family: 'Jost', sans-serif; font-weight: 500; font-size: 11.5px; letter-spacing: 4px; text-transform: uppercase; color: #C6A36A; }
.env-title { position: relative; font-family: 'Bodoni Moda', serif; font-style: italic; font-size: clamp(26px, 7.4vw, 34px); color: #FFF9F2; text-align: center; line-height: 1.15; }
.env-title small { display: block; font-style: normal; font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: #C6A36A; margin-top: 10px; }
.envelope { position: relative; width: min(82vw, 360px); aspect-ratio: 1.42; perspective: 1400px; margin-top: 40px; cursor: pointer; }
.env-back { position: absolute; inset: 0; background: linear-gradient(160deg, #EFE0D0, #E2CDB8); border-radius: 4px; box-shadow: 0 24px 50px rgba(30,4,8,.55); }
.letter { position: absolute; left: 6%; right: 6%; top: 8%; height: 84%; background: #FFF9F2; border-radius: 3px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  box-shadow: 0 2px 8px rgba(89,55,40,.18); transition: transform 1s cubic-bezier(.2,.8,.2,1); z-index: 1; }
.letter::before { content: ''; position: absolute; inset: 8px; border: .8px solid #C6A36A; }
.letter b { font-family: 'Bodoni Moda', serif; font-weight: 500; font-size: clamp(16px, 4.6vw, 21px); letter-spacing: 1px; text-transform: uppercase; color: #8B1E2D; }
.letter span { font-family: 'Bodoni Moda', serif; font-style: italic; font-size: clamp(13px, 3.6vw, 16px); color: #9C7840; }
.env-front { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
.env-front .l, .env-front .r, .env-front .b { position: absolute; inset: 0; }
.env-front .l { background: linear-gradient(100deg, #EADACA, #E3D0BD); clip-path: polygon(0 0, 52% 54%, 0 100%); }
.env-front .r { background: linear-gradient(260deg, #EADACA, #E3D0BD); clip-path: polygon(100% 0, 48% 54%, 100% 100%); }
.env-front .b { background: linear-gradient(0deg, #E8D6C4, #F1E3D5); clip-path: polygon(0 100%, 50% 46%, 100% 100%); filter: drop-shadow(0 -1px 0 rgba(89,55,40,.12)); }
.flap { position: absolute; left: 0; right: 0; top: 0; height: 58%; z-index: 3; transform-origin: 50% 0; transition: transform .9s cubic-bezier(.5,0,.2,1), z-index 0s .45s; }
.flap::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, #F4E7DA, #E4D1BE); clip-path: polygon(0 0, 100% 0, 50% 100%); }
.flap::after { content: ''; position: absolute; inset: 0; clip-path: polygon(0 0, 100% 0, 50% 100%); background: linear-gradient(180deg, transparent 60%, rgba(89,55,40,.10)); }
.seal { position: absolute; left: 50%; top: 58%; width: 26%; aspect-ratio: 1; transform: translate(-50%, -50%); z-index: 5; transition: transform .5s ease, opacity .5s ease; }
.seal svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 6px rgba(40,5,10,.45)); }
.tap { position: relative; display: flex; align-items: center; gap: 10px; font-family: 'Jost', sans-serif; font-weight: 500; font-size: 12px; letter-spacing: 3.5px; text-transform: uppercase; color: #FFF9F2; opacity: .9; animation: pulse 1.8s ease-in-out infinite; }
.tap::before, .tap::after { content: ''; width: 26px; height: .8px; background: #C6A36A; }
@keyframes pulse { 0%,100% { opacity: .45 } 50% { opacity: 1 } }
.seal { animation: breathe 2.4s ease-in-out infinite; }
@keyframes breathe { 0%,100% { transform: translate(-50%,-50%) scale(1) } 50% { transform: translate(-50%,-50%) scale(1.06) } }
.env-brand { position: relative; font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 4.5px; text-transform: uppercase; color: rgba(255,249,242,.8); margin-top: 6px; }
/* sequência de abertura */
.opening .seal { animation: none; transform: translate(-50%,-50%) scale(1.25); opacity: 0; }
.opening .flap { transform: rotateX(180deg); z-index: 0; transition-delay: .35s, .35s; }
.opening .env-title, .opening .env-kicker { opacity: 0; transition: opacity .5s; }
.opening .letter { transform: translateY(-52%); transition-delay: 1.1s; z-index: 4; }
.opening .tap { animation: none; opacity: 0; transition: opacity .3s; }
/* brilhos caindo */
.glint { position: absolute; top: -10px; width: 6px; height: 6px; pointer-events: none; opacity: .0; animation: fall linear infinite; }
.glint::before { content: '✦'; position: absolute; color: #C6A36A; font-size: 10px; }
@keyframes fall { 0% { transform: translateY(0) rotate(0); opacity: 0 } 10% { opacity: .9 } 100% { transform: translateY(105vh) rotate(180deg); opacity: 0 } }

/* ---------- agenda deslizante ---------- */
.deck { position: fixed; inset: 0; display: flex; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; scroll-behavior: smooth; -webkit-overflow-scrolling: touch;
  background: radial-gradient(ellipse at 50% 30%, #4A0E18, #22070C); opacity: 0; transition: opacity .8s ease; scrollbar-width: none; }
.deck::-webkit-scrollbar { display: none; }
.deck.show { opacity: 1; }
.slide { flex: 0 0 100vw; height: 100%; scroll-snap-align: center; display: flex; align-items: center; justify-content: center; }
.fit { position: relative; width: calc(540px * var(--s)); height: calc(960px * var(--s)); flex: none; }
.fit > .page { position: absolute; left: 0; top: 0; transform: scale(var(--s)); transform-origin: 0 0; box-shadow: 0 18px 50px rgba(0,0,0,.45); }
/* entrada dos elementos de cada página */
.anim .page > :not(.abs):not(.frame):not(.corners):not(.nav):not(.imgfoot) { opacity: 0; transform: translateY(14px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1); }
.anim .page.in > :not(.abs):not(.frame):not(.corners):not(.nav):not(.imgfoot) { opacity: 1; transform: none; }
.hint { position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%); z-index: 20; font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #E9D5A8;
  background: rgba(43,10,16,.7); padding: 7px 14px; border-radius: 20px; white-space: nowrap; opacity: 0; transition: opacity .6s; pointer-events: none; }
.hint.on { opacity: 1; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition-duration: .01s !important; } }
`;

  const SEAL = `<svg viewBox="0 0 100 100"><defs><radialGradient id="wax" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#B8384A"/><stop offset=".55" stop-color="#8B1E2D"/><stop offset="1" stop-color="#5A0E18"/></radialGradient></defs>
    <path d="M50 3 C60 4 63 9 72 9 C82 11 86 19 90 27 C95 35 97 42 96 51 C97 61 92 67 89 75 C85 84 76 87 68 92 C59 97 51 96 43 96 C33 95 27 90 20 86 C12 80 8 72 5 63 C2 54 4 46 6 38 C9 28 15 21 23 14 C31 7 41 3 50 3Z" fill="url(#wax)"/>
    <circle cx="50" cy="50" r="31" fill="none" stroke="#5A0E18" stroke-width="2.4" opacity=".55"/>
    <circle cx="50" cy="50" r="31" fill="none" stroke="#D9A0A8" stroke-width=".8" opacity=".35" transform="translate(-.8,-.8)"/>
    <path d="M50 30 Q52.6 47.4 70 50 Q52.6 52.6 50 70 Q47.4 52.6 30 50 Q47.4 47.4 50 30Z" fill="#E3C98F"/><circle cx="50" cy="50" r="2.2" fill="#8B1E2D"/>
  </svg>`;

  const slides = [];
  const re = /<section class="page[\s\S]*?<\/section>/g; let m;
  while ((m = re.exec(body))) slides.push(`<div class="slide"><div class="fit">${m[0]}</div></div>`);
  const defs = body.slice(0, body.indexOf('<section'));
  const tex = (style.match(/url\('(data:image\/png;base64,[^']+)'\)/) || [])[1] || '';

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titulo}</title>
<meta name="description" content="${desc}">
<meta property="og:type" content="website"><meta property="og:title" content="${titulo}"><meta property="og:description" content="${desc}">
<meta property="og:image" content="${ogImg}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
${site ? `<meta property="og:url" content="${site}/">` : ''}<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#8B1E2D">
<style>${style}${CONVITE_CSS}</style></head>
<body style="--tex:url('${tex}')">
${defs}
<div class="env-screen" id="env">
  <div class="env-kicker">✦ &nbsp;Um convite para você&nbsp; ✦</div>
  <div class="env-title">Agenda de Natal 2026<small>Mayara Dias | Studio Beauty</small></div>
  <div class="envelope" id="envelope" role="button" aria-label="Abrir o convite" tabindex="0">
    <div class="env-back"></div>
    <div class="letter"><b>Dezembro, Dezembro!</b><span>sua agenda está aqui</span></div>
    <div class="env-front"><div class="l"></div><div class="r"></div><div class="b"></div></div>
    <div class="flap"></div>
    <div class="seal">${SEAL}</div>
  </div>
  <div class="tap">Toque no selo para abrir</div>
</div>
<div class="deck anim" id="deck">${slides.join('')}</div>
<div class="hint" id="hint">deslize para o lado →</div>
<script>
(function () {
  var env = document.getElementById('env'), envelope = document.getElementById('envelope'), deck = document.getElementById('deck'), hint = document.getElementById('hint');
  // brilhos caindo no envelope
  for (var i = 0; i < 18; i++) { var g = document.createElement('i'); g.className = 'glint'; g.style.left = (Math.random() * 100) + '%'; g.style.animationDuration = (6 + Math.random() * 7) + 's'; g.style.animationDelay = (-Math.random() * 10) + 's'; g.style.transform = 'scale(' + (.6 + Math.random()) + ')'; env.appendChild(g); }
  function fit() { var s = Math.min(window.innerWidth / 540, window.innerHeight / 960) * 0.98; document.documentElement.style.setProperty('--s', s); }
  fit(); window.addEventListener('resize', fit);
  var pages = [].slice.call(deck.querySelectorAll('.page'));
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); }); }, { root: deck, threshold: .55 });
  pages.forEach(function (p) { io.observe(p); });
  function ir(id) { var p = document.getElementById(id); if (p) deck.scrollTo({ left: p.closest('.slide').offsetLeft, behavior: 'smooth' }); }
  deck.addEventListener('click', function (e) { var a = e.target.closest('a[href^="#p"]'); if (a) { e.preventDefault(); ir(a.getAttribute('href').slice(1)); } });
  var aberto = false;
  function abrir() {
    if (aberto) return; aberto = true;
    env.classList.add('opening');
    setTimeout(function () { deck.classList.add('show'); env.classList.add('gone'); }, 2300);
    setTimeout(function () { hint.classList.add('on'); }, 4200);
    setTimeout(function () { hint.classList.remove('on'); }, 8200);
  }
  envelope.addEventListener('click', abrir);
  envelope.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') abrir(); });
  deck.addEventListener('scroll', function () { hint.classList.remove('on'); }, { passive: true });
  if (location.hash === '#agenda') { env.classList.add('gone'); deck.classList.add('show'); aberto = true; }
})();
</script>
</body></html>`;
  fs.writeFileSync(path.join(outDir, 'index.html'), html);

  // imagem de pré-visualização do link (1200x630): topo da capa
  const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1200 / 540 });
  const pg = await ctx.newPage();
  await pg.setContent(renderizado, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(outDir, 'capa.jpg'), type: 'jpeg', quality: 90, clip: { x: 0, y: 30, width: 540, height: 283.5 } });
  await ctx.close();
  return path.join(outDir, 'index.html');
}
