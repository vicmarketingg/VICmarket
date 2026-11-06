// Gera o PDF "Agenda de Natal 2026 — Mayara Dias | Studio Beauty" (identidade editorial de luxo).
// Uso:  node build.mjs [dados.json] [saida.pdf]
// Edite dados.json (horários, vagas, serviços, foto) e rode de novo. Gera também a versão .html.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const DIR = path.dirname(fileURLToPath(import.meta.url));
const dadosPath = path.resolve(DIR, process.argv[2] || 'dados.json');
const D = JSON.parse(fs.readFileSync(dadosPath, 'utf8'));
const OUT = process.argv[3] ? path.resolve(process.argv[3]) : path.join(DIR, 'Agenda_Natal_2026_Mayara_Dias.pdf');

// ---------- paleta ----------
const C = { bege: '#F5E8DC', off: '#FFF9F2', marrom: '#593728', vinho: '#8B1E2D', dourado: '#C6A36A', ouroEsc: '#9C7840', vinhoEsc: '#5E1019' };

// ---------- utilidades ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const f = (n) => Math.round(n * 10) / 10;
const dataUri = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;

// ---------- calendário: dezembro de 2026 ----------
const ANO = 2026, MES = 11;
const primeiro = new Date(Date.UTC(ANO, MES, 1));
const diasNoMes = new Date(Date.UTC(ANO, MES + 1, 0)).getUTCDate();
const offsetSeg = (primeiro.getUTCDay() + 6) % 7; // 0 = segunda
if (diasNoMes !== 31 || offsetSeg !== 1) throw new Error('Calendário inconsistente: dezembro/2026 deve ter 31 dias e começar numa terça.');
const NOMES_DIA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const semAtend = (D.dias_sem_atendimento || []).map(Number).sort((a, b) => a - b);
const semAtendSet = new Set(semAtend);
const disp = D.disponibilidade || {};
const infoDia = (d) => disp[String(d)] || disp[String(d).padStart(2, '0')];
const tipoDia = (d) => (semAtendSet.has(d) ? 'fechado' : (offsetSeg + d - 1) % 7 === 6 ? 'domingo' : 'aberto');
const statusDe = (i) => { const s = String(i?.status || '').toLowerCase(); return s.startsWith('lot') ? 'lotado' : s.startsWith('pou') ? 'poucas' : s ? 'vagas' : ''; };

// ---------- ornamentos (vetor) ----------
const T = (seed, fill = C.off) => `data-torn="${seed}" data-fill="${fill}"`;

function sparkle(cx, cy, R, fill = 'url(#gold)') {
  const r = R * 0.14;
  return `<path d="M${cx},${cy - R} Q${cx + r},${cy - r} ${cx + R},${cy} Q${cx + r},${cy + r} ${cx},${cy + R} Q${cx - r},${cy + r} ${cx - R},${cy} Q${cx - r},${cy - r} ${cx},${cy - R}Z" fill="${fill}"/>`;
}
const spark = (x, y, size, op = 1) => `<svg class="abs" style="left:${x}px;top:${y}px;opacity:${op}" width="${size}" height="${size}" viewBox="0 0 40 40">${sparkle(20, 20, 19)}</svg>`;

// ramo de pinheiro em traço dourado fino
function sprig(x, y, len, rot, seed, { flip = false, op = 0.9, color = 'url(#goldLine)', berries = true } = {}) {
  const r = rng(seed); let g = '';
  const branch = (x0, y0, L, ang, depth) => {
    const bend = (depth ? 0.08 : 0.1) * (r() > 0.5 ? 1 : -1);
    const cx = x0 + Math.cos(ang) * L * 0.5 + Math.cos(ang + Math.PI / 2) * L * bend;
    const cy = y0 + Math.sin(ang) * L * 0.5 + Math.sin(ang + Math.PI / 2) * L * bend;
    const x1 = x0 + Math.cos(ang) * L, y1 = y0 + Math.sin(ang) * L;
    g += `<path d="M${f(x0)},${f(y0)} Q${f(cx)},${f(cy)} ${f(x1)},${f(y1)}" stroke="${color}" stroke-width="${depth ? 0.9 : 1.3}" fill="none" stroke-linecap="round"/>`;
    const n = Math.round(L / 4.2);
    for (let i = 2; i <= n; i++) {
      const t = i / n, u = 1 - t;
      const px = u * u * x0 + 2 * u * t * cx + t * t * x1, py = u * u * y0 + 2 * u * t * cy + t * t * y1;
      const tx = 2 * u * (cx - x0) + 2 * t * (x1 - cx), ty = 2 * u * (cy - y0) + 2 * t * (y1 - cy); const ta = Math.atan2(ty, tx);
      for (const s of [-1, 1]) {
        const a = ta + s * (0.62 + r() * 0.2); const nl = (depth ? 7 : 10) * (0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, t * 1.1))) + r() * 2;
        g += `<line x1="${f(px)}" y1="${f(py)}" x2="${f(px + Math.cos(a) * nl)}" y2="${f(py + Math.sin(a) * nl)}" stroke="${color}" stroke-width=".75" stroke-linecap="round"/>`;
      }
      if (!depth && i % 7 === 3 && t < 0.75) branch(px, py, L * (0.4 + r() * 0.1), ta + (i % 14 === 3 ? -0.6 : 0.6), 1);
    }
    if (berries && !depth) for (let k = 0; k < 3; k++) g += `<circle cx="${f(x0 + (x1 - x0) * (0.3 + k * 0.05) + (k - 1) * 4)}" cy="${f(y0 + (y1 - y0) * 0.3 + 7 + k * 3)}" r="${2.2 - k * 0.3}" fill="${k === 1 ? C.dourado : '#B33A4A'}"/>`;
  };
  branch(6, 50, len - 12, 0, 0);
  return `<g opacity="${op}" transform="translate(${x},${y}) rotate(${rot} 6 50)${flip ? ' translate(0,100) scale(1,-1)' : ''}">${g}</g>`;
}

