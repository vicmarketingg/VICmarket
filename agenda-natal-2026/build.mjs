// Gera o PDF "Agenda de Natal 2026 — Mayara Dias | Studio Beauty" (identidade editorial de luxo).
// Uso:  node build.mjs [dados.json] [saida.pdf]
// Edite dados.json (horários, vagas, serviços) e rode de novo. Gera também a versão .html.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gerarConvite } from './convite.mjs';

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
const ehDomingo = (d) => (offsetSeg + d - 1) % 7 === 6;
const tipoDia = (d) => (semAtendSet.has(d) || ehDomingo(d) ? 'fechado' : 'aberto'); // domingos: sem atendimento
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
  _camera: `<svg width="46" height="40" viewBox="0 0 44 38"><rect x="2" y="8" width="40" height="28" rx="5" fill="none" stroke="${C.dourado}" stroke-width="1.6"/><path d="M14 8 l3-6 h10 l3 6" fill="none" stroke="${C.dourado}" stroke-width="1.6"/><circle cx="22" cy="22" r="8" fill="none" stroke="${C.dourado}" stroke-width="1.6"/></svg>`,
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
  const foot = page < 4 ? `<span>${page} / 4</span><em>arraste para o lado →</em>` : `<span>4 / 4</span><em>Agende pelo WhatsApp ${esc(D.whatsapp_exibicao)}</em>`;
  return `<nav class="nav">${prev}<a class="nbtn" href="#p1">Capa</a><span class="dots">${dots}</span>${next}</nav><div class="imgfoot">${foot}</div>`;
}
const frame = (dark = false) => `<div class="frame ${dark ? 'dark' : ''}"></div><div class="corners">${spark(10, 10, 20)}${spark(510, 10, 20)}${spark(10, 930, 20)}${spark(510, 930, 20)}</div>`;
const header = (kicker, title, icon, extraCls = '') => `<div class="kicker">${kicker}</div><h2 class="title ${extraCls}">${title} ${ICON[icon] || icon}</h2>${orn(170)}`;

// ---------- PÁGINA 1 — CAPA ----------
// enfeite central da capa: bola de Natal em traço dourado (sem logo)
const enfeite = `<div class="mono"><svg class="bauble" viewBox="0 0 120 156" width="128" height="166">
  <line x1="60" y1="0" x2="60" y2="20" stroke="url(#goldLine)" stroke-width="1.1"/>
  <path d="M55 20 C55 13 65 13 65 20" fill="none" stroke="url(#gold)" stroke-width="1.4"/>
  <rect x="49" y="20" width="22" height="13" rx="2.5" fill="none" stroke="url(#gold)" stroke-width="1.5"/>
  <line x1="53" y1="20" x2="53" y2="33" stroke="url(#gold)" stroke-width=".7"/><line x1="60" y1="20" x2="60" y2="33" stroke="url(#gold)" stroke-width=".7"/><line x1="67" y1="20" x2="67" y2="33" stroke="url(#gold)" stroke-width=".7"/>
  <circle cx="60" cy="92" r="58" fill="rgba(255,249,242,.04)" stroke="url(#gold)" stroke-width="1.6"/>
  <path d="M5 80 Q60 98 115 80" fill="none" stroke="url(#goldLine)" stroke-width="1"/>
  <path d="M3 100 Q60 118 117 100" fill="none" stroke="url(#goldLine)" stroke-width="1"/>
  <path d="M14 60 Q60 74 106 60" fill="none" stroke="url(#goldLine)" stroke-width=".6" opacity=".7"/>
  <path d="M14 124 Q60 138 106 124" fill="none" stroke="url(#goldLine)" stroke-width=".6" opacity=".7"/>
  ${[20, 40, 60, 80, 100].map((x, i) => sparkle(x, 90 + (i % 2 ? 1 : -1) + Math.abs(x - 60) * -0.02, i === 2 ? 6 : 4)).join('')}
  <path d="M28 52 Q38 40 52 37" fill="none" stroke="#FFF9F2" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
</svg><div class="mono-orn">${orn(120)}</div></div>`;

