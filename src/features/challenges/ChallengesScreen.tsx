"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, ErrorState } from "@/components/common/States";
import { CardListSkeleton } from "@/components/common/Skeletons";
import { useAsyncData } from "@/hooks/useAsyncData";
import { challengesService } from "@/services";
import {
  applyChallengeProgress,
  useChallengesStore,
  useCelebrationStore,
} from "@/stores";
import type { Challenge } from "@/types";
import { pluralize } from "@/utils/format";
import { ChallengeCard } from "./ChallengeCard";
import {
  ChallengeCompletedDialog,
  type ChallengeCompletion,
} from "./ChallengeCompletedDialog";

export function ChallengesScreen() {
  // Zustand campo a campo: a tela nunca reage a mudancas que nao usa.
  const progressById = useChallengesStore((state) => state.progressById);
  const completedIds = useChallengesStore((state) => state.completedIds);
  const registerDay = useChallengesStore((state) => state.registerDay);
  const celebrateXp = useCelebrationStore((state) => state.celebrateXp);

  const { data, status, reload } = useAsyncData(
    () => challengesService.getChallenges(),
    [],
    (list) => list.length === 0,
  );

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [completion, setCompletion] = useState<ChallengeCompletion | null>(null);

  /**
   * O servico entrega o catalogo de desafios; a store guarda o progresso da
   * usuaria. `applyChallengeProgress` cruza os dois: a tela nunca lê do mock.
   */
  const challenges = useMemo(
    () =>
      data ? applyChallengeProgress(data, progressById, completedIds) : [],
    [data, progressById, completedIds],
  );

  const doneCount = challenges.filter(
    (challenge) => challenge.status === "completed",
  ).length;
  const activeCount = challenges.length - doneCount;

  async function handleRegister(challenge: Challenge) {
    if (pendingId) return;
    setPendingId(challenge.id);

    try {
      const outcome = await registerDay(challenge.id);

      // A store protege contra duplicidade; a interface apenas informa.
      if (outcome.duplicate) {
        toast.info("Você já concluiu este desafio.", {
          description: "Os pontos deste desafio já foram creditados.",
        });
        return;
      }

      if (outcome.completed) {
        if (outcome.awardedXp > 0) {
          setCompletion({
            title: challenge.title,
            awardedXp: outcome.awardedXp,
            rewardName: challenge.rewardName,
          });
        } else {
          toast.success("Desafio concluído.");
        }
        return;
      }

      // Avanco intermediario: reconhecimento discreto, sem comemoracao.
      toast.success("Avanço registrado", {
        description: `${outcome.currentProgress} de ${challenge.targetProgress} ${challenge.unit} em ${challenge.title}.`,
      });
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "Não foi possível registrar o seu avanço. Tente novamente.",
      );
    } finally {
      setPendingId(null);
    }
  }

  /**
   * A comemoracao de XP dispara ao fechar o diálogo, e não junto com ele: as
   * duas camadas ficam centralizadas na tela e se atropelariam visualmente.
   * O ponto já foi creditado na store no momento do registro.
   */
  function closeCompletion() {
    const awardedXp = completion?.awardedXp ?? 0;
    setCompletion(null);
    if (awardedXp > 0) celebrateXp(awardedXp);
  }

  return (
    <div className="pb-8">
      <header className="px-5 pb-2 pt-6">
        <p className="text-sm font-medium text-muted-foreground">
          Sua liga desta semana
        </p>
        <h1 className="mt-0.5 text-xl font-extrabold leading-tight tracking-tight">
          Desafios
        </h1>

        {status === "success" ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="tabular mt-2 text-xs text-muted-foreground"
          >
            {activeCount} {pluralize(activeCount, "desafio ativo", "desafios ativos")}
            {doneCount > 0
              ? `, ${doneCount} ${pluralize(doneCount, "concluído", "concluídos")}`
              : null}
            . Cada conclusão vale pontos na Liga Evolução.
          </motion.p>
        ) : null}
      </header>

      <div className="px-5 pt-4">
        {status === "loading" ? <CardListSkeleton count={4} /> : null}

        {status === "error" ? (
          <ErrorState
            title="Não conseguimos carregar os desafios"
            description="Verifique sua conexão e tente novamente. Seu progresso continua salvo."
            onRetry={reload}
          />
        ) : null}

        {status === "empty" ? (
          <EmptyState
            icon={Target}
            title="Nenhum desafio por aqui"
            description="Assim que a nutricionista publicar um novo desafio, ele aparece nesta tela."
          />
        ) : null}

        {status === "success" ? (
          <div className="space-y-3">
            {challenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                index={index}
                pending={pendingId === challenge.id}
                onRegister={handleRegister}
              />
            ))}
          </div>
        ) : null}
      </div>

      <ChallengeCompletedDialog
        completion={completion}
        onOpenChange={(open) => {
          if (!open) closeCompletion();
        }}
        onContinue={closeCompletion}
      />
    </div>
  );
}
