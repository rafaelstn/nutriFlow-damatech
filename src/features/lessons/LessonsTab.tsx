"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { LESSON_CATEGORIES, lessonsService } from "@/services";
import { applyLessonProgress, useLessonsStore } from "@/stores";
import { useAsyncData } from "@/hooks/useAsyncData";
import { CardListSkeleton } from "@/components/common/Skeletons";
import { EmptyState, ErrorState } from "@/components/common/States";
import type { Lesson, LessonCategory } from "@/types";
import { CategoryChips } from "./CategoryChips";
import { LessonCard } from "./LessonCard";
import { matchesQuery } from "./search";

type LessonFilter = LessonCategory | "Todos";

/**
 * Aba de Aulas.
 *
 * O catálogo vem do serviço e o progresso vem da store persistida: as duas
 * coisas se encontram em `applyLessonProgress`, nunca no componente.
 */
export function LessonsTab({ query }: { query: string }) {
  const [category, setCategory] = useState<LessonFilter>("Todos");

  const { data, status, error, reload } = useAsyncData<Lesson[]>(() =>
    lessonsService.getLessons(),
  );

  const completedIds = useLessonsStore((state) => state.completedIds);
  const progressById = useLessonsStore((state) => state.progressById);

  const lessons = useMemo(
    () => (data ? applyLessonProgress(data, completedIds, progressById) : []),
    [data, completedIds, progressById],
  );

  const visible = useMemo(
    () =>
      lessons.filter(
        (lesson) =>
          (category === "Todos" || lesson.category === category) &&
          matchesQuery(lesson.title, query),
      ),
    [lessons, category, query],
  );

  const loaded = status === "success" || status === "empty";

  return (
    <div>
      <CategoryChips
        options={LESSON_CATEGORIES}
        selected={category}
        onSelect={setCategory}
        label="Filtrar aulas por categoria"
      />

      <div className="pt-4">
        {status === "loading" ? <CardListSkeleton count={4} /> : null}

        {status === "error" ? (
          <ErrorState
            title="Não conseguimos carregar as aulas"
            description={error ?? undefined}
            onRetry={reload}
          />
        ) : null}

        {loaded && visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nenhuma aula por aqui"
            description="Ajuste a busca ou escolha outra categoria para ver o restante da trilha."
            action={
              <button
                type="button"
                onClick={() => setCategory("Todos")}
                className="h-11 rounded-full bg-secondary px-5 text-sm font-bold text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Ver todas as aulas
              </button>
            }
          />
        ) : null}

        {loaded && visible.length > 0 ? (
          <ul className="space-y-3">
            {visible.map((lesson, index) => (
              <LessonCard key={lesson.id} lesson={lesson} index={index} />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
