/* Textos dos carrosséis — Dra. Lívia Serpa, no estilo dos posts dela.
 * Marcação: **negrito**, *itálico*, _sublinhado_ (pode combinar: *_assim_*).
 * Tipos de lâmina: cover (abertura), text (parágrafos), list (pergunta + itens numerados),
 * step (número grande + parágrafo), end (caixa bege + nota em itálico).
 * Qualquer lâmina aceita photo: 'fotos/arquivo.jpg' para usar uma foto real como fundo. */
module.exports = [
  {
    slug: '01-mitos-tecnologias',
    title: '4 mitos sobre tecnologias na estética',
    caption: `Tem frase que a gente escuta tanto que parece verdade.

“Quanto mais moderno, melhor.” “Se está em alta, eu preciso ter.” “Já vi a demonstração, sei fazer.”

Eu amo estudar tecnologias. E é justamente por isso que acredito que entusiasmo e análise precisam caminhar juntos.

Qual desses mitos você já ouviu por aí? Me conta nos comentários e salve para revisar antes da próxima decisão de compra. 🤍`,
    slides: [
      { type: 'cover', paras: ['Tem **mitos** sobre *tecnologias* que custam caro na hora de _investir_.'] },
      { type: 'text', paras: ['**Mito 1:** *“Quanto mais moderno, melhor o investimento.”*', 'Na prática, um equipamento só é um bom **investimento** quando faz sentido para as _demandas reais_ da sua prática.'] },
      { type: 'text', paras: ['**Mito 2:** *“Se está em alta, eu preciso ter.”*', 'Uma *tendência* de mercado não é, por si só, **indicação de investimento**. _Entusiasmo_ e _análise_ precisam caminhar juntos.'] },
      { type: 'text', paras: ['**Mito 3:** *“Assisti à demonstração, então sei fazer.”*', '*Ver* ajuda a entender etapas. **Competência** exige fundamentos, critérios, segurança e, quando necessário, _prática supervisionada_.'] },
      { type: 'text', paras: ['**Mito 4:** *“Combinar tecnologias sempre potencializa.”*', '*Combinar* não é somar recursos. A associação precisa de **justificativa**, e às vezes a melhor decisão é _não combinar_.'] },
      { type: 'end', paras: ['Eu sou **apaixonada** por estudar *tecnologias*. Por isso acredito que _entusiasmo_ e _análise_ precisam caminhar juntos.'], note: 'Qual desses mitos você já ouviu? Me conta nos comentários.' }
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
      { type: 'cover', paras: ['Seguir um **protocolo** é diferente de *saber* _decidir_.'] },
      { type: 'text', paras: ['O **protocolo** responde *_como_* fazer.', 'Ele tem seu *lugar*: organiza etapas e dá **segurança** a quem está aprendendo.'] },
      { type: 'text', paras: ['O **raciocínio clínico** responde *_por que_* fazer.', 'É o que permite *avaliar* situações que não são idênticas e escolher um caminho com **critério**.'] },
      { type: 'list', paras: ['Antes de *indicar*, eu me **pergunto**:'], items: ['O que _motivou_ essa procura?', 'Quais são as **necessidades reais** do caso?', 'Existe *indicação*? Quais são os **limites** e os **riscos**?', 'Essa conduta está dentro da minha _habilitação_?'] },
      { type: 'text', paras: ['*Desejo* não é **indicação**.', 'Saber _escutar_ a demanda sem transformar a preferência inicial em **decisão clínica**.'] },
      { type: 'end', paras: ['Desenvolver esse **raciocínio** é aprender a integrar *conhecimentos* para _decidir_ com mais clareza.'], note: 'Essa é uma das construções da Mentoria RCE®.' }
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
      { type: 'cover', paras: ['Pare de **colecionar** cursos. *Monte um* _plano de estudos_.'] },
      { type: 'step', num: '1', paras: ['**Comece pela sua prática.**', 'Liste as _demandas_ que aparecem com frequência no seu atendimento. Elas mostram o que vale *aprofundar* primeiro.'] },
      { type: 'step', num: '2', paras: ['**Confirme sua habilitação.**', 'Antes de escolher uma *tecnologia*, verifique o que a sua _profissão_ permite realizar.'] },
      { type: 'step', num: '3', paras: ['**Aprofunde um tema por vez.**', '_Fundamentos_, indicações, contraindicações e *riscos* antes de partir para o próximo recurso.'] },
      { type: 'step', num: '4', paras: ['**Escolha boas referências.**', 'Formações com espaço para *dúvidas* e, quando possível, a chance de acompanhar a _prática_ de profissionais experientes.'] },
      { type: 'step', num: '5', paras: ['**Revise e atualize.**', 'Tecnologia muda. Reserve tempo para a _atualização contínua_ do que você já usa.'] },
      { type: 'end', paras: ['Carreira não é uma *corrida* para colecionar técnicas. É **construção**.'], note: 'Salve este plano e comece pelo passo 1.' }
    ]
  }
];
