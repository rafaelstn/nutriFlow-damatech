import { MOCK_USER } from "@/mocks/user";
import { XP_RULES } from "@/config/app";
import type { User } from "@/types";
import { ServiceError, commitMock, fetchMock } from "./mock-api";

export interface AddWaterResult {
  amountMl: number;
  awardedXp: number;
}

export interface AddXpResult {
  amount: number;
}

/** Volumes oferecidos nos botões do acompanhamento de água. */
export const WATER_PRESETS_ML = [200, 300, 500] as const;

export const progressService = {
  async getUserProgress(): Promise<User> {
    return fetchMock(MOCK_USER);
  },

  /**
   * Registra consumo de água.
   * `xpEligible` é decidido pela store, que conhece o teto diário de registros.
   */
  async addWater(amountMl: number, xpEligible: boolean): Promise<AddWaterResult> {
    if (!Number.isFinite(amountMl) || amountMl <= 0) {
      throw new ServiceError("Volume inválido para registro.", "invalid_amount");
    }
    return commitMock({
      amountMl: Math.round(amountMl),
      awardedXp: xpEligible ? XP_RULES.logWater : 0,
    });
  },

  async addXp(amount: number): Promise<AddXpResult> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ServiceError("Pontuação inválida.", "invalid_amount");
    }
    return commitMock({ amount: Math.round(amount) });
  },
};
