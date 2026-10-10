# Super Rede Piraquara — Dashboard de Marketing

Painel de gestão e apresentação executiva do planejamento de marketing digital (Instagram) de **10/10 a 10/11/2026**.

## Como abrir

Abra `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox, Safari). Não precisa de instalação nem de servidor.
Também pode ser publicado como site estático (GitHub Pages, Netlify etc.).

## Páginas

| Página | O que faz |
|---|---|
| **Visão geral** | Indicadores de planejamento (32 dias, 16 Reels, 16 dias sem Reels, 32 dias com Stories, 320–480 Stories), execução (publicados, pendentes, aprovados, % de execução, taxa de publicação, aprovação e pontualidade), próximas campanhas e gravações, evolução semanal, metas operacionais, pilares editoriais e pendências de confirmação. |
| **Calendário editorial** | Visualização mensal, semanal e em lista, com filtros por data, formato, campanha, setor, status e responsável. Clique em um conteúdo para ver e editar briefing, roteiro, produção/checklist e métricas. Botão para criar novos conteúdos. |
| **Produção** | Quadro Kanban com as 9 etapas (Planejado → Publicado). Arraste os cartões ou use as setas. |
| **Campanhas** | Cartões das campanhas fixas, da Super Sexta e das datas sazonais, com objetivo, datas, conteúdos, andamento e resultados (quando houver). |
| **Indicadores e resultados** | Inserção manual de métricas por conteúdo e de seguidores da conta; indicadores e gráficos aparecem somente com dados reais. |
| **Apresentação executiva** | 14 slides para a direção, com navegação por setas/teclado e tela cheia (tecla **F**). Os slides de calendário, setores, Super Sexta, indicadores e metas são gerados a partir dos dados do dashboard. |

## Dados e persistência — limitações

- **Não há banco de dados nem servidor.** As alterações ficam salvas no `localStorage` do navegador: valem **somente naquele navegador/computador** e podem ser perdidas se os dados do navegador forem apagados ou em janela anônima.
- **Alternativa:** em *Dados, backup e exportação* é possível **exportar backup JSON** (e importá-lo em outro computador) e **exportar o calendário em CSV** (separador `;`, abre no Excel/Google Planilhas).
- **Não há integração com Instagram/Meta.** As métricas são digitadas a partir do Instagram Insights.
- Nenhum resultado, preço, desconto ou meta de alcance foi inventado. Os roteiros dos Reels são sugestões editoriais para a equipe ajustar.
- O logotipo oficial pode ser enviado em *Dados, backup e exportação*; o protótipo não cria marca própria. As cores são referências de interface, não códigos oficiais.

## Estrutura

```
index.html        # estrutura da aplicação
css/styles.css    # identidade visual e layout responsivo
js/data.js        # planejamento completo (calendário, campanhas, setores, blocos de Stories)
js/app.js         # lógica: páginas, filtros, kanban, indicadores, gráficos, slides, exportação
```

Para alterar o planejamento-base, edite `js/data.js` e use *Restaurar planejamento original* (ou limpe os dados do navegador).
