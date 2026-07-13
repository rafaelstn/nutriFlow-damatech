import { RecipeDetailScreen } from "@/features/recipes/RecipeDetailScreen";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <RecipeDetailScreen recipeId={id} />;
}
