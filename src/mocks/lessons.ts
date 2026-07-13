import type { Lesson } from "@/types";
import { XP_RULES } from "@/config/app";

/**
 * Aulas da trilha. O videoUrl aponta para um player demonstrativo:
 * não há vídeo hospedado nesta demo.
 */
export const MOCK_LESSONS: Lesson[] = [
  {
    id: "l-prato-equilibrado",
    title: "Como montar um prato equilibrado",
    description:
      "O método visual que dispensa balança: metade do prato em vegetais, um quarto em proteína, um quarto em carboidrato de qualidade.",
    thumbnail: "/images/lessons/prato-equilibrado.jpg",
    videoUrl: "demo://lesson/prato-equilibrado",
    durationMinutes: 12,
    category: "Nutrição",
    xpReward: XP_RULES.completeLesson,
    completed: true,
    progress: 100,
    chapters: [
      {
        title: "A regra do prato dividido",
        content:
          "Divida o prato em três partes. Metade vai para vegetais e folhas, que dão volume e saciedade com poucas calorias. Um quarto fica com a proteína, que preserva massa muscular e segura a fome. O quarto restante é do carboidrato, de preferência integral ou um tubérculo.",
      },
      {
        title: "A gordura entra como tempero",
        content:
          "Azeite, castanha, abacate e sementes não ocupam espaço no prato: entram em pequena quantidade. Um fio de azeite e uma colher de sementes já cumprem o papel de dar sabor e ajudar na absorção das vitaminas.",
      },
      {
        title: "Aplicando no dia a dia",
        content:
          "Restaurante por quilo, marmita ou jantar em casa: a regra é a mesma. Sirva primeiro os vegetais, depois a proteína e por último o carboidrato. A ordem muda o resultado, porque você serve o que sobra de espaço, e não o que sobra de fome.",
      },
    ],
  },
  {
    id: "l-proteina",
    title: "Proteína: quanto você realmente precisa?",
    description:
      "Entre o mito dos 30 gramas por refeição e o excesso de suplemento existe um número simples, que funciona para a maioria das pessoas.",
    thumbnail: "/images/lessons/proteina.jpg",
    videoUrl: "demo://lesson/proteina",
    durationMinutes: 15,
    category: "Nutrição",
    xpReward: XP_RULES.completeLesson,
    completed: false,
    progress: 45,
    chapters: [
      {
        title: "O número que importa",
        content:
          "Para quem treina, a faixa útil fica entre 1,6 e 2,2 gramas por quilo de peso por dia. Abaixo disso, a recuperação sofre. Acima, o ganho extra é pequeno e o custo é alto.",
      },
      {
        title: "Distribuição ao longo do dia",
        content:
          "Concentrar tudo no jantar funciona pior do que dividir. Entre 25 e 40 gramas por refeição, três a quatro vezes ao dia, cobre a maior parte dos casos sem virar obsessão.",
      },
      {
        title: "Fontes que cabem no seu bolso",
        content:
          "Ovo, frango, patinho, tilápia, iogurte natural, queijo cottage, lentilha e grão de bico. Whey é conveniência, não obrigação: entra quando a rotina aperta.",
      },
    ],
  },
  {
    id: "l-controle-fome",
    title: "Como controlar a fome durante o dia",
    description:
      "Fome não é falta de força de vontade. Quase sempre é um problema de composição da refeição, de sono ou de hidratação.",
    thumbnail: "/images/lessons/controle-fome.jpg",
    videoUrl: "demo://lesson/controle-fome",
    durationMinutes: 10,
    category: "Hábitos",
    xpReward: XP_RULES.completeLesson,
    completed: false,
    progress: 0,
    chapters: [
      {
        title: "Fome física e fome emocional",
        content:
          "A fome física cresce devagar, aceita qualquer alimento e passa quando você come. A emocional chega de repente, quer um alimento específico e costuma vir depois de um gatilho: cansaço, ansiedade, tédio.",
      },
      {
        title: "Os três reguladores",
        content:
          "Proteína e fibra nas refeições principais, sono de qualidade e hidratação. Quando os três estão no lugar, a vontade de beliscar cai sozinha, sem precisar de disciplina heroica.",
      },
      {
        title: "O lanche que resolve",
        content:
          "Um lanche que segura combina proteína com fibra: iogurte com fruta, ovo cozido com castanha, pão integral com queijo. Biscoito sozinho abre o apetite em vez de fechar.",
      },
    ],
  },
  {
    id: "l-constancia",
    title: "O segredo da constância",
    description:
      "Resultado não vem da semana perfeita. Vem da semana mediana repetida por seis meses.",
    thumbnail: "/images/lessons/constancia.jpg",
    videoUrl: "demo://lesson/constancia",
    durationMinutes: 8,
    category: "Hábitos",
    xpReward: XP_RULES.completeLesson,
    completed: false,
    progress: 0,
    chapters: [
      {
        title: "A regra do nunca duas vezes",
        content:
          "Escorregou uma vez, tudo bem. O problema é a segunda vez seguida, porque é ali que o hábito se rompe. Errou no almoço? O jantar volta ao plano. Não espere a segunda-feira.",
      },
      {
        title: "Reduza a fricção",
        content:
          "Deixe a marmita pronta, a garrafa cheia e a roupa de treino separada. Todo passo a menos entre você e a ação aumenta a chance de ela acontecer.",
      },
      {
        title: "Meça o processo, não só o resultado",
        content:
          "O peso oscila por sono, sal e ciclo. Já o número de refeições dentro do plano e de dias de treino depende só de você. Acompanhe o que está sob o seu controle.",
      },
    ],
  },
  {
    id: "l-suplementacao",
    title: "Suplementação sem complicação",
    description:
      "O que tem evidência sólida, o que é opcional e o que é só desperdício de dinheiro.",
    thumbnail: "/images/lessons/suplementacao.jpg",
    videoUrl: "demo://lesson/suplementacao",
    durationMinutes: 14,
    category: "Nutrição",
    xpReward: XP_RULES.completeLesson,
    completed: false,
    progress: 0,
    chapters: [
      {
        title: "A base sempre vence",
        content:
          "Nenhum suplemento compensa comida ruim, sono curto e treino inconsistente. Suplemento é a cereja: sem o bolo, não sustenta nada.",
      },
      {
        title: "O que tem evidência",
        content:
          "A creatina monoidratada é o suplemento mais estudado do mercado. A proteína em pó resolve praticidade. Vitamina D e ômega 3 entram conforme exame e alimentação.",
      },
      {
        title: "Como começar",
        content:
          "Um de cada vez, com dose e horário definidos, avaliando por pelo menos oito semanas. Começar cinco suplementos juntos só garante que você não vai saber qual funcionou.",
      },
    ],
  },
  {
    id: "l-organizacao-semanal",
    title: "Organizando sua alimentação na semana",
    description:
      "Duas horas de domingo compram sete dias de decisão fácil. O passo a passo do preparo semanal realista.",
    thumbnail: "/images/lessons/organizacao-semanal.jpg",
    videoUrl: "demo://lesson/organizacao-semanal",
    durationMinutes: 18,
    category: "Hábitos",
    xpReward: XP_RULES.completeLesson,
    completed: false,
    progress: 0,
    chapters: [
      {
        title: "A lista vem antes do mercado",
        content:
          "Escolha três proteínas, três carboidratos e cinco vegetais para a semana. A combinação entre eles já gera variedade suficiente sem transformar a sua cozinha em restaurante.",
      },
      {
        title: "Cozinhe em blocos",
        content:
          "Enquanto o frango assa, o arroz cozinha e os legumes vão ao vapor. Preparo em paralelo, não em fila. Guarde em potes de porção única, prontos para pegar e sair.",
      },
      {
        title: "O plano B",
        content:
          "Tenha sempre uma refeição de emergência no congelador e um lanche na bolsa. O plano só falha quando a alternativa é pior do que ele.",
      },
    ],
  },
  {
    id: "l-deficit-calorico",
    title: "Emagrecimento e déficit calórico",
    description:
      "Por que a dieta da moda funciona no começo e falha depois, e como construir um déficit que você consegue sustentar.",
    thumbnail: "/images/lessons/deficit-calorico.jpg",
    videoUrl: "demo://lesson/deficit-calorico",
    durationMinutes: 16,
    category: "Emagrecimento",
    xpReward: XP_RULES.completeLesson,
    completed: false,
    progress: 0,
    chapters: [
      {
        title: "Toda dieta que funciona faz a mesma coisa",
        content:
          "Low carb, jejum, mediterrânea: quando funcionam, é porque reduziram calorias. O que muda entre elas é a estratégia de adesão, não a física do processo.",
      },
      {
        title: "O tamanho certo do déficit",
        content:
          "Entre 15 e 25 por cento abaixo do gasto. Déficit agressivo derruba energia, treino e massa muscular, e cobra a conta em compulsão duas semanas depois.",
      },
      {
        title: "Platôs e o que fazer",
        content:
          "O peso trava por dias. Isso é normal: retenção, intestino, ciclo. Antes de cortar mais comida, olhe os passos diários, o sono e a honestidade do registro.",
      },
    ],
  },
  {
    id: "l-hipertrofia",
    title: "Hipertrofia além da academia",
    description:
      "O músculo cresce entre os treinos. Comida, sono e recuperação definem quanto do seu esforço vira resultado.",
    thumbnail: "/images/lessons/hipertrofia.jpg",
    videoUrl: "demo://lesson/hipertrofia",
    durationMinutes: 20,
    category: "Hipertrofia",
    xpReward: XP_RULES.completeLesson,
    completed: false,
    progress: 0,
    chapters: [
      {
        title: "Superávit inteligente",
        content:
          "De 10 a 15 por cento acima do gasto. Mais do que isso vira gordura, não músculo. O ganho saudável fica entre 0,25 e 0,5 por cento do peso corporal por semana.",
      },
      {
        title: "Proteína e carboidrato trabalham juntos",
        content:
          "A proteína fornece o material, o carboidrato fornece a energia para treinar pesado. Cortar carboidrato em fase de ganho é remar contra a própria maré.",
      },
      {
        title: "Sono é o anabólico gratuito",
        content:
          "Menos de sete horas por noite reduz recuperação, força e síntese proteica. Nenhum suplemento reverte uma rotina de sono ruim.",
      },
    ],
  },
];