// laço de cetim
function bow(x, y, w, rot = 0) {
  return `<svg class="abs bow" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg)" width="${w}" height="${w * 0.9}" viewBox="0 0 200 180">
      <path d="M92,82 C82,112 68,140 52,172 L70,165 L79,178 C94,146 101,116 104,86Z" fill="url(#satinD)"/>
      <path d="M108,82 C118,112 132,140 148,172 L130,165 L121,178 C106,146 99,116 96,86Z" fill="url(#satinD)"/>
      <path d="M100,74 C78,26 24,10 16,46 C10,78 54,96 100,80Z" fill="url(#satin)"/>
      <path d="M100,74 C122,26 176,10 184,46 C190,78 146,96 100,80Z" fill="url(#satin)"/>
      <path d="M100,76 C72,42 40,34 33,50 C44,45 72,53 100,78Z" fill="#4a0b14" opacity=".5"/>
      <path d="M100,76 C128,42 160,34 167,50 C156,45 128,53 100,78Z" fill="#4a0b14" opacity=".5"/>
      <path d="M26,40 C38,22 64,24 84,46" stroke="#fff" stroke-opacity=".3" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M174,40 C162,22 136,24 116,46" stroke="#fff" stroke-opacity=".22" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M62,160 C72,136 83,114 90,94" stroke="#fff" stroke-opacity=".16" stroke-width="2.5" fill="none"/>
      <ellipse cx="100" cy="79" rx="14" ry="17" fill="url(#satin)"/>
      <ellipse cx="97" cy="73" rx="5" ry="6" fill="#fff" opacity=".22"/>
    </svg>`;
}

// ícones dourados de linha (substituem os emojis nos títulos)
const ICON = {
  tree: `<svg class="ico" viewBox="0 0 24 30"><path d="M12 2.2l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" fill="url(#gold)"/><path d="M12 9 L6.5 16.5 H9.5 L4.5 23.5 H19.5 L14.5 16.5 H17.5 Z" fill="none" stroke="url(#gold)" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 23.5 V28" stroke="url(#gold)" stroke-width="1.6"/><circle cx="10" cy="19" r="1" fill="url(#gold)"/><circle cx="14.2" cy="14.6" r="1" fill="url(#gold)"/><circle cx="13.5" cy="21" r="1" fill="url(#gold)"/></svg>`,
  bow: `<svg class="ico" viewBox="0 0 30 24"><path d="M15 10 C11 3 3 2 3 8 C3 13 10 13 15 11 Z M15 10 C19 3 27 2 27 8 C27 13 20 13 15 11 Z" fill="none" stroke="url(#gold)" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 12 L9.5 21 L12 20.4 L13 22.5 L15 13 M16 12 L20.5 21 L18 20.4 L17 22.5 L15 13" fill="none" stroke="url(#gold)" stroke-width="1.3" stroke-linejoin="round"/><circle cx="15" cy="10.6" r="2" fill="url(#gold)"/></svg>`,
  heart: `<svg class="ico" viewBox="0 0 28 26"><path d="M14 23.5 C7 18.5 2.5 14.5 2.5 9.3 C2.5 5.5 5.4 3 8.6 3 C11 3 12.8 4.4 14 6.4 C15.2 4.4 17 3 19.4 3 C22.6 3 25.5 5.5 25.5 9.3 C25.5 14.5 21 18.5 14 23.5Z" fill="url(#gold)"/></svg>`,
  camera: `<svg width="46" height="40" viewBox="0 0 44 38"><rect x="2" y="8" width="40" height="28" rx="5" fill="none" stroke="${C.dourado}" stroke-width="1.6"/><path d="M14 8 l3-6 h10 l3 6" fill="none" stroke="${C.dourado}" stroke-width="1.6"/><circle cx="22" cy="22" r="8" fill="none" stroke="${C.dourado}" stroke-width="1.6"/></svg>`,
};
const orn = (w = 150, color = 'url(#goldLine)') => `<svg class="orn" width="${w}" height="14" viewBox="0 0 ${w} 14"><line x1="0" y1="7" x2="${w / 2 - 14}" y2="7" stroke="${color}" stroke-width=".8"/><line x1="${w / 2 + 14}" y1="7" x2="${w}" y2="7" stroke="${color}" stroke-width=".8"/>${sparkle(w / 2, 7, 6.5)}<circle cx="${w / 2 - 20}" cy="7" r="1.3" fill="${C.dourado}"/><circle cx="${w / 2 + 20}" cy="7" r="1.3" fill="${C.dourado}"/></svg>`;

