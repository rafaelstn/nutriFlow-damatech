"use client";

import { motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { MOCK_WEEKLY } from "@/mocks/weekly";

/**
 * Progresso semanal: número grande, barra de evolução e a leitura dia a dia.
 * O dia de maior adesão é destacado, para a conversa com a nutricionista ter
 * um ponto de partida.
 */
export function WeeklyProgressCard({ percent }: { percent: number }) {
  const best = MOCK_WEEKLY.reduce((top, point) =>
    point.adherence > top.adherence ? point : top,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
      className="surface-card overflow-hidden p-5"
      aria-label="Seu progresso semanal"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Seu progresso semanal
          </p>
          <p className="tabular mt-1 text-4xl font-extrabold leading-none tracking-tight">
            {percent}
            <span className="text-2xl text-muted-foreground">%</span>
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-2.5 py-1 text-[11px] font-bold text-primary">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
          +6 pts
        </span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.25 }}
          className="h-full rounded-full bg-primary"
        />
      </div>

      <div className="mt-4 h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={MOCK_WEEKLY}
            margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="28%"
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              dy={4}
            />
            <Bar dataKey="adherence" radius={[6, 6, 6, 6]} isAnimationActive>
              {MOCK_WEEKLY.map((point) => (
                <Cell
                  key={point.day}
                  fill={
                    point.day === best.day ? "var(--primary)" : "var(--secondary)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        Seu melhor dia foi <span className="font-semibold text-foreground">
          {best.day}
        </span>
        , com {best.adherence}% de adesão ao plano.
      </p>
    </motion.section>
  );
}
