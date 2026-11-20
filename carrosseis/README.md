# Carrosséis — Dra. Lívia Serpa

Lâminas em PNG 1080×1350 (formato retrato do Instagram), nas cores e fontes da Lívia (azul-marinho, rosé, rosé-dourado, mármore, Playfair Display e Jost). Cada carrossel tem um formato próprio: **mito × verdade** (01), **comparativo lado a lado** (02) e **trilha de passos** com uma linha que atravessa as lâminas (03). Cada pasta tem a legenda em `legenda.txt`.

| Pasta | Tema | Lâminas |
|---|---|---|
| `01-mitos-tecnologias` | 4 mitos sobre tecnologias na estética | 10 |
| `02-protocolo-ou-raciocinio` | Protocolo ou raciocínio clínico? (Mentoria RCE®) | 7 |
| `03-plano-de-estudos` | Como montar seu plano de estudos em tecnologias | 7 |

## Como alterar ou criar carrosséis

1. Edite os textos em `conteudo.js` (`**negrito**`, `*itálico*`, `_sublinhado_`).
2. Logotipo: salve o arquivo original como `carrosseis/logo.png`; ele substitui a assinatura em texto.
3. Fotos: coloque em `carrosseis/fotos/` e indique na lâmina (`cover`, `foto` ou `passo`) com `photo: 'fotos/arquivo.jpg'`; a foto ocupa a lâmina inteira.
4. Gere as imagens:

```
NODE_PATH=<pasta onde o playwright está instalado> node carrosseis/gerar.js
```

Precisa de internet para carregar a fonte Playfair Display; sem ela, ou se algum texto não couber na lâmina, o script para e avisa em vez de gerar imagens erradas.

## Fotos e imagens geradas

As fotos (`carrosseis/fotos/`) e os PNGs gerados não vão para o repositório, porque contêm imagens pessoais da Lívia. Guarde as fotos localmente nessa pasta e rode o gerador para recriar as lâminas.

Fotos usadas hoje: `livia-equipamentos.jpg` (capa do carrossel 1), `equipamento-ponteira.jpg` (carrossel 1, verdade do Mito 03), `livia-jaleco-ponteira.jpg` (capa do carrossel 2) e `equipamento-tela.jpg` (carrossel 3, Passo 4).