const DEFS = `<svg width="0" height="0" style="position:absolute"><defs>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EAD5A3"/><stop offset=".45" stop-color="${C.dourado}"/><stop offset="1" stop-color="#9C7840"/></linearGradient>
  <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D8BE86"/><stop offset=".5" stop-color="${C.dourado}"/><stop offset="1" stop-color="#A8854D"/></linearGradient>
  <linearGradient id="satin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B3303F"/><stop offset=".55" stop-color="${C.vinho}"/><stop offset="1" stop-color="#560d17"/></linearGradient>
  <linearGradient id="satinD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9C2433"/><stop offset="1" stop-color="#520c16"/></linearGradient>
</defs></svg>`;

// ---------- navegação ----------
function nav(page) {
  const prev = page > 1 ? `<a class="nbtn" href="#p${page - 1}">← Voltar</a>` : '<span></span>';
  const dots = [1, 2, 3, 4].map((i) => `<a class="dot ${i === page ? 'on' : ''}" href="#p${i}">${i}</a>`).join('');
  const next = page < 4 ? `<a class="nbtn solid" href="#p${page + 1}">Avançar →</a>` : `<a class="nbtn solid" href="${esc(D.whatsapp_link)}">WhatsApp →</a>`;
  return `<nav class="nav">${prev}<a class="nbtn" href="#p1">Capa</a><span class="dots">${dots}</span>${next}</nav>`;
}
const frame = (dark = false) => `<div class="frame ${dark ? 'dark' : ''}"></div><div class="corners">${spark(10, 10, 20)}${spark(510, 10, 20)}${spark(10, 930, 20)}${spark(510, 930, 20)}</div>`;
const header = (kicker, title, icon, extraCls = '') => `<div class="kicker">${kicker}</div><h2 class="title ${extraCls}">${title} ${ICON[icon] || icon}</h2>${orn(170)}`;

// ---------- PÁGINA 1 — CAPA ----------
const fotoFile = D.foto ? path.resolve(DIR, D.foto) : null;
const temFoto = fotoFile && fs.existsSync(fotoFile);
const fotoHtml = temFoto
  ? `<img class="foto" src="${dataUri(fotoFile, /\.png$/i.test(fotoFile) ? 'image/png' : 'image/jpeg')}" style="object-position:${esc(D.foto_posicao || '50% 30%')}"/>`
  : `<div class="foto vazia">${ICON.camera}<span>foto da Mayara</span></div>`;

const p1 = `<section class="page cover" id="p1">
  ${frame(true)}
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(-14, -18, 150, 32, 11)}${sprig(-24, 40, 110, 58, 12, { berries: false, op: .7 })}</svg>
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(554, -18, 150, 148, 13, { flip: true })}${sprig(564, 40, 110, 122, 14, { berries: false, op: .7, flip: true })}</svg>
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(-14, 930, 140, -30, 15, { flip: true })}${sprig(554, 930, 140, 210, 16)}</svg>
  ${spark(70, 300, 14, .9)}${spark(452, 250, 18, .9)}${spark(462, 560, 11, .8)}${spark(58, 520, 10, .8)}

  <div class="kicker light">✦ &nbsp;Agenda exclusiva&nbsp; ✦</div>
  <div class="arch-wrap">
    <div class="arch-outer"><div class="arch">${fotoHtml}</div></div>
    ${bow(88, -40, 102, 0)}
  </div>
  <h1 class="cover-title">Dezembro,<br>Dezembro! ${ICON.tree}</h1>
  <div class="script">Agenda de Natal 2026</div>
  <div class="brand">Mayara Dias <span>|</span> Studio Beauty</div>
  ${orn(190)}
  <p class="quote">“Seu momento de beleza para as festas<br>começa aqui!”</p>
  <a class="cta" href="#p2">Abrir minha agenda <span>→</span></a>
  <div class="mini-index"><a href="#p2">Calendário</a><i>·</i><a href="#p3">Regras</a><i>·</i><a href="#p4">Valores</a></div>
</section>`;

// ---------- PÁGINA 2 — CALENDÁRIO ----------
const usaDisp = Object.keys(disp).length > 0;
let cells = '';
for (let i = 0; i < offsetSeg; i++) cells += '<div class="cell blank"></div>';
for (let d = 1; d <= diasNoMes; d++) {
  const t = tipoDia(d); let cls = t, sub = '';
  if (t === 'fechado') sub = '<small>sem atend.</small>';
  else if (t === 'aberto') { const st = statusDe(infoDia(d)); if (st) { cls += ' ' + st; sub = `<small>${st}</small>`; } }
  cells += `<div class="cell ${cls}"><b>${d}</b>${sub}</div>`;
}
const fmtDia = (d) => `${String(d).padStart(2, '0')}/12`;
const listaSem = semAtend.map(fmtDia); const txtSem = listaSem.length > 1 ? listaSem.slice(0, -1).join(', ') + ' e ' + listaSem.at(-1) : listaSem.join('');
const legenda = `<div class="legend">
  <span><i class="lg fechado"></i><b>Sem atendimento:</b> ${txtSem}</span>
  <span><i class="lg domingo"></i>Domingos: sem atendimento</span>
  ${usaDisp ? '<span><i class="lg vagas"></i>vagas</span><span><i class="lg poucas"></i>poucas vagas</span><span><i class="lg lotado"></i>lotado</span>' : ''}
</div>`;

const normais = (D.horarios_normais || []).length
  ? `<div class="times">${D.horarios_normais.map((h) => `<span>${esc(h)}</span>`).join('')}</div>`
  : `<div class="soon"><em>Em breve</em><span>os horários serão divulgados aqui</span></div>`;
