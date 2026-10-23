/* Painel editorial — Dra. Lívia Serpa
 * Aplicação estática (sem build). Persistência: localStorage deste navegador. */
(function () {
  'use strict';

  const D = window.LS_DATA;
  const KEY = 'ls-dashboard-v1';
  const IMG_KEY = 'ls-dashboard-v1-images';
  const WORDS_PER_MIN = 150;
  const RECORDED = 'gravado';

  /* ---------------- Utilidades ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const parseISO = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const toISO = (dt) => `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  const fmtDate = (iso) => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };
  const fmtShort = (iso) => { const [, m, d] = iso.split('-'); return `${d}/${m}`; };
  const todayISO = () => toISO(new Date());
  const reelById = (id) => D.reels.find((r) => r.id === Number(id));
  const statusInfo = (key) => D.statuses.find((s) => s.key === key) || D.statuses[0];
  const statusIdx = (key) => D.statuses.findIndex((s) => s.key === key);
  const sorted = () => [...D.reels].sort((a, b) => a.date.localeCompare(b.date));

  /* ---------------- Estado ---------------- */
  function defaultState() {
    const reels = {};
    D.reels.forEach((r) => {
      reels[r.id] = {
        status: 'pronto', checklist: D.checklist.map(() => false), notes: '', fileLink: '', pubLink: '',
        realDuration: '', scriptOverride: null, metrics: {}
      };
    });
    const sessions = {};
    D.sessions.forEach((s) => { sessions[s.id] = s.items.map(() => false); });
    return { v: 1, reels, sessions, prefs: { readSize: 26, calMode: 'month' }, updatedAt: null };
  }

  function mergeState(base, saved) {
    if (!saved || typeof saved !== 'object') return base;
    if (saved.reels) {
      Object.keys(base.reels).forEach((id) => {
        const s = saved.reels[id];
        if (!s) return;
        const b = base.reels[id];
        if (statusIdx(s.status) >= 0) b.status = s.status;
        if (Array.isArray(s.checklist)) b.checklist = b.checklist.map((v, i) => Boolean(s.checklist[i]));
        ['notes', 'fileLink', 'pubLink', 'realDuration'].forEach((k) => { if (typeof s[k] === 'string') b[k] = s[k]; });
        if (typeof s.scriptOverride === 'string') b.scriptOverride = s.scriptOverride;
        if (s.metrics && typeof s.metrics === 'object') {
          D.metrics.forEach((m) => { if (s.metrics[m.key] !== undefined && s.metrics[m.key] !== null) b.metrics[m.key] = String(s.metrics[m.key]); });
        }
      });
    }
    if (saved.sessions) {
      Object.keys(base.sessions).forEach((id) => {
        if (Array.isArray(saved.sessions[id])) base.sessions[id] = base.sessions[id].map((v, i) => Boolean(saved.sessions[id][i]));
      });
    }
    if (saved.prefs) Object.assign(base.prefs, saved.prefs);
    base.updatedAt = saved.updatedAt || null;
    return base;
  }

  let storageOk = true;
  function load() {
    let st = defaultState();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) st = mergeState(st, JSON.parse(raw));
    } catch (e) { storageOk = false; }
    return st;
  }
  function loadImages() {
    try { return JSON.parse(localStorage.getItem(IMG_KEY) || '{}') || {}; } catch (e) { return {}; }
  }

  const state = load();
  let images = loadImages();

  function save() {
    state.updatedAt = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOk = true; return true; } catch (e) {
      storageOk = false; toast('Não foi possível salvar neste navegador. Exporte um backup para não perder as alterações.'); return false;
    }
  }
  function saveImages() {
    try { localStorage.setItem(IMG_KEY, JSON.stringify(images)); return true; } catch (e) {
      toast('Imagem grande demais para o armazenamento deste navegador. Tente uma foto menor.'); return false;
    }
  }
  let saveTimer = null;
  function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 350); }

  function setPath(path, value) {
    const parts = path.split('.');
    let obj = state;
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
    obj[parts[parts.length - 1]] = value;
  }

  const ui = {
    filters: { q: '', week: '', date: '', pillar: '', objective: '', style: '', status: '' },
    calMonth: null, calWeek: null, editing: {}, cmpBy: 'pillar', cmpMetric: 'views',
    uploadTarget: null, lastRoute: null, wakeLock: null, navDepth: 0
  };

  /* ---------------- Derivados ---------------- */
  const rs = (id) => state.reels[id];
  const scriptOf = (r) => rs(r.id).scriptOverride ?? r.script;
  const paragraphs = (t) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const hookOf = (r) => paragraphs(scriptOf(r))[0] || '';
  const wordCount = (t) => t.split(/\s+/).filter(Boolean).length;
  const estimateSec = (r) => Math.round((wordCount(scriptOf(r)) / WORDS_PER_MIN) * 60);
  const isRecorded = (id) => statusIdx(rs(id).status) >= statusIdx(RECORDED);
  const checklistDone = (id) => rs(id).checklist.filter(Boolean).length;

  function parseDuration(str) {
    const s = String(str || '').trim().toLowerCase().replace(/\s/g, '');
    if (!s) return null;
    let m = s.match(/^(\d{1,2}):(\d{1,2})$/);
    if (m) return Number(m[1]) * 60 + Number(m[2]);
    m = s.match(/^(\d{1,3})(s|seg|segundos)?$/);
    if (m) return Number(m[1]);
    return NaN;
  }
  function durationFlag(id) {
    const sec = parseDuration(rs(id).realDuration);
    if (sec === null) return '<span class="muted small">Registre a duração após o ensaio ou a gravação (ex.: 52 ou 0:52).</span>';
    if (Number.isNaN(sec)) return '<span class="chip warn">Formato não reconhecido — use 52 ou 0:52</span>';
    if (sec < 40 || sec > 60) return `<span class="chip warn">${icon('alert')} ${sec} s — fora da faixa 40–60 s: ajustar roteiro</span>`;
    return `<span class="chip" style="color:var(--ok)">${icon('check')} ${sec} s — dentro da faixa</span>`;
  }
  function estimateHTML(r) {
    const sec = estimateSec(r);
    const out = sec < 40 || sec > 60;
    return `~${sec} s <span class="muted small">(${wordCount(scriptOf(r))} palavras, ≈${WORDS_PER_MIN} palavras/min)</span>` +
      (out ? `<div class="dur-flag"><span class="chip warn">${icon('alert')} Estimativa fora de 40–60 s: confirmar no ensaio</span></div>` : '');
  }

  function nextToRecord() {
    return sorted().find((r) => !isRecorded(r.id)) || null;
  }
  function nextPublication() {
    const t = todayISO();
    return sorted().find((r) => r.date >= t && rs(r.id).status !== 'publicado') || sorted().find((r) => rs(r.id).status !== 'publicado') || null;
  }
  function weekRange(n) {
    const list = D.reels.filter((r) => r.week === n).map((r) => r.date).sort();
    const mon = parseISO(list[0]);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    return { start: list[0], end: list[list.length - 1], monday: toISO(mon), sunday: toISO(sun) };
  }
  function focusWeek() {
    const t = todayISO();
    for (let n = 1; n <= 5; n++) {
      const w = weekRange(n);
      if (t >= w.monday && t <= w.sunday) return { n, mode: 'current' };
    }
    if (t < weekRange(1).monday) return { n: 1, mode: 'before' };
    return { n: 5, mode: 'after' };
  }
  const sessionOf = (id) => D.sessions.find((s) => s.reels.includes(Number(id)));

  /* ---------------- Ícones ---------------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    video: '<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10 6-3.5v11l-6-3.5"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20"/><path d="M9 7h7M9 11h5"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    kanban: '<rect x="3" y="3.5" width="5" height="17" rx="1.5"/><rect x="10" y="3.5" width="5" height="11" rx="1.5"/><rect x="17" y="3.5" width="4" height="7" rx="1.5"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L6 21"/>',
    chart: '<path d="M3 21h18"/><rect x="5" y="11" width="3" height="7"/><rect x="10.5" y="6" width="3" height="12"/><rect x="16" y="13" width="3" height="5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    check: '<path d="m4 12.5 5 5L20 6.5"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    right: '<path d="M9 18l6-6-6-6"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    read: '<path d="M4 4h6v6H4zM14 14h6v6h-6z" opacity=".0"/><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 18v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"/>'
  };
  function icon(name) {
    return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  }

  /* ---------------- Ilustração de composição (não é foto) ---------------- */
  function illo(key) {
    const s = D.styles[key];
    const t = { A: 'translate(90 198) scale(1.18)', B: 'translate(96 210) scale(1.3) rotate(-5)', C: 'translate(90 226) scale(1.65)', D: 'translate(90 186) scale(.92)' }[key];
    const skin = '#D7AA8E', hair = '#2F1F17', o = s.outfitHex;
    const neckline = s.blazer
      ? `<path d="M-15 0 L0 50 L15 0Z" fill="#FBFAF7"/><path d="M-16 0 L-3 56 L-24 32Z M16 0 L3 56 L24 32Z" fill="rgba(0,0,0,.14)"/>`
      : `<path d="M-10 0 L0 15 L10 0Z" fill="${skin}"/><path d="M-11 0 L0 16 L11 0" stroke="rgba(0,0,0,.12)" stroke-width="1.5" fill="none"/><path d="M0 18v150" stroke="rgba(0,0,0,.07)" stroke-width="1.5"/>`;
    const arms = key === 'D'
      ? `<path d="M-50 34 Q-64 92 -30 100 L-22 88 Q-42 80 -36 50Z" fill="${o}" stroke="rgba(0,0,0,.1)"/><ellipse cx="-22" cy="88" rx="8" ry="7" fill="${skin}"/>
         <path d="M50 34 Q68 80 40 82 L33 72 Q48 66 40 50Z" fill="${o}" stroke="rgba(0,0,0,.1)"/><ellipse cx="33" cy="72" rx="8" ry="7" fill="${skin}"/>`
      : '';
    const chair = key === 'B' ? '<rect x="44" y="196" width="96" height="140" rx="18" fill="#3B271C" opacity=".45"/>' : '';
    return `<svg viewBox="0 0 180 320" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustração de composição do estilo ${esc(s.name)} — não é foto da Lívia">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7B5540"/><stop offset="1" stop-color="#5B3D2C"/></linearGradient>
        <radialGradient id="glow" cx=".5" cy=".38" r=".62"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="180" height="320" fill="url(#wall)"/><rect width="180" height="320" fill="url(#glow)"/>
      ${chair}
      <g transform="${t}">
        <ellipse cx="0" cy="-46" rx="25" ry="28" fill="${hair}"/>
        <path d="M-25 -48 Q-30 -8 -31 10 L31 10 Q30 -8 25 -48Z" fill="${hair}"/>
        <rect x="-8" y="-24" width="16" height="28" rx="6" fill="${skin}"/>
        <path d="M-15 0 Q-48 4 -58 26 L-64 220 L64 220 L58 26 Q48 4 15 0Z" fill="${o}" stroke="rgba(0,0,0,.08)"/>
        ${neckline}
        <ellipse cx="0" cy="-42" rx="19" ry="23" fill="${skin}"/>
        <path d="M-21 -42 Q-20 -72 1 -70 Q23 -70 21 -41 Q14 -59 -1 -60 Q-15 -57 -21 -42Z" fill="${hair}"/>
        ${arms}
      </g>
      <g font-family="Inter, sans-serif" font-size="7" fill="#fff" fill-opacity=".75">
        <rect width="180" height="34" fill="#fff" fill-opacity=".07"/><line x1="0" y1="34" x2="180" y2="34" stroke="#fff" stroke-opacity=".45" stroke-dasharray="3 3"/>
        <text x="8" y="22">área de título</text>
        <rect y="278" width="180" height="42" fill="#fff" fill-opacity=".07"/><line x1="0" y1="278" x2="180" y2="278" stroke="#fff" stroke-opacity=".45" stroke-dasharray="3 3"/>
        <text x="8" y="292">área de legendas</text>
      </g>
    </svg>`;
  }
  function stylePhoto(key) {
    if (images[key]) return `<img src="${images[key]}" alt="Foto de referência do estilo ${esc(D.styles[key].name)}, anexada pela equipe">`;
    return illo(key);
  }
  function photoCaption(key) {
    return images[key] ? 'Referência anexada pela equipe' : 'Ilustração de composição — não é foto da Lívia';
  }

  /* ---------------- Componentes ---------------- */
  function statusPill(key) {
    const s = statusInfo(key);
    return `<span class="status-pill" style="background:${s.color}1A;color:${s.color}"><span class="dot" style="background:${s.color}"></span>${esc(s.label)}</span>`;
  }
  function statusSelect(id, extraClass = '') {
    return `<select class="input ${extraClass}" data-status="${id}" aria-label="Status do Reels ${pad(id)}">${D.statuses.map((s) => `<option value="${s.key}" ${rs(id).status === s.key ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}</select>`;
  }
  function styleChip(key) { return `<span class="chip">${key} · ${esc(D.styles[key].name)}</span>`; }
  function recordButton(id, size = '') {
    if (isRecorded(id)) return `<span class="btn done ${size}">${icon('check')} Gravado</span>`;
    return `<button class="btn rose ${size}" data-action="mark-recorded" data-id="${id}">${icon('check')} Marcar como gravado</button>`;
  }
  function pageHead(eyebrow, title, lead, actions = '') {
    return `<div class="page-head"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div>${actions ? `<div class="btn-row">${actions}</div>` : ''}</div>`;
  }
  function bars(rows, rose = false) {
    const max = Math.max(1, ...rows.map((r) => r.value));
    return `<div class="bars">${rows.map((r) => `<div class="bar-row"><span>${esc(r.label)}</span><div class="bar-track"><div class="bar-fill ${rose ? 'rose' : ''}" style="width:${(r.value / max) * 100}%"></div></div><span class="v">${r.display ?? r.value}</span></div>`).join('')}</div>`;
  }

  /* ---------------- Navegação ---------------- */
  const NAV = [
    { group: 'Para a Lívia' },
    { r: 'next', label: 'Meu próximo vídeo', icon: 'video', highlight: true },
    { r: 'my', label: 'Todos os meus roteiros', icon: 'user' },
    { group: 'Equipe' },
    { r: 'overview', label: 'Visão geral', icon: 'home' },
    { r: 'calendar', label: 'Calendário editorial', icon: 'calendar' },
    { r: 'library', label: 'Biblioteca de roteiros', icon: 'book' },
    { r: 'guide', label: 'Guia visual de gravação', icon: 'image' },
    { r: 'production', label: 'Produção', icon: 'kanban' },
    { r: 'results', label: 'Resultados', icon: 'chart' }
  ];
  function activeKey(route) {
    if (route[0] === 'reel') return 'library';
    return route[0] || 'overview';
  }
  function renderNav(route) {
    const act = activeKey(route);
    $('#sideNav').innerHTML = NAV.map((n) => n.group
      ? `<div class="nav-group">${n.group}</div>`
      : `<a href="#/${n.r}" class="${n.highlight ? 'highlight' : ''} ${act === n.r ? 'active' : ''}">${icon(n.icon)}${n.label}</a>`).join('');
    const bottom = [
      { r: 'overview', label: 'Início', icon: 'home' },
      { r: 'next', label: 'Meu vídeo', icon: 'video' },
      { r: 'library', label: 'Roteiros', icon: 'book' },
      { r: 'calendar', label: 'Calendário', icon: 'calendar' }
    ];
    const moreActive = ['my', 'guide', 'production', 'results'].includes(act);
    $('#bottomNav').innerHTML = bottom.map((n) => `<a href="#/${n.r}" class="${act === n.r ? 'active' : ''}">${icon(n.icon)}<span>${n.label}</span></a>`).join('') +
      `<button data-action="open-sheet" class="${moreActive ? 'active' : ''}">${icon('more')}<span>Mais</span></button>`;
    const logoImg = images.logo ? `<img src="${images.logo}" alt="Logotipo Lívia Serpa">` : '';
    [['#logoSlot', 'Logotipo<br>LS'], ['#logoSlotTop', 'LS']].forEach(([sel, ph]) => { const el = $(sel); el.innerHTML = logoImg || ph; el.classList.toggle('has-img', Boolean(images.logo)); });
    $('#storageNote').innerHTML = storageOk
      ? 'Os dados ficam salvos <b>neste navegador</b>. Não há sincronização entre dispositivos: use “Backup completo” e “Importar backup” para transferir.'
      : '<b>Armazenamento indisponível</b> neste navegador (modo privado?). As alterações serão perdidas ao fechar — exporte um backup.';
  }

  function openSheet() {
    const sheet = $('#sheet');
    sheet.innerHTML = `<div class="sheet" role="dialog" aria-label="Mais opções"><div class="sheet-handle"></div>
      <a href="#/my">${icon('user')} Todos os meus roteiros</a>
      <a href="#/production">${icon('kanban')} Produção</a>
      <a href="#/guide">${icon('image')} Guia visual de gravação</a>
      <a href="#/results">${icon('chart')} Resultados</a>
      <p class="side-label">Exportar e backup</p>
      <button class="sheet-link" data-action="export-md">${icon('download')} Roteiros (.md)</button>
      <button class="sheet-link" data-action="export-csv">${icon('download')} Cronograma (.csv)</button>
      <button class="sheet-link" data-action="export-json">${icon('download')} Backup completo (.json)</button>
      <button class="sheet-link" data-action="import-json">${icon('upload')} Importar backup</button>
      <p class="muted small" style="margin:14px 4px 0">Dados salvos apenas neste aparelho. Para usar em outro dispositivo, exporte o backup e importe lá.</p>
    </div>`;
    sheet.hidden = false;
  }
  function closeSheet() { $('#sheet').hidden = true; $('#sheet').innerHTML = ''; }

  /* ---------------- Página 1 — Visão geral ---------------- */
  function viewOverview() {
    const counts = {};
    D.statuses.forEach((s) => { counts[s.key] = 0; });
    D.reels.forEach((r) => { counts[rs(r.id).status]++; });
    const progress = Math.round((D.reels.reduce((a, r) => a + statusIdx(rs(r.id).status), 0) / (6 * D.reels.length)) * 100);
    const checks = D.reels.reduce((a, r) => a + checklistDone(r.id), 0);
    const checkPct = Math.round((checks / (D.reels.length * D.checklist.length)) * 100);
    const np = nextPublication();
    const fw = focusWeek();
    const fwRange = weekRange(fw.n);

    const pend = [];
    D.reels.filter((r) => r.week === fw.n).forEach((r) => {
      const st = rs(r.id);
      const nextIdx = st.checklist.findIndex((v) => !v);
      const tasks = [];
      if (nextIdx >= 0) tasks.push(`Próximo passo: <b>${esc(D.checklist[nextIdx])}</b>`);
      else tasks.push('Checklist completo');
      if (r.commercial && !st.checklist[3]) tasks.push(`<span class="chip warn">${icon('alert')} Validação comercial pendente</span>`);
      pend.push(`<li><span class="pend-num">${pad(r.id)}</span><div><a href="#/reel/${r.id}">${esc(r.title)}</a><div class="small muted">${r.weekday}, ${fmtDate(r.date)} · ${statusPill(st.status)}</div><div class="small" style="margin-top:4px">${tasks.join(' · ')}</div></div></li>`);
    });
    const upcoming = fw.n < 5 ? D.reels.filter((r) => r.week === fw.n + 1 && !isRecorded(r.id)) : [];
    const commercialOpen = D.reels.filter((r) => r.commercial && !rs(r.id).checklist[3]);

    const weekLabel = fw.mode === 'before' ? 'Primeira semana da campanha' : fw.mode === 'after' ? 'Última semana da campanha' : 'Semana atual';

    const timeline = [1, 2, 3, 4, 5].map((n) => {
      const w = weekRange(n);
      return `<div class="tl-week ${n === fw.n && fw.mode === 'current' ? 'current' : ''}"><h4>Semana ${n}</h4><div class="range">${fmtShort(w.start)} – ${fmtShort(w.end)}</div>
        ${D.reels.filter((r) => r.week === n).map((r) => `<a class="tl-item" href="#/reel/${r.id}"><span class="dot" style="background:${statusInfo(rs(r.id).status).color}"></span><span><b>${pad(r.id)}</b> · ${esc(r.theme)}<br><span class="muted">${r.weekday.slice(0, 3)} ${fmtShort(r.date)} · ${r.style}</span></span></a>`).join('')}</div>`;
    }).join('');

    const group = (field) => {
      const m = {};
      D.reels.forEach((r) => { m[r[field]] = (m[r[field]] || 0) + 1; });
      return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
    };
    const styleRows = ['A', 'B', 'C', 'D'].map((k) => ({ label: `${k} · ${D.styles[k].name}`, value: D.reels.filter((r) => r.style === k).length }));

    return `
      <section class="hero">
        <div>
          <p class="eyebrow">Campanha de Reels · Instagram</p>
          <h1>15 Reels, 5 semanas, um único cenário.</h1>
          <p>${fmtDate(D.campaign.start)} a ${fmtDate(D.campaign.end)} · segunda, quarta e sexta · 9:16 · 40–60 s por vídeo.</p>
          <div style="margin-top:20px"><div class="progress" style="background:rgba(255,255,255,.12)"><span style="width:${progress}%"></span></div>
          <p class="small" style="margin-top:8px">Progresso geral da produção: <b style="color:#fff">${progress}%</b> · checklists: ${checkPct}% concluídos</p></div>
        </div>
        ${np ? `<a class="hero-next" href="#/reel/${np.id}"><span class="label">Próxima publicação</span><h3>${pad(np.id)} · ${esc(np.title)}</h3>
          <div class="meta">${np.weekday}, ${fmtDate(np.date)} · Estilo ${np.style} — ${D.styles[np.style].name}</div>
          <div style="margin-top:10px">${statusPill(rs(np.id).status)}</div></a>`
        : '<div class="hero-next"><span class="label">Campanha concluída</span><h3>Todos os Reels publicados</h3></div>'}
      </section>

      <div class="kpis">
        <div class="kpi total"><div class="kpi-label">Total de Reels</div><div class="kpi-value">${D.reels.length}</div></div>
        ${D.statuses.map((s) => `<a class="kpi" href="#/production" style="text-decoration:none"><div class="kpi-label"><span class="dot" style="background:${s.color}"></span>${s.label}</div><div class="kpi-value">${counts[s.key]}</div></a>`).join('')}
      </div>

      <div class="grid grid-2">
        <section class="card">
          <div class="card-title"><h2>Pendências da semana</h2><span class="chip rose">${weekLabel} · ${fmtShort(fwRange.start)}–${fmtShort(fwRange.end)}</span></div>
          <ul class="pend-list">${pend.join('')}</ul>
          ${upcoming.length ? `<div class="alert info" style="margin-top:14px">${icon('video')}<div>Ainda não gravados para a semana seguinte: ${upcoming.map((r) => `<a href="#/reel/${r.id}">${pad(r.id)}</a>`).join(', ')}.</div></div>` : ''}
        </section>
        <section class="card">
          <div class="card-title"><h2>Validação comercial</h2><span class="chip warn">${commercialOpen.length} pendente${commercialOpen.length === 1 ? '' : 's'}</span></div>
          <p class="muted small" style="margin-top:0">Cursos específicos ainda precisam de confirmação comercial. Não inventar nomes de cursos ativos, preços, turmas, vagas, certificados ou datas de matrícula.</p>
          ${commercialOpen.length ? `<ul class="pend-list">${commercialOpen.map((r) => `<li><span class="pend-num">${pad(r.id)}</span><div><a href="#/reel/${r.id}">${esc(r.title)}</a><div class="small muted">${fmtDate(r.date)}</div><div class="small">${esc(r.commercial)}</div></div></li>`).join('')}</ul>`
          : '<div class="empty"><h3>Tudo validado</h3><p>Todos os CTAs comerciais foram confirmados.</p></div>'}
        </section>
      </div>

      <section class="card" style="margin-top:20px">
        <div class="card-title"><h2>Linha do tempo · 5 semanas</h2><a class="btn sm" href="#/calendar">Abrir calendário</a></div>
        <div class="timeline">${timeline}</div>
      </section>

      <section class="card">
        <div class="card-title"><h2>Equilíbrio estratégico</h2></div>
        <div class="grid grid-3">
          <div><p class="label">Por objetivo</p>${bars(group('objective'))}</div>
          <div><p class="label">Por tema editorial</p>${bars(group('pillar'), true)}</div>
          <div><p class="label">Por estilo de gravação</p>${bars(styleRows)}</div>
        </div>
        <p class="muted small" style="margin:16px 0 0">${esc(D.campaign.complement)}</p>
      </section>`;
  }

  /* ---------------- Página 2 — Calendário ---------------- */
  function evChip(r) {
    const c = statusInfo(rs(r.id).status).color;
    return `<a class="ev" href="#/reel/${r.id}" style="border-left-color:${c}" title="${esc(r.title)}"><b>${pad(r.id)}</b> <span class="ev-title">${esc(r.theme)}</span><span class="ev-meta">${esc(r.objective)} · ${r.style}</span></a>`;
  }
  function viewCalendar() {
    const mode = state.prefs.calMode || 'month';
    if (!ui.calMonth) {
      const ref = parseISO(todayISO() < D.campaign.start ? D.campaign.start : (nextPublication() || D.reels[0]).date);
      ui.calMonth = { y: ref.getFullYear(), m: ref.getMonth() };
    }
    if (!ui.calWeek) ui.calWeek = focusWeek().n;
    const seg = `<div class="seg" role="tablist">${[['month', 'Mês'], ['week', 'Semana'], ['list', 'Lista']].map(([k, l]) => `<button class="${mode === k ? 'on' : ''}" data-action="cal-mode" data-mode="${k}" role="tab" aria-selected="${mode === k}">${l}</button>`).join('')}</div>`;
    const legend = `<div class="btn-row" style="gap:12px">${D.statuses.map((s) => `<span class="small" style="display:inline-flex;align-items:center;gap:6px"><span class="dot" style="background:${s.color}"></span>${s.label}</span>`).join('')}</div>`;
    let body = '';

    if (mode === 'month') {
      const { y, m } = ui.calMonth;
      const first = new Date(y, m, 1);
      const offset = (first.getDay() + 6) % 7;
      const days = new Date(y, m + 1, 0).getDate();
      const weeks = Math.ceil((offset + days) / 7);
      const byDate = {};
      D.reels.forEach((r) => { (byDate[r.date] = byDate[r.date] || []).push(r); });
      const t = todayISO();
      let cells = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => `<div class="dow">${d}</div>`).join('');
      for (let i = 0; i < weeks * 7; i++) {
        const dt = new Date(y, m, 1 - offset + i);
        const iso = toISO(dt);
        cells += `<div class="day ${dt.getMonth() !== m ? 'out' : ''} ${iso === t ? 'today' : ''}"><span class="dnum">${dt.getDate()}</span>${(byDate[iso] || []).map(evChip).join('')}</div>`;
      }
      const mName = first.toLocaleDateString('pt-BR', { month: 'long' });
      const title = `${mName.charAt(0).toUpperCase()}${mName.slice(1)} de ${y}`;
      const monthReels = sorted().filter((r) => { const d = parseISO(r.date); return d.getFullYear() === y && d.getMonth() === m; });
      body = `<div class="cal-toolbar"><div class="cal-nav"><button class="icon-btn" data-action="cal-prev" aria-label="Mês anterior">${icon('left')}</button><h2>${title}</h2><button class="icon-btn" data-action="cal-next" aria-label="Próximo mês">${icon('right')}</button></div>${legend}</div>
        <div class="month">${cells}</div>
        <div class="month-list-mobile" style="margin-top:18px">${monthReels.length ? listCards(monthReels) : '<p class="muted">Nenhuma publicação neste mês.</p>'}</div>`;
    } else if (mode === 'week') {
      const tabs = [1, 2, 3, 4, 5].map((n) => { const w = weekRange(n); return `<button class="btn sm ${ui.calWeek === n ? 'primary' : ''}" data-action="cal-week" data-week="${n}">Semana ${n} · ${fmtShort(w.start)}–${fmtShort(w.end)}</button>`; }).join('');
      body = `<div class="cal-toolbar"><div class="week-tabs">${tabs}</div></div>
        <div class="week-grid">${D.reels.filter((r) => r.week === ui.calWeek).map(pubCard).join('')}</div>`;
    } else {
      body = `<div class="cal-toolbar">${legend}</div><div class="table-wrap"><table class="list-table"><thead><tr><th>Nº</th><th>Data</th><th>Título</th><th>Categoria</th><th>Objetivo</th><th>Estilo</th><th>Status</th></tr></thead><tbody>
        ${sorted().map((r) => `<tr data-href="#/reel/${r.id}" style="box-shadow: inset 4px 0 0 ${statusInfo(rs(r.id).status).color}"><td><b>${pad(r.id)}</b></td><td style="white-space:nowrap">${r.weekday.slice(0, 3)}, ${fmtDate(r.date)}</td><td><a href="#/reel/${r.id}" style="text-decoration:none;font-weight:600">${esc(r.title)}</a></td><td>${esc(r.pillar)}</td><td>${esc(r.objective)}<div class="small muted">${esc(r.goal)}</div></td><td>${styleChip(r.style)}</td><td>${statusPill(rs(r.id).status)}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    return pageHead('Calendário editorial', 'Calendário', 'Três publicações por semana: segunda, quarta e sexta. Toque em um conteúdo para abrir o roteiro completo.', seg) + body;
  }
  function pubCard(r) {
    const st = rs(r.id).status;
    return `<a class="card pub-card" href="#/reel/${r.id}" style="border-top-color:${statusInfo(st).color}">
      <span class="pub-date">${r.weekday}, ${fmtDate(r.date)}</span><h3>${pad(r.id)} · ${esc(r.title)}</h3>
      <dl class="kv"><dt>Categoria</dt><dd>${esc(r.pillar)}</dd><dt>Objetivo</dt><dd>${esc(r.objective)} — ${esc(r.goal)}</dd><dt>Estilo</dt><dd>${r.style} · ${esc(D.styles[r.style].name)}</dd><dt>Status</dt><dd>${statusPill(st)}</dd></dl></a>`;
  }
  function listCards(list) {
    return `<div class="stack">${list.map(pubCard).join('')}</div>`;
  }

  /* ---------------- Página 3 — Biblioteca ---------------- */
  function filteredReels() {
    const f = ui.filters;
    const q = f.q.trim().toLowerCase();
    return sorted().filter((r) =>
      (!f.week || r.week === Number(f.week)) && (!f.date || r.date === f.date) && (!f.pillar || r.pillar === f.pillar) &&
      (!f.objective || r.objective === f.objective) && (!f.style || r.style === f.style) && (!f.status || rs(r.id).status === f.status) &&
      (!q || [r.title, r.theme, scriptOf(r), r.screenText, r.cta].join(' ').toLowerCase().includes(q)));
  }
  function filterSelect(name, label, options) {
    return `<select class="input" data-filter="${name}" aria-label="${label}"><option value="">${label}: todos</option>${options.map(([v, l]) => `<option value="${esc(v)}" ${String(ui.filters[name]) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  }
  function reelCard(r) {
    const st = rs(r.id);
    return `<article class="card reel-card" data-href="#/reel/${r.id}">
      <button class="thumb" data-action="style-modal" data-style="${r.style}" data-id="${r.id}" aria-label="Ver instruções do estilo ${esc(D.styles[r.style].name)}">${stylePhoto(r.style)}<span class="thumb-badge">${pad(r.id)}</span><span class="thumb-style">Estilo ${r.style} · ${esc(D.styles[r.style].name)}</span></button>
      <div class="body">
        <span class="pub-date">${r.weekday}, ${fmtDate(r.date)} · Semana ${r.week}</span>
        <h3>${esc(r.title)}</h3>
        <div class="meta"><span class="chip rose">${esc(r.objective)}</span><span class="chip">${esc(r.pillar)}</span>${r.commercial ? `<span class="chip warn">${icon('alert')} Validar CTA</span>` : ''}</div>
        <div class="foot">${statusPill(st.status)}<span>~${estimateSec(r)} s · ${checklistDone(r.id)}/${D.checklist.length}</span></div>
      </div></article>`;
  }
  function viewLibrary() {
    const list = filteredReels();
    const f = ui.filters;
    const active = Object.values(f).some(Boolean);
    return pageHead('Biblioteca de roteiros', 'Os 15 roteiros', 'Roteiros integrais com direção de gravação individual. Toque na foto para ver as instruções do estilo.') +
      `<div class="filters">
        <input class="input search" type="search" placeholder="Buscar no título ou no roteiro…" value="${esc(f.q)}" data-filter="q" aria-label="Buscar">
        ${filterSelect('week', 'Semana', [1, 2, 3, 4, 5].map((n) => [n, `Semana ${n}`]))}
        ${filterSelect('date', 'Data', sorted().map((r) => [r.date, `${fmtShort(r.date)} · ${r.weekday}`]))}
        ${filterSelect('pillar', 'Categoria', Object.keys(D.pillars).map((p) => [p, p]))}
        ${filterSelect('objective', 'Objetivo', [...new Set(D.reels.map((r) => r.objective))].map((o) => [o, o]))}
        ${filterSelect('style', 'Estilo', ['A', 'B', 'C', 'D'].map((k) => [k, `${k} · ${D.styles[k].name}`]))}
        ${filterSelect('status', 'Status', D.statuses.map((s) => [s.key, s.label]))}
      </div>
      <p class="muted small" style="margin:-8px 0 16px">${list.length} de ${D.reels.length} roteiros ${active ? '· <button class="link-btn" style="color:var(--navy-2);text-decoration:underline" data-action="clear-filters">limpar filtros</button>' : ''}</p>
      ${list.length ? `<div class="reel-grid">${list.map(reelCard).join('')}</div>` : '<div class="card empty"><h3>Nenhum roteiro encontrado</h3><p>Ajuste os filtros para ver mais conteúdos.</p></div>'}`;
  }

  /* ---------------- Página do Reels ---------------- */
  function viewReel(id) {
    const r = reelById(id);
    if (!r) return notFound();
    const st = rs(r.id);
    const s = D.styles[r.style];
    const editing = ui.editing[r.id];
    const prev = reelById(r.id - 1), next = reelById(r.id + 1);

    return `<a class="back" href="#/library">${icon('left')} Biblioteca</a>
      <div class="reel-head">
        <div><span class="reel-num">Reels ${pad(r.id)}</span>
          <h1 style="margin-top:6px">${esc(r.title)}</h1>
          <div class="btn-row" style="margin-top:12px;gap:8px"><span class="chip navy">${r.weekday}, ${fmtDate(r.date)}</span><span class="chip rose">${esc(r.objective)}</span><span class="chip">${esc(r.pillar)}</span>${styleChip(r.style)}${statusPill(st.status)}</div>
        </div>
        <div class="btn-row">
          <button class="btn" data-action="copy" data-id="${r.id}">${icon('copy')} Copiar roteiro</button>
          <a class="btn primary" href="#/read/${r.id}">${icon('read')} Leitura para gravação</a>
          ${recordButton(r.id)}
        </div>
      </div>
      ${r.commercial ? `<div class="alert" style="margin-bottom:20px">${icon('alert')}<div><strong>Informação comercial a validar.</strong> ${esc(r.commercial)}${st.checklist[3] ? ' <b>(marcado como confirmado no checklist)</b>' : ''}</div></div>` : ''}

      <div class="detail">
        <div class="stack">
          <section class="card">
            <div class="info-grid">
              <div class="info-item full"><span class="label">Objetivo</span><div class="val">${esc(r.goal)}</div></div>
              <div class="info-item"><span class="label">Duração</span><div class="val">Alvo: ${esc(r.target)} <span class="muted small">(obrigatório 40–60 s)</span><br>Estimativa: ${estimateHTML(r)}</div></div>
              <div class="info-item"><span class="label">Duração real</span>
                <input class="input" style="max-width:160px" placeholder="ex.: 0:52" value="${esc(st.realDuration)}" data-bind="reels.${r.id}.realDuration" data-live="dur" data-id="${r.id}" aria-label="Duração real">
                <div class="dur-flag" id="durFlag-${r.id}">${durationFlag(r.id)}</div></div>
            </div>
          </section>

          <section class="card">
            <p class="label">Gancho</p>
            <p class="hook">${esc(hookOf(r))}</p>
          </section>

          <section class="card">
            <div class="card-title"><h2>Roteiro integral</h2>
              <div class="btn-row">${st.scriptOverride !== null ? '<span class="chip warn">Editado pela equipe</span>' : ''}
              ${editing ? '' : `<button class="btn sm ghost" data-action="edit-script" data-id="${r.id}">${icon('edit')} Editar</button>`}</div></div>
            ${editing
              ? `<textarea class="input" id="scriptEdit" style="min-height:420px;font-size:16px">${esc(scriptOf(r))}</textarea>
                 <p class="muted small">Separe os parágrafos com uma linha em branco. O texto original continua guardado e pode ser restaurado.</p>
                 <div class="btn-row"><button class="btn primary sm" data-action="save-script" data-id="${r.id}">Salvar edição</button><button class="btn sm" data-action="cancel-edit" data-id="${r.id}">Cancelar</button>${st.scriptOverride !== null ? `<button class="btn sm ghost" data-action="restore-script" data-id="${r.id}">Restaurar original</button>` : ''}</div>`
              : `<div class="script">${paragraphs(scriptOf(r)).map((p) => `<p>${esc(p)}</p>`).join('')}</div>`}
          </section>

          <section class="card">
            <div class="info-grid">
              <div class="info-item full"><span class="label">CTA</span><div class="val">${esc(r.cta)}</div></div>
              <div class="info-item full"><span class="label">Texto na tela</span><div class="val" style="font-family:var(--serif);font-size:22px;color:var(--navy)">“${esc(r.screenText)}”</div></div>
              <div class="info-item full"><span class="label">Orientações de edição</span><div class="val">${esc(r.editing)}</div></div>
            </div>
          </section>

          <section class="card">
            <h2 style="margin-bottom:14px">Direção de gravação</h2>
            <div class="info-grid">
              <div class="info-item"><span class="label">Roupa recomendada</span><div class="val">${esc(r.outfit)}</div></div>
              <div class="info-item"><span class="label">Posição corporal</span><div class="val">${esc(r.position)}</div></div>
              <div class="info-item"><span class="label">Enquadramento</span><div class="val">${esc(r.framing)}</div></div>
              <div class="info-item"><span class="label">Expressão e ritmo</span><div class="val">${esc(r.expression)}</div></div>
              <div class="info-item full"><span class="label">Direção original do roteiro</span><ul class="dir-list">${r.direction.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></div>
              <div class="info-item full"><span class="label">Cenário</span><div class="val">Parede marrom da casa da Lívia — mesmo cenário para os 15 vídeos. Celular na altura dos olhos, luz frontal ou levemente lateral, formato 9:16.</div></div>
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="card">
            <p class="label">Referência fotográfica · Estilo ${r.style}</p>
            <button class="ref-photo" data-action="style-modal" data-style="${r.style}" data-id="${r.id}" aria-label="Abrir instruções do estilo">${stylePhoto(r.style)}<span class="ref-caption">${photoCaption(r.style)} · toque para ver instruções</span></button>
            <p class="small muted" style="margin:10px 0 0">${esc(s.name)}: ${esc(s.outfit)} · ${esc(s.position)} · ${esc(s.framing)}</p>
          </section>

          <section class="card">
            <div class="card-title"><h3>Status</h3></div>
            ${statusSelect(r.id)}
            <p class="small muted" style="margin:8px 0 0">Sessão de gravação: ${sessionOf(r.id).name} (Reels ${sessionOf(r.id).reels.map(pad).join(', ')})</p>
          </section>

          <section class="card">
            <div class="card-title"><h3>Checklist</h3><span class="chip">${checklistDone(r.id)}/${D.checklist.length}</span></div>
            <div class="progress" style="margin-bottom:8px"><span style="width:${(checklistDone(r.id) / D.checklist.length) * 100}%"></span></div>
            <ul class="checklist">${D.checklist.map((c, i) => `<li><label class="check"><input type="checkbox" ${st.checklist[i] ? 'checked' : ''} data-bind="reels.${r.id}.checklist.${i}"><span>${esc(c)}</span>${i === 3 && r.commercial && !st.checklist[i] ? `<span class="check-flag chip warn">validar</span>` : ''}</label></li>`).join('')}</ul>
          </section>

          <section class="card stack">
            <div class="field"><label for="notes-${r.id}">Observações</label><textarea class="input" id="notes-${r.id}" placeholder="Ajustes, decisões de aprovação, observações da Lívia…" data-bind="reels.${r.id}.notes">${esc(st.notes)}</textarea></div>
            <div class="field"><label for="file-${r.id}">Link do arquivo gravado</label><input class="input" id="file-${r.id}" type="url" inputmode="url" placeholder="https://drive…" value="${esc(st.fileLink)}" data-bind="reels.${r.id}.fileLink">${linkOpen(st.fileLink)}</div>
            <div class="field"><label for="pub-${r.id}">Link da publicação</label><input class="input" id="pub-${r.id}" type="url" inputmode="url" placeholder="https://instagram.com/reel/…" value="${esc(st.pubLink)}" data-bind="reels.${r.id}.pubLink">${linkOpen(st.pubLink)}</div>
          </section>
        </div>
      </div>

      <div class="pager">
        ${prev ? `<a class="btn" href="#/reel/${prev.id}">${icon('left')} ${pad(prev.id)}</a>` : '<span></span>'}
        ${next ? `<a class="btn" href="#/reel/${next.id}">${pad(next.id)} ${icon('right')}</a>` : '<span></span>'}
      </div>`;
  }
  function linkOpen(url) {
    return /^https?:\/\//i.test(url || '') ? `<a class="small" href="${esc(url)}" target="_blank" rel="noopener">Abrir link ↗</a>` : '';
  }

  /* ---------------- Página 4 — Guia visual ---------------- */
  function viewGuide() {
    const sc = D.scene;
    const styles = ['A', 'B', 'C', 'D'].map((k) => {
      const s = D.styles[k];
      const used = D.reels.filter((r) => r.style === k);
      return `<section class="card style-card">
        <div>
          <button class="ref-photo" data-action="style-modal" data-style="${k}" aria-label="Instruções do estilo ${esc(s.name)}">${stylePhoto(k)}<span class="ref-caption">${photoCaption(k)}</span></button>
          <div class="btn-row" style="margin-top:10px"><button class="btn sm" data-action="upload" data-target="${k}">${icon('upload')} ${images[k] ? 'Trocar foto' : 'Anexar foto'}</button>${images[k] ? `<button class="btn sm ghost" data-action="remove-image" data-target="${k}">Remover</button>` : ''}</div>
        </div>
        <div class="stack">
          <div style="display:flex;gap:14px;align-items:center"><span class="style-letter">${k}</span><div><p class="eyebrow" style="margin:0">Estilo ${k}</p><h2>${esc(s.name)}</h2></div></div>
          <dl class="kv"><dt>Roupa</dt><dd>${esc(s.outfit)}</dd><dt>Posição</dt><dd>${esc(s.position)}</dd><dt>Enquadramento</dt><dd>${esc(s.framing)}</dd><dt>Expressão</dt><dd>${esc(s.expression)}</dd><dt>Uso</dt><dd>${esc(s.use)}</dd><dt>Referência</dt><dd>${esc(s.reference)}</dd></dl>
          <div><p class="label">Prompt visual (inglês)</p><div class="prompt-box">${esc(s.prompt)}</div><button class="btn sm ghost" style="margin-top:8px" data-action="copy-prompt" data-style="${k}">${icon('copy')} Copiar prompt</button></div>
          <div><p class="label">Reels neste estilo</p><div class="btn-row" style="gap:6px">${used.map((r) => `<a class="chip" href="#/reel/${r.id}" style="text-decoration:none">${pad(r.id)} · ${esc(r.theme)}</a>`).join('')}</div></div>
        </div></section>`;
    }).join('');

    return pageHead('Guia visual de gravação', 'Um cenário, quatro estilos', 'Todos os 15 Reels são gravados diante da mesma parede marrom da casa da Lívia. A variedade vem do enquadramento, da postura, do figurino, do ritmo e da edição.') +
      `<div class="alert info" style="margin-bottom:20px">${icon('image')}<div><strong>Sobre as imagens:</strong> as figuras exibidas são ilustrações de composição, não fotografias da Lívia. Use “Anexar foto” para incluir referências fornecidas pela equipe ou imagens devidamente licenciadas — elas passam a aparecer em toda a biblioteca. Os prompts em inglês podem ser usados em uma ferramenta de geração de imagem; identifique o resultado como ilustrativo.</div></div>
      <div class="grid grid-3">
        <section class="card"><h3 style="margin-bottom:10px">Cenário fixo</h3><p style="margin-top:0"><b>${esc(sc.rule)}</b></p><ul class="rule-list">${sc.dont.map((x) => `<li>${esc(x)}</li>`).join('')}${sc.do.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>
        <section class="card"><h3 style="margin-bottom:14px">Roupas permitidas</h3><div class="swatches">${sc.clothes.map((c) => `<span class="swatch"><i style="background:${c.hex}"></i>${c.name}</span>`).join('')}</div><p class="small muted" style="margin-bottom:0">${esc(sc.clothesAvoid)}</p></section>
        <section class="card"><h3 style="margin-bottom:10px">Luz e câmera</h3><ul class="rule-list">${sc.light.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>
      </div>
      <div class="stack" style="margin-top:20px">${styles}</div>
      <section class="card" style="margin-top:20px">
        <div class="card-title"><h2>Foto real da parede</h2>${images.wall ? `<button class="btn sm ghost" data-action="remove-image" data-target="wall">Remover</button>` : ''}</div>
        <p class="muted" style="margin-top:0">Anexe uma foto da parede da Lívia, com a luz que será usada na gravação, para orientações futuras mais precisas sobre contraste de roupa e cabelo.</p>
        <button class="wall-slot" data-action="upload" data-target="wall">${images.wall ? `<img src="${images.wall}" alt="Foto da parede de gravação">` : `<span>${icon('upload')}<br>Toque para anexar a foto da parede</span>`}</button>
      </section>`;
  }

  function openStyleModal(key, reelId) {
    const s = D.styles[key];
    const r = reelId ? reelById(reelId) : null;
    const m = $('#modal');
    m.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="Estilo ${esc(s.name)}">
      <div class="modal-head"><div><p class="eyebrow" style="margin:0">Estilo ${key}${r ? ` · Reels ${pad(r.id)}` : ''}</p><h2>${esc(s.name)}</h2></div><button class="icon-btn" data-action="close-modal" aria-label="Fechar">${icon('x')}</button></div>
      <div class="modal-body">
        <div><div class="ref-photo">${stylePhoto(key)}<span class="ref-caption">${photoCaption(key)}</span></div></div>
        <div class="stack">
          <dl class="kv"><dt>Roupa</dt><dd>${esc(r ? r.outfit : s.outfit)}</dd><dt>Posição</dt><dd>${esc(r ? r.position : s.position)}</dd><dt>Enquadramento</dt><dd>${esc(r ? r.framing : s.framing)}</dd><dt>Expressão</dt><dd>${esc(r ? r.expression : s.expression)}</dd></dl>
          <div><p class="label">Luz e câmera</p><ul class="rule-list small">${D.scene.light.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
          <p class="small muted" style="margin:0">Cenário: parede marrom da casa da Lívia. Roupas: branco, off-white, bege claro ou azul-marinho — sem estampas chamativas, logos grandes ou tons marrons.</p>
        </div>
      </div></div>`;
    m.hidden = false;
  }
  function closeModal() { $('#modal').hidden = true; $('#modal').innerHTML = ''; }

  /* ---------------- Página 5 — Produção ---------------- */
  function viewProduction() {
    const cols = D.statuses.map((s) => {
      const list = sorted().filter((r) => rs(r.id).status === s.key);
      return `<div class="col" data-col="${s.key}"><div class="col-head"><span style="display:flex;align-items:center;gap:8px"><span class="dot" style="background:${s.color}"></span>${s.label}</span><span class="col-count">${list.length}</span></div>
        ${list.map((r) => `<div class="k-card" draggable="true" data-card="${r.id}" style="border-left:3px solid ${s.color}">
          <div class="k-meta"><b style="color:var(--rose-ink)">${pad(r.id)}</b><span>${r.weekday.slice(0, 3)} ${fmtShort(r.date)}</span><span>Estilo ${r.style}</span>${r.commercial && !rs(r.id).checklist[3] ? `<span class="chip warn" style="padding:1px 7px">validar CTA</span>` : ''}</div>
          <a href="#/reel/${r.id}">${esc(r.title)}</a>
          <div class="k-progress"><div class="progress"><span style="width:${(checklistDone(r.id) / D.checklist.length) * 100}%"></span></div>${checklistDone(r.id)}/${D.checklist.length}</div>
          ${statusSelect(r.id)}
        </div>`).join('')}
      </div>`;
    }).join('');

    const sessions = D.sessions.map((se) => {
      const done = state.sessions[se.id].filter(Boolean).length;
      return `<section class="card">
        <div class="card-title"><h3>${se.name} · Reels ${pad(se.reels[0])} a ${pad(se.reels[se.reels.length - 1])}</h3><span class="chip">${done}/${se.items.length}</span></div>
        <div class="progress" style="margin-bottom:8px"><span style="width:${(done / se.items.length) * 100}%"></span></div>
        <ul class="checklist">${se.items.map((it, i) => `<li><label class="check"><input type="checkbox" ${state.sessions[se.id][i] ? 'checked' : ''} data-bind="sessions.${se.id}.${i}"><span>${esc(it)}</span></label></li>`).join('')}</ul>
        <p class="label" style="margin-top:14px">Roteiros da sessão</p>
        <div class="stack" style="--gap:8px">${se.reels.map((id) => { const r = reelById(id); return `<a href="#/reel/${id}" style="display:flex;justify-content:space-between;gap:10px;text-decoration:none;color:var(--ink);font-size:14px;margin-top:8px"><span><b>${pad(id)}</b> · ${esc(r.theme)} <span class="muted">(${esc(r.outfit.replace(/\.$/, ''))})</span></span>${statusPill(rs(id).status)}</a>`; }).join('')}</div>
      </section>`;
    }).join('');

    return pageHead('Produção', 'Fluxo de produção', 'Arraste os cartões entre as colunas (no computador) ou altere o status pelo seletor de cada cartão. As alterações são salvas automaticamente neste navegador.') +
      `<div class="kanban">${cols}</div>
      <h2 style="margin:32px 0 16px">Sessões de gravação</h2>
      <div class="grid grid-3">${sessions}</div>`;
  }

  /* ---------------- Página 6 — Resultados ---------------- */
  const num = (v) => { if (v === undefined || v === null || String(v).trim() === '') return null; const n = Number(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
  const fmtNum = (n) => (n === null ? '—' : n.toLocaleString('pt-BR', { maximumFractionDigits: 1 }));
  function compareHTML() {
    const byOpts = { pillar: 'Tema editorial', objective: 'Objetivo', style: 'Formato (estilo)', ctaType: 'Tipo de CTA' };
    const metric = D.metrics.find((m) => m.key === ui.cmpMetric) || D.metrics[0];
    const groups = {};
    D.reels.forEach((r) => {
      const label = ui.cmpBy === 'style' ? `${r.style} · ${D.styles[r.style].name}` : r[ui.cmpBy];
      const g = groups[label] = groups[label] || { total: 0, vals: [] };
      g.total++;
      const v = num(rs(r.id).metrics[metric.key]);
      if (v !== null) g.vals.push(v);
    });
    const rows = Object.entries(groups).filter(([, g]) => g.vals.length).map(([label, g]) => {
      const avg = g.vals.reduce((a, b) => a + b, 0) / g.vals.length;
      return { label: `${label} (${g.vals.length}/${g.total})`, value: avg, display: fmtNum(avg) };
    }).sort((a, b) => b.value - a.value);
    const controls = `<div class="btn-row" style="margin-bottom:16px">
      <select class="input" style="width:auto" data-cmp="by" aria-label="Agrupar por">${Object.entries(byOpts).map(([k, l]) => `<option value="${k}" ${ui.cmpBy === k ? 'selected' : ''}>Comparar por: ${l}</option>`).join('')}</select>
      <select class="input" style="width:auto" data-cmp="metric" aria-label="Métrica">${D.metrics.map((m) => `<option value="${m.key}" ${ui.cmpMetric === m.key ? 'selected' : ''}>${m.label}</option>`).join('')}</select></div>`;
    return controls + (rows.length
      ? `<p class="label">Média de ${esc(metric.label.toLowerCase())} por grupo (Reels com dado / total do grupo)</p>${bars(rows, true)}`
      : `<div class="empty"><h3>Sem dados para comparar</h3><p>Registre as métricas reais dos Reels publicados na tabela abaixo. Nenhum número é preenchido automaticamente.</p></div>`);
  }
  function totalsHTML() {
    return `<div class="kpis" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));margin:0">${D.metrics.map((m) => {
      const vals = D.reels.map((r) => num(rs(r.id).metrics[m.key])).filter((v) => v !== null);
      const isAvg = m.key === 'avgWatch';
      const v = vals.length ? (isAvg ? vals.reduce((a, b) => a + b, 0) / vals.length : vals.reduce((a, b) => a + b, 0)) : null;
      return `<div class="kpi"><div class="kpi-label">${esc(m.label)}${isAvg ? ' · média' : ''}</div><div class="kpi-value" style="font-size:30px">${fmtNum(v)}</div><div class="small muted">${vals.length} Reels com dado</div></div>`;
    }).join('')}</div>`;
  }
  function viewResults() {
    return pageHead('Resultados', 'Desempenho da campanha', 'Todos os campos começam vazios. Preencha apenas com números reais do Instagram e, em “Matrículas atribuídas”, somente matrículas verificadas.') +
      `<section class="card"><div class="card-title"><h2>Totais registrados</h2></div><div id="totals">${totalsHTML()}</div></section>
      <section class="card"><div class="card-title"><h2>Comparativo</h2></div><div id="compare">${compareHTML()}</div></section>
      <section class="card"><div class="card-title"><h2>Métricas por Reels</h2></div>
        <div class="table-wrap" style="border:0;border-radius:0"><table class="metrics-table"><thead><tr><th>Reels</th>${D.metrics.map((m) => `<th>${esc(m.label)}</th>`).join('')}</tr></thead><tbody>
        ${sorted().map((r) => `<tr><td><a href="#/reel/${r.id}" style="text-decoration:none;color:var(--navy);font-weight:600">${pad(r.id)} · ${esc(r.theme)}</a><div class="small muted">${fmtShort(r.date)} · ${esc(r.objective)} · ${r.style} · CTA: ${esc(r.ctaType)}</div></td>
          ${D.metrics.map((m) => `<td><input type="number" min="0" step="any" inputmode="decimal" value="${esc(rs(r.id).metrics[m.key] ?? '')}" data-bind="reels.${r.id}.metrics.${m.key}" data-live="metrics" aria-label="${esc(m.label)} do Reels ${pad(r.id)}"></td>`).join('')}</tr>`).join('')}
        </tbody></table></div></section>`;
  }

  /* ---------------- Para a Lívia ---------------- */
  function viewNext(id) {
    const r = id ? reelById(id) : nextToRecord();
    if (!r) {
      return `<div class="mine"><div class="card empty"><p class="eyebrow">Meu próximo vídeo</p><h1>Todos os vídeos foram gravados</h1><p>Parabéns! Os 15 Reels estão marcados como gravados.</p><a class="btn primary" href="#/my">Ver todos os meus roteiros</a></div></div>`;
    }
    const st = rs(r.id);
    const actions = `<div class="mine-actions">
        <a class="btn primary lg" href="#/read/${r.id}">${icon('read')} Modo leitura</a>
        <button class="btn lg" data-action="copy" data-id="${r.id}">${icon('copy')} Copiar roteiro</button>
        ${recordButton(r.id, 'lg')}
      </div>`;
    return `<div class="mine">
      <div class="btn-row" style="justify-content:space-between;align-items:center;margin-bottom:18px">
        <p class="eyebrow" style="margin:0">${id ? 'Vídeo escolhido' : 'Meu próximo vídeo'}</p>
        <a class="btn sm" href="#/my">${icon('list')} Todos os meus roteiros</a>
      </div>
      <section class="card">
        <div class="mine-hero">
          <button class="ref-photo" data-action="style-modal" data-style="${r.style}" data-id="${r.id}" aria-label="Ver instruções de gravação">${stylePhoto(r.style)}<span class="ref-caption">${photoCaption(r.style)}</span></button>
          <div>
            <span class="pub-date">Reels ${pad(r.id)} · publicação ${r.weekday.toLowerCase()}, ${fmtDate(r.date)}</span>
            <h1 class="mine-title">${esc(r.title)}</h1>
            <div class="btn-row" style="gap:8px">${statusPill(st.status)}${styleChip(r.style)}${r.commercial && !st.checklist[3] ? `<span class="chip warn">${icon('alert')} CTA em validação</span>` : ''}</div>
            <div class="quick">
              <div><span class="label">Roupa</span><span class="q-val">${esc(r.outfit)}</span></div>
              <div><span class="label">Posição</span><span class="q-val">${esc(r.position)}</span></div>
              <div><span class="label">Enquadramento</span><span class="q-val">${esc(r.framing)}</span></div>
              <div><span class="label">Duração</span><span class="q-val">${esc(r.target)} (máx. 60 s)</span></div>
            </div>
          </div>
        </div>
      </section>
      ${actions}
      <section class="card">
        <h3 style="margin-bottom:10px">Orientações rápidas</h3>
        <ul class="rule-list" style="font-size:16px">${r.direction.map((d) => `<li>${esc(d)}</li>`).join('')}<li>Texto na tela: “${esc(r.screenText)}”</li></ul>
      </section>
      <section class="card">
        <p class="label">Roteiro completo</p>
        <div class="script">${paragraphs(scriptOf(r)).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      </section>
      ${actions}
    </div>`;
  }
  function viewMy() {
    const next = nextToRecord();
    return `<div class="mine">${pageHead('Para a Lívia', 'Todos os meus roteiros', 'Escolha qualquer vídeo para ver as orientações e o roteiro completo.', next ? `<a class="btn rose" href="#/next">${icon('video')} Ir para o próximo</a>` : '')}
      <div class="my-list">${sorted().map((r) => {
        const done = isRecorded(r.id);
        return `<a class="my-item ${done ? 'done' : ''}" href="#/next/${r.id}"><span class="n">${pad(r.id)}</span><div><h3>${esc(r.title)}</h3><div class="sub">${r.weekday}, ${fmtShort(r.date)} · ${esc(r.outfit.replace(/\.$/, ''))}</div></div>${done ? `<span class="tick" title="Gravado">${icon('check')}</span>` : (next && next.id === r.id ? '<span class="chip rose">Próximo</span>' : '<span></span>')}</a>`;
      }).join('')}</div></div>`;
  }

  /* ---------------- Leitura para gravação ---------------- */
  function renderReader(id) {
    const r = reelById(id);
    const el = $('#reader');
    if (!r) { el.hidden = true; return; }
    const size = state.prefs.readSize || 26;
    el.innerHTML = `<div class="reader-bar">
        <button class="icon-btn" data-action="close-reader" data-id="${r.id}" aria-label="Fechar leitura">${icon('x')}</button>
        <span class="title">Reels ${pad(r.id)} · ${esc(r.title)}</span>
        <button class="icon-btn" data-action="font" data-delta="-2" aria-label="Diminuir letra">A−</button>
        <button class="icon-btn" data-action="font" data-delta="2" aria-label="Aumentar letra">A+</button>
      </div>
      <div class="reader-body">
        <p class="reader-meta">${esc(r.outfit)} · ${esc(r.position)} · ${esc(r.framing)}</p>
        <div class="script" style="font-size:${size}px">${paragraphs(scriptOf(r)).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      </div>
      <div class="reader-foot"><button class="btn" data-action="copy" data-id="${r.id}">${icon('copy')} Copiar</button>${recordButton(r.id)}</div>`;
    el.hidden = false;
    document.body.style.overflow = 'hidden';
    requestWakeLock();
  }
  function closeReader() {
    $('#reader').hidden = true; $('#reader').innerHTML = '';
    document.body.style.overflow = '';
    if (ui.wakeLock) { ui.wakeLock.release().catch(() => {}); ui.wakeLock = null; }
  }
  async function requestWakeLock() {
    try { if ('wakeLock' in navigator && !ui.wakeLock) ui.wakeLock = await navigator.wakeLock.request('screen'); ui.wakeLock && ui.wakeLock.addEventListener('release', () => { ui.wakeLock = null; }); } catch (e) { /* recurso opcional */ }
  }

  function notFound() { return '<div class="card empty"><h2>Página não encontrada</h2><p><a href="#/overview">Voltar à visão geral</a></p></div>'; }

  /* ---------------- Ações ---------------- */
  function setStatus(id, key) {
    if (statusIdx(key) < 0) return;
    rs(id).status = key; save();
    toast(`Reels ${pad(id)} → ${statusInfo(key).label}`);
    render(true);
  }
  function markRecorded(id) {
    const st = rs(id);
    if (statusIdx(st.status) < statusIdx(RECORDED)) st.status = RECORDED;
    st.checklist[D.checklistRecordedIndex] = true;
    save();
    toast(`Reels ${pad(id)} marcado como gravado`);
    render(true);
  }
  async function copyText(text, msg = 'Roteiro copiado') {
    try { await navigator.clipboard.writeText(text); toast(msg); return; } catch (e) { /* fallback abaixo */ }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    toast(ok ? msg : 'Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.');
  }
  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function exportMarkdown() {
    const lines = [`# Campanha de Reels — ${D.campaign.client}`, '', `${fmtDate(D.campaign.start)} a ${fmtDate(D.campaign.end)} · ${D.campaign.frequency}`, `Exportado em ${new Date().toLocaleString('pt-BR')}`, ''];
    sorted().forEach((r) => {
      const st = rs(r.id);
      lines.push('---', '', `## Reels ${pad(r.id)} — ${r.title}`, '',
        `- **Data:** ${r.weekday}, ${fmtDate(r.date)}`, `- **Objetivo:** ${r.goal} (${r.objective})`, `- **Categoria:** ${r.pillar}`,
        `- **Estilo:** ${r.style} — ${D.styles[r.style].name}`, `- **Status:** ${statusInfo(st.status).label}`,
        `- **Duração-alvo:** ${r.target} · estimativa ~${estimateSec(r)} s${st.realDuration ? ` · real: ${st.realDuration}` : ''}`, '');
      if (r.commercial) lines.push(`> **Validação comercial:** ${r.commercial}`, '');
      lines.push(`**Gancho:** ${hookOf(r)}`, '', '### Roteiro integral', '', scriptOf(r), '',
        '### Direção de gravação', '', `- **Roupa:** ${r.outfit}`, `- **Posição:** ${r.position}`, `- **Enquadramento:** ${r.framing}`, `- **Expressão e ritmo:** ${r.expression}`,
        ...r.direction.map((d) => `- ${d}`), '', `**Texto na tela:** “${r.screenText}”`, '', `**Edição:** ${r.editing}`, '', `**CTA:** ${r.cta}`, '');
      if (st.notes) lines.push(`**Observações:** ${st.notes}`, '');
      if (st.fileLink) lines.push(`**Arquivo gravado:** ${st.fileLink}`, '');
      if (st.pubLink) lines.push(`**Publicação:** ${st.pubLink}`, '');
    });
    download('roteiros-livia-serpa.md', lines.join('\n'), 'text/markdown;charset=utf-8');
  }
  function exportCSV() {
    const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const head = ['Nº', 'Data', 'Dia', 'Título', 'Tema', 'Categoria', 'Objetivo', 'Estilo', 'Roupa', 'Status', 'CTA', 'Texto na tela', 'Checklist', 'Duração real', 'Link do arquivo', 'Link da publicação', ...D.metrics.map((m) => m.label)];
    const rows = sorted().map((r) => {
      const st = rs(r.id);
      return [pad(r.id), fmtDate(r.date), r.weekday, r.title, r.theme, r.pillar, r.objective, `${r.style} — ${D.styles[r.style].name}`, r.outfit, statusInfo(st.status).label, r.cta, r.screenText,
        `${checklistDone(r.id)}/${D.checklist.length}`, st.realDuration, st.fileLink, st.pubLink, ...D.metrics.map((m) => st.metrics[m.key] ?? '')];
    });
    download('cronograma-livia-serpa.csv', '﻿' + [head, ...rows].map((row) => row.map(q).join(';')).join('\r\n'), 'text/csv;charset=utf-8');
  }
  function exportJSON() {
    download(`backup-painel-livia-serpa-${todayISO()}.json`, JSON.stringify({ app: 'painel-livia-serpa', exportedAt: new Date().toISOString(), state, images }, null, 2), 'application/json');
  }
  function importJSON(file) {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const data = JSON.parse(fr.result);
        if (!data.state || !data.state.reels) throw new Error('formato');
        if (!confirm('Importar este backup vai substituir os dados salvos neste navegador. Continuar?')) return;
        const fresh = mergeState(defaultState(), data.state);
        Object.keys(state).forEach((k) => delete state[k]);
        Object.assign(state, fresh);
        save();
        if (data.images && typeof data.images === 'object') { images = data.images; saveImages(); }
        toast('Backup importado');
        render(true);
      } catch (e) { toast('Arquivo inválido. Use um backup exportado por este painel.'); }
    };
    fr.readAsText(file);
  }
  function readImage(file, max, type) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const k = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL(type, 0.82));
        };
        img.onerror = reject;
        img.src = fr.result;
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------------- Roteamento ---------------- */
  const route = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  function render(keepScroll) {
    const r = route();
    const key = r.join('/');
    const changed = key !== ui.lastRoute;
    const y = window.scrollY;

    if (r[0] === 'read') {
      if (!$('#view').innerHTML) { renderNav(['reel']); $('#view').innerHTML = viewReel(r[1]); }
      renderReader(r[1]);
      ui.lastRoute = key;
      return;
    }
    if (!$('#reader').hidden) closeReader();

    renderNav(r);
    let html;
    switch (r[0] || 'overview') {
      case 'overview': html = viewOverview(); break;
      case 'calendar': html = viewCalendar(); break;
      case 'library': html = viewLibrary(); break;
      case 'reel': html = viewReel(r[1]); break;
      case 'guide': html = viewGuide(); break;
      case 'production': html = viewProduction(); break;
      case 'results': html = viewResults(); break;
      case 'next': html = viewNext(r[1]); break;
      case 'my': html = viewMy(); break;
      default: html = notFound();
    }
    const view = $('#view');
    view.innerHTML = html;
    if (changed) {
      view.classList.remove('view-enter'); void view.offsetWidth; view.classList.add('view-enter');
      if (!keepScroll) window.scrollTo(0, 0);
    } else if (keepScroll) window.scrollTo(0, y);
    ui.lastRoute = key;
    const titles = { overview: 'Visão geral', calendar: 'Calendário', library: 'Biblioteca', reel: `Reels ${pad(r[1] || '')}`, guide: 'Guia visual', production: 'Produção', results: 'Resultados', next: 'Meu próximo vídeo', my: 'Meus roteiros' };
    document.title = `${titles[r[0] || 'overview'] || 'Painel'} · Lívia Serpa`;
  }

  /* ---------------- Eventos ---------------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-action]');
    if (a) {
      const id = Number(a.dataset.id);
      switch (a.dataset.action) {
        case 'mark-recorded': markRecorded(id); break;
        case 'copy': copyText(scriptOf(reelById(id))); break;
        case 'copy-prompt': copyText(D.styles[a.dataset.style].prompt, 'Prompt copiado'); break;
        case 'style-modal': e.preventDefault(); e.stopPropagation(); openStyleModal(a.dataset.style, a.dataset.id); break;
        case 'close-modal': closeModal(); break;
        case 'open-sheet': openSheet(); break;
        case 'cal-mode': state.prefs.calMode = a.dataset.mode; save(); render(true); break;
        case 'cal-prev': case 'cal-next': {
          const d = new Date(ui.calMonth.y, ui.calMonth.m + (a.dataset.action === 'cal-next' ? 1 : -1), 1);
          ui.calMonth = { y: d.getFullYear(), m: d.getMonth() }; render(true); break;
        }
        case 'cal-week': ui.calWeek = Number(a.dataset.week); render(true); break;
        case 'clear-filters': Object.keys(ui.filters).forEach((k) => { ui.filters[k] = ''; }); render(true); break;
        case 'edit-script': ui.editing[id] = true; render(true); break;
        case 'cancel-edit': delete ui.editing[id]; render(true); break;
        case 'save-script': {
          const val = $('#scriptEdit').value.replace(/\r\n/g, '\n').trim();
          rs(id).scriptOverride = (!val || val === reelById(id).script) ? null : val;
          delete ui.editing[id]; save(); toast('Roteiro salvo'); render(true); break;
        }
        case 'restore-script':
          if (confirm('Restaurar o roteiro original? A edição será descartada.')) { rs(id).scriptOverride = null; delete ui.editing[id]; save(); toast('Roteiro original restaurado'); render(true); }
          break;
        case 'font': state.prefs.readSize = Math.min(44, Math.max(18, (state.prefs.readSize || 26) + Number(a.dataset.delta))); save(); $('#reader .script').style.fontSize = state.prefs.readSize + 'px'; break;
        case 'close-reader': if (ui.navDepth > 1) history.back(); else location.hash = `#/reel/${id}`; break;
        case 'upload': ui.uploadTarget = a.dataset.target; $('#fileImage').value = ''; $('#fileImage').click(); break;
        case 'remove-image': delete images[a.dataset.target]; saveImages(); render(true); break;
        case 'export-md': closeSheet(); exportMarkdown(); break;
        case 'export-csv': closeSheet(); exportCSV(); break;
        case 'export-json': closeSheet(); exportJSON(); break;
        case 'import-json': closeSheet(); $('#fileJson').value = ''; $('#fileJson').click(); break;
      }
      return;
    }
    const link = e.target.closest('[data-href]');
    if (link && !e.target.closest('a, button, input, select, textarea')) location.hash = link.dataset.href;
    if (e.target.id === 'modal') closeModal();
    if (e.target.id === 'sheet' || e.target.closest('#sheet a')) closeSheet();
  });

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.filter === 'q') {
      ui.filters.q = el.value;
      const pos = el.selectionStart;
      render(true);
      const s = $('[data-filter="q"]'); s.focus(); try { s.setSelectionRange(pos, pos); } catch (_) { /* type=search */ }
      return;
    }
    if (!el.dataset.bind || el.type === 'checkbox') return;
    setPath(el.dataset.bind, el.value);
    scheduleSave();
    if (el.dataset.live === 'dur') { const f = $(`#durFlag-${el.dataset.id}`); if (f) f.innerHTML = durationFlag(Number(el.dataset.id)); }
    if (el.dataset.live === 'metrics') { $('#compare').innerHTML = compareHTML(); $('#totals').innerHTML = totalsHTML(); }
  });

  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.status) { setStatus(Number(el.dataset.status), el.value); return; }
    if (el.dataset.filter && el.dataset.filter !== 'q') { ui.filters[el.dataset.filter] = el.value; render(true); return; }
    if (el.dataset.cmp) { if (el.dataset.cmp === 'by') ui.cmpBy = el.value; else ui.cmpMetric = el.value; $('#compare').innerHTML = compareHTML(); return; }
    if (el.dataset.bind && el.type === 'checkbox') { setPath(el.dataset.bind, el.checked); save(); render(true); return; }
    if (el.dataset.bind) { save(); if (/Link$/.test(el.dataset.bind)) render(true); }
  });

  $('#fileImage').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !ui.uploadTarget) return;
    try {
      const isLogo = ui.uploadTarget === 'logo';
      images[ui.uploadTarget] = await readImage(file, isLogo ? 480 : 1000, isLogo ? 'image/png' : 'image/jpeg');
      if (saveImages()) toast('Imagem anexada');
      render(true);
    } catch (err) { toast('Não foi possível ler esta imagem.'); }
  });
  $('#fileJson').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) importJSON(f); });

  // Arrastar e soltar no Kanban (desktop)
  document.addEventListener('dragstart', (e) => {
    const c = e.target.closest && e.target.closest('[data-card]');
    if (!c) return;
    e.dataTransfer.setData('text/plain', c.dataset.card); e.dataTransfer.effectAllowed = 'move'; c.classList.add('dragging');
  });
  document.addEventListener('dragend', (e) => { const c = e.target.closest && e.target.closest('[data-card]'); if (c) c.classList.remove('dragging'); });
  document.addEventListener('dragover', (e) => { const col = e.target.closest && e.target.closest('[data-col]'); if (col) { e.preventDefault(); col.classList.add('drag-over'); } });
  document.addEventListener('dragleave', (e) => { const col = e.target.closest && e.target.closest('[data-col]'); if (col && !col.contains(e.relatedTarget)) col.classList.remove('drag-over'); });
  document.addEventListener('drop', (e) => {
    const col = e.target.closest && e.target.closest('[data-col]');
    if (!col) return;
    e.preventDefault();
    const id = Number(e.dataTransfer.getData('text/plain'));
    if (id && rs(id).status !== col.dataset.col) setStatus(id, col.dataset.col); else render(true);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('#modal').hidden) closeModal();
    else if (!$('#sheet').hidden) closeSheet();
    else if (!$('#reader').hidden) { const r = route(); if (ui.navDepth > 1) history.back(); else location.hash = `#/reel/${r[1]}`; }
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && !$('#reader').hidden) requestWakeLock(); });
  window.addEventListener('hashchange', () => { ui.navDepth++; closeModal(); closeSheet(); render(); });
  window.addEventListener('storage', (e) => { if (e.key === KEY) { Object.assign(state, mergeState(defaultState(), JSON.parse(e.newValue || '{}'))); render(true); } });

  if (!location.hash) history.replaceState(null, '', '#/overview');
  ui.navDepth = 1;
  render();
})();
