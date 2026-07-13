"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { RECIPE_CATEGORIES, recipesService } from "@/services";
import { applyRecipeProgress, useRecipesStore } from "@/stores";
import { useAsyncData } from "@/hooks/useAsyncData";
import { GridCardsSkeleton } from "@/components/common/Skeletons";
import { EmptyState, ErrorState } from "@/components/common/States";
// Compartilhados com a aba de Aulas: as duas vivem na mesma tela de Conteúdos.
import { CategoryChips } from "@/features/lessons/CategoryChips";
import { matchesQuery } from "@/features/lessons/search";
import type { Recipe, RecipeCategory } from "@/types";
import { RecipeCard } from "./RecipeCard";

type RecipeFilter = RecipeCategory | "Todas";

export function RecipesTab({ query }: { query: string }) {
  const [category, setCategory] = useState<RecipeFilter>("Todas");

  const { data, status, error, reload } = useAsyncData<Recipe[]>(() =>
    recipesService.getRecipes(),
  );

  const preparedIds = useRecipesStore((state) => state.preparedIds);

  const recipes = useMemo(
    () => (data ? applyRecipeProgress(data, preparedIds) : []),
    [data, preparedIds],
  );

  const visible = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          (category === "Todas" || recipe.category === category) &&
          matchesQuery(recipe.title, query),
      ),
    [recipes, category, query],
  );

  const loaded = status === "success" || status === "empty";

  return (
    <div>
      <CategoryChips
        options={RECIPE_CATEGORIES}
        selected={category}
        onSelect={setCategory}
        label="Filtrar receitas por categoria"
      />

      <div className="pt-4">
        {status === "loading" ? <GridCardsSkeleton count={6} /> : null}

        {status === "error" ? (
          <ErrorState
            title="Não conseguimos carregar as receitas"
            description={error ?? undefined}
            onRetry={reload}
          />
        ) : null}

        {loaded && visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nenhuma receita por aqui"
            description="Ajuste a busca ou escolha outra categoria para ver o restante do cardápio."
            action={
              <button
                type="button"
                onClick={() => setCategory("Todas")}
                className="h-11 rounded-full bg-secondary px-5 text-sm font-bold text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Ver todas as receitas
              </button>
            }
          />
        ) : null}

        {loaded && visible.length > 0 ? (
          <ul className="grid grid-cols-2 items-stretch gap-3">
            {visible.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
