/**
 * Calculos demonstrativos de metas nutricionais.
 *
 * Formulas simplificadas e de uso educativo (Mifflin-St Jeor para o gasto basal).
 * NAO substituem avaliacao profissional. A UI exibe o aviso de DISCLAIMER
 * (src/config/app.ts) em todo resultado.
 */

export type Sex = "feminino" | "masculino";
export type Objective = "emagrecimento" | "manutencao" | "hipertrofia";
export type ActivityLevel =
  | "sedentario"
  | "leve"
  | "moderado"
  | "intenso"
  | "atleta";

export interface GoalsInput {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  sex: Sex;
  objective: Objective;
  activityLevel: ActivityLevel;
}

export interface GoalsResult {
  bmi: number;
  bmiLabel: string;
  /** Taxa metabolica basal, kcal/dia. */
  bmr: number;
  /** Gasto energetico total estimado, kcal/dia. */
  tdee: number;
  /** Calorias-alvo ja ajustadas ao objetivo. */
  targetCalories: number;
  waterGoalMl: number;
  proteinGoalGrams: number;
  carbGoalGrams: number;
  fatGoalGrams: number;
}

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  atleta: 1.9,
};

/** Ajuste calorico por objetivo, sobre o gasto total estimado. */
const OBJECTIVE_FACTOR: Record<Objective, number> = {
  emagrecimento: 0.8,
  manutencao: 1,
  hipertrofia: 1.15,
};

/** Proteina em gramas por quilo de peso, por objetivo. */
const PROTEIN_PER_KG: Record<Objective, number> = {
  emagrecimento: 2,
  manutencao: 1.6,
  hipertrofia: 2.2,
};

/** Agua em ml por quilo, com acrescimo conforme atividade. */
const WATER_PER_KG = 35;
const WATER_ACTIVITY_BONUS: Record<ActivityLevel, number> = {
  sedentario: 0,
  leve: 200,
  moderado: 400,
  intenso: 600,
  atleta: 800,
};

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return round(weightKg / (heightM * heightM), 1);
}

export function bmiLabel(bmi: number): string {
  if (bmi <= 0) return "Indefinido";
  if (bmi < 18.5) return "Abaixo do peso";
  if (bmi < 25) return "Peso adequado";
  if (bmi < 30) return "Sobrepeso";
  return "Obesidade";
}

/** Mifflin-St Jeor. */
export function calculateBmr(input: GoalsInput): number {
  const { weightKg, heightCm, ageYears, sex } = input;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const value = sex === "masculino" ? base + 5 : base - 161;
  return Math.max(0, Math.round(value));
}

export function calculateGoals(input: GoalsInput): GoalsResult {
  const bmr = calculateBmr(input);
  const tdee = Math.round(bmr * ACTIVITY_FACTOR[input.activityLevel]);
  const targetCalories = Math.round(tdee * OBJECTIVE_FACTOR[input.objective]);

  const proteinGoalGrams = Math.round(
    input.weightKg * PROTEIN_PER_KG[input.objective],
  );
  const fatGoalGrams = Math.round((targetCalories * 0.25) / 9);
  const carbCalories =
    targetCalories - proteinGoalGrams * 4 - fatGoalGrams * 9;
  const carbGoalGrams = Math.max(0, Math.round(carbCalories / 4));

  const waterGoalMl =
    roundTo(
      input.weightKg * WATER_PER_KG + WATER_ACTIVITY_BONUS[input.activityLevel],
      50,
    );

  const bmi = calculateBmi(input.weightKg, input.heightCm);

  return {
    bmi,
    bmiLabel: bmiLabel(bmi),
    bmr,
    tdee,
    targetCalories,
    waterGoalMl,
    proteinGoalGrams,
    carbGoalGrams,
    fatGoalGrams,
  };
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}
