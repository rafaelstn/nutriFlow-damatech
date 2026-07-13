import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lessonsService } from "@/services";
import { MOCK_LESSONS } from "@/mocks/lessons";
import type { Lesson } from "@/types";
import { useProgressStore } from "./progress.store";

/**
 * Progresso da usuária nas aulas.
 *
 * A store guarda apenas o que muda (concluídas e percentual assistido). O
 * catálogo continua vindo do serviço, e as duas coisas são combinadas em
 * `applyProgress`.
 */

export interface CompleteLessonOutcome {
  awardedXp: number;
  duplicate: boolean;
}

interface LessonsState {
  completedIds: string[];
  progressById: Record<string, number>;
  completeLesson: (lessonId: string) => Promise<CompleteLessonOutcome>;
  setProgress: (lessonId: string, percent: number) => void;
  reset: () => void;
}

/** Estado inicial: reflete o que já vem marcado no catálogo mockado. */
const initialCompleted = MOCK_LESSONS.filter((l) => l.completed).map((l) => l.id);
const initialProgress = Object.fromEntries(
  MOCK_LESSONS.map((lesson) => [lesson.id, lesson.progress]),
);

export const useLessonsStore = create<LessonsState>()(
  persist(
    (set, get) => ({
      completedIds: initialCompleted,
      progressById: initialProgress,

      completeLesson: async (lessonId) => {
        // Guarda anti-duplicidade: aula concluída nunca paga XP de novo.
        if (get().completedIds.includes(lessonId)) {
          return { awardedXp: 0, duplicate: true };
        }

        const result = await lessonsService.completeLesson(lessonId);

        // Reconfere após o await: a usuária pode ter tocado duas vezes.
        if (get().completedIds.includes(lessonId)) {
          return { awardedXp: 0, duplicate: true };
        }

        set((state) => ({
          completedIds: [...state.completedIds, lessonId],
          progressById: { ...state.progressById, [lessonId]: 100 },
        }));

        const lesson = MOCK_LESSONS.find((item) => item.id === lessonId);
        const awardedXp = useProgressStore
          .getState()
          .addXp(
            result.awardedXp,
            "lesson",
            lesson ? `Aula concluída: ${lesson.title}` : "Aula concluída",
          );

        return { awardedXp, duplicate: false };
      },

      setProgress: (lessonId, percent) =>
        set((state) => ({
          progressById: {
            ...state.progressById,
            [lessonId]: Math.min(100, Math.max(0, Math.round(percent))),
          },
        })),

      reset: () =>
        set({
          completedIds: initialCompleted,
          progressById: { ...initialProgress },
        }),
    }),
    {
      name: "nutriflow:lessons",
      partialize: (state) => ({
        completedIds: state.completedIds,
        progressById: state.progressById,
      }),
    },
  ),
);

/** Combina o catálogo do serviço com o progresso persistido. */
export function applyLessonProgress(
  lessons: Lesson[],
  completedIds: string[],
  progressById: Record<string, number>,
): Lesson[] {
  return lessons.map((lesson) => {
    const completed = completedIds.includes(lesson.id);
    return {
      ...lesson,
      completed,
      progress: completed ? 100 : (progressById[lesson.id] ?? lesson.progress),
    };
  });
}
