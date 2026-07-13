"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useCelebrationStore } from "@/stores/celebration.store";
import { formatXp } from "@/utils/format";

/**
 * Comemoração de XP, única para todo o aplicativo.
 *
 * Qualquer ação que pontue chama `celebrateXp` e recebe exatamente o mesmo
 * feedback visual. Fica sobre a moldura, sem bloquear a interação.
 */
export function XpOverlay() {
  const xpGain = useCelebrationStore((state) => state.xpGain);
  const clearXp = useCelebrationStore((state) => state.clearXp);

  useEffect(() => {
    if (!xpGain) return;
    const timer = setTimeout(clearXp, 1600);
    return () => clearTimeout(timer);
  }, [xpGain, clearXp]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center">
      <AnimatePresence>
        {xpGain ? (
          <motion.div
            key={xpGain.key}
            initial={{ opacity: 0, scale: 0.7, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0.55, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.9 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[var(--xp)]"
            />
            <div className="relative flex items-center gap-2.5 rounded-full border border-[var(--xp)]/35 bg-card px-6 py-3.5 shadow-[var(--shadow-float)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--xp-soft)]">
                <Sparkles
                  className="h-5 w-5 text-[var(--xp)]"
                  strokeWidth={2.2}
                  aria-hidden
                />
              </span>
              <span className="tabular text-xl font-extrabold tracking-tight text-foreground">
                +{formatXp(xpGain.amount)} XP
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
