import { LEVELS } from "@/config/app";

export interface LevelInfo {
  name: string;
  index: number;
  minXp: number;
  /** XP necessario para o proximo nivel. null quando ja esta no ultimo. */
  nextLevelXp: number | null;
  nextLevelName: string | null;
  /** Percentual 0 a 100 dentro do nivel atual. */
  progressPercent: number;
  xpToNextLevel: number;
}

/** O nivel e sempre derivado do XP, nunca guardado de forma independente. */
export function getLevelInfo(xp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(xp));
  let index = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (safeXp >= LEVELS[i].minXp) index = i;
  }

  const current = LEVELS[index];
  const next = index < LEVELS.length - 1 ? LEVELS[index + 1] : null;

  if (!next) {
    return {
      name: current.name,
      index,
      minXp: current.minXp,
      nextLevelXp: null,
      nextLevelName: null,
      progressPercent: 100,
      xpToNextLevel: 0,
    };
  }

  const span = next.minXp - current.minXp;
  const earned = safeXp - current.minXp;

  return {
    name: current.name,
    index,
    minXp: current.minXp,
    nextLevelXp: next.minXp,
    nextLevelName: next.name,
    progressPercent: clampPercent((earned / span) * 100),
    xpToNextLevel: next.minXp - safeXp,
  };
}

export function getLevelName(xp: number): string {
  return getLevelInfo(xp).name;
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** Percentual de uma meta (agua, proteina, desafio), sempre limitado a 100. */
export function goalPercent(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return clampPercent((current / goal) * 100);
}
