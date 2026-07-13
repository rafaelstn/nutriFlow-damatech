"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Beef,
  ChevronRight,
  Droplets,
  Flame,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { MetricCard } from "@/components/gamification/MetricCard";
import { Monogram } from "@/components/common/Monogram";
import { WeeklyProgressCard } from "./WeeklyProgressCard";
import { useAuthStore, firstName, useProgressStore } from "@/stores";
import { useLessonsStore } from "@/stores/lessons.store";
import { useChallengesStore } from "@/stores/challenges.store";
import { MOCK_LESSONS } from "@/mocks/lessons";
import { MOCK_CHALLENGES } from "@/mocks/challenges";
import { NUTRI_TIPS } from "@/mocks/user";
import { NUTRITIONIST } from "@/config/app";
import { formatLiters, formatXp, greeting, pluralize } from "@/utils/format";
import { goalPercent } from "@/utils/gamification";

export function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  const xp = useProgressStore((state) => state.xp);
  const streak = useProgressStore((state) => state.currentStreak);
  const waterConsumedMl = useProgressStore((state) => state.waterConsumedMl);
  const waterGoalMl = useProgressStore((state) => state.waterGoalMl);
  const proteinConsumed = useProgressStore((state) => state.proteinConsumedGrams);
  const proteinGoal = useProgressStore((state) => state.proteinGoalGrams);
  const weeklyProgress = useProgressStore((state) => state.weeklyProgress);

  const completedIds = useLessonsStore((state) => state.completedIds);
  const lessonProgress = useLessonsStore((state) => state.progressById);
  const challengeProgress = useChallengesStore((state) => state.progressById);
  const challengeCompleted = useChallengesStore((state) => state.completedIds);

  // Continue de onde parou: a aula mais avançada que ainda não foi concluída.
  const inProgress =
    MOCK_LESSONS.filter((lesson) => !completedIds.includes(lesson.id))
      .map((lesson) => ({
        lesson,
        percent: lessonProgress[lesson.id] ?? lesson.progress,
      }))
      .sort((a, b) => b.percent - a.percent)[0] ?? null;

  // Desafio ativo: o mais próximo da conclusão que ainda não terminou.
  const activeChallenge =
    MOCK_CHALLENGES.filter(
      (challenge) => !challengeCompleted.includes(challenge.id),
    )
      .map((challenge) => ({
        challenge,
        current: challengeProgress[challenge.id] ?? challenge.currentProgress,
      }))
      .sort(
        (a, b) =>
          b.current / b.challenge.targetProgress -
          a.current / a.challenge.targetProgress,
      )[0] ?? null;

  const tip = NUTRI_TIPS[0];

  return (
    <div className="pb-8">
      <header className="flex items-center justify-between gap-3 px-5 pb-2 pt-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {greeting()}, {firstName(user?.name) || "por aqui"}
          </p>
          <h1 className="mt-0.5 text-xl font-extrabold leading-tight tracking-tight">
            Vamos continuar sua evolução?
          </h1>
        </div>
        <Link
          href="/perfil"
          aria-label="Abrir o seu perfil"
          className="shrink-0 rounded-full transition-transform active:scale-95"
        >
          <Monogram
            initials={user?.initials ?? "MA"}
            highlight
            className="h-11 w-11"
          />
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 px-5 pt-4">
        <MetricCard
          index={0}
          label="Água"
          value={`${formatLiters(waterConsumedMl)} / ${formatLiters(waterGoalMl)}`}
          icon={Droplets}
          tone="water"
          percent={goalPercent(waterConsumedMl, waterGoalMl)}
          href="/agua"
        />
        <MetricCard
          index={1}
          label="Proteína"
          value={`${proteinConsumed}g / ${proteinGoal}g`}
          icon={Beef}
          tone="protein"
          percent={goalPercent(proteinConsumed, proteinGoal)}
          href="/metas"
        />
        <MetricCard
          index={2}
          label="Sequência"
          value={`${streak} ${pluralize(streak, "dia", "dias")}`}
          hint="Seu melhor ritmo até agora"
          icon={Flame}
          tone="streak"
        />
        <MetricCard
          index={3}
          label="Pontos"
          value={`${formatXp(xp)} XP`}
          hint="Liga Evolução"
          icon={Sparkles}
          tone="xp"
          href="/ranking"
        />
      </div>

      <div className="px-5 pt-4">
        <WeeklyProgressCard percent={weeklyProgress} />
      </div>

      {inProgress ? (
        <section className="px-5 pt-6" aria-label="Continue de onde parou">
          <SectionTitle title="Continue de onde parou" href="/conteudos" />
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mt-3"
          >
            <Link
              href={`/conteudos/aulas/${inProgress.lesson.id}`}
              className="surface-card group flex gap-3 overflow-hidden p-3 transition-shadow hover:shadow-[var(--shadow-float)]"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={inProgress.lesson.thumbnail}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-foreground/25">
                  <PlayCircle
                    className="h-7 w-7 text-white"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
                  {inProgress.lesson.category}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug">
                  {inProgress.lesson.title}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${inProgress.percent}%` }}
                      transition={{ duration: 0.7, delay: 0.35 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <span className="tabular text-[11px] font-bold text-muted-foreground">
                    {inProgress.percent}%
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      ) : null}

      {activeChallenge ? (
        <section className="px-5 pt-6" aria-label="Desafio ativo">
          <SectionTitle title="Desafio ativo" href="/desafios" />
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-3"
          >
            <Link
              href="/desafios"
              className="surface-card flex items-center gap-4 p-4 transition-shadow hover:shadow-[var(--shadow-float)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--water-soft)] text-[var(--water)]">
                <Target className="h-6 w-6" strokeWidth={2} aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {activeChallenge.challenge.title}
                </p>
                <p className="tabular mt-0.5 text-xs text-muted-foreground">
                  {activeChallenge.current} de{" "}
                  {activeChallenge.challenge.targetProgress}{" "}
                  {activeChallenge.challenge.unit} ·{" "}
                  <span className="font-semibold text-[var(--xp)]">
                    +{activeChallenge.challenge.xpReward} XP
                  </span>
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${goalPercent(
                        activeChallenge.current,
                        activeChallenge.challenge.targetProgress,
                      )}%`,
                    }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="h-full rounded-full bg-[var(--water)]"
                  />
                </div>
              </div>

              <ChevronRight
                className="h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </Link>
          </motion.div>
        </section>
      ) : null}

      <section className="px-5 pt-6" aria-label="Dica da Nutri">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="rounded-2xl border border-primary/15 bg-[var(--leaf-soft)] p-4"
        >
          <div className="flex items-center gap-2.5">
            <Monogram
              initials={NUTRITIONIST.initials}
              className="h-9 w-9 bg-primary text-primary-foreground"
            />
            <div>
              <p className="text-xs font-bold leading-tight">Dica da Nutri</p>
              <p className="text-[11px] text-muted-foreground">
                {NUTRITIONIST.name}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{tip}</p>
          <Link
            href="/mentoria"
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary"
          >
            Quero um plano só para mim
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-extrabold tracking-tight">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-xs font-bold text-primary"
        >
          Ver tudo
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
