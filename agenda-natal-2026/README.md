# Agenda de Natal 2026 — Mayara Dias | Studio Beauty

PDF interativo de 4 páginas (formato vertical para celular), pronto para enviar pelo WhatsApp:

| Página | Conteúdo |
|---|---|
| 1 | Capa "DEZEMBRO, DEZEMBRO!" + botão **ABRIR MINHA AGENDA →** |
| 2 | Calendário real de dezembro/2026 (seg → dom, dia 1 numa terça), dias sem atendimento, horários normais e extras |
| 3 | Regras da agenda (abertura, reajuste, sinal, horários extras, cancelamentos) |
| 4 | Tabela de serviços e valores + agradecimento e WhatsApp |

Navegação: **← Voltar**, **✦ Capa**, **1 2 3 4** e **Avançar →** em todas as páginas internas (na última, o botão leva ao WhatsApp).
Os links internos apontam direto para a página, o que funciona na maioria dos leitores de PDF de celular. Todo o conteúdo também é legível sem os links.

Arquivo final: `Agenda_Natal_2026_Mayara_Dias.pdf` (e `Agenda_Natal_2026_Mayara_Dias.html` para visualizar no navegador)

## Como atualizar (horários, vagas e serviços)

Tudo o que muda fica em **`dados.json`**. Depois de editar, gere o PDF de novo:

```bash
node build.mjs
```

O script avisa no terminal se algum conteúdo passou do limite da página.

### Horários normais (página 2)
```json
"horarios_normais": ["09h", "11h", "14h", "16h", "18h"]
```
Vazio = aparece "horários normais em breve".

### Disponibilidade de cada dia (página 2)
Use o número do dia. `status` aceita `"vagas"`, `"poucas"` ou `"lotado"`; `horarios` é opcional.
```json
"disponibilidade": {
  "1": { "status": "vagas", "horarios": ["09h", "14h"] },
  "5": { "status": "lotado" }
}
```
Com dados aqui, o calendário mostra o status em cada dia e a página entra automaticamente no modo compacto, com a tabela "VAGAS POR DIA". Dias sem atendimento (13, 24, 27 e domingos) são ignorados.

### Dias sem atendimento
`"dias_sem_atendimento": [13, 24, 27]`. Domingos já são marcados automaticamente.

### Serviços e valores (página 4)
```json
"servicos": [
  { "nome": "Nome do procedimento", "valor": "R$ 00,00", "info": "informação complementar (opcional)" }
]
```
Vazio = linhas em branco + "serviços e valores atualizados em breve". Até ~7 serviços com folga; a partir de 8 a página fica mais compacta automaticamente.

## Requisitos
- Node.js + Playwright (Chromium)
- Python 3 + `pypdf` (pós-processamento: links com destino direto, título do documento). Se faltar, o PDF é gerado mesmo assim.

## Identidade visual
Editorial de luxo: capa vinho com moldura dupla dourada e monograma MD em arco, títulos e números em Bodoni Moda (contraste alto, estilo revista de moda), detalhes em Bodoni itálico, textos e versaletes espaçados em Jost, ramos de pinheiro e estrelas em traço dourado, papel com borda deckle e laços de cetim. Paleta: #F5E8DC, #FFF9F2, #593728, #8B1E2D, #C6A36A.
Os emojis dos títulos foram trocados por ícones dourados em vetor (árvore, laço, coração), mais coerentes com a identidade.

As fontes (licença SIL OFL) ficam em `fonts/` e são incorporadas ao PDF.
