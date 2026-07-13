import { describe, expect, it } from "vitest";
import { rankingService } from "../ranking.service";
import { MOCK_USER } from "@/mocks/user";

/**
 * O ranking reage ao XP em tempo real. É a funcionalidade mais sensível da
 * apresentação: a posição precisa mudar assim que a usuária pontua.
 */

describe("Ranking semanal", () => {
  it("coloca a Mariana em 3º com o XP inicial", () => {
    const ranking = rankingService.buildWeeklyRanking(MOCK_USER.xp);

    expect(ranking.currentUserPosition).toBe(3);
    expect(ranking.entries).toHaveLength(7);
    expect(ranking.entries[0].name).toBe("Ana Clara");
    expect(ranking.entries[2].isCurrentUser).toBe(true);
  });

  it("informa exatamente quanto falta para a posição de cima", () => {
    const ranking = rankingService.buildWeeklyRanking(MOCK_USER.xp);

    // Lucas Mendes tem 4220 XP, a Mariana 3970.
    expect(ranking.xpToNextPosition).toBe(250);
    expect(ranking.nextPositionName).toBe("Lucas Mendes");
  });

  it("sobe a Mariana para o 2º lugar quando ela ultrapassa o Lucas", () => {
    const ranking = rankingService.buildWeeklyRanking(MOCK_USER.xp + 300);

    expect(ranking.currentUserPosition).toBe(2);
    expect(ranking.entries[1].isCurrentUser).toBe(true);
    expect(ranking.entries[2].name).toBe("Lucas Mendes");
    expect(ranking.nextPositionName).toBe("Ana Clara");
  });

  it("desempata a favor de quem acabou de pontuar", () => {
    // Empate exato com o Lucas Mendes (4220 XP).
    const ranking = rankingService.buildWeeklyRanking(4220);

    expect(ranking.currentUserPosition).toBe(2);
  });

  it("leva a Mariana à liderança e zera o alvo acima dela", () => {
    const ranking = rankingService.buildWeeklyRanking(5000);

    expect(ranking.currentUserPosition).toBe(1);
    expect(ranking.xpToNextPosition).toBeNull();
    expect(ranking.nextPositionName).toBeNull();
  });

  it("mantém as posições sequenciais e sem furo", () => {
    const ranking = rankingService.buildWeeklyRanking(MOCK_USER.xp);

    expect(ranking.entries.map((entry) => entry.position)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });
});
