/* =========================================================
   SUPER REDE PIRAQUARA — Dados-base do planejamento
   Período: 10/10/2026 a 10/11/2026
   Este arquivo contém SOMENTE o planejamento. Nenhum resultado,
   preço, desconto ou meta de alcance foi inventado.
   ========================================================= */

const PLAN = {
  start: '2026-10-10',
  end: '2026-11-10',
  days: 32,
  reelsPlanned: 16,
  storiesPerDayMin: 10,
  storiesPerDayMax: 15,
  weeks: [
    { n: 1, label: 'Semana 1', start: '2026-10-10', end: '2026-10-16' },
    { n: 2, label: 'Semana 2', start: '2026-10-17', end: '2026-10-23' },
    { n: 3, label: 'Semana 3', start: '2026-10-24', end: '2026-10-30' },
    { n: 4, label: 'Semana 4', start: '2026-10-31', end: '2026-11-06' },
    { n: 5, label: 'Semana 5', start: '2026-11-07', end: '2026-11-10' }
  ]
};

const STATUSES = [
  { id: 'planejado', label: 'Planejado' },
  { id: 'roteiro', label: 'Roteiro pronto' },
  { id: 'aguardando_gravacao', label: 'Aguardando gravação' },
  { id: 'gravado', label: 'Gravado' },
  { id: 'edicao', label: 'Em edição' },
  { id: 'aguardando_aprovacao', label: 'Aguardando aprovação' },
  { id: 'aprovado', label: 'Aprovado' },
  { id: 'agendado', label: 'Agendado' },
  { id: 'publicado', label: 'Publicado' }
];

const PILLARS = [
  { id: 'ofertas', label: 'Ofertas e campanhas comerciais', target: 40 },
  { id: 'produtos', label: 'Produtos, setores e experiências', target: 30 },
  { id: 'relacionamento', label: 'Relacionamento, entretenimento e interação', target: 20 },
  { id: 'institucional', label: 'Conteúdo institucional', target: 10 }
];

const SECTORS = [
  { id: 'acougue', label: 'Açougue', items: ['Carnes bovinas', 'Carnes suínas', 'Cortes para churrasco', 'Produtos para feijoada', 'Ofertas semanais'] },
  { id: 'hortifruti', label: 'Hortifruti', items: ['Frutas, verduras e legumes', 'Ambiente climatizado', 'Sistema de vapor para apresentação', 'Produtos frescos', 'Sucos naturais', 'Salada de frutas'] },
  { id: 'padaria', label: 'Padaria e lanchonete', items: ['Pães', 'Salgados variados', 'Café e café em grão', 'Pão com ovo preparado na hora', 'Opções de café da manhã', 'Lanches rápidos'] },
  { id: 'pizzaria', label: 'Pizzaria', items: ['Pizzas salgadas e doces', 'Combos promocionais', 'Seg. a sáb., a partir das 17h (confirmar operação)'] },
  { id: 'pronta', label: 'Alimentação pronta', items: ['Marmitex a partir das 11h30', 'Frango assado', 'Mesa de doces e salgados a partir das 16h30', 'Churrasquinho de terça a sábado'] },
  { id: 'bebidas', label: 'Bebidas e experiências', items: ['Chopp Brahma', 'Chopp Heineken', 'Chopp de vinho', 'Varandão climatizado', 'Música ao vivo às sextas (conforme programação confirmada)'] },
  { id: 'naturais', label: 'Produtos naturais', items: ['Ervas para chás', 'Ervas para banhos', 'Temperos', 'Farinhas', 'Sais', 'Produtos naturais variados'] },
  { id: 'mercearia', label: 'Mercearia e doces', items: ['Mercearia', 'Doces, chocolates e guloseimas', 'Limpeza', 'Bebidas', 'Produtos de uso doméstico'] },
  { id: 'laticinios', label: 'Laticínios', items: ['Laticínios'] },
  { id: 'institucional', label: 'Institucional', items: ['Datas comemorativas', 'Conscientização', 'Funcionamento da loja'] }
];

