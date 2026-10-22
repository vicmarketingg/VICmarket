/**
 * Programa LDR® — recebe as aplicações da página e grava na planilha.
 * Cada pessoa ocupa UMA linha: a linha é criada quando ela informa nome e WhatsApp
 * e é atualizada conforme ela avança (contato → parcial → completa).
 */
var ABA = 'Aplicações';

var COLUNAS = [
  ['enviado_em', 'Data'],
  ['etapa', 'Etapa'],
  ['nome', 'Nome'],
  ['whatsapp', 'WhatsApp'],
  ['instagram', 'Instagram'],
  ['perfil', 'Perfil'],
  ['ocupacao', 'Ocupação'],
  ['area', 'Área que quer transformar'],
  ['momento', 'Momento atual'],
  ['dificulta', 'O que dificulta'],
  ['buscou', 'O que já buscou'],
  ['agora', 'Por que agora'],
  ['disposicao', 'Disposição (0-10)'],
  ['agenda', 'Agenda semanal'],
  ['investimento', 'Investimento'],
  ['importante', 'Algo importante'],
  ['origem', 'Página de origem'],
  ['lead_id', 'ID']
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = {};
    try { d = JSON.parse(e.postData.contents); } catch (err) { d = e.parameter || {}; }
    d.enviado_em = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm');

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
    if (aba.getLastRow() === 0) {
      aba.appendRow(COLUNAS.map(function (c) { return c[1]; }));
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');
    }
    var linha = COLUNAS.map(function (c) { return d[c[0]] || ''; });

    // se a mesma pessoa já tem linha (mesmo ID), atualiza; senão, cria
    var colId = COLUNAS.length, n = aba.getLastRow() - 1, alvo = 0;
    if (d.lead_id && n > 0) {
      var ids = aba.getRange(2, colId, n, 1).getValues();
      for (var i = 0; i < ids.length; i++) if (ids[i][0] === d.lead_id) { alvo = i + 2; break; }
    }
    if (alvo) aba.getRange(alvo, 1, 1, linha.length).setValues([linha]);
    else aba.appendRow(linha);

    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
