import { beforeEach, describe, expect, it } from "vitest";
import { useProgressStore } from "../progress.store";
import { useLessonsStore } from "../lessons.store";
import { useRecipesStore } from "../recipes.store";
import { useChallengesStore } from "../challenges.store";
import { useRewardsStore } from "../rewards.store";
import { resetDemo } from "../reset";
import { MOCK_USER } from "@/mocks/user";
import { XP_RULES } from "@/config/app";

/**
 * Testes do motor de gamificação: é o coração da demonstração e o que não pode
 * quebrar na frente do cliente.
 */

const progress = () => useProgressStore.getState();
const lessons = () => useLessonsStore.getState();
const recipes = () => useRecipesStore.getState();
const challenges = () => useChallengesStore.getState();
const rewards = () => useRewardsStore.getState();

beforeEach(() => {
  resetDemo();
});

describe("XP", () => {
  it("credita XP e registra o evento", () => {
    const before = progress().xp;

    const credited = progress().addXp(50, "lesson", "Aula concluída");

    expect(credited).toBe(50);
    expect(progress().xp).toBe(before + 50);
    expect(progress().xpEvents[0]).toMatchObject({
      amount: 50,
      source: "lesson",
    });
  });

  it("ignora valor inválido, sem creditar nem poluir o histórico", () => {
    const before = progress().xp;

    expect(progress().addXp(0, "water", "Zero")).toBe(0);
    expect(progress().addXp(-100, "water", "Negativo")).toBe(0);
    expect(progress().addXp(Number.NaN, "water", "Inválido")).toBe(0);

    expect(progress().xp).toBe(before);
    expect(progress().xpEvents).toHaveLength(0);
  });
});

describe("Aulas", () => {
  it("concede 50 XP ao concluir uma aula", async () => {
    const before = progress().xp;

    const outcome = await lessons().completeLesson("l-proteina");

    expect(outcome).toEqual({ awardedXp: XP_RULES.completeLesson, duplicate: false });
    expect(progress().xp).toBe(before + XP_RULES.completeLesson);
    expect(lessons().completedIds).toContain("l-proteina");
    expect(lessons().progressById["l-proteina"]).toBe(100);
  });

  it("não paga XP duas vezes pela mesma aula", async () => {
    await lessons().completeLesson("l-proteina");
    const afterFirst = progress().xp;

    const outcome = await lessons().completeLesson("l-proteina");

    expect(outcome).toEqual({ awardedXp: 0, duplicate: true });
    expect(progress().xp).toBe(afterFirst);
  });

  it("não paga XP por aula que já vem concluída do catálogo", async () => {
    const before = progress().xp;

    const outcome = await lessons().completeLesson("l-prato-equilibrado");

    expect(outcome.duplicate).toBe(true);
    expect(progress().xp).toBe(before);
  });

  it("bloqueia XP duplicado quando a usuária toca duas vezes seguidas", async () => {
    const before = progress().xp;

    const [first, second] = await Promise.all([
      lessons().completeLesson("l-constancia"),
      lessons().completeLesson("l-constancia"),
    ]);

    const awarded = first.awardedXp + second.awardedXp;
    expect(awarded).toBe(XP_RULES.completeLesson);
    expect(progress().xp).toBe(before + XP_RULES.completeLesson);
  });
});

describe("Receitas", () => {
  it("concede 30 XP ao marcar como preparada", async () => {
    const before = progress().xp;

    const outcome = await recipes().prepareRecipe("r-panqueca-proteica");

    expect(outcome).toEqual({ awardedXp: XP_RULES.prepareRecipe, duplicate: false });
    expect(progress().xp).toBe(before + XP_RULES.prepareRecipe);
  });

  it("não repete XP da mesma receita durante a demonstração", async () => {
    await recipes().prepareRecipe("r-panqueca-proteica");
    const afterFirst = progress().xp;

    const outcome = await recipes().prepareRecipe("r-panqueca-proteica");

    expect(outcome).toEqual({ awardedXp: 0, duplicate: true });
    expect(progress().xp).toBe(afterFirst);
  });
});

