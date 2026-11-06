// Gera o PDF "Agenda de Natal 2026 — Mayara Dias | Studio Beauty".
// Uso:  node build.mjs [dados.json]
// Edite dados.json (horários, vagas, serviços, foto) e rode de novo.
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
const C = {
  bege: '#F5E8DC', off: '#FFF9F2', marrom: '#593728', vinho: '#8B1E2D', dourado: '#C6A36A',
};

// ---------- utilidades ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const f = (n) => Math.round(n * 10) / 10;

function dataUri(file, mime) {
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

// ---------- calendário: dezembro de 2026 ----------
const ANO = 2026, MES = 11; // 0-based → dezembro
const primeiro = new Date(Date.UTC(ANO, MES, 1));
const diasNoMes = new Date(Date.UTC(ANO, MES + 1, 0)).getUTCDate();
const offsetSeg = (primeiro.getUTCDay() + 6) % 7; // 0 = segunda
if (diasNoMes !== 31 || offsetSeg !== 1) throw new Error('Calendário inconsistente: dezembro/2026 deve ter 31 dias e começar numa terça.');
const NOMES_DIA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const semAtend = new Set(D.dias_sem_atendimento || []);
const disp = D.disponibilidade || {};
function tipoDia(d) {
  const dow = (offsetSeg + d - 1) % 7; // 0 = seg
  if (semAtend.has(d)) return 'fechado';
  if (dow === 6) return 'domingo';
  return 'aberto';
}

// ---------- desenhos SVG ----------
function torn(w, h, seed, jag = 5, step = 9) {
  const r = rng(seed); const pts = [];
  const edge = (x0, y0, x1, y1, nx, ny) => {
    const len = Math.hypot(x1 - x0, y1 - y0); const n = Math.max(2, Math.round(len / step));
    for (let i = 0; i < n; i++) {
      const t = i / n; const d = r() * jag;
      pts.push([f(x0 + (x1 - x0) * t + nx * d), f(y0 + (y1 - y0) * t + ny * d)]);
    }
  };
  edge(0, 0, w, 0, 0, 1); edge(w, 0, w, h, -1, 0); edge(w, h, 0, h, 0, -1); edge(0, h, 0, 0, 1, 0);
  return 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
}

// papel rasgado como fundo absoluto de um bloco
function paper({ w, h, seed = 1, fill = C.off, jag = 5, shadow = true, cls = '', style = '' }) {
  const p = torn(w, h, seed, jag);
  return `<svg class="paper ${cls}" style="${style}" width="${w + 6}" height="${h + 8}" viewBox="-1 -1 ${w + 6} ${h + 8}">
    ${shadow ? `<path d="${p}" transform="translate(2.2,3.4)" fill="rgba(89,55,40,.16)"/><path d="${p}" transform="translate(.8,1.2)" fill="rgba(89,55,40,.10)"/>` : ''}
    <path d="${p}" fill="${fill}"/>
    
  </svg>`;
}

function star(cx, cy, R, rot = 0, fill = 'url(#gold)') {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2 + rot; const rr = i % 2 ? R * 0.45 : R;
    pts.push(`${f(cx + Math.cos(a) * rr)},${f(cy + Math.sin(a) * rr)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}
function sparkle(cx, cy, R, fill = 'url(#gold)') {
  const r = R * 0.18;
  return `<path d="M${cx},${cy - R} Q${cx + r},${cy - r} ${cx + R},${cy} Q${cx + r},${cy + r} ${cx},${cy + R} Q${cx - r},${cy + r} ${cx - R},${cy} Q${cx - r},${cy - r} ${cx},${cy - R}Z" fill="${fill}"/>`;
}
const T = (seed, fill = C.off) => `data-torn="${seed}" data-fill="${fill}"`;

// estrela solta posicionada na página
const deco = (x, y, size, kind = 'star', rot = 0, op = 1) => `<svg class="abs" style="left:${x}px;top:${y}px;opacity:${op}" width="${size}" height="${size}" viewBox="0 0 40 40">${kind === 'star' ? star(20, 20, 19, rot) : sparkle(20, 20, 19)}</svg>`;

// laço de cetim vermelho
function bow(x, y, w, rot = 0, extra = '') {
  return `<svg class="abs bow" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg);${extra}" width="${w}" height="${w * 0.9}" viewBox="0 0 200 180">
    <g>
      <path d="M92,82 C80,112 66,140 48,172 L68,165 L78,178 C94,146 101,116 104,86Z" fill="url(#satinD)"/>
      <path d="M108,82 C120,112 134,140 152,172 L132,165 L122,178 C106,146 99,116 96,86Z" fill="url(#satinD)"/>
      <path d="M100,74 C76,22 18,6 12,46 C7,80 52,98 100,80Z" fill="url(#satin)"/>
      <path d="M100,74 C124,22 182,6 188,46 C193,80 148,98 100,80Z" fill="url(#satin)"/>
      <path d="M100,76 C70,40 36,32 30,50 C40,44 70,52 100,78Z" fill="#5e0f1a" opacity=".55"/>
      <path d="M100,76 C130,40 164,32 170,50 C160,44 130,52 100,78Z" fill="#5e0f1a" opacity=".55"/>
      <path d="M22,40 C34,20 64,22 84,46" stroke="#fff" stroke-opacity=".28" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M178,40 C166,20 136,22 116,46" stroke="#fff" stroke-opacity=".22" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M58,160 C70,135 82,112 90,92" stroke="#fff" stroke-opacity=".18" stroke-width="3" fill="none"/>
      <ellipse cx="100" cy="79" rx="16" ry="18" fill="url(#satin)"/>
      <ellipse cx="96" cy="73" rx="6" ry="7" fill="#fff" opacity=".22"/>
    </g></svg>`;
}

// ramo de pinheiro
function pine(x, y, len, rot, seed, flip = false, scale = 1) {
  const r = rng(seed); let g = '';
  const greens = ['#1d3a2a', '#2a5139', '#376247', '#45714f', '#244832'];
  const branch = (x0, y0, L, ang, depth) => {
    const cx = x0 + Math.cos(ang) * L * 0.5 + Math.cos(ang + Math.PI / 2) * L * 0.06;
    const cy = y0 + Math.sin(ang) * L * 0.5 + Math.sin(ang + Math.PI / 2) * L * 0.06;
    const x1 = x0 + Math.cos(ang) * L, y1 = y0 + Math.sin(ang) * L;
    g += `<path d="M${f(x0)},${f(y0)} Q${f(cx)},${f(cy)} ${f(x1)},${f(y1)}" stroke="#4a3426" stroke-width="${depth ? 1.4 : 2.6}" fill="none"/>`;
    const n = Math.round(L / 3.2);
    for (let i = 2; i <= n; i++) {
      const t = i / n; const u = 1 - t;
      const px = u * u * x0 + 2 * u * t * cx + t * t * x1, py = u * u * y0 + 2 * u * t * cy + t * t * y1;
      for (const s of [-1, 1]) {
        const a = ang + s * (0.75 + r() * 0.35) - 0.12; const nl = (13 + r() * 9) * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15)));
        g += `<line x1="${f(px)}" y1="${f(py)}" x2="${f(px + Math.cos(a) * nl)}" y2="${f(py + Math.sin(a) * nl)}" stroke="${greens[Math.floor(r() * greens.length)]}" stroke-width="${f(1.5 + r() * 0.9)}" stroke-linecap="round"/>`;
      }
      if (!depth && i % 6 === 3 && t < 0.8) branch(px, py, L * (0.38 + r() * 0.12), ang + (i % 12 === 3 ? -0.65 : 0.65), 1);
    }
  };
  branch(10, 60, len - 20, 0, 0);
  return `<svg class="abs pine" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg)${flip ? ' scaleX(-1)' : ''} scale(${scale});transform-origin:0 50%" width="${len + 30}" height="120" viewBox="0 0 ${len + 30} 120">${g}</svg>`;
}

