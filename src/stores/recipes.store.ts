import { create } from "zustand";
import { persist } from "zustand/middleware";
import { recipesService } from "@/services";
import { MOCK_RECIPES } from "@/mocks/recipes";
import type { Recipe } from "@/types";
import { useProgressStore } from "./progress.store";

export interface PrepareRecipeOutcome {
  awardedXp: number;
  duplicate: boolean;
}

interface RecipesState {
  preparedIds: string[];
  prepareRecipe: (recipeId: string) => Promise<PrepareRecipeOutcome>;
  reset: () => void;
}

export const useRecipesStore = create<RecipesState>()(
  persist(
    (set, get) => ({
      preparedIds: [],

      prepareRecipe: async (recipeId) => {
        // Guarda anti-duplicidade: receita já preparada não paga XP de novo.
        if (get().preparedIds.includes(recipeId)) {
          return { awardedXp: 0, duplicate: true };
        }

        const result = await recipesService.prepareRecipe(recipeId);

        if (get().preparedIds.includes(recipeId)) {
          return { awardedXp: 0, duplicate: true };
        }

        set((state) => ({ preparedIds: [...state.preparedIds, recipeId] }));

        const recipe = MOCK_RECIPES.find((item) => item.id === recipeId);
        const awardedXp = useProgressStore
          .getState()
          .addXp(
            result.awardedXp,
            "recipe",
            recipe ? `Receita preparada: ${recipe.title}` : "Receita preparada",
          );

        return { awardedXp, duplicate: false };
      },

      reset: () => set({ preparedIds: [] }),
    }),
    {
      name: "nutriflow:recipes",
      partialize: (state) => ({ preparedIds: state.preparedIds }),
    },
  ),
);

export function applyRecipeProgress(
  recipes: Recipe[],
  preparedIds: string[],
): Recipe[] {
  return recipes.map((recipe) => ({
    ...recipe,
    prepared: preparedIds.includes(recipe.id),
  }));
}
