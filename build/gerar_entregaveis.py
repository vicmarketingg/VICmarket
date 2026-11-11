"""Gera os entregáveis do Kit (HTML para impressão + planilha do calendário).

Uso:
    python3 build/gerar_entregaveis.py      # gera build/html/*.html e entregaveis/*.xlsx
    node build/imprimir_pdfs.js             # converte build/html/*.html em entregaveis/*.pdf

Fonte do conteúdo: pasta kit/ (Markdown). Para mudar um texto, edite o .md e gere de novo.
"""
import json
import re
from pathlib import Path

import markdown
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

RAIZ = Path(__file__).resolve().parent.parent
KIT = RAIZ / "kit"
HTML_DIR = RAIZ / "build" / "html"
SAIDA = RAIZ / "entregaveis"

NOME_KIT = "Kit Operacional de Marketing para Supermercados"


# ---------------------------------------------------------------- ajustes por arquivo

def ajusta_modelos_canva(md: str) -> str:
    """O PDF do comprador leva o passo a passo e o catálogo dos 15 modelos.
    A Parte A (especificação para quem cria os modelos) fica só no arquivo-fonte."""
    titulo = (
        "# 15 MODELOS DE ENCARTES E OFERTAS (CANVA)\n"
        "### Como editar os modelos pelo celular + o que é cada um dos 15.\n\n"
    )
    parte_b = md[md.index("## PARTE B"):]
    parte_b = parte_b.replace(
        "## PARTE B — INSTRUÇÕES PARA O FUNCIONÁRIO (vai impressa no kit)",
        "## COMO EDITAR OS MODELOS (PASSO A PASSO)",
    )
    catalogo = md[md.index("## GRUPO 1"):md.index("## PARTE B")]
    # "Layout" é instrução para quem desenha o modelo; o comprador já recebe pronto.
    catalogo = re.sub(r"^- \*\*Layout:\*\*.*\n", "", catalogo, flags=re.M)
    catalogo = catalogo.rstrip().rstrip("-").rstrip()
    lembrete = (
        "\n\n> 🔗 **Os links dos modelos estão na área de membros.** Clique em cada um → "
        "**Usar modelo**, e ele fica salvo na conta da loja.\n\n"
        "> 🍺 **Post com bebida alcoólica** (Corte do Dia, Kit Churrasco, Combo Festa): use a versão "
        "do modelo que já traz *\"Venda proibida para menores de 18 anos. Beba com moderação.\"*\n\n"
    )
    return (
        titulo + parte_b.rstrip() + "\n\n---\n\n## OS 15 MODELOS\n" + lembrete + catalogo + "\n"
    )


def ajusta_order_bump(md: str) -> str:
    """Tira a especificação de design (é para quem cria as placas) e deixa as dicas de impressão."""
    corpo = md[:md.index("## ESPECIFICAÇÃO DE DESIGN")].rstrip().rstrip("-").rstrip()
    dicas = (
        "\n\n---\n\n## DICAS DE IMPRESSÃO\n"
        "- O QR Code precisa ter **no mínimo 4 cm × 4 cm** impresso, sobre fundo branco.\n"
        "- **Teste cada QR Code com o seu celular** antes de imprimir todas as placas.\n"
        "- Plastifique ou use papel couchê para durar mais no balcão.\n"
    )
    return corpo + dicas


def ajusta_comece_aqui(md: str) -> str:
    return md.replace(
        "com o passo a passo da Parte B dos modelos",
        "com o passo a passo do PDF dos modelos",
    )


# ---------------------------------------------------------------- lista de entregáveis

ENTREGAVEIS = [
    dict(fonte="08-comece-aqui-primeiro-acesso.md", saida="00-Comece-Aqui-Primeiro-Acesso",
         etiqueta="Comece aqui", ajuste=ajusta_comece_aqui),
    dict(fonte="01-rotina-semanal.md", saida="01-Folha-de-Rotina-Semanal",
         etiqueta="Entregável 1", classe="preencher"),
    dict(fonte="02-30-roteiros-chao-de-loja.md", saida="02-30-Roteiros-Grave-no-Chao-de-Loja",
         etiqueta="Entregável 2", classe="roteiros"),
    dict(fonte="03-15-modelos-canva.md", saida="03-15-Modelos-Canva-Como-Usar",
         etiqueta="Entregável 3", ajuste=ajusta_modelos_canva),
    dict(fonte="04-calendario-comercial-2027.md", saida="04-Calendario-Comercial-2027",
         etiqueta="Entregável 4", paisagem=True, classe="calendario"),
    dict(fonte="05-bonus1-checklist-cacador-de-ofertas.md", saida="05-Bonus-1-Checklist-do-Cacador-de-Ofertas",
         etiqueta="Bônus 1", classe="preencher"),
    dict(fonte="06-bonus2-scripts-whatsapp.md", saida="06-Bonus-2-Mensagens-e-Audios-de-WhatsApp",
         etiqueta="Bônus 2", classe="whatsapp"),
    dict(fonte="07-order-bump-placas-qrcode.md", saida="07-Order-Bump-Kit-de-Sinalizacao-QR-Code",
         etiqueta="Kit de Sinalização", ajuste=ajusta_order_bump),
]


