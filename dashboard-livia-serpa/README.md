# Painel editorial — Dra. Lívia Serpa

Painel interativo da campanha de 15 Reels (26/10/2026 a 27/11/2026, segunda, quarta e sexta).

## Como abrir

Aplicação estática, sem instalação: abra `index.html` no navegador.
Para usar no celular, publique a pasta em qualquer hospedagem estática (por exemplo, GitHub Pages) e acesse o link.

## Páginas

| Página | Para quem | O que faz |
|---|---|---|
| Meu próximo vídeo | Lívia | Mostra só o próximo Reels a gravar: roupa, posição, enquadramento, roteiro em letra grande, copiar, marcar como gravado |
| Todos os meus roteiros | Lívia | Lista simples para escolher outro vídeo |
| Leitura para gravação | Lívia | Tela cheia, tamanho da letra ajustável, mantém a tela acesa quando o navegador permite |
| Visão geral | Equipe | Contadores por status, próxima publicação, progresso, pendências da semana, validação comercial, linha do tempo, equilíbrio estratégico |
| Calendário | Equipe | Visualização mensal, semanal e em lista; cada conteúdo abre o roteiro |
| Biblioteca | Equipe | 15 cartões com filtros (semana, data, categoria, objetivo, estilo, status e busca) e página completa de cada Reels |
| Guia visual | Equipe | Regras do cenário, roupas, luz, os quatro estilos com prompts, espaço para fotos de referência e para a foto da parede |
| Produção | Equipe | Kanban com 7 colunas (arrastar no computador, seletor no celular) e checklists das 3 sessões de gravação |
| Resultados | Equipe | Métricas reais (todas começam vazias), totais e comparativo por tema, objetivo, estilo e CTA |

## Dados e persistência

- Roteiros, datas e direção de gravação ficam em `js/data.js`, armazenados integralmente. Para atualizar conteúdos, edite esse arquivo; a equipe também pode editar um roteiro pelo painel (o original fica guardado e pode ser restaurado).
- Status, checklists, observações, links, durações, métricas e fotos anexadas ficam no `localStorage` **do navegador em uso**.
- **Não há sincronização entre dispositivos nem entre pessoas.** Para levar os dados a outro aparelho, use *Backup completo (.json)* e *Importar backup*. Para uso compartilhado em tempo real, é preciso um backend com autenticação.
- Exportações: roteiros completos (`.md`), cronograma (`.csv`, abre no Excel) e backup (`.json`).

## Imagens de referência

As figuras dos quatro estilos são ilustrações de composição, identificadas como tal; não são fotos da Lívia. Use “Anexar foto” no Guia visual para incluir referências fornecidas pela equipe ou licenciadas.

## Itens comerciais a validar

Os Reels 03, 04, 06, 11, 12 e 15 têm alertas de validação comercial (cursos ativos, direcionamento da Mentoria RCE® e o CTA “RCE” no direct). Eles aparecem na visão geral até o item “Oferta ou CTA comercial confirmado” ser marcado no checklist.
