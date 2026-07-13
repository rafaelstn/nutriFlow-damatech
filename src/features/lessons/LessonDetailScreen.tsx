"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, Clock, Loader2 } from "lucide-react";
import { lessonsService } from "@/services";
import { useCelebrationStore, useLessonsStore } from "@/stores";
import { useAsyncData } from "@/hooks/useAsyncData";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { DetailSkeleton } from "@/components/common/Skeletons";
import { ErrorState } from "@/components/common/States";
import { formatMinutes } from "@/utils/format";
import type { Lesson } from "@/types";
import { LessonPlayer } from "./LessonPlayer";

export function LessonDetailScreen({ lessonId }: { lessonId: string }) {
  const { data: lesson, status, error, reload } = useAsyncData<Lesson>(
    () => lessonsService.getLessonById(lessonId),
    [lessonId],
  );

  if (status === "loading") {
    return (
      <div>
        <ScreenHeader title="Aula" />
        <div className="pt-4">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (status === "error" || !lesson) {
    return (
      <div>
        <ScreenHeader title="Aula" />
        <ErrorState
          title="Aula não encontrada"
          description={
            error ?? "Esta aula saiu do ar ou o endereço está incorreto."
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

  return <LessonDetail lesson={lesson} />;
}

function LessonDetail({ lesson }: { lesson: Lesson }) {
  const completed = useLessonsStore((state) =>
    state.completedIds.includes(lesson.id),
  );
  const completeLesson = useLessonsStore((state) => state.completeLesson);
  const celebrateXp = useCelebrationStore((state) => state.celebrateXp);

  const [saving, setSaving] = useState(false);

  async function handleComplete() {
    if (saving || completed) return;

    setSaving(true);
    try {
      const outcome = await completeLesson(lesson.id);

      // Conclusão repetida não pontua de novo e também não é erro.
      if (outcome.duplicate) {
        toast.info("Esta aula já estava concluída.");
        return;
      }

      celebrateXp(outcome.awardedXp);
      toast.success(`+${outcome.awardedXp} XP conquistados`);
    } catch {
      toast.error("Não foi possível registrar a aula. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader title="Aula" subtitle={lesson.category} />

      <div className="flex-1 px-5 pb-6 pt-4">
        <LessonPlayer lesson={lesson} />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--leaf-soft)] px-2.5 py-1 text-[11px] font-bold text-primary">
            {lesson.category}
          </span>
          <span className="tabular inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
            <Clock className="h-3 w-3" strokeWidth={2.2} aria-hidden />
            {formatMinutes(lesson.durationMinutes)}
          </span>
          {completed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-2.5 py-1 text-[11px] font-bold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
              Concluída
            </span>
          ) : (
            <span className="tabular rounded-full bg-[var(--xp-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--xp)]">
              +{lesson.xpReward} XP
            </span>
          )}
        </div>

        <h1 className="mt-3 text-xl font-extrabold leading-tight tracking-tight">
          {lesson.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {lesson.description}
        </p>

        <section className="mt-7" aria-label="Conteúdo da aula">
          <h2 className="text-base font-extrabold tracking-tight">Nesta aula</h2>

          <ol className="mt-4 space-y-5">
            {lesson.chapters.map((chapter, index) => {
              const last = index === lesson.chapters.length - 1;

              return (
                <li key={chapter.title} className="relative pl-10">
                  {last ? null : (
                    <span
                      className="absolute bottom-[-1.25rem] left-[13px] top-8 w-px bg-border"
                      aria-hidden
                    />
                  )}
                  <span
                    className="tabular absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--leaf-soft)] text-xs font-extrabold text-primary"
                    aria-hidden
                  >
                    {index + 1}
                  </span>

                  <p className="pt-1 text-sm font-bold leading-snug">
                    {chapter.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {chapter.content}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-border/60 bg-background/90 px-5 py-3 backdrop-blur-xl">
        <button
          type="button"
          onClick={handleComplete}
          disabled={completed || saving}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground transition-all active:scale-[0.99] disabled:pointer-events-none disabled:bg-[var(--leaf-soft)] disabled:text-primary"
        >
          {completed ? (
            <>
              <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} aria-hidden />
              Aula concluída
            </>
          ) : saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Registrando
            </>
          ) : (
            "Marcar aula como concluída"
          )}
        </button>
      </div>
    </div>
  );
}