// bola de natal pendurada
function ornament(x, y, r, color, stringLen, gold = false) {
  const grad = gold ? 'ballGold' : 'ballRed';
  return `<svg class="abs" style="left:${x - r - 2}px;top:${y}px" width="${2 * r + 4}" height="${stringLen + 2 * r + 12}" viewBox="0 0 ${2 * r + 4} ${stringLen + 2 * r + 12}">
    <line x1="${r + 2}" y1="0" x2="${r + 2}" y2="${stringLen}" stroke="${C.dourado}" stroke-width="1.2"/>
    <rect x="${r - 3}" y="${stringLen}" width="10" height="7" rx="1.5" fill="url(#gold)"/>
    <circle cx="${r + 2}" cy="${stringLen + 7 + r}" r="${r}" fill="url(#${grad})"/>
    <ellipse cx="${r - r * 0.25}" cy="${stringLen + 7 + r * 0.6}" rx="${r * 0.28}" ry="${r * 0.18}" fill="#fff" opacity=".45" transform="rotate(-30 ${r - r * 0.25} ${stringLen + 7 + r * 0.6})"/>
  </svg>`;
}

// fita washi
function tape(x, y, w, rot, kind = 'stripe') {
  const h = 22; const z = (side) => { let p = ''; for (let i = 0; i <= 5; i++) p += `${side ? w - (i % 2) * 4 : (i % 2) * 4},${(h / 5) * i} `; return p; };
  const pts = `${z(0).trim().split(' ').join(' ')} ${z(1).trim().split(' ').reverse().join(' ')}`;
  const fill = kind === 'stripe' ? 'url(#stripes)' : kind === 'gold' ? 'url(#tapeGold)' : 'rgba(198,163,106,.55)';
  return `<svg class="abs" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg)" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polygon points="${pts}" fill="${fill}" opacity=".92"/></svg>`;
}

const DEFS = `<svg width="0" height="0" style="position:absolute"><defs>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EBD6A4"/><stop offset=".5" stop-color="${C.dourado}"/><stop offset="1" stop-color="#9C7840"/></linearGradient>
  <linearGradient id="satin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B5303F"/><stop offset=".55" stop-color="${C.vinho}"/><stop offset="1" stop-color="#5E0F1A"/></linearGradient>
  <linearGradient id="satinD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9E2433"/><stop offset="1" stop-color="#5A0E19"/></linearGradient>
  <radialGradient id="ballRed" cx=".35" cy=".35" r=".75"><stop offset="0" stop-color="#C2404F"/><stop offset=".6" stop-color="${C.vinho}"/><stop offset="1" stop-color="#4f0c16"/></radialGradient>
  <radialGradient id="ballGold" cx=".35" cy=".35" r=".75"><stop offset="0" stop-color="#F3E2B8"/><stop offset=".6" stop-color="${C.dourado}"/><stop offset="1" stop-color="#7f6232"/></radialGradient>
  <pattern id="stripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#FFF9F2"/><rect width="6" height="12" fill="${C.vinho}" opacity=".85"/></pattern>
  <pattern id="tapeGold" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#E9D7B0"/><circle cx="5" cy="5" r="1.6" fill="${C.dourado}"/></pattern>
  <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#EFE0D2"/><rect width="2" height="7" fill="#DCC6B2"/></pattern>
  <pattern id="texture" width="256" height="256" patternUnits="userSpaceOnUse"><image href="${dataUri(path.join(DIR, 'assets/textura-papel.png'), 'image/png')}" width="256" height="256"/></pattern>
</defs></svg>`;

