/**
 * Configuração central do aplicativo.
 *
 * Ponto único de branding, links externos e regras de gamificação.
 * Para trocar a marca (nome, cores, nutricionista, WhatsApp), altere SOMENTE
 * este arquivo e os tokens de cor em src/app/globals.css.
 *
 * Nenhuma URL externa deve ser escrita direto em componente.
 */

export const APP = {
  name: "NutriFlow",
  tagline: "Sua evolução, um dia de cada vez.",
  description:
    "Aulas, receitas, desafios e acompanhamento para transformar hábito alimentar em resultado.",
  version: "0.1.0-demo",
} as const;

/** Profissional que assina o conteúdo (dado fictício de demonstração). */
export const NUTRITIONIST = {
  name: "Dra. Helena Rocha",
  shortName: "Helena",
  role: "Nutricionista clínica e esportiva",
  council: "CRN-3 12345",
  initials: "HR",
} as const;

/** Links externos centralizados. Nunca espalhar URL pelo projeto. */
export const LINKS = {
  /** Número em formato internacional, apenas dígitos. */
  whatsappNumber: "5511999999999",
  whatsappMessage:
    "Olá! Vim pelo app NutriFlow e quero saber mais sobre o acompanhamento personalizado.",
  instagram: "https://instagram.com",
  supplementsStore: "https://www.example.com/loja",
} as const;

/** Monta o deep link do WhatsApp a partir da configuração acima. */
export function whatsappUrl(message: string = LINKS.whatsappMessage): string {
  return `https://wa.me/${LINKS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Regras de gamificação. Fonte única de verdade para XP. */
export const XP_RULES = {
  completeLesson: 50,
  prepareRecipe: 30,
  logWater: 10,
  /** Teto de registros de água com XP por dia, evita farm infinito na apresentação. */
  maxWaterLogsPerDay: 8,
} as const;

/**
 * Trilha de níveis. O nível é derivado do XP total, nunca gravado solto.
 */
export const LEVELS = [
  { name: "Início", minXp: 0 },
  { name: "Constância", minXp: 1500 },
  { name: "Evolução", minXp: 3000 },
  { name: "Performance", minXp: 6000 },
  { name: "Elite", minXp: 10000 },
] as const;

export type LevelName = (typeof LEVELS)[number]["name"];

/** Duração da splash antes de navegar para o login. */
export const SPLASH_DURATION_MS = 1500;

/** Faixa de latência simulada nos serviços mockados. */
export const MOCK_LATENCY = { minMs: 300, maxMs: 700 } as const;

/** Aviso obrigatório da calculadora: conteúdo educativo, não prescrição. */
export const DISCLAIMER =
  "Estimativa educativa. A recomendação individual deve ser realizada por um profissional.";
