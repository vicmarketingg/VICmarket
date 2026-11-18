# Carrosséis — Dra. Lívia Serpa

Lâminas em PNG 1080×1350 (formato retrato do Instagram), com a legenda de cada carrossel em `legenda.txt`.

| Pasta | Tema | Lâminas |
|---|---|---|
| `01-mitos-tecnologias` | 4 mitos sobre tecnologias na estética | 6 |
| `02-protocolo-ou-raciocinio` | Protocolo ou raciocínio clínico? (Mentoria RCE®) | 6 |
| `03-plano-de-estudos` | Como montar seu plano de estudos em tecnologias | 7 |

Para criar ou alterar um carrossel, edite `conteudo.js` e gere as imagens de novo:

```
NODE_PATH=<pasta onde o playwright está instalado> node carrosseis/gerar.js
```

Precisa de internet para carregar as fontes (Cormorant Garamond e Jost); sem elas o script para em vez de gerar imagens com fonte errada.
