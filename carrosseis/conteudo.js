/* Textos dos carrosséis — Dra. Lívia Serpa.
 * Layout editorial (colagem), com a identidade da Lívia: azul-marinho, rosé, rosé-dourado e mármore.
 * Marcação: **negrito**, *itálico* (no título vira destaque rosé-dourado), _sublinhado_.
 * Qualquer cover ou end com photo: 'fotos/arquivo.jpg' vira lâmina com a foto inteira e o texto na base.
 * Tipos de lâmina:
 *   cover  { kicker, kicker2, title }               abertura escura com faixas curvas
 *   card   { num, title, body: [..], dark? }         card de borda ondulada com clipe
 *   caps   { num, title, lead, body }                título gigante em caixa alta, fundo claro
 *   faixa  { num, title, body: [..], word }          faixa de mármore à esquerda com a palavra na vertical
 *   end    { kicker, title, sub }                    fechamento escuro
 *   foto   { photo, kicker, title, sub }             foto inteira na lâmina, texto na base */
module.exports = [
  {
    slug: '01-mitos-tecnologias',
    title: '4 mitos sobre tecnologias na estética',
    caption: `Tem frase que a gente escuta tanto que parece verdade.

“Quanto mais moderno, melhor.” “Se está em alta, eu preciso ter.” “Já vi a demonstração, sei fazer.”

Eu amo estudar tecnologias. E é justamente por isso que acredito que entusiasmo e análise precisam caminhar juntos.

Qual desses mitos você já ouviu por aí? Me conta nos comentários e salve para revisar antes da próxima decisão de compra. 🤍`,
    slides: [
      { type: 'cover', photo: 'fotos/livia-equipamentos.jpg', kicker: 'Antes de investir em uma tecnologia', title: '4 *mitos* que custam caro.' },
      { type: 'card', num: '01', title: 'quanto mais moderno, melhor', body: ['Um equipamento não se torna um bom investimento simplesmente por ser moderno.', 'Ele precisa fazer sentido para as **demandas reais** da sua prática.'] },
      { type: 'caps', num: '02', title: 'Tendência não é indicação', lead: 'Se está em alta, eu preciso ter?', body: 'Uma tecnologia em evidência nas redes não é, por si só, indicação de investimento. Entusiasmo e análise precisam caminhar juntos.' },
      { type: 'foto', photo: 'fotos/equipamento-ponteira.jpg', kicker: 'Mito 03', title: 'Ver não é *dominar.*', sub: 'Competência exige fundamentos, critérios, segurança e, quando necessário, prática supervisionada.' },
      { type: 'card', dark: true, num: '04', title: 'combinar não é somar', body: ['Combinar tecnologias não significa simplesmente utilizar mais recursos.', 'A associação precisa de **justificativa**. Às vezes, a melhor decisão é não combinar.'] },
      { type: 'end', kicker: 'Me conta nos comentários', title: 'Qual desses mitos *você já ouviu?*', sub: 'Salve este post para revisar antes da próxima decisão de compra.' }
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
      { type: 'cover', photo: 'fotos/livia-jaleco-ponteira.jpg', kicker: 'Protocolo ou raciocínio clínico?', title: 'Seguir não é *decidir.*' },
      { type: 'card', num: '01', title: 'o protocolo tem seu lugar', body: ['Ele organiza etapas e dá segurança a quem está aprendendo.', 'Mas ele responde ao **como**. A prática também exige entender o **porquê**.'] },
      { type: 'caps', num: '02', title: 'Critério antes da conduta', lead: 'Situações clínicas não são idênticas.', body: 'Raciocínio clínico é o que permite avaliar cada caso e escolher um caminho com critério, e não por repetição.' },
      { type: 'faixa', num: '03', title: 'antes de indicar, eu me pergunto', word: 'avaliação', body: ['O que motivou essa procura?', 'Quais são as necessidades reais do caso?', 'Existe indicação? Quais os limites e os riscos?', '**Isso está dentro da minha habilitação?**'] },
      { type: 'card', dark: true, num: '04', title: 'desejo não é indicação', body: ['Saber escutar a demanda sem transformar a preferência inicial em **decisão clínica**.', 'É uma das habilidades que eu mais valorizo.'] },
      { type: 'end', kicker: 'Mentoria RCE®', title: 'Essa é uma das construções da *Mentoria RCE®*.', sub: 'Você pergunta mais “como” ou “por quê”? Me conta aqui embaixo.' }
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
      { type: 'cover', kicker: 'Não colecione\ncursos.', kicker2: '5 passos para\ncomeçar.', title: 'Monte um *plano de estudos.*' },
      { type: 'card', num: '01', title: 'comece pela sua prática', body: ['Liste as demandas que aparecem com frequência no seu atendimento.', 'Elas mostram o que vale **aprofundar primeiro**.'] },
      { type: 'caps', num: '02', title: 'Confirme sua habilitação', lead: 'Antes da tecnologia, a sua profissão.', body: 'Verifique o que a sua habilitação permite realizar antes de escolher o que estudar.' },
      { type: 'faixa', num: '03', title: 'um tema por vez', word: 'profundidade', body: ['Fundamentos, indicações, contraindicações e riscos', '**antes de partir para o próximo recurso.**'] },
      { type: 'foto', photo: 'fotos/equipamento-tela.jpg', kicker: 'Passo 04', title: 'Escolha boas *referências.*', sub: 'Formações com espaço para dúvidas e, quando possível, a chance de acompanhar a prática.' },
      { type: 'caps', num: '05', title: 'Revise e atualize', lead: 'Tecnologia muda.', body: 'Reserve tempo para a atualização contínua do que você já usa.' },
      { type: 'end', kicker: 'Salve este plano', title: 'Carreira não é corrida. *É construção.*', sub: 'Comece pelo passo 01. Qual tecnologia está no topo da sua lista?' }
    ]
  }
];
