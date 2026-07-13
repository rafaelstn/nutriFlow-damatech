/** Atividade dos últimos 7 dias, usada nos gráficos de evolução. */
export interface WeeklyPoint {
  day: string;
  /** Percentual de adesão ao plano no dia. */
  adherence: number;
  xp: number;
  waterMl: number;
}

export const MOCK_WEEKLY: WeeklyPoint[] = [
  { day: "Seg", adherence: 82, xp: 110, waterMl: 2300 },
  { day: "Ter", adherence: 74, xp: 80, waterMl: 2100 },
  { day: "Qua", adherence: 91, xp: 160, waterMl: 2600 },
  { day: "Qui", adherence: 68, xp: 60, waterMl: 1900 },
  { day: "Sex", adherence: 88, xp: 140, waterMl: 2500 },
  { day: "Sáb", adherence: 61, xp: 50, waterMl: 1700 },
  { day: "Dom", adherence: 79, xp: 90, waterMl: 1800 },
];
