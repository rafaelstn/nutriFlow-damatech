/**
 * Contratos de domínio do NutriFlow.
 *
 * São os mesmos tipos que uma API real devolveria: a camada de serviço mockada
 * pode ser trocada por HTTP sem que a UI mude.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  /** Iniciais para o avatar monograma quando não houver foto. */
  initials: string;
  level: string;
  xp: number;
  currentStreak: number;
  waterGoalMl: number;
  waterConsumedMl: number;
  proteinGoalGrams: number;
  proteinConsumedGrams: number;
  /** Percentual de 0 a 100. */
  weeklyProgress: number;
}

export type LessonCategory =
  | "Nutrição"
  | "Emagrecimento"
  | "Hipertrofia"
  | "Hábitos";

export interface LessonChapter {
  title: string;
  content: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  durationMinutes: number;
  category: LessonCategory;
  xpReward: number;
  completed: boolean;
  /** Percentual de 0 a 100 de progresso no player. */
  progress: number;
  chapters: LessonChapter[];
}

export type RecipeCategory =
  | "Café da manhã"
  | "Almoço"
  | "Lanches"
  | "Jantar"
  | "Sobremesas";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  category: RecipeCategory;
  prepTimeMinutes: number;
  calories: number;
  proteinGrams: number;
  ingredients: string[];
  instructions: string[];
  prepared: boolean;
}

export type ChallengeStatus = "active" | "completed" | "locked";

/** Nome do ícone Lucide usado pelo desafio. Resolvido em um mapa tipado na UI. */
export type ChallengeIcon =
  | "droplets"
  | "ban"
  | "beef"
  | "palette"
  | "footprints";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: ChallengeIcon;
  currentProgress: number;
  targetProgress: number;
  /** Unidade do progresso, exibida na interface ("dias", "refeições"...). */
  unit: string;
  /** Quanto cada registro avança no progresso. */
  step: number;
  xpReward: number;
  rewardName: string;
  status: ChallengeStatus;
}

export interface RankingEntry {
  id: string;
  name: string;
  avatar: string | null;
  initials: string;
  position: number;
  xp: number;
  isCurrentUser: boolean;
}

export type RewardType = "conteudo" | "servico" | "produto" | "desconto";

export interface Reward {
  id: string;
  title: string;
  description: string;
  image: string;
  requiredPoints: number;
  type: RewardType;
  available: boolean;
  redeemed: boolean;
}

export type SupplementCategory =
  | "Performance"
  | "Proteína"
  | "Saúde"
  | "Vitaminas";

export interface Supplement {
  id: string;
  name: string;
  image: string;
  category: SupplementCategory;
  description: string;
  benefits: string[];
  priceLabel: string;
  externalUrl: string;
}

/** Estado de carregamento padrão das telas. */
export type AsyncStatus = "idle" | "loading" | "success" | "empty" | "error";

/** Origem de um ganho de XP, usada no histórico de evolução. */
export type XpSource = "lesson" | "recipe" | "water" | "challenge";

export interface XpEvent {
  id: string;
  source: XpSource;
  label: string;
  amount: number;
  /** Data e hora em ISO string. */
  at: string;
}