// ---------- navegação ----------
function nav(page) {
  const prev = page > 1 ? `<a class="nbtn ghost" href="#p${page - 1}">← Voltar</a>` : '';
  const capa = `<a class="nbtn ghost" href="#p1">✦ Capa</a>`;
  const dots = [1, 2, 3, 4].map((i) => `<a class="dot ${i === page ? 'on' : ''}" href="#p${i}">${i}</a>`).join('');
  const next = page < 4 ? `<a class="nbtn solid" href="#p${page + 1}">Avançar →</a>` : `<a class="nbtn solid" href="${esc(D.whatsapp_link)}">WhatsApp →</a>`;
  return `<nav class="nav">${prev}${capa}<span class="dots">${dots}</span>${next}</nav>`;
}
const bg = (seed) => `<div class="bgblob" style="left:${-80 + (seed * 37) % 120}px;top:${120 + (seed * 53) % 300}px"></div><div class="bgblob b2" style="right:${-90 + (seed * 29) % 80}px;top:${520 + (seed * 17) % 200}px"></div>`;

// ---------- PÁGINA 1 — CAPA ----------
const fotoFile = D.foto ? path.resolve(DIR, D.foto) : null;
const temFoto = fotoFile && fs.existsSync(fotoFile);
const fotoHtml = temFoto
  ? `<img class="foto" src="${dataUri(fotoFile, /\.png$/i.test(fotoFile) ? 'image/png' : 'image/jpeg')}" style="object-position:${esc(D.foto_posicao || '50% 30%')}"/>`
  : `<div class="foto vazia"><svg width="44" height="38" viewBox="0 0 44 38"><rect x="2" y="8" width="40" height="28" rx="5" fill="none" stroke="${C.marrom}" stroke-width="2.4"/><path d="M14 8 l3-6 h10 l3 6" fill="none" stroke="${C.marrom}" stroke-width="2.4"/><circle cx="22" cy="22" r="8" fill="none" stroke="${C.marrom}" stroke-width="2.4"/></svg><span>foto da Mayara</span></div>`;

const p1 = `<section class="page" id="p1">
  ${bg(1)}
  ${pine(-26, -52, 200, 10, 11)}${pine(-34, -26, 130, 34, 12, false, .8)}
  ${pine(386, -60, 190, 168, 13)}${pine(452, -30, 110, 150, 14, false, .8)}
  ${ornament(452, 0, 14, 'r', 26, true)}${ornament(486, 0, 17, 'r', 48)}${ornament(424, 0, 11, 'r', 58)}
  ${deco(40, 150, 20)}${deco(482, 210, 16, 'sparkle')}${deco(28, 560, 18, 'sparkle')}${deco(474, 520, 22)}${deco(500, 660, 14)}${deco(30, 330, 12)}

  <div class="eyebrow">✶ agenda exclusiva ✶</div>
  <h1 class="cover-title">DEZEMBRO,<br>DEZEMBRO! <span class="emo">🎄</span></h1>

  <div class="photo-wrap">
    ${paper({ w: 250, h: 290, seed: 4, fill: '#EAD6C2', cls: 'abs', style: 'left:-34px;top:20px;transform:rotate(-8deg)' })}
    ${paper({ w: 200, h: 120, seed: 5, fill: '#E7C9C2', cls: 'abs', style: 'left:200px;top:250px;transform:rotate(6deg)' })}
    <div class="polaroid">${fotoHtml}<div class="cap">Mayara ♡</div></div>
    ${tape(40, -6, 104, -14)}${tape(214, 6, 88, 18, 'gold')}
    ${bow(232, 50, 92, 12)}
    <div class="note abs" style="left:262px;top:300px;transform:rotate(-5deg)">feito com carinho<br>para você ✎</div>
  </div>

  <div class="script-title">Agenda de Natal 2026</div>
  <div class="brand">MAYARA DIAS <span>|</span> STUDIO BEAUTY</div>

  <div class="quote-wrap">${paper({ w: 410, h: 78, seed: 9, cls: 'abs', style: 'left:0;top:0;transform:rotate(-1deg)' })}
    <p class="quote">“Seu momento de beleza para as festas<br>começa aqui!”</p></div>

  <a class="cta" href="#p2">ABRIR MINHA AGENDA →</a>
  <div class="mini-index"><a href="#p2">Calendário</a> · <a href="#p3">Regras</a> · <a href="#p4">Valores</a></div>
  ${pine(-40, 896, 150, -6, 21)}${pine(556, 898, 150, 186, 22)}
</section>`;

// ---------- PÁGINA 2 — CALENDÁRIO ----------
let cells = '';
for (let i = 0; i < offsetSeg; i++) cells += '<div class="cell blank"></div>';
for (let d = 1; d <= diasNoMes; d++) {
  const t = tipoDia(d); const info = disp[String(d)] || disp[String(d).padStart(2, '0')];
  let sub = ''; let cls = t;
  if (t === 'fechado') sub = '<small>sem<br>atend.</small>';
  else if (t === 'domingo') sub = '<small>domingo</small>';
  else if (info && info.status) {
    const st = String(info.status).toLowerCase();
    cls += st.startsWith('lot') ? ' lotado' : st.startsWith('pou') ? ' poucas' : ' vagas';
    sub = `<small>${st.startsWith('lot') ? 'lotado' : st.startsWith('pou') ? 'poucas' : 'vagas'}</small>`;
  }
  cells += `<div class="cell ${cls}"><b>${d}</b>${sub}${t === 'fechado' ? '<i class="pin">★</i>' : ''}</div>`;
}
const usaDisp = Object.keys(disp).length > 0;
const legenda = `<div class="legend"><span><i class="lg aberto"></i>atendimento</span><span><i class="lg domingo"></i>domingo</span><span><i class="lg fechado"></i>sem atendimento</span>${usaDisp ? '<span><i class="lg vagas"></i>vagas</span><span><i class="lg lotado"></i>lotado</span>' : ''}</div>`;

