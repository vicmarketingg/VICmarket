/* =========================================================
   PORTAL EDITORIAL KÁTIA · app
   SPA sem dependências, roteamento por hash.
   ========================================================= */
(() => {
  "use strict";

  const P = window.PORTAL;
  const app = document.getElementById("app");

  const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  const MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const DIAS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const DIAS_LONGOS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const FORMATOS = { reels: "Reels", carrossel: "Carrossel", foto: "Foto" };
  const FORMATOS_PLURAL = { reels: "Reels", carrossel: "Carrosséis", foto: "Fotos" };
  const STATUS_KEY = "katia-portal-status-v1";
  const FONTE_KEY = "katia-portal-fonte-v1";

  const conteudos = P.conteudos.slice().sort((a, b) => a.data.localeCompare(b.data));
  const porId = Object.fromEntries(conteudos.map((c) => [String(c.id), c]));
  const statusIds = P.status.map((s) => s.id);
  const statusRotulo = Object.fromEntries(P.status.map((s) => [s.id, s.rotulo]));

  /* ---------------- armazenamento local ---------------- */
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* modo privado */ }
    }
  };

  let statusMap = store.get(STATUS_KEY, {});
  const getStatus = (id) => (statusIds.includes(statusMap[id]) ? statusMap[id] : "a-fazer");
  const setStatus = (id, st) => {
    statusMap = Object.assign({}, statusMap, { [id]: st });
    store.set(STATUS_KEY, statusMap);
  };

  let fonte = store.get(FONTE_KEY, 1);
  const filtros = { formato: "todos", status: "todos" };

  /* ---------------- utilidades ---------------- */
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const paras = (txt) => String(txt || "").split(/\n{2,}/)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");

  const parseData = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

  const hoje = () => {
    let d = new Date();
    try {
      const q = new URLSearchParams(location.search).get("hoje");
      if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) d = parseData(q);
    } catch (e) { /* ignora */ }
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const diffDias = (a, b) => Math.round((a - b) / 864e5);
  const dataCurta = (c) => { const d = parseData(c.data); return `${String(d.getDate()).padStart(2, "0")} ${MESES[d.getMonth()]}`; };
  const diaSemana = (c) => DIAS[parseData(c.data).getDay()];
  const dataLonga = (c) => { const d = parseData(c.data); return `${DIAS_LONGOS[d.getDay()]}, ${d.getDate()} de ${MESES_LONGOS[d.getMonth()]}`; };

  const relativo = (c) => {
    const n = diffDias(parseData(c.data), hoje());
    if (n === 0) return "Publicar hoje";
    if (n === 1) return "Publicar amanhã";
    if (n > 1) return `Publicar em ${n} dias`;
    if (n === -1) return "Previsto para ontem";
    return `Previsto há ${-n} dias`;
  };

  const verbo = { reels: "gravar", carrossel: "criar", foto: "fotografar" };
  const statusLinha = (c) => {
    const st = getStatus(c.id);
    return st === "a-fazer" ? `Pronto para ${verbo[c.formato]}` : statusRotulo[st];
  };

  // Conteúdo mais próximo da data atual (empate → o próximo).
  const destaque = () => {
    const t = hoje();
    let melhor = conteudos[0], dist = Infinity;
    conteudos.forEach((c) => {
      const n = diffDias(parseData(c.data), t);
      const d = Math.abs(n) - (n >= 0 ? 0.5 : 0);
      if (d < dist) { dist = d; melhor = c; }
    });
    return melhor;
  };
  const seguinte = (c) => conteudos[conteudos.indexOf(c) + 1] || null;
  const anterior = (c) => conteudos[conteudos.indexOf(c) - 1] || null;

  const norm = (s) => String(s).replace(/\s+/g, " ").trim();
  const hookNoRoteiro = (c) => norm(c.roteiro).startsWith(norm(c.hook));

  const textoRoteiro = (c) => {
    let t = c.roteiro;
    if (!hookNoRoteiro(c)) t = `${c.hook}\n\n${t}`;
    const fecho = c.ctaFalado || c.ctaTexto;
    if (fecho) t += `\n\n${fecho}`;
    return t;
  };
  const textoLegenda = (c) => [c.legenda, c.ctaTexto].filter(Boolean).join("\n\n");
  const textoCarrossel = (c) => c.slides.map((s, i) => `SLIDE ${i + 1}\n${s.copy}\n\nVisual: ${s.visual}`).join("\n\n———\n\n");

  /* ---------------- ícones ---------------- */
  const ico = {
    seta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    voltar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    copiar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17l9-10"/></svg>',
    rec: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5" class="fill"/></svg>',
    expandir: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    fechar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    status: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>'
  };

  /* ---------------- componentes ---------------- */
  const fmtTag = (c) => `<span class="fmt fmt-${c.formato}"><i></i>${FORMATOS[c.formato].toUpperCase()}</span>`;
  const ctaTag = (c) => `<span class="cta-tag cta-${c.cta}">${P.ctas[c.cta].rotulo}</span>`;
  const statusTag = (c) => `<span class="st st-${getStatus(c.id)}"><i></i>${esc(statusLinha(c))}</span>`;
  const sugestao = (flag) => (flag ? '<em class="sug" title="Direção complementar ao briefing">sugestão</em>' : "");

  const card = (c, i = 0) => `
    <a class="card fmtc-${c.formato}" href="#/c/${c.id}" style="--i:${i}">
      <div class="card-top">
        <span class="card-date"><b>${dataCurta(c)}</b><small>${diaSemana(c)}</small></span>
        ${fmtTag(c)}
      </div>
      <h3 class="card-title">${esc(c.tema)}</h3>
      <div class="card-meta">
        <span class="pilar">${esc(c.pilar)}</span>
        ${ctaTag(c)}
      </div>
      <div class="card-foot">
        ${statusTag(c)}
        <span class="card-open">ABRIR CONTEÚDO ${ico.seta}</span>
      </div>
    </a>`;

  const secao = (rotulo, corpo, extra = "", i = 0) => `
    <section class="block" style="--i:${i}">
      <h2 class="label">${rotulo}${extra}</h2>
      ${corpo}
    </section>`;

  /* ---------------- INÍCIO ---------------- */
  function viewInicio() {
    const d = destaque();
    const prox = seguinte(d);
    const cont = (f) => conteudos.filter((c) => c.formato === f).length;
    const publicados = conteudos.filter((c) => getStatus(c.id) === "publicado").length;
    const emAndamento = conteudos.filter((c) => !["a-fazer", "publicado"].includes(getStatus(c.id))).length;
    const pct = Math.round((publicados / conteudos.length) * 100);
    const ehReels = d.formato === "reels";

    return `
      <section class="hero" style="--i:0">
        <div class="hero-inner">
          <p class="eyebrow">Mentoria Ayra · Direção criativa</p>
          <h1 class="hero-title">KÁTIA <span>— PLANO EDITORIAL</span></h1>
          <p class="hero-range">21 OUT <span>→</span> 20 NOV</p>
          <blockquote class="hero-quote">
            Conteúdo não existe apenas para ensinar.<br>
            Ele constrói percepção, relacionamento e desejo.
          </blockquote>
        </div>
      </section>

      <section class="stats" style="--i:1">
        <div class="stat-main">
          <b>${conteudos.length}</b>
          <span>conteúdos<br>planejados</span>
        </div>
        <div class="stat-cats">
          ${["reels", "carrossel", "foto"].map((f) => `
            <a href="#/conteudos" data-filtro-formato="${f}" class="stat-cat fmtc-${f}">
              <i></i><span>${FORMATOS[f].toUpperCase()}</span><b>${cont(f)}</b>
            </a>`).join("")}
        </div>
        <div class="progress">
          <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <span style="width:${pct}%"></span>
          </div>
          <p><b>${publicados}</b> publicados · <b>${emAndamento}</b> em andamento · <b>${conteudos.length - publicados - emAndamento}</b> a fazer</p>
        </div>
      </section>

      <section class="today" style="--i:2">
        <h2 class="label">Conteúdo de hoje</h2>
        <a class="feature fmtc-${d.formato}" href="#/c/${d.id}">
          <div class="feature-top">
            <span class="feature-date">${dataCurta(d)} <em>•</em> ${FORMATOS[d.formato].toUpperCase()}</span>
            <span class="feature-when">${relativo(d)}</span>
          </div>
          <h3 class="feature-title">${esc(d.tema)}</h3>
          <dl class="feature-brief">
            <div><dt>O que provocar</dt><dd>${esc(d.sentir || d.intencao)}</dd></div>
          </dl>
          <div class="card-meta">
            <span class="pilar">${esc(d.pilar)}</span>
            ${ctaTag(d)}
            ${statusTag(d)}
          </div>
          <span class="btn btn-primary">${ehReels ? "VER ROTEIRO" : "VER CONTEÚDO"} ${ico.seta}</span>
        </a>
      </section>

      ${prox ? `
      <section class="block" style="--i:3">
        <h2 class="label">Próximo conteúdo</h2>
        ${card(prox)}
      </section>` : ""}

      <section class="block rhythm" style="--i:4">
        <h2 class="label">Ritmo comercial</h2>
        <p class="lede">Não vender em todo conteúdo. Mais ou menos <b>2 conteúdos de conexão → 1 convite para a Mentoria Ayra</b>.</p>
        <ol class="rhythm-row">
          ${conteudos.map((c) => `
            <li><a href="#/c/${c.id}" class="dot cta-${c.cta}${c.id === d.id ? " is-now" : ""}" title="${dataCurta(c)} · ${P.ctas[c.cta].rotulo}">
              <span class="sr">${dataCurta(c)} · ${P.ctas[c.cta].rotulo}</span></a></li>`).join("")}
        </ol>
        <ul class="rhythm-legend">
          ${Object.entries(P.ctas).map(([k, v]) => `
            <li><span class="dot cta-${k}"></span><div><b>${v.rotulo}</b><small>${esc(v.descricao)}</small></div></li>`).join("")}
        </ul>
      </section>

      <section class="closing" style="--i:5">
        <p class="eyebrow">A sensação que o perfil deixa</p>
        <blockquote>“Esse conteúdo não fica procurando defeitos em mim. Ele me faz querer viver de outra forma.”</blockquote>
        <p class="formula">profundidade · leveza · expansão · desejo · identidade · vida real</p>
      </section>`;
  }

  /* ---------------- CALENDÁRIO ---------------- */
  function viewCalendario() {
    const ini = parseData(P.periodo.inicio);
    const fim = parseData(P.periodo.fim);
    const t = hoje();
    const start = new Date(ini); start.setDate(ini.getDate() - ((ini.getDay() + 6) % 7));
    const end = new Date(fim); end.setDate(fim.getDate() + (6 - ((fim.getDay() + 6) % 7)));
    const porData = Object.fromEntries(conteudos.map((c) => [c.data, c]));

    const cells = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const c = porData[iso];
      const fora = d < ini || d > fim;
      const ehHoje = d.getTime() === t.getTime();
      const mes = d.getDate() === 1 || d.getTime() === start.getTime() ? `<small>${MESES[d.getMonth()]}</small>` : "";
      const cls = ["day", fora ? "is-out" : "", ehHoje ? "is-today" : "", c ? `has fmtc-${c.formato} st-${getStatus(c.id)}` : ""].join(" ");
      cells.push(c
        ? `<a class="${cls}" href="#/c/${c.id}" aria-label="${dataCurta(c)} · ${FORMATOS[c.formato]} · ${esc(c.tema)}">${mes}<b>${d.getDate()}</b><i>${FORMATOS[c.formato].charAt(0)}</i></a>`
        : `<span class="${cls}">${mes}<b>${d.getDate()}</b></span>`);
    }

    const grupos = [["OUTUBRO", 9], ["NOVEMBRO", 10]].map(([nome, m]) => {
      const itens = conteudos.filter((c) => parseData(c.data).getMonth() === m);
      return `
        <section class="block" style="--i:2">
          <h2 class="label">${nome} <span class="count">${itens.length}</span></h2>
          <div class="agenda">
            ${itens.map((c, i) => `
              <div class="agenda-row${c.data === destaque().data ? " is-now" : ""}">
                <div class="agenda-date"><b>${parseData(c.data).getDate()}</b><small>${diaSemana(c)}</small></div>
                ${card(c, i)}
              </div>`).join("")}
          </div>
        </section>`;
    }).join("");

    return `
      <header class="page-head" style="--i:0">
        <p class="eyebrow">21 OUT → 20 NOV</p>
        <h1>Calendário</h1>
        <p class="lede">Uma publicação a cada dois dias. Toque em uma data para abrir o conteúdo.</p>
      </header>

      <section class="calendar" style="--i:1">
        <div class="cal-head">${["S", "T", "Q", "Q", "S", "S", "D"].map((x) => `<span>${x}</span>`).join("")}</div>
        <div class="cal-grid">${cells.join("")}</div>
        <ul class="cal-legend">
          <li><span class="fmt fmt-reels"><i></i>Reels</span></li>
          <li><span class="fmt fmt-carrossel"><i></i>Carrossel</span></li>
          <li><span class="fmt fmt-foto"><i></i>Foto</span></li>
          <li><span class="leg-pub"></span>Publicado</li>
        </ul>
      </section>
      ${grupos}`;
  }

  /* ---------------- CONTEÚDOS ---------------- */
  function viewConteudos() {
    const lista = conteudos.filter((c) =>
      (filtros.formato === "todos" || c.formato === filtros.formato) &&
      (filtros.status === "todos" || getStatus(c.id) === filtros.status));
    const n = (f) => (f === "todos" ? conteudos.length : conteudos.filter((c) => c.formato === f).length);
    const ns = (s) => conteudos.filter((c) => getStatus(c.id) === s).length;

    return `
      <header class="page-head" style="--i:0">
        <p class="eyebrow">${conteudos.length} conteúdos de feed</p>
        <h1>Conteúdos</h1>
      </header>

      <div class="filters" style="--i:1">
        <div class="chips" role="group" aria-label="Formato">
          ${["todos", "reels", "carrossel", "foto"].map((f) => `
            <button class="chip${filtros.formato === f ? " is-on" : ""}${f !== "todos" ? ` fmtc-${f}` : ""}" data-formato="${f}" aria-pressed="${filtros.formato === f}">
              ${f !== "todos" ? "<i></i>" : ""}${f === "todos" ? "Todos" : FORMATOS[f]} <small>${n(f)}</small>
            </button>`).join("")}
        </div>
        <div class="chips chips-status" role="group" aria-label="Status">
          <button class="chip chip-sm${filtros.status === "todos" ? " is-on" : ""}" data-status="todos" aria-pressed="${filtros.status === "todos"}">Todos os status</button>
          ${P.status.map((s) => `
            <button class="chip chip-sm st-${s.id}${filtros.status === s.id ? " is-on" : ""}" data-status="${s.id}" aria-pressed="${filtros.status === s.id}">
              <i></i>${s.rotulo} <small>${ns(s.id)}</small>
            </button>`).join("")}
        </div>
      </div>

      <section class="grid" style="--i:2">
        ${lista.length ? lista.map((c, i) => card(c, i)).join("") : `
          <div class="empty">
            <p>Nenhum conteúdo com esse filtro.</p>
            <button class="btn btn-ghost" data-limpar>Limpar filtros</button>
          </div>`}
      </section>`;
  }

  /* ---------------- AYRA ---------------- */
  function viewAyra() {
    return `
      <section class="hero hero-ayra" style="--i:0">
        <div class="hero-inner">
          <p class="eyebrow">Mentoria Ayra</p>
          <h1 class="hero-title">MÉTODO AYRA</h1>
          <blockquote class="hero-quote">Diminuir a distância entre aquilo que você percebe e aquilo que consegue viver.</blockquote>
        </div>
      </section>

      <section class="block" style="--i:1">
        <h2 class="label">A lógica do método</h2>
        <ol class="steps">
          ${P.metodo.map((m, i) => `
            <li class="step${i === 4 ? " step-soft" : ""}">
              <span class="step-n">${m.n}</span>
              <div><h3>${esc(m.titulo)}</h3><p>${esc(m.texto)}</p></div>
            </li>`).join("")}
        </ol>
      </section>

      <section class="block" style="--i:2">
        <h2 class="label">Pilares editoriais</h2>
        <div class="pillars">
          ${P.pilares.map((p) => `<article class="pillar"><h3>${esc(p.nome)}</h3><p>${esc(p.texto)}</p></article>`).join("")}
        </div>
      </section>

      <section class="block voice" style="--i:3">
        <h2 class="label">Como a marca fala</h2>
        <p class="voice-quote">Como uma mulher inteligente dividindo observações profundas sobre a vida — não como um perfil motivacional genérico.</p>
        <div class="voice-cols">
          <div>
            <h3>Evitar</h3>
            <ul>${P.evitar.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          </div>
          <div>
            <h3>Nunca prometer</h3>
            <ul>${P.semPromessas.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            <p class="small">Dimensões espirituais e energéticas aparecem como parte da abordagem e da experiência da Kátia — não como promessa objetiva de cura ou resultado.</p>
          </div>
        </div>
      </section>

      <section class="block" style="--i:4">
        <h2 class="label">Ofertas</h2>
        <ul class="products">
          ${P.produtos.map((p) => `
            <li class="product">
              <div><h3>${esc(p.nome)}</h3><p>${esc(p.texto)}</p></div>
              <span class="price">${esc(p.preco)}</span>
            </li>`).join("")}
        </ul>
        <p class="small center">Convite pelo Direct com a palavra <b>AYRA</b>.</p>
      </section>`;
  }

  /* ---------------- DETALHE ---------------- */
  function cabecalhoDetalhe(c) {
    return `
      <div class="detail-nav" style="--i:0">
        <a href="#/conteudos" class="back" data-voltar>${ico.voltar}<span>Voltar</span></a>
        <span class="detail-count">${conteudos.indexOf(c) + 1} / ${conteudos.length}</span>
      </div>
      <header class="detail-head fmtc-${c.formato}" style="--i:1">
        <p class="detail-date">${esc(dataLonga(c))} <em>·</em> ${relativo(c)}</p>
        <div class="detail-tags">${fmtTag(c)}<span class="pilar">${esc(c.pilar)}</span>${ctaTag(c)}</div>
        <h1 class="detail-title">${esc(c.tema)}</h1>
        <button class="status-btn st-${getStatus(c.id)}" data-abrir-status="${c.id}" aria-haspopup="dialog">
          <i></i><span>${statusRotulo[getStatus(c.id)]}</span>${ico.chevron}
        </button>
        ${c.formatoAlternativo ? `<p class="notice">${esc(c.formatoAlternativo)}</p>` : ""}
        ${c.nota ? `<p class="notice notice-warn"><b>Atenção editorial.</b> ${esc(c.nota)}</p>` : ""}
      </header>`;
  }

  function briefing(c, i) {
    const linhas = [];
    if (c.formato === "carrossel" && c.conceito) linhas.push(["Conceito", c.conceito, c.conceitoSugerido]);
    linhas.push(["Objetivo", c.objetivo, c.objetivoSugerido]);
    linhas.push(["Tipo de CTA", `${P.ctas[c.cta].rotulo} — ${P.ctas[c.cta].descricao}${c.ctaNota ? " " + c.ctaNota : ""}`]);
    linhas.push(["O que queremos que a pessoa sinta", c.sentir, c.sentirSugerido]);
    return `
      <section class="brief" style="--i:${i}">
        ${linhas.map(([k, v, s], j) => `
          <div class="brief-row${j === linhas.length - 1 ? " brief-feel" : ""}">
            <dt>${k}${sugestao(s)}</dt><dd>${esc(v)}</dd>
          </div>`).join("")}
      </section>`;
  }

  function blocoCta(c, i) {
    const partes = [];
    if (c.ctaFalado) partes.push(`<div class="cta-box"><span class="mini">Fala final do vídeo</span>${paras(c.ctaFalado)}</div>`);
    if (c.ctaTexto) partes.push(`<div class="cta-box cta-box-${c.cta}"><span class="mini">${c.ctaFalado ? "Na legenda" : P.ctas[c.cta].rotulo}</span>${paras(c.ctaTexto)}</div>`);
    if (!c.ctaTexto && c.ctaNota) partes.push(`<div class="cta-box"><span class="mini">${P.ctas[c.cta].rotulo}</span><p>${esc(c.ctaNota)}</p></div>`);
    return secao("CTA", partes.join(""), "", i);
  }

  function viewReels(c) {
    const st = getStatus(c.id);
    const gravado = statusIds.indexOf(st) >= statusIds.indexOf("gravado");
    const fecho = c.ctaFalado || c.ctaTexto;
    return `
      ${cabecalhoDetalhe(c)}
      ${briefing(c, 2)}

      <section class="speak" style="--i:3">
        <h2 class="label">Fale como se…</h2>
        <ul>${c.faleComoSe.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      </section>

      ${secao("Hook", `<blockquote class="hook">${esc(c.hook)}</blockquote>`, '<span class="label-hint">primeiros segundos</span>', 4)}

      <section class="block script-block" style="--i:5">
        <div class="script-head">
          <h2 class="label">Roteiro</h2>
          <div class="script-tools">
            <button class="tool" data-fonte="-1" aria-label="Diminuir texto">A−</button>
            <button class="tool" data-fonte="1" aria-label="Aumentar texto">A+</button>
            <button class="tool tool-wide" data-leitura="${c.id}">${ico.expandir}<span>Ler em tela cheia</span></button>
          </div>
        </div>
        <div class="script fs-${fonte}">
          ${hookNoRoteiro(c) ? "" : `<p class="script-hook">${esc(c.hook)}</p>`}
          ${paras(c.roteiro)}
          ${fecho ? `<div class="script-close"><span class="mini">Fechamento</span>${paras(fecho)}</div>` : ""}
        </div>
      </section>

      ${secao("Como gravar", `<ul class="howto">${c.comoGravar.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`, sugestao(c.comoGravarSugerido), 6)}

      ${secao("Texto na tela", `
        <div class="screen-wrap">
          <div class="screen"><span>${esc(c.textoNaTela)}</span></div>
          <p class="small">Texto curto, legível, centralizado no terço superior. Sans-serif, sem efeitos.</p>
        </div>`, sugestao(c.textoNaTelaSugerido), 7)}

      ${secao("Legenda", `<div class="caption">${paras(c.legenda)}</div>${c.legendaSugerida ? '<p class="small">Sugestão de legenda extraída do próprio roteiro.</p>' : ""}`, sugestao(c.legendaSugerida), 8)}

      ${blocoCta(c, 9)}
      ${c.cuidado ? `<p class="notice" style="--i:10"><b>Cuidado de linguagem.</b> ${esc(c.cuidado)}</p>` : ""}
      ${navPrevNext(c)}

      <div class="actionbar">
        <button class="act" data-copiar="roteiro">${ico.copiar}<span>Copiar roteiro</span></button>
        <button class="act" data-copiar="legenda">${ico.copiar}<span>Copiar legenda</span></button>
        <button class="act act-main${gravado ? " is-done" : ""}" data-gravado="${c.id}">
          ${gravado ? ico.check : ico.rec}<span>${gravado ? statusRotulo[st] : "Marcar como gravado"}</span>
        </button>
      </div>`;
  }

  function viewCarrossel(c) {
    return `
      ${cabecalhoDetalhe(c)}
      ${briefing(c, 2)}

      <section class="block slides-block" style="--i:3">
        <div class="script-head">
          <h2 class="label">Slides <span class="count">${c.slides.length}</span></h2>
          <span class="label-hint">deslize →</span>
        </div>
        <div class="slides" data-slides>
          ${c.slides.map((s, i) => `
            <figure class="slide">
              <div class="slide-art tom-${s.tom}">
                <span class="slide-n">${i + 1}/${c.slides.length}</span>
                <p>${esc(s.copy).replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>")}</p>
              </div>
              <figcaption>
                <span class="mini">Slide ${i + 1} · Visual</span>
                <p>${esc(s.visual)}</p>
              </figcaption>
            </figure>`).join("")}
        </div>
        <div class="slide-dots" aria-hidden="true">${c.slides.map((_, i) => `<span${i === 0 ? ' class="is-on"' : ""}></span>`).join("")}</div>
      </section>

      ${secao("Legenda", `<div class="caption">${paras(c.legenda)}</div>`, "", 4)}
      ${blocoCta(c, 5)}
      ${navPrevNext(c)}

      <div class="actionbar">
        <button class="act" data-copiar="carrossel">${ico.copiar}<span>Copiar carrossel</span></button>
        <button class="act" data-copiar="legenda">${ico.copiar}<span>Copiar legenda</span></button>
        <button class="act act-main" data-abrir-status="${c.id}">${ico.status}<span>Status</span></button>
      </div>`;
  }

  function viewFoto(c) {
    return `
      ${cabecalhoDetalhe(c)}

      <section class="photo-hero" style="--i:2">
        <div class="photo-art">
          <span class="mini">Frase</span>
          <p>${esc(c.frase)}</p>
        </div>
      </section>

      <section class="brief" style="--i:3">
        <div class="brief-row"><dt>Conceito${sugestao(c.conceitoSugerido)}</dt><dd>${esc(c.conceito)}</dd></div>
        <div class="brief-row"><dt>Tipo de fotografia${sugestao(c.tipoFotoSugerido)}</dt><dd>${esc(c.tipoFoto)}</dd></div>
        <div class="brief-row"><dt>Tipo de CTA</dt><dd>${P.ctas[c.cta].rotulo} — ${esc(P.ctas[c.cta].descricao)}</dd></div>
        <div class="brief-row brief-feel"><dt>Intenção emocional${sugestao(c.intencaoSugerida)}</dt><dd>${esc(c.intencao)}</dd></div>
      </section>

      ${secao("Legenda", `<div class="caption">${paras(c.legenda)}</div>`, "", 4)}
      ${blocoCta(c, 5)}
      ${navPrevNext(c)}

      <div class="actionbar">
        <button class="act" data-copiar="frase">${ico.copiar}<span>Copiar frase</span></button>
        <button class="act" data-copiar="legenda">${ico.copiar}<span>Copiar legenda</span></button>
        <button class="act act-main" data-abrir-status="${c.id}">${ico.status}<span>Status</span></button>
      </div>`;
  }

  function navPrevNext(c) {
    const a = anterior(c), s = seguinte(c);
    return `
      <nav class="prevnext" aria-label="Outros conteúdos">
        ${a ? `<a href="#/c/${a.id}" class="pn pn-prev"><small>${ico.voltar} ${dataCurta(a)} · ${FORMATOS[a.formato]}</small><span>${esc(a.tema)}</span></a>` : "<span></span>"}
        ${s ? `<a href="#/c/${s.id}" class="pn pn-next"><small>${dataCurta(s)} · ${FORMATOS[s.formato]} ${ico.seta}</small><span>${esc(s.tema)}</span></a>` : "<span></span>"}
      </nav>`;
  }

  /* ---------------- sheet de status ---------------- */
  const sheet = document.getElementById("sheet");
  const backdrop = document.getElementById("sheetBackdrop");
  let sheetAnterior = null;

  function abrirStatus(id) {
    const c = porId[id];
    const atual = getStatus(c.id);
    sheetAnterior = document.activeElement;
    sheet.innerHTML = `
      <div class="sheet-grip"></div>
      <h2 id="sheetTitle">Status do conteúdo</h2>
      <p class="sheet-sub">${dataCurta(c)} · ${FORMATOS[c.formato]} — ${esc(c.tema)}</p>
      <ol class="status-list">
        ${P.status.map((s, i) => `
          <li><button class="status-opt st-${s.id}${s.id === atual ? " is-on" : ""}" data-set-status="${s.id}" data-id="${c.id}" aria-pressed="${s.id === atual}">
            <span class="status-step">${i + 1}</span><i></i><span>${s.rotulo}</span>${s.id === atual ? ico.check : ""}
          </button></li>`).join("")}
      </ol>`;
    sheet.hidden = false; backdrop.hidden = false;
    requestAnimationFrame(() => { sheet.classList.add("is-open"); backdrop.classList.add("is-open"); });
    const on = sheet.querySelector(".is-on"); if (on) on.focus();
  }

  function fecharSheet() {
    sheet.classList.remove("is-open"); backdrop.classList.remove("is-open");
    setTimeout(() => { sheet.hidden = true; backdrop.hidden = true; }, 260);
    if (sheetAnterior && document.contains(sheetAnterior)) sheetAnterior.focus();
  }

  /* ---------------- modo leitura ---------------- */
  function abrirLeitura(id) {
    const c = porId[id];
    const fecho = c.ctaFalado || c.ctaTexto;
    const el = document.createElement("div");
    el.className = "reader";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Roteiro em tela cheia");
    el.innerHTML = `
      <div class="reader-bar">
        <span>${dataCurta(c)} · REELS</span>
        <div>
          <button class="tool" data-fonte="-1" aria-label="Diminuir texto">A−</button>
          <button class="tool" data-fonte="1" aria-label="Aumentar texto">A+</button>
          <button class="tool" data-fechar-leitura aria-label="Fechar">${ico.fechar}</button>
        </div>
      </div>
      <div class="reader-body script fs-${fonte}">
        ${hookNoRoteiro(c) ? "" : `<p class="reader-hook">${esc(c.hook)}</p>`}
        ${paras(c.roteiro)}
        ${fecho ? `<div class="script-close">${paras(fecho)}</div>` : ""}
        <p class="reader-end">fim</p>
      </div>`;
    document.body.appendChild(el);
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => el.classList.add("is-open"));
    el.querySelector("[data-fechar-leitura]").focus();
  }

  function fecharLeitura() {
    const el = document.querySelector(".reader");
    if (!el) return;
    el.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => el.remove(), 250);
  }

  function mudarFonte(delta) {
    fonte = Math.max(0, Math.min(3, fonte + delta));
    store.set(FONTE_KEY, fonte);
    document.querySelectorAll(".script").forEach((s) => {
      s.className = s.className.replace(/\bfs-\d\b/, `fs-${fonte}`);
    });
  }

  /* ---------------- copiar / toast ---------------- */
  const toastEl = document.getElementById("toast");
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-on"), 2200);
  }

  async function copiar(texto, msg) {
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(texto);
        ok = true;
      }
    } catch (e) { ok = false; }
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = texto;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove();
    }
    toast(ok ? msg : "Não foi possível copiar neste navegador");
  }

  /* ---------------- roteamento ---------------- */
  let navegacoes = 0;

  function rota() {
    const h = location.hash.replace(/^#\/?/, "") || "inicio";
    const [nome, arg] = h.split("/");
    return { nome, arg };
  }

  function render({ animar = true, manterScroll = false } = {}) {
    const { nome, arg } = rota();
    const y = window.scrollY;
    let html, aba = nome, detalhe = false;

    if (nome === "c" && porId[arg]) {
      const c = porId[arg];
      detalhe = true;
      aba = "conteudos";
      html = c.formato === "reels" ? viewReels(c) : c.formato === "carrossel" ? viewCarrossel(c) : viewFoto(c);
      document.title = `${dataCurta(c)} · ${FORMATOS[c.formato]} — Kátia`;
    } else if (nome === "calendario") {
      html = viewCalendario(); document.title = "Calendário — Kátia";
    } else if (nome === "conteudos") {
      html = viewConteudos(); document.title = "Conteúdos — Kátia";
    } else if (nome === "ayra") {
      html = viewAyra(); document.title = "Método Ayra — Kátia";
    } else {
      aba = "inicio"; html = viewInicio(); document.title = "Kátia — Plano Editorial";
    }

    app.innerHTML = `<div class="view${detalhe ? " view-detail" : ""}">${html}</div>`;
    document.body.classList.toggle("is-detail", detalhe);
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const on = a.dataset.nav === aba;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });

    if (animar) {
      app.classList.remove("enter");
      void app.offsetWidth;
      app.classList.add("enter");
    } else {
      app.classList.remove("enter");
    }
    window.scrollTo(0, manterScroll ? y : 0);
    ligarSlides();
  }

  function ligarSlides() {
    const wrap = app.querySelector("[data-slides]");
    if (!wrap) return;
    const dots = app.querySelectorAll(".slide-dots span");
    const slides = wrap.querySelectorAll(".slide");
    wrap.addEventListener("scroll", () => {
      let melhor = 0, dist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - wrap.offsetLeft - wrap.scrollLeft);
        if (d < dist) { dist = d; melhor = i; }
      });
      dots.forEach((d, i) => d.classList.toggle("is-on", i === melhor));
    }, { passive: true });
  }

  window.addEventListener("hashchange", () => {
    navegacoes += 1;
    fecharLeitura();
    render();
  });

  /* ---------------- eventos ---------------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) {
      if (e.target === backdrop) fecharSheet();
      return;
    }

    if (t.matches("[data-filtro-formato]")) {
      filtros.formato = t.dataset.filtroFormato;
      filtros.status = "todos";
      return; // o link segue para #/conteudos
    }
    if (t.matches("[data-voltar]") && navegacoes > 0) {
      e.preventDefault();
      history.back();
      return;
    }
    if (t.matches("[data-formato]")) {
      filtros.formato = t.dataset.formato;
      render({ animar: false, manterScroll: true });
      return;
    }
    if (t.matches("[data-status]")) {
      filtros.status = t.dataset.status;
      render({ animar: false, manterScroll: true });
      return;
    }
    if (t.matches("[data-limpar]")) {
      filtros.formato = "todos"; filtros.status = "todos";
      render({ animar: false, manterScroll: true });
      return;
    }
    if (t.matches("[data-abrir-status]")) { abrirStatus(t.dataset.abrirStatus); return; }
    if (t.matches("[data-set-status]")) {
      setStatus(Number(t.dataset.id), t.dataset.setStatus);
      fecharSheet();
      render({ animar: false, manterScroll: true });
      toast(`Status: ${statusRotulo[t.dataset.setStatus]}`);
      return;
    }
    if (t.matches("[data-gravado]")) {
      const id = Number(t.dataset.gravado);
      const st = getStatus(id);
      if (statusIds.indexOf(st) >= statusIds.indexOf("gravado")) {
        abrirStatus(id);
        return;
      }
      setStatus(id, "gravado");
      render({ animar: false, manterScroll: true });
      toast("Marcado como gravado ✓");
      return;
    }
    if (t.matches("[data-copiar]")) {
      const c = porId[rota().arg];
      if (!c) return;
      const tipo = t.dataset.copiar;
      if (tipo === "roteiro") copiar(textoRoteiro(c), "Roteiro copiado");
      else if (tipo === "legenda") copiar(textoLegenda(c), "Legenda copiada (com CTA)");
      else if (tipo === "carrossel") copiar(textoCarrossel(c), "Carrossel copiado");
      else if (tipo === "frase") copiar(c.frase, "Frase copiada");
      t.classList.add("is-flash");
      setTimeout(() => t.classList.remove("is-flash"), 600);
      return;
    }
    if (t.matches("[data-fonte]")) { mudarFonte(Number(t.dataset.fonte)); return; }
    if (t.matches("[data-leitura]")) { abrirLeitura(t.dataset.leitura); return; }
    if (t.matches("[data-fechar-leitura]")) { fecharLeitura(); return; }
  });

  backdrop.addEventListener("click", fecharSheet);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!sheet.hidden) fecharSheet();
    else fecharLeitura();
  });

  render();
})();
