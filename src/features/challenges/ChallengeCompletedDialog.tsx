"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatXp } from "@/utils/format";

export interface ChallengeCompletion {
  title: string;
  awardedXp: number;
  rewardName: string;
}

/**
 * Conclusao de desafio.
 *
 * O XP exibido vem sempre do retorno da store (`awardedXp`), nunca de um valor
 * fixo na interface: se a regra de pontuacao mudar, a tela acompanha sozinha.
 */
export function ChallengeCompletedDialog({
  completion,
  onOpenChange,
  onContinue,
}: {
  completion: ChallengeCompletion | null;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}) {
  return (
    <Dialog open={completion !== null} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2.5rem)] max-w-sm gap-0 rounded-3xl p-6"
      >
        {completion ? (
          <>
            <DialogHeader className="items-center gap-0 text-center">
              <CompletionSeal />

              <DialogTitle className="mt-5 text-xl font-extrabold tracking-tight">
                Desafio concluído!
              </DialogTitle>

              <DialogDescription className="mt-2 text-sm leading-relaxed">
                Você conquistou{" "}
                <span className="tabular font-bold text-foreground">
                  {formatXp(completion.awardedXp)} XP
                </span>{" "}
                em {completion.title}.
              </DialogDescription>
            </DialogHeader>

            <p className="mt-4 rounded-2xl border border-primary/15 bg-[var(--leaf-soft)] px-4 py-3 text-center text-xs font-semibold text-primary">
              {completion.rewardName} liberado
            </p>

            <Button
              onClick={onContinue}
              className="mt-5 h-12 w-full rounded-2xl text-sm font-bold"
            >
              Continuar
            </Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/** Selo animado: anel que se desenha, pulso de luz e marca de confirmacao. */
function CompletionSeal() {
  return (
    <motion.div
      initial={{ scale: 0.65, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="relative flex h-24 w-24 items-center justify-center"
      aria-hidden
    >
      <motion.span
        initial={{ scale: 0.85, opacity: 0.45 }}
        animate={{ scale: 1.55, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
        className="absolute inset-0 rounded-full bg-primary"
      />

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="5"
          className="stroke-primary/15"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          className="stroke-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeInOut", delay: 0.1 }}
        />
      </svg>

      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 340, damping: 16, delay: 0.5 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--leaf-soft)] text-primary"
      >
        <Check className="h-8 w-8" strokeWidth={2.6} />
      </motion.span>
    </motion.div>
  );
}