const extras = `<div class="leaders">${(D.horarios_extras || []).map((h) => `<div class="ld"><b>${esc(h.hora)}</b><i></i><span>${esc(h.detalhe)}</span></div>`).join('')}</div>`;

let porDia;
if (usaDisp) {
  const rows = Object.keys(disp).map(Number).filter((d) => d >= 1 && d <= 31 && tipoDia(d) === 'aberto').sort((a, b) => a - b).map((d) => {
    const i = infoDia(d); const dow = NOMES_DIA[(offsetSeg + d - 1) % 7];
    const hs = (i.horarios || []).length ? i.horarios.map(esc).join(' · ') : statusDe(i) === 'lotado' ? 'lotado' : '—';
    return `<div class="pd"><b>${dow} ${String(d).padStart(2, '0')}</b><span>${hs}</span></div>`;
  });
  porDia = `<div class="card pd-card" ${T(31)}><h3>Vagas por dia</h3><div class="pd-grid" style="grid-template-rows:repeat(${Math.ceil(rows.length / 3)},auto)">${rows.join('')}</div></div>`;
} else {
  porDia = `<p class="note">A disponibilidade de cada dia será atualizada aqui. Confirme sua vaga com a Mayara pelo WhatsApp.</p>`;
}

const p2 = `<section class="page inner ${usaDisp ? 'compact' : ''}" id="p2">
  ${frame()}
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(-14, -18, 120, 34, 21, { op: .75 })}${sprig(554, -18, 120, 146, 22, { op: .75, flip: true })}</svg>
  ${header('✦ &nbsp;Segunda a sábado&nbsp; ✦', 'Agenda de Dezembro', 'bow', 'one')}
  <div class="card cal-card" ${T(33)}>
    ${bow(-22, -26, 58, -16)}
    <div class="cal-head"><span class="mes">Dezembro</span><span class="ano">2026</span></div>
    <div class="grid wd">${NOMES_DIA.map((n) => `<div>${n}</div>`).join('')}</div>
    <div class="grid days">${cells}</div>
    ${legenda}
  </div>
  <div class="card hours-card" ${T(35)}>
    <div class="hcols">
      <div><h3>Horários normais</h3>${normais}</div>
      <div><h3>Horários extras</h3>${extras}</div>
    </div>
    <p class="fine">Horários extras são <b>possibilidades de atendimento, não vagas confirmadas</b>. 07h e 08h têm taxa extra de R$ 20,00.</p>
  </div>
  ${porDia}
  ${nav(2)}
</section>`;

// ---------- PÁGINA 3 — REGRAS ----------
const item = (n, title, body) => `<div class="ri"><div class="rn">${String(n).padStart(2, '0')}</div><div><h3>${title}</h3>${body}</div></div>`;
const p3 = `<section class="page inner" id="p3">
  ${frame()}
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(-14, -18, 120, 34, 31, { op: .75 })}${sprig(554, -18, 120, 146, 32, { op: .75, flip: true })}</svg>
  ${header('✦ &nbsp;Antes de agendar&nbsp; ✦', 'Alguns detalhes<br>importantes', 'heart', 'two')}
  <p class="lead">“Sem mil regras, só organização e bom senso.”</p>
  <div class="card rules-card" ${T(51)}>
    ${item(1, 'Abertura da agenda', `<div class="dates"><div><b>08/11</b><span>Clientes fixas</span></div><i></i><div><b>11/11</b><span>Abertura geral</span></div></div>`)}
    ${item(2, 'Reajuste de valores', `<p>Os valores dos serviços serão reajustados a partir de <b>20 de novembro de 2026</b>.</p>`)}
    ${item(3, 'Confirmação do horário', `<p>Para garantir o agendamento, é necessário pagar antecipadamente um sinal de <b>R$ 50,00</b>. O restante é pago no dia do atendimento.</p>`)}
    ${item(4, 'Horários extras', `<p>Os atendimentos das <b>7h e 8h</b> têm taxa adicional de <b>R$ 20,00</b>, paga junto com o sinal. Os horários das <b>21h, 22h e 23h</b> também são considerados extras.</p>`)}
  </div>
  <div class="card wine-card" ${T(55, C.vinho)}>
    ${bow(404, -30, 66, 12)}
    ${item(5, 'Cancelamentos e reagendamentos', `<p>Em caso de cancelamento, desistência ou falta, <b>o sinal não será reembolsado</b>.</p><p>Para reagendar, avise com <b>pelo menos 24 horas de antecedência</b>. A nova data dependerá da disponibilidade da agenda.</p>`)}
  </div>
  ${nav(3)}
</section>`;