const CAMPAIGNS = [
  { id: 'segunda-show', name: 'Segunda Show', type: 'fixa', when: 'Toda segunda-feira', weekday: 1, color: '#D62828',
    objective: 'Ofertas de diversos setores, abastecimento da casa e economia no começo da semana.' },
  { id: 'terca-quente', name: 'Terça Quente', type: 'fixa', when: 'Toda terça-feira', weekday: 2, color: '#E8590C',
    objective: 'Padaria, laticínios, café da manhã e produtos relacionados.' },
  { id: 'quarta-verde', name: 'Quarta Verde', type: 'fixa', when: 'Toda quarta-feira', weekday: 3, color: '#258A4B',
    objective: 'Hortifruti: frutas, legumes, verduras, frescor e variedade.' },
  { id: 'quinta-acougue', name: 'Quinta do Açougue', type: 'fixa', when: 'Toda quinta-feira', weekday: 4, color: '#9B1C1C',
    objective: 'Cortes bovinos, variedade de carnes e ofertas do açougue.' },
  { id: 'sexta-suina', name: 'Sexta Suína', type: 'fixa', when: 'Toda sexta-feira', weekday: 5, color: '#C2410C',
    objective: 'Carnes suínas, ingredientes para feijoada e ofertas do setor.' },
  { id: 'fds-maluco', name: 'Fim de Semana Maluco', type: 'fixa', when: 'Sábados e domingos', weekday: [6, 0], color: '#B45309',
    objective: 'Açougue, hortifruti, churrasco e abastecimento para o fim de semana.' },
  { id: 'super-sexta', name: 'Super Sexta', type: 'especial', when: '30/10 (aquecimento de 26 a 29/10)', color: '#202124',
    objective: 'A última sexta-feira do mês e a mais barata. Prioridade máxima do calendário comercial: aquecimento, contagem regressiva, vídeo principal e cobertura de ofertas.' },
  { id: 'dia-criancas', name: 'Dia das Crianças', type: 'sazonal', when: '12/10', color: '#7C3AED',
    objective: 'Compras para comemorações em família: doces, guloseimas, chocolates, sobremesas e opções de alimentação.' },
  { id: 'outubro-rosa', name: 'Outubro Rosa', type: 'sazonal', when: 'Durante outubro', color: '#DB2777',
    objective: 'Conscientização e relacionamento. Dois conteúdos institucionais com informação responsável e incentivo ao cuidado com a saúde. Não vincular descontos a alegações de prevenção de doenças.' },
  { id: 'novembro-azul', name: 'Novembro Azul', type: 'sazonal', when: 'A partir de 01/11', color: '#1D4ED8',
    objective: 'Conscientização sobre saúde masculina, sem promessas médicas.' },
  { id: 'halloween', name: 'Halloween', type: 'sazonal', when: '31/10', color: '#EA580C',
    objective: 'Destacar doces e produtos para pequenas comemorações.' },
  { id: 'dia-professores', name: 'Dia dos Professores', type: 'sazonal', when: '15/10', color: '#0F766E',
    objective: 'Homenagem e conexão emocional.' },
  { id: 'dia-alimentacao', name: 'Dia Mundial da Alimentação', type: 'sazonal', when: '16/10', color: '#258A4B',
    objective: 'Destacar variedade e alimentos frescos.' },
  { id: 'finados', name: 'Finados', type: 'sazonal', when: '02/11', color: '#4B5563',
    objective: 'Informar o funcionamento e divulgar conveniência, respeitando o contexto da data.' }
];

/* Blocos diários de Stories (referências editoriais, ajustar à operação real) */
const STORY_BLOCKS = [
  { id: 'b1', name: 'Manhã', time: '7h às 9h', items: ['Bom dia', 'Abertura da loja', 'Café da manhã', 'Lanchonete', 'Apresentação da campanha do dia'] },
  { id: 'b2', name: 'Ofertas', time: '9h às 11h', items: ['Produtos em promoção', 'Setores da campanha', 'Preços reais', 'Chamada para visitar a loja'] },
  { id: 'b3', name: 'Almoço', time: '11h às 13h', items: ['Marmitex', 'Frango assado, conforme disponibilidade', 'Produtos para almoço', 'Conveniência'] },
  { id: 'b4', name: 'Descoberta', time: '13h às 15h', items: ['Produtos naturais', 'Hortifruti', 'Curiosidades sobre produtos', 'Bastidores'] },
  { id: 'b5', name: 'Interação', time: '15h às 17h', items: ['Enquetes', 'Perguntas', 'Mesa de doces e salgados, a partir de 16h30', 'Preferências dos clientes'] },
  { id: 'b6', name: 'Fim de tarde', time: '17h às 19h', items: ['Pizzaria, nos dias de funcionamento', 'Churrasquinho, conforme programação', 'Chopp', 'Varandão', 'Chamada para pedidos'] }
];

const HOOK_TYPES = [
  { type: 'Economia', example: 'Você já viu o preço disso aqui?' },
  { type: 'Curiosidade', example: 'Tem uma coisa aqui no Super Rede que muita gente ainda não conhece!' },
  { type: 'Desejo', example: 'Olha só o que acabou de sair da nossa cozinha!' },
  { type: 'Relacionamento', example: 'Quem é de Piraquara sabe...' },
  { type: 'Urgência comercial', example: 'É hoje! E você não vai querer perder!' }
];