describe("Água", () => {
  it("soma o volume e concede 10 XP por registro", async () => {
    const beforeXp = progress().xp;
    const beforeMl = progress().waterConsumedMl;

    const result = await progress().addWater(500);

    expect(result.awardedXp).toBe(XP_RULES.logWater);
    expect(progress().waterConsumedMl).toBe(beforeMl + 500);
    expect(progress().xp).toBe(beforeXp + XP_RULES.logWater);
  });

  it("continua registrando água depois do teto diário, mas sem pagar XP", async () => {
    for (let i = 0; i < XP_RULES.maxWaterLogsPerDay; i += 1) {
      await progress().addWater(200);
    }

    const xpAtCap = progress().xp;
    const mlAtCap = progress().waterConsumedMl;

    const result = await progress().addWater(200);

    expect(result.awardedXp).toBe(0);
    expect(progress().xp).toBe(xpAtCap);
    expect(progress().waterConsumedMl).toBe(mlAtCap + 200);
  });

  it("recusa volume inválido", async () => {
    await expect(progress().addWater(0)).rejects.toThrow();
    await expect(progress().addWater(-300)).rejects.toThrow();
  });
});

describe("Desafios", () => {
  it("avança sem pagar XP antes de concluir", async () => {
    const before = progress().xp;

    const outcome = await challenges().registerDay("c-hidratacao");

    expect(outcome.currentProgress).toBe(6);
    expect(outcome.completed).toBe(false);
    expect(outcome.awardedXp).toBe(0);
    expect(progress().xp).toBe(before);
  });

  it("paga o XP configurado ao concluir o desafio", async () => {
    const before = progress().xp;

    await challenges().registerDay("c-hidratacao");
    const outcome = await challenges().registerDay("c-hidratacao");

    expect(outcome.currentProgress).toBe(7);
    expect(outcome.completed).toBe(true);
    expect(outcome.awardedXp).toBe(300);
    expect(progress().xp).toBe(before + 300);
  });

  it("não paga XP de novo em desafio já concluído", async () => {
    await challenges().registerDay("c-hidratacao");
    await challenges().registerDay("c-hidratacao");
    const afterCompletion = progress().xp;

    const outcome = await challenges().registerDay("c-hidratacao");

    expect(outcome.duplicate).toBe(true);
    expect(outcome.awardedXp).toBe(0);
    expect(progress().xp).toBe(afterCompletion);
  });
});

describe("Recompensas", () => {
  it("permite resgatar o que está ao alcance do XP atual", async () => {
    const outcome = await rewards().redeem("rw-ebook", progress().xp);

    expect(outcome.duplicate).toBe(false);
    expect(rewards().redeemedIds).toContain("rw-ebook");
  });

  it("recusa recompensa acima do XP atual", async () => {
    await expect(
      rewards().redeem("rw-kit-suplementos", progress().xp),
    ).rejects.toThrow();
    expect(rewards().redeemedIds).not.toContain("rw-kit-suplementos");
  });

  it("impede resgate duplicado da mesma recompensa", async () => {
    await rewards().redeem("rw-ebook", progress().xp);

    await expect(rewards().redeem("rw-ebook", progress().xp)).rejects.toThrow();
    expect(rewards().redeemedIds.filter((id) => id === "rw-ebook")).toHaveLength(1);
  });
});

describe("Reset da demonstração", () => {
  it("restaura XP, água, aulas, receitas, desafios e recompensas", async () => {
    await lessons().completeLesson("l-proteina");
    await recipes().prepareRecipe("r-panqueca-proteica");
    await progress().addWater(500);
    await challenges().registerDay("c-hidratacao");
    await rewards().redeem("rw-ebook", progress().xp);

    expect(progress().xp).toBeGreaterThan(MOCK_USER.xp);

    resetDemo();

    expect(progress().xp).toBe(MOCK_USER.xp);
    expect(progress().waterConsumedMl).toBe(MOCK_USER.waterConsumedMl);
    expect(progress().xpEvents).toHaveLength(0);
    expect(progress().waterLogsWithXp).toBe(0);
    expect(lessons().completedIds).toEqual(["l-prato-equilibrado"]);
    expect(recipes().preparedIds).toEqual([]);
    expect(challenges().completedIds).toEqual([]);
    expect(challenges().progressById["c-hidratacao"]).toBe(5);
    expect(rewards().redeemedIds).toEqual([]);
  });
});
