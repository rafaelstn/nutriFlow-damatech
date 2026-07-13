"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

/**
 * Divisao de macronutrientes em kcal.
 *
 * O rosco mostra proporcao, nao valor absoluto: por isso o numero grande fica no
 * centro (calorias do dia) e a leitura fina fica na legenda, em gramas.
 */

const KCAL_PER_GRAM = { protein: 4, carb: 4, fat: 9 } as const;

export function MacrosDonut({
  proteinGrams,
  carbGrams,
  fatGrams,
  targetCalories,
}: {
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  targetCalories: number;
}) {
  const slices = [
    {
      key: "protein",
      label: "Proteína",
      grams: proteinGrams,
      calories: proteinGrams * KCAL_PER_GRAM.protein,
      color: "var(--protein)",
    },
    {
      key: "carb",
      label: "Carboidrato",
      grams: carbGrams,
      calories: carbGrams * KCAL_PER_GRAM.carb,
      color: "var(--water)",
    },
    {
      key: "fat",
      label: "Gordura",
      grams: fatGrams,
      calories: fatGrams * KCAL_PER_GRAM.fat,
      color: "var(--xp)",
    },
  ];

  const totalCalories = slices.reduce((sum, slice) => sum + slice.calories, 0);

  const percentOf = (calories: number) =>
    totalCalories > 0 ? Math.round((calories / totalCalories) * 100) : 0;

  return (
    <section className="surface-card p-5" aria-label="Divisão de macronutrientes">
      <p className="text-sm font-bold">Divisão dos macros</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Como distribuir as calorias ao longo do dia.
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-[116px] w-[116px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="calories"
                nameKey="label"
                innerRadius={38}
                outerRadius={56}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive
              >
                {slices.map((slice) => (
                  <Cell key={slice.key} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="tabular text-lg font-extrabold leading-none tracking-tight">
              {targetCalories}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              kcal
            </span>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-3">
          {slices.map((slice) => (
            <li key={slice.key} className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold leading-tight">
                  {slice.label}
                </span>
                <span className="tabular block text-[11px] leading-tight text-muted-foreground">
                  {percentOf(slice.calories)}% das calorias
                </span>
              </span>
              <span className="tabular shrink-0 text-xs font-bold">
                {slice.grams}g
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
