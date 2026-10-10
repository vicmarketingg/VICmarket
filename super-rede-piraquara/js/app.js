/* =========================================================
   SUPER REDE PIRAQUARA — Dashboard de Marketing
   Aplicação estática: os dados ficam salvos no navegador
   (localStorage) e podem ser exportados/importados em JSON.
   ========================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'srp-marketing-2026-v1';
  const LOGO_KEY = 'srp-marketing-2026-logo';

  /* ---------------- utilidades ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const WD = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const WD_S = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const ddmm = s => s ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : '—';
  const fullDate = s => s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : '—';
  const weekday = s => WD[parse(s).getDay()];
  const weekdayS = s => WD_S[parse(s).getDay()];
  const num = v => (v == null || v === '' || isNaN(v)) ? '—' : Number(v).toLocaleString('pt-BR');
  const pctFmt = v => v == null ? '—' : v.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
  const TODAY = iso(new Date());

  const PLAN_DATES = [];
  for (let d = PLAN.start; d <= PLAN.end; d = addDays(d, 1)) PLAN_DATES.push(d);

  const statusIdx = id => STATUSES.findIndex(s => s.id === id);
  const statusLabel = id => (STATUSES.find(s => s.id === id) || {}).label || id;
  const IDX_AGUARDANDO = statusIdx('aguardando_aprovacao');
  const IDX_APROVADO = statusIdx('aprovado');
  const camp = id => CAMPAIGNS.find(c => c.id === id);
  const sectorLabel = id => (SECTORS.find(s => s.id === id) || {}).label || id;
  const pillarLabel = id => (PILLARS.find(p => p.id === id) || {}).label || '—';
  const weekOf = date => PLAN.weeks.find(w => date >= w.start && date <= w.end);

  /* ---------------- estado e persistência ---------------- */
  let storageOk = true;
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items)) return normalize(parsed);
      }
    } catch (e) { storageOk = false; }
    return buildSeed();
  }

  function normalize(s) {
    const seed = buildSeed();
    s.account = Object.assign({}, seed.account, s.account || {});
    if (!Array.isArray(s.account.snapshots)) s.account.snapshots = [];
    s.items.forEach(it => {
      it.metrics = Object.assign(emptyMetrics(), it.metrics || {});
      it.script = Object.assign({ hook: '', development: '', product: '', scenes: '', caption: '' }, it.script || {});
      it.campaigns = it.campaigns || [];
      it.sectors = it.sectors || [];
      it.checklist = it.checklist || [];
      if (statusIdx(it.status) < 0) it.status = 'planejado';
    });
    return s;
  }

  function save(msg) {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageOk = true;
    } catch (e) { storageOk = false; }
    renderSaveState();
    if (msg) toast(msg);
  }

  function renderSaveState() {
    const el = $('#saveState');
    if (!storageOk) {
      el.innerHTML = '<span style="color:var(--red)">Não foi possível salvar neste navegador. Exporte o JSON para não perder alterações.</span>';
      return;
    }
    el.textContent = state.updatedAt
      ? 'Salvo neste navegador em ' + new Date(state.updatedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      : 'Planejamento original carregado';
  }

  /* ---------------- cálculos ---------------- */
  const isPub = it => it.status === 'publicado';
  const isApproved = it => statusIdx(it.status) >= IDX_APROVADO;
  const wasSent = it => it.sentForApproval || statusIdx(it.status) >= IDX_AGUARDANDO;
  const hasVal = v => v != null && v !== '' && !isNaN(v);
  const interactions = m => ['curtidas', 'comentarios', 'compartilhamentos', 'salvamentos'].reduce((a, k) => a + (hasVal(m[k]) ? Number(m[k]) : 0), 0);
  const hasInteractions = m => ['curtidas', 'comentarios', 'compartilhamentos', 'salvamentos'].some(k => hasVal(m[k]));

  function stats(items = state.items) {
    const total = items.length;
    const published = items.filter(isPub).length;
    const approved = items.filter(isApproved).length;
    const sent = items.filter(wasSent).length;
    const reels = items.filter(i => i.format === 'Reels');
    const reelDates = new Set(reels.map(i => i.date).filter(d => d >= PLAN.start && d <= PLAN.end));
    const storyDates = new Set(items.filter(i => i.format === 'Stories').map(i => i.date).filter(d => d >= PLAN.start && d <= PLAN.end));
    const storyDatesPub = new Set(items.filter(i => i.format === 'Stories' && isPub(i)).map(i => i.date));
    // Pontualidade: conteúdos cuja data prevista já passou (ou que já foram publicados)
    const due = items.filter(i => i.date < TODAY || isPub(i));
    const onTime = due.filter(i => isPub(i) && i.publishedDate && i.publishedDate === i.date).length;
    return {
      total, published, approved, sent,
      pending: total - published,
      reels: reels.length,
      reelsPub: reels.filter(isPub).length,
      reelDays: reelDates.size,
      daysWithoutReels: PLAN.days - reelDates.size,
      storyDays: storyDates.size,
      storyDaysPub: storyDatesPub.size,
      pubRate: total ? published / total * 100 : null,
      approvalRate: sent ? approved / sent * 100 : null,
      punctuality: due.length ? onTime / due.length * 100 : null,
      dueCount: due.length
    };
  }

  function marketing(items = state.items) {
    const withReach = items.filter(i => hasVal(i.metrics.alcance) && Number(i.metrics.alcance) > 0);
    const sum = (arr, k) => arr.reduce((a, i) => a + (hasVal(i.metrics[k]) ? Number(i.metrics[k]) : 0), 0);
    const any = k => items.some(i => hasVal(i.metrics[k]));
    const engBase = withReach.filter(i => hasInteractions(i.metrics));
    const shareBase = withReach.filter(i => hasVal(i.metrics.compartilhamentos));
    const reelsReach = withReach.filter(i => i.format === 'Reels' && isPub(i));
    const acc = state.account;
    const snaps = acc.snapshots.slice().sort((a, b) => a.date.localeCompare(b.date));
    const last = snaps[snaps.length - 1];
    const totals = {};
    METRIC_FIELDS.forEach(f => { totals[f.id] = any(f.id) ? sum(items, f.id) : null; });
    return {
      totals,
      contentsWithData: items.filter(i => METRIC_FIELDS.some(f => hasVal(i.metrics[f.id]))).length,
      engagementRate: engBase.length ? engBase.reduce((a, i) => a + interactions(i.metrics), 0) / sum(engBase, 'alcance') * 100 : null,
      shareRate: shareBase.length ? sum(shareBase, 'compartilhamentos') / sum(shareBase, 'alcance') * 100 : null,
      avgReelsReach: reelsReach.length ? sum(reelsReach, 'alcance') / reelsReach.length : null,
      reelsReachCount: reelsReach.length,
      followerGrowth: (hasVal(acc.followersStart) && last) ? Number(last.followers) - Number(acc.followersStart) : null,
      followersLast: last ? Number(last.followers) : null
    };
  }

  function pillarDist() {
    const reels = state.items.filter(i => i.format === 'Reels');
    return PILLARS.map(p => {
      const n = reels.filter(i => i.pillar === p.id).length;
      return { ...p, count: n, share: reels.length ? n / reels.length * 100 : 0 };
    });
  }

  function goals() {
    const s = stats();
    const fixed = CAMPAIGNS.filter(c => c.type === 'fixa');
    const fixedCovered = fixed.filter(c => state.items.some(i => i.campaigns.includes(c.id)));
    const warm = state.items.filter(i => i.campaigns.includes('super-sexta') && i.date < '2026-10-30');
    const mainSectors = SECTORS.filter(x => x.id !== 'institucional');
    const sectPlanned = mainSectors.filter(x => state.items.some(i => i.sectors.includes(x.id)));
    const sectPub = mainSectors.filter(x => state.items.some(i => isPub(i) && i.sectors.includes(x.id)));
    return [
      { ok: s.reels >= PLAN.reelsPlanned, title: `${PLAN.reelsPlanned} Reels planejados`, plan: `${s.reels} Reels no calendário`, real: `${s.reelsPub} de ${s.reels} publicados` },
      { ok: s.storyDays >= PLAN.days, title: `Stories em todos os ${PLAN.days} dias`, plan: `${s.storyDays} dias com Stories planejados`, real: `${s.storyDaysPub} de ${PLAN.days} dias publicados` },
      { ok: fixedCovered.length === fixed.length, title: '100% das campanhas fixas contempladas', plan: `${fixedCovered.length} de ${fixed.length} campanhas fixas no calendário`, real: '' },
      { ok: warm.length > 0, title: 'Super Sexta com campanha de aquecimento', plan: `${warm.length} conteúdos de aquecimento antes de 30/10`, real: `${warm.filter(isPub).length} publicados` },
      { ok: sectPlanned.length === mainSectors.length, title: 'Todos os principais setores divulgados', plan: `${sectPlanned.length} de ${mainSectors.length} setores com conteúdo planejado`, real: `${sectPub.length} de ${mainSectors.length} setores já divulgados` }
    ];
  }

  /* ---------------- componentes de UI ---------------- */
  const fmtBadge = f => `<span class="badge ${f === 'Reels' ? 'b-reels' : 'b-stories'}">${esc(f)}</span>`;
  const statusBadge = s => `<span class="status s-${esc(s)}">${esc(statusLabel(s))}</span>`;
  const campBadges = ids => ids.map(id => { const c = camp(id); return c ? `<span class="badge b-camp"><span class="dot" style="background:${c.color}"></span>${esc(c.name)}</span>` : ''; }).join('');
  const kpi = (label, value, foot = '', cls = '') => `<div class="kpi ${cls}"><div class="kpi-label">${esc(label)}</div><div class="kpi-value">${value}</div>${foot ? `<div class="kpi-foot">${foot}</div>` : ''}</div>`;
  const kpiMaybe = (label, value, foot, cls, emptyText = 'Aguardando dados reais') =>
    value == null ? `<div class="kpi ${cls} kpi-empty"><div class="kpi-label">${esc(label)}</div><div class="kpi-value">${esc(emptyText)}</div>${foot ? `<div class="kpi-foot">${foot}</div>` : ''}</div>` : kpi(label, value, foot, cls);
  const section = (title, tag, tagCls, desc = '') => `<div class="section-title"><h2>${esc(title)}</h2>${tag ? `<span class="tag ${tagCls}">${esc(tag)}</span>` : ''}${desc ? `<p>${esc(desc)}</p>` : ''}</div>`;
  const progress = (p, cls = '') => `<div class="progress ${cls}"><span style="width:${Math.max(0, Math.min(100, p || 0))}%"></span></div>`;

  function listRow(it, extra = '') {
    const d = it.date;
    return `<div class="list-row" data-action="open" data-id="${esc(it.id)}">
      <div class="lr-date"><b>${d.slice(8, 10)}</b><span>${esc(weekdayS(d))}</span></div>
      <div class="lr-main"><div class="lr-title">${esc(it.title)}</div>
      <div class="lr-meta">${fmtBadge(it.format)}${campBadges(it.campaigns)}${statusBadge(it.status)}${extra}</div></div></div>`;
  }

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, 2600);
  }

  /* ---------------- gráficos (SVG próprio, sem dependências) ---------------- */
  function niceMax(v) {
    if (v <= 0) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p;
    return 10 * p;
  }
  const tipAttr = (title, body) => `data-tip-title="${esc(title)}" data-tip-body="${esc(body)}"`;

  function chartTable(rows, cols) {
    return `<details class="chart-table"><summary>Ver dados em tabela</summary><table class="tbl"><thead><tr>${cols.map((c, i) => `<th class="${i ? 'num' : ''}">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map((v, i) => `<td class="${i ? 'num' : ''}">${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></details>`;
  }

  function barChart(data, { valueFmt = num, unit = '' } = {}) {
    const W = 560, H = 230, L = 52, R = 10, T = 18, B = 34;
    const max = niceMax(Math.max(...data.map(d => d.value)));
    const iw = W - L - R, ih = H - T - B;
    const band = iw / data.length, bw = Math.min(56, band * .58);
    let g = '';
    for (let i = 0; i <= 4; i++) {
      const y = T + ih - ih * i / 4;
      g += `<line class="grid-line" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/><text x="${L - 8}" y="${y + 4}" text-anchor="end">${esc(valueFmt(max * i / 4))}</text>`;
    }
    let bars = '';
    data.forEach((d, i) => {
      const h = ih * d.value / max, x = L + band * i + (band - bw) / 2, y = T + ih - h;
      const r = Math.min(4, h);
      const path = h > 0 ? `M${x},${T + ih} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${T + ih} Z` : '';
      bars += `<rect class="hit" x="${L + band * i}" y="${T}" width="${band}" height="${ih}" ${tipAttr(d.label, valueFmt(d.value) + unit + (d.sub ? ' · ' + d.sub : ''))}/>`;
      bars += `<path class="bar" d="${path}"/>`;
      bars += `<text class="lbl" x="${x + bw / 2}" y="${y - 5}" text-anchor="middle">${esc(valueFmt(d.value))}</text>`;
      bars += `<text x="${L + band * i + band / 2}" y="${H - 12}" text-anchor="middle">${esc(d.label)}</text>`;
    });
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img"><g class="axis">${g}${bars}</g><line class="baseline" x1="${L}" x2="${W - R}" y1="${T + ih}" y2="${T + ih}"/></svg></div>`;
  }

  function hBarChart(data, { valueFmt = num, unit = '' } = {}) {
    const W = 560, rowH = 26, L = 200, R = 56, T = 6;
    const H = T + data.length * rowH + 6;
    const max = Math.max(...data.map(d => d.value)) || 1;
    const iw = W - L - R;
    let out = '';
    data.forEach((d, i) => {
      const y = T + i * rowH, w = Math.max(2, iw * d.value / max), bh = 14, by = y + (rowH - bh) / 2;
      const r = Math.min(4, w);
      const label = d.label.length > 32 ? d.label.slice(0, 31) + '…' : d.label;
      out += `<rect class="hit" x="0" y="${y}" width="${W}" height="${rowH}" ${tipAttr(d.label, valueFmt(d.value) + unit + (d.sub ? ' · ' + d.sub : ''))}/>`;
      out += `<path class="bar" d="M${L},${by} H${L + w - r} Q${L + w},${by} ${L + w},${by + r} V${by + bh - r} Q${L + w},${by + bh} ${L + w - r},${by + bh} H${L} Z"/>`;
      out += `<text x="${L - 8}" y="${by + 11}" text-anchor="end">${esc(label)}</text>`;
      out += `<text class="lbl" x="${L + w + 6}" y="${by + 11}">${esc(valueFmt(d.value) + unit)}</text>`;
    });
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img"><g class="axis">${out}</g><line class="baseline" x1="${L}" x2="${L}" y1="${T}" y2="${H - 6}"/></svg></div>`;
  }

  function lineChart(points) {
    const W = 560, H = 230, L = 58, R = 16, T = 18, B = 34;
    const vals = points.map(p => p.value);
    let min = Math.min(...vals), max = Math.max(...vals);
    if (min === max) { min -= 1; max += 1; }
    const span = max - min; min = Math.max(0, min - span * .15); max = max + span * .15;
    const iw = W - L - R, ih = H - T - B;
    const x = i => L + (points.length === 1 ? iw / 2 : iw * i / (points.length - 1));
    const y = v => T + ih - ih * (v - min) / (max - min);
    let g = '';
    for (let i = 0; i <= 4; i++) {
      const v = min + (max - min) * i / 4, yy = y(v);
      g += `<line class="grid-line" x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}"/><text x="${L - 8}" y="${yy + 4}" text-anchor="end">${esc(Math.round(v).toLocaleString('pt-BR'))}</text>`;
    }
    const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ');
    let pts = '';
    points.forEach((p, i) => {
      pts += `<circle class="pt" cx="${x(i)}" cy="${y(p.value)}" r="5"/>`;
      pts += `<rect class="hit" x="${x(i) - 16}" y="${T}" width="32" height="${ih}" ${tipAttr(p.label, num(p.value) + ' seguidores')}/>`;
      if (points.length <= 10 || i % Math.ceil(points.length / 8) === 0) pts += `<text x="${x(i)}" y="${H - 12}" text-anchor="middle">${esc(p.label)}</text>`;
    });
    const lastP = points[points.length - 1];
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img"><g class="axis">${g}<path class="line" d="${path}"/>${pts}
      <text class="lbl" x="${x(points.length - 1)}" y="${y(lastP.value) - 10}" text-anchor="end">${esc(num(lastP.value))}</text></g></svg></div>`;
  }

  const chartEmpty = (txt) => `<div class="empty"><strong>Sem dados ainda</strong>${esc(txt)}</div>`;

  /* ---------------- tooltips ---------------- */
  const tip = $('#tooltip');
  document.addEventListener('mousemove', e => {
    const t = e.target.closest && e.target.closest('[data-tip-title]');
    if (!t) { tip.hidden = true; $$('.bar.hover').forEach(b => b.classList.remove('hover')); return; }
    tip.innerHTML = `<b>${esc(t.dataset.tipTitle)}</b>${esc(t.dataset.tipBody)}`;
    tip.hidden = false;
    const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
    tip.style.left = x + 'px';
    tip.style.top = (e.clientY + 14) + 'px';
    $$('.bar.hover').forEach(b => b.classList.remove('hover'));
    const next = t.nextElementSibling;
    if (next && next.classList.contains('bar')) next.classList.add('hover');
  });

  /* =========================================================
     PÁGINAS
     ========================================================= */
  const PAGES = {
    visao: { title: 'Visão geral', sub: 'Planejamento, execução e resultados do período', render: renderVisao },
    calendario: { title: 'Calendário editorial', sub: 'Mês, semana e lista — clique em um conteúdo para ver e editar', render: renderCalendario },
    producao: { title: 'Produção', sub: 'Arraste os cartões (ou use as setas) para mudar a etapa', render: renderProducao },
    campanhas: { title: 'Campanhas', sub: 'Campanhas fixas, especial e datas sazonais', render: renderCampanhas },
    resultados: { title: 'Indicadores e resultados', sub: 'Somente dados reais, inseridos manualmente', render: renderResultados },
    apresentacao: { title: 'Apresentação executiva', sub: '14 slides para a reunião com a direção — use ← → ou tela cheia', render: renderApresentacao }
  };

  const ui = {
    page: 'visao',
    cal: { mode: 'month', month: '2026-10', week: 1, filters: { from: '', to: '', format: '', campaign: '', sector: '', status: '', owner: '' } },
    kb: { format: '', week: '' },
    slide: 0
  };
  const wk = weekOf(TODAY);
  if (wk) ui.cal.week = wk.n;
  if (TODAY.slice(0, 7) === '2026-11') ui.cal.month = '2026-11';

  function render() {
    const page = PAGES[ui.page] ? ui.page : 'visao';
    $('#pageTitle').textContent = PAGES[page].title;
    $('#pageSub').textContent = PAGES[page].sub;
    $$('.nav a').forEach(a => a.classList.toggle('active', a.dataset.page === page));
    document.title = PAGES[page].title + ' — Super Rede Piraquara';
    $('#view').innerHTML = PAGES[page].render();
    if (page === 'producao') bindKanban();
  }

  /* ---------------- 1. Visão geral ---------------- */
  function renderVisao() {
    const s = stats();
    const m = marketing();
    const upcoming = state.items.filter(i => i.date >= TODAY && i.campaigns.length).slice(0, 7);
    const recs = state.items.filter(i => i.recordDate && i.recordDate >= TODAY && !isPub(i)).sort((a, b) => a.recordDate.localeCompare(b.recordDate)).slice(0, 7);
    const nextReels = state.items.filter(i => i.format === 'Reels' && i.date >= TODAY && !isPub(i)).slice(0, 4);
    const pendAll = state.items.filter((i, n, arr) => i.confirm && !isPub(i) && arr.findIndex(x => x.date === i.date && x.confirm === i.confirm && !isPub(x)) === n);
    const pend = pendAll.slice(0, 8);
    const dist = pillarDist();

    const weekRows = PLAN.weeks.map(w => {
      const its = state.items.filter(i => i.date >= w.start && i.date <= w.end);
      const pub = its.filter(isPub).length;
      return `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
        <span><b>${esc(w.label)}</b> <span class="note">${ddmm(w.start)} a ${ddmm(w.end)}</span></span>
        <span class="note">${pub} de ${its.length} publicados · ${its.filter(i => i.format === 'Reels').length} Reels</span></div>${progress(its.length ? pub / its.length * 100 : 0, 'green')}</div>`;
    }).join('');

    return `
      ${section('Planejamento do período', 'Planejado', 'tag-plan', 'Números do calendário — não são resultados.')}
      <div class="grid g-6">
        ${kpi('Dias de planejamento', PLAN.days, `${fullDate(PLAN.start)} a ${fullDate(PLAN.end)}`)}
        ${kpi('Reels programados', s.reels, 'Dia sim, dia não · 30 a 60 s')}
        ${kpi('Dias sem Reels', s.daysWithoutReels, 'Somente Stories')}
        ${kpi('Dias com Stories', s.storyDays, 'Presença diária')}
        ${kpi('Stories (referência)', `${PLAN.days * PLAN.storiesPerDayMin}–${PLAN.days * PLAN.storiesPerDayMax}`, `${PLAN.storiesPerDayMin} a ${PLAN.storiesPerDayMax} por dia, em 6 blocos`)}
        ${kpi('Conteúdos no calendário', s.total, 'Reels + pacotes diários de Stories + institucionais')}
      </div>

      ${section('Execução', 'Andamento real', 'tag-exec', 'Calculado a partir do status de cada conteúdo.')}
      <div class="grid g-4">
        ${kpi('Conteúdos publicados', s.published, `${s.reelsPub} Reels · ${s.storyDaysPub} dias de Stories`, 'exec')}
        ${kpi('Conteúdos pendentes', s.pending, 'Ainda não publicados', 'exec')}
        ${kpi('Conteúdos aprovados', s.approved, 'Aprovados, agendados ou publicados', 'exec')}
        ${kpi('Percentual de execução', pctFmt(s.pubRate), progress(s.pubRate), 'exec')}
      </div>
      <div class="grid g-3" style="margin-top:14px">
        ${kpi('Taxa de publicação', pctFmt(s.pubRate), 'Publicados ÷ planejados × 100', 'exec')}
        ${kpiMaybe('Taxa de aprovação', s.approvalRate == null ? null : pctFmt(s.approvalRate), 'Aprovados ÷ enviados para aprovação × 100', 'exec', 'Nenhum conteúdo enviado para aprovação')}
        ${kpiMaybe('Pontualidade', s.punctuality == null ? null : pctFmt(s.punctuality), `Publicados na data prevista ÷ conteúdos com data vencida (${s.dueCount})`, 'exec', 'Nenhuma data prevista vencida')}
      </div>

      <div class="grid g-3" style="margin-top:18px">
        <div class="card"><h3>Próximas campanhas <span class="hint">a partir de hoje</span></h3>
          <div class="list">${upcoming.length ? upcoming.map(i => listRow(i)).join('') : '<div class="empty">Não há campanhas futuras no calendário.</div>'}</div></div>
        <div class="card"><h3>Próximas gravações</h3>
          <div class="list">${recs.length ? recs.map(i => listRow(i, `<span class="badge b-warn">Gravação ${ddmm(i.recordDate)}</span>`)).join('')
            : `<div class="empty"><strong>Nenhuma data de gravação definida</strong>Defina as datas no detalhe de cada conteúdo.</div>
               ${nextReels.length ? `<div class="note" style="margin:6px 0 2px">Próximos Reels que precisam de gravação:</div>${nextReels.map(i => listRow(i)).join('')}` : ''}`}</div></div>
        <div class="card"><h3>Evolução do calendário <span class="hint">publicados por semana</span></h3>${weekRows}</div>
      </div>

      ${section('Resumo de desempenho', 'Resultados reais', 'tag-real', 'Aparecem somente após a inserção manual das métricas.')}
      <div class="grid g-4">
        ${kpiMaybe('Alcance somado', m.totals.alcance == null ? null : num(m.totals.alcance), `${m.contentsWithData} conteúdos com métricas`, 'real')}
        ${kpiMaybe('Visualizações', m.totals.visualizacoes == null ? null : num(m.totals.visualizacoes), '', 'real')}
        ${kpiMaybe('Engajamento por alcance', m.engagementRate == null ? null : pctFmt(m.engagementRate), 'Interações ÷ alcance × 100', 'real')}
        ${kpiMaybe('Crescimento líquido de seguidores', m.followerGrowth == null ? null : (m.followerGrowth > 0 ? '+' : '') + num(m.followerGrowth), 'Seguidores finais − iniciais', 'real')}
      </div>

      <div class="grid g-3" style="margin-top:18px">
        <div class="card"><h3>Metas operacionais</h3>
          ${goals().map(g => `<div class="goal"><div class="goal-ico ${g.ok ? 'ok' : ''}">${g.ok ? '✓' : '!'}</div><div><b>${esc(g.title)}</b><span>${esc(g.plan)}${g.real ? ' · ' + esc(g.real) : ''}</span></div></div>`).join('')}
        </div>
        <div class="card"><h3>Pilares editoriais dos Reels</h3>
          <div class="pillar-row pillar-head"><span>Pilar</span><span class="num">Diretriz</span><span class="num">Calendário</span></div>
          ${dist.map(p => `<div class="pillar-row"><span>${esc(p.label)}</span><span class="num">${p.target}%</span><span class="num">${pctFmt(p.share)}</span>
            <div class="bars">${progress(p.target)}${progress(p.share, 'green')}</div></div>`).join('')}
          <p class="note" style="margin-top:8px">Vermelho: diretriz editorial. Verde: classificação atual dos ${s.reels} Reels (editável em cada conteúdo). Os Stories complementam relacionamento e interação diariamente.</p>
        </div>
        <div class="card"><h3>Pendências de confirmação <span class="hint">${pendAll.length}</span></h3>
          <div class="list">${pend.length ? pend.map(i => `<div class="list-row" data-action="open" data-id="${esc(i.id)}"><div class="lr-date"><b>${i.date.slice(8, 10)}</b><span>${ddmm(i.date).slice(3)}</span></div>
            <div class="lr-main"><div class="lr-title" style="white-space:normal">${esc(i.confirm)}</div><div class="lr-meta">${fmtBadge(i.format)}</div></div></div>`).join('') : '<div class="empty">Nenhuma pendência.</div>'}</div>
        </div>
      </div>`;
  }

  /* ---------------- 2. Calendário ---------------- */
  function owners() {
    return Array.from(new Set(state.items.map(i => (i.owner || '').trim()).filter(Boolean))).sort();
  }

  function applyFilters(items) {
    const f = ui.cal.filters;
    return items.filter(i =>
      (!f.from || i.date >= f.from) && (!f.to || i.date <= f.to) &&
      (!f.format || i.format === f.format) &&
      (!f.campaign || (f.campaign === '__none' ? !i.campaigns.length : i.campaigns.includes(f.campaign))) &&
      (!f.sector || i.sectors.includes(f.sector)) &&
      (!f.status || i.status === f.status) &&
      (!f.owner || (f.owner === '__none' ? !(i.owner || '').trim() : (i.owner || '').trim() === f.owner)));
  }

  function filtersBar() {
    const f = ui.cal.filters;
    const opt = (v, l, cur) => `<option value="${esc(v)}" ${cur === v ? 'selected' : ''}>${esc(l)}</option>`;
    return `<div class="filters">
      <div class="field"><label>De</label><input type="date" class="input" data-filter="from" value="${esc(f.from)}" min="${PLAN.start}" max="${PLAN.end}"></div>
      <div class="field"><label>Até</label><input type="date" class="input" data-filter="to" value="${esc(f.to)}" min="${PLAN.start}" max="${PLAN.end}"></div>
      <div class="field"><label>Formato</label><select class="select" data-filter="format">${opt('', 'Todos', f.format)}${opt('Reels', 'Reels', f.format)}${opt('Stories', 'Stories', f.format)}</select></div>
      <div class="field"><label>Campanha</label><select class="select" data-filter="campaign">${opt('', 'Todas', f.campaign)}${CAMPAIGNS.map(c => opt(c.id, c.name, f.campaign)).join('')}${opt('__none', 'Sem campanha', f.campaign)}</select></div>
      <div class="field"><label>Setor</label><select class="select" data-filter="sector">${opt('', 'Todos', f.sector)}${SECTORS.map(x => opt(x.id, x.label, f.sector)).join('')}</select></div>
      <div class="field"><label>Status</label><select class="select" data-filter="status">${opt('', 'Todos', f.status)}${STATUSES.map(x => opt(x.id, x.label, f.status)).join('')}</select></div>
      <div class="field"><label>Responsável</label><select class="select" data-filter="owner">${opt('', 'Todos', f.owner)}${owners().map(o => opt(o, o, f.owner)).join('')}${opt('__none', 'Sem responsável', f.owner)}</select></div>
      <button class="btn btn-ghost" data-action="clear-filters" type="button">Limpar filtros</button>
    </div>`;
  }

  function evBtn(i) {
    return `<button type="button" class="ev ${i.format === 'Reels' ? 'reels' : 'stories'} ${isPub(i) ? 'done' : ''}" data-action="open" data-id="${esc(i.id)}" data-short="${i.format === 'Reels' ? 'R' : 'S'}" ${tipAttr(i.format + ' · ' + statusLabel(i.status), i.title)}><span class="ev-t">${esc(i.format === 'Reels' ? i.title : (i.format + ' · ' + i.title.replace(/^Stories do dia — /, '')))}</span></button>`;
  }

  function renderCalendario() {
    const c = ui.cal;
    const items = applyFilters(state.items);
    let label = '', body = '', canPrev = true, canNext = true;

    if (c.mode === 'month') {
      const [y, mo] = c.month.split('-').map(Number);
      label = `${MONTHS[mo - 1]} de ${y}`;
      canPrev = c.month > '2026-10'; canNext = c.month < '2026-11';
      const first = new Date(y, mo - 1, 1);
      let cur = addDays(iso(first), -first.getDay());
      const lastDay = iso(new Date(y, mo, 0));
      let cells = '';
      do {
        for (let k = 0; k < 7; k++) {
          const inMonth = cur.slice(0, 7) === c.month;
          const inPlan = cur >= PLAN.start && cur <= PLAN.end;
          const evs = inMonth ? items.filter(i => i.date === cur) : [];
          const camps = Array.from(new Set(evs.flatMap(i => i.campaigns))).map(camp).filter(Boolean);
          cells += `<div class="cal-cell ${!inMonth || !inPlan ? 'out' : ''} ${cur === TODAY ? 'today' : ''}">
            <div class="cal-day"><span>${Number(cur.slice(8, 10))}</span><span class="camp-dot">${camps.map(x => `<i style="background:${x.color}" title="${esc(x.name)}"></i>`).join('')}</span></div>
            ${evs.map(evBtn).join('')}</div>`;
          cur = addDays(cur, 1);
        }
      } while (cur <= lastDay);
      body = `<div class="cal"><div class="cal-head">${WD_S.map(d => `<div>${d}</div>`).join('')}</div><div class="cal-grid">${cells}</div></div>`;
    } else if (c.mode === 'week') {
      const w = PLAN.weeks.find(x => x.n === c.week) || PLAN.weeks[0];
      label = `${w.label} · ${ddmm(w.start)} a ${ddmm(w.end)}`;
      canPrev = w.n > 1; canNext = w.n < PLAN.weeks.length;
      let cols = '';
      for (let d = w.start; d <= w.end; d = addDays(d, 1)) {
        const evs = items.filter(i => i.date === d);
        cols += `<div class="week-col ${d === TODAY ? 'today' : ''}"><div class="week-col-h"><span>${esc(weekday(d))}</span>${ddmm(d)}</div>
          ${evs.map(i => `<button type="button" class="week-card" data-action="open" data-id="${esc(i.id)}">
            <div style="display:flex;gap:4px;flex-wrap:wrap">${fmtBadge(i.format)}${statusBadge(i.status)}</div>
            <div class="t">${esc(i.title)}</div>${i.campaigns.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap">${campBadges(i.campaigns)}</div>` : ''}
            <div class="note">${esc(i.owner || 'Sem responsável')}</div></button>`).join('') || '<div class="note">Nada com os filtros atuais.</div>'}</div>`;
      }
      body = `<div class="week-grid">${cols}</div>`;
    } else {
      label = `${items.length} conteúdos`;
      canPrev = canNext = false;
      body = `<div class="table-wrap"><table class="tbl"><thead><tr><th>Data</th><th>Dia</th><th>Formato</th><th>Campanha</th><th>Título</th><th>Setores</th><th>Status</th><th>Responsável</th><th>Gravação</th></tr></thead><tbody>
        ${items.map(i => `<tr class="clickable" data-action="open" data-id="${esc(i.id)}"><td>${ddmm(i.date)}</td><td>${esc(weekdayS(i.date))}</td><td>${fmtBadge(i.format)}</td>
        <td>${esc(i.campaigns.map(id => (camp(id) || {}).name).filter(Boolean).join(', ') || '—')}</td><td style="min-width:240px"><b>${esc(i.title)}</b></td>
        <td>${esc(i.sectors.map(sectorLabel).join(', '))}</td><td>${statusBadge(i.status)}</td><td>${esc(i.owner || '—')}</td><td>${ddmm(i.recordDate)}</td></tr>`).join('')
        || '<tr><td colspan="9"><div class="empty">Nenhum conteúdo com os filtros atuais.</div></td></tr>'}
      </tbody></table></div>`;
    }

    return `${filtersBar()}
      <div class="toolbar">
        <div class="btn-group">
          <button class="btn ${c.mode === 'month' ? 'active' : ''}" data-action="cal-mode" data-mode="month" type="button">Mês</button>
          <button class="btn ${c.mode === 'week' ? 'active' : ''}" data-action="cal-mode" data-mode="week" type="button">Semana</button>
          <button class="btn ${c.mode === 'list' ? 'active' : ''}" data-action="cal-mode" data-mode="list" type="button">Lista</button>
        </div>
        ${c.mode !== 'list' ? `<button class="btn" data-action="cal-prev" type="button" ${canPrev ? '' : 'disabled'} aria-label="Anterior">‹</button>
        <h3>${esc(label.charAt(0).toUpperCase() + label.slice(1))}</h3>
        <button class="btn" data-action="cal-next" type="button" ${canNext ? '' : 'disabled'} aria-label="Próximo">›</button>` : `<h3>${esc(label)}</h3>`}
        <span class="spacer"></span>
        <span class="badge b-reels">Reels</span><span class="badge b-stories">Stories</span>
        <button class="btn btn-primary" data-action="new-item" type="button">+ Novo conteúdo</button>
      </div>
      ${body}`;
  }

  /* ---------------- 3. Produção (Kanban) ---------------- */
  function renderProducao() {
    const k = ui.kb;
    const items = state.items.filter(i => (!k.format || i.format === k.format) && (!k.week || (weekOf(i.date) || {}).n === Number(k.week)));
    const s = stats(items);
    const opt = (v, l, cur) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`;
    const cols = STATUSES.map((st, idx) => {
      const its = items.filter(i => i.status === st.id);
      return `<div class="k-col" data-status="${st.id}"><div class="k-col-h"><span>${idx + 1}. ${esc(st.label)}</span><span class="count">${its.length}</span></div>
        <div class="k-list">${its.map(i => {
          const done = i.checklist.filter(c => c.done).length;
          return `<div class="k-card" draggable="true" data-id="${esc(i.id)}">
            <div class="row">${fmtBadge(i.format)}<b style="color:var(--ink)">${ddmm(i.date)}</b> ${esc(weekdayS(i.date))}</div>
            <div class="t" data-action="open" data-id="${esc(i.id)}">${esc(i.title)}</div>
            ${i.campaigns.length ? `<div class="row">${campBadges(i.campaigns)}</div>` : ''}
            <div class="row"><span>👤 ${esc(i.owner || 'Sem responsável')}</span>${i.checklist.length ? `<span>· ✓ ${done}/${i.checklist.length}</span>` : ''}${i.confirm && !isPub(i) ? '<span class="badge b-warn">Confirmar</span>' : ''}</div>
            <div class="k-move"><button class="icon-btn" type="button" data-action="move" data-id="${esc(i.id)}" data-dir="-1" ${idx === 0 ? 'disabled' : ''} aria-label="Etapa anterior">←</button>
            <button class="icon-btn" type="button" data-action="move" data-id="${esc(i.id)}" data-dir="1" ${idx === STATUSES.length - 1 ? 'disabled' : ''} aria-label="Próxima etapa">→</button></div>
          </div>`;
        }).join('')}</div></div>`;
    }).join('');

    return `<div class="toolbar">
        <div class="field" style="min-width:150px"><label>Formato</label><select class="select" data-kb="format">${opt('', 'Todos', k.format)}${opt('Reels', 'Reels', k.format)}${opt('Stories', 'Stories', k.format)}</select></div>
        <div class="field" style="min-width:200px"><label>Semana</label><select class="select" data-kb="week">${opt('', 'Todas', k.week)}${PLAN.weeks.map(w => opt(w.n, `${w.label} (${ddmm(w.start)}–${ddmm(w.end)})`, k.week)).join('')}</select></div>
        <span class="spacer"></span>
        <div style="min-width:260px"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px"><b>Progresso de produção</b>&nbsp;&nbsp;<span class="note">${s.published} de ${s.total} publicados · ${s.approved} aprovados</span></div>${progress(s.pubRate, 'green')}</div>
      </div>
      <div class="kanban" id="kanban">${cols}</div>
      <p class="note">Ao mover para “Aprovado” ou “Publicado”, a data de aprovação/publicação é preenchida com a data de hoje se estiver vazia — ajuste no detalhe do conteúdo se necessário.</p>`;
  }

  function moveStatus(id, newStatus) {
    const it = state.items.find(i => i.id === id);
    if (!it || it.status === newStatus) return;
    it.status = newStatus;
    const idx = statusIdx(newStatus);
    if (idx >= IDX_AGUARDANDO) it.sentForApproval = true;
    if (idx >= IDX_APROVADO && !it.approvalDate) it.approvalDate = TODAY;
    if (newStatus === 'publicado' && !it.publishedDate) it.publishedDate = TODAY;
    save(`“${it.title.slice(0, 40)}” → ${statusLabel(newStatus)}`);
    render();
  }

  function bindKanban() {
    $$('.k-card').forEach(card => {
      card.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', card.dataset.id); card.classList.add('dragging'); });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });
    $$('.k-col').forEach(col => {
      col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('drop'); });
      col.addEventListener('dragleave', e => { if (!col.contains(e.relatedTarget)) col.classList.remove('drop'); });
      col.addEventListener('drop', e => { e.preventDefault(); col.classList.remove('drop'); moveStatus(e.dataTransfer.getData('text/plain'), col.dataset.status); });
    });
  }

  /* ---------------- 4. Campanhas ---------------- */
  function renderCampanhas() {
    const groups = [
      { type: 'fixa', title: 'Campanhas comerciais fixas', desc: 'Cada dia da semana mantém sua identidade de ofertas.' },
      { type: 'especial', title: 'Campanha especial', desc: 'Prioridade máxima do calendário comercial.' },
      { type: 'sazonal', title: 'Datas sazonais', desc: 'Campanhas de relacionamento, conscientização e oportunidade.' }
    ];
    const card = c => {
      const its = state.items.filter(i => i.campaigns.includes(c.id));
      const pub = its.filter(isPub).length;
      const reach = its.filter(i => hasVal(i.metrics.alcance));
      const reachSum = reach.reduce((a, i) => a + Number(i.metrics.alcance), 0);
      const inter = its.filter(i => hasInteractions(i.metrics)).reduce((a, i) => a + interactions(i.metrics), 0);
      return `<div class="card camp-card" style="--c:${c.color}">
        <div><h4>${esc(c.name)}</h4><div class="camp-when">${esc(c.when)}</div></div>
        <div class="camp-obj">${esc(c.objective)}</div>
        <div class="camp-stats"><div><b>${its.length}</b><span>conteúdos</span></div><div><b>${its.filter(i => i.format === 'Reels').length}</b><span>Reels</span></div><div><b>${pub}</b><span>publicados</span></div></div>
        <div>${progress(its.length ? pub / its.length * 100 : 0, 'green')}<div class="note" style="margin-top:4px">Andamento: ${pctFmt(its.length ? pub / its.length * 100 : 0)}</div></div>
        <div class="camp-items">${its.map(i => `<button type="button" class="${isPub(i) ? 'pub' : ''}" data-action="open" data-id="${esc(i.id)}" ${tipAttr(i.format + ' · ' + statusLabel(i.status), i.title)}>${ddmm(i.date)} ${i.format === 'Reels' ? 'Reels' : 'Stories'}</button>`).join('') || '<span class="note">Nenhum conteúdo vinculado.</span>'}</div>
        <div class="camp-results">${reach.length ? `<b>Resultados reais:</b> alcance somado ${num(reachSum)} · ${num(inter)} interações (${reach.length} conteúdos com métricas)` : 'Resultados aparecem após a inserção das métricas reais.'}</div>
      </div>`;
    };
    return groups.map(g => `${section(g.title, '', '', g.desc)}<div class="grid g-3">${CAMPAIGNS.filter(c => c.type === g.type).map(card).join('')}</div>`).join('');
  }

  /* ---------------- 5. Indicadores e resultados ---------------- */
  function renderResultados() {
    const s = stats();
    const m = marketing();
    const acc = state.account;
    const withReach = state.items.filter(i => hasVal(i.metrics.alcance) && Number(i.metrics.alcance) > 0);

    // Alcance por semana
    const weekData = PLAN.weeks.map(w => {
      const its = withReach.filter(i => i.date >= w.start && i.date <= w.end);
      return { label: `S${w.n} ${ddmm(w.start)}`, value: its.reduce((a, i) => a + Number(i.metrics.alcance), 0), sub: `${its.length} conteúdos` , n: its.length };
    }).filter(d => d.n > 0);
    // Visualizações por formato
    const fmtData = ['Reels', 'Stories'].map(f => {
      const its = state.items.filter(i => i.format === f && hasVal(i.metrics.visualizacoes));
      return { label: f, value: its.reduce((a, i) => a + Number(i.metrics.visualizacoes), 0), sub: `${its.length} conteúdos`, n: its.length };
    }).filter(d => d.n > 0);
    // Engajamento por conteúdo
    const engData = withReach.filter(i => hasInteractions(i.metrics)).map(i => ({
      label: `${ddmm(i.date)} ${i.format === 'Reels' ? 'R' : 'S'} · ${i.title}`, value: interactions(i.metrics) / Number(i.metrics.alcance) * 100,
      sub: `${num(interactions(i.metrics))} interações / ${num(i.metrics.alcance)} alcance`
    })).sort((a, b) => b.value - a.value).slice(0, 10);
    // Seguidores
    const followPts = [];
    if (hasVal(acc.followersStart)) followPts.push({ label: acc.followersStartDate ? ddmm(acc.followersStartDate) : 'Início', value: Number(acc.followersStart) });
    acc.snapshots.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach(x => followPts.push({ label: ddmm(x.date), value: Number(x.followers) }));
    // Campanhas
    const campData = CAMPAIGNS.map(c => {
      const its = withReach.filter(i => i.campaigns.includes(c.id));
      return { label: c.name, value: its.reduce((a, i) => a + Number(i.metrics.alcance), 0), sub: `${its.length} conteúdos`, n: its.length };
    }).filter(d => d.n > 0).sort((a, b) => b.value - a.value);
    // Top conteúdos
    const top = withReach.slice().sort((a, b) => Number(b.metrics.alcance) - Number(a.metrics.alcance)).slice(0, 8);

    const pctV = v => v.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

    return `
      <div class="alert info"><span>ℹ</span><div>Os resultados são inseridos manualmente a partir dos dados do Instagram (Insights). Este painel <b>não possui conexão com Instagram ou Meta</b>. Indicadores e gráficos aparecem somente quando os dados necessários estão disponíveis.</div></div>

      ${section('Indicadores operacionais', 'Execução', 'tag-exec')}
      <div class="grid g-3">
        ${kpi('Taxa de publicação', pctFmt(s.pubRate), `${s.published} publicados ÷ ${s.total} planejados × 100`, 'exec')}
        ${kpiMaybe('Taxa de aprovação', s.approvalRate == null ? null : pctFmt(s.approvalRate), `${s.approved} aprovados ÷ ${s.sent} enviados para aprovação × 100`, 'exec', 'Nenhum conteúdo enviado para aprovação')}
        ${kpiMaybe('Pontualidade', s.punctuality == null ? null : pctFmt(s.punctuality), 'Publicados na data prevista ÷ conteúdos com data vencida × 100', 'exec', 'Nenhuma data prevista vencida')}
      </div>

      ${section('Indicadores de marketing', 'Resultados reais', 'tag-real')}
      <div class="grid g-4">
        ${kpiMaybe('Taxa de engajamento por alcance', m.engagementRate == null ? null : pctFmt(m.engagementRate), 'Interações (curtidas + comentários + compartilhamentos + salvamentos) ÷ alcance × 100', 'real')}
        ${kpiMaybe('Crescimento líquido de seguidores', m.followerGrowth == null ? null : (m.followerGrowth > 0 ? '+' : '') + num(m.followerGrowth), 'Seguidores finais − seguidores iniciais', 'real', 'Informe seguidores iniciais e atuais')}
        ${kpiMaybe('Média de alcance por Reels', m.avgReelsReach == null ? null : num(Math.round(m.avgReelsReach)), `Soma dos alcances ÷ ${m.reelsReachCount} Reels publicados com dados`, 'real')}
        ${kpiMaybe('Taxa de compartilhamento por alcance', m.shareRate == null ? null : pctFmt(m.shareRate), 'Compartilhamentos ÷ alcance × 100', 'real')}
      </div>
      <div class="grid g-6" style="margin-top:14px">
        ${['alcance', 'visualizacoes', 'visitasPerfil', 'cliquesLinks', 'mensagens', 'pedidos'].map(k => kpiMaybe(METRIC_FIELDS.find(f => f.id === k).label.replace(' (quando rastreáveis)', ''), m.totals[k] == null ? null : num(m.totals[k]), 'Soma dos conteúdos', 'real', 'Sem dados')).join('')}
      </div>

      ${section('Seguidores da conta', 'Resultados reais', 'tag-real', 'Registre o número inicial e atualizações periódicas.')}
      <div class="grid g-2">
        <div class="card"><h3>Registro de seguidores</h3>
          <div class="form-grid">
            <div class="field"><label>Seguidores iniciais</label><input class="input" type="number" min="0" id="accStart" value="${hasVal(acc.followersStart) ? esc(acc.followersStart) : ''}" placeholder="Ex.: número do Insights"></div>
            <div class="field"><label>Data da contagem inicial</label><input class="input" type="date" id="accStartDate" value="${esc(acc.followersStartDate)}"></div>
          </div>
          <div style="margin-top:10px"><button class="btn" data-action="save-account" type="button">Salvar seguidores iniciais</button></div>
          <div class="form-grid" style="margin-top:16px;border-top:1px solid var(--line-2);padding-top:14px">
            <div class="field"><label>Data da atualização</label><input class="input" type="date" id="snapDate" value="${TODAY}"></div>
            <div class="field"><label>Seguidores nessa data</label><input class="input" type="number" min="0" id="snapVal"></div>
          </div>
          <div style="margin-top:10px"><button class="btn btn-primary" data-action="add-snapshot" type="button">Adicionar atualização</button></div>
          ${acc.snapshots.length ? `<table class="tbl" style="margin-top:12px"><thead><tr><th>Data</th><th class="num">Seguidores</th><th></th></tr></thead><tbody>
            ${acc.snapshots.slice().sort((a, b) => a.date.localeCompare(b.date)).map(x => `<tr><td>${fullDate(x.date)}</td><td class="num">${num(x.followers)}</td><td class="num"><button class="btn btn-sm btn-danger" data-action="del-snapshot" data-date="${esc(x.date)}" type="button">Remover</button></td></tr>`).join('')}
          </tbody></table>` : ''}
        </div>
        <div class="card"><h3>Crescimento de seguidores</h3>
          ${followPts.length >= 2 ? lineChart(followPts) + chartTable(followPts.map(p => [p.label, num(p.value)]), ['Data', 'Seguidores']) : chartEmpty('Registre ao menos dois valores de seguidores.')}
        </div>
      </div>

      ${section('Gráficos de desempenho', 'Resultados reais', 'tag-real')}
      <div class="grid g-2">
        <div class="card"><h3>Alcance por semana</h3>${weekData.length ? barChart(weekData) + chartTable(weekData.map(d => [d.label, num(d.value)]), ['Semana', 'Alcance']) + '<p class="note">Semanas sem métricas inseridas não aparecem.</p>' : chartEmpty('Insira o alcance dos conteúdos publicados.')}</div>
        <div class="card"><h3>Visualizações por formato</h3>${fmtData.length ? barChart(fmtData) + chartTable(fmtData.map(d => [d.label, num(d.value)]), ['Formato', 'Visualizações']) : chartEmpty('Insira as visualizações dos conteúdos publicados.')}</div>
        <div class="card"><h3>Engajamento por conteúdo <span class="hint">interações ÷ alcance</span></h3>${engData.length ? hBarChart(engData, { valueFmt: pctV, unit: '%' }) + chartTable(engData.map(d => [d.label, pctV(d.value) + '%']), ['Conteúdo', 'Engajamento']) : chartEmpty('Insira alcance e interações dos conteúdos.')}</div>
        <div class="card"><h3>Comparativo entre campanhas <span class="hint">alcance somado</span></h3>${campData.length ? hBarChart(campData) + chartTable(campData.map(d => [d.label, num(d.value)]), ['Campanha', 'Alcance']) + '<p class="note">Conteúdos com mais de uma campanha são somados em cada uma delas.</p>' : chartEmpty('Insira o alcance dos conteúdos publicados.')}</div>
      </div>

      <div class="card" style="margin-top:14px"><h3>Conteúdos com melhor desempenho <span class="hint">por alcance</span></h3>
        ${top.length ? `<div class="table-wrap" style="border:none"><table class="tbl"><thead><tr><th>#</th><th>Data</th><th>Formato</th><th>Conteúdo</th><th class="num">Alcance</th><th class="num">Visualizações</th><th class="num">Interações</th><th class="num">Engajamento</th></tr></thead><tbody>
          ${top.map((i, n) => `<tr class="clickable" data-action="open" data-id="${esc(i.id)}" data-tab="metrics"><td>${n + 1}</td><td>${ddmm(i.date)}</td><td>${fmtBadge(i.format)}</td><td>${esc(i.title)}</td><td class="num">${num(i.metrics.alcance)}</td><td class="num">${num(i.metrics.visualizacoes)}</td><td class="num">${hasInteractions(i.metrics) ? num(interactions(i.metrics)) : '—'}</td><td class="num">${hasInteractions(i.metrics) ? pctFmt(interactions(i.metrics) / Number(i.metrics.alcance) * 100) : '—'}</td></tr>`).join('')}
        </tbody></table></div>` : chartEmpty('O ranking aparece quando houver alcance registrado.')}
      </div>

      ${section('Inserção de métricas por conteúdo', 'Entrada manual', 'tag-plan', 'Clique em uma linha para inserir ou corrigir as métricas.')}
      <div class="table-wrap"><table class="tbl"><thead><tr><th>Data</th><th>Formato</th><th>Conteúdo</th><th>Status</th><th class="num">Alcance</th><th class="num">Visualiz.</th><th class="num">Curtidas</th><th class="num">Coment.</th><th class="num">Compart.</th><th class="num">Salvam.</th><th class="num">Novos seg.</th><th class="num">Mensagens</th><th></th></tr></thead><tbody>
        ${state.items.map(i => `<tr class="clickable" data-action="open" data-id="${esc(i.id)}" data-tab="metrics"><td>${ddmm(i.date)}</td><td>${fmtBadge(i.format)}</td><td style="min-width:220px">${esc(i.title)}</td><td>${statusBadge(i.status)}</td>
          ${['alcance', 'visualizacoes', 'curtidas', 'comentarios', 'compartilhamentos', 'salvamentos', 'novosSeguidores', 'mensagens'].map(k => `<td class="num">${num(i.metrics[k])}</td>`).join('')}
          <td><span class="btn btn-sm">Inserir</span></td></tr>`).join('')}
      </tbody></table></div>`;
  }

  /* ---------------- 6. Apresentação executiva ---------------- */
  function slideFrame(n, kicker, title, inner, cls = '') {
    return `<div class="slide"><div class="slide-inner ${cls}">${kicker ? `<div class="s-kicker">${esc(kicker)}</div>` : ''}${title ? `<h2>${title}</h2>` : ''}${inner}</div>
      <div class="s-foot"><b>SUPER REDE PIRAQUARA</b><span>Planejamento de Marketing · 10/10 a 10/11/2026</span><span>${n} / 14</span></div></div>`;
  }

  function buildSlides() {
    const s = stats();
    const reels = state.items.filter(i => i.format === 'Reels').sort((a, b) => a.date.localeCompare(b.date));
    const dist = pillarDist();
    const g = goals();
    const m = marketing();
    const superItems = state.items.filter(i => i.campaigns.includes('super-sexta')).sort((a, b) => a.date.localeCompare(b.date) || (a.format === 'Reels' ? -1 : 1));
    const fixed = CAMPAIGNS.filter(c => c.type === 'fixa');
    const seasonal = CAMPAIGNS.filter(c => c.type !== 'fixa').map(c => ({ c, its: state.items.filter(i => i.campaigns.includes(c.id)) }));
    const sectorsMain = SECTORS.filter(x => x.id !== 'institucional');

    return [
      // 1 — Capa
      `<div class="slide"><div class="slide-inner s-cover" style="position:relative"><div class="stripe"></div>
        <div style="position:relative;max-width:62%">
          <div class="s-kicker">Planejamento estratégico de marketing digital</div>
          <h2>Super Rede Piraquara</h2>
          <p style="margin-top:1.4cqw">Instagram · 10 de outubro a 10 de novembro de 2026</p>
          <p>Realengo, Rio de Janeiro</p>
          <div class="s-big">MENOR PREÇO SEMPRE!</div>
        </div></div></div>`,

      // 2 — Objetivos
      slideFrame(2, 'Objetivos do período', 'Transformar o Instagram em canal de atração, relacionamento e conversão', `
        <div class="s-cols s-c3">
          ${[['01', 'Aumentar o fluxo de clientes', 'Campanhas comerciais e conteúdos de desejo que estimulam visitas à loja.'],
             ['02', 'Fortalecer a percepção de economia', 'Consolidar o “Menor Preço Sempre” com ofertas reais e comunicação clara.'],
             ['03', 'Aumentar o conhecimento dos setores', 'Mostrar que o Super Rede oferece muito mais do que compras tradicionais.'],
             ['04', 'Estimular o consumo dos serviços', 'Pizzaria, lanchonete, marmitex, frango assado, churrasquinho e bebidas.'],
             ['05', 'Fortalecer o relacionamento', 'Linguagem popular, próxima, acolhedora e bem-humorada.'],
             ['06', 'Organizar a operação de marketing', 'Processo claro de gravação, edição, aprovação, publicação e análise.']]
            .map(([n, t, d]) => `<div class="s-box"><div class="s-num" style="font-size:2.4cqw">${n}</div><h4>${t}</h4><p>${d}</p></div>`).join('')}
        </div>`),

      // 3 — Posicionamento
      slideFrame(3, 'Posicionamento e diferenciais', 'Muito mais do que um supermercado de bairro', `
        <p class="s-quote">Variedade, economia, conveniência e relacionamento próximo — com uma experiência de compra completa.</p>
        <div class="s-cols s-c3">
          ${sectorsMain.map(x => `<div class="s-box"><h4>${esc(x.label)}</h4><p>${esc(x.items.slice(0, 4).join(' · '))}</p></div>`).join('')}
        </div>`),

      // 4 — Estratégia editorial
      slideFrame(4, 'Estratégia editorial', 'Frequência sustentável e pilares definidos', `
        <div class="s-cols s-c2">
          <div class="s-cols s-c2" style="align-content:start">
            <div class="s-box red"><div class="s-num">${s.reels}</div><h4>Reels estratégicos</h4><p>Dia sim, dia não · 30 a 60 segundos</p></div>
            <div class="s-box yellow"><div class="s-num">${PLAN.days}</div><h4>dias com Stories</h4><p>${PLAN.storiesPerDayMin} a ${PLAN.storiesPerDayMax} Stories por dia, em 6 blocos</p></div>
            <div class="s-box" style="grid-column:1/-1"><h4>Linguagem</h4><p>Comercial e objetiva · humanizada · popular sem exageros · próxima dos moradores do bairro · gancho forte nos primeiros segundos · chamada para ação clara.</p></div>
          </div>
          <div class="s-box"><h4>Distribuição dos pilares (diretriz editorial)</h4>
            ${dist.map(p => `<div style="margin-top:.8cqw"><div style="display:flex;justify-content:space-between"><p><b>${esc(p.label)}</b></p><p><b>${p.target}%</b></p></div><div class="s-bar"><span style="width:${p.target}%"></span></div></div>`).join('')}
            <p style="margin-top:1cqw;font-size:1cqw">Percentuais são diretrizes editoriais, não resultados.</p>
          </div>
        </div>`),

      // 5 — Calendário sazonal
      slideFrame(5, 'Calendário sazonal', 'Outubro e novembro: datas que geram conversa e venda', `
        <table class="s-table"><thead><tr><th>Data</th><th>Campanha</th><th>Objetivo</th><th>Conteúdos</th></tr></thead><tbody>
          ${seasonal.map(({ c, its }) => `<tr><td><b>${esc(c.when)}</b></td><td><span class="s-pill" style="background:${c.color}">${esc(c.name)}</span></td><td>${esc(c.objective.split('.')[0])}.</td><td>${its.length} (${its.filter(i => i.format === 'Reels').length} Reels)</td></tr>`).join('')}
        </tbody></table>`),

      // 6 — Campanhas fixas
      slideFrame(6, 'Campanhas comerciais fixas', 'Cada dia da semana tem sua identidade de ofertas', `
        <div class="s-cols s-c3">
          ${fixed.map(c => `<div class="s-box" style="border-top:.4cqw solid ${c.color}"><p style="font-size:1cqw;text-transform:uppercase;letter-spacing:.08em"><b>${esc(c.when)}</b></p><h4>${esc(c.name)}</h4><p>${esc(c.objective)}</p>
            <p style="font-size:1cqw">${state.items.filter(i => i.campaigns.includes(c.id)).length} conteúdos no período</p></div>`).join('')}
        </div>`),

      // 7 — Calendário de Reels
      slideFrame(7, 'Calendário de Reels', `${s.reels} Reels — dia sim, dia não`, `
        <div class="s-strip">${reels.map(i => `<div class="${i.campaigns.includes('super-sexta') && i.date === '2026-10-30' ? 'ss' : ''}"><b>${i.date.slice(8, 10)}</b>${ddmm(i.date).slice(3) === '10' ? 'out' : 'nov'} · ${esc(weekdayS(i.date))}</div>`).join('')}</div>
        <div class="s-cols s-c2" style="gap:0 2cqw">
          ${[reels.slice(0, 8), reels.slice(8)].map(col => `<table class="s-table"><tbody>${col.map(i => `<tr><td style="width:12%"><b>${ddmm(i.date)}</b></td><td>${esc(i.title)}</td></tr>`).join('')}</tbody></table>`).join('')}
        </div>`),

      // 8 — Stories
      slideFrame(8, 'Estratégia diária de Stories', `${PLAN.storiesPerDayMin} a ${PLAN.storiesPerDayMax} Stories por dia, distribuídos em 6 blocos`, `
        <div class="s-cols s-c3">
          ${STORY_BLOCKS.map((b, n) => `<div class="s-box ${n === 1 ? 'red' : ''}"><p style="font-size:1cqw"><b>BLOCO ${n + 1} · ${esc(b.time)}</b></p><h4>${esc(b.name)}</h4><ul>${b.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}
        </div>
        <p style="font-size:1cqw">Horários são referências editoriais e serão ajustados à operação real da loja. Não publicar todos de uma vez.</p>`),

      // 9 — Setores
      slideFrame(9, 'Plano de divulgação dos setores', 'Todos os setores ganham espaço no calendário', `
        <table class="s-table"><thead><tr><th>Setor</th><th>Destaques</th><th>Conteúdos</th><th>Reels em</th></tr></thead><tbody>
          ${sectorsMain.map(x => { const its = state.items.filter(i => i.sectors.includes(x.id)); const rd = its.filter(i => i.format === 'Reels').map(i => ddmm(i.date)); return `<tr><td><b>${esc(x.label)}</b></td><td>${esc(x.items.slice(0, 3).join(', '))}</td><td>${its.length}</td><td>${esc(rd.join(', ') || 'Stories')}</td></tr>`; }).join('')}
        </tbody></table>`),

      // 10 — Super Sexta
      slideFrame(10, 'Estratégia especial', 'Super Sexta — 30/10: a última sexta do mês e a mais barata', `
        <div class="s-cols s-c2">
          <div class="s-box"><h4>Aquecimento e cobertura</h4>
            <table class="s-table"><tbody>${superItems.map(i => `<tr><td style="width:18%"><b>${ddmm(i.date)}</b> ${esc(weekdayS(i.date))}</td><td><span class="s-pill ${i.format === 'Reels' ? '' : 'y'}">${esc(i.format)}</span></td><td>${esc(i.title.replace(/^Stories do dia — /, ''))}</td></tr>`).join('')}</tbody></table>
          </div>
          <div class="s-box red"><h4>Prioridade máxima do calendário comercial</h4>
            <ul><li>Anúncio na segunda (26/10) e convite para ativar notificações</li><li>Contagem regressiva: “Faltam 3 dias”, “Faltam 2 dias”, “É amanhã!”</li><li>Vídeo principal no dia, com apresentadora e cenas de movimento</li><li>Cobertura de Stories ao longo do dia por setor</li><li><b>Somente ofertas, preços e estoques reais</b></li></ul>
          </div>
        </div>`),

      // 11 — Processo
      slideFrame(11, 'Processo de produção e aprovação', 'Do planejamento à publicação, com responsável em cada etapa', `
        <div class="s-steps">${STATUSES.map((st, n) => `<div class="s-step"><i>${n + 1}</i>${esc(st.label)}</div>`).join('')}</div>
        <div class="s-cols s-c3">
          <div class="s-box"><h4>Cada conteúdo tem</h4><p>Objetivo, campanha, setor, roteiro, CTA, responsável, data de gravação, data de aprovação e checklist.</p></div>
          <div class="s-box"><h4>Estrutura do Reels</h4><p>Gancho (0–3 s) · narrativa · produto/benefício · CTA · cenas e enquadramentos · legenda · objetivo.</p></div>
          <div class="s-box"><h4>Direção de gravação</h4><p>Apresentadora comunicativa, imagens reais da loja, edição dinâmica, legendas legíveis e identidade visual consistente.</p></div>
        </div>`),

      // 12 — Indicadores
      slideFrame(12, 'Indicadores e metodologia', 'Acompanhamento com dados reais, sem projeções', `
        <div class="s-cols s-c2">
          <div class="s-box"><h4>Operacionais</h4><ul>
            <li><b>Taxa de publicação</b> = publicados ÷ planejados × 100 — atual: ${pctFmt(s.pubRate)}</li>
            <li><b>Taxa de aprovação</b> = aprovados ÷ enviados para aprovação × 100 — ${s.approvalRate == null ? 'aguardando dados' : 'atual: ' + pctFmt(s.approvalRate)}</li>
            <li><b>Pontualidade</b> = publicados na data ÷ planejados para publicação × 100 — ${s.punctuality == null ? 'aguardando dados' : 'atual: ' + pctFmt(s.punctuality)}</li></ul></div>
          <div class="s-box"><h4>Marketing</h4><ul>
            <li><b>Engajamento por alcance</b> = interações ÷ alcance × 100 — ${m.engagementRate == null ? 'aguardando dados' : pctFmt(m.engagementRate)}</li>
            <li><b>Crescimento líquido de seguidores</b> = finais − iniciais — ${m.followerGrowth == null ? 'aguardando dados' : num(m.followerGrowth)}</li>
            <li><b>Média de alcance por Reels</b> = soma dos alcances ÷ Reels publicados — ${m.avgReelsReach == null ? 'aguardando dados' : num(Math.round(m.avgReelsReach))}</li>
            <li><b>Taxa de compartilhamento</b> = compartilhamentos ÷ alcance × 100 — ${m.shareRate == null ? 'aguardando dados' : pctFmt(m.shareRate)}</li></ul></div>
        </div>
        <p style="font-size:1.05cqw">Métricas coletadas manualmente no Instagram Insights após cada publicação. Metas de alcance e vendas serão definidas somente após formar histórico de desempenho.</p>`),

      // 13 — Metas e entregáveis
      slideFrame(13, 'Metas operacionais e entregáveis', 'O que será entregue no período', `
        <div class="s-cols s-c2">
          <div class="s-box"><h4>Metas operacionais</h4>
            ${g.map(x => `<p style="margin-top:.5cqw"><b style="color:${x.ok ? 'var(--green)' : 'var(--red)'}">${x.ok ? '✓' : '•'}</b> <b>${esc(x.title)}</b><br><span style="font-size:1.05cqw">${esc(x.plan)}${x.real ? ' · ' + esc(x.real) : ''}</span></p>`).join('')}
          </div>
          <div class="s-box red"><h4>Entregáveis</h4><ul>
            <li>${s.reels} Reels com roteiro, gancho, CTA e legenda</li>
            <li>${PLAN.days * PLAN.storiesPerDayMin} a ${PLAN.days * PLAN.storiesPerDayMax} Stories em ${PLAN.days} dias</li>
            <li>Campanhas fixas semanais em todo o período</li>
            <li>Campanha completa da Super Sexta</li>
            <li>Conteúdos sazonais: Dia das Crianças, Professores, Alimentação, Outubro Rosa, Halloween, Finados e Novembro Azul</li>
            <li>Dashboard de gestão com calendário, produção e indicadores</li></ul></div>
        </div>`),

      // 14 — Próximos passos e conclusão
      `<div class="slide"><div class="slide-inner" style="padding:0;flex-direction:row;gap:0">
        <div style="flex:1.1;padding:5cqw 4cqw 4.5cqw 6cqw;display:flex;flex-direction:column;gap:1.4cqw">
          <div class="s-kicker">Próximos passos</div>
          <ol style="padding-left:2cqw;display:flex;flex-direction:column;gap:.5cqw">
            <li>Validar calendário e campanhas com a direção</li>
            <li>Confirmar horários e programações (pizzaria, Finados, Dia das Crianças, música ao vivo)</li>
            <li>Definir responsáveis e datas de gravação</li>
            <li>Levantar ofertas e preços reais por campanha</li>
            <li>Registrar o número inicial de seguidores</li>
            <li>Iniciar gravações e revisar indicadores semanalmente</li>
          </ol>
          <p class="s-quote" style="font-size:1.35cqw !important">O Super Rede Piraquara já oferece muito mais do que produtos de supermercado. Nossa estratégia é transformar esses diferenciais em conteúdo, criando novos motivos para o cliente visitar a loja, aproveitar as ofertas e consumir nossos serviços.</p>
        </div>
        <div class="s-final" style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:4cqw">
          <h2 style="font-size:3.6cqw">SUPER REDE PIRAQUARA</h2>
          <p style="margin-top:1.2cqw;font-size:1.6cqw">Mais presença. Mais relacionamento.<br>Mais oportunidades de venda.</p>
          <div class="price">MENOR PREÇO SEMPRE!</div>
        </div></div></div>`
    ];
  }

  function renderApresentacao() {
    const slides = buildSlides();
    ui.slide = Math.max(0, Math.min(slides.length - 1, ui.slide));
    return `<div class="pres-wrap">
      <div class="pres-stage" id="presStage">${slides[ui.slide]}
        <div class="fs-nav"><button type="button" data-action="slide-prev">‹ Anterior</button><button type="button" data-action="slide-next">Próximo ›</button><button type="button" data-action="fullscreen">Sair</button></div>
      </div>
      <div class="pres-controls">
        <button class="btn" type="button" data-action="slide-prev" ${ui.slide === 0 ? 'disabled' : ''}>‹ Anterior</button>
        <div class="pres-dots">${slides.map((_, n) => `<button type="button" class="${n === ui.slide ? 'active' : ''}" data-action="slide-go" data-n="${n}" aria-label="Slide ${n + 1}">${n + 1}</button>`).join('')}</div>
        <button class="btn" type="button" data-action="slide-next" ${ui.slide === slides.length - 1 ? 'disabled' : ''}>Próximo ›</button>
        <button class="btn btn-primary" type="button" data-action="fullscreen">⛶ Tela cheia</button>
      </div>
      <p class="note">Os slides 7, 9, 10, 12 e 13 são gerados a partir do calendário e dos indicadores — qualquer alteração no dashboard aparece aqui automaticamente.</p>
    </div>`;
  }

  function goSlide(n) {
    ui.slide = Math.max(0, Math.min(13, n));
    const stage = $('#presStage');
    if (stage && document.fullscreenElement === stage) {
      // mantém tela cheia: troca só o slide
      const slides = buildSlides();
      stage.querySelector('.slide').outerHTML = slides[ui.slide];
      $$('.pres-dots button').forEach((b, i) => b.classList.toggle('active', i === ui.slide));
    } else render();
  }

  /* =========================================================
     MODAL DE CONTEÚDO
     ========================================================= */
  let modalItem = null;
  let modalIsNew = false;

  function openModal(kicker, title, body, foot) {
    $('#modalKicker').innerHTML = kicker;
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = body;
    $('#modalFoot').innerHTML = foot;
    $('#modal').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    $('#modal').hidden = true;
    document.body.style.overflow = '';
    modalItem = null;
  }

  function openItem(id, tab = 'brief', newItem = null) {
    const it = newItem || state.items.find(i => i.id === id);
    if (!it) return;
    modalItem = it; modalIsNew = !!newItem;
    const isReels = it.format === 'Reels';
    const opt = (v, l, cur) => `<option value="${esc(v)}" ${cur === v ? 'selected' : ''}>${esc(l)}</option>`;
    const ta = (name, label, val, full = true, rows = 3) => `<div class="field ${full ? 'full' : ''}"><label>${esc(label)}</label><textarea class="textarea" name="${name}" rows="${rows}">${esc(val)}</textarea></div>`;
    const inp = (name, label, val, type = 'text', full = false, extra = '') => `<div class="field ${full ? 'full' : ''}"><label>${esc(label)}</label><input class="input" type="${type}" name="${name}" value="${esc(val)}" ${extra}></div>`;
    const week = weekOf(it.date);

    const brief = `<div class="form-grid">
      ${inp('date', 'Data', it.date, 'date', false, `min="${PLAN.start}" max="${PLAN.end}"`)}
      <div class="field"><label>Formato</label><select class="select" name="format">${opt('Reels', 'Reels', it.format)}${opt('Stories', 'Stories', it.format)}</select></div>
      ${inp('title', 'Título do conteúdo', it.title, 'text', true)}
      <div class="field full"><label>Campanhas</label><div class="multi">${CAMPAIGNS.map(c => `<label><input type="checkbox" name="campaigns" value="${c.id}" ${it.campaigns.includes(c.id) ? 'checked' : ''}>${esc(c.name)}</label>`).join('')}</div></div>
      <div class="field full"><label>Setores (o primeiro marcado é o principal)</label><div class="multi">${SECTORS.map(x => `<label><input type="checkbox" name="sectors" value="${x.id}" ${it.sectors.includes(x.id) ? 'checked' : ''}>${esc(x.label)}</label>`).join('')}</div></div>
      <div class="field"><label>Pilar editorial</label><select class="select" name="pillar">${PILLARS.map(p => opt(p.id, p.label, it.pillar)).join('')}</select></div>
      ${inp('cta', 'CTA (chamada para ação)', it.cta)}
      ${ta('objective', 'Objetivo', it.objective, true, 2)}
      ${ta('idea', 'Ideia criativa', it.idea, true, 3)}
      ${ta('interaction', 'Interação / enquete', it.interaction, false, 2)}
      ${ta('stories', isReels ? 'Stories do dia' : 'Observação de Stories', it.stories, false, 2)}
      ${ta('confirm', '⚠ Pendências de confirmação (horários, preços, autorizações)', it.confirm, true, 2)}
    </div>`;

    const script = isReels ? `<div class="alert" style="margin-bottom:14px"><span>✎</span><div>Roteiro sugerido — ajuste antes da gravação. Ganchos de referência: ${HOOK_TYPES.map(h => `<b>${esc(h.type)}</b> (“${esc(h.example)}”)`).join(', ')}.</div></div>
      <div class="form-grid">
        ${ta('s-hook', '1. Gancho (0 a 3 segundos)', it.script.hook, true, 2)}
        ${ta('s-development', '2. Desenvolvimento da narrativa', it.script.development, true, 2)}
        ${ta('s-product', '3. Produto, setor ou benefício comercial', it.script.product, true, 2)}
        <div class="field full"><label>4. Chamada para ação</label><input class="input" value="${esc(it.cta)}" disabled title="Edite o CTA na aba Briefing"></div>
        ${ta('s-scenes', '5. Cenas e enquadramentos', it.script.scenes, true, 2)}
        ${ta('s-caption', '6. Legenda sugerida', it.script.caption, true, 3)}
        <div class="field full"><label>7. Objetivo estratégico</label><input class="input" value="${esc(it.objective)}" disabled title="Edite o objetivo na aba Briefing"></div>
      </div>`
      : `<p class="note" style="margin-bottom:10px">Plano de ${PLAN.storiesPerDayMin} a ${PLAN.storiesPerDayMax} Stories distribuídos ao longo do dia. Foco de hoje: <b>${esc(it.idea)}</b>${it.interaction ? ` · Interação: <b>“${esc(it.interaction)}”</b>` : ''}</p>
      <div class="blocks">${STORY_BLOCKS.map(b => `<div class="block"><b>${esc(b.name)}</b><span>${esc(b.time)}</span><ul>${b.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>
      <p class="note" style="margin-top:10px">Horários são referências editoriais e precisam ser ajustados à operação real da loja.</p>`;

    const prod = `<div class="form-grid">
      <div class="field"><label>Status</label><select class="select" name="status">${STATUSES.map(st => opt(st.id, st.label, it.status)).join('')}</select></div>
      ${inp('owner', 'Responsável', it.owner, 'text', false, 'list="ownersList" placeholder="Nome do responsável"')}
      ${inp('recordDate', 'Data de gravação', it.recordDate, 'date')}
      ${inp('approvalDate', 'Data de aprovação', it.approvalDate, 'date')}
      ${inp('publishedDate', 'Data real de publicação', it.publishedDate, 'date')}
      ${inp('link', 'Link do conteúdo publicado', it.link, 'url', false, 'placeholder="https://www.instagram.com/..."')}
      <div class="field full"><label>Checklist</label>${it.checklist.map((c, n) => `<label class="chk"><input type="checkbox" name="chk-${n}" ${c.done ? 'checked' : ''}>${esc(c.t)}</label>`).join('') || '<span class="note">Sem checklist.</span>'}</div>
      ${ta('notes', 'Observações', it.notes, true, 3)}
    </div><datalist id="ownersList">${owners().map(o => `<option value="${esc(o)}">`).join('')}</datalist>`;

    const metrics = `<div class="alert info" style="margin-bottom:14px"><span>ℹ</span><div>Preencha somente com números reais do Instagram Insights. Deixe em branco o que não estiver disponível.</div></div>
      <div class="form-grid">
        ${METRIC_FIELDS.map(f => inp('m-' + f.id, f.label, hasVal(it.metrics[f.id]) ? it.metrics[f.id] : '', 'number', f.id === 'pedidos', 'min="0" step="1"')).join('')}
        ${!isReels ? inp('storiesPublished', 'Quantidade de Stories publicados no dia', hasVal(it.storiesPublished) ? it.storiesPublished : '', 'number', true, 'min="0" step="1"') : ''}
      </div>
      ${hasVal(it.metrics.alcance) && Number(it.metrics.alcance) > 0 && hasInteractions(it.metrics) ? `<p class="note" style="margin-top:10px">Engajamento por alcance deste conteúdo: <b>${pctFmt(interactions(it.metrics) / Number(it.metrics.alcance) * 100)}</b></p>` : ''}`;

    const tabs = [['brief', 'Briefing'], ['script', isReels ? 'Roteiro' : 'Plano de Stories'], ['prod', 'Produção e checklist'], ['metrics', 'Métricas']];
    const body = `<div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" data-tab="${k}" class="${k === tab ? 'active' : ''}">${l}</button>`).join('')}</div>
      <form id="itemForm" onsubmit="return false">
        <div data-pane="brief" ${tab === 'brief' ? '' : 'hidden'}>${brief}</div>
        <div data-pane="script" ${tab === 'script' ? '' : 'hidden'}>${script}</div>
        <div data-pane="prod" ${tab === 'prod' ? '' : 'hidden'}>${prod}</div>
        <div data-pane="metrics" ${tab === 'metrics' ? '' : 'hidden'}>${metrics}</div>
      </form>`;
    const kicker = `${fmtBadge(it.format)} ${statusBadge(it.status)} <span>${esc(weekday(it.date))}, ${fullDate(it.date)}${week ? ' · ' + esc(week.label) : ''}</span>`;
    const foot = `${modalIsNew ? '' : '<button class="btn btn-danger" type="button" data-modal="delete" style="margin-right:auto">Excluir</button>'}
      <button class="btn" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="button" data-modal="save">Salvar alterações</button>`;
    openModal(kicker, modalIsNew ? 'Novo conteúdo' : it.title, body, foot);
  }

  function saveItem() {
    const it = modalItem;
    const f = $('#itemForm');
    const val = n => { const el = f.elements[n]; return el ? el.value.trim() : ''; };
    const nOrNull = n => { const v = val(n); return v === '' ? null : Math.max(0, Number(v)); };
    const date = val('date');
    if (!date) { toast('Informe a data do conteúdo.'); return; }
    if (!val('title')) { toast('Informe o título do conteúdo.'); return; }
    const prevFormat = it.format;
    Object.assign(it, {
      date, format: val('format'), title: val('title'), pillar: val('pillar'), cta: val('cta'),
      objective: val('objective'), idea: val('idea'), interaction: val('interaction'), stories: val('stories'), confirm: val('confirm'),
      campaigns: $$('input[name="campaigns"]:checked', f).map(x => x.value),
      sectors: $$('input[name="sectors"]:checked', f).map(x => x.value),
      owner: val('owner'), recordDate: val('recordDate'), approvalDate: val('approvalDate'), publishedDate: val('publishedDate'),
      link: val('link'), notes: val('notes')
    });
    if (f.elements['s-hook']) {
      it.script = { hook: val('s-hook'), development: val('s-development'), product: val('s-product'), scenes: val('s-scenes'), caption: val('s-caption') };
    }
    const newStatus = val('status');
    if (newStatus !== it.status) {
      it.status = newStatus;
      if (statusIdx(newStatus) >= IDX_AGUARDANDO) it.sentForApproval = true;
      if (statusIdx(newStatus) >= IDX_APROVADO && !it.approvalDate) it.approvalDate = TODAY;
      if (newStatus === 'publicado' && !it.publishedDate) it.publishedDate = TODAY;
    }
    it.checklist.forEach((c, n) => { const el = f.elements['chk-' + n]; if (el) c.done = el.checked; });
    METRIC_FIELDS.forEach(m => { it.metrics[m.id] = nOrNull('m-' + m.id); });
    if (f.elements.storiesPublished) it.storiesPublished = nOrNull('storiesPublished');
    if (prevFormat !== it.format && !modalIsNew) {
      it.checklist = (it.format === 'Reels' ? REELS_CHECKLIST : STORIES_CHECKLIST).map(t => ({ t, done: false }));
    }
    if (modalIsNew) {
      it.checklist = (it.format === 'Reels' ? REELS_CHECKLIST : STORIES_CHECKLIST).map(t => ({ t, done: false }));
      state.items.push(it);
    }
    state.items.sort((a, b) => a.date.localeCompare(b.date) || (a.format === 'Reels' ? -1 : 1));
    save('Conteúdo salvo.');
    closeModal();
    render();
  }

  function newItem() {
    const date = (TODAY >= PLAN.start && TODAY <= PLAN.end) ? TODAY : PLAN.start;
    const it = {
      id: 'custom-' + Date.now(), date, format: 'Stories', campaigns: [], pillar: 'ofertas', title: '', objective: '', sectors: [],
      idea: '', cta: '', stories: '', interaction: '', confirm: '', status: 'planejado', owner: '', recordDate: '', approvalDate: '',
      publishedDate: '', link: '', notes: '', sentForApproval: false, storiesPublished: null, metrics: emptyMetrics(),
      script: { hook: '', development: '', product: '', scenes: '', caption: '' }, checklist: []
    };
    openItem(null, 'brief', it);
  }

  /* ---------------- dados, backup e exportação ---------------- */
  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // Confirmação dentro da página (janelas confirm() podem ser bloqueadas quando o painel está hospedado)
  let confirmCb = null;
  function askConfirm(title, text, yesLabel, onYes) {
    confirmCb = onYes;
    openModal('<span>Confirmação</span>', title, `<p>${esc(text)}</p>`,
      `<button class="btn" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="button" data-modal="confirm-yes">${esc(yesLabel)}</button>`);
  }

  // Exportação: tenta baixar o arquivo e sempre mostra o conteúdo para copiar
  let pendingExport = null;
  function showExport(title, name, content, type) {
    pendingExport = { name, content, type };
    openModal('<span>Exportação</span>', title, `
      <p class="note" style="margin-bottom:10px">Clique em <b>Baixar arquivo</b>. Se o download não iniciar (alguns navegadores e a versão hospedada bloqueiam downloads), use <b>Copiar conteúdo</b> e cole em um arquivo de texto chamado <b>${esc(name)}</b>.</p>
      <textarea class="textarea" id="exportText" readonly rows="12" style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px">${esc(content)}</textarea>`,
      `<button class="btn" type="button" data-close>Fechar</button><button class="btn" type="button" data-modal="copy">Copiar conteúdo</button><button class="btn btn-primary" type="button" data-modal="dl">Baixar arquivo</button>`);
  }

  function importData(data) {
    if (!data || !Array.isArray(data.items)) { toast('Backup inválido: use um JSON exportado por este dashboard.'); return; }
    askConfirm('Importar backup', `Importar ${data.items.length} conteúdos? Os dados atuais deste navegador serão substituídos.`, 'Importar', () => {
      state = normalize(data);
      save('Backup importado com sucesso.');
      render();
    });
  }

  function exportJSON() {
    showExport('Backup completo (JSON)', `super-rede-marketing-${TODAY}.json`, JSON.stringify(state, null, 2), 'application/json');
  }

  function exportCSV() {
    const cols = ['Data', 'Dia da semana', 'Campanha', 'Formato', 'Título do conteúdo', 'Objetivo', 'Setor principal', 'Setores', 'Pilar', 'Ideia criativa', 'CTA', 'Interação', 'Status', 'Responsável', 'Data de gravação', 'Data de aprovação', 'Data de publicação', 'Link do conteúdo publicado', 'Observações', 'Pendências de confirmação', 'Stories publicados (qtd.)', ...METRIC_FIELDS.map(f => f.label)];
    const q = v => { const s = String(v == null ? '' : v); return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const rows = state.items.map(i => [fullDate(i.date), weekday(i.date), i.campaigns.map(id => (camp(id) || {}).name).filter(Boolean).join(' + '), i.format, i.title, i.objective,
      i.sectors[0] ? sectorLabel(i.sectors[0]) : '', i.sectors.map(sectorLabel).join(', '), pillarLabel(i.pillar), i.idea, i.cta, i.interaction, statusLabel(i.status), i.owner,
      i.recordDate ? fullDate(i.recordDate) : '', i.approvalDate ? fullDate(i.approvalDate) : '', i.publishedDate ? fullDate(i.publishedDate) : '', i.link, i.notes, i.confirm,
      hasVal(i.storiesPublished) ? i.storiesPublished : '', ...METRIC_FIELDS.map(f => hasVal(i.metrics[f.id]) ? i.metrics[f.id] : '')]);
    const csv = '﻿' + [cols, ...rows].map(r => r.map(q).join(';')).join('\r\n');
    showExport('Calendário (CSV)', `super-rede-calendario-${TODAY}.csv`, csv, 'text/csv;charset=utf-8');
  }

  function openDataModal() {
    let logo = null; try { logo = localStorage.getItem(LOGO_KEY); } catch (e) { /* sem acesso */ }
    const body = `
      <div class="alert" style="margin-bottom:16px"><span>⚠</span><div><b>Como os dados são salvos:</b> este dashboard não usa banco de dados nem servidor. As alterações ficam guardadas <b>somente neste navegador, neste computador</b> (armazenamento local). Elas não aparecem para outras pessoas nem em outros aparelhos, e podem ser perdidas se o histórico/dados do navegador forem limpos ou em janela anônima.<br><br><b>Alternativa:</b> exporte o backup JSON regularmente e importe-o em outro computador para continuar de onde parou. Use o CSV para abrir o calendário no Excel ou Google Planilhas.</div></div>
      <div class="grid g-2">
        <div class="card"><h3>Exportar</h3><p class="note" style="margin-bottom:10px">Backup completo (conteúdos, status, métricas e seguidores).</p>
          <button class="btn btn-primary btn-block" type="button" data-modal="export-json">Exportar backup (JSON)</button>
          <button class="btn btn-block" type="button" data-modal="export-csv" style="margin-top:8px">Exportar calendário (CSV)</button></div>
        <div class="card"><h3>Importar</h3><p class="note" style="margin-bottom:10px">Substitui os dados deste navegador por um backup JSON exportado anteriormente.</p>
          <button class="btn btn-block" type="button" data-modal="import">Importar arquivo de backup (JSON)</button>
          <textarea class="textarea" id="importText" rows="3" placeholder="…ou cole aqui o conteúdo do backup JSON" style="margin-top:8px"></textarea>
          <button class="btn btn-block" type="button" data-modal="import-text" style="margin-top:6px">Importar texto colado</button></div>
        <div class="card"><h3>Logotipo oficial</h3><p class="note" style="margin-bottom:10px">Envie o arquivo do logotipo oficial do Super Rede Piraquara (PNG, JPG ou SVG, até 1 MB). Nenhuma marca foi criada para o protótipo.</p>
          ${logo ? `<img src="${esc(logo)}" alt="Logotipo atual" style="max-height:60px;margin-bottom:8px;display:block">` : ''}
          <input type="file" id="logoFile" accept="image/png,image/jpeg,image/svg+xml,image/webp" class="input">
          ${logo ? '<button class="btn btn-sm btn-danger" type="button" data-modal="logo-remove" style="margin-top:8px">Remover logotipo</button>' : ''}</div>
        <div class="card"><h3>Restaurar planejamento original</h3><p class="note" style="margin-bottom:10px">Apaga status, responsáveis e métricas deste navegador e recarrega o calendário original. Exporte um backup antes.</p>
          <button class="btn btn-danger btn-block" type="button" data-modal="reset">Restaurar planejamento original</button></div>
      </div>`;
    openModal('<span>Configurações</span>', 'Dados, backup e exportação', body, '<button class="btn" type="button" data-close>Fechar</button>');
    $('#logoFile').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1024 * 1024) { toast('Arquivo maior que 1 MB.'); return; }
      const r = new FileReader();
      r.onload = () => {
        try { localStorage.setItem(LOGO_KEY, r.result); applyLogo(); toast('Logotipo salvo.'); openDataModal(); }
        catch (err) { toast('Não foi possível salvar o logotipo neste navegador.'); }
      };
      r.readAsDataURL(file);
    });
  }

  function applyLogo() {
    let logo = null; try { logo = localStorage.getItem(LOGO_KEY); } catch (e) { /* sem acesso */ }
    const img = $('#brandLogo');
    if (logo) { img.src = logo; img.hidden = false; } else { img.removeAttribute('src'); img.hidden = true; }
  }

  $('#importFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        importData(JSON.parse(r.result));
      } catch (err) { toast('Arquivo inválido: use um backup JSON exportado por este dashboard.'); }
      e.target.value = '';
    };
    r.readAsText(file);
  });

  /* ---------------- eventos globais ---------------- */
  $('#view').addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action;
    const c = ui.cal;
    if (a === 'open') openItem(t.dataset.id, t.dataset.tab || 'brief');
    else if (a === 'cal-mode') { c.mode = t.dataset.mode; render(); }
    else if (a === 'cal-prev' || a === 'cal-next') {
      const d = a === 'cal-prev' ? -1 : 1;
      if (c.mode === 'month') c.month = d < 0 ? '2026-10' : '2026-11';
      else c.week = Math.max(1, Math.min(PLAN.weeks.length, c.week + d));
      render();
    }
    else if (a === 'clear-filters') { Object.keys(c.filters).forEach(k => { c.filters[k] = ''; }); render(); }
    else if (a === 'new-item') newItem();
    else if (a === 'move') {
      const it = state.items.find(i => i.id === t.dataset.id);
      const idx = statusIdx(it.status) + Number(t.dataset.dir);
      if (idx >= 0 && idx < STATUSES.length) moveStatus(it.id, STATUSES[idx].id);
    }
    else if (a === 'slide-prev') goSlide(ui.slide - 1);
    else if (a === 'slide-next') goSlide(ui.slide + 1);
    else if (a === 'slide-go') goSlide(Number(t.dataset.n));
    else if (a === 'fullscreen') toggleFullscreen();
    else if (a === 'save-account') {
      const v = $('#accStart').value.trim();
      state.account.followersStart = v === '' ? null : Math.max(0, Number(v));
      state.account.followersStartDate = $('#accStartDate').value;
      save('Seguidores iniciais salvos.'); render();
    }
    else if (a === 'add-snapshot') {
      const date = $('#snapDate').value, v = $('#snapVal').value.trim();
      if (!date || v === '') { toast('Informe a data e o número de seguidores.'); return; }
      state.account.snapshots = state.account.snapshots.filter(x => x.date !== date);
      state.account.snapshots.push({ date, followers: Math.max(0, Number(v)) });
      save('Atualização de seguidores registrada.'); render();
    }
    else if (a === 'del-snapshot') {
      state.account.snapshots = state.account.snapshots.filter(x => x.date !== t.dataset.date);
      save('Registro removido.'); render();
    }
  });

  // presentation fullscreen nav buttons live inside #view too; the fs-nav is inside stage (handled above)

  $('#view').addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.filter) { ui.cal.filters[t.dataset.filter] = t.value; render(); }
    else if (t.dataset.kb !== undefined) { ui.kb[t.dataset.kb] = t.value; render(); }
  });

  $('#modal').addEventListener('click', e => {
    if (e.target.id === 'modal' || e.target.closest('[data-close]')) { closeModal(); return; }
    const tabBtn = e.target.closest('.tabs button');
    if (tabBtn) {
      $$('.tabs button').forEach(b => b.classList.toggle('active', b === tabBtn));
      $$('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== tabBtn.dataset.tab; });
      return;
    }
    const m = e.target.closest('[data-modal]');
    if (!m) return;
    const a = m.dataset.modal;
    if (a === 'save') saveItem();
    else if (a === 'delete') {
      const target = modalItem;
      askConfirm('Excluir conteúdo', `Excluir “${target.title}” do calendário? Só é possível recuperar importando um backup.`, 'Excluir', () => {
        state.items = state.items.filter(i => i !== target);
        save('Conteúdo excluído.'); render();
      });
    }
    else if (a === 'export-json') exportJSON();
    else if (a === 'export-csv') exportCSV();
    else if (a === 'import') $('#importFile').click();
    else if (a === 'logo-remove') { try { localStorage.removeItem(LOGO_KEY); } catch (err) { /* ignora */ } applyLogo(); openDataModal(); }
    else if (a === 'reset') {
      askConfirm('Restaurar planejamento original', 'Status, responsáveis, métricas e seguidores deste navegador serão apagados. Exporte um backup antes, se precisar.', 'Restaurar', () => {
        state = buildSeed(); save('Planejamento original restaurado.'); render();
      });
    }
    else if (a === 'confirm-yes') {
      const cb = confirmCb; confirmCb = null; closeModal(); if (cb) cb();
    }
    else if (a === 'dl' && pendingExport) download(pendingExport.name, pendingExport.content, pendingExport.type);
    else if (a === 'copy') {
      const ta = $('#exportText');
      const fallback = () => { ta.focus(); ta.select(); toast('Texto selecionado: use Ctrl+C (ou Copiar) para copiar.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(() => toast('Conteúdo copiado.'), fallback);
      else fallback();
    }
    else if (a === 'import-text') {
      try { importData(JSON.parse($('#importText').value)); }
      catch (err) { toast('Texto inválido: cole o conteúdo completo de um backup JSON.'); }
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('#modal').hidden) { closeModal(); return; }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
    if (ui.page === 'apresentacao' && $('#modal').hidden && !typing) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); goSlide(ui.slide + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goSlide(ui.slide - 1); }
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    }
  });

  function toggleFullscreen() {
    const stage = $('#presStage');
    if (!stage) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (stage.requestFullscreen) stage.requestFullscreen().catch(() => toast('Tela cheia não permitida neste navegador.'));
    else toast('Tela cheia não suportada neste navegador.');
  }
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && ui.page === 'apresentacao') render(); });

  $('#btnData').addEventListener('click', openDataModal);
  $('#menuBtn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  $$('.nav a').forEach(a => a.addEventListener('click', () => $('#sidebar').classList.remove('open')));

  function route() {
    const h = location.hash.replace('#', '');
    ui.page = PAGES[h] ? h : 'visao';
    render();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  /* ---------------- início ---------------- */
  (function initToday() {
    const chip = $('#todayChip');
    const d = parse(TODAY);
    const label = `${WD_S[d.getDay()]}, ${fullDate(TODAY)}`;
    if (TODAY >= PLAN.start && TODAY <= PLAN.end) chip.textContent = `Hoje: ${label} · Dia ${PLAN_DATES.indexOf(TODAY) + 1} de ${PLAN.days}`;
    else chip.textContent = `Hoje: ${label} · ${TODAY < PLAN.start ? 'antes' : 'após'} o período`;
  })();
  applyLogo();
  renderSaveState();
  route();
})();