const p1 = `<section class="page cover" id="p1">
  ${frame(true)}
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(-14, -18, 150, 32, 11)}${sprig(-24, 40, 110, 58, 12, { berries: false, op: .7 })}</svg>
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(554, -18, 150, 148, 13, { flip: true })}${sprig(564, 40, 110, 122, 14, { berries: false, op: .7, flip: true })}</svg>
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(-14, 930, 140, -30, 15, { flip: true })}${sprig(554, 930, 140, 210, 16)}</svg>
  ${spark(66, 150, 12, .9)}${spark(462, 214, 16, .9)}${spark(452, 520, 12, .8)}${spark(72, 600, 14, .8)}

  <div class="kicker light">✦ &nbsp;Mayara Dias · Studio Beauty&nbsp; ✦</div>
  <div class="arch-wrap">
    <div class="arch-outer"><div class="arch">${enfeite}</div></div>
    ${bow(70, -38, 96, 0)}
  </div>
  <h1 class="lockup"><span class="lk-a">Agenda</span><span class="lk-b">de Dezembro</span><span class="lk-c"><i></i>2026<i></i></span></h1>
  <p class="quote">“Seu momento de beleza para as festas<br>começa aqui!”</p>
  <a class="cta" href="#p2">Abrir agenda <span>→</span></a>
  <div class="mini-index"><a href="#p2">Regras</a><i>·</i><a href="#p3">Calendário</a><i>·</i><a href="#p4">Valores</a></div>
  <div class="swipe">Arraste para ver a agenda <span>→</span></div>
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
const domingos = []; for (let d = 1; d <= diasNoMes; d++) if (ehDomingo(d)) domingos.push(d);
const juntar = (a) => (a.length > 1 ? a.slice(0, -1).join(', ') + ' e ' + a.at(-1) : a.join(''));
const outrosFechados = semAtend.filter((d) => !ehDomingo(d)).map(fmtDia);
const txtSem = `domingos (${juntar(domingos.map(String))}/12)${outrosFechados.length ? ' e ' + juntar(outrosFechados) : ''}`;
const legenda = `<div class="legend">
  <span><i class="lg fechado"></i><b>Sem atendimento:</b> ${txtSem}</span>
  ${usaDisp ? '<span><i class="lg vagas"></i>vagas</span><span><i class="lg poucas"></i>poucas vagas</span><span><i class="lg lotado"></i>lotado</span>' : ''}
</div>`;

const H = D.horario_atendimento || {};
const listaTxt = (a) => (a.length > 1 ? a.slice(0, -1).join(', ') + ' e ' + a.at(-1) : a.join(''));
// horarios_extras: grupos [{ horas: [...], taxa?: 'R$ 20,00', obs?: '...' }]
const gruposExtras = (Array.isArray(D.horarios_extras) ? D.horarios_extras : []).filter((g) => (g.horas || []).length);
const extrasTxt = gruposExtras.length > 0;
const extrasQuadro = gruposExtras.map((g) => `<div class="hx"><b>${esc(listaTxt(g.horas))}</b>${g.taxa ? `<em>+ ${esc(g.taxa)}</em>` : '<em class="sem">extra</em>'}</div>`).join('');
const mesmaTaxa = gruposExtras.length > 1 && gruposExtras.every((g) => g.taxa && g.taxa === gruposExtras[0].taxa);
const extrasRegra = mesmaTaxa
  ? `Os horários das <b>${esc(listaTxt(gruposExtras.flatMap((g) => g.horas)))}</b> são extras, com taxa de <b>${esc(gruposExtras[0].taxa)}</b> para agendar${gruposExtras.find((g) => g.obs) ? `, ${esc(gruposExtras.find((g) => g.obs).obs)}` : ''}.`
  : gruposExtras.map((g, i) => g.taxa
  ? `Os horários das <b>${esc(listaTxt(g.horas))}</b> são extras, com taxa de <b>${esc(g.taxa)}</b> para agendar${g.obs ? `, ${esc(g.obs)}` : ''}.`
  : `Os horários das <b>${esc(listaTxt(g.horas))}</b> ${i ? 'também ' : ''}são horários extras.`).join(' ');
const normais = H.inicio
  ? `<div class="hours-main"><span class="hdias">${esc(H.dias || 'Segunda a sábado')}</span><b>${esc(H.inicio)} <i>às</i> ${esc(H.fim)}</b></div>${extrasTxt ? `<div class="hours-extra"><span>Horários extras</span><div class="hxs">${extrasQuadro}</div></div>` : ''}`
  : `<div class="soon"><em>Em breve</em><span>os horários serão divulgados aqui</span></div>`;

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

const pCal = `<section class="page inner pg-cal ${usaDisp ? 'compact' : ''}" id="p3">
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
    <h3 class="hh">Horários de atendimento</h3>${normais}
  </div>
  ${porDia}
  ${nav(3)}