const METRIC_FIELDS = [
  { id: 'alcance', label: 'Alcance' },
  { id: 'visualizacoes', label: 'Visualizações' },
  { id: 'curtidas', label: 'Curtidas' },
  { id: 'comentarios', label: 'Comentários' },
  { id: 'compartilhamentos', label: 'Compartilhamentos' },
  { id: 'salvamentos', label: 'Salvamentos' },
  { id: 'visitasPerfil', label: 'Visitas ao perfil' },
  { id: 'novosSeguidores', label: 'Novos seguidores' },
  { id: 'cliquesLinks', label: 'Cliques em links' },
  { id: 'mensagens', label: 'Mensagens recebidas' },
  { id: 'pedidos', label: 'Pedidos atribuídos ao Instagram (quando rastreáveis)' }
];

/* ---------------------------------------------------------
   Reels — 16 conteúdos (dia sim, dia não)
   Roteiros são SUGESTÕES editoriais para a equipe ajustar.
   --------------------------------------------------------- */
const REELS_SEED = [
  { date: '2026-10-10', campaigns: ['dia-criancas'], pillar: 'ofertas',
    title: 'O Dia das Crianças está chegando e por aqui tem muita coisa gostosa!',
    objective: 'Estimular compras para a data sazonal.',
    sectors: ['mercearia', 'padaria', 'pizzaria'],
    idea: 'Apresentadora mostrando produtos e opções para as famílias: doces, chocolates, guloseimas, lanchonete e pizzaria.',
    cta: 'Passe no Super Rede Piraquara e garanta as delícias para comemorar!',
    stories: 'Produtos, sugestões de compras e enquete sobre doces favoritos.',
    script: {
      hook: 'Desejo — "Olha só o que a criançada vai querer esse ano!"',
      development: 'Apresentadora percorre o corredor de doces e chocolates como se montasse a "cesta da festa", mostrando opções para diferentes gostos.',
      product: 'Doces, chocolates, guloseimas + sugestão de lanche na lanchonete e pizza para a comemoração em família.',
      scenes: 'Plano aberto do corredor de doces; close nas embalagens; apresentadora pegando produtos; corte para lanchonete e forno da pizzaria.',
      caption: 'O Dia das Crianças está chegando e aqui no Super Rede tem muita coisa gostosa pra comemorar em família! 🍫🍕 Passe aqui e garanta as delícias.'
    } },
  { date: '2026-10-12', campaigns: ['dia-criancas'], pillar: 'relacionamento',
    title: 'As melhores lembranças também têm sabor!',
    objective: 'Fortalecer a conexão com as famílias.',
    sectors: ['mercearia', 'institucional'],
    idea: 'Produtos, guloseimas, momentos de celebração e mensagem afetiva.',
    cta: 'Venha aproveitar o Dia das Crianças com a gente!',
    stories: 'Homenagem, produtos e horário especial — somente após confirmação.',
    confirm: 'Horário especial do dia 12/10 só pode ser divulgado após confirmação da loja.',
    script: {
      hook: 'Relacionamento — "Qual era o doce que você mais pedia quando era criança?"',
      development: 'Sequência afetiva com doces clássicos e momentos de celebração; tom nostálgico e acolhedor.',
      product: 'Guloseimas e doces disponíveis na loja como parte das lembranças de família.',
      scenes: 'Mãos pegando doces; prateleiras coloridas; apresentadora contando lembrança; mensagem final na tela.',
      caption: 'As melhores lembranças também têm sabor. ❤️ Feliz Dia das Crianças de todo o Super Rede Piraquara!'
    } },
  { date: '2026-10-14', campaigns: ['quarta-verde'], pillar: 'produtos',
    title: 'Você já conhece nosso hortifruti climatizado?',
    objective: 'Apresentar um diferencial competitivo.',
    sectors: ['hortifruti'],
    idea: 'Tour pelo setor, mostrando frutas, verduras, legumes, climatização e sistema de vapor.',
    cta: 'Venha conhecer nosso hortifruti!',
    stories: 'Ofertas da Quarta Verde e bastidores da reposição.',
    script: {
      hook: 'Curiosidade — "Tem uma coisa aqui no Super Rede que muita gente ainda não conhece!"',
      development: 'Apresentadora entra no hortifruti e mostra o ambiente climatizado e o sistema de vapor em ação.',
      product: 'Frescor e variedade: frutas, verduras e legumes bem apresentados.',
      scenes: 'Entrada no setor (plano aberto); vapor sobre as verduras em câmera lenta; close em frutas; apresentadora escolhendo produtos.',
      caption: 'Você já conhece nosso hortifruti climatizado? 🥬🍎 Frutas, verduras e legumes fresquinhos, com sistema de vapor. Toda quarta é Quarta Verde!'
    } },
  { date: '2026-10-16', campaigns: ['dia-alimentacao', 'sexta-suina'], pillar: 'produtos',
    title: 'Da nossa loja para a sua mesa!',
    objective: 'Mostrar a variedade de alimentos disponíveis.',
    sectors: ['hortifruti', 'naturais', 'padaria', 'acougue'],
    idea: 'Transições entre hortifruti, produtos naturais, padaria e açougue.',
    cta: 'Venha conferir a variedade do Super Rede!',
    stories: 'Destaque comercial à Sexta Suína e aos ingredientes de feijoada.',
    script: {
      hook: 'Curiosidade — "Quantos setores cabem numa refeição? Vem ver."',
      development: 'Montagem de uma mesa completa com transições rápidas entre os setores.',
      product: 'Variedade: hortifruti, naturais, padaria e açougue em um só lugar.',
      scenes: 'Transições com movimento de mão/objeto entre setores; plano final de mesa montada.',
      caption: 'Hoje é Dia Mundial da Alimentação! 🌎 Da nossa loja para a sua mesa: hortifruti, naturais, padaria e açougue em um só lugar.'
    } },
  { date: '2026-10-18', campaigns: [], pillar: 'produtos',
    title: 'Domingo sem precisar passar horas na cozinha!',
    objective: 'Estimular a compra de refeições prontas.',
    sectors: ['pronta'],
    idea: 'Mostrar o frango assado e sugestões para o almoço em família.',
    cta: 'Garanta o seu frango assado no Super Rede!',
    stories: 'Frango assado, acompanhamentos e chamada para o almoço.',
    script: {
      hook: 'Desejo — "Olha só o que acabou de sair da nossa cozinha!"',
      development: 'Frango assado saindo, sugestões de acompanhamentos e almoço em família sem trabalho.',
      product: 'Frango assado e acompanhamentos (conforme disponibilidade).',
      scenes: 'Close do frango dourado; apresentadora montando o almoço; família/mesa (com autorização de imagem).',
      caption: 'Domingo é dia de descansar! 🍗 Garanta seu frango assado no Super Rede e aproveite o almoço em família.'
    } },
  { date: '2026-10-20', campaigns: ['terca-quente'], pillar: 'produtos',
    title: 'Você já tomou café da manhã na nossa lanchonete?',
    objective: 'Aumentar o conhecimento e consumo da lanchonete.',
    sectors: ['padaria'],
    idea: 'Café sendo preparado, pães, salgados e atendimento.',
    cta: 'Passe aqui antes de começar seu dia!',
    stories: 'Terça Quente: padaria, laticínios e café da manhã.',
    script: {
      hook: 'Desejo — "Esse barulho do café saindo já acorda qualquer um!"',
      development: 'Rotina da manhã na lanchonete: café sendo preparado, pão com ovo na hora, salgados.',
      product: 'Café, pães, salgados e pão com ovo preparado na hora.',
      scenes: 'Close do café na xícara; chapa com pão com ovo; vitrine de salgados; atendimento sorridente.',
      caption: 'Você já tomou café da manhã na nossa lanchonete? ☕🥚 Café, pão com ovo na hora e salgados. Passe aqui antes de começar seu dia!'
    } },
  { date: '2026-10-22', campaigns: ['quinta-acougue'], pillar: 'ofertas',
    title: 'Qual é a carne ideal para o seu almoço?',
    objective: 'Divulgar variedade e estimular compras.',
    sectors: ['acougue'],
    idea: 'Mostrar diferentes cortes e sugestões de preparo.',
    cta: 'Confira as ofertas da Quinta do Açougue!',
    stories: 'Ofertas reais do açougue e enquete de cortes favoritos.',
    script: {
      hook: 'Relacionamento — "Panela, forno ou grelha? Fala aí qual é o seu almoço."',
      development: 'Apresentadora sugere um corte para cada tipo de preparo, com o açougueiro.',
      product: 'Variedade de cortes bovinos e ofertas da Quinta do Açougue (somente preços reais).',
      scenes: 'Balcão do açougue; açougueiro cortando; close nos cortes; texto na tela com o tipo de preparo.',
      caption: 'Qual é a carne ideal para o seu almoço? 🥩 Hoje é Quinta do Açougue! Confira as ofertas na loja.'
    } },
  { date: '2026-10-24', campaigns: ['fds-maluco'], pillar: 'ofertas',
    title: 'O churrasco do fim de semana começa aqui!',
    objective: 'Estimular compras de carnes e acompanhamentos.',
    sectors: ['acougue', 'bebidas', 'hortifruti', 'mercearia'],
    idea: 'Mostrar cortes, bebidas, hortifruti e produtos para churrasco.',
    cta: 'Passe no Super Rede e garanta tudo para o seu churrasco!',
    stories: 'Fim de Semana Maluco: ofertas de carnes e acompanhamentos.',
    script: {
      hook: 'Economia — "Lista do churrasco completa num lugar só? Bora!"',
      development: 'Apresentadora monta o carrinho do churrasco passando por açougue, hortifruti e bebidas.',
      product: 'Cortes para churrasco, bebidas, carvão/acompanhamentos e hortifruti.',
      scenes: 'Carrinho em movimento; checklist na tela; close dos cortes; geladeira de bebidas.',
      caption: 'O churrasco do fim de semana começa aqui! 🔥 Carnes, bebidas e acompanhamentos no Fim de Semana Maluco.'
    } },
  { date: '2026-10-26', campaigns: ['segunda-show', 'super-sexta'], pillar: 'ofertas',
    title: 'A última sexta-feira do mês está chegando!',
    objective: 'Criar expectativa para a Super Sexta.',
    sectors: ['institucional', 'mercearia'],
    idea: 'Apresentadora anunciando a Super Sexta e incentivando os clientes a acompanharem as novidades.',
    cta: 'Ative as notificações e acompanhe nossas ofertas!',
    stories: 'Segunda Show + início da contagem regressiva da Super Sexta.',
    script: {
      hook: 'Urgência comercial — "Anota aí: sexta-feira, dia 30!"',
      development: 'Anúncio da Super Sexta: a última sexta do mês e a mais barata. Convite para acompanhar o perfil.',
      product: 'Expectativa da campanha (sem antecipar preços não confirmados).',
      scenes: 'Apresentadora na entrada da loja; calendário na tela marcando 30/10; demonstração de como ativar notificações.',
      caption: 'A última sexta-feira do mês está chegando! 📣 Dia 30/10 é SUPER SEXTA no Super Rede Piraquara. Ative as notificações!'
    } },
  { date: '2026-10-28', campaigns: ['quarta-verde', 'super-sexta'], pillar: 'ofertas',
    title: 'Faltam 2 dias para a Super Sexta!',
    objective: 'Intensificar a expectativa.',
    sectors: ['hortifruti', 'institucional'],
    idea: 'Vídeo comercial dinâmico, com apresentadora e imagens da loja.',
    cta: 'Prepare sua lista de compras!',
    stories: 'Quarta Verde + contagem regressiva.',
    script: {
      hook: 'Urgência comercial — "Faltam só 2 dias! Sua lista já está pronta?"',
      development: 'Ritmo acelerado mostrando setores da loja e reforçando a data.',
      product: 'Variedade da loja; prévias somente se autorizadas.',
      scenes: 'Cortes rápidos por setores; contador na tela "2"; apresentadora com lista de compras.',
      caption: 'Faltam 2 dias para a SUPER SEXTA! 🗓️ Prepare sua lista de compras e fique de olho no nosso perfil.'
    } },
  { date: '2026-10-30', campaigns: ['super-sexta'], pillar: 'ofertas',
    title: 'É HOJE! A ÚLTIMA SEXTA DO MÊS E A MAIS BARATA!',
    objective: 'Maximizar visitas e compras.',
    sectors: ['acougue', 'hortifruti', 'padaria', 'mercearia', 'bebidas'],
    idea: 'Apresentadora na loja, produtos, ofertas reais e cenas de movimento.',
    cta: 'Venha aproveitar a Super Sexta no Super Rede Piraquara!',
    stories: 'Cobertura comercial ao longo do dia, destacando preços, setores e oportunidades.',
    confirm: 'Usar somente preços e ofertas reais confirmados. Não inventar descontos, estoques ou preços.',
    script: {
      hook: 'Urgência comercial — "É hoje! E você não vai querer perder!"',
      development: 'Apresentadora percorre a loja mostrando as ofertas reais do dia e o movimento.',
      product: 'Ofertas reais da Super Sexta por setor.',
      scenes: 'Abertura da loja; plaquinhas de oferta; clientes circulando (com autorização); apresentadora no caixa/entrada.',
      caption: 'É HOJE! A última sexta do mês e a mais barata! 🔴🟡 Venha aproveitar a SUPER SEXTA no Super Rede Piraquara. MENOR PREÇO SEMPRE!'
    } },
  { date: '2026-11-01', campaigns: ['novembro-azul'], pillar: 'institucional',
    title: 'Novembro começou! Você conhece tudo que temos aqui?',
    objective: 'Reforçar a variedade de serviços.',
    sectors: ['padaria', 'hortifruti', 'acougue', 'naturais', 'pronta'],
    idea: 'Tour por lanchonete, hortifruti, açougue, naturais e alimentação pronta.',
    cta: 'Venha descobrir tudo que o Super Rede oferece!',
    stories: 'Introdução institucional ao Novembro Azul, sem promessas médicas.',
    script: {
      hook: 'Curiosidade — "Aposto que você não sabia que aqui tem tudo isso!"',
      development: 'Tour rápido mostrando setores e serviços que vão além do supermercado tradicional.',
      product: 'Lanchonete, hortifruti, açougue, produtos naturais e alimentação pronta.',
      scenes: 'Plano-sequência pela loja; letreiro de cada setor na tela; finalização no varandão.',
      caption: 'Novembro começou! 💙 Você conhece tudo que temos aqui? Lanchonete, hortifruti, açougue, naturais e alimentação pronta.'
    } },
  { date: '2026-11-03', campaigns: ['terca-quente'], pillar: 'produtos',
    title: 'O café da manhã que você merece!',
    objective: 'Divulgar padaria e lanchonete.',
    sectors: ['padaria', 'laticinios'],
    idea: 'Pão fresquinho, café, salgados e laticínios.',
    cta: 'Venha começar seu dia com a gente!',
    stories: 'Terça Quente: padaria, laticínios e café da manhã.',
    script: {
      hook: 'Desejo — "Pão saindo agora! Sente o cheiro daqui?"',
      development: 'Do forno à mesa do café: pão, manteiga, queijo, café.',
      product: 'Pães, café, salgados e laticínios.',
      scenes: 'Forno abrindo; pão sendo cortado; café coado; prateleira de laticínios.',
      caption: 'O café da manhã que você merece! ☕🥖 Pão fresquinho, café, salgados e laticínios. Venha começar seu dia com a gente.'
    } },
  { date: '2026-11-05', campaigns: ['quinta-acougue'], pillar: 'ofertas',
    title: 'Do balcão do açougue direto para a sua panela!',
    objective: 'Valorizar variedade e qualidade.',
    sectors: ['acougue'],
    idea: 'Mostrar cortes e produtos do setor.',
    cta: 'Confira as ofertas de hoje!',
    stories: 'Quinta do Açougue: ofertas reais do dia.',
    script: {
      hook: 'Economia — "Você já viu o preço disso aqui?"',
      development: 'Do balcão até a panela: corte escolhido, preparo sugerido.',
      product: 'Cortes e produtos do açougue (somente ofertas reais).',
      scenes: 'Balcão; açougueiro embalando; transição para panela/prato pronto.',
      caption: 'Do balcão do açougue direto para a sua panela! 🥩 Hoje é Quinta do Açougue. Confira as ofertas.'
    } },
  { date: '2026-11-07', campaigns: ['fds-maluco'], pillar: 'ofertas',
    title: 'Tudo que você precisa para o churrasco em um só lugar!',
    objective: 'Aumentar o fluxo de compras no fim de semana.',
    sectors: ['acougue', 'hortifruti', 'bebidas', 'mercearia'],
    idea: 'Açougue, hortifruti, bebidas e acompanhamentos.',
    cta: 'Venha aproveitar as ofertas!',
    stories: 'Fim de Semana Maluco: carnes, hortifruti e bebidas.',
    script: {
      hook: 'Relacionamento — "Quem é de Piraquara sabe: churrasco de sábado é sagrado!"',
      development: 'Checklist do churrasco resolvido num só lugar.',
      product: 'Carnes, hortifruti, bebidas e acompanhamentos.',
      scenes: 'Checklist animado na tela; setores em sequência; fechamento com carrinho cheio.',
      caption: 'Tudo que você precisa para o churrasco em um só lugar! 🔥 Fim de Semana Maluco no Super Rede Piraquara.'
    } },
  { date: '2026-11-09', campaigns: ['segunda-show'], pillar: 'ofertas',
    title: 'A semana começa com economia de verdade!',
    objective: 'Estimular o abastecimento semanal.',
    sectors: ['mercearia', 'laticinios', 'acougue', 'hortifruti'],
    idea: 'Tour comercial com ofertas de diferentes setores.',
    cta: 'Prepare sua lista e venha para o Super Rede!',
    stories: 'Segunda Show: ofertas gerais e lista de compras da semana.',
    script: {
      hook: 'Economia — "Abastecer a casa gastando menos? É Segunda Show!"',
      development: 'Tour comercial pelos setores com ofertas reais da semana.',
      product: 'Ofertas de mercearia, limpeza, laticínios, açougue e hortifruti.',
      scenes: 'Corredores com placas de oferta; apresentadora riscando a lista; carrinho enchendo.',
      caption: 'A semana começa com economia de verdade! 🛒 Segunda Show no Super Rede. MENOR PREÇO SEMPRE!'
    } }
];

