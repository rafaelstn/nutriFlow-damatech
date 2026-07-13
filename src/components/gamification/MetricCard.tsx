"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type MetricTone = "water" | "protein" | "streak" | "xp" | "leaf";

const TONE: Record<MetricTone, { icon: string; bar: string; ring: string }> = {
  water: {
    icon: "bg-[var(--water-soft)] text-[var(--water)]",
    bar: "bg-[var(--water)]",
    ring: "ring-[var(--water)]/15",
  },
  protein: {
    icon: "bg-[var(--protein-soft)] text-[var(--protein)]",
    bar: "bg-[var(--protein)]",
    ring: "ring-[var(--protein)]/15",
  },
  streak: {
    icon: "bg-[var(--streak-soft)] text-[var(--streak)]",
    bar: "bg-[var(--streak)]",
    ring: "ring-[var(--streak)]/15",
  },
  xp: {
    icon: "bg-[var(--xp-soft)] text-[var(--xp)]",
    bar: "bg-[var(--xp)]",
    ring: "ring-[var(--xp)]/15",
  },
  leaf: {
    icon: "bg-[var(--leaf-soft)] text-[var(--leaf)]",
    bar: "bg-[var(--leaf)]",
    ring: "ring-[var(--leaf)]/15",
  },
};

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone: MetricTone;
  /** Percentual 0 a 100. Quando ausente, o card não exibe barra. */
  percent?: number;
  href?: string;
  index?: number;
}

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  percent,
  href,
  index = 0,
}: MetricCardProps) {
  const styles = TONE[tone];

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
      className={cn(
        "surface-card h-full p-4 ring-1 ring-inset transition-shadow",
        styles.ring,
        href && "hover:shadow-[var(--shadow-float)]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            styles.icon,
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
        </span>
      </div>

      <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="tabular mt-0.5 text-lg font-extrabold leading-tight tracking-tight">
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
      ) : null}

      {typeof percent === "number" ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className={cn("h-full rounded-full", styles.bar)}
          />
        </div>
      ) : null}
    </motion.div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block h-full focus-visible:outline-none">
      {content}
    </Link>
  );
}
