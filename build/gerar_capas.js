// Capas dos módulos (900x1350) e imagem do produto (1280x720 e 1080x1080), no estilo premium
// das thumbnails: fundo escuro + foto real dos PDFs.
// Antes: páginas dos PDFs em build/miniaturas/ (pdftoppm -r 110 -png -f 1 -l 2).
// Uso: node build/gerar_capas.js  ->  entregaveis/capas/*.png
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const MINI = path.join(__dirname, 'miniaturas');
const SAIDA = path.join(__dirname, '..', 'entregaveis', 'capas');
const KIT = 'Kit Operacional de Marketing para Supermercados';

const img = (pdf, n = 1) => {
  const nomes = fs.readdirSync(MINI).filter(f => f.startsWith(pdf + '-')).sort();
  return 'data:image/png;base64,' + fs.readFileSync(path.join(MINI, nomes[n - 1])).toString('base64');
};

const P = {
  comece: '00-Comece-Aqui-Primeiro-Acesso', rotina: '01-Folha-de-Rotina-Semanal',
  roteiros: '02-30-Roteiros-Grave-no-Chao-de-Loja', canva: '03-15-Modelos-Canva-Como-Usar',
  cal: '04-Calendario-Comercial-2027', check: '05-Bonus-1-Checklist-do-Cacador-de-Ofertas',
  zap: '06-Bonus-2-Mensagens-e-Audios-de-WhatsApp', placas: '07-Order-Bump-Kit-de-Sinalizacao-QR-Code',
};

