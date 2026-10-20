/* =========================================================
   PORTAL EDITORIAL KÁTIA · MENTORIA AYRA
   Base editorial: 21 OUT → 20 NOV
   Textos de roteiro, slides e legendas mantidos na íntegra.
   Campos marcados com `sugerido: true` são direção criativa
   complementar (não estavam no briefing original).
   ========================================================= */

window.PORTAL = {
  ano: 2026,
  periodo: { inicio: "2026-10-21", fim: "2026-11-20" },

  ctas: {
    leve: { rotulo: "CTA LEVE", descricao: "Salvar, compartilhar, refletir." },
    conversa: { rotulo: "CTA CONVERSA", descricao: "Responder ou chamar no Direct." },
    mentoria: { rotulo: "CTA MENTORIA", descricao: "Mensagem com a palavra AYRA ou pedido de informações sobre a Mentoria Ayra." }
  },

  status: [
    { id: "a-fazer", rotulo: "A fazer" },
    { id: "em-producao", rotulo: "Em produção" },
    { id: "gravado", rotulo: "Gravado" },
    { id: "em-edicao", rotulo: "Em edição" },
    { id: "aprovado", rotulo: "Aprovado" },
    { id: "publicado", rotulo: "Publicado" }
  ],

  conteudos: [
    /* ---------------------------------------------- 1 */
    {
      id: 1,
      data: "2026-10-21",
      formato: "reels",
      pilar: "Identidade",
      tema: "Talvez você não queira mais a vida que um dia pediu.",
      objetivo: "Provocar reconhecimento de mudança de identidade.",
      sentir: "Permissão para admitir que mudou.",
      cta: "leve",
      faleComoSe: [
        "Estivesse contando isso para uma amiga, numa conversa sem pressa.",
        "Estivesse dividindo uma percepção que acabou de ter sobre a própria vida.",
        "Não estivesse tentando ensinar nada."
      ],
      hook: "Tem uma coisa estranha sobre conquistar maturidade: às vezes você percebe que não quer mais aquilo que passou anos tentando conseguir.",
      roteiro: `Tem uma coisa estranha sobre conquistar maturidade:

às vezes você percebe que não quer mais aquilo que passou anos tentando conseguir.

Talvez você tenha pedido determinada relação.

Determinado reconhecimento.

Uma determinada profissão.

Uma vida que, naquele momento, parecia significar sucesso.

Só que você mudou.

E existe um ponto da vida em que insistir no sonho antigo deixa de ser persistência e começa a ser apego a uma versão sua que já passou.

Isso não significa que aquela versão estava errada.

Ela te trouxe até aqui.

Mas você não precisa continuar desejando hoje aquilo que fazia sentido para você três, cinco ou dez anos atrás.

Crescer também é poder olhar para a própria vida e dizer:

‘isso já foi muito importante para mim… mas não é mais.’

Talvez você não esteja perdida.

Talvez apenas esteja tentando encontrar direção utilizando um mapa de uma pessoa que você já deixou de ser.`,
      comoGravar: [
        "Plano próximo.",
        "Kátia falando sentada, luz natural.",
        "Poucos cortes.",
        "Sem trilha dramática.",
        "Energia de conversa íntima."
      ],
      textoNaTela: "Você ainda quer a vida que um dia pediu?",
      legenda: `Você não precisa continuar querendo algo apenas porque um dia desejou muito.

Mudar de direção também pode ser maturidade.`,
      ctaTexto: "Salva para voltar nisso quando sentir que está “perdida”."
    },

    /* ---------------------------------------------- 2 */
    {
      id: 2,
      data: "2026-10-23",
      formato: "carrossel",
      pilar: "Expansão",
      tema: "Coisas que hoje eu considero riqueza — e nenhuma delas cabe numa conta bancária.",
      conceito: "Riqueza ganhando outros nomes: tempo, paz, autonomia, presença e relações que fazem sentido.",
      objetivo: "Gerar desejo e humanização.",
      sentir: "Vontade de uma vida mais leve — e curiosidade sobre o que significa riqueza para ela mesma.",
      sentirSugerido: true,
      cta: "conversa",
      slides: [
        { copy: "Coisas que hoje eu considero riqueza.\n\nE nenhuma delas cabe numa conta bancária.", visual: "Capa tipográfica: fundo roxo profundo, serif grande em champagne. Nada além da frase.", tom: "roxo" },
        { copy: "Poder dizer não sem passar três dias me culpando.", visual: "Still life: xícara de café e caderno aberto sobre linho, luz da manhã.", tom: "creme" },
        { copy: "Ter relações onde eu não preciso diminuir quem sou para continuar pertencendo.", visual: "Detalhe de mesa posta com amigas — mãos, taças, conversa. Sem rostos em destaque.", tom: "bege" },
        { copy: "Dormir sem precisar resolver mentalmente toda a minha vida antes de fechar os olhos.", visual: "Cama arrumada, lençol cru, luz de fim de tarde entrando pela janela.", tom: "creme" },
        { copy: "Ter liberdade para escolher.\n\nE paz suficiente para aproveitar aquilo que escolhi.", visual: "Retrato natural da Kátia ao ar livre, luz quente, olhar lateral ou caminhando.", tom: "foto" }
      ],
      legenda: `Dinheiro importa.

Mas chega uma fase em que riqueza começa a ganhar outros nomes:

tempo, paz, autonomia, presença e relações que fazem sentido.`,
      ctaTexto: "E para você: o que hoje significa riqueza?"
    },

    /* ---------------------------------------------- 3 */
    {
      id: 3,
      data: "2026-10-25",
      formato: "foto",
      pilar: "Identidade",
      frase: "Tem uma fase em que paz começa a valer mais do que aprovação.",
      tema: "Tem uma fase em que paz começa a valer mais do que aprovação.",
      conceito: "Reposicionamento: parar de escolher para ser aceita e começar a escolher para viver em paz consigo.",
      tipoFoto: "Retrato natural da Kátia. Nada muito posado. Pode estar caminhando, olhando lateralmente ou sorrindo.",
      intencao: "Alívio e reconhecimento — a sensação de não precisar mais se justificar o tempo todo.",
      intencaoSugerida: true,
      cta: "mentoria",
      legenda: `Chega uma fase em que explicar cada escolha começa a cansar.

Você percebe que nem todo mundo precisa entender o caminho que faz sentido para você.

E alguma coisa muda:

você para de escolher para ser aceita e começa a escolher para conseguir viver em paz consigo.`,
      ctaTexto: "Se você sente que está vivendo esse reposicionamento, me chama no Direct com AYRA."
    },

    /* ---------------------------------------------- 4 */
    {
      id: 4,
      data: "2026-10-27",
      formato: "reels",
      pilar: "Consciência",
      tema: "Nem toda mudança precisa ser dramática para ser profunda.",
      objetivo: "Fazer a pessoa reconhecer mudanças sutis que já aconteceram dentro dela.",
      objetivoSugerido: true,
      sentir: "Um orgulho silencioso do próprio caminho.",
      sentirSugerido: true,
      cta: "leve",
      ctaNota: "Nenhuma chamada comercial.",
      faleComoSe: [
        "Estivesse dividindo uma percepção que acabou de ter.",
        "Estivesse falando com uma única pessoa.",
        "Estivesse lembrando, com carinho, de quem você já foi."
      ],
      hook: "Tem mudança que ninguém percebe quando começa.",
      roteiro: `Tem mudança que ninguém percebe quando começa.

Não existe anúncio.

Não existe grande ruptura.

Você simplesmente percebe que respondeu diferente a uma situação que antes acabaria com o seu dia.

Que não correu atrás de alguém como fazia antes.

Que conseguiu dizer não sem inventar dez justificativas.

Que uma opinião que antes te desmontava já não consegue ocupar o mesmo espaço.

A gente aprendeu a reconhecer transformação apenas quando alguma coisa enorme acontece.

Mas algumas das mudanças mais importantes acontecem silenciosamente.

Primeiro muda a forma como você percebe.

Depois muda a resposta.

Depois a decisão.

Até que, algum tempo depois, você olha para trás e percebe:

‘eu não reagiria mais como aquela pessoa.’

Talvez exista muito mais coisa mudando dentro de você do que aquilo que você consegue medir agora.`,
      comoGravar: [
        "Plano próximo, luz natural suave.",
        "Pode intercalar fala para a câmera com imagens do cotidiano (preparar o café, abrir a janela, caminhar).",
        "Ritmo calmo, sem trilha dramática.",
        "Pausa curta antes de ‘eu não reagiria mais como aquela pessoa.’"
      ],
      comoGravarSugerido: true,
      textoNaTela: "Tem mudança que ninguém percebe quando começa.",
      textoNaTelaSugerido: true,
      legenda: `Nem toda transformação chega fazendo barulho.

Algumas aparecem primeiro na maneira como você responde à vida.`,
      ctaTexto: "Presta atenção nas pequenas coisas. Elas contam muita história."
    },

    /* ---------------------------------------------- 5 */
    {
      id: 5,
      data: "2026-10-29",
      formato: "carrossel",
      pilar: "Relacionamentos",
      tema: "Amadurecer também é descobrir que amor não precisa ser intenso para ser verdadeiro.",
      conceito: "Maturidade afetiva: separar intensidade de conexão e reconhecer a paz como forma de amor.",
      objetivo: "Ressignificar intensidade e trazer um olhar mais maduro para as relações.",
      objetivoSugerido: true,
      sentir: "Tranquilidade — perceber que paz não é falta de paixão.",
      sentirSugerido: true,
      cta: "leve",
      slides: [
        { copy: "Amor não precisa ser intenso para ser verdadeiro.", visual: "Capa tipográfica em fundo creme, serif roxa. Muito respiro.", tom: "creme" },
        { copy: "Nem toda ansiedade é conexão.\n\nNem toda saudade desesperada é amor.", visual: "Natureza em movimento: mar ou vento nas folhas, luz baixa.", tom: "foto" },
        { copy: "Às vezes o que parece “química” é apenas familiaridade com uma dinâmica que você já conhece.", visual: "Fundo editorial roxo profundo, texto em champagne.", tom: "roxo" },
        { copy: "Amor também pode parecer:\n\nsegurança.\n\nespaço.\n\npresença.\n\nrespeito.", visual: "Still life: duas xícaras numa mesa de madeira, luz quente de manhã.", tom: "bege" },
        { copy: "Talvez maturidade afetiva seja descobrir que paz não é falta de paixão.", visual: "Fechamento tipográfico em fundo creme com detalhe dourado discreto.", tom: "creme" }
      ],
      legenda: `Quando caos vira referência, tranquilidade pode parecer estranha no começo.

Mas relação saudável não precisa manter você em estado permanente de dúvida.`,
      ctaTexto: "Se isso colocou alguma relação sob uma nova perspectiva, salva."
    },

    /* ---------------------------------------------- 6 */
    {
      id: 6,
      data: "2026-10-31",
      formato: "foto",
      pilar: "Expansão",
      frase: "Você não precisa estar se curando o tempo inteiro. Também pode simplesmente viver.",
      tema: "Você não precisa estar se curando o tempo inteiro. Também pode simplesmente viver.",
      conceito: "O autoconhecimento saindo da sala de análise e entrando na vida.",
      tipoFoto: "Momento vivido, sem pose: uma risada, uma viagem, uma mesa ao ar livre, pés na areia, mãos segurando uma taça. Foto que pareça memória, não produção.",
      tipoFotoSugerido: true,
      intencao: "Leveza e permissão para viver sem procurar uma lição em cada momento.",
      intencaoSugerida: true,
      cta: "mentoria",
      legenda: `Existe uma fase em que até o autoconhecimento precisa sair da sala de análise e entrar na vida.

Você também pode rir.

Viajar.

Amar.

Criar.

Descansar.

Experimentar.

Nem todo momento precisa esconder uma lição.

Alguns precisam apenas ser vividos.`,
      ctaTexto: `A Mentoria Ayra não existe para colocar você numa busca eterna por algo para consertar.

Ela existe para transformar consciência em vida.

Se quiser entender como funciona, me chama com AYRA.`
    },

    /* ---------------------------------------------- 7 */
    {
      id: 7,
      data: "2026-11-02",
      formato: "reels",
      pilar: "Identidade",
      tema: "O luxo de não precisar mais provar quem você é.",
      objetivo: "Fortalecer autonomia e a sensação de identidade própria.",
      objetivoSugerido: true,
      sentir: "Liberdade e serenidade em relação às próprias escolhas.",
      sentirSugerido: true,
      cta: "leve",
      faleComoSe: [
        "Estivesse falando com uma única pessoa que anda cansada de se explicar.",
        "Já tivesse feito as pazes com isso — sem raiva de ninguém.",
        "Não estivesse tentando convencer ninguém."
      ],
      hook: "Uma das liberdades mais caras da vida é parar de precisar ser compreendida por todo mundo.",
      roteiro: `Uma das liberdades mais caras da vida é parar de precisar ser compreendida por todo mundo.

Porque provar quem você é consome muita energia.

Você explica a escolha.

Explica a mudança.

Explica por que saiu.

Explica por que ficou.

Explica por que pensa diferente.

Até perceber uma coisa:

quem precisa estar em paz com a sua decisão é você.

Isso não significa virar alguém indiferente.

Significa simplesmente não colocar sua identidade em votação.

Você pode ouvir.

Pode reconsiderar.

Pode aprender.

Mas existe uma enorme diferença entre estar aberta e precisar de autorização.

Talvez um dos maiores luxos da maturidade seja esse:

não precisar convencer ninguém de que a vida que faz sentido para você realmente faz sentido.`,
      comoGravar: [
        "Plano médio, ambiente elegante: poltrona, janela ampla, arquitetura.",
        "Postura tranquila, ritmo pausado.",
        "Na sequência ‘Explica a escolha… Explica a mudança…’, cortes um pouco mais rápidos.",
        "Desacelerar e segurar o olhar na última frase."
      ],
      comoGravarSugerido: true,
      textoNaTela: "O luxo de não precisar mais provar quem você é.",
      textoNaTelaSugerido: true,
      legenda: `Existe uma enorme diferença entre estar aberta e precisar de autorização.`,
      legendaSugerida: true,
      ctaTexto: "Se isso chegou numa hora importante, salva."
    },

    /* ---------------------------------------------- 8 */
    {
      id: 8,
      data: "2026-11-04",
      formato: "carrossel",
      pilar: "Posicionamento",
      tema: "Algumas decisões começam a ficar fáceis quando você para de negociar consigo.",
      conceito: "A negociação interna que transforma medo em ‘dúvida’ — e o posicionamento que encerra essa negociação.",
      objetivo: "Dar nome à negociação interna e trazer clareza sobre decisões já tomadas.",
      objetivoSugerido: true,
      sentir: "Coragem tranquila para sustentar aquilo que já sabe.",
      sentirSugerido: true,
      cta: "leve",
      ctaNota: "Nenhuma venda direta.",
      slides: [
        { copy: "Algumas decisões não são difíceis.\n\nDifícil é aceitar o que você já sabe.", visual: "Capa tipográfica: fundo roxo profundo, serif champagne.", tom: "roxo" },
        { copy: "Às vezes a dúvida não existe porque faltam respostas.\n\nExiste porque uma das respostas exige mudança.", visual: "Arquitetura: porta entreaberta ou corredor com luz no fim.", tom: "foto" },
        { copy: "Então você negocia.\n\n“Talvez melhore.”\n\n“Talvez eu esteja exagerando.”\n\n“Talvez ainda não seja a hora.”", visual: "Fundo creme, as frases entre aspas como se fossem anotações de caderno.", tom: "creme" },
        { copy: "Até perceber:\n\na decisão já havia sido tomada internamente.\n\nVocê só ainda não tinha se posicionado diante dela.", visual: "Detalhe: mão escrevendo num caderno, caneta, luz lateral.", tom: "bege" },
        { copy: "Clareza não elimina o desconforto.\n\nMas impede que você continue chamando medo de dúvida.", visual: "Fechamento tipográfico em roxo profundo com linha dourada discreta.", tom: "roxo" }
      ],
      legenda: `Existem respostas que você não precisa descobrir.

Precisa conseguir sustentar.`,
      ctaTexto: null
    },

    /* ---------------------------------------------- 9 */
    {
      id: 9,
      data: "2026-11-06",
      formato: "reels",
      pilar: "Espiritualidade aterrada",
      tema: "Espiritualidade que não chega na forma como você vive vira discurso bonito.",
      objetivo: "Posicionar a espiritualidade da Kátia como prática: ligada a decisão, atitude e responsabilidade.",
      objetivoSugerido: true,
      sentir: "Maturidade espiritual — fé com os pés no chão.",
      sentirSugerido: true,
      cta: "mentoria",
      faleComoSe: [
        "Estivesse falando de algo que você vive, não de algo que você estudou.",
        "Estivesse conversando com alguém que já leu de tudo — e ainda sente que falta algo.",
        "Sem tom de sermão: firme, mas acolhedor."
      ],
      hook: "Você pode meditar, orar, estudar energia e falar de consciência o dia inteiro… e ainda viver completamente desconectada de tudo isso.",
      roteiro: `Você pode meditar.

Orar.

Estudar energia.

Falar sobre consciência.

Conhecer dezenas de conceitos espirituais.

E ainda assim continuar vivendo exatamente a mesma relação consigo e com o mundo.

Porque espiritualidade, para mim, não deveria servir para fugir da vida.

Deveria mudar a forma como você entra nela.

Como você escolhe.

Como se posiciona.

Como trata uma pessoa.

Como reage quando alguma coisa não acontece como você queria.

Como usa dinheiro.

Como estabelece limites.

Como assume responsabilidade.

Consciência que nunca chega ao comportamento corre o risco de virar apenas uma linguagem bonita.

O espiritual não precisa afastar você da realidade.

Talvez ele devesse fazer exatamente o contrário:

colocar você ainda mais presente dentro dela.`,
      comoGravar: [
        "Kátia sentada à mesa, com caderno ou livro por perto, luz natural.",
        "Na lista ‘Como você escolhe… como usa dinheiro…’, intercalar imagens curtas do cotidiano: servir café, escrever, abrir a janela.",
        "Nenhum símbolo esotérico em cena.",
        "Olhar direto para a câmera no fechamento."
      ],
      comoGravarSugerido: true,
      textoNaTela: "Espiritualidade que não chega na vida vira discurso bonito.",
      textoNaTelaSugerido: true,
      legenda: `Espiritualidade que não atravessa comportamento continua sendo teoria.`,
      ctaTexto: "Se você busca integrar consciência, espiritualidade e posicionamento na vida real, me chama no Direct com AYRA."
    },

    /* ---------------------------------------------- 10 */
    {
      id: 10,
      data: "2026-11-08",
      formato: "foto",
      pilar: "Relacionamentos",
      frase: "Existe amor também onde existe espaço.",
      tema: "Existe amor também onde existe espaço.",
      conceito: "Amor com individualidade: presença e espaço convivendo, sem fusão.",
      conceitoSugerido: true,
      tipoFoto: "Composição com respiro: duas cadeiras com distância entre si, duas xícaras, uma janela ampla, natureza aberta. Arquitetura ou still life — sem retrato.",
      tipoFotoSugerido: true,
      intencao: "Leveza afetiva — a ideia de um amor que não aprisiona.",
      intencaoSugerida: true,
      cta: "leve",
      legenda: `Nem toda proximidade precisa virar fusão.

Amar alguém não deveria exigir abandonar a própria individualidade.

Existe amor onde existe presença.

Mas também existe amor onde existem limites, silêncio, autonomia e espaço para continuar sendo você.`,
      ctaTexto: "Compartilha com alguém que também acredita num amor que não aprisiona."
    },

    /* ---------------------------------------------- 11 */
    {
      id: 11,
      data: "2026-11-10",
      formato: "reels",
      pilar: "Consciência aplicada",
      tema: "Chega uma hora em que você precisa viver o que entendeu.",
      objetivo: "Mostrar o intervalo entre entender e se posicionar — o ponto central da Mentoria Ayra.",
      objetivoSugerido: true,
      sentir: "Reconhecimento: “é exatamente aqui que eu estou.”",
      sentirSugerido: true,
      cta: "mentoria",
      faleComoSe: [
        "Estivesse olhando nos olhos de alguém que já sabe tudo isso sobre si.",
        "Não estivesse apontando um erro — estivesse nomeando um ponto de virada.",
        "Estivesse falando com uma única pessoa."
      ],
      hook: "Talvez você não precise entender mais sobre você.",
      roteiro: `Talvez você não precise entender mais sobre você.

Talvez já saiba.

Você sabe de onde veio determinado padrão.

Já percebeu por que certas situações te ativam.

Já sabe o tipo de relação que não quer.

Já conhece os limites que deveria estabelecer.

Já consegue explicar sua história inteira.

Mas existe uma diferença enorme entre compreender uma coisa e conseguir viver de acordo com aquilo que compreendeu.

Chega uma fase em que consumir mais conteúdo não muda nada.

Porque o próximo movimento não é adquirir outra explicação.

É posicionamento.

É conseguir transformar aquilo que você já sabe numa decisão real.

É sair da consciência que observa…

para a consciência que participa da própria vida.

É justamente nesse intervalo entre entender e conseguir se posicionar que muita gente fica anos.`,
      comoGravar: [
        "Plano próximo, olhando para a câmera.",
        "Ritmo firme, mas sem pressa.",
        "Corte seco antes de ‘É posicionamento.’",
        "Fundo limpo: parede clara, estante com livros ou janela."
      ],
      comoGravarSugerido: true,
      textoNaTela: "Talvez você não precise entender mais sobre você.",
      textoNaTelaSugerido: true,
      legenda: `Existe uma diferença enorme entre compreender uma coisa e conseguir viver de acordo com aquilo que compreendeu.`,
      legendaSugerida: true,
      ctaTexto: "Esse é um dos pontos centrais que trabalhamos na Mentoria Ayra. Se você se reconheceu aqui, me chama com AYRA."
    },

    /* ---------------------------------------------- 12 */
    {
      id: 12,
      data: "2026-11-12",
      formato: "carrossel",
      pilar: "Método / consciência",
      tema: "O que muda quando consciência deixa de ser teoria e começa a virar posicionamento.",
      conceito: "Percepção → escolha → integração: o caminho entre saber e sustentar.",
      objetivo: "Explicar, de forma simples, a passagem de consciência para posicionamento e integração.",
      objetivoSugerido: true,
      sentir: "Clareza sobre o próximo passo — e vontade de responder.",
      sentirSugerido: true,
      cta: "conversa",
      slides: [
        { copy: "Saber não é a mesma coisa que sustentar.", visual: "Capa tipográfica em fundo creme, serif roxa grande.", tom: "creme" },
        { copy: "Você pode saber exatamente o limite que precisa colocar.", visual: "Arquitetura: uma soleira, um degrau, uma linha clara no chão.", tom: "foto" },
        { copy: "Mas só existe mudança quando consegue sustentá-lo diante da pessoa que sempre fez você recuar.", visual: "Fundo roxo profundo, texto champagne.", tom: "roxo" },
        { copy: "Consciência começa na percepção.\n\nPosicionamento aparece na escolha.", visual: "Duas linhas tipográficas com divisória dourada fina, fundo bege quente.", tom: "bege" },
        { copy: "E integração acontece quando aquilo que você entendeu começa a aparecer naturalmente na forma como vive.", visual: "Retrato natural da Kátia em movimento, cena do cotidiano, luz quente.", tom: "foto" }
      ],
      legenda: `Informação pode abrir uma porta.

Mas é o posicionamento que muda a forma como você atravessa por ela.`,
      ctaTexto: "Em qual área da sua vida você sente que já sabe, mas ainda não sustenta?"
    },

    /* ---------------------------------------------- 13 */
    {
      id: 13,
      data: "2026-11-14",
      formato: "reels",
      pilar: "Expansão",
      tema: "Seu próximo nível pode parecer mais tranquilo do que você imaginava.",
      objetivo: "Gerar desejo por uma vida com menos urgência — expansão sem exaustão.",
      objetivoSugerido: true,
      sentir: "Alívio e desejo: crescer pode ser mais leve.",
      sentirSugerido: true,
      cta: "leve",
      faleComoSe: [
        "Estivesse contando uma descoberta que mudou a sua forma de trabalhar e viver.",
        "Estivesse sorrindo levemente — sem pressa nenhuma.",
        "Não estivesse tentando ensinar nada."
      ],
      hook: "Talvez você esteja imaginando o próximo nível da sua vida completamente errado.",
      roteiro: `A gente costuma imaginar evolução como mais.

Mais dinheiro.

Mais trabalho.

Mais reconhecimento.

Mais metas.

Mais intensidade.

Só que existe uma fase em que crescer começa a parecer diferente.

Você começa a querer menos urgência.

Menos relação confusa.

Menos necessidade de provar.

Menos coisa acontecendo ao mesmo tempo.

E mais presença.

Mais escolha.

Mais autonomia.

Mais tranquilidade para aproveitar aquilo que já construiu.

Seu próximo nível talvez não seja uma versão sua correndo mais rápido.

Talvez seja uma versão que finalmente não precisa correr o tempo inteiro.

E isso também é expansão.`,
      comoGravar: [
        "Kátia em ritmo lento: caminhando ao ar livre, abrindo cortinas, sentando ao sol.",
        "Na lista ‘Mais dinheiro… mais metas…’, cortes mais rápidos.",
        "A partir de ‘E mais presença’, a edição desacelera.",
        "Voz calma, luz quente."
      ],
      comoGravarSugerido: true,
      textoNaTela: "Seu próximo nível pode parecer mais tranquilo do que você imaginava.",
      textoNaTelaSugerido: true,
      legenda: `Nem todo próximo nível é mais barulhento.

Às vezes ele é apenas mais seu.`,
      ctaTexto: "Talvez crescer também seja parar de confundir evolução com exaustão."
    },

    /* ---------------------------------------------- 14 */
    {
      id: 14,
      data: "2026-11-16",
      formato: "carrossel",
      pilar: "Identidade",
      tema: "5 coisas que deixam de fazer sentido quando você começa a confiar mais em si.",
      conceito: "Autoconfiança como não abandonar a própria percepção — e o que naturalmente sai da vida quando isso acontece.",
      objetivo: "Gerar identificação com o processo de reposicionamento e abrir conversa sobre a Mentoria.",
      objetivoSugerido: true,
      sentir: "“Isso sou eu agora” — reconhecimento e confiança.",
      sentirSugerido: true,
      cta: "mentoria",
      nota: "O título fala em 5 coisas e o briefing traz 4 itens (slides 2 a 5). Antes de produzir: incluir o 5º item ou ajustar o título para “4 coisas”.",
      slides: [
        { copy: "5 coisas que começam a perder sentido quando você passa a confiar mais em si.", visual: "Capa tipográfica: fundo roxo profundo, numeral “5” grande em champagne.", tom: "roxo" },
        { copy: "Pedir cinco opiniões antes de tomar uma decisão que você já sabe qual é.", visual: "Still life: celular virado para baixo ao lado de um caderno fechado.", tom: "creme" },
        { copy: "Explicar excessivamente os próprios limites.", visual: "Fundo bege quente, tipografia limpa, muito espaço vazio.", tom: "bege" },
        { copy: "Permanecer onde você precisa diminuir quem é para continuar pertencendo.", visual: "Arquitetura: porta aberta para fora, luz entrando.", tom: "foto" },
        { copy: "Esperar sentir zero medo antes de fazer aquilo que já sabe que precisa fazer.", visual: "Retrato natural da Kátia caminhando, de lado, luz quente.", tom: "foto" }
      ],
      legenda: `Autoconfiança não significa nunca ter dúvida.

Significa não abandonar a própria percepção toda vez que uma dúvida aparece.`,
      ctaTexto: "Se você está vivendo esse processo de reposicionamento, me chama no Direct com AYRA."
    },

    /* ---------------------------------------------- 15 */
    {
      id: 15,
      data: "2026-11-18",
      formato: "reels",
      pilar: "Ayra",
      tema: "O Método Ayra não nasceu para criar uma nova pessoa.",
      objetivo: "Apresentar a origem e a lógica do Método Ayra com proximidade, sem tom de venda agressiva.",
      objetivoSugerido: true,
      sentir: "Confiança no método e a sensação de “isso foi pensado para alguém como eu”.",
      sentirSugerido: true,
      cta: "mentoria",
      ctaNota: "Mentoria direta.",
      cuidado: "A dimensão energética é apresentada como parte da abordagem da Kátia — sem promessa de cura ou de resultado.",
      faleComoSe: [
        "Estivesse contando a história de algo que você construiu com muito cuidado.",
        "Estivesse explicando o método para alguém que chegou curiosa, não desconfiada.",
        "Falasse com orgulho tranquilo — sem precisar vender."
      ],
      hook: "Eu não criei o Ayra para transformar você em outra pessoa.",
      roteiro: `Eu não criei o Ayra para transformar você em outra pessoa.

Muito pelo contrário.

Ao longo dos anos eu comecei a perceber quantas pessoas extremamente conscientes ainda viviam presas entre o que sabiam e aquilo que conseguiam sustentar.

Elas já entendiam muito.

Já tinham buscado respostas.

Mas ainda existiam padrões, interpretações e estruturas internas interferindo na forma como escolhiam.

Foi desse ponto que o Ayra nasceu.

Nós começamos olhando para o estado atual.

Depois identificamos o que está sustentando determinadas repetições.

Decodificamos.

Reposicionamos.

E transformamos essa nova percepção em direção prática.

Existe também uma dimensão energética dentro do método, mas ela não substitui posicionamento e responsabilidade.

A intenção não é entregar uma identidade nova.

É retirar ruído suficiente para que você consiga reconhecer e sustentar quem realmente está escolhendo ser.`,
      comoGravar: [
        "Bastidor: Kátia no espaço onde atende ou trabalha — mesa, caderno, livros.",
        "Plano próximo para a abertura; plano médio ao explicar as etapas.",
        "Nas etapas (‘Decodificamos. Reposicionamos.’), pequenas pausas.",
        "Encerrar olhando para a câmera, sem sorriso forçado."
      ],
      comoGravarSugerido: true,
      textoNaTela: "Eu não criei o Ayra para transformar você em outra pessoa.",
      textoNaTelaSugerido: true,
      legenda: `Ayra não é sobre criar uma personagem melhor.

É sobre diminuir a distância entre aquilo que você percebe e aquilo que consegue viver.`,
      ctaTexto: "Se você quer entender se a Mentoria Ayra conversa com o momento que está vivendo, me chama no Direct com a palavra AYRA."
    },

    /* ---------------------------------------------- 16 */
    {
      id: 16,
      data: "2026-11-20",
      formato: "reels",
      formatoAlternativo: "Pode ser publicado como Reels ou Foto + Legenda.",
      pilar: "Ayra / conversão",
      tema: "Talvez você não precise de mais uma resposta.",
      objetivo: "Fechar o ciclo convidando para a Mentoria Ayra: de mais informação para integração.",
      objetivoSugerido: true,
      sentir: "Prontidão — “chegou a hora de viver o que eu já sei.”",
      sentirSugerido: true,
      cta: "mentoria",
      ctaNota: "Mentoria direta.",
      faleComoSe: [
        "Estivesse fazendo um convite, não uma oferta.",
        "Estivesse falando com uma única pessoa que já está pronta.",
        "Estivesse dividindo uma percepção que acabou de ter."
      ],
      hook: "Existe um momento em que buscar mais respostas começa a virar uma forma de adiar a própria decisão.",
      roteiro: `Existe um momento em que buscar mais respostas começa a virar uma forma de adiar a própria decisão.

Mais um livro.

Mais um vídeo.

Mais uma análise.

Mais uma opinião.

Mais uma ferramenta.

E você continua no mesmo ponto.

Não porque faltou informação.

Mas porque chegou a hora de organizar aquilo que você já sabe.

Entender o que realmente pertence a você.

Perceber quais padrões ainda interferem na sua leitura.

Reposicionar.

E conseguir transformar percepção em escolha.

Talvez o seu próximo movimento não seja descobrir mais uma resposta.

Talvez seja finalmente conseguir viver de acordo com as respostas que já encontrou.`,
      comoGravar: [
        "Plano próximo, Kátia sentada, luz natural.",
        "Na lista ‘Mais um livro… mais uma ferramenta…’, imagens rápidas de livros, tela, caderno.",
        "Ritmo desacelera em ‘Não porque faltou informação.’",
        "Se for publicado como foto: retrato natural da Kátia com o tema como frase."
      ],
      comoGravarSugerido: true,
      textoNaTela: "Talvez você não precise de mais uma resposta.",
      textoNaTelaSugerido: true,
      legenda: `Talvez não falte mais informação.

Talvez esteja faltando integração.`,
      ctaFalado: "Se você sente que chegou nesse ponto, me chama no Direct com AYRA. Eu te explico como funciona a Mentoria.",
      ctaTexto: "Me chama com AYRA para conhecer a Mentoria."
    }
  ],

  metodo: [
    { n: "01", titulo: "Acesso e leitura do estado atual", texto: "Percepção do momento atual, conflitos, repetições e incoerências." },
    { n: "02", titulo: "Identificação da raiz e decodificação", texto: "Investigar o que sustenta determinados padrões e interpretações." },
    { n: "03", titulo: "Reposicionamento e visão consciente", texto: "Construir uma nova leitura e uma posição interna mais coerente." },
    { n: "04", titulo: "Direcionamento prático e integração", texto: "Transformar clareza em comportamento, escolhas e decisões." },
    { n: "05", titulo: "Dimensão energética", texto: "Dimensão complementar, dentro da abordagem espiritual da Kátia. Não substitui posicionamento e responsabilidade — e não é promessa de cura ou de resultado." }
  ],

  produtos: [
    { nome: "Mentoria Ayra", texto: "Processo aprofundado de identidade, consciência, posicionamento e integração.", preco: "R$ 2.997" },
    { nome: "Consultoria SOS", texto: "Sessão direcionada para trabalhar uma questão específica.", preco: "R$ 997" },
    { nome: "Reiki Estelar Arcturiano", texto: "Experiência energética dentro da abordagem espiritual da Kátia.", preco: "R$ 497" }
  ],

  pilares: [
    { nome: "Identidade e posicionamento", texto: "Quem estou me tornando? O que deixou de fazer sentido? Que decisões combinam com quem sou hoje?" },
    { nome: "Expansão e vida desejada", texto: "Prazer, paz, liberdade, autonomia, relações, experiências, simplicidade. A vida para além da busca incessante por “cura”." },
    { nome: "Consciência aplicada", texto: "Menos teoria, mais vida real. O que já foi aprendido aparecendo em escolhas, relações e rotina." },
    { nome: "Relacionamentos", texto: "Amor sem dependência. Espaço, maturidade, pertencimento, limites. Intensidade versus conexão." },
    { nome: "Espiritualidade aterrada", texto: "Fé, energia e intuição conectadas com decisão, atitude e responsabilidade. Sem fantasia, sem promessas absolutas." },
    { nome: "Ayra", texto: "Método, bastidores, histórias, processo, reposicionamento, mentoria." }
  ],

  evitar: [
    "“Você não está X. Você está Y.” repetido",
    "“desbloqueie seu potencial”",
    "“ative sua melhor versão”",
    "“transforme sua realidade hoje”",
    "“viva a vida dos seus sonhos”",
    "“você nasceu para mais”"
  ],

  semPromessas: [
    "cura de doenças",
    "tratamento de depressão",
    "cura de trauma",
    "resultado financeiro garantido",
    "manifestação garantida",
    "“energia faz determinado resultado acontecer”",
    "resultados físicos ou médicos diretos"
  ]
};
