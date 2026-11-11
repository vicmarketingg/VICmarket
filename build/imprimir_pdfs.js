// Converte build/html/*.html em entregaveis/*.pdf (A4), com rodapé e número de página.
// Rode antes: python3 build/gerar_entregaveis.py
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const manifesto = JSON.parse(fs.readFileSync(path.join(__dirname, 'html', 'manifesto.json'), 'utf8'));

const rodape = `
  <div style="width:100%;font-family:Arial,sans-serif;font-size:7.5pt;color:#777;padding:0 14mm;
              display:flex;justify-content:space-between;">
    <span>Kit Operacional de Marketing para Supermercados · Victoria Benevides</span>
    <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
  </div>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const item of manifesto) {
    await page.goto('file://' + item.html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: item.pdf,
      format: 'A4',
      landscape: item.paisagem,
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: rodape,
      margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' },
    });
    console.log('pdf:', path.relative(process.cwd(), item.pdf));
  }
  await browser.close();
})();
