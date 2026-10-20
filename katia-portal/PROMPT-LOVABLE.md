# Portal Kátia no Lovable — prompts para colar

Cole as 3 mensagens abaixo no Lovable, **uma de cada vez**, esperando ele terminar cada uma antes de mandar a próxima.

Depois da terceira:
1. Quando o Lovable pedir, defina a **senha de edição**. É a senha que você passa para a Kátia.
2. Clique em **Publish** e copie o link (fica algo como `seu-projeto.lovable.app`).
3. Mande o link para a Kátia. Qualquer pessoa com o link vê o portal; para editar, precisa da senha.

---

## Mensagem 1 de 3: estrutura e visual

```
Crie uma aplicação web responsiva, mobile-first, chamada "Kátia — Plano Editorial": um portal privado de conteúdo e direção criativa para Kátia (Mentoria Ayra). Período editorial: 21 de outubro a 20 de novembro de 2026. São 16 conteúdos de feed (Reels, Carrossel e Foto + Legenda). Não há Stories.

IMPORTANTE: nas próximas 2 mensagens vou mandar os 16 conteúdos completos em JSON. Use exatamente esses textos. Não resuma, não reescreva e não invente conteúdos.

A sensação NÃO é de Notion, planilha, Trello ou dashboard corporativo. É um aplicativo editorial premium, feito só para ela. Ao abrir, ela precisa saber: o que publico agora, como gravo e o que quero provocar em quem assistir.

=== BANCO DE DADOS (use o Lovable Cloud) ===
- Tabela "conteudos": guarde cada conteúdo com todos os campos do JSON (id, data, formato, pilar, tema, objetivo, sentir, cta, faleComoSe, hook, roteiro, comoGravar, textoNaTela, legenda, ctaTexto, ctaFalado, ctaNota, slides, frase, conceito, tipoFoto, intencao, nota, cuidado, formatoAlternativo e as flags terminadas em "Sugerido"/"Sugerida"). Campos em lista (faleComoSe, comoGravar, slides) podem ser JSON.
- Campo "status" em cada conteúdo, com os valores: a-fazer, em-producao, gravado, em-edicao, aprovado, publicado. Começa em "a-fazer".
- Qualquer pessoa com o link pode VER o portal, sem login.
- EDITAR exige uma senha de edição única (eu defino; guarde como segredo no backend, nunca no código do navegador). Botão discreto "Entrar para editar" pede a senha. Com a senha certa, a pessoa fica em modo edição naquele aparelho.
- Em modo edição: botão "Editar" em cada conteúdo, que transforma todos os textos (tema, objetivo, sentir, fale como se, hook, roteiro, como gravar, texto na tela, legenda, CTA, cada slide com copy e visual, frase, conceito, tipo de foto, intenção) em campos editáveis, com "Salvar" e "Cancelar". Também pode mudar o status. As alterações ficam salvas no banco e aparecem para todo mundo.
- Sem senha: o status e os textos são só leitura.

=== IDENTIDADE VISUAL ===
- Roxo profundo #301934 e champagne #EEE8AA como cores principais. Complementares: off-white #FBF8F2, creme #F4EEE2, bege quente #E8DDC9, dourado discreto #B0925A, terroso #8B7660, argila #A07D68.
- Editorial, feminina, sofisticada, contemplativa, premium. Evitar mandalas, chakras, galáxias, roxo neon, ícones esotéricos e cara de template.
- Tipografia: Cormorant Garamond (títulos, frases, roteiros, citações) e Manrope (interface e textos pequenos). Rótulos em maiúsculas pequenas com espaçamento entre letras.
- Cores discretas por formato, sem virar arco-íris: Reels = roxo, Carrossel = dourado, Foto = argila.
- Animações suaves de entrada (fade + leve subida), botões com leve "press", e respeitar prefers-reduced-motion.

=== NAVEGAÇÃO ===
Celular: barra inferior fixa com Início, Calendário, Conteúdos e Ayra. Desktop: menu no topo. Nas páginas internas de conteúdo, a barra inferior dá lugar a uma barra fixa de ações.

=== INÍCIO ===
- Topo em roxo profundo: "KÁTIA — PLANO EDITORIAL", subtítulo "21 OUT → 20 NOV" e a frase em itálico: "Conteúdo não existe apenas para ensinar. Ele constrói percepção, relacionamento e desejo."
- Resumo: 16 conteúdos planejados, contagem por categoria (REELS, CARROSSEL, FOTO; clicar filtra) e barra de progresso (publicados / em andamento / a fazer).
- "CONTEÚDO DE HOJE": mostra automaticamente o conteúdo com data mais próxima de hoje (em empate, o próximo). Ex.: "27 OUT • REELS", indicação "Publicar hoje / amanhã / em N dias", o tema em serif grande, "O que provocar" (campo sentir ou intencao), pilar, CTA e status, e o botão "VER ROTEIRO →".
- "PRÓXIMO CONTEÚDO": o seguinte na ordem cronológica, em card.
- "Ritmo comercial": 16 bolinhas em sequência, coloridas pelo nível de CTA, e a regra: "2 conteúdos de conexão → 1 convite para a Mentoria Ayra". Legenda dos 3 níveis: CTA LEVE (salvar, compartilhar, refletir), CTA CONVERSA (responder ou chamar no Direct), CTA MENTORIA (mensagem com a palavra AYRA).
- Fechamento: “Esse conteúdo não fica procurando defeitos em mim. Ele me faz querer viver de outra forma.”

=== CARD DE CONTEÚDO ===
Card elegante com data ("21 OUT" + dia da semana), formato, tema em serif, pilar, indicador de CTA (CTA LEVE / CTA CONVERSA / CTA MENTORIA), status (quando "a fazer", mostrar "Pronto para gravar", "Pronto para criar" ou "Pronto para fotografar", conforme o formato) e "ABRIR CONTEÚDO →".

=== CALENDÁRIO ===
Grade semanal (segunda a domingo) de 19/10 a 22/11, com os dias fora do período apagados. Os dias com conteúdo são clicáveis e mostram o formato; publicados ficam preenchidos em roxo; hoje tem destaque dourado. Abaixo, a lista cronológica de cards agrupada em OUTUBRO e NOVEMBRO.

=== CONTEÚDOS ===
Filtros em chips: Todos / Reels / Carrossel / Foto, e filtro de status (Todos os status + os 6 status, com contagem).

=== PÁGINA DO REELS ===
Ordem: data por extenso, formato, pilar, CTA, tema grande e botão de status (abre uma folha inferior com os 6 status). Bloco de direção: Objetivo, Tipo de CTA e "O que queremos que a pessoa sinta" (em itálico, destaque). Card roxo "FALE COMO SE…" (campo faleComoSe) ANTES do roteiro. Hook em citação grande. Roteiro em serif grande e confortável, com botões A−/A+ e "Ler em tela cheia" (tela roxa de leitura para usar durante a gravação). Se o roteiro não começar pelo hook, mostrar o hook no topo do roteiro. No fim do roteiro, mostrar o "Fechamento" (ctaFalado ou ctaTexto). Depois: Como gravar (lista), Texto na tela (mostrar numa mini tela 9:16), Legenda e CTA (se houver ctaFalado, mostrar "Fala final do vídeo" e "Na legenda" separados; CTA MENTORIA em caixa roxa). Por fim, navegação para o anterior e o próximo.
Barra fixa: COPIAR ROTEIRO, COPIAR LEGENDA (legenda + CTA) e MARCAR COMO GRAVADO.

=== PÁGINA DO CARROSSEL ===
Conceito, Objetivo e "O que queremos que a pessoa sinta". Slides em carrossel horizontal com arraste (scroll-snap) e indicador de pontos: cada slide é uma prévia 4:5 com a copy em serif, e o fundo segue o campo "tom" (roxo = roxo com texto champagne; creme; bege; foto = gradiente quente imitando fotografia com texto claro embaixo). Abaixo de cada slide, "SLIDE N · VISUAL" com a descrição. Depois, Legenda e CTA. Se houver o campo "nota", mostrar um aviso dourado "Atenção editorial" no topo.
Barra fixa: COPIAR CARROSSEL, COPIAR LEGENDA e STATUS.

=== PÁGINA FOTO + LEGENDA ===
Prévia 4:5 com a frase sobre um gradiente quente. Depois: Conceito, Tipo de fotografia, Tipo de CTA, Intenção emocional, Legenda e CTA.
Barra fixa: COPIAR FRASE, COPIAR LEGENDA e STATUS.

Campos marcados como sugeridos (flags terminadas em "Sugerido"/"Sugerida") recebem uma pequena etiqueta "sugestão" ao lado do rótulo.

=== PÁGINA AYRA ===
Topo roxo "MÉTODO AYRA" com a frase "Diminuir a distância entre aquilo que você percebe e aquilo que consegue viver." Os 5 passos do método em linha do tempo vertical, os pilares editoriais, "Como a marca fala" (lista do que evitar e do que nunca prometer) e, discretamente, as ofertas com preço. Nada de página agressiva de vendas. Os dados vêm na próxima mensagem.

Não use a palavra "Claude" nem nenhuma marca de ferramenta em nenhum lugar do portal.

Por enquanto, monte a estrutura e o banco. Na próxima mensagem mando os dados.
```

