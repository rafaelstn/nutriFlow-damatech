"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { LevelProgress } from "@/components/gamification/LevelProgress";
import { EmptyState, ErrorState } from "@/components/common/States";
import { GridCardsSkeleton } from "@/components/common/Skeletons";
import { useAsyncData } from "@/hooks/useAsyncData";
import { rewardsService } from "@/services";
import { applyRewardState, useProgressStore, useRewardsStore } from "@/stores";
import type { Reward } from "@/types";
import { RewardCard } from "./RewardCard";
import { RewardRequestedDialog } from "./RewardRequestedDialog";

export function RewardsScreen() {
  const xp = useProgressStore((state) => state.xp);
  const redeemedIds = useRewardsStore((state) => state.redeemedIds);
  const redeem = useRewardsStore((state) => state.redeem);

  // A disponibilidade e decidida no servico, contra o XP atual.
  const { data, status, reload } = useAsyncData(
    () => rewardsService.getRewards(xp),
    [xp],
    (list) => list.length === 0,
  );

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [requested, setRequested] = useState<string | null>(null);

  const rewards = useMemo(
    () => (data ? applyRewardState(data, redeemedIds) : []),
    [data, redeemedIds],
  );

  async function handleRedeem(reward: Reward) {
    if (pendingId) return;
    setPendingId(reward.id);

    try {
      const outcome = await redeem(reward.id, xp);

      // Guarda anti-duplicidade: a store reconfere depois da resposta.
      if (outcome.duplicate) {
        toast.info("Você já solicitou esta recompensa.");
        return;
      }

      setRequested(outcome.title);
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "Não foi possível solicitar agora. Tente novamente.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="pb-8">
      <ScreenHeader
        title="Recompensas"
        subtitle="Troque seus pontos por conteúdo e atendimento"
      />

      <section className="px-5 pt-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="surface-card p-4"
        >
          <LevelProgress xp={xp} />
          <p className="mt-3 border-t border-border/60 pt-3 text-[11px] leading-relaxed text-muted-foreground">
            O resgate é uma solicitação. Seus pontos não são debitados: a
            nutricionista entra em contato para combinar a entrega.
          </p>
        </motion.div>
      </section>

      <div className="px-5 pt-6">
        {status === "loading" ? <GridCardsSkeleton count={4} /> : null}

        {status === "error" ? (
          <ErrorState
            title="Não conseguimos carregar as recompensas"
            description="Verifique sua conexão e tente novamente. Seus pontos continuam salvos."
            onRetry={reload}
          />
        ) : null}

        {status === "empty" ? (
          <EmptyState
            icon={Gift}
            title="Nenhuma recompensa disponível"
            description="Assim que a nutricionista publicar novas recompensas, elas aparecem aqui."
          />
        ) : null}

        {status === "success" ? (
          <div className="space-y-4">
            {rewards.map((reward, index) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                currentXp={xp}
                index={index}
                pending={pendingId === reward.id}
                onRedeem={handleRedeem}
              />
            ))}
          </div>
        ) : null}
      </div>

      <RewardRequestedDialog
        title={requested}
        onOpenChange={(open) => {
          if (!open) setRequested(null);
        }}
        onContinue={() => setRequested(null)}
      />
    </div>
  );
}
