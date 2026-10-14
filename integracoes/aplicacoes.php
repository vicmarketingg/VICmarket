<?php
/**
 * Programa LDR® — recebe e mostra as aplicações da página, direto na Hostinger.
 *
 * Instalação: suba este arquivo na pasta public_html, ao lado do index.html.
 *
 *  - A página envia cada aplicação para cá (POST). Ela é salva num arquivo .csv
 *    numa pasta protegida, que ninguém consegue abrir pela internet.
 *  - Para ver as aplicações: abra  https://SEU-DOMINIO/aplicacoes.php?chave=CHAVE
 *  - Para baixar a planilha (abre no Excel / Google Planilhas): adicione &csv=1 no fim.
 *
 * As etapas "contato", "parcial" e "completa" da mesma pessoa têm o mesmo lead_id,
 * então a linha dela é atualizada em vez de duplicada.
 */

// Chave de acesso à lista. Troque por uma combinação só sua antes de subir o arquivo.
const CHAVE = 'TROQUE_ESTA_CHAVE';

// Opcional: e-mail que recebe um aviso a cada aplicação completa ('' = sem aviso).
const AVISO_EMAIL = '';

const COLS = [
  'lead_id', 'etapa', 'enviado_em', 'nome', 'whatsapp', 'instagram', 'ocupacao', 'perfil',
  'area', 'momento', 'dificulta', 'buscou', 'agora', 'disposicao', 'agenda', 'investimento',
  'importante', 'origem',
];
const ETAPA_ORDEM = ['contato' => 1, 'parcial' => 2, 'completa' => 3];

/** Pasta dos dados: fora da public_html quando possível; senão, uma subpasta bloqueada. */
function pasta_dados(): string {
  $fora = dirname(__DIR__) . '/dados-programa-ldr';
  if (is_dir($fora) || @mkdir($fora, 0750, true)) return $fora;
  $dentro = __DIR__ . '/dados-programa-ldr';
  if (!is_dir($dentro)) @mkdir($dentro, 0750, true);
  if (!file_exists("$dentro/.htaccess")) @file_put_contents("$dentro/.htaccess", "Require all denied\nDeny from all\n");
  return $dentro;
}

function ler_linhas($fh): array {
  rewind($fh);
  $linhas = [];
  $primeira = true;
  while (($r = fgetcsv($fh, 0, ';', '"', '')) !== false) {
    if ($primeira) { $primeira = false; continue; } // cabeçalho
    if (count($r) < count(COLS)) $r = array_pad($r, count(COLS), '');
    $linhas[] = array_combine(COLS, array_slice($r, 0, count(COLS)));
  }
  return $linhas;
}

/** Evita que o Excel interprete o conteúdo como fórmula. */
function celula($v): string {
  $v = str_replace(["\r\n", "\r"], "\n", (string) $v);
  $v = mb_substr($v, 0, 5000);
  return ($v !== '' && strpos('=+-@', $v[0]) !== false) ? "'" . $v : $v;
}

// ---------- recebe uma aplicação ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  header('Content-Type: text/plain; charset=utf-8');
  $bruto = file_get_contents('php://input', false, null, 0, 100000);
  $d = json_decode($bruto ?: '', true);
  if (!is_array($d) || empty($d['lead_id']) || !preg_match('/^[\w.-]{4,80}$/', $d['lead_id'])) {
    http_response_code(400); exit('dados inválidos');
  }
  $nova = [];
  foreach (COLS as $c) $nova[$c] = celula($d[$c] ?? '');

  $arq = pasta_dados() . '/aplicacoes.csv';
  $fh = fopen($arq, 'c+');
  if (!$fh) { http_response_code(500); exit('sem permissão para gravar'); }
  flock($fh, LOCK_EX);
  $linhas = ler_linhas($fh);
  $achou = false;
  foreach ($linhas as $i => $l) {
    if ($l['lead_id'] === $nova['lead_id']) {
      $achou = true;
      // nunca rebaixa uma aplicação completa para parcial
      if ((ETAPA_ORDEM[$nova['etapa']] ?? 0) >= (ETAPA_ORDEM[$l['etapa']] ?? 0)) $linhas[$i] = $nova;
    }
  }
  if (!$achou) $linhas[] = $nova;
  ftruncate($fh, 0); rewind($fh);
  fwrite($fh, "\xEF\xBB\xBF"); // acentos corretos no Excel
  fputcsv($fh, COLS, ';', '"', '');
  foreach ($linhas as $l) fputcsv($fh, array_values($l), ';', '"', '');
  fflush($fh); flock($fh, LOCK_UN); fclose($fh);

  if (AVISO_EMAIL && $nova['etapa'] === 'completa') {
    $corpo = '';
    foreach (COLS as $c) $corpo .= "$c: {$nova[$c]}\n";
    @mail(AVISO_EMAIL, '=?UTF-8?B?' . base64_encode('Nova aplicação — Programa LDR®: ' . $nova['nome']) . '?=', $corpo,
      "Content-Type: text/plain; charset=utf-8\r\nFrom: Programa LDR <nao-responda@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . ">");
  }
  exit('ok');
}

