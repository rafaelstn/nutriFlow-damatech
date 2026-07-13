"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Droplets, Info, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { EmptyState } from "@/components/common/States";
import { WaterBottle } from "./WaterBottle";
import { useProgressStore, useCelebrationStore } from "@/stores";
import { WATER_PRESETS_ML } from "@/services";
import { formatMl } from "@/utils/format";
import { goalPercent } from "@/utils/gamification";

interface WaterLog {
  id: string;
  amountMl: number;
  at: Date;
  xp: number;
}

const HYDRATION_TIP =
  "Deixe a garrafa cheia na mesa de trabalho. Beber pouco e sempre funciona melhor do que virar meio litro de uma vez.";

export function WaterScreen() {
  const consumed = useProgressStore((state) => state.waterConsumedMl);
  const goal = useProgressStore((state) => state.waterGoalMl);
  const addWater = useProgressStore((state) => state.addWater);
  const celebrateXp = useCelebrationStore((state) => state.celebrateXp);

  const [pendingMl, setPendingMl] = useState<number | null>(null);
  const [logs, setLogs] = useState<WaterLog[]>([]);

  const percent = goalPercent(consumed, goal);
  const reached = consumed >= goal;
  const remaining = Math.max(0, goal - consumed);

  const handleAdd = async (amountMl: number) => {
    if (pendingMl !== null) return;
    setPendingMl(amountMl);

    try {
      const { awardedXp } = await addWater(amountMl);

      setLogs((current) => [
        {
          id: `${Date.now()}-${amountMl}`,
          amountMl,
          at: new Date(),
          xp: awardedXp,
        },
        ...current,
      ]);

      if (awardedXp > 0) {
        celebrateXp(awardedXp);
        toast.success(`+${awardedXp} XP conquistados`, {
          description: `${formatMl(amountMl)} de água no seu registro de hoje.`,
        });
      } else {
        // Teto diário de XP atingido: a água entra, mas sem prometer pontos.
        toast.success(`${formatMl(amountMl)} registrados`, {
          description:
            "Você já alcançou o limite de pontos por hidratação hoje. O registro continua valendo.",
        });
      }
    } catch {
      toast.error("Não conseguimos registrar agora", {
        description: "Verifique sua conexão e tente novamente.",
      });
    } finally {
      setPendingMl(null);
    }
  };

  return (
    <div className="pb-10">
      <ScreenHeader title="Hidratação" subtitle="Sua meta de hoje" />

      <section
        className="flex flex-col items-center px-5 pt-6"
        aria-label="Consumo de água de hoje"
      >
        <AnimatePresence initial={false}>
          {reached ? (
            <motion.p
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--leaf-soft)] px-3 py-1.5 text-xs font-bold text-primary"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden />
              Meta batida
            </motion.p>
          ) : null}
        </AnimatePresence>

        <WaterBottle
          percent={percent}
          consumedLabel={formatMl(consumed)}
          goalLabel={formatMl(goal)}
        />

        <p className="tabular mt-5 text-center text-[32px] font-extrabold leading-none tracking-tight">
          {formatMl(consumed)}
        </p>
        <p className="tabular mt-1.5 text-sm text-muted-foreground">
          de {formatMl(goal)}
          <span aria-hidden> · </span>
          <span className="font-bold text-[var(--water)]">{percent}%</span>
        </p>

        <p className="mt-4 max-w-[30ch] text-center text-sm leading-relaxed text-muted-foreground">
          {reached
            ? `Meta cumprida com ${formatMl(consumed)}. Constância assim é o que muda o seu resultado.`
            : `Faltam ${formatMl(remaining)} para fechar o dia.`}
        </p>
      </section>

      <section className="px-5 pt-7" aria-label="Registrar consumo">
        <h2 className="text-sm font-bold">Registrar agora</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {WATER_PRESETS_ML.map((preset) => {
            const loading = pendingMl === preset;

            return (
              <button
                key={preset}
                type="button"
                onClick={() => handleAdd(preset)}
                disabled={pendingMl !== null}
                className="surface-card flex min-h-[76px] flex-col items-center justify-center gap-1 px-2 py-3 text-[var(--water)] ring-1 ring-inset ring-[var(--water)]/15 transition-all hover:shadow-[var(--shadow-float)] active:scale-[0.97] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                ) : (
                  <Plus className="h-5 w-5" strokeWidth={2.6} aria-hidden />
                )}
                <span className="tabular text-sm font-extrabold tracking-tight">
                  {preset} ml
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-5 pt-7" aria-label="Registros de hoje">
        <h2 className="text-sm font-bold">Registros desta sessão</h2>

        {logs.length === 0 ? (
          <EmptyState
            icon={Droplets}
            title="Nenhum copo registrado ainda"
            description="Toque em um dos volumes acima para começar a marcar sua hidratação."
            className="py-10"
          />
        ) : (
          <ul className="mt-3 space-y-2.5">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.li
                  key={log.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="surface-card flex items-center gap-3 p-3.5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--water-soft)] text-[var(--water)]">
                    <Droplets className="h-5 w-5" strokeWidth={2.2} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="tabular text-sm font-bold">
                      {formatMl(log.amountMl)}
                    </p>
                    <p className="tabular text-xs text-muted-foreground">
                      {log.at.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {log.xp > 0 ? (
                    <span className="tabular shrink-0 rounded-full bg-[var(--xp-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--xp)]">
                      +{log.xp} XP
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                      Registrado
                    </span>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <section className="px-5 pt-6">
        <div className="flex gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
          <Info
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {HYDRATION_TIP}
          </p>
        </div>
      </section>
    </div>
  );
}
