import { MOCK_CHALLENGES } from "@/mocks/challenges";
import type { Challenge } from "@/types";
import { ServiceError, commitMock, fetchMock } from "./mock-api";

export interface ChallengeProgressResult {
  challengeId: string;
  /** Progresso após o registro. */
  currentProgress: number;
  completed: boolean;
  /** XP creditado apenas na conclusão. */
  awardedXp: number;
}

export const challengesService = {
  async getChallenges(): Promise<Challenge[]> {
    return fetchMock(MOCK_CHALLENGES);
  },

  async getChallengeById(id: string): Promise<Challenge> {
    const challenge = MOCK_CHALLENGES.find((item) => item.id === id);
    if (!challenge) {
      throw new ServiceError("Desafio não encontrado.", "not_found");
    }
    return fetchMock(challenge);
  },

  /**
   * Registra um avanço no desafio.
   * A store envia o progresso atual e recebe o novo estado calculado aqui.
   */
  async completeChallenge(
    id: string,
    currentProgress: number,
  ): Promise<ChallengeProgressResult> {
    const challenge = MOCK_CHALLENGES.find((item) => item.id === id);
    if (!challenge) {
      throw new ServiceError(
        "Não foi possível registrar o seu avanço. Tente novamente.",
        "not_found",
      );
    }

    const next = Math.min(
      challenge.targetProgress,
      currentProgress + challenge.step,
    );
    const completed = next >= challenge.targetProgress;

    return commitMock({
      challengeId: id,
      currentProgress: next,
      completed,
      awardedXp: completed ? challenge.xpReward : 0,
    });
  },
};