const normais = (D.horarios_normais || []).length
  ? `<div class="chips">${D.horarios_normais.map((h) => `<span class="chip">${esc(h)}</span>`).join('')}</div>`
  : `<div class="placeholder">horários normais<br>em breve ✎</div>`;
const extras = `<div class="chips">${(D.horarios_extras || []).map((h) => `<span class="chip x"><b>${esc(h.hora)}</b> ${esc(h.detalhe)}</span>`).join('')}</div>`;

let porDia = '';
if (usaDisp) {
  const rows = Object.keys(disp).map(Number).filter((d) => d >= 1 && d <= 31 && tipoDia(d) === 'aberto').sort((a, b) => a - b).map((d) => {
    const i = disp[String(d)] || disp[String(d).padStart(2, '0')]; const dow = NOMES_DIA[(offsetSeg + d - 1) % 7];
    const hs = (i.horarios || []).length ? i.horarios.map(esc).join(' · ') : (String(i.status || '').toLowerCase().startsWith('lot') ? 'lotado' : '—');
    return `<div class="pd"><b>${dow} ${String(d).padStart(2, '0')}</b><span>${hs}</span></div>`;
  });
  porDia = `<div class="card pd-card" ${T(31)}><h3>VAGAS POR DIA</h3><div class="pd-grid" style="grid-template-rows:repeat(${Math.ceil(rows.length / 3)},auto)">${rows.join('')}</div></div>`;
} else {
  porDia = `<p class="hand-note">✎ a disponibilidade de cada dia será atualizada aqui — confirme sua vaga com a Mayara pelo WhatsApp</p>`;
}

const p2 = `<section class="page ${usaDisp ? 'compact' : ''}" id="p2">
  ${bg(2)}
  ${pine(-26, -58, 170, 12, 41)}${pine(-30, -34, 100, 38, 941, false, .8)}${pine(400, -62, 160, 168, 42)}
  ${ornament(470, 0, 12, 'r', 22, true)}${ornament(500, 0, 14, 'r', 40)}
  ${deco(470, 92, 14, 'sparkle')}${deco(26, 104, 12)}
  <div class="eyebrow small">segunda a sábado ✶</div>
  <h2 class="title">AGENDA DE DEZEMBRO <span class="emo">🎀</span></h2>
  <div class="card cal-card" ${T(33)}>
    ${bow(-24, -14, 56, -18)}
    ${tape(392, -12, 76, 10)}
    <div class="cal-head"><span class="mes">Dezembro</span><span class="ano">2026</span></div>
    <div class="grid wd">${NOMES_DIA.map((n) => `<div>${n.toUpperCase()}</div>`).join('')}</div>
    <div class="grid days">${cells}</div>
    ${legenda}
  </div>
  <p class="closed-line">✶ Sem atendimento: <b>13/12</b>, <b>24/12</b>, <b>27/12</b> e domingos</p>
  <div class="card hours-card" ${T(35)}>
    ${tape(190, -16, 96, -3, 'gold')}
    <div class="hcols">
      <div><h3>HORÁRIOS NORMAIS</h3>${normais}</div>
      <div><h3>HORÁRIOS EXTRAS</h3>${extras}</div>
    </div>
    <p class="fine">Horários extras são <b>possibilidades de atendimento, não vagas confirmadas</b>. 07h e 08h têm taxa extra de R$ 20,00.</p>
  </div>
  ${porDia}
  ${nav(2)}
</section>`;

// ---------- PÁGINA 3 — REGRAS ----------
const rule = (n, title, body, opts = {}) => `<div class="rule ${opts.cls || ''}" ${T(50 + n, opts.fill || C.off)}>
  <div class="rh"><span class="num">${n}</span><h3>${title}</h3></div>${body}${opts.deco || ''}</div>`;

const p3 = `<section class="page" id="p3">
  ${bg(3)}
  ${pine(-26, -58, 170, 12, 61)}${pine(-30, -34, 100, 38, 961, false, .8)}${pine(400, -62, 160, 168, 62)}
  ${ornament(478, 0, 13, 'r', 30)}${ornament(452, 0, 10, 'r', 16, true)}
  ${deco(22, 168, 14, 'sparkle')}${deco(496, 470, 14)}${deco(18, 640, 12)}
  <h2 class="title two">ALGUNS DETALHES<br>IMPORTANTES <span class="emo">🤎</span></h2>
  <p class="lead">“Sem mil regras, só organização e bom senso.”</p>
  <div class="rules">
    ${rule(1, 'Abertura da agenda', `<div class="dates"><div><b>08/11</b><span>clientes fixas</span></div><i>✦</i><div><b>11/11</b><span>abertura geral</span></div></div>`, { deco: tape(370, -12, 84, 12) })}
    <div class="row2">
      ${rule(2, 'Reajuste de valores', `<p>Os valores dos serviços serão reajustados a partir de <b>20 de novembro de 2026</b>.</p>`, { cls: 'half', fill: '#F3E3D3' })}
      ${rule(3, 'Confirmação do horário', `<p>Sinal antecipado de <b>R$ 50,00</b> para garantir o horário. O restante é pago no dia do atendimento.</p>`, { cls: 'half', deco: tape(130, -12, 70, 8, 'gold') })}
    </div>
    ${rule(4, 'Horários extras', `<p><b>7h e 8h:</b> taxa adicional de <b>R$ 20,00</b>, paga junto com o sinal.</p><p><b>21h, 22h e 23h</b> também são considerados horários extras.</p>`, {})}
    ${rule(5, 'Cancelamentos e reagendamentos', `<p>Em caso de cancelamento, desistência ou falta, <b>o sinal não será reembolsado</b>.</p><p>Para reagendar, avise com <b>pelo menos 24 horas de antecedência</b>. A nova data dependerá da disponibilidade da agenda.</p>`, { cls: 'dark', fill: C.vinho, deco: bow(392, -36, 72, 14) })}
  </div>
  ${nav(3)}
</section>`;

