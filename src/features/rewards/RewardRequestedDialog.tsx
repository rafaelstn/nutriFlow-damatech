"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NUTRITIONIST } from "@/config/app";

/**
 * Confirmacao do resgate.
 *
 * O resgate e uma solicitacao: nenhum ponto e debitado e nada e enviado. O
 * texto deixa isso explicito, para a demonstracao nao prometer o que o produto
 * ainda nao faz.
 */
export function RewardRequestedDialog({
  title,
  onOpenChange,
  onContinue,
}: {
  title: string | null;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}) {
  return (
    <Dialog open={title !== null} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2.5rem)] max-w-sm gap-0 rounded-3xl p-6"
      >
        {title ? (
          <>
            <DialogHeader className="items-center gap-0 text-center">
              <RequestSeal />

              <DialogTitle className="mt-5 text-xl font-extrabold tracking-tight">
                Recompensa solicitada
              </DialogTitle>

              <DialogDescription className="mt-2 text-sm leading-relaxed">
                {NUTRITIONIST.name} vai entrar em contato com você para combinar
                a entrega de {title}.
              </DialogDescription>
            </DialogHeader>

            <p className="mt-4 rounded-2xl border border-primary/15 bg-[var(--leaf-soft)] px-4 py-3 text-center text-xs font-semibold text-primary">
              Seus pontos continuam com você.
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

/** Selo animado do resgate: anel que se desenha em volta do presente. */
function RequestSeal() {
  return (
    <motion.div
      initial={{ scale: 0.65, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="relative flex h-24 w-24 items-center justify-center"
      aria-hidden
    >
      <motion.span
        initial={{ scale: 0.85, opacity: 0.4 }}
        animate={{ scale: 1.5, opacity: 0 }}
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
        <Gift className="h-7 w-7" strokeWidth={2.2} />
      </motion.span>
    </motion.div>
  );
}