</section>`;

// ---------- PÁGINA 3 — REGRAS ----------
const item = (n, title, body) => `<div class="ri"><div class="rn">${String(n).padStart(2, '0')}</div><div><h3>${title}</h3>${body}</div></div>`;
const pRegras = `<section class="page inner pg-regras" id="p2">
  ${frame()}
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(-14, -18, 120, 34, 31, { op: .75 })}${sprig(554, -18, 120, 146, 32, { op: .75, flip: true })}</svg>
  ${header('✦ &nbsp;Antes de agendar&nbsp; ✦', 'Alguns detalhes<br>importantes', 'heart', 'two')}
  <p class="lead">“Sem mil regras, só organização e bom senso.”</p>
  <div class="card rules-card" ${T(51)}>
    ${item(1, 'Reajuste de valores', `<p>Os valores dos serviços serão reajustados a partir de <b>20 de novembro de 2026</b>.</p>`)}
    ${item(2, 'Confirmação do horário', `<p>Para garantir o agendamento, é necessário pagar antecipadamente um sinal de <b>R$ 50,00</b>. O restante é pago no dia do atendimento.</p>`)}
    ${extrasTxt ? item(3, 'Horários extras', `<p>${extrasRegra}</p>`) : ''}
  </div>
  <div class="card wine-card" ${T(55, C.vinho)}>
    ${bow(404, -30, 66, 12)}
    ${item(extrasTxt ? 4 : 3, 'Cancelamentos e reagendamentos', `<p>Em caso de cancelamento, desistência ou falta, <b>o sinal não será reembolsado</b>.</p><p>Para reagendar, avise com <b>pelo menos 24 horas de antecedência</b>. A nova data dependerá da disponibilidade da agenda.</p>`)}
  </div>
  ${nav(2)}
</section>`;

// ---------- PÁGINA 4 — VALORES ----------
const servicos = D.servicos || [];
let linhas = '';
if (servicos.length) {
  let secao = null;
  linhas = servicos.map((sv) => {
    let h = '';
    if (sv.secao && sv.secao !== secao) { secao = sv.secao; h += `<div class="ssec"><span>${esc(secao)}</span></div>`; }
    const valor = Array.isArray(sv.precos) && sv.precos.length
      ? `<div class="svals">${sv.precos.map((pr) => `<span><em>${esc(pr.rotulo)}</em>${esc(pr.valor)}</span>`).join('')}</div>`
      : `<div class="sval">${esc(sv.valor)}</div>`;
    return h + `<div class="srow"><div class="sname"><b>${esc(sv.nome).replace(/ \+ /g, ' <span class="plus">+</span> ')}</b>${sv.info ? `<small>${esc(sv.info)}</small>` : ''}</div><i></i>${valor}</div>`;
  }).join('');
} else {
  for (let i = 0; i < (D.linhas_vazias_tabela || 7); i++) linhas += `<div class="srow empty"><div class="sname"></div><i></i><div class="sval"></div></div>`;
}
const p4 = `<section class="page inner" id="p4">
  ${frame()}
  <svg class="abs sprigs" style="left:0;top:0" width="540" height="960" viewBox="0 0 540 960">${sprig(-14, -18, 120, 34, 41, { op: .75 })}${sprig(554, -18, 120, 146, 42, { op: .75, flip: true })}</svg>
  ${header('✦ &nbsp;Valores de dezembro&nbsp; ✦', 'Seu momento<br>de beleza', 'tree', 'two')}
  <p class="lead">Confira nossos serviços e valores.</p>
  <div class="card menu-card" ${T(81)}>
    ${bow(-36, -40, 56, -16)}
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
const SERIF = "'Bodoni Moda', serif", SANS = "'Jost', sans-serif", SCRIPT = "'Bodoni Moda', serif"; // itálico da Bodoni no lugar de fonte cursiva
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

/* ornamentos não bloqueiam toques nos botões */
.abs, .frame, .corners, .paper, .sprigs, .bow { pointer-events: none; }
/* moldura dupla dourada */
.frame { position: absolute !important; inset: 18px; border: 1px solid rgba(198,163,106,.85); z-index: 1 !important; }
.frame::after { content: ''; position: absolute; inset: 5px; border: .6px solid rgba(198,163,106,.45); }
.corners { position: absolute !important; inset: 0; z-index: 4 !important; }

