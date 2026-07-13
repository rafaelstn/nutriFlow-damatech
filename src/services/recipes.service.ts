import { MOCK_RECIPES } from "@/mocks/recipes";
import { XP_RULES } from "@/config/app";
import type { Recipe, RecipeCategory } from "@/types";
import { ServiceError, commitMock, fetchMock } from "./mock-api";

export const RECIPE_CATEGORIES: Array<RecipeCategory | "Todas"> = [
  "Todas",
  "Café da manhã",
  "Almoço",
  "Lanches",
  "Jantar",
  "Sobremesas",
];

export interface PrepareRecipeResult {
  recipeId: string;
  awardedXp: number;
}

export const recipesService = {
  async getRecipes(): Promise<Recipe[]> {
    return fetchMock(MOCK_RECIPES);
  },

  async getRecipeById(id: string): Promise<Recipe> {
    const recipe = MOCK_RECIPES.find((item) => item.id === id);
    if (!recipe) {
      throw new ServiceError(
        "Esta receita não está mais disponível.",
        "not_found",
      );
    }
    return fetchMock(recipe);
  },

  /** Marca como preparada. A guarda contra XP duplicado vive na store. */
  async prepareRecipe(id: string): Promise<PrepareRecipeResult> {
    const recipe = MOCK_RECIPES.find((item) => item.id === id);
    if (!recipe) {
      throw new ServiceError(
        "Não foi possível registrar esta receita. Tente novamente.",
        "not_found",
      );
    }
    return commitMock({ recipeId: id, awardedXp: XP_RULES.prepareRecipe });
  },
};
