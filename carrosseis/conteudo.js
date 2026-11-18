/* Textos dos carrosséis — Dra. Lívia Serpa.
 * Tipos de lâmina: cover, myth, statement, list, step, end.
 * Use *texto* para itálico rosé nos títulos. */
module.exports = [
  {
    slug: '01-mitos-tecnologias',
    title: '4 mitos sobre tecnologias na estética',
    caption: `Tem frase que a gente escuta tanto que parece verdade.

“Quanto mais moderno, melhor.” “Se está em alta, eu preciso ter.” “Já vi a demonstração, sei fazer.”

Eu amo estudar tecnologias. E é justamente por isso que acredito que entusiasmo e análise precisam caminhar juntos.

Qual desses mitos você já ouviu por aí? Me conta nos comentários e salve para revisar antes da próxima decisão de compra. 🤍`,
    slides: [
      { type: 'cover', eyebrow: 'Tecnologias na estética', title: '4 mitos que custam caro *na hora de investir*' },
      { type: 'myth', label: 'Mito 1', quote: 'Quanto mais moderno, melhor o investimento.', truth: 'Um equipamento só é um bom investimento quando faz sentido para as demandas reais da sua prática.' },
      { type: 'myth', label: 'Mito 2', quote: 'Se está em alta, eu preciso ter.', truth: 'Tendência de mercado não é, por si só, indicação de investimento. Entusiasmo e análise precisam caminhar juntos.' },
      { type: 'myth', label: 'Mito 3', quote: 'Assisti à demonstração, então sei fazer.', truth: 'Ver ajuda a entender etapas. Competência exige fundamentos, critérios, segurança e, quando necessário, prática supervisionada.' },
      { type: 'myth', label: 'Mito 4', quote: 'Combinar tecnologias sempre potencializa.', truth: 'Combinar não é somar recursos. A associação precisa de justificativa, e às vezes a melhor decisão é não combinar.' },
      { type: 'end', title: 'Qual desses mitos *você já ouviu?*', body: 'Conta nos comentários e salve para revisar antes da próxima decisão de compra.', cta: 'Salve este post' }
    ]
  },
  {
    slug: '02-protocolo-ou-raciocinio',
    title: 'Protocolo ou raciocínio clínico?',
    caption: `Protocolo responde “como fazer”. Raciocínio clínico responde “por que fazer”.

Os dois têm seu lugar. Mas a prática profissional exige avaliar situações que nunca são idênticas.

Desejo por uma tecnologia não é, automaticamente, indicação para ela. Saber escutar a demanda sem transformar a preferência inicial em decisão clínica é uma das habilidades que mais valorizo.

É esse olhar que guia a Mentoria RCE® — Raciocínio Clínico Estratégico.

Você costuma perguntar mais sobre o “como” ou sobre o “porquê”? Me conta aqui embaixo.`,
    slides: [
      { type: 'cover', eyebrow: 'Raciocínio clínico', title: 'Seguir um protocolo é diferente de *saber decidir*' },
      { type: 'statement', kicker: 'Protocolo', title: 'Responde *como* fazer.', body: 'Ele tem seu lugar: organiza etapas e dá segurança a quem está aprendendo.' },
      { type: 'statement', kicker: 'Raciocínio clínico', title: 'Responde *por que* fazer.', body: 'É o que permite avaliar situações que não são idênticas e escolher um caminho com critério.' },
      { type: 'list', title: '4 perguntas que *mudam uma avaliação*', items: ['O que motivou essa procura?', 'Quais são as necessidades reais do caso?', 'Existe indicação? Quais são os limites e os riscos?', 'Essa conduta está dentro da minha habilitação?'] },
      { type: 'statement', kicker: 'Lembre sempre', title: 'Desejo *não é* indicação.', body: 'Escutar a demanda sem transformar a preferência inicial em decisão clínica.' },
      { type: 'end', title: 'É esse olhar que guia a *Mentoria RCE®*', body: 'Raciocínio Clínico Estratégico: integrar conhecimentos para decidir com mais clareza.', cta: 'Você pergunta mais “como” ou “por quê”?' }
    ]
  },
  {
    slug: '03-plano-de-estudos',
    title: 'Como montar seu plano de estudos em tecnologias',
    caption: `Se eu pudesse dar um conselho para quem quer estudar tecnologias, seria este: não colecione cursos. Monte um plano.

Comece pelas demandas reais da sua prática, confirme o que a sua habilitação permite, aprofunde um tema por vez e escolha boas referências.

Carreira não é corrida para colecionar técnicas. É construção.

Salve este plano e comece pelo passo 1. Qual tecnologia está no topo da sua lista de estudos?`,
    slides: [
      { type: 'cover', eyebrow: 'Formação em estética', title: 'Pare de colecionar cursos. *Monte um plano de estudos.*' },
      { type: 'step', num: '1', title: 'Comece pela sua prática', body: 'Liste as demandas que aparecem com frequência no seu atendimento. Elas mostram o que vale aprofundar primeiro.' },
      { type: 'step', num: '2', title: 'Confirme sua habilitação', body: 'Antes de escolher uma tecnologia, verifique o que a sua profissão permite realizar.' },
      { type: 'step', num: '3', title: 'Aprofunde um tema por vez', body: 'Fundamentos, indicações, contraindicações e riscos antes de partir para o próximo recurso.' },
      { type: 'step', num: '4', title: 'Escolha boas referências', body: 'Formações com espaço para dúvidas e, quando possível, a chance de acompanhar a prática de profissionais experientes.' },
      { type: 'step', num: '5', title: 'Revise e atualize', body: 'Tecnologia muda. Reserve tempo para a atualização contínua do que você já usa.' },
      { type: 'end', title: 'Carreira não é corrida. *É construção.*', body: 'Salve este plano e comece pelo passo 1.', cta: 'Qual tecnologia está no topo da sua lista?' }
    ]
  }
];
