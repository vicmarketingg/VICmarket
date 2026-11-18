# Carrosséis — Dra. Lívia Serpa

Lâminas em PNG 1080×1350 (formato retrato do Instagram), na identidade visual da Lívia: mármore rosé, Playfair Display com **negrito**, *itálico* e sublinhado, texto azul-marinho e assinatura ao pé. Cada pasta tem a legenda em `legenda.txt`.

| Pasta | Tema | Lâminas |
|---|---|---|
| `01-mitos-tecnologias` | 4 mitos sobre tecnologias na estética | 6 |
| `02-protocolo-ou-raciocinio` | Protocolo ou raciocínio clínico? (Mentoria RCE®) | 6 |
| `03-plano-de-estudos` | Como montar seu plano de estudos em tecnologias | 7 |

## Como alterar ou criar carrosséis

1. Edite os textos em `conteudo.js` (`**negrito**`, `*itálico*`, `_sublinhado_`).
2. Logotipo: salve o arquivo original como `carrosseis/logo.png`; ele substitui a assinatura em texto.
3. Fotos: coloque em `carrosseis/fotos/` e indique na lâmina com `photo: 'fotos/arquivo.jpg'`.
4. Gere as imagens:

```
NODE_PATH=<pasta onde o playwright está instalado> node carrosseis/gerar.js
```

Precisa de internet para carregar a fonte Playfair Display; sem ela, ou se algum texto não couber na lâmina, o script para e avisa em vez de gerar imagens erradas.