/* páginas internas */
.inner { background: ${C.bege} url('${tex}'); }
.kicker { margin-top: 62px; font-weight: 500; font-size: 11.5px; letter-spacing: 4px; text-transform: uppercase; color: ${C.ouroEsc}; }
.title { font-family: ${SERIF}; font-weight: 500; font-size: 34px; line-height: 1.05; letter-spacing: .5px; text-transform: uppercase; color: ${C.vinho}; text-align: center; margin: 10px 0 10px; }
.title.two { font-size: 33px; line-height: 1.08; }
.title.one { font-size: 29px; white-space: nowrap; }
.orn { display: block; flex: none; }
.lead { font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: 16.5px; text-align: center; margin-top: 8px; color: ${C.marrom}; }
.card { position: relative; width: 452px; }
.card > *:not(.abs):not(.paper) { position: relative; z-index: 2; }
.card > .abs { z-index: 4; }
.paper { position: absolute; z-index: 0; overflow: visible; }
h3 { font-family: ${SANS}; font-weight: 500; font-size: 11.5px; letter-spacing: 2.8px; text-transform: uppercase; color: ${C.vinho}; }

/* capa */
.cover { background: radial-gradient(ellipse 80% 60% at 50% 32%, #A12A3A 0%, ${C.vinho} 48%, #5C0F19 100%); color: ${C.off}; }
.cover::before { content: ''; position: absolute; inset: 0; background: url('${tex}'); opacity: .55; z-index: 0; }
.kicker.light { margin-top: 76px; color: ${C.dourado}; }
.arch-wrap { position: relative; margin-top: 62px; width: 236px; height: 276px; flex: none; }
.arch-outer { position: absolute; inset: 0; border: 1px solid rgba(198,163,106,.75); border-radius: 118px 118px 6px 6px; padding: 7px; }
.arch { width: 100%; height: 100%; border-radius: 111px 111px 3px 3px; overflow: hidden; border: 1.6px solid ${C.dourado}; background: #6D1520; }
.mono { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 30px; background: radial-gradient(ellipse 70% 55% at 50% 45%, rgba(255,249,242,.09), rgba(255,249,242,0) 70%); }
.mono-l { display: flex; align-items: center; gap: 12px; font-family: ${SERIF}; font-weight: 500; font-size: 92px; line-height: 1; color: ${C.off}; }
.mono-l .it { font-style: italic; font-weight: 400; color: ${C.dourado}; }
.mono-l i { width: 1px; height: 68px; background: linear-gradient(${C.dourado}, rgba(198,163,106,.2)); transform: rotate(14deg); }
.mono-orn { margin-top: 14px; }
.bauble { display: block; overflow: visible; }
.mono-sub { font-family: ${SANS}; font-weight: 400; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: ${C.dourado}; margin: 14px 0 10px; }
.mono-sub.sm { font-size: 10px; letter-spacing: 4px; color: rgba(255,249,242,.75); margin: 10px 0 0; }
.lockup { margin-top: 46px; display: flex; flex-direction: column; align-items: center; font-weight: 400; }
.lk-a { font-family: ${SERIF}; font-weight: 500; font-size: 44px; letter-spacing: 15px; margin-right: -15px; text-transform: uppercase; color: ${C.off}; line-height: 1; }
.lk-b { font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: 64px; line-height: 1.05; color: ${C.dourado}; margin-top: 2px; }
.lk-c { display: flex; align-items: center; gap: 14px; font-family: ${SANS}; font-weight: 400; font-size: 13px; letter-spacing: 6px; margin-right: -6px; color: ${C.off}; margin-top: 8px; }
.lk-c i { width: 46px; height: .8px; background: ${C.dourado}; }
.cover-title { font-family: ${SERIF}; font-weight: 500; font-size: 50px; line-height: 1.02; letter-spacing: 1px; text-transform: uppercase; text-align: center; margin-top: 18px; color: ${C.off}; }
.script { font-family: ${SCRIPT}; font-style: italic; font-weight: 400; font-size: 30px; letter-spacing: .5px; line-height: 1.2; color: ${C.dourado}; margin-top: 14px; }
.brand { font-weight: 400; font-size: 12.5px; letter-spacing: 5px; text-transform: uppercase; color: ${C.off}; margin: 8px 0 16px; }
.brand span { color: ${C.dourado}; padding: 0 6px; }
.quote { font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: 17.5px; line-height: 1.45; text-align: center; margin-top: 44px; max-width: 400px; color: #F6E9DA; }
.cta { margin-top: 40px; display: inline-flex; align-items: center; gap: 10px; padding: 15px 34px; border-radius: 40px; background: linear-gradient(135deg, #E6CF9C 0%, ${C.dourado} 45%, #A8854D 100%);
  color: ${C.vinhoEsc}; font-weight: 500; font-size: 14px; letter-spacing: 3.5px; text-transform: uppercase; box-shadow: 0 8px 20px rgba(40,5,10,.35); }
.cta span { font-size: 16px; letter-spacing: 0; }
.mini-index { margin-top: 16px; font-weight: 400; font-size: 11.5px; letter-spacing: 2.5px; text-transform: uppercase; color: ${C.dourado}; display: flex; gap: 10px; }
.mini-index i { font-style: normal; }
.mini-index a { border-bottom: .8px solid rgba(198,163,106,.6); padding-bottom: 2px; }

/* calendário */
.cal-card { margin-top: 18px; padding: 10px 18px 14px; }
.cal-head { text-align: center; line-height: 1; }
.cal-head .mes { font-family: ${SCRIPT}; font-style: italic; font-weight: 400; font-size: 25px; color: ${C.vinho}; }
.cal-head .ano { font-weight: 600; font-size: 11px; letter-spacing: 4px; color: ${C.ouroEsc}; margin-left: 10px; vertical-align: 6px; }
.grid { display: grid; grid-template-columns: repeat(7, 1fr); }
.grid.wd { margin-top: 6px; padding-bottom: 7px; border-bottom: 1px solid ${C.dourado}; }
.grid.wd div { text-align: center; font-weight: 500; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: ${C.ouroEsc}; }
.cell { position: relative; height: 49px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: .6px solid rgba(198,163,106,.38); }
.cell b { font-family: ${SERIF}; font-weight: 500; font-size: 19px; line-height: 1; color: ${C.marrom}; }
.cell small { font-weight: 500; font-size: 8.5px; letter-spacing: .6px; text-transform: uppercase; margin-top: 3px; line-height: 1; }
.cell.domingo b { color: #B9A18D; font-weight: 500; font-style: italic; }
.cell.fechado b { width: 32px; height: 32px; border-radius: 50%; background: ${C.vinho}; color: ${C.off}; display: flex; align-items: center; justify-content: center; font-size: 15px; box-shadow: 0 0 0 1.5px ${C.off}, 0 0 0 2.4px ${C.dourado}; }
.cell.fechado small { color: ${C.vinho}; margin-top: 4px; }
.cell.vagas small { color: ${C.ouroEsc}; }
.cell.poucas small { color: ${C.vinho}; }
.cell.lotado b { color: #B9A18D; text-decoration: line-through; text-decoration-thickness: 1px; }
.cell.lotado small { color: #9A826F; }
.legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 18px; margin-top: 12px; font-size: 12.5px; color: ${C.marrom}; }
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
.hours-main { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.hdias { font-weight: 500; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: ${C.ouroEsc}; }
.hours-main b { font-family: ${SERIF}; font-weight: 500; font-size: 34px; line-height: 1.15; color: ${C.vinho}; }
.hours-main b i { font-style: italic; font-weight: 400; font-size: .62em; color: ${C.ouroEsc}; padding: 0 4px; }
.hours-extra { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: 10px; padding-top: 10px; border-top: .6px solid rgba(198,163,106,.55); }
.hours-extra > span { font-weight: 500; font-size: 11px; letter-spacing: 2.4px; text-transform: uppercase; color: ${C.ouroEsc}; }
.hxs { display: flex; gap: 22px; justify-content: center; }
.hx { display: flex; align-items: baseline; gap: 8px; }
.hx b { font-family: ${SERIF}; font-weight: 600; font-size: 18px; color: ${C.marrom}; }
.hx em { font-style: normal; font-weight: 500; font-size: 12.5px; color: ${C.vinho}; background: rgba(198,163,106,.2); padding: 2px 9px; border-radius: 20px; }
.hx em.sem { background: none; border: .8px solid rgba(198,163,106,.7); color: ${C.ouroEsc}; }
.compact .hours-main b { font-size: 26px; }
.compact .hours-extra { margin-top: 6px; padding-top: 6px; }
.hh { padding-bottom: 7px; border-bottom: .8px solid ${C.dourado}; margin-bottom: 10px; text-align: center; }
.hours-card .soon { align-items: center; text-align: center; }
.hours-card .times { grid-template-columns: repeat(5, 1fr); text-align: center; }
.hcols { display: grid; grid-template-columns: 1fr 1.15fr; gap: 22px; }
.hcols h3 { padding-bottom: 7px; border-bottom: .8px solid ${C.dourado}; margin-bottom: 8px; }
.soon { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding-top: 4px; }
.soon em { font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: 20px; color: ${C.vinho}; }
.soon span { font-size: 12.5px; line-height: 1.4; color: #7D5E4D; }
.times { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px 6px; }
.times span { font-family: ${SERIF}; font-weight: 500; font-size: 16px; }
.ld { display: flex; align-items: baseline; gap: 6px; padding: 2px 0; }
.ld b { font-family: ${SERIF}; font-weight: 500; font-size: 16px; color: ${C.marrom}; }
.ld i { flex: 1; border-bottom: 1.2px dotted ${C.dourado}; transform: translateY(-4px); }
.ld span { font-size: 12.5px; font-weight: 500; color: ${C.vinho}; }
.fine { margin-top: 10px; padding-top: 9px; border-top: .6px solid rgba(198,163,106,.5); font-size: 12.5px; line-height: 1.5; color: #6E4D3D; }
.fine b { font-weight: 600; color: ${C.vinho}; }
.note { margin-top: 14px; max-width: 410px; text-align: center; font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: 14px; line-height: 1.45; }
.pd-card { margin-top: 12px; padding: 10px 14px 8px; }
.pd-card h3 { margin-bottom: 5px; padding-bottom: 4px; border-bottom: .8px solid ${C.dourado}; }
.pd-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; grid-auto-flow: column; gap: 0 12px; }
.pd { font-size: 10.5px; line-height: 1.25; display: flex; gap: 5px; border-bottom: .6px dotted rgba(198,163,106,.7); padding: 2px 0; }
.pd b { color: ${C.vinho}; white-space: nowrap; font-weight: 600; }

/* modo compacto: ativado quando há disponibilidade por dia em dados.json */
.compact .kicker { margin-top: 50px; }
.compact .title { font-size: 27px; margin: 6px 0 6px; }
.compact .cal-card { margin-top: 12px; padding: 4px 16px 10px; }
.compact .cal-head .mes { font-size: 21px; }
.compact .cell { height: 39px; }
.compact .cell b { font-size: 15px; }
.compact .cell.fechado b { width: 25px; height: 25px; font-size: 12px; }
.compact .cell small { font-size: 6.8px; margin-top: 2px; }
.compact .legend { margin-top: 8px; font-size: 10.5px; gap: 4px 12px; }
.compact .hours-card { margin-top: 10px; padding: 12px 16px 10px; }
.compact .hcols h3 { margin-bottom: 4px; padding-bottom: 4px; }
.compact .times span, .compact .ld b { font-size: 13.5px; }
.compact .ld { padding: 0; }
.compact .fine { margin-top: 6px; padding-top: 6px; font-size: 10.5px; }

/* regras */
.rules-card { margin-top: 16px; padding: 6px 22px 6px; }
.ri { display: grid; grid-template-columns: 46px 1fr; gap: 6px; padding: 13px 0 12px; }
.ri + .ri { border-top: .6px solid rgba(198,163,106,.6); }
.rn { font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: 26px; line-height: 1; color: ${C.dourado}; }
.ri h3 { margin-bottom: 6px; }
.ri p { font-size: 14px; line-height: 1.55; color: #5F3E2F; }
.ri p + p { margin-top: 4px; }
.ri p b { font-weight: 600; color: ${C.vinho}; }
.dates { display: flex; align-items: center; gap: 22px; }
.dates div { display: flex; flex-direction: column; }
.dates b { font-family: ${SERIF}; font-weight: 500; font-size: 26px; line-height: 1; color: ${C.vinho}; }
.dates span { font-weight: 500; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: ${C.ouroEsc}; margin-top: 3px; }
.dates i { width: 1px; height: 34px; background: ${C.dourado}; }
.wine-card { margin-top: 16px; padding: 4px 22px 4px; color: ${C.off}; }
.wine-card h3 { color: ${C.dourado}; }
.wine-card .ri p { color: #F6E9DA; }
.wine-card .ri p b { color: #F2DDAE; }

/* valores */
.menu-card { margin-top: 18px; padding: 20px 24px 16px; }
.thead { display: flex; justify-content: space-between; font-weight: 500; font-size: 11.5px; letter-spacing: 2.6px; text-transform: uppercase; color: ${C.vinho}; padding-bottom: 8px; border-bottom: 1px solid ${C.dourado}; }
.srow { display: flex; align-items: flex-end; gap: 8px; padding: 10px 0 6px; min-height: 42px; }
.srow > i { flex: 1; border-bottom: 1.2px dotted ${C.dourado}; transform: translateY(-6px); min-width: 20px; }
.sname b { font-family: ${SERIF}; font-weight: 500; font-size: 16.5px; line-height: 1.1; display: block; }
.sname small { font-size: 11px; font-style: italic; color: #7D5E4D; display: block; margin-top: 1px; }
.sval { font-family: ${SERIF}; font-weight: 600; font-size: 16.5px; color: ${C.vinho}; white-space: nowrap; }
.plus { font-family: ${SANS}; font-weight: 300; font-size: .9em; }
.svals { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
.svals span { font-family: ${SERIF}; font-weight: 600; font-size: 15.5px; color: ${C.vinho}; white-space: nowrap; line-height: 1.25; }
.svals em { font-family: ${SANS}; font-style: normal; font-weight: 400; font-size: 10px; letter-spacing: 1.6px; text-transform: uppercase; color: ${C.ouroEsc}; margin-right: 8px; }
.dense .svals span { font-size: 13.5px; }
.ssec { display: flex; align-items: center; gap: 10px; margin: 12px 0 2px; font-family: ${SERIF}; font-style: italic; font-size: 17px; color: ${C.ouroEsc}; }
.ssec::after { content: ''; flex: 1; height: .6px; background: rgba(198,163,106,.6); }
.dense .ssec { margin: 8px 0 0; font-size: 15px; }
.srow.empty > i { border-bottom-style: solid; border-bottom-width: .6px; border-color: rgba(198,163,106,.55); transform: translateY(-2px); }
.soon-menu { margin-top: 14px; text-align: center; font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: 15px; color: ${C.vinho}; }
.thanks { margin-top: 20px; width: 430px; text-align: center; display: flex; flex-direction: column; align-items: center; }
.ty { font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: 15.5px; line-height: 1.5; }
.sig { font-family: ${SCRIPT}; font-style: italic; font-weight: 400; font-size: 28px; line-height: 1.2; color: ${C.vinho}; margin-top: 10px; }
.brand.dark { color: ${C.ouroEsc}; margin: 6px 0 0; font-size: 11px; }
.wa { margin-top: 10px; font-weight: 500; font-size: 15px; letter-spacing: 1px; color: ${C.marrom}; border-bottom: 1px solid ${C.dourado}; padding-bottom: 2px; }
.dense .kicker { margin-top: 54px; }
.dense .title.two { font-size: 29px; margin: 6px 0; }
.dense .lead { margin-top: 4px; font-size: 15px; }
.dense .menu-card { margin-top: 12px; padding: 14px 22px 10px; }
.dense .srow { min-height: 0; padding: 6px 0 4px; }
.dense .sname b, .dense .sval { font-size: 14.5px; }
.dense .thanks { margin-top: 12px; }
.dense .ty { font-size: 13.5px; }
.dense .sig { font-size: 23px; margin-top: 4px; }
.xdense .srow { padding: 3px 0 2px; }
.xdense .ssec { margin-top: 6px; }
.xdense .sname small { display: inline; margin-left: 6px; }
.xdense .ty { font-size: 12.5px; line-height: 1.4; }
.xdense .lead { display: none; }

/* versão em imagem (status / stories): sem botões */
.imgfoot, .swipe { display: none !important; }
.imgmode .nav, .imgmode .cta, .imgmode .mini-index { display: none !important; }
.imgmode .imgfoot { display: flex !important; position: absolute !important; left: 40px; right: 40px; bottom: 40px; z-index: 10 !important; align-items: center; justify-content: space-between; padding-top: 12px; border-top: .8px solid ${C.dourado}; }
.imgfoot span { font-family: ${SERIF}; font-weight: 500; font-size: 15px; color: ${C.ouroEsc}; }
.imgfoot em { font-family: ${SANS}; font-style: normal; font-weight: 500; font-size: 11.5px; letter-spacing: 2.4px; text-transform: uppercase; color: ${C.vinho}; }
.imgmode .swipe { display: block !important; margin-top: 30px; padding: 13px 30px; border: 1px solid ${C.dourado}; border-radius: 40px; font-family: ${SANS}; font-weight: 500; font-size: 13px; letter-spacing: 3.5px; text-transform: uppercase; color: ${C.dourado}; }
.swipe span { letter-spacing: 0; }

/* espaçamento das páginas 2 e 3 (conteúdo mais enxuto) */
.pg-cal:not(.compact) .kicker { margin-top: 62px; }
.pg-cal:not(.compact) .cal-card { margin-top: 18px; padding: 10px 20px 14px; }
.pg-cal:not(.compact) .cell { height: 56px; }
.pg-cal:not(.compact) .cell b { font-size: 21px; }
.pg-cal:not(.compact) .cell.fechado b { width: 36px; height: 36px; font-size: 16px; }
.pg-cal:not(.compact) .legend { margin-top: 16px; }
.pg-cal:not(.compact) .hours-card { margin-top: 22px; padding: 18px 22px 16px; }
.pg-cal:not(.compact) .note { margin-top: 20px; }
.pg-regras .kicker { margin-top: 62px; }
.pg-regras .lead { margin-top: 14px; font-size: 18px; }
.pg-regras .rules-card { margin-top: 20px; padding: 6px 24px; }
.pg-regras .ri { padding: 16px 0 14px; grid-template-columns: 50px 1fr; }
.pg-regras .rn { font-size: 32px; }
.pg-regras .ri h3 { font-size: 12.5px; margin-bottom: 8px; }
.pg-regras .ri p { font-size: 14.5px; line-height: 1.55; }
.pg-regras .wine-card { margin-top: 18px; padding: 4px 24px; }

/* navegação */
.nav { position: absolute !important; left: 40px; right: 40px; bottom: 36px; height: 48px; z-index: 10 !important; display: flex; align-items: center; justify-content: space-between;
  border-top: .8px solid ${C.dourado}; border-bottom: .8px solid ${C.dourado}; }
.nbtn { font-weight: 500; font-size: 11.5px; letter-spacing: 2px; text-transform: uppercase; padding: 9px 6px; white-space: nowrap; color: ${C.marrom}; }
.nbtn.solid { background: ${C.vinho}; color: ${C.off}; padding: 10px 16px; border-radius: 30px; }
.dots { display: flex; gap: 4px; }
.dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: ${SERIF}; font-weight: 500; font-size: 13px; color: ${C.ouroEsc}; }
.dot.on { background: ${C.dourado}; color: ${C.off}; }
`;

let html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Agenda de Dezembro 2026 — Mayara Dias | Studio Beauty</title><style>${CSS}</style></head><body>${DEFS}${p1}${pRegras}${pCal}${p4}</body></html>`;
html = html.replace(/R\$ (?=\d)/g, () => 'R$\u00a0'); // "R$" nunca separado do valor
fs.mkdirSync(path.join(DIR, 'build'), { recursive: true });
fs.writeFileSync(path.join(DIR, 'build', 'agenda.html'), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
// página de valores: compacta automaticamente se a lista não couber
await page.evaluate(() => {
  const p = document.getElementById('p4'); const nav = p.querySelector('.nav');
  const sobra = () => nav.getBoundingClientRect().top - Math.max(...[...p.children].filter((c) => getComputedStyle(c).position !== 'absolute').map((c) => c.getBoundingClientRect().bottom));
  for (const c of ['dense', 'xdense']) { if (sobra() >= 4) break; p.classList.add(c); }
});
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

const renderizado = await page.content();
await page.pdf({ path: OUT, width: '540px', height: '960px', printBackground: true, preferCSSPageSize: true });
// imagens 1080x1920 para status do WhatsApp / stories (sem botões)
const imgDir = path.join(path.dirname(OUT), 'imagens');
fs.mkdirSync(imgDir, { recursive: true });
const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
const ip = await ctx.newPage();
await ip.setContent(renderizado, { waitUntil: 'load' });
await ip.evaluate(() => document.documentElement.classList.add('imgmode'));
await ip.evaluate(() => document.fonts.ready);
for (let i = 1; i <= 4; i++) await ip.locator('#p' + i).screenshot({ path: path.join(imgDir, `Agenda_Natal_2026_pagina_${i}.jpg`), type: 'jpeg', quality: 92 });
console.log('Imagens geradas em', imgDir);
console.log('Convite interativo:', await gerarConvite({ browser, renderizado, outDir: path.join(path.dirname(OUT), 'convite'), D }));
await browser.close();
try {
  const { execFileSync } = await import('node:child_process');
  console.log(execFileSync('python3', [path.join(DIR, 'pos_processar.py'), OUT], { encoding: 'utf8' }).trim());
} catch (e) { console.warn('Aviso: pós-processamento não executado (requer python3 + pypdf). Os links continuam funcionando.', e.message); }
console.log('PDF gerado:', OUT);
