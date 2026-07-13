import { create } from "zustand";
import { persist } from "zustand/middleware";
import { progressService } from "@/services";
import { MOCK_USER } from "@/mocks/user";
import { XP_RULES } from "@/config/app";
import type { XpEvent, XpSource } from "@/types";

/**
 * Fonte única de verdade da gamificação.
 *
 * Todo ganho de pontos do aplicativo passa por `addXp`. Nenhuma outra store
 * escreve em `xp` diretamente: elas chamam esta ação. O nível nunca é gravado,
 * é sempre derivado do XP (ver utils/gamification).
 */

interface ProgressState {
  xp: number;
  currentStreak: number;
  waterGoalMl: number;
  waterConsumedMl: number;
  proteinGoalGrams: number;
  proteinConsumedGrams: number;
  weeklyProgress: number;
  /** Registros de água que já pagaram XP no dia da demonstração. */
  waterLogsWithXp: number;
  xpEvents: XpEvent[];
  hasHydrated: boolean;

  addXp: (amount: number, source: XpSource, label: string) => number;
  addWater: (amountMl: number) => Promise<{ awardedXp: number }>;
  setGoals: (goals: { waterGoalMl: number; proteinGoalGrams: number }) => void;
  reset: () => void;
  setHasHydrated: (value: boolean) => void;
}

const INITIAL = {
  xp: MOCK_USER.xp,
  currentStreak: MOCK_USER.currentStreak,
  waterGoalMl: MOCK_USER.waterGoalMl,
  waterConsumedMl: MOCK_USER.waterConsumedMl,
  proteinGoalGrams: MOCK_USER.proteinGoalGrams,
  proteinConsumedGrams: MOCK_USER.proteinConsumedGrams,
  weeklyProgress: MOCK_USER.weeklyProgress,
  waterLogsWithXp: 0,
  xpEvents: [] as XpEvent[],
};

let eventSeq = 0;
const nextEventId = () => {
  eventSeq += 1;
  return `xp-${Date.now()}-${eventSeq}`;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      hasHydrated: false,

      /** Ação central de XP. Retorna o total creditado (0 quando inválido). */
      addXp: (amount, source, label) => {
        if (!Number.isFinite(amount) || amount <= 0) return 0;
        const credited = Math.round(amount);

        set((state) => ({
          xp: state.xp + credited,
          xpEvents: [
            {
              id: nextEventId(),
              source,
              label,
              amount: credited,
              at: new Date().toISOString(),
            },
            ...state.xpEvents,
          ].slice(0, 30),
        }));

        return credited;
      },

      addWater: async (amountMl) => {
        const state = get();
        const xpEligible = state.waterLogsWithXp < XP_RULES.maxWaterLogsPerDay;

        const result = await progressService.addWater(amountMl, xpEligible);

        set((current) => ({
          waterConsumedMl: current.waterConsumedMl + result.amountMl,
          waterLogsWithXp:
            result.awardedXp > 0
              ? current.waterLogsWithXp + 1
              : current.waterLogsWithXp,
        }));

        if (result.awardedXp > 0) {
          get().addXp(result.awardedXp, "water", "Hidratação registrada");
        }

        return { awardedXp: result.awardedXp };
      },

      setGoals: ({ waterGoalMl, proteinGoalGrams }) =>
        set({ waterGoalMl, proteinGoalGrams }),

      reset: () => set({ ...INITIAL, xpEvents: [] }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "nutriflow:progress",
      partialize: (state) => ({
        xp: state.xp,
        currentStreak: state.currentStreak,
        waterGoalMl: state.waterGoalMl,
        waterConsumedMl: state.waterConsumedMl,
        proteinGoalGrams: state.proteinGoalGrams,
        proteinConsumedGrams: state.proteinConsumedGrams,
        weeklyProgress: state.weeklyProgress,
        waterLogsWithXp: state.waterLogsWithXp,
        xpEvents: state.xpEvents,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