// ---------- PÁGINA 4 — VALORES ----------
const servicos = D.servicos || [];
let linhas = '';
if (servicos.length) {
  linhas = servicos.map((s) => `<div class="srow"><div class="sname"><b>${esc(s.nome)}</b>${s.info ? `<small>${esc(s.info)}</small>` : ''}</div><div class="sval">${esc(s.valor)}</div></div>`).join('');
} else {
  const n = D.linhas_vazias_tabela || 8;
  for (let i = 0; i < n; i++) linhas += `<div class="srow empty"><div class="sname"></div><div class="sval"></div></div>`;
}
const p4 = `<section class="page ${servicos.length > 8 ? 'dense' : ''} ${servicos.length > 11 ? 'xdense' : ''}" id="p4">
  ${bg(4)}
  ${pine(-26, -58, 170, 12, 71)}${pine(-30, -34, 100, 38, 971, false, .8)}${pine(400, -62, 160, 168, 72)}
  ${ornament(470, 0, 12, 'r', 26, true)}${ornament(498, 0, 15, 'r', 44)}
  ${deco(24, 150, 14)}${deco(492, 420, 12, 'sparkle')}${deco(20, 520, 14, 'sparkle')}
  <h2 class="title two">SEU MOMENTO<br>DE BELEZA <span class="emo">💅🎄</span></h2>
  <p class="lead">Confira nossos serviços e valores.</p>
  <div class="card price-card" ${T(81)}>
    ${bow(-40, -38, 62, -16)}${tape(330, -14, 110, 6)}
    <div class="thead"><span>PROCEDIMENTO</span><span>VALOR</span></div>
    <div class="tbody ${servicos.length ? '' : 'is-empty'}">${linhas}</div>
    ${servicos.length ? '' : '<div class="placeholder wide">serviços e valores atualizados em breve ✎</div>'}
  </div>
  <div class="card thanks" ${T(83, '#F3E3D3')}>
    <p class="ty">“Obrigada por escolher meu trabalho. Será um prazer cuidar de você neste fim de ano! <span class="emo">🤎</span>”</p>
    <div class="sig">Mayara Dias</div>
    <div class="brand sm">STUDIO BEAUTY</div>
    <a class="wa" href="${esc(D.whatsapp_link)}">WhatsApp: ${esc(D.whatsapp_exibicao)}</a>
  </div>
  ${nav(4)}
</section>`;