const fontes = `<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@500;600;800;900&display=swap" rel="stylesheet">`;
const fundo = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{overflow:hidden;font-family:'Montserrat',sans-serif;-webkit-font-smoothing:antialiased;color:#fff}
  .bg{position:relative;overflow:hidden;background:radial-gradient(120% 80% at 70% 45%,#3a1414 0%,#1a0f0f 45%,#0d0d0d 100%)}
  .bg::before{content:"";position:absolute;inset:0;opacity:.07;z-index:0;
     background-image:repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 3px)}
  .doc{position:absolute;border-radius:6px;object-fit:cover;object-position:top}
  .tag{font-weight:600;letter-spacing:.32em;text-transform:uppercase;color:#FCBF49}
  .linha{width:64px;height:4px;background:#D62828}
`;

// ---------------- capas dos módulos (900x1350)
const modulos = [
  { arq: 'modulo-1-comece-aqui', n: '01', titulo: 'Comece<br>Aqui', sub: 'Primeiro acesso em 10 minutos', docs: [P.comece] },
  { arq: 'modulo-2-rotina-e-roteiros', n: '02', titulo: 'Rotina e<br>Roteiros', sub: 'Folha de rotina + 30 roteiros de vídeo', docs: [P.rotina, [P.roteiros, 2]] },
  { arq: 'modulo-3-modelos-canva', n: '03', titulo: 'Modelos<br>do Canva', sub: '15 encartes e ofertas prontos', docs: [P.canva] },
  { arq: 'modulo-4-calendario-2027', n: '04', titulo: 'Calendário<br>2027', sub: 'As datas que vendem no ano', docs: [P.cal], paisagem: true },
  { arq: 'modulo-5-bonus', n: '05', titulo: 'Bônus', sub: 'Checklist + mensagens de WhatsApp', docs: [P.check, P.zap] },
  { arq: 'order-bump-kit-sinalizacao', n: '+', titulo: 'Kit de<br>Sinalização', sub: '8 placas com QR Code', docs: [P.placas], tag: 'Exclusivo' },
];

const capaModulo = (m) => {
  const src = m.docs.map(d => Array.isArray(d) ? img(d[0], d[1]) : img(d));
  const docs = m.paisagem
    ? `<img class="doc" src="${src[0]}" style="width:640px;height:453px;left:130px;top:270px;transform:rotate(-5deg);box-shadow:0 40px 80px rgba(0,0,0,.7)">`
    : src.length === 2
      ? `<img class="doc" src="${src[1]}" style="width:400px;height:566px;left:330px;top:205px;transform:rotate(8deg);filter:brightness(.6);box-shadow:0 30px 60px rgba(0,0,0,.6)">
         <img class="doc" src="${src[0]}" style="width:400px;height:566px;left:150px;top:180px;transform:rotate(-5deg);box-shadow:0 40px 80px rgba(0,0,0,.7)">`
      : `<img class="doc" src="${img(m.docs[0], 2)}" style="width:420px;height:594px;left:290px;top:190px;transform:rotate(8deg);filter:brightness(.6);box-shadow:0 30px 60px rgba(0,0,0,.6)">
         <img class="doc" src="${src[0]}" style="width:420px;height:594px;left:170px;top:170px;transform:rotate(-5deg);box-shadow:0 40px 80px rgba(0,0,0,.7)">`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${fontes}<style>${fundo}
    .bg{width:900px;height:1350px}
    .topo{position:absolute;left:80px;top:80px;right:80px;display:flex;justify-content:space-between;align-items:flex-start;z-index:2}
    .tag{font-size:22px}
    .num{font-family:'Bebas Neue';font-size:150px;line-height:.8;color:transparent;-webkit-text-stroke:2px rgba(252,191,73,.85)}
    .base{position:absolute;left:80px;right:80px;bottom:90px;z-index:2}
    h1{font-weight:900;font-size:100px;line-height:.98;letter-spacing:-.03em;margin-top:30px}
    p{font-weight:500;font-size:32px;margin-top:22px;color:rgba(255,255,255,.75)}
    .kit{margin-top:40px;font-weight:600;font-size:17px;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.5)}
    .sombra{position:absolute;left:0;right:0;bottom:0;height:640px;z-index:1;
       background:linear-gradient(transparent,rgba(13,13,13,.92) 45%,#0d0d0d)}
  </style></head><body><div class="bg">
    <div class="topo"><div><div class="linha"></div><div class="tag" style="margin-top:22px">${m.tag || 'Módulo'}</div></div><div class="num">${m.n}</div></div>
    ${docs}
    <div class="sombra"></div>
    <div class="base"><h1>${m.titulo}</h1><p>${m.sub}</p><div class="kit">${KIT}</div></div>
  </div></body></html>`;
};

// ---------------- imagem do produto (leque com todos os PDFs)
const leque = [P.roteiros, P.canva, P.check, P.zap, P.rotina];
const produto = (w, h) => {
  const quadrado = w === h;
  const dw = quadrado ? 300 : 245, dh = Math.round(dw * 1.414);
  const cx = quadrado ? w / 2 - dw / 2 : 905, cy = quadrado ? 500 : 190;
  const ang = [-22, -11, 0, 11, 22];
  const docs = leque.map((d, i) =>
    `<img class="doc" src="${img(d)}" style="width:${dw}px;height:${dh}px;left:${cx + (i - 2) * (quadrado ? 95 : 72)}px;top:${cy + Math.abs(i - 2) * 22}px;
      transform:rotate(${ang[i]}deg);transform-origin:50% 120%;z-index:${i === 2 ? 5 : 5 - Math.abs(i - 2)};
      filter:brightness(${i === 2 ? 1 : 0.8});box-shadow:0 30px 70px rgba(0,0,0,.7)">`).join('');
  const cal = quadrado ? '' :
    `<img class="doc" src="${img(P.cal)}" style="width:300px;height:212px;left:930px;top:480px;transform:rotate(-4deg);z-index:6;box-shadow:0 30px 70px rgba(0,0,0,.75)">`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${fontes}<style>${fundo}
    .bg{width:${w}px;height:${h}px}
    .txt{position:absolute;z-index:10;${quadrado ? 'left:0;right:0;top:80px;text-align:center' : 'left:84px;top:150px;width:560px'}}
    .linha{${quadrado ? 'margin:0 auto' : ''}}
    .tag{font-size:${quadrado ? 22 : 16}px;margin-top:22px;white-space:nowrap}
    h1{font-weight:900;font-size:${quadrado ? 64 : 50}px;line-height:1.02;letter-spacing:-.025em;margin-top:22px}
    h1 span{color:#D62828}
    .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px;${quadrado ? 'justify-content:center' : ''}}
    .chips div{font-weight:600;font-size:${quadrado ? 19 : 17}px;border:1px solid rgba(255,255,255,.28);border-radius:100px;padding:8px 18px;color:rgba(255,255,255,.85)}
    ${!quadrado ? '.esq{position:absolute;left:0;top:0;bottom:0;width:720px;z-index:9;background:linear-gradient(90deg,#0d0d0d 60%,transparent)}' : ''}
    ${quadrado ? '.sombra{position:absolute;left:0;right:0;top:0;height:470px;z-index:9;background:linear-gradient(#0d0d0d 55%,transparent)}' : ''}
  </style></head><body><div class="bg">
    ${docs}${cal}${quadrado ? '<div class="sombra"></div>' : '<div class="esq"></div>'}
    <div class="txt"><div class="linha"></div><div class="tag">Material pronto para a sua equipe</div>
      <h1>Kit Operacional de Marketing<br><span>para Supermercados</span></h1>
      <div class="chips"><div>Rotina pronta</div><div>30 roteiros</div><div>15 modelos Canva</div><div>Calendário 2027</div><div>+2 bônus</div></div>
    </div>
  </div></body></html>`;
};

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const foto = async (html, w, h, nome) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(SAIDA, nome) });
    console.log('ok:', nome);
  };
  for (const m of modulos) await foto(capaModulo(m), 900, 1350, `${m.arq}.png`);
  await foto(produto(1280, 720), 1280, 720, 'produto-1280x720.png');
  await foto(produto(1080, 1080), 1080, 1080, 'produto-1080x1080.png');
  await browser.close();
})();
