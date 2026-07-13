import type { Challenge } from "@/types";

/** Desafios da liga semanal. O de hidratação já começa em 5 de 7 na demonstração. */
export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "c-hidratacao",
    title: "Desafio Hidratação",
    description:
      "Bata a sua meta de água por 7 dias seguidos. Hidratação é o hábito que puxa todos os outros.",
    icon: "droplets",
    currentProgress: 5,
    targetProgress: 7,
    unit: "dias",
    step: 1,
    xpReward: 300,
    rewardName: "Selo Hidratação em dia",
    status: "active",
  },
  {
    id: "c-sem-refrigerante",
    title: "7 dias sem refrigerante",
    description:
      "Uma semana inteira trocando refrigerante por água, chá gelado ou água com gás e limão.",
    icon: "ban",
    currentProgress: 3,
    targetProgress: 7,
    unit: "dias",
    step: 1,
    xpReward: 250,
    rewardName: "Selo Escolha consciente",
    status: "active",
  },
  {
    id: "c-semana-proteica",
    title: "Semana proteica",
    description:
      "Inclua uma fonte de proteína em 21 refeições ao longo da semana.",
    icon: "beef",
    currentProgress: 12,
    targetProgress: 21,
    unit: "refeições",
    step: 1,
    xpReward: 350,
    rewardName: "Selo Proteína em todas",
    status: "active",
  },
  {
    id: "c-cinco-cores",
    title: "5 cores no prato",
    description:
      "Monte 5 pratos com pelo menos cinco cores diferentes de vegetais e frutas.",
    icon: "palette",
    currentProgress: 2,
    targetProgress: 5,
    unit: "pratos",
    step: 1,
    xpReward: 200,
    rewardName: "Selo Prato colorido",
    status: "active",
  },
  {
    id: "c-dez-mil-passos",
    title: "10 mil passos",
    description:
      "Caminhe 10 mil passos por dia durante 5 dias. Movimento também é nutrição.",
    icon: "footprints",
    currentProgress: 1,
    targetProgress: 5,
    unit: "dias",
    step: 1,
    xpReward: 280,
    rewardName: "Selo Corpo em movimento",
    status: "active",
  },
];
