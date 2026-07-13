import { useProgressStore } from "./progress.store";
import { useLessonsStore } from "./lessons.store";
import { useRecipesStore } from "./recipes.store";
import { useChallengesStore } from "./challenges.store";
import { useRewardsStore } from "./rewards.store";
import { useCelebrationStore } from "./celebration.store";

/**
 * Restaura a demonstração ao estado inicial.
 *
 * Volta XP, água, aulas, receitas, desafios e recompensas aos valores de origem
 * e limpa o que foi persistido. A identidade da usuária é mantida, para que a
 * apresentação continue de onde estava sem exigir novo login.
 */
export function resetDemo(): void {
  useProgressStore.getState().reset();
  useLessonsStore.getState().reset();
  useRecipesStore.getState().reset();
  useChallengesStore.getState().reset();
  useRewardsStore.getState().reset();
  useCelebrationStore.getState().clearXp();
}
