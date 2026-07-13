"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Reward } from "@/types";
import { formatXp } from "@/utils/format";

export function RewardCard({
  reward,
  currentXp,
  index,
  pending,
  onRedeem,
}: {
  reward: Reward;
  currentXp: number;
  index: number;
  pending: boolean;
  onRedeem: (reward: Reward) => void;
}) {
  const locked = !reward.available && !reward.redeemed;
  const missing = Math.max(0, reward.requiredPoints - currentXp);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
      className="surface-card overflow-hidden"
      aria-label={reward.title}
    >
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={reward.image}
          alt=""
          fill
          sizes="(max-width: 480px) 100vw, 420px"
          className={cn(
            "object-cover",
            // Bloqueada: esmaecida, mas ainda legivel e desejavel.
            locked && "opacity-55 saturate-50",
          )}
        />

        {locked ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold text-muted-foreground backdrop-blur-sm">
            <Lock className="h-3 w-3" strokeWidth={2.4} aria-hidden />
            Bloqueada
          </span>
        ) : null}

        {reward.redeemed ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
            <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
            Solicitada
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-bold leading-snug">{reward.title}</h2>
          <span className="tabular shrink-0 rounded-full bg-[var(--xp-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--xp)]">
            {formatXp(reward.requiredPoints)} pontos
          </span>
        </div>

        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {reward.description}
        </p>

        {locked ? (
          <p className="tabular mt-3 text-xs font-semibold text-muted-foreground">
            Faltam{" "}
            <span className="font-extrabold text-foreground">
              {formatXp(missing)} XP
            </span>{" "}
            para liberar.
          </p>
        ) : null}

        <Button
          onClick={() => onRedeem(reward)}
          disabled={locked || reward.redeemed || pending}
          variant={locked || reward.redeemed ? "secondary" : "default"}
          className="mt-3 h-11 w-full rounded-2xl text-sm font-bold"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Solicitando
            </>
          ) : reward.redeemed ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden />
              Solicitada
            </>
          ) : locked ? (
            <>
              <Lock className="h-4 w-4" strokeWidth={2.4} aria-hidden />
              Bloqueada
            </>
          ) : (
            "Resgatar"
          )}
        </Button>
      </div>
    </motion.article>
  );
}
