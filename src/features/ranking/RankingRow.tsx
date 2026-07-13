"use client";

import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { Monogram } from "@/components/common/Monogram";
import { cn } from "@/lib/utils";
import type { RankingEntry } from "@/types";
import { formatXp } from "@/utils/format";

/**
 * Linha do ranking.
 *
 * O `layout` do Framer Motion e a `key` estavel por pessoa fazem a troca de
 * posicao acontecer como movimento: quando a ordem do array muda, a linha
 * desliza ate o novo lugar em vez de reaparecer nele.
 */
export function RankingRow({
  entry,
  justRose,
  positionsGained,
}: {
  entry: RankingEntry;
  justRose: boolean;
  positionsGained: number;
}) {
  const highlight = entry.isCurrentUser;

  return (
    <motion.li
      layout
      layoutId={`ranking-row-${entry.id}`}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className={cn(
        "surface-card relative flex items-center gap-3 overflow-hidden px-3.5 py-3",
        highlight && "border-primary/40 ring-2 ring-primary/25",
      )}
      aria-current={highlight ? "true" : undefined}
    >
      {justRose ? (
        <motion.span
          aria-hidden
          initial={{ opacity: 0.55 }}
          animate={{ opacity: [0.55, 0.12, 0.55, 0] }}
          transition={{ duration: 2, times: [0, 0.35, 0.7, 1] }}
          className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/15"
        />
      ) : null}

      <span
        className={cn(
          "tabular w-6 shrink-0 text-center text-sm font-extrabold",
          highlight ? "text-primary" : "text-muted-foreground",
        )}
      >
        {entry.position}
      </span>

      <Monogram
        initials={entry.initials}
        highlight={highlight}
        className={cn("h-10 w-10", highlight && "ring-2 ring-primary/30")}
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm leading-tight",
            highlight ? "font-extrabold" : "font-semibold",
          )}
        >
          {entry.name}
          {highlight ? (
            <span className="ml-1.5 text-[11px] font-bold text-primary">
              você
            </span>
          ) : null}
        </p>
        <p className="tabular mt-0.5 text-[11px] text-muted-foreground">
          {formatXp(entry.xp)} XP nesta semana
        </p>
      </div>

      {justRose && positionsGained > 0 ? (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="tabular flex shrink-0 items-center gap-0.5 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary"
        >
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
          {positionsGained}
        </motion.span>
      ) : null}
    </motion.li>
  );
}
