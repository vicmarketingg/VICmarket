# VICmarket

## Kit Operacional de Marketing para Supermercados

### `entregaveis/` — o que vai para a área de membros

| Ordem | Arquivo | Páginas |
|---|---|---|
| 1º | `00-Comece-Aqui-Primeiro-Acesso.pdf` | 3 |
| 2º | `01-Folha-de-Rotina-Semanal.pdf` | 2 (frente e verso) |
| 3º | `02-30-Roteiros-Grave-no-Chao-de-Loja.pdf` | 11 |
| 4º | `03-15-Modelos-Canva-Como-Usar.pdf` + os links dos modelos (Canva) | 4 |
| 5º | `04-Calendario-Comercial-2027.pdf` (paisagem) | 5 |
| 5º | `04-Calendario-Comercial-2027.xlsx` (abre no Google Sheets: Arquivo → Importar) | — |
| Bônus 1 | `05-Bonus-1-Checklist-do-Cacador-de-Ofertas.pdf` | 2 (frente e verso) |
| Bônus 2 | `06-Bonus-2-Mensagens-e-Audios-de-WhatsApp.pdf` | 5 |
| Order bump | `07-Order-Bump-Kit-de-Sinalizacao-QR-Code.pdf` + as 8 placas (Canva) | 3 |

### `kit/` — o conteúdo original (Markdown)

É a fonte de tudo. `00-LEIA-PRIMEIRO.md` (briefing) e `09-pagina-de-vendas.md` (copy da página) ficam só aqui, porque não vão para o comprador.

**O que muda entre a fonte e o PDF:**
- **Modelos do Canva (03):** o PDF do comprador traz o passo a passo e a lista dos 15 modelos. A Parte A (especificação para quem cria os modelos) e as linhas de "Layout" ficam só na fonte.
- **Order bump (07):** sai a "Especificação de design". Entram 3 dicas de impressão (QR Code de 4 cm, testar antes de imprimir, plastificar).
- **Comece Aqui (08):** "passo a passo da Parte B dos modelos" passa a ser "passo a passo do PDF dos modelos".

### Como gerar de novo depois de editar um texto

```bash
pip install markdown openpyxl
python3 build/gerar_entregaveis.py
node build/imprimir_pdfs.js
```

### Pendências da Victoria
- Criar os 15 modelos e as 8 placas no Canva e colocar os links na área de membros.
