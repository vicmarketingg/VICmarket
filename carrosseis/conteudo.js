/* Textos dos carrosséis — Dra. Lívia Serpa.
 * Cada carrossel tem um formato próprio, para não parecerem o mesmo post:
 *   1. Mito × verdade   cover · mito / verdade (alternados) · resumo
 *   2. Comparativo      cover · versus · checklist · destaque · end
 *   3. Trilha           trilha-capa · passo (com a trilha atravessando as lâminas) · chegada
 * Marcação: **negrito**, *itálico* (vira destaque rosé-dourado), _sublinhado_.
 * Tipos de lâmina:
 *   cover / foto { photo, kicker, title, sub? }       foto inteira, texto na base
 *   mito         { num, quote }                       frase do mito riscada
 *   verdade      { num, title, sub }                  resposta “na prática”, fundo escuro
 *   resumo       { title, items: [..], cta }          lista dos mitos riscados
 *   versus       { topic, left, right }               Protocolo × Raciocínio clínico, lado a lado
 *   checklist    { kicker, title, items: [..] }       folha com caixinhas marcadas
 *   destaque     { title, sub }                       frase grande sobre mármore
 *   end          { kicker, title, sub }               fechamento escuro
 *   trilha-capa  { kicker, title, steps: [..] }       capa com o mapa dos passos
 *   passo        { num, title, body, photo? }         passo N de 5, trilha contínua
 *   chegada      { kicker, title, sub }               fim da trilha */
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
      { type: 'mito', num: '01', quote: 'Quanto mais moderno, melhor o investimento.' },
      { type: 'verdade', num: '01', title: 'Moderno não é *sinônimo* de bom investimento.', sub: 'Um equipamento precisa fazer sentido para as demandas reais da sua prática.' },
      { type: 'mito', num: '02', quote: 'Se está em alta, eu preciso ter.' },
      { type: 'verdade', num: '02', title: 'Tendência não é *indicação.*', sub: 'Uma tecnologia em evidência nas redes não é, por si só, indicação de investimento. Entusiasmo e análise precisam caminhar juntos.' },
      { type: 'mito', num: '03', quote: 'Assisti à demonstração, então sei fazer.' },
      { type: 'foto', photo: 'fotos/equipamento-ponteira.jpg', kicker: 'Na prática · Mito 03', title: 'Ver não é *dominar.*', sub: 'Competência exige fundamentos, critérios, segurança e, quando necessário, prática supervisionada.' },
      { type: 'mito', num: '04', quote: 'Combinar tecnologias sempre potencializa.' },
      { type: 'verdade', num: '04', title: 'Combinar não é *somar.*', sub: 'A associação precisa de justificativa. Às vezes, a melhor decisão é não combinar.' },
      { type: 'resumo', title: 'Qual desses mitos *você já ouviu?*', items: ['Quanto mais moderno, melhor.', 'Se está em alta, eu preciso ter.', 'Vi a demonstração, sei fazer.', 'Combinar sempre potencializa.'], cta: 'Me conta nos comentários' }
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
      { type: 'versus', topic: 'O que responde', left: '*Como* fazer.', right: '*Por que* fazer.' },
      { type: 'versus', topic: 'Para que serve', left: 'Organiza etapas e dá segurança.', right: 'Avalia cada caso com *critério.*' },
      { type: 'versus', topic: 'Ponto de partida', left: 'A sequência de execução.', right: 'As necessidades *reais* do caso.' },
      { type: 'checklist', kicker: 'Antes de indicar', title: 'As 4 perguntas que eu faço:', items: ['O que motivou essa procura?', 'Quais são as necessidades reais do caso?', 'Existe indicação? Quais os limites e os riscos?', 'Isso está dentro da minha habilitação?'] },
      { type: 'destaque', title: 'Desejo não é *indicação.*', sub: 'Saber escutar a demanda sem transformar a preferência inicial em decisão clínica.' },
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
      { type: 'trilha-capa', kicker: 'Não colecione cursos', title: 'Monte um *plano de estudos.*', steps: ['Comece pela sua prática', 'Confirme sua habilitação', 'Um tema por vez', 'Escolha boas referências', 'Revise e atualize'] },
      { type: 'passo', num: '1', title: 'Comece pela sua *prática.*', body: 'Liste as demandas que aparecem com frequência no seu atendimento. Elas mostram o que vale aprofundar primeiro.' },
      { type: 'passo', num: '2', title: 'Confirme sua *habilitação.*', body: 'Antes de escolher uma tecnologia, verifique o que a sua profissão permite realizar.' },
      { type: 'passo', num: '3', title: 'Um tema *por vez.*', body: 'Fundamentos, indicações, contraindicações e riscos antes de partir para o próximo recurso.' },
      { type: 'passo', num: '4', photo: 'fotos/equipamento-tela.jpg', title: 'Escolha boas *referências.*', body: 'Formações com espaço para dúvidas e, quando possível, a chance de acompanhar a prática.' },
      { type: 'passo', num: '5', title: 'Revise e *atualize.*', body: 'Tecnologia muda. Reserve tempo para a atualização contínua do que você já usa.' },
      { type: 'chegada', kicker: 'Salve este plano', title: 'Carreira não é corrida. *É construção.*', sub: 'Comece pelo passo 1. Qual tecnologia está no topo da sua lista?' }
    ]
  }
];
