import { create } from "zustand";
import { persist } from "zustand/middleware";
import { challengesService } from "@/services";
import { MOCK_CHALLENGES } from "@/mocks/challenges";
import type { Challenge } from "@/types";
import { useProgressStore } from "./progress.store";

export interface ChallengeOutcome {
  currentProgress: number;
  completed: boolean;
  awardedXp: number;
  duplicate: boolean;
}

interface ChallengesState {
  progressById: Record<string, number>;
  completedIds: string[];
  registerDay: (challengeId: string) => Promise<ChallengeOutcome>;
  reset: () => void;
}

const initialProgress = Object.fromEntries(
  MOCK_CHALLENGES.map((challenge) => [challenge.id, challenge.currentProgress]),
);

export const useChallengesStore = create<ChallengesState>()(
  persist(
    (set, get) => ({
      progressById: initialProgress,
      completedIds: [],

      /** Registra um avanço. O XP só é creditado na conclusão, uma única vez. */
      registerDay: async (challengeId) => {
        const state = get();

        // Guarda anti-duplicidade: desafio concluído não avança nem paga de novo.
        if (state.completedIds.includes(challengeId)) {
          const target =
            MOCK_CHALLENGES.find((c) => c.id === challengeId)?.targetProgress ?? 0;
          return {
            currentProgress: state.progressById[challengeId] ?? target,
            completed: true,
            awardedXp: 0,
            duplicate: true,
          };
        }

        const current = state.progressById[challengeId] ?? 0;
        const result = await challengesService.completeChallenge(
          challengeId,
          current,
        );

        if (get().completedIds.includes(challengeId)) {
          return {
            currentProgress: result.currentProgress,
            completed: true,
            awardedXp: 0,
            duplicate: true,
          };
        }

        set((prev) => ({
          progressById: {
            ...prev.progressById,
            [challengeId]: result.currentProgress,
          },
          completedIds: result.completed
            ? [...prev.completedIds, challengeId]
            : prev.completedIds,
        }));

        let awardedXp = 0;
        if (result.completed && result.awardedXp > 0) {
          const challenge = MOCK_CHALLENGES.find((c) => c.id === challengeId);
          awardedXp = useProgressStore
            .getState()
            .addXp(
              result.awardedXp,
              "challenge",
              challenge
                ? `Desafio concluído: ${challenge.title}`
                : "Desafio concluído",
            );
        }

        return {
          currentProgress: result.currentProgress,
          completed: result.completed,
          awardedXp,
          duplicate: false,
        };
      },

      reset: () =>
        set({ progressById: { ...initialProgress }, completedIds: [] }),
    }),
    {
      name: "nutriflow:challenges",
      partialize: (state) => ({
        progressById: state.progressById,
        completedIds: state.completedIds,
      }),
    },
  ),
);

export function applyChallengeProgress(
  challenges: Challenge[],
  progressById: Record<string, number>,
  completedIds: string[],
): Challenge[] {
  return challenges.map((challenge) => {
    const currentProgress =
      progressById[challenge.id] ?? challenge.currentProgress;
    const completed =
      completedIds.includes(challenge.id) ||
      currentProgress >= challenge.targetProgress;

    return {
      ...challenge,
      currentProgress,
      status: completed ? "completed" : challenge.status,
    };
  });
}
