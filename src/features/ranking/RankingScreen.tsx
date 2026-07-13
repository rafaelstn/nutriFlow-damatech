"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Target, Trophy } from "lucide-react";
import { ErrorState } from "@/components/common/States";
import { RowsSkeleton } from "@/components/common/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/useAsyncData";
import { rankingService } from "@/services";
import { useProgressStore } from "@/stores";
import { formatXp } from "@/utils/format";
import { Podium } from "./Podium";
import { RankingRow } from "./RankingRow";

/** Ordinal em português: 1º, 2º, 3º. */
function ordinal(position: number): string {
  return `${position}º`;
}

/**
 * XP que esta tela mostrou da última vez, no escopo do módulo (sobrevive à
 * navegação entre telas, sem tocar em store nem em armazenamento).
 *
 * Serve a um ponto de produto, não a um enfeite: o ponto é conquistado em outra
 * tela (aula, água, desafio), então, sem isto, o ranking já montaria com a
 * posição nova e a ultrapassagem jamais seria vista. Guardando o último XP
 * exibido, a tela abre na posição anterior e executa a subida diante da usuária.
 */
let lastDisplayedXp: number | null = null;

/** Respiro antes da subida, para a lista já estar assentada quando ela acontece. */
const RISE_DELAY_MS = 700;
const RISE_HIGHLIGHT_MS = 2200;

/**
 * Janela em que um ganho recente ainda merece ser encenado. Cobre o caminho
 * natural (conquistou o ponto, abriu o ranking em seguida) mesmo quando a tela
 * é aberta do zero, e evita repetir a subida de um ganho antigo.
 */
const RECENT_GAIN_MS = 90_000;

/** XP em que a tela deve abrir: o anterior ao último ganho recente, se houver. */
function initialDisplayedXp(currentXp: number): number {
  if (lastDisplayedXp !== null) {
    return lastDisplayedXp < currentXp ? lastDisplayedXp : currentXp;
  }

  // Leitura única, sem assinar a store: só decide o ponto de partida da animação.
  const lastGain = useProgressStore.getState().xpEvents[0];
  if (!lastGain || lastGain.amount <= 0) return currentXp;

  const elapsed = Date.now() - new Date(lastGain.at).getTime();
  if (!Number.isFinite(elapsed) || elapsed > RECENT_GAIN_MS) return currentXp;

  return Math.max(0, currentXp - lastGain.amount);
}

export function RankingScreen() {
  const xp = useProgressStore((state) => state.xp);

  // Primeira carga: exercita skeleton e estado de erro como faria contra a API.
  const { status, reload } = useAsyncData(
    () => rankingService.getWeeklyRanking(xp),
    [],
  );

  // Abre no XP anterior quando houve ganho fora desta tela; senão, no XP atual.
  const [displayedXp, setDisplayedXp] = useState(() => initialDisplayedXp(xp));

  useEffect(() => {
    lastDisplayedXp = xp;
    if (displayedXp === xp || status !== "success") return;

    const timer = setTimeout(() => setDisplayedXp(xp), RISE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [xp, displayedXp, status]);

  /**
   * O ranking é derivado do XP, com a mesma regra do serviço: cada ponto
   * recalcula a ordem, e a posição sobe no instante da ultrapassagem.
   */
  const ranking = useMemo(
    () => rankingService.buildWeeklyRanking(displayedXp),
    [displayedXp],
  );
  const position = ranking.currentUserPosition;

  // A posição anterior fica num ref, fora do render, só para detectar a subida.
  const previousPosition = useRef<number | null>(null);
  const [rise, setRise] = useState<{ gained: number } | null>(null);

  useEffect(() => {
    if (status !== "success") return;

    const previous = previousPosition.current;
    previousPosition.current = position;

    if (previous === null || position >= previous) return;

    setRise({ gained: previous - position });
    const timer = setTimeout(() => setRise(null), RISE_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [position, status]);

  const podium = ranking.entries.slice(0, 3);
  const isLeader = position === 1;

  return (
    <div className="pb-8">
      <header className="flex items-start justify-between gap-3 px-5 pb-2 pt-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Ranking semanal
          </p>
          <h1 className="mt-0.5 truncate text-xl font-extrabold leading-tight tracking-tight">
            {ranking.leagueName}
          </h1>
        </div>

        <div className="shrink-0 rounded-2xl border border-border/70 bg-card px-3 py-1.5 text-right shadow-[var(--shadow-card)]">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Sua posição
          </p>
          <motion.p
            key={position}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="tabular text-base font-extrabold leading-tight text-primary"
          >
            {status === "success" ? ordinal(position) : "--"}
          </motion.p>
        </div>
      </header>

      {status === "loading" ? (
        <div className="space-y-6 px-5 pt-6">
          <div className="grid grid-cols-3 items-end gap-2">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-[13.5rem] w-full rounded-2xl" />
            <Skeleton className="h-[8.5rem] w-full rounded-2xl" />
          </div>
          <RowsSkeleton count={5} />
        </div>
      ) : null}

      {status === "error" ? (
        <div className="px-5 pt-6">
          <ErrorState
            title="Não conseguimos carregar o ranking"
            description="Verifique sua conexão e tente novamente. Seus pontos continuam salvos."
            onRetry={reload}
          />
        </div>
      ) : null}

      {status === "success" ? (
        <>
          <section className="px-5 pt-5" aria-label="Pódio da semana">
            <Podium entries={podium} />
          </section>

          <section className="px-5 pt-6">
            <motion.div
              key={isLeader ? "leader" : `chase-${position}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-2xl border border-primary/15 bg-[var(--leaf-soft)] px-4 py-3"
            >
              {isLeader ? (
                <p className="flex items-start gap-2 text-sm font-semibold leading-snug">
                  <Trophy
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--xp)]"
                    strokeWidth={2.2}
                    aria-hidden
                  />
                  Você lidera a {ranking.leagueName}. Mantenha o ritmo até o fim
                  da semana para não perder o topo.
                </p>
              ) : (
                <>
                  <p className="text-sm font-semibold leading-snug">
                    Você está a apenas{" "}
                    <span className="tabular font-extrabold text-primary">
                      {formatXp(ranking.xpToNextPosition ?? 0)} XP
                    </span>{" "}
                    do {ordinal(position - 1)} lugar.
                  </p>
                  {ranking.nextPositionName ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {ranking.nextPositionName} está logo acima de você.
                    </p>
                  ) : null}
                </>
              )}
            </motion.div>
          </section>

          <section className="px-5 pt-6" aria-label="Classificação completa">
            <h2 className="text-base font-extrabold tracking-tight">
              Classificação completa
            </h2>

            <ul className="mt-3 space-y-2.5">
              <AnimatePresence initial={false}>
                {ranking.entries.map((entry) => (
                  <RankingRow
                    key={entry.id}
                    entry={entry}
                    justRose={Boolean(rise) && entry.isCurrentUser}
                    positionsGained={rise?.gained ?? 0}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </section>

          <section className="px-5 pt-6">
            <Link
              href="/desafios"
              className="surface-card flex items-center gap-3 p-4 transition-shadow hover:shadow-[var(--shadow-float)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--leaf-soft)] text-primary">
                <Target className="h-5 w-5" strokeWidth={2.2} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">
                  Complete um desafio para subir
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Cada desafio concluído vale pontos e move você na tabela.
                </span>
              </span>
              <ChevronRight
                className="h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </Link>
          </section>
        </>
      ) : null}
    </div>
  );
}
