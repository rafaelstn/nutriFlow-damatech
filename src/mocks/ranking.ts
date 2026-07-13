import type { RankingEntry } from "@/types";
import { MOCK_USER } from "./user";

/**
 * Competidores da liga semanal, sem a usuária logada.
 * O XP da Mariana entra no ranking em tempo real, a partir do progresso dela,
 * então a posição reage a cada ponto conquistado durante a demonstração.
 */
export interface Competitor {
  id: string;
  name: string;
  initials: string;
  avatar: string | null;
  xp: number;
}

export const MOCK_COMPETITORS: Competitor[] = [
  { id: "u-ana", name: "Ana Clara", initials: "AC", avatar: null, xp: 4850 },
  { id: "u-lucas", name: "Lucas Mendes", initials: "LM", avatar: null, xp: 4220 },
  { id: "u-rafael", name: "Rafael Costa", initials: "RC", avatar: null, xp: 3620 },
  { id: "u-beatriz", name: "Beatriz Lima", initials: "BL", avatar: null, xp: 3400 },
  { id: "u-camila", name: "Camila Rocha", initials: "CR", avatar: null, xp: 3150 },
  { id: "u-joao", name: "João Pedro", initials: "JP", avatar: null, xp: 2980 },
];

export const LEAGUE_NAME = "Liga Evolução";

/** Monta o ranking ordenado, inserindo a usuária com o XP atual dela. */
export function buildRanking(currentUserXp: number): RankingEntry[] {
  const rows = [
    ...MOCK_COMPETITORS.map((c) => ({ ...c, isCurrentUser: false })),
    {
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      initials: MOCK_USER.initials,
      avatar: MOCK_USER.avatar,
      xp: currentUserXp,
      isCurrentUser: true,
    },
  ];

  return rows
    .sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      // Empate: a usuária fica na frente, porque acabou de pontuar.
      if (a.isCurrentUser) return -1;
      if (b.isCurrentUser) return 1;
      return a.name.localeCompare(b.name, "pt-BR");
    })
    .map((row, index) => ({
      id: row.id,
      name: row.name,
      avatar: row.avatar,
      initials: row.initials,
      position: index + 1,
      xp: row.xp,
      isCurrentUser: row.isCurrentUser,
    }));
}