---

## Mensagem 2 de 3: dados de apoio e conteúdos 1 a 8

```
Aqui estão os dados de apoio (níveis de CTA, status, método Ayra, produtos, pilares e regras de linguagem) e os conteúdos 1 a 8. Guarde os conteúdos na tabela "conteudos" exatamente como estão, com status "a-fazer". Ainda falta a última parte, que mando na próxima mensagem.

DADOS DE APOIO:
{
 "ctas": {
  "leve": {
   "rotulo": "CTA LEVE",
   "descricao": "Salvar, compartilhar, refletir."
  },
  "conversa": {
   "rotulo": "CTA CONVERSA",
   "descricao": "Responder ou chamar no Direct."
  },
  "mentoria": {
   "rotulo": "CTA MENTORIA",
   "descricao": "Mensagem com a palavra AYRA ou pedido de informações sobre a Mentoria Ayra."
  }
 },
 "status": [
  {
   "id": "a-fazer",
   "rotulo": "A fazer"
  },
  {
   "id": "em-producao",
   "rotulo": "Em produção"
  },
  {
   "id": "gravado",
   "rotulo": "Gravado"
  },
  {
   "id": "em-edicao",
   "rotulo": "Em edição"
  },
  {
   "id": "aprovado",
   "rotulo": "Aprovado"
  },
  {
   "id": "publicado",
   "rotulo": "Publicado"
  }
 ],
 "metodo": [
  {
   "n": "01",
   "titulo": "Acesso e leitura do estado atual",
   "texto": "Percepção do momento atual, conflitos, repetições e incoerências."
  },
  {
   "n": "02",
   "titulo": "Identificação da raiz e decodificação",
   "texto": "Investigar o que sustenta determinados padrões e interpretações."
  },
  {
   "n": "03",
   "titulo": "Reposicionamento e visão consciente",
   "texto": "Construir uma nova leitura e uma posição interna mais coerente."
  },
  {
   "n": "04",
   "titulo": "Direcionamento prático e integração",
   "texto": "Transformar clareza em comportamento, escolhas e decisões."
  },
  {
   "n": "05",
   "titulo": "Dimensão energética",
   "texto": "Dimensão complementar, dentro da abordagem espiritual da Kátia. Não substitui posicionamento e responsabilidade — e não é promessa de cura ou de resultado."
  }
 ],
 "produtos": [
  {
   "nome": "Mentoria Ayra",
   "texto": "Processo aprofundado de identidade, consciência, posicionamento e integração.",
   "preco": "R$ 2.997"
  },
  {
   "nome": "Consultoria SOS",
   "texto": "Sessão direcionada para trabalhar uma questão específica.",
   "preco": "R$ 997"
  },
  {
   "nome": "Reiki Estelar Arcturiano",
   "texto": "Experiência energética dentro da abordagem espiritual da Kátia.",
   "preco": "R$ 497"
  }
 ],
 "pilares": [
  {
   "nome": "Identidade e posicionamento",
   "texto": "Quem estou me tornando? O que deixou de fazer sentido? Que decisões combinam com quem sou hoje?"
  },
  {
   "nome": "Expansão e vida desejada",
   "texto": "Prazer, paz, liberdade, autonomia, relações, experiências, simplicidade. A vida para além da busca incessante por “cura”."
  },
  {
   "nome": "Consciência aplicada",
   "texto": "Menos teoria, mais vida real. O que já foi aprendido aparecendo em escolhas, relações e rotina."
  },
  {
   "nome": "Relacionamentos",
   "texto": "Amor sem dependência. Espaço, maturidade, pertencimento, limites. Intensidade versus conexão."
  },
  {
   "nome": "Espiritualidade aterrada",
   "texto": "Fé, energia e intuição conectadas com decisão, atitude e responsabilidade. Sem fantasia, sem promessas absolutas."
  },
  {
   "nome": "Ayra",
   "texto": "Método, bastidores, histórias, processo, reposicionamento, mentoria."
  }
 ],
 "evitar": [
  "“Você não está X. Você está Y.” repetido",
  "“desbloqueie seu potencial”",
  "“ative sua melhor versão”",
  "“transforme sua realidade hoje”",
  "“viva a vida dos seus sonhos”",
  "“você nasceu para mais”"
 ],
 "semPromessas": [
  "cura de doenças",
  "tratamento de depressão",
  "cura de trauma",
  "resultado financeiro garantido",
  "manifestação garantida",
  "“energia faz determinado resultado acontecer”",
  "resultados físicos ou médicos diretos"
 ]
}

CONTEÚDOS 1 A 8:
[
 {
  "id": 1,
  "data": "2026-10-21",
  "formato": "reels",
  "pilar": "Identidade",
  "tema": "Talvez você não queira mais a vida que um dia pediu.",
  "objetivo": "Provocar reconhecimento de mudança de identidade.",
  "sentir": "Permissão para admitir que mudou.",
  "cta": "leve",
  "faleComoSe": [
   "Estivesse contando isso para uma amiga, numa conversa sem pressa.",
   "Estivesse dividindo uma percepção que acabou de ter sobre a própria vida.",
   "Não estivesse tentando ensinar nada."
  ],
  "hook": "Tem uma coisa estranha sobre conquistar maturidade: às vezes você percebe que não quer mais aquilo que passou anos tentando conseguir.",
  "roteiro": "Tem uma coisa estranha sobre conquistar maturidade:\n\nàs vezes você percebe que não quer mais aquilo que passou anos tentando conseguir.\n\nTalvez você tenha pedido determinada relação.\n\nDeterminado reconhecimento.\n\nUma determinada profissão.\n\nUma vida que, naquele momento, parecia significar sucesso.\n\nSó que você mudou.\n\nE existe um ponto da vida em que insistir no sonho antigo deixa de ser persistência e começa a ser apego a uma versão sua que já passou.\n\nIsso não significa que aquela versão estava errada.\n\nEla te trouxe até aqui.\n\nMas você não precisa continuar desejando hoje aquilo que fazia sentido para você três, cinco ou dez anos atrás.\n\nCrescer também é poder olhar para a própria vida e dizer:\n\n‘isso já foi muito importante para mim… mas não é mais.’\n\nTalvez você não esteja perdida.\n\nTalvez apenas esteja tentando encontrar direção utilizando um mapa de uma pessoa que você já deixou de ser.",
  "comoGravar": [
   "Plano próximo.",
   "Kátia falando sentada, luz natural.",
   "Poucos cortes.",
   "Sem trilha dramática.",
   "Energia de conversa íntima."
  ],
  "textoNaTela": "Você ainda quer a vida que um dia pediu?",
  "legenda": "Você não precisa continuar querendo algo apenas porque um dia desejou muito.\n\nMudar de direção também pode ser maturidade.",
  "ctaTexto": "Salva para voltar nisso quando sentir que está “perdida”."
 },
 {
  "id": 2,
  "data": "2026-10-23",
  "formato": "carrossel",
  "pilar": "Expansão",
  "tema": "Coisas que hoje eu considero riqueza — e nenhuma delas cabe numa conta bancária.",
  "conceito": "Riqueza ganhando outros nomes: tempo, paz, autonomia, presença e relações que fazem sentido.",
  "objetivo": "Gerar desejo e humanização.",
  "sentir": "Vontade de uma vida mais leve — e curiosidade sobre o que significa riqueza para ela mesma.",
  "sentirSugerido": true,
  "cta": "conversa",
  "slides": [
   {
    "copy": "Coisas que hoje eu considero riqueza.\n\nE nenhuma delas cabe numa conta bancária.",
    "visual": "Capa tipográfica: fundo roxo profundo, serif grande em champagne. Nada além da frase.",
    "tom": "roxo"
   },
   {
    "copy": "Poder dizer não sem passar três dias me culpando.",
    "visual": "Still life: xícara de café e caderno aberto sobre linho, luz da manhã.",
    "tom": "creme"
   },
   {
    "copy": "Ter relações onde eu não preciso diminuir quem sou para continuar pertencendo.",
    "visual": "Detalhe de mesa posta com amigas — mãos, taças, conversa. Sem rostos em destaque.",
    "tom": "bege"
   },
   {
    "copy": "Dormir sem precisar resolver mentalmente toda a minha vida antes de fechar os olhos.",
    "visual": "Cama arrumada, lençol cru, luz de fim de tarde entrando pela janela.",
    "tom": "creme"
   },
   {
    "copy": "Ter liberdade para escolher.\n\nE paz suficiente para aproveitar aquilo que escolhi.",
    "visual": "Retrato natural da Kátia ao ar livre, luz quente, olhar lateral ou caminhando.",
    "tom": "foto"
   }
  ],
  "legenda": "Dinheiro importa.\n\nMas chega uma fase em que riqueza começa a ganhar outros nomes:\n\ntempo, paz, autonomia, presença e relações que fazem sentido.",
  "ctaTexto": "E para você: o que hoje significa riqueza?"
 },
 {
  "id": 3,
  "data": "2026-10-25",
  "formato": "foto",
  "pilar": "Identidade",
  "frase": "Tem uma fase em que paz começa a valer mais do que aprovação.",
  "tema": "Tem uma fase em que paz começa a valer mais do que aprovação.",
  "conceito": "Reposicionamento: parar de escolher para ser aceita e começar a escolher para viver em paz consigo.",
  "tipoFoto": "Retrato natural da Kátia. Nada muito posado. Pode estar caminhando, olhando lateralmente ou sorrindo.",
  "intencao": "Alívio e reconhecimento — a sensação de não precisar mais se justificar o tempo todo.",
  "intencaoSugerida": true,
  "cta": "mentoria",
  "legenda": "Chega uma fase em que explicar cada escolha começa a cansar.\n\nVocê percebe que nem todo mundo precisa entender o caminho que faz sentido para você.\n\nE alguma coisa muda:\n\nvocê para de escolher para ser aceita e começa a escolher para conseguir viver em paz consigo.",
  "ctaTexto": "Se você sente que está vivendo esse reposicionamento, me chama no Direct com AYRA."
 },
 {
  "id": 4,
  "data": "2026-10-27",
  "formato": "reels",
  "pilar": "Consciência",
  "tema": "Nem toda mudança precisa ser dramática para ser profunda.",
  "objetivo": "Fazer a pessoa reconhecer mudanças sutis que já aconteceram dentro dela.",
  "objetivoSugerido": true,
  "sentir": "Um orgulho silencioso do próprio caminho.",
  "sentirSugerido": true,
  "cta": "leve",
  "ctaNota": "Nenhuma chamada comercial.",
  "faleComoSe": [
   "Estivesse dividindo uma percepção que acabou de ter.",
   "Estivesse falando com uma única pessoa.",
   "Estivesse lembrando, com carinho, de quem você já foi."
  ],
  "hook": "Tem mudança que ninguém percebe quando começa.",
  "roteiro": "Tem mudança que ninguém percebe quando começa.\n\nNão existe anúncio.\n\nNão existe grande ruptura.\n\nVocê simplesmente percebe que respondeu diferente a uma situação que antes acabaria com o seu dia.\n\nQue não correu atrás de alguém como fazia antes.\n\nQue conseguiu dizer não sem inventar dez justificativas.\n\nQue uma opinião que antes te desmontava já não consegue ocupar o mesmo espaço.\n\nA gente aprendeu a reconhecer transformação apenas quando alguma coisa enorme acontece.\n\nMas algumas das mudanças mais importantes acontecem silenciosamente.\n\nPrimeiro muda a forma como você percebe.\n\nDepois muda a resposta.\n\nDepois a decisão.\n\nAté que, algum tempo depois, você olha para trás e percebe:\n\n‘eu não reagiria mais como aquela pessoa.’\n\nTalvez exista muito mais coisa mudando dentro de você do que aquilo que você consegue medir agora.",
  "comoGravar": [
   "Plano próximo, luz natural suave.",
   "Pode intercalar fala para a câmera com imagens do cotidiano (preparar o café, abrir a janela, caminhar).",
   "Ritmo calmo, sem trilha dramática.",
   "Pausa curta antes de ‘eu não reagiria mais como aquela pessoa.’"
  ],
  "comoGravarSugerido": true,
  "textoNaTela": "Tem mudança que ninguém percebe quando começa.",
  "textoNaTelaSugerido": true,
  "legenda": "Nem toda transformação chega fazendo barulho.\n\nAlgumas aparecem primeiro na maneira como você responde à vida.",
  "ctaTexto": "Presta atenção nas pequenas coisas. Elas contam muita história."
 },
 {
  "id": 5,
  "data": "2026-10-29",
  "formato": "carrossel",
  "pilar": "Relacionamentos",
  "tema": "Amadurecer também é descobrir que amor não precisa ser intenso para ser verdadeiro.",
  "conceito": "Maturidade afetiva: separar intensidade de conexão e reconhecer a paz como forma de amor.",
  "objetivo": "Ressignificar intensidade e trazer um olhar mais maduro para as relações.",
  "objetivoSugerido": true,
  "sentir": "Tranquilidade — perceber que paz não é falta de paixão.",
  "sentirSugerido": true,
  "cta": "leve",
  "slides": [
   {
    "copy": "Amor não precisa ser intenso para ser verdadeiro.",
    "visual": "Capa tipográfica em fundo creme, serif roxa. Muito respiro.",
    "tom": "creme"
   },
   {
    "copy": "Nem toda ansiedade é conexão.\n\nNem toda saudade desesperada é amor.",
    "visual": "Natureza em movimento: mar ou vento nas folhas, luz baixa.",
    "tom": "foto"
   },
   {
    "copy": "Às vezes o que parece “química” é apenas familiaridade com uma dinâmica que você já conhece.",
    "visual": "Fundo editorial roxo profundo, texto em champagne.",
    "tom": "roxo"
   },
   {
    "copy": "Amor também pode parecer:\n\nsegurança.\n\nespaço.\n\npresença.\n\nrespeito.",
    "visual": "Still life: duas xícaras numa mesa de madeira, luz quente de manhã.",
    "tom": "bege"
   },
   {
    "copy": "Talvez maturidade afetiva seja descobrir que paz não é falta de paixão.",
    "visual": "Fechamento tipográfico em fundo creme com detalhe dourado discreto.",
    "tom": "creme"
   }
  ],
  "legenda": "Quando caos vira referência, tranquilidade pode parecer estranha no começo.\n\nMas relação saudável não precisa manter você em estado permanente de dúvida.",
  "ctaTexto": "Se isso colocou alguma relação sob uma nova perspectiva, salva."
 },
 {
  "id": 6,
  "data": "2026-10-31",
  "formato": "foto",
  "pilar": "Expansão",
  "frase": "Você não precisa estar se curando o tempo inteiro. Também pode simplesmente viver.",
  "tema": "Você não precisa estar se curando o tempo inteiro. Também pode simplesmente viver.",
  "conceito": "O autoconhecimento saindo da sala de análise e entrando na vida.",
  "tipoFoto": "Momento vivido, sem pose: uma risada, uma viagem, uma mesa ao ar livre, pés na areia, mãos segurando uma taça. Foto que pareça memória, não produção.",
  "tipoFotoSugerido": true,
  "intencao": "Leveza e permissão para viver sem procurar uma lição em cada momento.",
  "intencaoSugerida": true,
  "cta": "mentoria",
  "legenda": "Existe uma fase em que até o autoconhecimento precisa sair da sala de análise e entrar na vida.\n\nVocê também pode rir.\n\nViajar.\n\nAmar.\n\nCriar.\n\nDescansar.\n\nExperimentar.\n\nNem todo momento precisa esconder uma lição.\n\nAlguns precisam apenas ser vividos.",
  "ctaTexto": "A Mentoria Ayra não existe para colocar você numa busca eterna por algo para consertar.\n\nEla existe para transformar consciência em vida.\n\nSe quiser entender como funciona, me chama com AYRA."
 },
 {
  "id": 7,
  "data": "2026-11-02",
  "formato": "reels",
  "pilar": "Identidade",
  "tema": "O luxo de não precisar mais provar quem você é.",
  "objetivo": "Fortalecer autonomia e a sensação de identidade própria.",
  "objetivoSugerido": true,
  "sentir": "Liberdade e serenidade em relação às próprias escolhas.",
  "sentirSugerido": true,
  "cta": "leve",
  "faleComoSe": [
   "Estivesse falando com uma única pessoa que anda cansada de se explicar.",
   "Já tivesse feito as pazes com isso — sem raiva de ninguém.",
   "Não estivesse tentando convencer ninguém."
  ],
  "hook": "Uma das liberdades mais caras da vida é parar de precisar ser compreendida por todo mundo.",
  "roteiro": "Uma das liberdades mais caras da vida é parar de precisar ser compreendida por todo mundo.\n\nPorque provar quem você é consome muita energia.\n\nVocê explica a escolha.\n\nExplica a mudança.\n\nExplica por que saiu.\n\nExplica por que ficou.\n\nExplica por que pensa diferente.\n\nAté perceber uma coisa:\n\nquem precisa estar em paz com a sua decisão é você.\n\nIsso não significa virar alguém indiferente.\n\nSignifica simplesmente não colocar sua identidade em votação.\n\nVocê pode ouvir.\n\nPode reconsiderar.\n\nPode aprender.\n\nMas existe uma enorme diferença entre estar aberta e precisar de autorização.\n\nTalvez um dos maiores luxos da maturidade seja esse:\n\nnão precisar convencer ninguém de que a vida que faz sentido para você realmente faz sentido.",
  "comoGravar": [
   "Plano médio, ambiente elegante: poltrona, janela ampla, arquitetura.",
   "Postura tranquila, ritmo pausado.",
   "Na sequência ‘Explica a escolha… Explica a mudança…’, cortes um pouco mais rápidos.",
   "Desacelerar e segurar o olhar na última frase."
  ],
  "comoGravarSugerido": true,
  "textoNaTela": "O luxo de não precisar mais provar quem você é.",
  "textoNaTelaSugerido": true,
  "legenda": "Existe uma enorme diferença entre estar aberta e precisar de autorização.",
  "legendaSugerida": true,
  "ctaTexto": "Se isso chegou numa hora importante, salva."
 },
 {
  "id": 8,
  "data": "2026-11-04",
  "formato": "carrossel",
  "pilar": "Posicionamento",
  "tema": "Algumas decisões começam a ficar fáceis quando você para de negociar consigo.",
  "conceito": "A negociação interna que transforma medo em ‘dúvida’ — e o posicionamento que encerra essa negociação.",
  "objetivo": "Dar nome à negociação interna e trazer clareza sobre decisões já tomadas.",
  "objetivoSugerido": true,
  "sentir": "Coragem tranquila para sustentar aquilo que já sabe.",
  "sentirSugerido": true,
  "cta": "leve",
  "ctaNota": "Nenhuma venda direta.",
  "slides": [
   {
    "copy": "Algumas decisões não são difíceis.\n\nDifícil é aceitar o que você já sabe.",
    "visual": "Capa tipográfica: fundo roxo profundo, serif champagne.",
    "tom": "roxo"
   },
   {
    "copy": "Às vezes a dúvida não existe porque faltam respostas.\n\nExiste porque uma das respostas exige mudança.",
    "visual": "Arquitetura: porta entreaberta ou corredor com luz no fim.",
    "tom": "foto"
   },
   {
    "copy": "Então você negocia.\n\n“Talvez melhore.”\n\n“Talvez eu esteja exagerando.”\n\n“Talvez ainda não seja a hora.”",
    "visual": "Fundo creme, as frases entre aspas como se fossem anotações de caderno.",
    "tom": "creme"
   },
   {
    "copy": "Até perceber:\n\na decisão já havia sido tomada internamente.\n\nVocê só ainda não tinha se posicionado diante dela.",
    "visual": "Detalhe: mão escrevendo num caderno, caneta, luz lateral.",
    "tom": "bege"
   },
   {
    "copy": "Clareza não elimina o desconforto.\n\nMas impede que você continue chamando medo de dúvida.",
    "visual": "Fechamento tipográfico em roxo profundo com linha dourada discreta.",
    "tom": "roxo"
   }
  ],
  "legenda": "Existem respostas que você não precisa descobrir.\n\nPrecisa conseguir sustentar.",
  "ctaTexto": null
 }
]
```

