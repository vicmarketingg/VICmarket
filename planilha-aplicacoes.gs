/**
 * Programa LDR® — recebe as aplicações da página e grava na planilha.
 * Como instalar: veja o passo a passo enviado junto (Extensões > Apps Script).
 */
var ABA = 'Aplicações';

// Ordem e nome das colunas na planilha
var COLUNAS = [
  ['data', 'Data'],
  ['qualif_status', 'Qualificação'],
  ['qualif_pontuacao', 'Pontuação (0-10)'],
  ['nome', 'Nome'],
  ['whatsapp', 'WhatsApp'],
  ['instagram', 'Instagram'],
  ['ocupacao', 'Ocupação'],
  ['perfil', 'Perfil'],
  ['qualif_busca', 'O que procura'],
  ['qualif_historico', 'Já investiu em desenvolvimento'],
  ['momento', 'Momento atual'],
  ['area', 'Área que quer transformar'],
  ['dificulta', 'O que dificulta'],
  ['buscou', 'O que já buscou'],
  ['agora', 'Por que agora'],
  ['disposicao', 'Disposição (0-10)'],
  ['agenda', 'Agenda semanal'],
  ['investimento', 'Investimento'],
  ['importante', 'Algo importante'],
  ['pagina', 'Página de origem']
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
    if (aba.getLastRow() === 0) {
      aba.appendRow(COLUNAS.map(function (c) { return c[1]; }));
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');
    }
    var p = (e && e.parameter) || {};
    p.data = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm');
    aba.appendRow(COLUNAS.map(function (c) { return p[c[0]] || ''; }));
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
