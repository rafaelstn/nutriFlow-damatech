"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { Monogram } from "@/components/common/Monogram";
import { cn } from "@/lib/utils";
import type { RankingEntry } from "@/types";
import { formatXp } from "@/utils/format";

/**
 * Podio das tres primeiras. Sobrio de proposito: a hierarquia vem da altura do
 * degrau, do tamanho do avatar e do peso tipografico, nao de brilho nem de
 * medalha colorida. Os tres degraus assentam na mesma base, entao a leitura de
 * primeiro, segundo e terceiro e imediata, sem precisar ler o numero.
 */
export function Podium({ entries }: { entries: RankingEntry[] }) {
  const [first, second, third] = entries;
  if (!first) return null;

  const order = [second, first, third].filter(Boolean) as RankingEntry[];

  return (
    <div className="relative">
      <div className="grid grid-cols-3 items-end gap-2">
        {order.map((entry) => (
          <PodiumTile key={entry.id} entry={entry} />
        ))}
      </div>
      <div className="h-1 rounded-full bg-border/70" aria-hidden />
    </div>
  );
}

/**
 * Escala de cada lugar. A diferenca de altura entre os degraus (92, 68, 52) e
 * grande o bastante para ser lida de relance, e o avatar acompanha o degrau.
 */
const TIER: Record<
  number,
  { step: string; avatar: string; name: string; number: string }
> = {
  1: {
    step: "h-[92px]",
    avatar: "h-16 w-16 text-lg",
    name: "text-xs",
    number: "text-base",
  },
  2: {
    step: "h-[68px]",
    avatar: "h-[52px] w-[52px] text-sm",
    name: "text-[11px]",
    number: "text-sm",
  },
  3: {
    step: "h-[52px]",
    avatar: "h-11 w-11 text-xs",
    name: "text-[11px]",
    number: "text-sm",
  },
};

const FALLBACK_TIER = TIER[3];

function PodiumTile({ entry }: { entry: RankingEntry }) {
  const isFirst = entry.position === 1;
  const highlight = entry.isCurrentUser;
  const tier = TIER[entry.position] ?? FALLBACK_TIER;

  return (
    <motion.div
      layout
      layoutId={`podium-${entry.id}`}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col items-center"
    >
      {isFirst ? (
        <Crown
          className="mb-1.5 h-5 w-5 text-[var(--xp)]"
          strokeWidth={2.4}
          aria-hidden
        />
      ) : null}

      <Monogram
        initials={entry.initials}
        highlight={highlight}
        className={cn(
          tier.avatar,
          highlight ? "ring-2 ring-primary/40" : "ring-1 ring-border/70",
        )}
      />

      <p
        className={cn(
          "mt-2 w-full truncate px-0.5 text-center leading-tight",
          tier.name,
          highlight ? "font-extrabold text-primary" : "font-bold",
        )}
      >
        {entry.isCurrentUser ? "Você" : entry.name.split(" ")[0]}
      </p>
      <p className="tabular text-[10px] font-semibold text-muted-foreground">
        {formatXp(entry.xp)} XP
      </p>

      <div
        className={cn(
          "mt-2 flex w-full items-start justify-center rounded-t-2xl pt-2.5",
          tier.step,
          highlight
            ? "bg-primary/12 ring-1 ring-inset ring-primary/25"
            : "bg-secondary ring-1 ring-inset ring-border/50",
        )}
      >
        <span
          className={cn(
            "tabular font-extrabold leading-none",
            tier.number,
            highlight ? "text-primary" : "text-secondary-foreground",
          )}
        >
          {entry.position}
        </span>
      </div>
    </motion.div>
  );
}