# ---------------------------------------------------------------- Markdown -> HTML

CSS = (Path(__file__).parent / "estilo.css").read_text(encoding="utf-8")


def cabecalho(html: str, etiqueta: str) -> str:
    """Transforma o primeiro H1 + H3 do arquivo na faixa de título do documento."""
    m = re.match(r"\s*<h1>(.*?)</h1>\s*(<h3>(.*?)</h3>)?", html, flags=re.S)
    if not m:
        return html
    sub = f'<p class="doc-sub">{m.group(3)}</p>' if m.group(3) else ""
    faixa = (
        '<header class="doc-head">'
        f'<div class="doc-kit">{NOME_KIT} · <b>{etiqueta}</b></div>'
        f'<h1 class="doc-title">{m.group(1)}</h1>{sub}</header>'
    )
    return faixa + html[m.end():]


def agrupa_cartoes(html: str) -> str:
    """Mantém juntos (sem quebra de página no meio) cada título com o conteúdo logo abaixo."""
    # ### Título + tudo até o próximo título  (roteiros, modelos, passos)
    html = re.sub(r"(<h3>.*?</h3>.*?)(?=<h[123]|<hr|$)", r'<div class="card">\1</div>', html, flags=re.S)
    # **1.1 — Título** + citação  (mensagens de WhatsApp, placas)
    html = re.sub(
        r"(<p><strong>[^<]*</strong></p>\s*<blockquote>.*?</blockquote>)",
        r'<div class="card msg">\1</div>', html, flags=re.S,
    )
    return html


def agrupa_meses(html: str) -> str:
    """Calendário: cada mês (título + tabela) fica inteiro na mesma página."""
    return re.sub(r"(<h2>[^<]*</h2>\s*<table>.*?</table>)", r'<div class="bloco">\1</div>', html, flags=re.S)


LISTA = re.compile(r"^\s*(?:[-*]|\d+\.)\s")


def separa_listas(md: str) -> str:
    """No Markdown, lista colada num parágrafo vira texto corrido. Aqui ela ganha uma linha em branco antes,
    e sublista com 3 espaços passa para 4 (o mínimo que o Markdown entende)."""
    saida = []
    for linha in md.splitlines():
        linha = re.sub(r"^ {2,3}(?=[-*] )", "    ", linha)
        anterior = saida[-1] if saida else ""
        if (LISTA.match(linha) and anterior.strip() and not LISTA.match(anterior)
                and not anterior.startswith((">", "|", "#", "    "))):
            saida.append("")
        saida.append(linha)
    return "\n".join(saida)


def linhas_de_preencher(md: str) -> str:
    """'___' vira uma linha para escrever à mão (o Markdown leria como negrito/itálico)."""
    return re.sub(r"_{2,}", lambda m: f'<span class="blank" style="width:{len(m.group(0)) * 0.55:.1f}em"></span>', md)


def secoes_roteiros(html: str) -> str:
    """Cada setor (# 🥩 AÇOUGUE...) começa em página nova, com faixa de setor."""
    return re.sub(r"<h1>(.*?)</h1>", r'<h1 class="setor">\1</h1>', html)


def marca_caixas(html: str) -> str:
    html = re.sub(r"<td>\s*☐\s*</td>", '<td class="so-caixa"><span class="box">☐</span></td>', html)
    return re.sub(r"☐(?!</span>)", '<span class="box">☐</span>', html)


