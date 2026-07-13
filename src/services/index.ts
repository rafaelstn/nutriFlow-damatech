/**
 * Camada de serviços mockados.
 *
 * A interface nunca importa de `@/mocks` diretamente: tudo passa por aqui.
 * Substituir por API real significa trocar o corpo destes módulos, mantendo as
 * assinaturas e os tipos de `@/types`.
 */
export { authService, type LoginInput } from "./auth.service";
export { lessonsService, LESSON_CATEGORIES } from "./lessons.service";
export { recipesService, RECIPE_CATEGORIES } from "./recipes.service";
export { progressService, WATER_PRESETS_ML } from "./progress.service";
export { challengesService } from "./challenges.service";
export { rankingService, type WeeklyRanking } from "./ranking.service";
export { rewardsService } from "./rewards.service";
export { supplementsService } from "./supplements.service";
export { ServiceError } from "./mock-api";
