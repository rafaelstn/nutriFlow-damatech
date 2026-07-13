"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/types";
import { formatXp } from "@/utils/format";
import { goalPercent } from "@/utils/gamification";
import { CHALLENGE_ICONS, CHALLENGE_TONES } from "./icons";

/**
 * Rotulo do botao de registro.
 *
 * O desafio guarda a unidade do progresso ("dias", "refeições", "pratos"), entao
 * o texto acompanha o dominio em vez de assumir que todo avanco e um dia.
 */
function registerLabel(unit: string): string {
  switch (unit) {
    case "refeições":
      return "Registrar refeição concluída";
    case "pratos":
      return "Registrar prato concluído";
    default:
      return "Registrar dia concluído";
  }
}

export function ChallengeCard({
  challenge,
  index,
  pending,
  onRegister,
}: {
  challenge: Challenge;
  index: number;
  pending: boolean;
  onRegister: (challenge: Challenge) => void;
}) {
  const Icon = CHALLENGE_ICONS[challenge.icon];
  const tone = CHALLENGE_TONES[challenge.icon];
  const completed = challenge.status === "completed";
  const percent = goalPercent(challenge.currentProgress, challenge.targetProgress);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
      className={cn(
        "surface-card p-4",
        completed && "border-primary/25 bg-[var(--leaf-soft)]/40",
      )}
      aria-label={challenge.title}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            completed ? "bg-primary text-primary-foreground" : tone.chip,
          )}
        >
          {completed ? (
            <Check className="h-6 w-6" strokeWidth={2.6} aria-hidden />
          ) : (
            <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm font-bold leading-snug">{challenge.title}</h2>
            {completed ? (
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                Concluído
              </span>
            ) : (
              <span className="tabular shrink-0 rounded-full bg-[var(--xp-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--xp)]">
                +{formatXp(challenge.xpReward)} XP
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {challenge.description}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-end justify-between gap-2">
          <p className="tabular text-xs font-bold">
            {challenge.currentProgress} de {challenge.targetProgress}{" "}
            <span className="font-medium text-muted-foreground">
              {challenge.unit}
            </span>
          </p>
          <p className="tabular text-xs font-bold text-muted-foreground">
            {percent}%
          </p>
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            className={cn(
              "h-full rounded-full",
              completed ? "bg-primary" : tone.bar,
            )}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[11px] font-medium text-muted-foreground">
          Recompensa: {challenge.rewardName}
        </p>
      </div>

      {completed ? (
        <p className="mt-3 flex items-center justify-center gap-1.5 rounded-2xl border border-primary/20 bg-card px-4 py-3 text-xs font-bold text-primary">
          <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden />
          Desafio concluído, {formatXp(challenge.xpReward)} XP creditados
        </p>
      ) : (
        <Button
          onClick={() => onRegister(challenge)}
          disabled={pending}
          className="mt-3 h-11 w-full rounded-2xl text-sm font-bold"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Registrando
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" strokeWidth={2.6} aria-hidden />
              {registerLabel(challenge.unit)}
            </>
          )}
        </Button>
      )}
    </motion.article>
  );
}