// ---------- PÁGINA 4 — VALORES ----------
const servicos = D.servicos || [];
let linhas = '';
if (servicos.length) {
  linhas = servicos.map((s) => `<div class="srow"><div class="sname"><b>${esc(s.nome)}</b>${s.info ? `<small>${esc(s.info)}</small>` : ''}</div><i></i><div class="sval">${esc(s.valor)}</div></div>`).join('');
} else {
  for (let i = 0; i < (D.linhas_vazias_tabela || 7); i++) linhas += `<div class="srow empty"><div class="sname"></div><i></i><div class="sval"></div></div>`;
}
const p4 = `<section class="page inner ${servicos.length > 7 ? 'dense' : ''} ${servicos.length > 10 ? 'xdense' : ''}" id="p4">
  ${frame()}
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(-14, -18, 120, 34, 41, { op: .75 })}${sprig(554, -18, 120, 146, 42, { op: .75, flip: true })}</svg>
  ${header('✦ &nbsp;Serviços &amp; valores&nbsp; ✦', 'Seu momento<br>de beleza', 'tree', 'two')}
  <p class="lead">Confira nossos serviços e valores.</p>
  <div class="card menu-card" ${T(81)}>
    ${bow(-22, -26, 56, -16)}
    <div class="thead"><span>Procedimento</span><span>Valor</span></div>
    <div class="tbody">${linhas}</div>
    ${servicos.length ? '' : '<p class="soon-menu">Serviços e valores atualizados em breve.</p>'}
  </div>
  <div class="thanks">
    <p class="ty">“Obrigada por escolher meu trabalho. Será um prazer cuidar de você neste fim de ano!” ${ICON.heart}</p>
    <div class="sig">Mayara Dias</div>
    <div class="brand dark">Studio Beauty</div>
    <a class="wa" href="${esc(D.whatsapp_link)}">WhatsApp: ${esc(D.whatsapp_exibicao)}</a>
  </div>
  ${nav(4)}
</section>`;

