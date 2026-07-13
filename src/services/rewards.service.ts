import { MOCK_REWARDS } from "@/mocks/rewards";
import type { Reward } from "@/types";
import { ServiceError, commitMock, fetchMock } from "./mock-api";

export interface RedeemRewardResult {
  rewardId: string;
  title: string;
  /** O resgate é apenas uma solicitação: nenhum ponto é debitado na demonstração. */
  requestedAt: string;
}

export const rewardsService = {
  /** A disponibilidade é calculada contra o XP atual, não vem fixa do mock. */
  async getRewards(currentXp: number): Promise<Reward[]> {
    const rewards = MOCK_REWARDS.map((reward) => ({
      ...reward,
      available: currentXp >= reward.requiredPoints,
    }));
    return fetchMock(rewards);
  },

  async redeemReward(
    id: string,
    currentXp: number,
    alreadyRedeemed: boolean,
  ): Promise<RedeemRewardResult> {
    const reward = MOCK_REWARDS.find((item) => item.id === id);
    if (!reward) {
      throw new ServiceError("Recompensa não encontrada.", "not_found");
    }
    if (alreadyRedeemed) {
      throw new ServiceError(
        "Você já solicitou esta recompensa.",
        "already_redeemed",
      );
    }
    if (currentXp < reward.requiredPoints) {
      throw new ServiceError(
        "Você ainda não tem pontos suficientes para esta recompensa.",
        "insufficient_points",
      );
    }

    return commitMock({
      rewardId: reward.id,
      title: reward.title,
      requestedAt: new Date().toISOString(),
    });
  },
};
