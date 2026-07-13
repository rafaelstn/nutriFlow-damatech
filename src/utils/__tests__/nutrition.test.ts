import { describe, expect, it } from "vitest";
import {
  bmiLabel,
  calculateBmi,
  calculateBmr,
  calculateGoals,
  type GoalsInput,
} from "../nutrition";
import { getLevelInfo, goalPercent } from "../gamification";

const BASE: GoalsInput = {
  weightKg: 65,
  heightCm: 165,
  ageYears: 32,
  sex: "feminino",
  objective: "manutencao",
  activityLevel: "moderado",
};

describe("Cálculo demonstrativo de metas", () => {
  it("calcula o IMC e classifica a faixa", () => {
    expect(calculateBmi(65, 165)).toBe(23.9);
    expect(bmiLabel(23.9)).toBe("Peso adequado");
    expect(bmiLabel(17)).toBe("Abaixo do peso");
    expect(bmiLabel(27)).toBe("Sobrepeso");
    expect(bmiLabel(32)).toBe("Obesidade");
  });

  it("protege contra entrada inválida em vez de devolver Infinity", () => {
    expect(calculateBmi(0, 165)).toBe(0);
    expect(calculateBmi(65, 0)).toBe(0);
    expect(bmiLabel(0)).toBe("Indefinido");
  });

  it("aplica Mifflin-St Jeor com a diferença por sexo", () => {
    const female = calculateBmr(BASE);
    const male = calculateBmr({ ...BASE, sex: "masculino" });

    // 10*65 + 6.25*165 - 5*32 - 161 = 1360,25 -> 1360
    expect(female).toBe(1360);
    expect(male - female).toBe(166);
  });

  it("ajusta as calorias conforme o objetivo", () => {
    const cut = calculateGoals({ ...BASE, objective: "emagrecimento" });
    const keep = calculateGoals({ ...BASE, objective: "manutencao" });
    const bulk = calculateGoals({ ...BASE, objective: "hipertrofia" });

    expect(cut.targetCalories).toBeLessThan(keep.targetCalories);
    expect(bulk.targetCalories).toBeGreaterThan(keep.targetCalories);
    expect(keep.targetCalories).toBe(keep.tdee);
  });

  it("aumenta a meta de proteína na hipertrofia e no emagrecimento", () => {
    const keep = calculateGoals(BASE);
    const bulk = calculateGoals({ ...BASE, objective: "hipertrofia" });

    expect(keep.proteinGoalGrams).toBe(104); // 65 * 1,6
    expect(bulk.proteinGoalGrams).toBe(143); // 65 * 2,2
  });

  it("aumenta a meta de água conforme o nível de atividade", () => {
    const sedentary = calculateGoals({ ...BASE, activityLevel: "sedentario" });
    const athlete = calculateGoals({ ...BASE, activityLevel: "atleta" });

    // 65 * 35 = 2275, arredondado para o múltiplo de 50 mais próximo.
    expect(sedentary.waterGoalMl).toBe(2300);
    expect(athlete.waterGoalMl).toBe(3100); // 2275 + 800 de bônus, arredondado
    expect(athlete.waterGoalMl).toBeGreaterThan(sedentary.waterGoalMl);
    expect(athlete.waterGoalMl % 50).toBe(0);
  });

  it("distribui os macros sem estourar as calorias-alvo", () => {
    const result = calculateGoals(BASE);
    const fromMacros =
      result.proteinGoalGrams * 4 +
      result.carbGoalGrams * 4 +
      result.fatGoalGrams * 9;

    expect(Math.abs(fromMacros - result.targetCalories)).toBeLessThanOrEqual(10);
  });
});

describe("Níveis e percentuais", () => {
  it("deriva o nível a partir do XP", () => {
    expect(getLevelInfo(0).name).toBe("Início");
    expect(getLevelInfo(3970).name).toBe("Evolução");
    expect(getLevelInfo(6000).name).toBe("Performance");
    expect(getLevelInfo(12000).name).toBe("Elite");
  });

  it("informa quanto falta para o próximo nível", () => {
    const level = getLevelInfo(3970);

    expect(level.nextLevelName).toBe("Performance");
    expect(level.xpToNextLevel).toBe(2030);
    expect(level.progressPercent).toBe(32);
  });

  it("trata o nível máximo sem próximo degrau", () => {
    const level = getLevelInfo(15000);

    expect(level.nextLevelName).toBeNull();
    expect(level.xpToNextLevel).toBe(0);
    expect(level.progressPercent).toBe(100);
  });

  it("limita o percentual de meta a 100", () => {
    expect(goalPercent(1800, 2500)).toBe(72);
    expect(goalPercent(3000, 2500)).toBe(100);
    expect(goalPercent(100, 0)).toBe(0);
  });
});
