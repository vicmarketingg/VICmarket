/**
 * Programa LDR® — recebe as aplicações da página e grava numa planilha do Google.
 *
 * Como instalar (gratuito):
 * 1. Abra https://sheets.new com a conta Google da equipe e dê um nome à planilha.
 * 2. Menu Extensões → Apps Script. Apague o que estiver lá e cole este arquivo inteiro. Salve.
 * 3. Botão Implantar → Nova implantação → (engrenagem) App da Web.
 *    Executar como: Eu  ·  Quem pode acessar: Qualquer pessoa  → Implantar → autorize.
 *    (Se aparecer "o Google não verificou este app": Avançado → Acessar. É o seu próprio script.)
 * 4. Copie a "URL do app da Web" (termina em /exec) e cole em ENDPOINT, no script da página.
 *
 * Cada aplicação vira uma linha. As etapas "contato", "parcial" e "completa" de uma mesma
 * pessoa têm o mesmo lead_id, então a linha dela é atualizada em vez de duplicada.
 */

// Opcional: e-mail que recebe um aviso a cada aplicação completa (deixe '' para não avisar).
const NOTIFY_EMAIL = '';

const SHEET_NAME = 'Aplicações';
const COLS = [
  'lead_id', 'etapa', 'enviado_em', 'nome', 'whatsapp', 'instagram', 'ocupacao', 'perfil',
  'area', 'momento', 'dificulta', 'buscou', 'agora', 'disposicao', 'agenda', 'investimento',
  'importante', 'origem'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    const row = COLS.map(function (c) { return data[c] == null ? '' : String(data[c]); });

    const last = sheet.getLastRow();
    const ids = last > 1 ? sheet.getRange(2, 1, last - 1, 1).getValues().map(function (r) { return r[0]; }) : [];
    const i = ids.indexOf(data.lead_id);

    if (i >= 0) {
      // nunca rebaixa uma aplicação completa para parcial
      const etapaAtual = sheet.getRange(i + 2, 2).getValue();
      if (etapaAtual !== 'completa' || data.etapa === 'completa') {
        sheet.getRange(i + 2, 1, 1, COLS.length).setValues([row]);
      }
    } else {
      sheet.appendRow(row);
    }

    if (NOTIFY_EMAIL && data.etapa === 'completa') {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        'Nova aplicação — Programa LDR®: ' + (data.nome || ''),
        COLS.map(function (c) { return c + ': ' + (data[c] || ''); }).join('\n')
      );
    }
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1000, COLS.length).setNumberFormat('@'); // mantém WhatsApp e notas como texto
    sheet.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}