// ---------- CSS ----------
const fontsCss = fs.readFileSync(path.join(DIR, 'fonts/fonts.css'), 'utf8').replace(/url\('([^']+)'\)/g, (_, fn) => `url('${dataUri(path.join(DIR, 'fonts', fn), 'font/ttf')}')`);
const tex = dataUri(path.join(DIR, 'assets/textura-papel.png'), 'image/png');
const SERIF = "'Cormorant Garamond', serif", SANS = "'Montserrat', sans-serif", SCRIPT = "'Pinyon Script', cursive";
const CSS = `${fontsCss}
@page { size: 540px 960px; margin: 0; }
@media screen {
  html.view, html.view body { background: #E4D3C3; }
  html.view body { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 28px 0 40px; }
  html.view .page { box-shadow: 0 10px 30px rgba(89,55,40,.28); flex: none; }
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: ${C.bege}; }
body { font-family: ${SANS}; color: ${C.marrom}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: inherit; text-decoration: none; }
.page { position: relative; width: 540px; height: 960px; overflow: hidden; break-after: page; page-break-after: always; display: flex; flex-direction: column; align-items: center; padding: 0 44px; }
.page:last-child { break-after: auto; page-break-after: auto; }
.page > * { position: relative; z-index: 2; }
.abs { position: absolute !important; }
.page > .abs { z-index: 3; }
.sprigs { z-index: 1 !important; }
.bow { z-index: 6; }
.ico { width: .78em; height: .78em; vertical-align: -.02em; margin-left: .12em; overflow: visible; }

/* moldura dupla dourada */
.frame { position: absolute !important; inset: 18px; border: 1px solid rgba(198,163,106,.85); z-index: 1 !important; }
.frame::after { content: ''; position: absolute; inset: 5px; border: .6px solid rgba(198,163,106,.45); }
.corners { position: absolute !important; inset: 0; z-index: 4 !important; }

/* páginas internas */
.inner { background: ${C.bege} url('${tex}'); }
.kicker { margin-top: 62px; font-weight: 600; font-size: 10.5px; letter-spacing: 4px; text-transform: uppercase; color: ${C.ouroEsc}; }
.title { font-family: ${SERIF}; font-weight: 600; font-size: 40px; line-height: 1; letter-spacing: 1.2px; text-transform: uppercase; color: ${C.vinho}; text-align: center; margin: 10px 0 10px; }
.title.two { font-size: 39px; line-height: .98; }
.title.one { font-size: 35px; white-space: nowrap; }
.orn { display: block; flex: none; }
.lead { font-family: ${SERIF}; font-style: italic; font-weight: 500; font-size: 20px; text-align: center; margin-top: 8px; color: ${C.marrom}; }
.card { position: relative; width: 452px; }
.card > *:not(.abs):not(.paper) { position: relative; z-index: 2; }
.card > .abs { z-index: 4; }
.paper { position: absolute; z-index: 0; overflow: visible; }
h3 { font-family: ${SANS}; font-weight: 600; font-size: 10.5px; letter-spacing: 2.6px; text-transform: uppercase; color: ${C.vinho}; }

/* capa */
.cover { background: radial-gradient(ellipse 80% 60% at 50% 32%, #A12A3A 0%, ${C.vinho} 48%, #5C0F19 100%); color: ${C.off}; }
.cover::before { content: ''; position: absolute; inset: 0; background: url('${tex}'); opacity: .55; z-index: 0; }
.kicker.light { margin-top: 56px; color: ${C.dourado}; }
.arch-wrap { position: relative; margin-top: 44px; width: 278px; height: 336px; flex: none; }
.arch-outer { position: absolute; inset: 0; border: 1px solid rgba(198,163,106,.75); border-radius: 139px 139px 6px 6px; padding: 7px; }
.arch { width: 100%; height: 100%; border-radius: 132px 132px 3px 3px; overflow: hidden; border: 1.6px solid ${C.dourado}; background: #6D1520; }
.foto { width: 100%; height: 100%; object-fit: cover; display: block; }
.foto.vazia { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: radial-gradient(circle at 50% 40%, rgba(255,249,242,.10), rgba(255,249,242,0) 70%); font-family: ${SERIF}; font-style: italic; font-size: 20px; color: ${C.dourado}; }
.cover-title { font-family: ${SERIF}; font-weight: 600; font-size: 54px; line-height: .95; letter-spacing: 2px; text-transform: uppercase; text-align: center; margin-top: 32px; color: ${C.off}; }
.script { font-family: ${SCRIPT}; font-size: 40px; line-height: 1.2; color: ${C.dourado}; margin-top: 10px; }
.brand { font-weight: 500; font-size: 11.5px; letter-spacing: 4.5px; text-transform: uppercase; color: ${C.off}; margin: 2px 0 14px; }
.brand span { color: ${C.dourado}; padding: 0 6px; }
.quote { font-family: ${SERIF}; font-style: italic; font-weight: 500; font-size: 21px; line-height: 1.3; text-align: center; margin-top: 14px; max-width: 400px; color: #F6E9DA; }
.cta { margin-top: 28px; display: inline-flex; align-items: center; gap: 10px; padding: 15px 34px; border-radius: 40px; background: linear-gradient(135deg, #E6CF9C 0%, ${C.dourado} 45%, #A8854D 100%);
  color: ${C.vinhoEsc}; font-weight: 700; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; box-shadow: 0 8px 20px rgba(40,5,10,.35); }
.cta span { font-size: 16px; letter-spacing: 0; }
.mini-index { margin-top: 16px; font-weight: 500; font-size: 10.5px; letter-spacing: 2.5px; text-transform: uppercase; color: ${C.dourado}; display: flex; gap: 10px; }
.mini-index i { font-style: normal; }
.mini-index a { border-bottom: .8px solid rgba(198,163,106,.6); padding-bottom: 2px; }

/* calendário */
.cal-card { margin-top: 18px; padding: 10px 18px 14px; }
.cal-head { text-align: center; line-height: 1; }
.cal-head .mes { font-family: ${SCRIPT}; font-size: 36px; color: ${C.vinho}; }
.cal-head .ano { font-weight: 600; font-size: 11px; letter-spacing: 4px; color: ${C.ouroEsc}; margin-left: 10px; vertical-align: 6px; }
.grid { display: grid; grid-template-columns: repeat(7, 1fr); }
.grid.wd { margin-top: 6px; padding-bottom: 7px; border-bottom: 1px solid ${C.dourado}; }
.grid.wd div { text-align: center; font-weight: 600; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${C.ouroEsc}; }
.cell { position: relative; height: 49px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: .6px solid rgba(198,163,106,.38); }
.cell b { font-family: ${SERIF}; font-weight: 600; font-size: 23px; line-height: 1; color: ${C.marrom}; }
.cell small { font-weight: 600; font-size: 7.5px; letter-spacing: .6px; text-transform: uppercase; margin-top: 3px; line-height: 1; }
.cell.domingo b { color: #B9A18D; font-weight: 500; font-style: italic; }
.cell.fechado b { width: 32px; height: 32px; border-radius: 50%; background: ${C.vinho}; color: ${C.off}; display: flex; align-items: center; justify-content: center; font-size: 19px; box-shadow: 0 0 0 1.5px ${C.off}, 0 0 0 2.4px ${C.dourado}; }
.cell.fechado small { color: ${C.vinho}; margin-top: 4px; }
.cell.vagas small { color: ${C.ouroEsc}; }
.cell.poucas small { color: ${C.vinho}; }
.cell.lotado b { color: #B9A18D; text-decoration: line-through; text-decoration-thickness: 1px; }
.cell.lotado small { color: #9A826F; }
.legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 18px; margin-top: 12px; font-size: 11.5px; color: ${C.marrom}; }
.legend span { display: inline-flex; align-items: center; gap: 7px; }
.legend b { font-weight: 600; color: ${C.vinho}; }
.lg { display: inline-block; width: 11px; height: 11px; border-radius: 50%; flex: none; }
.lg.fechado { background: ${C.vinho}; box-shadow: 0 0 0 1px ${C.dourado}; }
.lg.domingo { border: 1px solid #B9A18D; }
.lg.vagas { background: ${C.dourado}; }
.lg.poucas { border: 1.5px solid ${C.vinho}; }
.lg.lotado { background: #D9C8B8; }

/* horários */
.hours-card { margin-top: 16px; padding: 18px 20px 14px; }
.hcols { display: grid; grid-template-columns: 1fr 1.15fr; gap: 22px; }
.hcols h3 { padding-bottom: 7px; border-bottom: .8px solid ${C.dourado}; margin-bottom: 8px; }
.soon { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding-top: 4px; }
.soon em { font-family: ${SERIF}; font-style: italic; font-weight: 500; font-size: 24px; color: ${C.vinho}; }
.soon span { font-size: 11.5px; line-height: 1.4; color: #7D5E4D; }
.times { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px 6px; }
.times span { font-family: ${SERIF}; font-weight: 600; font-size: 19px; }
.ld { display: flex; align-items: baseline; gap: 6px; padding: 2px 0; }
.ld b { font-family: ${SERIF}; font-weight: 600; font-size: 19px; color: ${C.marrom}; }
.ld i { flex: 1; border-bottom: 1.2px dotted ${C.dourado}; transform: translateY(-4px); }
.ld span { font-size: 11.5px; font-weight: 500; color: ${C.vinho}; }
.fine { margin-top: 10px; padding-top: 9px; border-top: .6px solid rgba(198,163,106,.5); font-size: 11.5px; line-height: 1.5; color: #6E4D3D; }
.fine b { font-weight: 600; color: ${C.vinho}; }
.note { margin-top: 14px; max-width: 400px; text-align: center; font-family: ${SERIF}; font-style: italic; font-weight: 500; font-size: 17px; line-height: 1.3; }
.pd-card { margin-top: 12px; padding: 10px 14px 8px; }
.pd-card h3 { margin-bottom: 5px; padding-bottom: 4px; border-bottom: .8px solid ${C.dourado}; }
.pd-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; grid-auto-flow: column; gap: 0 12px; }
.pd { font-size: 9.5px; line-height: 1.25; display: flex; gap: 5px; border-bottom: .6px dotted rgba(198,163,106,.7); padding: 2px 0; }
.pd b { color: ${C.vinho}; white-space: nowrap; font-weight: 600; }

/* modo compacto: ativado quando há disponibilidade por dia em dados.json */
.compact .kicker { margin-top: 50px; }
.compact .title { font-size: 34px; margin: 6px 0 6px; }
.compact .cal-card { margin-top: 12px; padding: 4px 16px 10px; }
.compact .cal-head .mes { font-size: 28px; }
.compact .cell { height: 39px; }
.compact .cell b { font-size: 18px; }
.compact .cell.fechado b { width: 25px; height: 25px; font-size: 15px; }
.compact .cell small { font-size: 6.8px; margin-top: 2px; }
.compact .legend { margin-top: 8px; font-size: 10.5px; gap: 4px 12px; }
.compact .hours-card { margin-top: 10px; padding: 12px 16px 10px; }
.compact .hcols h3 { margin-bottom: 4px; padding-bottom: 4px; }
.compact .times span, .compact .ld b { font-size: 16px; }
.compact .ld { padding: 0; }
.compact .fine { margin-top: 6px; padding-top: 6px; font-size: 10.5px; }

/* regras */
.rules-card { margin-top: 16px; padding: 6px 22px 6px; }
.ri { display: grid; grid-template-columns: 46px 1fr; gap: 6px; padding: 13px 0 12px; }
.ri + .ri { border-top: .6px solid rgba(198,163,106,.6); }
.rn { font-family: ${SERIF}; font-weight: 600; font-size: 30px; line-height: .9; color: ${C.dourado}; }
.ri h3 { margin-bottom: 6px; }
.ri p { font-size: 13px; line-height: 1.55; color: #5F3E2F; }
.ri p + p { margin-top: 4px; }
.ri p b { font-weight: 600; color: ${C.vinho}; }
.dates { display: flex; align-items: center; gap: 22px; }
.dates div { display: flex; flex-direction: column; }
.dates b { font-family: ${SERIF}; font-weight: 600; font-size: 32px; line-height: 1; color: ${C.vinho}; }
.dates span { font-weight: 500; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${C.ouroEsc}; margin-top: 3px; }
.dates i { width: 1px; height: 34px; background: ${C.dourado}; }
.wine-card { margin-top: 16px; padding: 4px 22px 4px; color: ${C.off}; }
.wine-card h3 { color: ${C.dourado}; }
.wine-card .ri p { color: #F6E9DA; }
.wine-card .ri p b { color: #F2DDAE; }

/* valores */
.menu-card { margin-top: 18px; padding: 20px 24px 16px; }
.thead { display: flex; justify-content: space-between; font-weight: 600; font-size: 10.5px; letter-spacing: 2.6px; text-transform: uppercase; color: ${C.vinho}; padding-bottom: 8px; border-bottom: 1px solid ${C.dourado}; }
.srow { display: flex; align-items: flex-end; gap: 8px; padding: 10px 0 6px; min-height: 42px; }
.srow > i { flex: 1; border-bottom: 1.2px dotted ${C.dourado}; transform: translateY(-6px); min-width: 20px; }
.sname b { font-family: ${SERIF}; font-weight: 600; font-size: 20px; line-height: 1.1; display: block; }
.sname small { font-size: 11px; font-style: italic; color: #7D5E4D; display: block; margin-top: 1px; }
.sval { font-family: ${SERIF}; font-weight: 700; font-size: 20px; color: ${C.vinho}; white-space: nowrap; }
.srow.empty > i { border-bottom-style: solid; border-bottom-width: .6px; border-color: rgba(198,163,106,.55); transform: translateY(-2px); }
.soon-menu { margin-top: 12px; text-align: center; font-family: ${SERIF}; font-style: italic; font-weight: 500; font-size: 18px; color: ${C.vinho}; }
.thanks { margin-top: 20px; width: 430px; text-align: center; display: flex; flex-direction: column; align-items: center; }
.ty { font-family: ${SERIF}; font-style: italic; font-weight: 500; font-size: 19px; line-height: 1.3; }
.sig { font-family: ${SCRIPT}; font-size: 38px; line-height: 1.15; color: ${C.vinho}; margin-top: 6px; }
.brand.dark { color: ${C.ouroEsc}; margin: 0; font-size: 10.5px; }
.wa { margin-top: 10px; font-weight: 600; font-size: 13.5px; letter-spacing: 1px; color: ${C.marrom}; border-bottom: 1px solid ${C.dourado}; padding-bottom: 2px; }
.dense .kicker { margin-top: 54px; }
.dense .title.two { font-size: 34px; margin: 6px 0; }
.dense .lead { margin-top: 4px; font-size: 18px; }
.dense .menu-card { margin-top: 12px; padding: 14px 22px 10px; }
.dense .srow { min-height: 0; padding: 6px 0 4px; }
.dense .sname b, .dense .sval { font-size: 17px; }
.dense .thanks { margin-top: 12px; }
.dense .ty { font-size: 16px; }
.dense .sig { font-size: 30px; margin-top: 2px; }
.xdense .srow { padding: 3px 0 2px; }
.xdense .sname small { display: inline; margin-left: 6px; }
.xdense .ty { display: none; }

/* navegação */
.nav { position: absolute !important; left: 40px; right: 40px; bottom: 36px; height: 48px; z-index: 10 !important; display: flex; align-items: center; justify-content: space-between;
  border-top: .8px solid ${C.dourado}; border-bottom: .8px solid ${C.dourado}; }
.nbtn { font-weight: 600; font-size: 10.5px; letter-spacing: 2px; text-transform: uppercase; padding: 9px 6px; white-space: nowrap; color: ${C.marrom}; }
.nbtn.solid { background: ${C.vinho}; color: ${C.off}; padding: 10px 16px; border-radius: 30px; }
.dots { display: flex; gap: 4px; }
.dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: ${SERIF}; font-weight: 600; font-size: 16px; color: ${C.ouroEsc}; }
.dot.on { background: ${C.dourado}; color: ${C.off}; }
`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Agenda de Natal 2026 — Mayara Dias | Studio Beauty</title><style>${CSS}</style></head><body>${DEFS}${p1}${p2}${p3}${p4}</body></html>`;
fs.mkdirSync(path.join(DIR, 'build'), { recursive: true });
fs.writeFileSync(path.join(DIR, 'build', 'agenda.html'), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
// papel com borda "deckle" (rasgada fina), ajustado ao tamanho real de cada cartão
await page.evaluate(() => {
  const rng = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const ff = (n) => Math.round(n * 10) / 10;
  document.querySelectorAll('[data-torn]').forEach((el) => {
    const w = el.offsetWidth, h = el.offsetHeight, r = rng(+el.dataset.torn), jag = 2.6, step = 4.5, pts = [];
    const edge = (x0, y0, x1, y1, nx, ny) => { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let i = 0; i < n; i++) { const t = i / n, d = r() * jag; pts.push(ff(x0 + (x1 - x0) * t + nx * d) + ',' + ff(y0 + (y1 - y0) * t + ny * d)); } };
    edge(0, 0, w, 0, 0, 1); edge(w, 0, w, h, -1, 0); edge(w, h, 0, h, 0, -1); edge(0, h, 0, 0, 1, 0);
    const d = 'M' + pts.join('L') + 'Z';
    el.insertAdjacentHTML('afterbegin', `<svg class="paper" style="left:0;top:0" width="${w + 8}" height="${h + 10}" viewBox="0 0 ${w + 8} ${h + 10}"><path d="${d}" transform="translate(1.5,4)" fill="rgba(89,55,40,.07)"/><path d="${d}" transform="translate(.6,1.6)" fill="rgba(89,55,40,.10)"/><path d="${d}" fill="${el.dataset.fill}"/></svg>`);
  });
});
// confere se algo transborda a página
const overflow = await page.evaluate(() => [...document.querySelectorAll('.page')].map((p) => {
  const nav = p.querySelector('.nav'); const limite = nav ? nav.getBoundingClientRect().top : p.getBoundingClientRect().bottom - 40;
  const kids = [...p.children].filter((c) => getComputedStyle(c).position !== 'absolute');
  return { id: p.id, folga: Math.round(limite - Math.max(...kids.map((c) => c.getBoundingClientRect().bottom))) };
}));
console.log('Espaço livre acima da navegação (px):', overflow);
if (overflow.some((o) => o.folga < 0)) console.warn('ATENÇÃO: conteúdo passou do limite em', overflow.filter((o) => o.folga < 0).map((o) => o.id).join(', '), '— reduza os textos/linhas em dados.json.');

// versão HTML para visualizar no navegador (mesmo conteúdo do PDF)
const VIEW_SCRIPT = `<script>(function(){if(navigator.webdriver)return;var d=document.documentElement;d.classList.add('view');function fit(){var z=Math.min(1,(window.innerWidth-16)/540);document.querySelectorAll('.page').forEach(function(p){p.style.zoom=z;});}fit();window.addEventListener('resize',fit);})();<\/script>`;
fs.writeFileSync(OUT.replace(/\.pdf$/i, '.html'), (await page.content()).replace('</body>', VIEW_SCRIPT + '</body>'));

await page.pdf({ path: OUT, width: '540px', height: '960px', printBackground: true, preferCSSPageSize: true });
await browser.close();
try {
  const { execFileSync } = await import('node:child_process');
  console.log(execFileSync('python3', [path.join(DIR, 'pos_processar.py'), OUT], { encoding: 'utf8' }).trim());
} catch (e) { console.warn('Aviso: pós-processamento não executado (requer python3 + pypdf). Os links continuam funcionando.', e.message); }
console.log('PDF gerado:', OUT, temFoto ? '(com foto)' : '(SEM foto — coloque o arquivo em ' + D.foto + ')');
