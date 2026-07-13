"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Beef,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Flame,
  Loader2,
} from "lucide-react";
import { recipesService } from "@/services";
import { useCelebrationStore, useRecipesStore } from "@/stores";
import { useAsyncData } from "@/hooks/useAsyncData";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { DetailSkeleton } from "@/components/common/Skeletons";
import { ErrorState } from "@/components/common/States";
import type { Recipe } from "@/types";

export function RecipeDetailScreen({ recipeId }: { recipeId: string }) {
  const { data: recipe, status, error, reload } = useAsyncData<Recipe>(
    () => recipesService.getRecipeById(recipeId),
    [recipeId],
  );

  if (status === "loading") {
    return (
      <div>
        <ScreenHeader title="Receita" />
        <div className="pt-4">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (status === "error" || !recipe) {
    return (
      <div>
        <ScreenHeader title="Receita" />
        <ErrorState
          title="Receita não encontrada"
          description={
            error ?? "Esta receita saiu do ar ou o endereço está incorreto."
          }
          onRetry={reload}
        />
        <div className="flex justify-center pb-8">
          <Link
            href="/conteudos"
            className="flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold text-primary transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Voltar para Conteúdos
          </Link>
        </div>
      </div>
    );
  }

  return <RecipeDetail recipe={recipe} />;
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const router = useRouter();

  const prepared = useRecipesStore((state) =>
    state.preparedIds.includes(recipe.id),
  );
  const prepareRecipe = useRecipesStore((state) => state.prepareRecipe);
  const celebrateXp = useCelebrationStore((state) => state.celebrateXp);

  const [saving, setSaving] = useState(false);

  async function handlePrepare() {
    if (saving || prepared) return;

    setSaving(true);
    try {
      const outcome = await prepareRecipe(recipe.id);

      // Registro repetido não pontua de novo e também não é erro.
      if (outcome.duplicate) {
        toast.info("Esta receita já estava marcada como preparada.");
        return;
      }

      celebrateXp(outcome.awardedXp);
      toast.success(`+${outcome.awardedXp} XP conquistados`);
    } catch {
      toast.error("Não foi possível registrar a receita. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Herói fotográfico: a foto ocupa a borda e o título nasce dela. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={recipe.image}
          alt={`Foto do prato: ${recipe.title}`}
          fill
          priority
          sizes="(max-width: 480px) 100vw, 420px"
          className="object-cover"
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5"
          aria-hidden
        />

        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-card/85 text-foreground shadow-[var(--shadow-card)] backdrop-blur-md transition-transform active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        {prepared ? (
          <span className="absolute right-4 top-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-card/90 px-3 text-[11px] font-bold text-primary backdrop-blur-md">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} aria-hidden />
            Preparada
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-white/80">
            {recipe.category}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-white">
            {recipe.title}
          </h1>
        </div>
      </div>

      <div className="flex-1 px-5 pb-6 pt-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {recipe.description}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <Metric
            icon={<Flame className="h-4 w-4" strokeWidth={2.2} aria-hidden />}
            value={`${recipe.calories}`}
            unit="kcal"
            label="Calorias"
          />
          <Metric
            icon={<Beef className="h-4 w-4" strokeWidth={2.2} aria-hidden />}
            value={`${recipe.proteinGrams}`}
            unit="g"
            label="Proteína"
            tone="protein"
          />
          <Metric
            icon={<Clock className="h-4 w-4" strokeWidth={2.2} aria-hidden />}
            value={`${recipe.prepTimeMinutes}`}
            unit="min"
            label="Preparo"
          />
        </div>

        <section className="mt-7" aria-label="Ingredientes">
          <h2 className="text-base font-extrabold tracking-tight">
            Ingredientes
          </h2>
          <ul className="mt-3 space-y-2.5">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient} className="flex gap-3">
                <span
                  className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                <span className="text-sm leading-relaxed text-foreground/90">
                  {ingredient}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-7" aria-label="Modo de preparo">
          <h2 className="text-base font-extrabold tracking-tight">
            Modo de preparo
          </h2>
          <ol className="mt-3 space-y-4">
            {recipe.instructions.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span
                  className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--leaf-soft)] text-xs font-extrabold text-primary"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-foreground/90">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-border/60 bg-background/90 px-5 py-3 backdrop-blur-xl">
        <button
          type="button"
          onClick={handlePrepare}
          disabled={prepared || saving}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground transition-all active:scale-[0.99] disabled:pointer-events-none disabled:bg-[var(--leaf-soft)] disabled:text-primary"
        >
          {prepared ? (
            <>
              <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} aria-hidden />
              Receita preparada
            </>
          ) : saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Registrando
            </>
          ) : (
            "Marcar como preparada"
          )}
        </button>
      </div>
    </div>
  );
}

/** Métrica em destaque do topo da receita. */
function Metric({
  icon,
  value,
  unit,
  label,
  tone = "default",
}: {
  icon: React.ReactNode;
  value: string;
  unit: string;
  label: string;
  tone?: "default" | "protein";
}) {
  const protein = tone === "protein";

  return (
    <div className="surface-card flex flex-col items-center px-2 py-3 text-center">
      <span
        className={
          protein
            ? "flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--protein-soft)] text-[var(--protein)]"
            : "flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"
        }
      >
        {icon}
      </span>
      <p
        className={
          protein
            ? "tabular mt-2 text-base font-extrabold leading-none tracking-tight text-[var(--protein)]"
            : "tabular mt-2 text-base font-extrabold leading-none tracking-tight"
        }
      >
        {value}
        <span className="ml-0.5 text-[11px] font-bold text-muted-foreground">
          {unit}
        </span>
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