---

## Mensagem 3 de 3: conteúdos 9 a 16

```
Aqui estão os conteúdos 9 a 16. Guarde-os na tabela "conteudos" exatamente como estão, com status "a-fazer". Depois confirme que existem 16 conteúdos, de 21/10 a 20/11, e que nenhum texto foi resumido ou alterado.

CONTEÚDOS 9 A 16:
[
 {
  "id": 9,
  "data": "2026-11-06",
  "formato": "reels",
  "pilar": "Espiritualidade aterrada",
  "tema": "Espiritualidade que não chega na forma como você vive vira discurso bonito.",
  "objetivo": "Posicionar a espiritualidade da Kátia como prática: ligada a decisão, atitude e responsabilidade.",
  "objetivoSugerido": true,
  "sentir": "Maturidade espiritual — fé com os pés no chão.",
  "sentirSugerido": true,
  "cta": "mentoria",
  "faleComoSe": [
   "Estivesse falando de algo que você vive, não de algo que você estudou.",
   "Estivesse conversando com alguém que já leu de tudo — e ainda sente que falta algo.",
   "Sem tom de sermão: firme, mas acolhedor."
  ],
  "hook": "Você pode meditar, orar, estudar energia e falar de consciência o dia inteiro… e ainda viver completamente desconectada de tudo isso.",
  "roteiro": "Você pode meditar.\n\nOrar.\n\nEstudar energia.\n\nFalar sobre consciência.\n\nConhecer dezenas de conceitos espirituais.\n\nE ainda assim continuar vivendo exatamente a mesma relação consigo e com o mundo.\n\nPorque espiritualidade, para mim, não deveria servir para fugir da vida.\n\nDeveria mudar a forma como você entra nela.\n\nComo você escolhe.\n\nComo se posiciona.\n\nComo trata uma pessoa.\n\nComo reage quando alguma coisa não acontece como você queria.\n\nComo usa dinheiro.\n\nComo estabelece limites.\n\nComo assume responsabilidade.\n\nConsciência que nunca chega ao comportamento corre o risco de virar apenas uma linguagem bonita.\n\nO espiritual não precisa afastar você da realidade.\n\nTalvez ele devesse fazer exatamente o contrário:\n\ncolocar você ainda mais presente dentro dela.",
  "comoGravar": [
   "Kátia sentada à mesa, com caderno ou livro por perto, luz natural.",
   "Na lista ‘Como você escolhe… como usa dinheiro…’, intercalar imagens curtas do cotidiano: servir café, escrever, abrir a janela.",
   "Nenhum símbolo esotérico em cena.",
   "Olhar direto para a câmera no fechamento."
  ],
  "comoGravarSugerido": true,
  "textoNaTela": "Espiritualidade que não chega na vida vira discurso bonito.",
  "textoNaTelaSugerido": true,
  "legenda": "Espiritualidade que não atravessa comportamento continua sendo teoria.",
  "ctaTexto": "Se você busca integrar consciência, espiritualidade e posicionamento na vida real, me chama no Direct com AYRA."
 },
 {
  "id": 10,
  "data": "2026-11-08",
  "formato": "foto",
  "pilar": "Relacionamentos",
  "frase": "Existe amor também onde existe espaço.",
  "tema": "Existe amor também onde existe espaço.",
  "conceito": "Amor com individualidade: presença e espaço convivendo, sem fusão.",
  "conceitoSugerido": true,
  "tipoFoto": "Composição com respiro: duas cadeiras com distância entre si, duas xícaras, uma janela ampla, natureza aberta. Arquitetura ou still life — sem retrato.",
  "tipoFotoSugerido": true,
  "intencao": "Leveza afetiva — a ideia de um amor que não aprisiona.",
  "intencaoSugerida": true,
  "cta": "leve",
  "legenda": "Nem toda proximidade precisa virar fusão.\n\nAmar alguém não deveria exigir abandonar a própria individualidade.\n\nExiste amor onde existe presença.\n\nMas também existe amor onde existem limites, silêncio, autonomia e espaço para continuar sendo você.",
  "ctaTexto": "Compartilha com alguém que também acredita num amor que não aprisiona."
 },
 {
  "id": 11,
  "data": "2026-11-10",
  "formato": "reels",
  "pilar": "Consciência aplicada",
  "tema": "Chega uma hora em que você precisa viver o que entendeu.",
  "objetivo": "Mostrar o intervalo entre entender e se posicionar — o ponto central da Mentoria Ayra.",
  "objetivoSugerido": true,
  "sentir": "Reconhecimento: “é exatamente aqui que eu estou.”",
  "sentirSugerido": true,
  "cta": "mentoria",
  "faleComoSe": [
   "Estivesse olhando nos olhos de alguém que já sabe tudo isso sobre si.",
   "Não estivesse apontando um erro — estivesse nomeando um ponto de virada.",
   "Estivesse falando com uma única pessoa."
  ],
  "hook": "Talvez você não precise entender mais sobre você.",
  "roteiro": "Talvez você não precise entender mais sobre você.\n\nTalvez já saiba.\n\nVocê sabe de onde veio determinado padrão.\n\nJá percebeu por que certas situações te ativam.\n\nJá sabe o tipo de relação que não quer.\n\nJá conhece os limites que deveria estabelecer.\n\nJá consegue explicar sua história inteira.\n\nMas existe uma diferença enorme entre compreender uma coisa e conseguir viver de acordo com aquilo que compreendeu.\n\nChega uma fase em que consumir mais conteúdo não muda nada.\n\nPorque o próximo movimento não é adquirir outra explicação.\n\nÉ posicionamento.\n\nÉ conseguir transformar aquilo que você já sabe numa decisão real.\n\nÉ sair da consciência que observa…\n\npara a consciência que participa da própria vida.\n\nÉ justamente nesse intervalo entre entender e conseguir se posicionar que muita gente fica anos.",
  "comoGravar": [
   "Plano próximo, olhando para a câmera.",
   "Ritmo firme, mas sem pressa.",
   "Corte seco antes de ‘É posicionamento.’",
   "Fundo limpo: parede clara, estante com livros ou janela."
  ],
  "comoGravarSugerido": true,
  "textoNaTela": "Talvez você não precise entender mais sobre você.",
  "textoNaTelaSugerido": true,
  "legenda": "Existe uma diferença enorme entre compreender uma coisa e conseguir viver de acordo com aquilo que compreendeu.",
  "legendaSugerida": true,
  "ctaTexto": "Esse é um dos pontos centrais que trabalhamos na Mentoria Ayra. Se você se reconheceu aqui, me chama com AYRA."
 },
 {
  "id": 12,
  "data": "2026-11-12",
  "formato": "carrossel",
  "pilar": "Método / consciência",
  "tema": "O que muda quando consciência deixa de ser teoria e começa a virar posicionamento.",
  "conceito": "Percepção → escolha → integração: o caminho entre saber e sustentar.",
  "objetivo": "Explicar, de forma simples, a passagem de consciência para posicionamento e integração.",
  "objetivoSugerido": true,
  "sentir": "Clareza sobre o próximo passo — e vontade de responder.",
  "sentirSugerido": true,
  "cta": "conversa",
  "slides": [
   {
    "copy": "Saber não é a mesma coisa que sustentar.",
    "visual": "Capa tipográfica em fundo creme, serif roxa grande.",
    "tom": "creme"
   },
   {
    "copy": "Você pode saber exatamente o limite que precisa colocar.",
    "visual": "Arquitetura: uma soleira, um degrau, uma linha clara no chão.",
    "tom": "foto"
   },
   {
    "copy": "Mas só existe mudança quando consegue sustentá-lo diante da pessoa que sempre fez você recuar.",
    "visual": "Fundo roxo profundo, texto champagne.",
    "tom": "roxo"
   },
   {
    "copy": "Consciência começa na percepção.\n\nPosicionamento aparece na escolha.",
    "visual": "Duas linhas tipográficas com divisória dourada fina, fundo bege quente.",
    "tom": "bege"
   },
   {
    "copy": "E integração acontece quando aquilo que você entendeu começa a aparecer naturalmente na forma como vive.",
    "visual": "Retrato natural da Kátia em movimento, cena do cotidiano, luz quente.",
    "tom": "foto"
   }
  ],
  "legenda": "Informação pode abrir uma porta.\n\nMas é o posicionamento que muda a forma como você atravessa por ela.",
  "ctaTexto": "Em qual área da sua vida você sente que já sabe, mas ainda não sustenta?"
 },
 {
  "id": 13,
  "data": "2026-11-14",
  "formato": "reels",
  "pilar": "Expansão",
  "tema": "Seu próximo nível pode parecer mais tranquilo do que você imaginava.",
  "objetivo": "Gerar desejo por uma vida com menos urgência — expansão sem exaustão.",
  "objetivoSugerido": true,
  "sentir": "Alívio e desejo: crescer pode ser mais leve.",
  "sentirSugerido": true,
  "cta": "leve",
  "faleComoSe": [
   "Estivesse contando uma descoberta que mudou a sua forma de trabalhar e viver.",
   "Estivesse sorrindo levemente — sem pressa nenhuma.",
   "Não estivesse tentando ensinar nada."
  ],
  "hook": "Talvez você esteja imaginando o próximo nível da sua vida completamente errado.",
  "roteiro": "A gente costuma imaginar evolução como mais.\n\nMais dinheiro.\n\nMais trabalho.\n\nMais reconhecimento.\n\nMais metas.\n\nMais intensidade.\n\nSó que existe uma fase em que crescer começa a parecer diferente.\n\nVocê começa a querer menos urgência.\n\nMenos relação confusa.\n\nMenos necessidade de provar.\n\nMenos coisa acontecendo ao mesmo tempo.\n\nE mais presença.\n\nMais escolha.\n\nMais autonomia.\n\nMais tranquilidade para aproveitar aquilo que já construiu.\n\nSeu próximo nível talvez não seja uma versão sua correndo mais rápido.\n\nTalvez seja uma versão que finalmente não precisa correr o tempo inteiro.\n\nE isso também é expansão.",
  "comoGravar": [
   "Kátia em ritmo lento: caminhando ao ar livre, abrindo cortinas, sentando ao sol.",
   "Na lista ‘Mais dinheiro… mais metas…’, cortes mais rápidos.",
   "A partir de ‘E mais presença’, a edição desacelera.",
   "Voz calma, luz quente."
  ],
  "comoGravarSugerido": true,
  "textoNaTela": "Seu próximo nível pode parecer mais tranquilo do que você imaginava.",
  "textoNaTelaSugerido": true,
  "legenda": "Nem todo próximo nível é mais barulhento.\n\nÀs vezes ele é apenas mais seu.",
  "ctaTexto": "Talvez crescer também seja parar de confundir evolução com exaustão."
 },
 {
  "id": 14,
  "data": "2026-11-16",
  "formato": "carrossel",
  "pilar": "Identidade",
  "tema": "5 coisas que deixam de fazer sentido quando você começa a confiar mais em si.",
  "conceito": "Autoconfiança como não abandonar a própria percepção — e o que naturalmente sai da vida quando isso acontece.",
  "objetivo": "Gerar identificação com o processo de reposicionamento e abrir conversa sobre a Mentoria.",
  "objetivoSugerido": true,
  "sentir": "“Isso sou eu agora” — reconhecimento e confiança.",
  "sentirSugerido": true,
  "cta": "mentoria",
  "nota": "O título fala em 5 coisas e o briefing traz 4 itens (slides 2 a 5). Antes de produzir: incluir o 5º item ou ajustar o título para “4 coisas”.",
  "slides": [
   {
    "copy": "5 coisas que começam a perder sentido quando você passa a confiar mais em si.",
    "visual": "Capa tipográfica: fundo roxo profundo, numeral “5” grande em champagne.",
    "tom": "roxo"
   },
   {
    "copy": "Pedir cinco opiniões antes de tomar uma decisão que você já sabe qual é.",
    "visual": "Still life: celular virado para baixo ao lado de um caderno fechado.",
    "tom": "creme"
   },
   {
    "copy": "Explicar excessivamente os próprios limites.",
    "visual": "Fundo bege quente, tipografia limpa, muito espaço vazio.",
    "tom": "bege"
   },
   {
    "copy": "Permanecer onde você precisa diminuir quem é para continuar pertencendo.",
    "visual": "Arquitetura: porta aberta para fora, luz entrando.",
    "tom": "foto"
   },
   {
    "copy": "Esperar sentir zero medo antes de fazer aquilo que já sabe que precisa fazer.",
    "visual": "Retrato natural da Kátia caminhando, de lado, luz quente.",
    "tom": "foto"
   }
  ],
  "legenda": "Autoconfiança não significa nunca ter dúvida.\n\nSignifica não abandonar a própria percepção toda vez que uma dúvida aparece.",
  "ctaTexto": "Se você está vivendo esse processo de reposicionamento, me chama no Direct com AYRA."
 },
 {
  "id": 15,
  "data": "2026-11-18",
  "formato": "reels",
  "pilar": "Ayra",
  "tema": "O Método Ayra não nasceu para criar uma nova pessoa.",
  "objetivo": "Apresentar a origem e a lógica do Método Ayra com proximidade, sem tom de venda agressiva.",
  "objetivoSugerido": true,
  "sentir": "Confiança no método e a sensação de “isso foi pensado para alguém como eu”.",
  "sentirSugerido": true,
  "cta": "mentoria",
  "ctaNota": "Mentoria direta.",
  "cuidado": "A dimensão energética é apresentada como parte da abordagem da Kátia — sem promessa de cura ou de resultado.",
  "faleComoSe": [
   "Estivesse contando a história de algo que você construiu com muito cuidado.",
   "Estivesse explicando o método para alguém que chegou curiosa, não desconfiada.",
   "Falasse com orgulho tranquilo — sem precisar vender."
  ],
  "hook": "Eu não criei o Ayra para transformar você em outra pessoa.",
  "roteiro": "Eu não criei o Ayra para transformar você em outra pessoa.\n\nMuito pelo contrário.\n\nAo longo dos anos eu comecei a perceber quantas pessoas extremamente conscientes ainda viviam presas entre o que sabiam e aquilo que conseguiam sustentar.\n\nElas já entendiam muito.\n\nJá tinham buscado respostas.\n\nMas ainda existiam padrões, interpretações e estruturas internas interferindo na forma como escolhiam.\n\nFoi desse ponto que o Ayra nasceu.\n\nNós começamos olhando para o estado atual.\n\nDepois identificamos o que está sustentando determinadas repetições.\n\nDecodificamos.\n\nReposicionamos.\n\nE transformamos essa nova percepção em direção prática.\n\nExiste também uma dimensão energética dentro do método, mas ela não substitui posicionamento e responsabilidade.\n\nA intenção não é entregar uma identidade nova.\n\nÉ retirar ruído suficiente para que você consiga reconhecer e sustentar quem realmente está escolhendo ser.",
  "comoGravar": [
   "Bastidor: Kátia no espaço onde atende ou trabalha — mesa, caderno, livros.",
   "Plano próximo para a abertura; plano médio ao explicar as etapas.",
   "Nas etapas (‘Decodificamos. Reposicionamos.’), pequenas pausas.",
   "Encerrar olhando para a câmera, sem sorriso forçado."
  ],
  "comoGravarSugerido": true,
  "textoNaTela": "Eu não criei o Ayra para transformar você em outra pessoa.",
  "textoNaTelaSugerido": true,
  "legenda": "Ayra não é sobre criar uma personagem melhor.\n\nÉ sobre diminuir a distância entre aquilo que você percebe e aquilo que consegue viver.",
  "ctaTexto": "Se você quer entender se a Mentoria Ayra conversa com o momento que está vivendo, me chama no Direct com a palavra AYRA."
 },
 {
  "id": 16,
  "data": "2026-11-20",
  "formato": "reels",
  "formatoAlternativo": "Pode ser publicado como Reels ou Foto + Legenda.",
  "pilar": "Ayra / conversão",
  "tema": "Talvez você não precise de mais uma resposta.",
  "objetivo": "Fechar o ciclo convidando para a Mentoria Ayra: de mais informação para integração.",
  "objetivoSugerido": true,
  "sentir": "Prontidão — “chegou a hora de viver o que eu já sei.”",
  "sentirSugerido": true,
  "cta": "mentoria",
  "ctaNota": "Mentoria direta.",
  "faleComoSe": [
   "Estivesse fazendo um convite, não uma oferta.",
   "Estivesse falando com uma única pessoa que já está pronta.",
   "Estivesse dividindo uma percepção que acabou de ter."
  ],
  "hook": "Existe um momento em que buscar mais respostas começa a virar uma forma de adiar a própria decisão.",
  "roteiro": "Existe um momento em que buscar mais respostas começa a virar uma forma de adiar a própria decisão.\n\nMais um livro.\n\nMais um vídeo.\n\nMais uma análise.\n\nMais uma opinião.\n\nMais uma ferramenta.\n\nE você continua no mesmo ponto.\n\nNão porque faltou informação.\n\nMas porque chegou a hora de organizar aquilo que você já sabe.\n\nEntender o que realmente pertence a você.\n\nPerceber quais padrões ainda interferem na sua leitura.\n\nReposicionar.\n\nE conseguir transformar percepção em escolha.\n\nTalvez o seu próximo movimento não seja descobrir mais uma resposta.\n\nTalvez seja finalmente conseguir viver de acordo com as respostas que já encontrou.",
  "comoGravar": [
   "Plano próximo, Kátia sentada, luz natural.",
   "Na lista ‘Mais um livro… mais uma ferramenta…’, imagens rápidas de livros, tela, caderno.",
   "Ritmo desacelera em ‘Não porque faltou informação.’",
   "Se for publicado como foto: retrato natural da Kátia com o tema como frase."
  ],
  "comoGravarSugerido": true,
  "textoNaTela": "Talvez você não precise de mais uma resposta.",
  "textoNaTelaSugerido": true,
  "legenda": "Talvez não falte mais informação.\n\nTalvez esteja faltando integração.",
  "ctaFalado": "Se você sente que chegou nesse ponto, me chama no Direct com AYRA. Eu te explico como funciona a Mentoria.",
  "ctaTexto": "Me chama com AYRA para conhecer a Mentoria."
 }
]
```