/* ---------------------------------------------------------
   Dias somente com Stories — 16 dias
   --------------------------------------------------------- */
const STORIES_ONLY_SEED = [
  { date: '2026-10-11', campaigns: ['fds-maluco'], pillar: 'relacionamento', title: 'Domingo em família',
    sectors: ['pronta', 'acougue', 'hortifruti'],
    idea: 'Mostrar frango assado, acompanhamentos, compras para o feriado e ofertas do Fim de Semana Maluco.',
    interaction: 'Já garantiu o almoço de domingo?' },
  { date: '2026-10-13', campaigns: ['terca-quente'], pillar: 'ofertas', title: 'Terça Quente — padaria e café da manhã',
    sectors: ['padaria', 'laticinios'],
    idea: 'Mostrar padaria, pães, café da manhã, laticínios e ofertas.',
    interaction: 'Você prefere pão com manteiga ou pão com ovo?' },
  { date: '2026-10-15', campaigns: ['dia-professores', 'quinta-acougue'], pillar: 'ofertas', title: 'Dia dos Professores + Quinta do Açougue',
    sectors: ['institucional', 'acougue'],
    idea: 'Publicar homenagem aos professores e sequência comercial com ofertas do açougue.' },
  { date: '2026-10-17', campaigns: ['fds-maluco'], pillar: 'ofertas', title: 'Fim de Semana Maluco',
    sectors: ['acougue', 'hortifruti', 'bebidas'],
    idea: 'Mostrar carnes, hortifruti, bebidas, churrasco e ofertas.' },
  { date: '2026-10-19', campaigns: ['segunda-show'], pillar: 'ofertas', title: 'Segunda Show — lista da semana',
    sectors: ['mercearia', 'laticinios'],
    idea: 'Mostrar ofertas gerais e interação sobre a lista de compras da semana.',
    interaction: 'O que não pode faltar na sua lista desta semana?' },
  { date: '2026-10-21', campaigns: ['quarta-verde'], pillar: 'ofertas', title: 'Quarta Verde',
    sectors: ['hortifruti'],
    idea: 'Mostrar hortifruti, frutas, verduras, salada de frutas e ofertas.' },
  { date: '2026-10-23', campaigns: ['sexta-suina'], pillar: 'ofertas', title: 'Sexta Suína + noite no Super Rede',
    sectors: ['acougue', 'pizzaria', 'bebidas', 'pronta'],
    idea: 'Mostrar produtos para feijoada e ofertas. No final do dia, divulgar pizzaria, chopp, churrasquinho e programação do varandão, quando confirmada.',
    confirm: 'Programação do varandão / música ao vivo somente quando confirmada.' },
  { date: '2026-10-25', campaigns: ['fds-maluco'], pillar: 'produtos', title: 'Domingo — frango assado',
    sectors: ['pronta'],
    idea: 'Mostrar frango assado, acompanhamentos e ofertas do fim de semana.' },
  { date: '2026-10-27', campaigns: ['terca-quente', 'super-sexta'], pillar: 'ofertas', title: 'Faltam 3 dias para a Super Sexta!',
    sectors: ['padaria', 'laticinios'],
    idea: 'Mensagem "Faltam 3 dias!". Mostrar produtos da padaria, laticínios e contagem regressiva.' },
  { date: '2026-10-29', campaigns: ['quinta-acougue', 'super-sexta'], pillar: 'ofertas', title: 'É amanhã! Super Sexta',
    sectors: ['acougue', 'institucional'],
    idea: 'Mensagem "É amanhã!". Usar contagem regressiva, lembretes e prévias autorizadas.',
    confirm: 'Somente prévias de ofertas autorizadas pela loja.' },
  { date: '2026-10-31', campaigns: ['halloween', 'fds-maluco'], pillar: 'relacionamento', title: 'Halloween + Fim de Semana Maluco',
    sectors: ['mercearia', 'acougue', 'hortifruti'],
    idea: 'Mostrar doces, chocolates, guloseimas e ofertas do fim de semana.',
    interaction: 'Doces ou travessuras?' },
  { date: '2026-11-02', campaigns: ['finados', 'segunda-show'], pillar: 'institucional', title: 'Finados + Segunda Show',
    sectors: ['institucional', 'mercearia'],
    idea: 'Mostrar compras de conveniência e ofertas, respeitando o contexto da data. Publicar horário de funcionamento somente após confirmação.',
    confirm: 'Horário de funcionamento em 02/11 somente após confirmação.' },
  { date: '2026-11-04', campaigns: ['quarta-verde'], pillar: 'ofertas', title: 'Quarta Verde — sucos e frescor',
    sectors: ['hortifruti'],
    idea: 'Mostrar hortifruti, sucos naturais, frutas e verduras.' },
  { date: '2026-11-06', campaigns: ['sexta-suina'], pillar: 'ofertas', title: 'Sexta Suína + pizzaria, chopp e churrasquinho',
    sectors: ['acougue', 'pizzaria', 'bebidas', 'pronta'],
    idea: 'Mostrar produtos para feijoada, ofertas, pizzaria, chopp e churrasquinho.' },
  { date: '2026-11-08', campaigns: [], pillar: 'produtos', title: 'Compras de domingo',
    sectors: ['pronta', 'mercearia'],
    idea: 'Mostrar frango assado, acompanhamentos e compras de domingo.' },
  { date: '2026-11-10', campaigns: ['terca-quente'], pillar: 'relacionamento', title: 'Terça Quente — café da manhã',
    sectors: ['padaria', 'laticinios'],
    idea: 'Mostrar lanchonete, padaria, café da manhã e laticínios.',
    interaction: 'Qual é seu café da manhã favorito?' }
];

