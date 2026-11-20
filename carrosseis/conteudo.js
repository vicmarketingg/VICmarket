/* Textos dos carrosséis — Dra. Lívia Serpa.
 * Cada carrossel tem um formato próprio, para não parecerem o mesmo post:
 *   1. Mito × verdade   cover · mito / verdade (alternados) · resumo
 *   2. Comparativo      cover · versus · checklist · destaque · end
 *   3. Calendário       calendario-capa · folha (folhas de calendário de mesa) · foto · virada
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
 *   calendario-capa { kicker, title }                 folhas “1º de janeiro” riscado e “hoje” circulado
 *   folha        { label, title, body | items | hoje, dark? }  folha de calendário com argolas rose-gold
 *   virada       { date, kicker, title, sub }         data riscada e pergunta final */
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
    slug: '03-nao-espere-o-ano-virar',
    title: 'Você não precisa esperar o ano virar',
    caption: `Todo fim de ano a gente faz a mesma lista: “ano que vem eu estudo mais”, “ano que vem eu me organizo”, “ano que vem eu invisto na minha carreira”.

Mas a virada do ano é só uma data. As decisões que mudam uma trajetória acontecem em dias comuns, quando a gente decide parar de adiar.

Não precisa ser uma grande mudança. Pode ser escolher uma formação, reorganizar seus estudos ou buscar acompanhamento para amadurecer sua prática.

Janeiro vai chegar de qualquer jeito. Como você quer chegar nele?

Me conta nos comentários qual decisão você não vai mais adiar. 🤍`,
    slides: [
      { type: 'calendario-capa', kicker: 'Fim de ano', title: 'Você não precisa esperar o ano *virar.*' },
      { type: 'folha', label: 'Todo fim de ano', title: 'A lista do *“ano que vem eu…”*', body: 'Estudar mais. Me organizar. Investir na carreira. Todo dezembro, a gente deixa as decisões para quando janeiro chegar.' },
      { type: 'folha', dark: true, label: 'A verdade', title: 'A virada do ano é só uma *data.*', body: 'As decisões que mudam uma carreira acontecem em dias comuns, quando você decide parar de adiar.' },
      { type: 'folha', label: 'Pergunta honesta', title: 'O que você está *adiando?*', items: ['Aquela formação que sempre fica para depois.', 'Estudar a fundo a tecnologia que você já usa.', 'Organizar seus estudos com um plano.', 'Buscar acompanhamento para amadurecer sua prática.'] },
      { type: 'foto', photo: 'fotos/equipamento-tela.jpg', kicker: 'Decidir', title: 'Não é fazer tudo *de uma vez.*', sub: 'É dar o primeiro passo com clareza: entender o que a sua prática pede e o que você precisa aprender.' },
      { type: 'folha', dark: true, label: 'Comece', hoje: true, title: 'A melhor data para decidir é esta:', body: 'Não precisa ser uma grande mudança. Uma decisão tomada hoje já muda a forma como você chega em janeiro.' },
      { type: 'virada', date: '31.12', kicker: 'A decisão é sua', title: 'Janeiro vai chegar de qualquer jeito. *Como você quer chegar nele?*', sub: 'Me conta nos comentários qual decisão você não vai mais adiar.' }
    ]
  }
];
