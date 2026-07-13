import { LEAGUE_NAME, buildRanking } from "@/mocks/ranking";
import type { RankingEntry } from "@/types";
import { fetchMock } from "./mock-api";

export interface WeeklyRanking {
  leagueName: string;
  entries: RankingEntry[];
  /** Posição atual da usuária. */
  currentUserPosition: number;
  /** XP que falta para alcançar quem está logo acima. null se já é a primeira. */
  xpToNextPosition: number | null;
  nextPositionName: string | null;
}

export const rankingService = {
  /**
   * O ranking é derivado do XP atual da usuária, então reage em tempo real a
   * cada ponto conquistado durante a demonstração.
   */
  async getWeeklyRanking(currentUserXp: number): Promise<WeeklyRanking> {
    const entries = buildRanking(currentUserXp);
    return fetchMock(withMeta(entries));
  },

  /** Versão síncrona, para a interface recalcular a posição sem novo carregamento. */
  buildWeeklyRanking(currentUserXp: number): WeeklyRanking {
    return withMeta(buildRanking(currentUserXp));
  },
};

function withMeta(entries: RankingEntry[]): WeeklyRanking {
  const me = entries.find((entry) => entry.isCurrentUser);
  const position = me?.position ?? entries.length;
  const above = entries.find((entry) => entry.position === position - 1);

  return {
    leagueName: LEAGUE_NAME,
    entries,
    currentUserPosition: position,
    xpToNextPosition: above && me ? Math.max(0, above.xp - me.xp) : null,
    nextPositionName: above?.name ?? null,
  };
}
