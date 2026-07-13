import { MOCK_LESSONS } from "@/mocks/lessons";
import type { Lesson, LessonCategory } from "@/types";
import { ServiceError, commitMock, fetchMock } from "./mock-api";

export const LESSON_CATEGORIES: Array<LessonCategory | "Todos"> = [
  "Todos",
  "Nutrição",
  "Emagrecimento",
  "Hipertrofia",
  "Hábitos",
];

export interface CompleteLessonResult {
  lessonId: string;
  awardedXp: number;
}

export const lessonsService = {
  /** Catálogo base. O progresso da usuária é aplicado pela store. */
  async getLessons(): Promise<Lesson[]> {
    return fetchMock(MOCK_LESSONS);
  },

  async getLessonById(id: string): Promise<Lesson> {
    const lesson = MOCK_LESSONS.find((item) => item.id === id);
    if (!lesson) {
      throw new ServiceError("Esta aula não está mais disponível.", "not_found");
    }
    return fetchMock(lesson);
  },

  /** Registra a conclusão. A guarda contra XP duplicado vive na store. */
  async completeLesson(id: string): Promise<CompleteLessonResult> {
    const lesson = MOCK_LESSONS.find((item) => item.id === id);
    if (!lesson) {
      throw new ServiceError(
        "Não foi possível registrar esta aula. Tente novamente.",
        "not_found",
      );
    }
    return commitMock({ lessonId: id, awardedXp: lesson.xpReward });
  },
};