/* Conteúdos institucionais de Outubro Rosa (datas sugeridas, ajustáveis) */
const EXTRA_SEED = [
  { id: 'outubro-rosa-1', date: '2026-10-19', format: 'Stories', campaigns: ['outubro-rosa'], pillar: 'institucional',
    title: 'Outubro Rosa — conteúdo institucional 1',
    objective: 'Conscientização e relacionamento, com informação responsável.',
    sectors: ['institucional'],
    idea: 'Mensagem de incentivo ao cuidado com a saúde e à busca por informação em fontes oficiais.',
    cta: 'Cuide-se e procure orientação profissional.',
    confirm: 'Não vincular descontos a alegações de prevenção de doenças. Data sugerida — ajustar na aprovação.' },
  { id: 'outubro-rosa-2', date: '2026-10-25', format: 'Stories', campaigns: ['outubro-rosa'], pillar: 'institucional',
    title: 'Outubro Rosa — conteúdo institucional 2',
    objective: 'Conscientização e relacionamento, com informação responsável.',
    sectors: ['institucional'],
    idea: 'Homenagem às clientes e colaboradoras com reforço da importância dos exames de rotina, sem promessas médicas.',
    cta: 'Compartilhe com quem você ama.',
    confirm: 'Não vincular descontos a alegações de prevenção de doenças. Data sugerida — ajustar na aprovação.' }
];

