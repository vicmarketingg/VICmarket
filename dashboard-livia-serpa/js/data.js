/* Dados editoriais — Campanha de Reels | Dra. Lívia Serpa
 * Os roteiros abaixo estão armazenados integralmente, sem resumo nem reescrita.
 * Para atualizar conteúdos no futuro, edite este arquivo (ou use "Editar roteiro" no painel). */
window.LS_DATA = {
  // Logotipo original da Lívia (caminho ou data URI). Vazio = o nome aparece em tipografia.
  brand: { logo: '' },

  campaign: {
    client: 'Dra. Lívia Serpa',
    platform: 'Instagram',
    format: 'Reels vertical, 9:16',
    total: 15,
    duration: 'Entre 40 e 60 segundos por vídeo',
    frequency: 'Três Reels por semana — segunda, quarta e sexta',
    start: '2026-10-26',
    end: '2026-11-27',
    audience: 'Profissionais da saúde e da estética, respeitando suas habilitações',
    focus: 'Cursos de tecnologias e Mentoria RCE®',
    tone: 'Autoridade acessível, conteúdo nativo, educativo, humano e comercial sem parecer propaganda tradicional',
    strategy: 'Fortalecer a autoridade da Lívia, despertar interesse em suas formações, gerar conversas comerciais qualificadas e construir desejo pela Mentoria RCE®.',
    complement: 'Cursos e mentoria são frentes complementares: os cursos aprofundam conhecimentos específicos; a mentoria desenvolve a integração dos conhecimentos e o raciocínio clínico.'
  },

  statuses: [
    { key: 'pronto',     label: 'Roteiro pronto',        color: '#8C96A8' },
    { key: 'aguardando', label: 'Aguardando aprovação',  color: '#B98599' },
    { key: 'aprovado',   label: 'Aprovado',              color: '#4F7A9A' },
    { key: 'gravado',    label: 'Gravado',               color: '#243E59' },
    { key: 'edicao',     label: 'Em edição',             color: '#7A6CA6' },
    { key: 'agendado',   label: 'Agendado',              color: '#3D8A86' },
    { key: 'publicado',  label: 'Publicado',             color: '#2E7A57' }
  ],

  checklist: [
    'Roteiro revisado pela equipe',
    'Roteiro aprovado pela Lívia',
    'Informações técnicas validadas',
    'Oferta ou CTA comercial confirmado',
    'Roupa separada',
    'Celular posicionado',
    'Iluminação conferida',
    'Áudio testado',
    'Vídeo gravado',
    'Duração conferida: 40–60 segundos',
    'Vídeo enviado para edição',
    'Legendas revisadas',
    'Edição aprovada',
    'Publicação agendada',
    'Publicação realizada',
    'Métricas registradas'
  ],
  checklistRecordedIndex: 8,

  pillars: {
    'Tecnologias e investimento': 'Decisões sobre equipamentos, tendências e combinações',
    'Formação e aprendizado': 'O valor de uma formação estruturada',
    'Carreira e trajetória': 'Histórias, experiência e desenvolvimento profissional',
    'Raciocínio clínico': 'Critérios, avaliação e o “porquê” das decisões'
  },

  metrics: [
    { key: 'views',        label: 'Visualizações' },
    { key: 'reach',        label: 'Alcance' },
    { key: 'avgWatch',     label: 'Tempo médio (s)' },
    { key: 'shares',       label: 'Compartilhamentos' },
    { key: 'saves',        label: 'Salvamentos' },
    { key: 'comments',     label: 'Comentários' },
    { key: 'profileVisits',label: 'Visitas ao perfil' },
    { key: 'conversations',label: 'Conversas iniciadas' },
    { key: 'leads',        label: 'Leads' },
    { key: 'enrollments',  label: 'Matrículas atribuídas (verificadas)' }
  ],

  scene: {
    rule: 'Todos os 15 Reels serão gravados diante da mesma parede marrom da casa da Lívia.',
    dont: [
      'Não sugerir gravações em clínica, corredores, salas de aula, ruas ou outros ambientes.',
      'Não exigir mudança de móveis nem cenários diferentes.',
      'Não depender de equipamentos de produção complexos.'
    ],
    do: [
      'Variar enquadramento, postura, ritmo, composição, figurino e edição.',
      'Materiais reais de aulas e procedimentos entram apenas como inserções opcionais, se já estiverem disponíveis e autorizados.',
      'Os 15 vídeos funcionam mesmo que ela grave apenas falando para a câmera.'
    ],
    clothes: [
      { name: 'Branco', hex: '#FFFFFF' },
      { name: 'Off-white', hex: '#F4F1EA' },
      { name: 'Bege claro', hex: '#E6D9C3' },
      { name: 'Azul-marinho', hex: '#172B45' }
    ],
    clothesAvoid: 'Evitar estampas chamativas, logos grandes e roupas marrons próximas ao tom da parede. O bege deve ser claro o suficiente para criar contraste com o fundo.',
    light: [
      'Formato vertical 9:16.',
      'Celular na altura dos olhos.',
      'Luz frontal ou levemente lateral.',
      'Evitar iluminação muito amarela, para não deixar pele e parede excessivamente alaranjadas.',
      'Manter separação visual entre cabelo, roupa e parede.',
      'Priorizar áudio limpo.',
      'Não aplicar filtros de beleza exagerados.',
      'Deixar espaço superior e inferior para títulos e legendas.'
    ]
  },

  styles: {
    A: {
      key: 'A', name: 'Autoridade', outfit: 'Camisa branca ou off-white', outfitHex: '#FAF8F3', blazer: false,
      position: 'Em pé', framing: 'Plano médio, da cintura ou do peito para cima',
      expression: 'Segura, natural, olhar direto para a câmera',
      use: 'Opiniões, posicionamento, quebra de crenças e explicações firmes',
      reference: 'Mulher de camisa branca, em pé, diante de parede marrom, iluminação suave, composição vertical elegante.',
      prompt: 'Photorealistic vertical portrait of a professional brunette female educator standing in front of a plain matte warm brown wall, wearing an elegant ivory white blouse, medium shot, soft frontal studio lighting, confident natural expression, premium authentic home video setup, realistic skin texture, no text, 9:16.'
    },
    B: {
      key: 'B', name: 'Conversa', outfit: 'Blazer ou blusa bege clara', outfitHex: '#E6D9C3', blazer: true,
      position: 'Sentada', framing: 'Plano médio ou meio-close, levemente lateral',
      expression: 'Acolhedora, reflexiva, espontânea',
      use: 'Histórias pessoais, experiências e conversas de mentoria',
      reference: 'Mulher sentada, blazer bege claro, enquadramento de entrevista diante da parede marrom.',
      prompt: 'Photorealistic vertical portrait of a professional brunette woman seated comfortably in front of a plain warm brown wall, wearing a light beige blazer, intimate interview framing, soft flattering lighting, relaxed natural posture, premium minimal home recording setup, realistic skin texture, no text, 9:16.'
    },
    C: {
      key: 'C', name: 'Especialista', outfit: 'Blazer azul-marinho', outfitHex: '#172B45', blazer: true,
      position: 'Sentada ou em pé, sem necessidade de mudar o cenário', framing: 'Mais fechado, do peito para cima',
      expression: 'Didática, objetiva, envolvente',
      use: 'Listas, dicas, perguntas e conteúdos técnicos',
      reference: 'Close do peito para cima, blazer azul-marinho, falando diretamente para a câmera diante da parede marrom.',
      prompt: 'Photorealistic vertical close-up portrait of a professional brunette female healthcare educator wearing a tailored navy blue blazer, speaking directly to camera in front of a plain matte chocolate brown wall, soft neutral lighting, sophisticated educational video aesthetic, realistic skin texture, no text, 9:16.'
    },
    D: {
      key: 'D', name: 'Mentora', outfit: 'Camisa off-white ou bege muito claro', outfitHex: '#F1ECE3', blazer: false,
      position: 'Em pé, com liberdade para gesticular', framing: 'Um pouco mais aberto',
      expression: 'Inspiradora, humana e espontânea',
      use: 'Bastidores comentados, comparativos e conteúdos motivacionais',
      reference: 'Plano mais aberto, blusa off-white, em pé e gesticulando naturalmente diante da parede marrom.',
      prompt: 'Photorealistic vertical portrait of a professional brunette female educator wearing a light ivory blouse, standing and gesturing naturally in front of a plain warm brown wall, wider medium shot, soft neutral studio lighting, warm authentic educational atmosphere, elegant minimalist home setup, realistic skin texture, no text, 9:16.'
    }
  },

  sessions: [
    {
      id: 's1', name: 'Sessão 1', reels: [1, 2, 3, 4, 5],
      items: [
        'Parede marrom organizada',
        'Luz frontal suave',
        'Câmera na altura dos olhos',
        'Separar camisa branca, blazer bege e blazer azul-marinho',
        'Gravar os cinco roteiros',
        'Registrar uma segunda versão dos primeiros cinco segundos dos Reels 01 e 03'
      ]
    },
    {
      id: 's2', name: 'Sessão 2', reels: [6, 7, 8, 9, 10],
      items: [
        'Manter o mesmo cenário',
        'Alternar entre sentada e em pé',
        'Priorizar naturalidade nas histórias',
        'Registrar pequenas pausas entre blocos',
        'Separar, se existirem, imagens de cursos e demonstrações'
      ]
    },
    {
      id: 's3', name: 'Sessão 3', reels: [11, 12, 13, 14, 15],
      items: [
        'Manter a parede marrom',
        'Variar os enquadramentos',
        'Priorizar os CTAs de cursos e mentoria',
        'Conferir se os roteiros comerciais estão aprovados',
        'Registrar duas opções de encerramento para o Reels 15, se necessário'
      ]
    }
  ],

  compliance: [
    'Promessas garantidas de resultados clínicos.',
    'Promessas de faturamento ou enriquecimento.',
    'Alegações de que um curso autoriza automaticamente qualquer profissional a realizar um procedimento.',
    'Demonstrações inseguras ou instruções técnicas invasivas sem contexto adequado.',
    'Antes e depois sensacionalistas.',
    'Urgência comercial falsa.',
    'Depoimentos fictícios.',
    'Números de alunas, resultados ou certificações não confirmados.'
  ],

  reels: [
    {
      id: 1, week: 1, date: '2026-10-26', weekday: 'Segunda',
      theme: 'Antes de investir em uma tecnologia',
      title: 'O que ninguém te explica antes de investir em uma tecnologia',
      style: 'A', objective: 'Cursos', pillar: 'Tecnologias e investimento',
      goal: 'Despertar interesse por formação e tecnologias.',
      outfit: 'Camisa branca ou off-white.', target: '45–55 segundos',
      position: 'Em pé, olhando diretamente para a lente.',
      framing: 'Plano médio. Aproximar o enquadramento digitalmente após “Eu inverteria essa ordem”.',
      expression: 'Começar com tom de conversa, sem sorriso forçado. Pausa depois de “Eu inverteria essa ordem”.',
      script: `Uma das decisões mais caras na estética pode acontecer antes mesmo de ligar um aparelho.

Eu vejo muitas profissionais começarem pelo equipamento. Elas pesquisam modelos, assistem a demonstrações, comparam preços… e só depois pensam em como aquela tecnologia vai entrar na rotina.

Eu inverteria essa ordem.

Primeiro, entenderia quais demandas aparecem com frequência na minha prática. Depois, quais possibilidades aquela tecnologia realmente oferece, quais são seus limites e qual formação eu preciso para utilizá-la com responsabilidade.

Porque um equipamento não se torna um bom investimento simplesmente por ser moderno.

Ele precisa fazer sentido para a realidade da profissional.

E essa é uma conversa que eu gostaria que acontecesse muito mais antes das decisões de compra.

Me conta: qual tecnologia você tem vontade de estudar?`,
      direction: [
        'Em pé, olhando diretamente para a lente.',
        'Começar com tom de conversa, sem sorriso forçado.',
        'Fazer pausa depois de “Eu inverteria essa ordem”.',
        'Aproximar o enquadramento digitalmente nesse momento.',
        'Não usar imagens de equipamentos como requisito.'
      ],
      screenText: 'O investimento começa antes da compra.',
      editing: 'Cortes discretos, legendas brancas, destaque rosé para “investimento” e “formação”.',
      cta: 'Comentários.', ctaType: 'Comentários',
      commercial: null
    },
    {
      id: 2, week: 1, date: '2026-10-28', weekday: 'Quarta',
      theme: 'Se eu estivesse começando hoje',
      title: 'Se eu estivesse começando na estética hoje',
      style: 'B', objective: 'Autoridade', pillar: 'Carreira e trajetória',
      goal: 'Conexão, identificação e autoridade.',
      outfit: 'Blazer bege claro.', target: '45–55 segundos',
      position: 'Sentada, com o corpo ligeiramente virado.',
      framing: 'Plano médio ou meio-close, levemente lateral.',
      expression: 'Tom de conselho pessoal, olhando para a câmera como se conversasse com uma aluna. Pequenas pausas para transmitir naturalidade.',
      script: `Se eu estivesse começando minha trajetória na estética hoje, tem uma coisa que faria diferente.

Eu teria menos pressa de aprender tudo ao mesmo tempo.

No início da carreira, é muito fácil olhar para tantas possibilidades e sentir que você precisa dominar todas elas para crescer.

Mas o tempo me ensinou o valor de construir uma base consistente.

Eu escolheria boas referências, aprofundaria os conhecimentos que fazem sentido para minha atuação e buscaria oportunidades de acompanhar a prática de profissionais experientes.

E também aprenderia a respeitar o meu próprio ritmo.

Porque construir uma carreira não é uma corrida para colecionar técnicas.

É um processo de desenvolver conhecimento, experiência e responsabilidade.

Se você está começando, guarde isso: não precisa aprender tudo hoje para construir uma trajetória relevante.`,
      direction: [
        'Sentada, com o corpo ligeiramente virado.',
        'Tom de conselho pessoal.',
        'Olhar para a câmera como se conversasse com uma aluna.',
        'Fazer pequenas pausas para transmitir naturalidade.'
      ],
      screenText: 'O conselho que eu daria para a Lívia do início.',
      editing: 'Legendas discretas e cortes suaves.',
      cta: 'Incentivo para salvar.', ctaType: 'Salvar',
      commercial: null
    },
    {
      id: 3, week: 1, date: '2026-10-30', weekday: 'Sexta',
      theme: 'Aprender Endolaser: três pontos',
      title: 'Três coisas que observo em quem aprende Endolaser',
      style: 'C', objective: 'Formação técnica', pillar: 'Formação e aprendizado',
      goal: 'Demonstrar profundidade da formação técnica.',
      outfit: 'Blazer azul-marinho.', target: '45–55 segundos',
      position: 'Sentada ou em pé, sem mudar o cenário.',
      framing: 'Close, com enquadramento do peito para cima.',
      expression: 'Ritmo didático, sem acelerar demais. Pequena pausa antes da pergunta final.',
      script: `Quando uma profissional começa a estudar Endolaser, existem três pontos que eu considero fundamentais no processo de formação.

O primeiro é compreender a tecnologia além da demonstração. Entender os princípios de funcionamento, as possibilidades e os limites de aplicação.

O segundo é aprender a reconhecer a importância da avaliação, das indicações, das contraindicações e dos riscos. Não basta conhecer uma sequência de execução.

E o terceiro é entender que desenvolver competência exige formação adequada, prática supervisionada quando aplicável e atualização contínua.

Eu gosto de ensinar mostrando o contexto por trás da técnica, porque é isso que ajuda o conhecimento a fazer sentido.

A pergunta não deveria ser apenas ‘como funciona?’.

Deveria ser também ‘o que eu preciso saber antes de utilizar?’.

Qual desses três pontos você considera mais importante?`,
      direction: [
        'Close, com enquadramento do peito para cima.',
        'Mostrar os números 1, 2 e 3 na edição.',
        'Falar com ritmo didático, sem acelerar demais.',
        'Fazer uma pequena pausa antes da pergunta final.'
      ],
      screenText: '3 pontos para estudar Endolaser.',
      editing: 'Palavras-chave: fundamentos, avaliação e competência.',
      cta: 'Comentários ou, após validação da oferta, convite para conhecer a formação.', ctaType: 'Comentários',
      commercial: 'Validar se Endolaser é um curso ativo antes da publicação. Se não for, substituir pelo nome de uma tecnologia efetivamente ensinada, com revisão técnica da Lívia.'
    },
    {
      id: 4, week: 2, date: '2026-11-02', weekday: 'Segunda',
      theme: 'O que não aparece nas aulas práticas',
      title: 'O que acontece em uma aula prática que você não vê no Instagram',
      style: 'D', objective: 'Cursos', pillar: 'Formação e aprendizado',
      goal: 'Despertar desejo pela experiência de formação.',
      outfit: 'Blusa off-white.', target: '45–55 segundos',
      position: 'Em pé, com gestos naturais, como quem conta uma experiência.',
      framing: 'Plano mais aberto.',
      expression: 'Humana e espontânea, como quem conta uma experiência.',
      script: `Quando você vê um vídeo de uma aula prática, normalmente aparece a parte mais bonita.

A tecnologia, a demonstração, as alunas acompanhando…

Mas existe uma parte que eu considero tão importante quanto essa.

São as perguntas que surgem durante a explicação. A necessidade de retomar um conceito. A conversa sobre critérios, limites e cuidados. Aquele momento em que alguém percebe que precisa entender melhor um detalhe antes de avançar.

Ensinar não é apenas mostrar como uma técnica acontece.

É criar espaço para que o conhecimento seja compreendido com responsabilidade.

Por isso, quando preparo uma aula, penso tanto na experiência de aprendizado quanto no conteúdo.

Porque o que realmente importa não é como a aula aparece no vídeo.

É o que a profissional consegue compreender depois dela.`,
      direction: [
        'Em pé, plano mais aberto.',
        'Gestos naturais, como quem conta uma experiência.',
        'Se houver imagens reais de cursos, inserir durante o desenvolvimento.',
        'Se não houver, manter a fala integral na parede marrom.'
      ],
      screenText: 'A parte mais importante nem sempre aparece.',
      editing: 'Intercalar com bastidores reais apenas se disponíveis.',
      cta: 'Interesse por aulas e formações.', ctaType: 'Interesse em formações',
      commercial: 'CTA de interesse por aulas e formações: confirmar quais formações estão ativas antes de direcionar o público. Não citar cursos, preços, turmas, vagas ou datas não confirmados.'
    },
    {
      id: 5, week: 2, date: '2026-11-04', weekday: 'Quarta',
      theme: 'A tecnologia que parece simples',
      title: 'A tecnologia que parece simples',
      style: 'A', objective: 'Educação', pillar: 'Tecnologias e investimento',
      goal: 'Educar e valorizar a formação profissional.',
      outfit: 'Camisa branca.', target: '45–55 segundos',
      position: 'Em pé.',
      framing: 'Plano médio. Aproximação sutil na frase “só a parte visível”.',
      expression: 'Começar com expressão curiosa. Pausar após “Às vezes, parece simples”.',
      script: `Tem uma coisa interessante sobre assistir a alguém experiente utilizando uma tecnologia.

Às vezes, parece simples.

Os movimentos são seguros, a sequência parece natural e tudo acontece com fluidez.

Mas o que você está vendo é só a parte visível de um processo muito maior.

Antes da execução, existe conhecimento técnico, compreensão dos riscos, avaliação, planejamento e experiência.

É por isso que eu sempre digo que uma demonstração pode despertar interesse, mas não substitui uma formação adequada.

A facilidade que você enxerga em alguém experiente não significa que aquela técnica seja simples de aprender ou executar.

E, para mim, respeitar essa diferença faz parte do amadurecimento profissional.

Qual tecnologia parecia mais simples para você antes de começar a estudá-la?`,
      direction: [
        'Em pé, plano médio.',
        'Começar com expressão curiosa.',
        'Pausar após “Às vezes, parece simples”.',
        'Usar aproximação sutil na frase “só a parte visível”.'
      ],
      screenText: 'Parece fácil. Mas será que é?',
      editing: 'Ritmo dinâmico, sem excesso de efeitos.',
      cta: 'Comentários.', ctaType: 'Comentários',
      commercial: null
    },
    {
      id: 6, week: 2, date: '2026-11-06', weekday: 'Sexta',
      theme: 'A pergunta que muda uma aula',
      title: 'Uma pergunta que eu gostaria de ouvir mais nas minhas aulas',
      style: 'B', objective: 'Mentoria RCE®', pillar: 'Raciocínio clínico',
      goal: 'Apresentar o valor da Mentoria RCE®.',
      outfit: 'Blazer bege claro.', target: '45–55 segundos',
      position: 'Sentada.',
      framing: 'Plano médio ou meio-close, levemente lateral.',
      expression: 'Tom próximo e reflexivo. Pausa após cada uma das duas perguntas iniciais; olhar direto para a lente na pergunta final.',
      script: `Tem uma pergunta que eu gostaria que mais profissionais fizessem durante as aulas.

Não é ‘qual protocolo eu devo seguir?’.

É ‘o que faria você escolher um caminho diferente?’.

Percebe a diferença?

A primeira pergunta busca uma resposta. A segunda tenta compreender os critérios que sustentam aquela resposta.

E eu gosto muito quando uma aluna começa a fazer esse tipo de questionamento.

Porque significa que ela está interessada em entender possibilidades, limites e o contexto de cada decisão.

Isso não diminui a importância dos protocolos. Eles têm seu lugar.

Mas a prática profissional também exige capacidade de avaliar situações que não são idênticas.

É justamente esse desenvolvimento do raciocínio que valorizo na Mentoria RCE®.

Você costuma perguntar mais sobre o ‘como’ ou sobre o ‘porquê’?`,
      direction: [
        'Sentada.',
        'Tom próximo e reflexivo.',
        'Fazer pausa após cada uma das duas perguntas iniciais.',
        'Olhar direto para a lente na pergunta final.'
      ],
      screenText: 'A pergunta que muda uma aula.',
      editing: 'Destacar visualmente “COMO” e “POR QUÊ”.',
      cta: 'Interação e interesse na mentoria.', ctaType: 'Comentários',
      commercial: 'Menciona a Mentoria RCE®: confirmar com a equipe comercial como direcionar as interessadas antes da publicação.'
    },
    {
      id: 7, week: 3, date: '2026-11-09', weekday: 'Segunda',
      theme: 'Antes de comprar um equipamento',
      title: 'Como eu avalio se vale a pena investir em uma tecnologia',
      style: 'C', objective: 'Cursos', pillar: 'Tecnologias e investimento',
      goal: 'Conteúdo prático e salvável.',
      outfit: 'Blazer azul-marinho.', target: '45–55 segundos',
      position: 'Sentada ou em pé; usar os dedos discretamente para marcar as três perguntas.',
      framing: 'Close, do peito para cima.',
      expression: 'Ritmo objetivo, com pausa curta entre os itens.',
      script: `Antes de investir em uma tecnologia, eu faria três perguntas muito objetivas.

Primeira: essa tecnologia responde a uma necessidade real da minha prática ou estou interessada apenas porque ela está em evidência?

Segunda: eu compreendo os custos envolvidos além da compra? Formação, manutenção, insumos, estrutura e exigências de utilização também fazem parte da conta.

Terceira: tenho condições de desenvolver competência para utilizá-la de forma responsável, respeitando as regras da minha profissão?

São perguntas simples, mas que ajudam a organizar uma decisão importante.

Eu gosto de tecnologia e acredito nas possibilidades que ela oferece.

Só não acredito que toda novidade precise virar imediatamente um investimento.

Se você está avaliando um novo equipamento, salve essas três perguntas para consultar depois.`,
      direction: [
        'Close.',
        'Usar os dedos discretamente para marcar as três perguntas.',
        'Manter ritmo objetivo.',
        'Deixar uma pausa curta entre os itens.'
      ],
      screenText: '3 perguntas antes de comprar.',
      editing: 'Números grandes e títulos curtos.',
      cta: 'Salvar.', ctaType: 'Salvar',
      commercial: null
    },
    {
      id: 8, week: 3, date: '2026-11-11', weekday: 'Quarta',
      theme: 'Não compre porque virou tendência',
      title: 'Não compre uma máquina só porque virou tendência',
      style: 'A', objective: 'Autoridade', pillar: 'Tecnologias e investimento',
      goal: 'Posicionamento e autoridade.',
      outfit: 'Camisa off-white.', target: '45–55 segundos',
      position: 'Em pé, olhar firme.',
      framing: 'Plano médio.',
      expression: 'Sem tom de bronca. Começar com ritmo de observação do mercado; enfatizar a última pergunta.',
      script: `Às vezes, uma tecnologia aparece tanto nas redes sociais que parece impossível crescer profissionalmente sem ela.

Você abre o Instagram e vê demonstrações, cursos, resultados, profissionais falando sobre o mesmo equipamento…

E começa a sentir que precisa acompanhar aquilo imediatamente.

Mas uma tendência de mercado não é, por si só, uma indicação de investimento.

Existem tecnologias excelentes que podem não fazer sentido para determinado momento da sua carreira.

E existem conhecimentos que talvez precisem ser aprofundados antes de incorporar um novo recurso.

Eu sou apaixonada por estudar tecnologias. Mas acredito que entusiasmo e análise precisam caminhar juntos.

Então, antes de perguntar ‘qual aparelho está em alta?’, experimente perguntar:

‘Qual conhecimento ou recurso realmente faz falta na minha prática hoje?’`,
      direction: [
        'Em pé, olhar firme.',
        'Não falar em tom de bronca.',
        'Começar com ritmo de observação do mercado.',
        'Enfatizar a última pergunta.'
      ],
      screenText: 'Nem toda tendência precisa virar compra.',
      editing: 'Destaque de frases curtas, sem imagens obrigatórias.',
      cta: 'Reflexão e compartilhamento.', ctaType: 'Compartilhamento',
      commercial: null
    },
    {
      id: 9, week: 3, date: '2026-11-13', weekday: 'Sexta',
      theme: 'Ver uma demonstração não é dominar',
      title: 'Assistir a uma demonstração não é aprender uma técnica',
      style: 'D', objective: 'Cursos', pillar: 'Formação e aprendizado',
      goal: 'Mostrar o valor de uma formação estruturada.',
      outfit: 'Blusa bege clara.', target: '45–55 segundos',
      position: 'Em pé.',
      framing: 'Plano mais aberto. Sem material adicional, usar cortes de aproximação.',
      expression: 'Começar com a pergunta e expressão curiosa.',
      script: `Você já assistiu a uma demonstração e pensou: ‘Agora eu entendi como funciona’?

Essa sensação é muito comum.

Ver alguém executando uma técnica ajuda a visualizar etapas e entender parte do processo.

Mas existe uma distância importante entre compreender uma demonstração e desenvolver competência para realizar um procedimento.

A formação precisa considerar fundamentos, critérios de indicação, contraindicações, segurança, possíveis intercorrências e os limites de atuação de cada profissão.

E, quando necessário, prática orientada e supervisão.

Por isso, eu gosto de pensar que uma boa demonstração desperta perguntas, em vez de encerrar o aprendizado.

Porque o objetivo não é simplesmente reproduzir o que você viu.

É compreender o que aquela técnica exige de quem pretende utilizá-la.

Você já tinha pensado nessa diferença?`,
      direction: [
        'Em pé, plano mais aberto.',
        'Começar com pergunta e expressão curiosa.',
        'Se existirem vídeos de aula, inserir pequenos trechos.',
        'Sem material adicional, usar cortes de aproximação.'
      ],
      screenText: 'Ver não é o mesmo que dominar.',
      editing: 'Comparativo visual entre “assistir” e “aprender”.',
      cta: 'Comentários ou compartilhamento.', ctaType: 'Comentários',
      commercial: null
    },
    {
      id: 10, week: 4, date: '2026-11-16', weekday: 'Segunda',
      theme: 'O que minhas alunas me ensinaram',
      title: 'O que mais me surpreendeu depois que comecei a ensinar',
      style: 'B', objective: 'Conexão', pillar: 'Carreira e trajetória',
      goal: 'Humanização e autoridade.',
      outfit: 'Blazer bege claro.', target: '45–55 segundos',
      position: 'Sentada.',
      framing: 'Plano médio ou meio-close, levemente lateral.',
      expression: 'Fala afetuosa, mas profissional. Pequeno sorriso ao falar das alunas, sem dramatização.',
      script: `Uma das coisas mais bonitas que o ensino me proporcionou foi perceber como uma mesma aula pode despertar perguntas completamente diferentes.

Tem a profissional que está começando e quer compreender os fundamentos.

Tem aquela que já atua e procura aprofundar uma dificuldade específica.

E tem quem chegue com muita experiência, mas esteja disposta a rever a maneira de fazer alguma coisa.

Isso me ensinou que não existe apenas uma forma de evoluir profissionalmente.

Cada pessoa chega com uma história, um repertório e desafios próprios.

E é por isso que ensinar continua sendo tão especial para mim.

Eu compartilho conhecimento, mas também aprendo muito com as perguntas e experiências de quem está ali.

No fim, a sala de aula é um espaço de crescimento para todos nós.`,
      direction: [
        'Sentada.',
        'Fala afetuosa, mas profissional.',
        'Pequeno sorriso ao falar das alunas.',
        'Evitar dramatização.'
      ],
      screenText: 'O que minhas alunas também me ensinam.',
      editing: 'Cortes leves; fotografias reais de aulas são opcionais.',
      cta: 'Conexão com a audiência.', ctaType: 'Conexão',
      commercial: null
    },
    {
      id: 11, week: 4, date: '2026-11-18', weekday: 'Quarta',
      theme: 'Como escolher uma formação',
      title: 'Um erro comum na hora de escolher uma formação',
      style: 'C', objective: 'Cursos', pillar: 'Formação e aprendizado',
      goal: 'Atrair profissionais interessadas em cursos.',
      outfit: 'Blazer azul-marinho.', target: '45–55 segundos',
      position: 'Sentada ou em pé.',
      framing: 'Close, do peito para cima.',
      expression: 'Tom didático, com pausas entre as perguntas.',
      script: `Quando uma profissional está escolhendo um curso, é muito comum começar pelo nome da tecnologia ou pelo preço.

Mas eu acrescentaria algumas perguntas nessa escolha.

O conteúdo contempla fundamentos e segurança? A formação é compatível com minha habilitação profissional? Existe espaço para tirar dúvidas? O formato oferecido faz sentido para o tipo de competência que preciso desenvolver?

E uma pergunta que considero especialmente importante: o que eu espero conseguir compreender ao final desse aprendizado?

Porque duas formações com nomes parecidos podem ter propostas muito diferentes.

Escolher bem um curso também faz parte da construção da carreira.

Não é apenas sobre preencher a agenda com mais uma formação.

É sobre investir em conhecimento que tenha propósito.

Se você está pesquisando cursos, salve esse vídeo.`,
      direction: [
        'Close, tom didático.',
        'Fazer pausas entre as perguntas.',
        'Utilizar textos curtos na tela.',
        'Evitar efeitos exagerados.'
      ],
      screenText: 'Antes de se matricular, pergunte isso.',
      editing: 'Destacar “conteúdo”, “habilitação” e “objetivo”.',
      cta: 'Salvar e conhecer as formações disponíveis, quando validadas.', ctaType: 'Salvar',
      commercial: 'O convite para “conhecer as formações disponíveis” só pode entrar após a validação comercial dos cursos ativos.'
    },
    {
      id: 12, week: 4, date: '2026-11-20', weekday: 'Sexta',
      theme: 'Tecnologias combinadas',
      title: 'O que eu gostaria que toda profissional entendesse sobre tecnologias combinadas',
      style: 'A', objective: 'Mentoria RCE®', pillar: 'Tecnologias e investimento',
      goal: 'Conectar formações técnicas e Mentoria RCE®.',
      outfit: 'Camisa branca.', target: '45–55 segundos',
      position: 'Em pé.',
      framing: 'Plano médio. Zoom discreto em “a combinação precisa ter uma justificativa”.',
      expression: 'Firme, porém acessível. Pausa após “a combinação precisa ter uma justificativa”.',
      script: `Uma coisa que eu gostaria que toda profissional entendesse sobre tecnologias combinadas é que combinar não significa simplesmente utilizar mais recursos.

Às vezes, quando estudamos diferentes tecnologias, surge a vontade de colocar tudo no mesmo planejamento.

Mas a combinação precisa ter uma justificativa.

É necessário compreender os objetivos, as indicações, as contraindicações, os riscos, as possíveis interações e a sequência adequada, quando houver indicação para associá-las.

Em alguns contextos, integrar recursos pode fazer sentido. Em outros, a melhor decisão pode ser não combinar.

E isso mostra por que estudar cada tecnologia individualmente é importante, mas aprender a analisar o conjunto também é.

É uma das discussões que considero valiosas no desenvolvimento do raciocínio clínico.

Você gosta de estudar tecnologias de forma isolada ou integrada?`,
      direction: [
        'Em pé, plano médio.',
        'Expressão firme, porém acessível.',
        'Pausa após “a combinação precisa ter uma justificativa”.',
        'Usar zoom discreto nessa frase.'
      ],
      screenText: 'Combinar mais não significa fazer melhor.',
      editing: 'Destaque para “indicação”, “limites” e “integração”.',
      cta: 'Comentários e aproximação com a Mentoria RCE®.', ctaType: 'Comentários',
      commercial: 'Aproximação com a Mentoria RCE®: confirmar o direcionamento comercial antes da publicação.'
    },
    {
      id: 13, week: 5, date: '2026-11-23', weekday: 'Segunda',
      theme: 'A primeira pergunta na avaliação',
      title: 'Você faria esta pergunta antes de indicar um procedimento?',
      style: 'C', objective: 'Engajamento', pillar: 'Raciocínio clínico',
      goal: 'Estimular comentários e identificação profissional.',
      outfit: 'Blazer azul-marinho.', target: '45–55 segundos',
      position: 'Sentada ou em pé.',
      framing: 'Close.',
      expression: 'Como quem propõe uma situação real de aula. Pausa perceptível após “Qual seria sua primeira pergunta?”; olhar direto para a câmera na pergunta final.',
      script: `Eu quero fazer um exercício rápido com você.

Imagine que uma pessoa chega à sua avaliação perguntando por uma tecnologia específica.

Ela viu o procedimento nas redes sociais, pesquisou bastante e está convencida de que aquela é a melhor opção.

Qual seria sua primeira pergunta?

Eu começaria tentando compreender o que motivou aquela procura e quais são as necessidades reais do caso.

Porque o desejo por uma tecnologia não significa, automaticamente, que exista indicação para ela.

Uma avaliação responsável pode confirmar uma possibilidade, mostrar limitações ou apontar que outro caminho precisa ser considerado.

E esse é um ponto que eu gosto de discutir com profissionais: saber escutar a demanda sem transformar a preferência inicial em decisão clínica.

Agora quero saber: o que você perguntaria primeiro?`,
      direction: [
        'Close.',
        'Falar como se propusesse uma situação real de aula.',
        'Fazer pausa perceptível após “Qual seria sua primeira pergunta?”.',
        'Olhar diretamente para a câmera na pergunta final.'
      ],
      screenText: 'Qual seria sua primeira pergunta?',
      editing: 'Deixar a pergunta na tela por alguns segundos.',
      cta: 'Comentários.', ctaType: 'Comentários',
      commercial: null
    },
    {
      id: 14, week: 5, date: '2026-11-25', weekday: 'Quarta',
      theme: 'Por que continuo atendendo',
      title: 'Por que continuo atendendo?',
      style: 'B', objective: 'Autoridade', pillar: 'Carreira e trajetória',
      goal: 'Reforçar a autoridade da Lívia e sua conexão com a prática.',
      outfit: 'Blusa bege clara ou blazer bege.', target: '45–55 segundos',
      position: 'Sentada.',
      framing: 'Enquadramento de conversa: plano médio ou meio-close, levemente lateral.',
      expression: 'Natural, sem excesso de formalidade. Valorizar as pausas.',
      script: `Às vezes me perguntam por que continuo atendendo, mesmo com tantos projetos ligados ao ensino.

E a resposta é simples: porque a prática continua sendo uma parte muito importante de quem eu sou.

É nela que encontro situações que me desafiam, que me fazem revisar conhecimentos e continuar buscando respostas.

E tudo isso também influencia a forma como preparo minhas aulas.

Quando ensino, não quero compartilhar apenas conceitos desconectados da realidade.

Quero aproximar o conhecimento das situações que fazem parte da atuação profissional, sempre respeitando os limites e as particularidades de cada caso.

Para mim, atender e ensinar não são caminhos separados.

A prática alimenta o ensino. E ensinar me incentiva a estudar ainda mais.

É assim que continuo evoluindo.`,
      direction: [
        'Sentada, enquadramento de conversa.',
        'Expressão natural, sem excesso de formalidade.',
        'Caso existam vídeos reais dela atendendo, inserir como apoio.',
        'Manter a parede marrom como cenário principal.'
      ],
      screenText: 'Por que eu ainda atendo?',
      editing: 'Valorizar a fala e os momentos de pausa.',
      cta: 'Autoridade e relacionamento.', ctaType: 'Conexão',
      commercial: null
    },
    {
      id: 15, week: 5, date: '2026-11-27', weekday: 'Sexta',
      theme: 'A profissional daqui a cinco anos',
      title: 'A profissional que você quer ser daqui a cinco anos',
      style: 'D', objective: 'Mentoria RCE®', pillar: 'Carreira e trajetória',
      goal: 'Inspiração e convite à Mentoria RCE®.',
      outfit: 'Camisa off-white.', target: '45–55 segundos',
      position: 'Em pé.',
      framing: 'Plano mais aberto.',
      expression: 'Tom inspirador e sereno. Começar com leve sorriso; pausar após “Agora vem a parte mais importante”; finalizar olhando para a lente.',
      script: `Eu quero te propor uma reflexão.

Pensa na profissional que você gostaria de ser daqui a cinco anos.

Não apenas nos equipamentos que deseja ter ou nos cursos que pretende concluir.

Pensa na forma como você gostaria de conduzir sua carreira.

Nas decisões que quer tomar com mais clareza. Nos conhecimentos que deseja aprofundar. Na confiança que pretende construir a partir de uma formação sólida e de experiência.

Agora vem a parte mais importante.

O que você pode começar a desenvolver hoje para se aproximar dessa profissional?

Talvez seja uma formação específica. Talvez seja reorganizar seus estudos. Talvez seja buscar acompanhamento para amadurecer sua prática.

É com esse olhar para o desenvolvimento profissional que construí a Mentoria RCE®.

Se você quer conhecer essa proposta, me envie ‘RCE’ no direct.`,
      direction: [
        'Em pé, plano mais aberto.',
        'Tom inspirador e sereno.',
        'Começar com leve sorriso.',
        'Pausar após “Agora vem a parte mais importante”.',
        'Finalizar olhando diretamente para a lente.'
      ],
      screenText: 'Quem você quer se tornar?',
      editing: 'Legendas elegantes, ritmo mais emocional, sem música excessivamente dramática.',
      cta: 'Enviar “RCE” no direct.', ctaType: 'Direct (RCE)',
      commercial: 'CTA “envie RCE no direct”: confirmar quem atende o direct e quais informações da Mentoria RCE® serão enviadas antes da publicação.'
    }
  ]
};