// ---------- CSS ----------
const fontsCss = fs.readFileSync(path.join(DIR, 'fonts/fonts.css'), 'utf8').replace(/url\('([^']+)'\)/g, (_, fn) => `url('${dataUri(path.join(DIR, 'fonts', fn), 'font/ttf')}')`);
const tex = dataUri(path.join(DIR, 'assets/textura-papel.png'), 'image/png');
const CSS = `${fontsCss}
@page { size: 540px 960px; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: ${C.bege}; }
body { font-family: 'Poppins', sans-serif; color: ${C.marrom}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: inherit; text-decoration: none; }
.emo { font-family: 'Noto Color Emoji'; font-weight: 400; font-size: .82em; vertical-align: .04em; }
.page { position: relative; width: 540px; height: 960px; overflow: hidden; page-break-after: always; break-after: page;
  background: ${C.bege} url('${tex}'); padding: 0 34px; display: flex; flex-direction: column; align-items: center; }
.page:last-child { page-break-after: auto; break-after: auto; }
.abs { position: absolute; }
.paper { position: absolute; z-index: 0; overflow: visible; }
.bgblob { position: absolute; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,249,242,.85), rgba(255,249,242,0) 70%); z-index: 0; }
.bgblob.b2 { background: radial-gradient(circle, rgba(198,163,106,.16), rgba(198,163,106,0) 70%); }
.bow { z-index: 6; }
.page > .abs.pine { z-index: 1; }
.page > * { z-index: 2; }
.page > .abs { z-index: 5; }

.eyebrow { margin-top: 84px; font-family: 'Caveat'; font-weight: 700; font-size: 23px; color: ${C.vinho}; position: relative; }
.eyebrow.small { margin-top: 56px; font-size: 21px; }
.cover-title { font-family: 'Playfair Display'; font-weight: 900; font-size: 55px; line-height: .98; color: ${C.vinho}; text-align: center; letter-spacing: .5px; margin-top: 4px; position: relative; }
.photo-wrap { position: relative; width: 340px; height: 352px; margin-top: 18px; }
.polaroid { position: absolute; left: 36px; top: 14px; width: 252px; height: 312px; background: #FFFDF8; padding: 14px 14px 0; transform: rotate(-3.5deg);
  box-shadow: 0 2px 2px rgba(89,55,40,.12), 0 10px 22px rgba(89,55,40,.22); z-index: 3; }
.foto { width: 224px; height: 246px; object-fit: cover; display: block; }
.foto.vazia { background: #EAD8C6; border: 2px dashed rgba(89,55,40,.35); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-family: 'Caveat'; font-size: 22px; color: ${C.marrom}; }
.polaroid .cap { font-family: 'Caveat'; font-weight: 700; font-size: 26px; text-align: center; color: ${C.vinho}; margin-top: 6px; }
.photo-wrap .abs { z-index: 4; }
.photo-wrap .paper { z-index: 1; }
.note { font-family: 'Caveat'; font-size: 19px; line-height: 1; color: ${C.marrom}; text-align: center; }
.script-title { font-family: 'Great Vibes'; font-size: 54px; color: ${C.marrom}; margin-top: 8px; line-height: 1.05; position: relative; }
.brand { font-weight: 600; font-size: 14px; letter-spacing: 4px; color: ${C.vinho}; margin-top: 2px; }
.brand span { color: ${C.dourado}; padding: 0 4px; }
.brand.sm { font-size: 11px; letter-spacing: 5px; margin-top: 0; }
.quote-wrap { position: relative; width: 410px; height: 78px; margin-top: 18px; display: flex; align-items: center; justify-content: center; }
.quote { position: relative; z-index: 2; font-family: 'Playfair Display'; font-style: italic; font-size: 18px; text-align: center; line-height: 1.3; color: ${C.marrom}; }
.cta { margin-top: 22px; position: relative; display: inline-block; padding: 16px 34px; border-radius: 40px; background: linear-gradient(180deg, #A02536, ${C.vinho} 55%, #6c1420);
  color: ${C.off}; font-weight: 700; font-size: 17px; letter-spacing: 1.6px; border: 2px solid ${C.dourado}; box-shadow: 0 6px 14px rgba(139,30,45,.32); }
.mini-index { margin-top: 12px; font-size: 13px; font-weight: 500; color: ${C.marrom}; position: relative; }
.mini-index a { color: ${C.vinho}; text-decoration: underline; text-decoration-color: ${C.dourado}; text-underline-offset: 3px; }

.title { font-family: 'Playfair Display'; font-weight: 800; font-size: 33px; color: ${C.vinho}; text-align: center; line-height: 1.05; margin-top: 2px; position: relative; }
.title.two { margin-top: 70px; font-size: 36px; }
.lead { font-family: 'Playfair Display'; font-style: italic; font-size: 17.5px; margin-top: 10px; text-align: center; position: relative; }
.card { position: relative; width: 460px; }
.card > *:not(.abs):not(.paper) { position: relative; z-index: 2; }
.card > .abs { z-index: 3; }
.card > .paper { z-index: 0; }

.cal-card { margin-top: 22px; padding: 8px 14px 14px; }
.cal-head { text-align: center; }
.cal-head .mes { font-family: 'Great Vibes'; font-size: 40px; color: ${C.vinho}; }
.cal-head .ano { font-family: 'Playfair Display'; font-weight: 700; font-size: 17px; color: ${C.dourado}; letter-spacing: 3px; margin-left: 8px; }
.grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.grid.wd { margin-top: 2px; padding-bottom: 5px; border-bottom: 1.5px solid ${C.dourado}; margin-bottom: 7px; }
.grid.wd div { text-align: center; font-weight: 600; font-size: 11.5px; letter-spacing: 1px; color: ${C.marrom}; }
.cell { position: relative; height: 50px; border-radius: 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cell b { font-family: 'Playfair Display'; font-weight: 700; font-size: 19px; line-height: 1; }
.cell small { font-size: 9.5px; font-weight: 600; line-height: 1.05; text-align: center; margin-top: 2px; text-transform: lowercase; }
.cell.aberto { background: #F1E1D2; border: 1px solid #E2CDB9; }
.cell.domingo { background: url('data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#EEE2D6"/><path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="#DCC7B3" stroke-width="2"/></svg>`)}'); border: 1px dashed #CDB59E; color: #866A57; }
.cell.fechado { background: ${C.vinho}; color: ${C.off}; border: 1.5px solid ${C.dourado}; box-shadow: 0 2px 4px rgba(139,30,45,.35); }
.cell.fechado small { color: #F3DDB0; }
.cell .pin { position: absolute; top: -7px; right: -4px; font-style: normal; font-size: 13px; color: ${C.dourado}; }
.cell.vagas { background: #E7EEDF; border-color: #A9BE98; }
.cell.poucas { background: #F6E7C8; border-color: ${C.dourado}; }
.cell.lotado { background: #E3D3C4; color: #8f7564; }
.legend { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 16px; margin-top: 12px; font-size: 12px; font-weight: 500; }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.lg { display: inline-block; width: 14px; height: 14px; border-radius: 3px; }
.lg.aberto { background: #F1E1D2; border: 1px solid #D9C2AC; }
.lg.domingo { background: #E3D3C4; border: 1px dashed #B99D86; }
.lg.fechado { background: ${C.vinho}; border: 1px solid ${C.dourado}; }
.lg.vagas { background: #E7EEDF; border: 1px solid #A9BE98; }
.lg.lotado { background: #E3D3C4; border: 1px solid #b9a08b; }
.closed-line { margin-top: 12px; font-size: 13.5px; color: ${C.vinho}; position: relative; }
.closed-line b { font-weight: 700; }

.hours-card { margin-top: 16px; padding: 18px 16px 14px; }
.hcols { display: grid; grid-template-columns: 1fr 1.25fr; gap: 16px; }
h3 { font-weight: 700; font-size: 12px; letter-spacing: 1.8px; color: ${C.vinho}; padding-bottom: 6px; border-bottom: 1.5px solid ${C.dourado}; margin-bottom: 9px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { background: ${C.bege}; border: 1px solid ${C.dourado}; border-radius: 20px; padding: 4px 10px; font-size: 13px; font-weight: 600; }
.chip.x { font-weight: 500; font-size: 12px; }
.chip.x b { font-weight: 700; font-size: 13.5px; color: ${C.vinho}; }
.placeholder { border: 1.5px dashed rgba(89,55,40,.38); border-radius: 10px; padding: 12px 8px; text-align: center; font-family: 'Caveat'; font-size: 21px; line-height: 1.05; color: ${C.marrom}; }
.placeholder.wide { margin: 14px auto 0; width: 82%; position: relative; }
.fine { margin-top: 12px; font-size: 12.5px; line-height: 1.4; }
.fine b { color: ${C.vinho}; font-weight: 600; }
.hand-note { margin-top: 16px; width: 440px; text-align: center; font-family: 'Caveat'; font-size: 20px; line-height: 1.05; color: ${C.marrom}; position: relative; }
.pd-card { margin-top: 12px; padding: 10px 14px 10px; }
.pd-card .paper.fill { left: -8px; top: -6px; width: calc(100% + 16px); height: calc(100% + 12px); }
.pd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 14px; }
.pd { font-size: 10.5px; display: flex; gap: 6px; border-bottom: 1px dotted #CDB59E; padding: 1px 0; }
.pd b { color: ${C.vinho}; white-space: nowrap; }
/* página de valores com muitos serviços */
.dense .title.two { margin-top: 56px; font-size: 32px; }
.dense .lead { margin-top: 6px; }
.dense .price-card { margin-top: 14px; padding: 16px 18px 12px; }
.dense .srow { min-height: 0; padding: 6px 0 5px; }
.dense .sname b { font-size: 14px; }
.dense .sval { font-size: 15.5px; }
.dense .thanks { margin-top: 14px; padding: 12px 16px 10px; }
.dense .ty { font-size: 15px; }
.dense .sig { font-size: 32px; }
.xdense .srow { padding: 4px 0 3px; }
.xdense .sname small { display: inline; margin-left: 6px; }
.xdense .thanks .brand { display: none; }
/* modo compacto: ativado quando há disponibilidade por dia em dados.json */
.compact .eyebrow.small { display: none; }
.compact .title { margin-top: 52px; font-size: 30px; }
.compact .cal-card { margin-top: 14px; padding: 2px 12px 10px; }
.compact .cal-head .mes { font-size: 30px; }
.compact .grid { gap: 4px; }
.compact .grid.wd { margin-bottom: 5px; padding-bottom: 3px; }
.compact .cell { height: 38px; border-radius: 6px; }
.compact .cell b { font-size: 15px; }
.compact .cell small { font-size: 8px; margin-top: 1px; }
.compact .cell.fechado small { font-size: 7.5px; }
.compact .legend { margin-top: 7px; font-size: 11px; }
.compact .closed-line { margin-top: 8px; font-size: 12.5px; }
.compact .hours-card { margin-top: 10px; padding: 12px 14px 10px; }
.compact .hcols h3 { margin-bottom: 6px; padding-bottom: 4px; }
.compact .chip { padding: 2px 8px; font-size: 12px; }
.compact .chip.x { font-size: 11px; }
.compact .chip.x b { font-size: 12px; }
.compact .chips { gap: 4px; }
.compact .fine { margin-top: 7px; font-size: 11.5px; }
.compact .pd-card { margin-top: 12px; padding: 10px 12px 8px; }
.compact .pd-card h3 { margin-bottom: 5px; padding-bottom: 4px; }
.compact .pd-grid { grid-template-columns: 1fr 1fr 1fr; grid-auto-flow: column; gap: 0 10px; }
.compact .pd { font-size: 10px; line-height: 1.25; gap: 4px; padding: 2px 0; }

.rules { position: relative; width: 460px; margin-top: 22px; display: flex; flex-direction: column; gap: 18px; }
.rule { position: relative; padding: 14px 18px 14px; }
.rule > *:not(.abs):not(.paper) { position: relative; z-index: 2; }
.rule > .abs { z-index: 3; }
.rule .rh { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.num { width: 28px; height: 28px; flex: none; border-radius: 50%; background: ${C.vinho}; color: ${C.off}; font-family: 'Playfair Display'; font-weight: 700; font-size: 16px; display: flex; align-items: center; justify-content: center; border: 1.5px solid ${C.dourado}; }
.rule h3 { border: 0; margin: 0; padding: 0; font-family: 'Playfair Display'; font-weight: 700; font-size: 20px; letter-spacing: 0; color: ${C.vinho}; }
.rule p { font-size: 15px; line-height: 1.45; }
.rule p + p { margin-top: 4px; }
.rule b { font-weight: 700; color: ${C.vinho}; }
.rule .dates { display: flex; align-items: center; justify-content: center; gap: 28px; padding-left: 0; }
.rule .dates div { display: flex; flex-direction: column; align-items: center; }
.rule .dates b { font-family: 'Playfair Display'; font-size: 30px; line-height: 1.05; }
.rule .dates span { font-size: 13.5px; font-weight: 500; }
.rule .dates i { font-style: normal; color: ${C.dourado}; font-size: 20px; }
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.rule.half { padding: 12px 12px 8px; }
.rule.half h3 { font-size: 17px; line-height: 1.1; }
.rule.half p { font-size: 14.5px; line-height: 1.42; }
.rule.dark { color: ${C.off}; }
.rule.dark h3 { color: ${C.off}; }
.rule.dark b { color: #F3DDB0; }
.rule.dark .num { background: ${C.off}; color: ${C.vinho}; }

.price-card { margin-top: 20px; padding: 20px 20px 18px; }
.thead { display: flex; justify-content: space-between; font-weight: 700; font-size: 12.5px; letter-spacing: 2px; color: ${C.vinho}; border-bottom: 1.5px solid ${C.dourado}; padding-bottom: 7px; }
.srow { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; border-bottom: 1px dotted #BFA58C; padding: 9px 0 7px; min-height: 42px; }
.sname b { font-weight: 600; font-size: 15px; display: block; }
.sname small { font-size: 11.5px; font-style: italic; color: #7a5a49; display: block; margin-top: 1px; }
.sval { font-family: 'Playfair Display'; font-weight: 700; font-size: 17px; color: ${C.vinho}; white-space: nowrap; }
.tbody.is-empty .srow { min-height: 42px; }
.thanks { margin-top: 20px; padding: 16px 18px 14px; text-align: center; }
.ty { font-family: 'Playfair Display'; font-style: italic; font-size: 17px; line-height: 1.35; }
.sig { font-family: 'Great Vibes'; font-size: 40px; color: ${C.vinho}; line-height: 1.05; margin-top: 2px; }
.wa { display: inline-block; margin-top: 6px; font-weight: 700; font-size: 16px; color: ${C.marrom}; border-bottom: 2px solid ${C.dourado}; }

.nav { position: absolute; left: 22px; right: 22px; bottom: 20px; height: 50px; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 6px;
  background: ${C.off}; border: 1.5px solid ${C.dourado}; border-radius: 30px; padding: 0 6px 0 12px; box-shadow: 0 4px 12px rgba(89,55,40,.15); }
.nbtn { font-weight: 600; font-size: 14px; padding: 9px 10px; border-radius: 22px; white-space: nowrap; }
.nbtn.ghost { color: ${C.marrom}; }
.nbtn.solid { background: ${C.vinho}; color: ${C.off}; padding: 9px 16px; }
.dots { display: flex; gap: 6px; }
.dot { width: 26px; height: 26px; border-radius: 50%; border: 1.2px solid ${C.dourado}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
.dot.on { background: ${C.dourado}; color: ${C.off}; }
`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Agenda de Natal 2026 — Mayara Dias | Studio Beauty</title><style>${CSS}</style></head><body>${DEFS}${p1}${p2}${p3}${p4}</body></html>`;
fs.mkdirSync(path.join(DIR, 'build'), { recursive: true });
fs.writeFileSync(path.join(DIR, 'build', 'agenda.html'), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => {
  const rng = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const ff = (n) => Math.round(n * 10) / 10;
  document.querySelectorAll('[data-torn]').forEach((el) => {
    const w = el.offsetWidth, h = el.offsetHeight, r = rng(+el.dataset.torn), jag = 5, step = 9, pts = [];
    const edge = (x0, y0, x1, y1, nx, ny) => { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let i = 0; i < n; i++) { const t = i / n, d = r() * jag; pts.push(ff(x0 + (x1 - x0) * t + nx * d) + ',' + ff(y0 + (y1 - y0) * t + ny * d)); } };
    edge(0, 0, w, 0, 0, 1); edge(w, 0, w, h, -1, 0); edge(w, h, 0, h, 0, -1); edge(0, h, 0, 0, 1, 0);
    const d = 'M' + pts.join('L') + 'Z';
    const svg = `<svg class="paper" style="left:0;top:0" width="${w + 6}" height="${h + 8}" viewBox="0 0 ${w + 6} ${h + 8}"><path d="${d}" transform="translate(2.2,3.4)" fill="rgba(89,55,40,.16)"/><path d="${d}" transform="translate(.8,1.2)" fill="rgba(89,55,40,.10)"/><path d="${d}" fill="${el.dataset.fill}"/></svg>`;
    el.insertAdjacentHTML('afterbegin', svg);
  });
});
// confere se algo transborda a página
const overflow = await page.evaluate(() => [...document.querySelectorAll('.page')].map((p) => {
  const pb = p.getBoundingClientRect(); const nav = p.querySelector('.nav'); const nb = nav ? nav.getBoundingClientRect().top : pb.bottom;
  const last = [...p.children].filter((c) => !c.classList.contains('abs') && !c.classList.contains('nav') && !c.classList.contains('bgblob') && getComputedStyle(c).position !== 'absolute');
  const bottom = Math.max(...last.map((c) => c.getBoundingClientRect().bottom));
  return { id: p.id, folga: Math.round(nb - bottom) };
}));
console.log('Espaço livre acima da navegação (px):', overflow);
if (overflow.some((o) => o.folga < 0)) console.warn('ATENÇÃO: conteúdo passou do limite em', overflow.filter((o) => o.folga < 0).map((o) => o.id).join(', '), '— reduza os textos/linhas em dados.json.');
await page.pdf({ path: OUT, width: '540px', height: '960px', printBackground: true, preferCSSPageSize: true });
await browser.close();
try {
  const { execFileSync } = await import('node:child_process');
  console.log(execFileSync('python3', [path.join(DIR, 'pos_processar.py'), OUT], { encoding: 'utf8' }).trim());
} catch (e) { console.warn('Aviso: pós-processamento não executado (requer python3 + pypdf). Os links continuam funcionando.', e.message); }
console.log('PDF gerado:', OUT, temFoto ? '(com foto)' : '(SEM foto — coloque o arquivo em ' + D.foto + ')');
