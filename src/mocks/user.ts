import type { User } from "@/types";

/**
 * Usuária de demonstração. Dado fictício: nenhuma paciente real e nenhum dado
 * clínico verdadeiro trafega nesta aplicação.
 */
export const MOCK_USER: User = {
  id: "u-mariana",
  name: "Mariana Alves",
  email: "mariana@demo.com",
  avatar: null,
  initials: "MA",
  level: "Evolução",
  xp: 3970,
  currentStreak: 12,
  waterGoalMl: 2500,
  waterConsumedMl: 1800,
  proteinGoalGrams: 120,
  proteinConsumedGrams: 82,
  weeklyProgress: 78,
};

/** Credenciais aceitas na demonstração. Não existe autenticação real. */
export const DEMO_CREDENTIALS = {
  email: "mariana@demo.com",
  password: "123456",
} as const;

/** Dicas curtas e humanizadas exibidas na Home. */
export const NUTRI_TIPS: string[] = [
  "Comece o dia com proteína. Um café da manhã com ovo ou iogurte te segura até o almoço e derruba a fome da tarde.",
  "Beba um copo de água antes de cada refeição. É simples, e resolve metade da sua meta de hidratação sem esforço.",
  "Não existe alimento proibido, existe frequência. O que você faz todo dia pesa mais do que o que você faz no domingo.",
  "Deixe a fruta lavada e à vista na bancada. A escolha saudável precisa ser a mais fácil, não a mais nobre.",
];