const REELS_CHECKLIST = ['Roteiro revisado', 'Gravação agendada', 'Imagens reais da loja captadas', 'Edição dinâmica com legendas legíveis', 'Preços e ofertas conferidos (somente reais)', 'Aprovação da direção', 'Legenda e CTA finalizados', 'Publicação agendada'];
const STORIES_CHECKLIST = ['Ofertas do dia confirmadas', 'Bloco Manhã (7h–9h)', 'Bloco Ofertas (9h–11h)', 'Bloco Almoço (11h–13h)', 'Bloco Descoberta (13h–15h)', 'Bloco Interação (15h–17h)', 'Bloco Fim de tarde (17h–19h)', 'Interação/enquete publicada'];

function emptyMetrics() {
  const m = {};
  METRIC_FIELDS.forEach(f => { m[f.id] = null; });
  return m;
}

function campaignFocus(ids) {
  return ids.map(id => CAMPAIGNS.find(c => c.id === id)).filter(Boolean).map(c => c.name).join(' + ');
}

function buildSeed() {
  const items = [];
  const base = (o) => Object.assign({
    status: 'planejado', owner: '', recordDate: '', approvalDate: '', publishedDate: '', link: '', notes: '',
    confirm: '', interaction: '', stories: '', sentForApproval: false, storiesPublished: null,
    metrics: emptyMetrics(),
    script: { hook: '', development: '', product: '', scenes: '', caption: '' }
  }, o);

  REELS_SEED.forEach(r => {
    items.push(base(Object.assign({}, r, {
      id: r.date + '-reels', format: 'Reels',
      checklist: REELS_CHECKLIST.map(t => ({ t, done: false }))
    })));
    // Stories acompanham os dias de Reels
    items.push(base({
      id: r.date + '-stories', date: r.date, format: 'Stories', campaigns: r.campaigns.slice(), pillar: r.pillar,
      title: 'Stories do dia — ' + (campaignFocus(r.campaigns) || 'Rotina da loja'),
      objective: 'Manter presença diária e apoiar o Reels do dia.',
      sectors: r.sectors.slice(),
      idea: r.stories || 'Distribuir os Stories nos 6 blocos do dia, reforçando o Reels publicado.',
      cta: 'Passe no Super Rede Piraquara!',
      confirm: r.confirm || '',
      checklist: STORIES_CHECKLIST.map(t => ({ t, done: false }))
    }));
  });

  STORIES_ONLY_SEED.forEach(s => {
    items.push(base(Object.assign({}, s, {
      id: s.date + '-stories', format: 'Stories',
      objective: s.objective || 'Presença diária, ofertas e interação com os clientes.',
      cta: s.cta || 'Passe no Super Rede Piraquara!',
      checklist: STORIES_CHECKLIST.map(t => ({ t, done: false }))
    })));
  });

  EXTRA_SEED.forEach(e => {
    items.push(base(Object.assign({}, e, {
      checklist: ['Texto revisado (informação responsável)', 'Arte aprovada', 'Publicado'].map(t => ({ t, done: false }))
    })));
  });

  items.sort((a, b) => a.date.localeCompare(b.date) || (a.format === 'Reels' ? -1 : 1));
  return {
    version: 1,
    updatedAt: null,
    items,
    account: { followersStart: null, followersStartDate: '', snapshots: [] }
  };
}
