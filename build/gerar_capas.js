// Gera as capas da área de membros (Kiwify) na identidade do kit.
// Uso: node build/gerar_capas.js   ->  entregaveis/capas/*.png
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SAIDA = path.join(__dirname, '..', 'entregaveis', 'capas');
const KIT = 'Kit Operacional de Marketing para Supermercados';

const modulos = [
  { n: '1', arq: 'modulo-1-comece-aqui', icone: '🚀', titulo: 'Comece Aqui', sub: 'Primeiro acesso em 10 minutos' },
  { n: '2', arq: 'modulo-2-rotina-e-roteiros', icone: '🎬', titulo: 'Rotina e Roteiros', sub: 'Folha de rotina + 30 roteiros de vídeo' },
  { n: '3', arq: 'modulo-3-modelos-canva', icone: '🎨', titulo: 'Modelos do Canva', sub: '15 encartes e ofertas prontos' },
  { n: '4', arq: 'modulo-4-calendario-2027', icone: '🗓️', titulo: 'Calendário 2027', sub: 'As datas que vendem no ano' },
  { n: '5', arq: 'modulo-5-bonus', icone: '🎁', titulo: 'Bônus', sub: 'Checklist + mensagens de WhatsApp' },
  { n: '+', arq: 'order-bump-kit-sinalizacao', icone: '📲', titulo: 'Kit de Sinalização', sub: '8 placas com QR Code', extra: true },
];

const fontes = "<link href='https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800;900&display=swap' rel='stylesheet'>";

const base = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Montserrat',sans-serif;-webkit-font-smoothing:antialiased}
  :root{--red:#D62828;--yellow:#FCBF49;--ink:#1D1D1D}
`;

const capa = (m) => `<!DOCTYPE html><html><head><meta charset="utf-8">${fontes}<style>${base}
  .c{width:900px;height:1350px;position:relative;overflow:hidden;color:#fff;
     background:${m.extra ? 'var(--ink)' : 'var(--red)'};display:flex;flex-direction:column;padding:80px 70px}
  .c::before{content:"";position:absolute;right:-180px;top:-180px;width:620px;height:620px;border-radius:50%;
     background:${m.extra ? 'rgba(214,40,40,.35)' : 'rgba(0,0,0,.13)'}}
  .tag{position:relative;font-weight:800;font-size:26px;letter-spacing:.16em;text-transform:uppercase;
     color:${m.extra ? 'var(--yellow)' : 'rgba(255,255,255,.85)'}}
  .num{position:relative;font-family:'Bebas Neue';font-size:360px;line-height:.85;margin-top:40px;color:var(--yellow)}
  .ico{position:absolute;right:70px;top:250px;font-size:190px;line-height:1}
  .fim{margin-top:auto;position:relative}
  .bar{width:120px;height:14px;background:var(--yellow);margin-bottom:34px}
  h1{font-weight:900;font-size:96px;line-height:1;letter-spacing:-.02em;text-transform:uppercase}
  p{font-weight:700;font-size:38px;line-height:1.25;margin-top:26px;color:rgba(255,255,255,.92)}
  .kit{margin-top:56px;padding-top:26px;border-top:3px solid rgba(255,255,255,.35);
     font-weight:800;font-size:22px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.8)}
</style></head><body><div class="c">
  <div class="tag">${m.extra ? 'Exclusivo · Order bump' : 'Módulo'}</div>
  <div class="num">${m.n}</div>
  <div class="ico">${m.icone}</div>
  <div class="fim"><div class="bar"></div><h1>${m.titulo}</h1><p>${m.sub}</p><div class="kit">${KIT}</div></div>
</div></body></html>`;

const banner = `<!DOCTYPE html><html><head><meta charset="utf-8">${fontes}<style>${base}
  .b{width:2000px;height:500px;background:var(--ink);color:#fff;position:relative;overflow:hidden;
     display:flex;align-items:center;justify-content:center;text-align:center}
  .b::before{content:"";position:absolute;left:0;top:0;bottom:0;width:36px;background:var(--red)}
  .b::after{content:"";position:absolute;right:0;top:0;bottom:0;width:36px;background:var(--yellow)}
  .tag{font-weight:800;font-size:28px;letter-spacing:.2em;text-transform:uppercase;color:var(--yellow)}
  h1{font-weight:900;font-size:84px;line-height:1.05;letter-spacing:-.02em;margin:18px 0 26px}
  h1 span{color:var(--red)}
  .itens{display:flex;gap:18px;justify-content:center}
  .itens div{font-weight:800;font-size:26px;border:3px solid rgba(255,255,255,.3);border-radius:100px;padding:10px 26px}
</style></head><body><div class="b"><div>
  <div class="tag">Bem-vindo(a) ao</div>
  <h1>Kit Operacional de Marketing<br><span>para Supermercados</span></h1>
  <div class="itens"><div>Rotina pronta</div><div>30 roteiros</div><div>15 modelos</div><div>Calendário 2027</div></div>
</div></div></body></html>`;

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1350 } });
  for (const m of modulos) {
    await page.setContent(capa(m), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(SAIDA, `${m.arq}.png`) });
    console.log('capa:', m.arq);
  }
  await page.setViewportSize({ width: 2000, height: 500 });
  await page.setContent(banner, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(SAIDA, 'banner-area-de-membros-2000x500.png') });
  console.log('banner ok');
  await browser.close();
})();
