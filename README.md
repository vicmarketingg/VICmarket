# VICmarket

## Arquivos

| Arquivo | O que é |
|---|---|
| `landing-supermercado (1).html` | Página da agência (VICK Marketing) |
| `pagina-de-vendas-kit.html` | Página de vendas do **Kit Operacional de Marketing para Supermercados** (R$ 67) |
| `kit/` | Conteúdo do kit em Markdown (00 a 09): base para os PDFs, o Canva e a página |

## Pendências da página de vendas

Na página, tudo que falta aparece com a etiqueta amarela **PENDENTE**.

1. **Link do checkout:** preencher `CHECKOUT_URL` no topo do `pagina-de-vendas-kit.html`. Enquanto estiver vazio, os botões levam à seção da oferta.
2. **Link da agência (WhatsApp):** preencher `AGENCIA_URL` no mesmo lugar.
3. **Parcelas:** trocar `[X]x de R$ [valor]` na seção da oferta.
4. **Foto profissional da Victoria** (seção "Quem criou").
5. **Prints de posts, vídeos e resultados reais** (seção "Quem criou").
6. **Imagens dos modelos do Canva** (6 quadros na seção "O que vem no kit", item 3).
7. **Mockup do topo (opcional):** hoje é uma "folha de rotina" desenhada em CSS com o conteúdo real. Pode ser trocada pelo mockup final.

O **order bump** (Kit de Sinalização com QR Code, + R$ 27) é configurado no checkout da plataforma, não nesta página. O texto está em `kit/09-pagina-de-vendas.md`.
