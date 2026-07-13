import { create } from "zustand";
import { persist } from "zustand/middleware";
import { rewardsService } from "@/services";
import type { Reward } from "@/types";

export interface RedeemOutcome {
  title: string;
  duplicate: boolean;
}

interface RewardsState {
  redeemedIds: string[];
  redeem: (rewardId: string, currentXp: number) => Promise<RedeemOutcome>;
  reset: () => void;
}

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      redeemedIds: [],

      /** O resgate é uma solicitação: nenhum ponto é debitado na demonstração. */
      redeem: async (rewardId, currentXp) => {
        const alreadyRedeemed = get().redeemedIds.includes(rewardId);

        const result = await rewardsService.redeemReward(
          rewardId,
          currentXp,
          alreadyRedeemed,
        );

        // Guarda anti-duplicidade: reconfere depois do await.
        if (get().redeemedIds.includes(rewardId)) {
          return { title: result.title, duplicate: true };
        }

        set((state) => ({ redeemedIds: [...state.redeemedIds, rewardId] }));
        return { title: result.title, duplicate: false };
      },

      reset: () => set({ redeemedIds: [] }),
    }),
    {
      name: "nutriflow:rewards",
      partialize: (state) => ({ redeemedIds: state.redeemedIds }),
    },
  ),
);

export function applyRewardState(
  rewards: Reward[],
  redeemedIds: string[],
): Reward[] {
  return rewards.map((reward) => ({
    ...reward,
    redeemed: redeemedIds.includes(reward.id),
  }));
}
