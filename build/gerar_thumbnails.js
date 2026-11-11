// Thumbnails das aulas na Kiwify (1280x720), visual premium com a foto real do PDF.
// Antes: rasterizar as páginas 1 e 2 de cada PDF em build/miniaturas/ (pdftoppm -r 110 -f 1 -l 2).
// Uso: node build/gerar_thumbnails.js  ->  entregaveis/thumbnails/*.png
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const MINI = path.join(__dirname, 'miniaturas');
const SAIDA = path.join(__dirname, '..', 'entregaveis', 'thumbnails');

const pagina = (pdf, n) => {
  const nomes = fs.readdirSync(MINI).filter(f => f.startsWith(pdf + '-')).sort();
  return 'data:image/png;base64,' + fs.readFileSync(path.join(MINI, nomes[n - 1])).toString('base64');
};

const aulas = [
  { arq: '1-1-primeiro-acesso', pdf: '00-Comece-Aqui-Primeiro-Acesso', tag: 'Módulo 01', titulo: 'Primeiro acesso<br>em 10 minutos', sub: 'O que o dono decide e os 6 passos do funcionário.' },
  { arq: '2-1-folha-de-rotina', pdf: '01-Folha-de-Rotina-Semanal', tag: 'Módulo 02 · Aula 1', titulo: 'Folha de Rotina<br>Semanal', sub: 'Imprima, cole na parede e siga todos os dias.' },
  { arq: '2-2-30-roteiros', pdf: '02-30-Roteiros-Grave-no-Chao-de-Loja', tag: 'Módulo 02 · Aula 2', titulo: '30 Roteiros<br>de Chão de Loja', sub: 'Vídeos de 7 a 20 segundos, prontos para gravar.', frente: 2 },
  { arq: '3-1-modelos-canva', pdf: '03-15-Modelos-Canva-Como-Usar', tag: 'Módulo 03', titulo: '15 Modelos<br>do Canva', sub: 'Troque foto, produto e preço pelo celular.' },
  { arq: '4-1-calendario-2027', pdf: '04-Calendario-Comercial-2027', tag: 'Módulo 04', titulo: 'Calendário<br>Comercial 2027', sub: 'As datas que vendem, o ano inteiro.', paisagem: true },
  { arq: '5-1-checklist', pdf: '05-Bonus-1-Checklist-do-Cacador-de-Ofertas', tag: 'Bônus 1', titulo: 'Checklist do<br>Caçador de Ofertas', sub: '10 minutos às 9h para achar o que precisa girar.' },
  { arq: '5-2-whatsapp', pdf: '06-Bonus-2-Mensagens-e-Audios-de-WhatsApp', tag: 'Bônus 2', titulo: 'Mensagens e Áudios<br>de WhatsApp', sub: 'Textos prontos para lista e grupo de ofertas.' },
  { arq: 'order-bump-kit-sinalizacao', pdf: '07-Order-Bump-Kit-de-Sinalizacao-QR-Code', tag: 'Exclusivo', titulo: 'Kit de Sinalização<br>com QR Code', sub: '8 placas que levam o cliente ao seu WhatsApp.' },
];

const html = (a) => {
  const p1 = pagina(a.pdf, a.frente === 2 ? 2 : 1);
  const p2 = pagina(a.pdf, a.frente === 2 ? 1 : 2);
  const w = a.paisagem ? 470 : 330;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1280px;height:720px;overflow:hidden;font-family:'Montserrat',sans-serif;-webkit-font-smoothing:antialiased}
.t{position:relative;width:1280px;height:720px;overflow:hidden;color:#fff;
   background:radial-gradient(900px 600px at 85% 50%,#3a1414 0%,#1a0f0f 45%,#0d0d0d 100%)}
.t::before{content:"";position:absolute;inset:0;opacity:.07;
   background-image:repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 3px)}
.linha{position:absolute;left:84px;top:96px;width:64px;height:4px;background:#D62828}
.txt{position:absolute;left:84px;top:128px;width:560px}
.tag{font-weight:600;font-size:20px;letter-spacing:.32em;text-transform:uppercase;color:#FCBF49}
h1{font-weight:900;font-size:66px;line-height:1.02;letter-spacing:-.025em;margin-top:26px}
p{font-weight:500;font-size:24px;line-height:1.4;margin-top:26px;color:rgba(255,255,255,.72)}
.rod{position:absolute;left:84px;bottom:70px;display:flex;align-items:center;gap:16px;
   font-weight:600;font-size:15px;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.55)}
.rod b{width:34px;height:1px;background:rgba(255,255,255,.4)}
.docs{position:absolute;right:${a.paisagem ? 40 : 110}px;top:50%;width:${w}px;height:${a.paisagem ? 333 : 467}px;transform:translateY(-50%)}
.docs img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;border-radius:6px}
.p2{transform:rotate(7deg) translate(46px,6px);filter:brightness(.55);box-shadow:0 30px 60px rgba(0,0,0,.6)}
.p1{transform:rotate(-4deg);box-shadow:0 40px 80px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08)}
</style></head><body><div class="t">
  <div class="linha"></div>
  <div class="txt"><div class="tag">${a.tag}</div><h1>${a.titulo}</h1><p>${a.sub}</p></div>
  <div class="rod"><b></b>Kit Operacional de Marketing para Supermercados</div>
  <div class="docs"><img class="p2" src="${p2}"><img class="p1" src="${p1}"></div>
</div></body></html>`;
};

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  for (const a of aulas) {
    await page.setContent(html(a), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(SAIDA, `${a.arq}.png`) });
    console.log('thumb:', a.arq);
  }
  await browser.close();
})();
