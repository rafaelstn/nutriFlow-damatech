"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLevelInfo } from "@/utils/gamification";
import { formatXp } from "@/utils/format";

/** Faixa de nível: nome, XP total e quanto falta para o próximo degrau. */
export function LevelProgress({
  xp,
  className,
  compact = false,
}: {
  xp: number;
  className?: string;
  compact?: boolean;
}) {
  const level = getLevelInfo(xp);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Nível
          </p>
          <p className="text-sm font-bold leading-tight">{level.name}</p>
        </div>
        <p className="tabular text-sm font-bold text-[var(--xp)]">
          {formatXp(xp)} XP
        </p>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level.progressPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-[var(--xp)]"
        />
      </div>

      {!compact && level.nextLevelName ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Faltam{" "}
          <span className="tabular font-semibold text-foreground">
            {formatXp(level.xpToNextLevel)} XP
          </span>{" "}
          para o nível {level.nextLevelName}.
        </p>
      ) : null}

      {!compact && !level.nextLevelName ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Você chegou ao nível máximo da trilha.
        </p>
      ) : null}
    </div>
  );
}