def gera_html(item: dict) -> Path:
    md = (KIT / item["fonte"]).read_text(encoding="utf-8")
    if item.get("ajuste"):
        md = item["ajuste"](md)
    md = separa_listas(md)
    md = linhas_de_preencher(md)
    corpo = markdown.markdown(md, extensions=["tables", "sane_lists", "nl2br"])
    corpo = cabecalho(corpo, item["etiqueta"])
    if item.get("classe") == "roteiros":
        corpo = secoes_roteiros(corpo)
    corpo = agrupa_cartoes(corpo)
    if item.get("classe") == "calendario":
        corpo = agrupa_meses(corpo)
    corpo = marca_caixas(corpo)
    titulo = re.sub(r"<.*?>", "", re.search(r'doc-title">(.*?)</h1>', corpo).group(1))
    pagina = (
        "<!DOCTYPE html><html lang='pt-BR'><head><meta charset='utf-8'>"
        f"<title>{titulo}</title>"
        "<link href='https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800;900"
        "&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap' rel='stylesheet'>"
        f"<style>{CSS}</style></head>"
        f"<body class='{item.get('classe', '')}'>{corpo}</body></html>"
    )
    destino = HTML_DIR / f"{item['saida']}.html"
    destino.write_text(pagina, encoding="utf-8")
    return destino


# ---------------------------------------------------------------- planilha do calendário

def limpa(txt: str) -> str:
    return re.sub(r"\*\*(.*?)\*\*", r"\1", txt).strip()


def gera_planilha_calendario() -> Path:
    md = (KIT / "04-calendario-comercial-2027.md").read_text(encoding="utf-8")
    linhas = []
    mes = None
    for linha in md.splitlines():
        if linha.startswith("## ") and linha[3:].strip().isupper() and "|" not in linha:
            titulo = linha[3:].strip()
            mes = titulo if titulo.split()[0] not in ("COMO", "TODO", "DATAS") else None
        elif mes and linha.startswith("|") and not linha.startswith("|---") and not linha.startswith("| Data"):
            cols = [limpa(c) for c in linha.strip().strip("|").split("|")]
            linhas.append([mes.title()] + cols)

    wb = Workbook()
    ws = wb.active
    ws.title = "Calendário 2027"
    cab = ["Mês", "Data", "Ocasião", "O que vender", "Começar a divulgar", "Avisar compras", "Feito?"]
    ws.append(cab)
    for l in linhas:
        ws.append(l + ["☐"])

    vermelho = PatternFill("solid", fgColor="D62828")
    amarelo = PatternFill("solid", fgColor="FFF4DC")
    fina = Side(style="thin", color="D9D4CC")
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF", name="Arial", size=11)
        c.fill = vermelho
        c.alignment = Alignment(vertical="center", horizontal="center", wrap_text=True)
    mes_anterior, faixa = None, False
    for row in ws.iter_rows(min_row=2):
        if row[0].value != mes_anterior:
            faixa, mes_anterior = not faixa, row[0].value
        for c in row:
            c.font = Font(name="Arial", size=10, bold=(c.column == 3))
            c.alignment = Alignment(vertical="top", wrap_text=True,
                                    horizontal="center" if c.column in (1, 2, 5, 6, 7) else "left")
            c.border = Border(top=fina, bottom=fina, left=fina, right=fina)
            if faixa:
                c.fill = amarelo
    for col, larg in zip("ABCDEFG", [12, 16, 34, 52, 18, 16, 8]):
        ws.column_dimensions[col].width = larg
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:G{ws.max_row}"

    uso = wb.create_sheet("Como usar")
    bloco = md[md.index("## COMO USAR"):md.index("## JANEIRO")]
    bloco += md[md.index("## DATAS QUE MUDAM"):]
    uso.column_dimensions["A"].width = 110
    for linha in bloco.splitlines():
        t = linha.strip()
        if not t or t == "---":
            continue
        negrito = t.startswith("#")
        t = limpa(t.lstrip("#").strip().lstrip("- ").strip())
        uso.append([("• " if linha.strip().startswith("- ") else "") + t])
        c = uso.cell(row=uso.max_row, column=1)
        c.font = Font(name="Arial", size=12 if negrito else 11, bold=negrito,
                      color="D62828" if negrito else "1D1D1D")
        c.alignment = Alignment(wrap_text=True, vertical="top")

    destino = SAIDA / "04-Calendario-Comercial-2027.xlsx"
    wb.save(destino)
    print(f"planilha: {len(linhas)} datas -> {destino.relative_to(RAIZ)}")
    return destino


if __name__ == "__main__":
    HTML_DIR.mkdir(parents=True, exist_ok=True)
    SAIDA.mkdir(parents=True, exist_ok=True)
    manifesto = []
    for item in ENTREGAVEIS:
        h = gera_html(item)
        manifesto.append({"html": str(h), "pdf": str(SAIDA / f"{item['saida']}.pdf"),
                          "paisagem": item.get("paisagem", False)})
        print("html:", h.relative_to(RAIZ))
    (HTML_DIR / "manifesto.json").write_text(json.dumps(manifesto, indent=2), encoding="utf-8")
    gera_planilha_calendario()