// ---------- mostra / baixa as aplicações ----------
$chave = (string) ($_GET['chave'] ?? '');
if (CHAVE === 'TROQUE_ESTA_CHAVE' || !hash_equals(CHAVE, $chave)) {
  http_response_code(403);
  header('Content-Type: text/plain; charset=utf-8');
  exit('Acesso restrito.');
}
$arq = pasta_dados() . '/aplicacoes.csv';
$linhas = [];
if (is_file($arq) && ($fh = fopen($arq, 'r'))) { flock($fh, LOCK_SH); $linhas = ler_linhas($fh); fclose($fh); }

if (!empty($_GET['csv'])) {
  header('Content-Type: text/csv; charset=utf-8');
  header('Content-Disposition: attachment; filename="aplicacoes-programa-ldr-' . date('Y-m-d') . '.csv"');
  is_file($arq) ? readfile($arq) : print("\xEF\xBB\xBF" . implode(';', COLS) . "\n");
  exit;
}

$linhas = array_reverse($linhas); // mais recentes primeiro
$h = fn($v) => htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8');
$rotulo = ['contato' => 'Só contato', 'parcial' => 'Parou no meio', 'completa' => 'Completa'];
header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex');
?><!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Aplicações — Programa LDR®</title>
<style>
body{margin:0;background:#FBF8F4;color:#3D2E26;font:15px/1.55 -apple-system,'Helvetica Neue',Arial,sans-serif}
.wrap{width:min(1100px,100% - 2rem);margin:0 auto;padding:2rem 0 4rem}
h1{font:400 1.9rem Georgia,serif;margin:0 0 .3rem}
.top{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;flex-wrap:wrap;margin-bottom:1.6rem}
.btn{display:inline-block;background:#3D2E26;color:#F7F2EC;text-decoration:none;padding:.7rem 1.1rem;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase}
.card{background:#fff;border:1px solid rgba(111,78,55,.18);padding:1.2rem 1.3rem;margin-bottom:1rem}
.card h2{font:400 1.3rem Georgia,serif;margin:0}
.meta{font-size:.82rem;color:#6F4E37;margin:.2rem 0 .8rem}
.tag{display:inline-block;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;padding:.15rem .5rem;margin-left:.5rem;vertical-align:middle;background:#EDE3D4}
.tag.completa{background:#4F6E6B;color:#fff}
dl{display:grid;grid-template-columns:minmax(120px,190px) 1fr;gap:.35rem 1rem;margin:0;font-size:.9rem}
dt{color:#6F4E37}dd{margin:0;white-space:pre-wrap}
a{color:#4F6E6B}
.empty{padding:3rem 0;color:#6F4E37}
@media(max-width:600px){dl{grid-template-columns:1fr}dt{margin-top:.5rem}}
</style></head><body><div class="wrap">
<div class="top"><div><h1>Aplicações — Programa LDR®</h1><div class="meta"><?= count($linhas) ?> no total · <?= count(array_filter($linhas, fn($l) => $l['etapa'] === 'completa')) ?> completas</div></div>
<a class="btn" href="?chave=<?= $h($chave) ?>&amp;csv=1">Baixar planilha (.csv)</a></div>
<?php if (!$linhas): ?><p class="empty">Nenhuma aplicação ainda.</p><?php endif; ?>
<?php foreach ($linhas as $l):
  $wa = preg_replace('/\D/', '', $l['whatsapp']); if ($wa && strlen($wa) <= 11) $wa = '55' . $wa; ?>
<div class="card">
  <h2><?= $h($l['nome'] ?: '(sem nome)') ?><span class="tag <?= $h($l['etapa']) ?>"><?= $h($rotulo[$l['etapa']] ?? $l['etapa']) ?></span></h2>
  <div class="meta"><?= $h($l['enviado_em']) ?> · <?php if ($wa): ?><a href="https://wa.me/<?= $h($wa) ?>" target="_blank" rel="noopener">WhatsApp <?= $h($l['whatsapp']) ?></a><?php endif; ?><?= $l['instagram'] ? ' · ' . $h($l['instagram']) : '' ?></div>
  <dl>
  <?php foreach (['ocupacao' => 'Ocupação', 'perfil' => 'Perfil', 'area' => 'Área que deseja transformar', 'momento' => 'Momento', 'dificulta' => 'O que dificulta', 'buscou' => 'O que já buscou', 'agora' => 'Por que agora', 'disposicao' => 'Disposição (0–10)', 'agenda' => 'Agenda semanal', 'investimento' => 'Investimento', 'importante' => 'Algo importante', 'origem' => 'Origem'] as $k => $t):
    if ($l[$k] === '') continue; ?>
    <dt><?= $t ?></dt><dd><?= $h($l[$k]) ?></dd>
  <?php endforeach; ?>
  </dl>
</div>
<?php endforeach; ?>
</div></body></html>
