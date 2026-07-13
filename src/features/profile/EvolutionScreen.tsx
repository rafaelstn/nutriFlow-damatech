"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  BookOpen,
  ChefHat,
  Droplets,
  Flame,
  GraduationCap,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { EmptyState } from "@/components/common/States";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useProgressStore,
  useLessonsStore,
  useRecipesStore,
  useChallengesStore,
} from "@/stores";
import { MOCK_WEEKLY } from "@/mocks/weekly";
import { formatXp, pluralize } from "@/utils/format";
import { getLevelInfo } from "@/utils/gamification";
import type { XpSource } from "@/types";

const SOURCE_ICON: Record<XpSource, LucideIcon> = {
  lesson: GraduationCap,
  recipe: ChefHat,
  water: Droplets,
  challenge: Target,
};

const SOURCE_TONE: Record<XpSource, string> = {
  lesson: "bg-[var(--leaf-soft)] text-[var(--leaf)]",
  recipe: "bg-[var(--protein-soft)] text-[var(--protein)]",
  water: "bg-[var(--water-soft)] text-[var(--water)]",
  challenge: "bg-[var(--streak-soft)] text-[var(--streak)]",
};

export function EvolutionScreen() {
  const xp = useProgressStore((state) => state.xp);
  const streak = useProgressStore((state) => state.currentStreak);
  const xpEvents = useProgressStore((state) => state.xpEvents);

  const completedLessons = useLessonsStore((state) => state.completedIds);
  const preparedRecipes = useRecipesStore((state) => state.preparedIds);
  const completedChallenges = useChallengesStore((state) => state.completedIds);

  const level = getLevelInfo(xp);
  const bestDay = MOCK_WEEKLY.reduce((top, point) =>
    point.xp > top.xp ? point : top,
  );
  const weekXp = MOCK_WEEKLY.reduce((sum, point) => sum + point.xp, 0);

  return (
    <div className="pb-10">
      <ScreenHeader title="Minha evolução" subtitle="Últimos 7 dias" />

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="px-5 pt-5"
        aria-label="Pontos nos últimos 7 dias"
      >
        <div className="surface-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Pontos na semana
              </p>
              <p className="tabular mt-1 text-4xl font-extrabold leading-none tracking-tight">
                {formatXp(weekXp)}
                <span className="ml-1 text-xl text-muted-foreground">XP</span>
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-2.5 py-1 text-[11px] font-bold text-primary">
              <TrendingUp
                className="h-3.5 w-3.5"
                strokeWidth={2.4}
                aria-hidden
              />
              Em alta
            </span>
          </div>

          <div className="mt-5 h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={MOCK_WEEKLY}
                margin={{ top: 6, right: 12, bottom: 0, left: 12 }}
              >
                <defs>
                  <linearGradient id="xp-area" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 6"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  dy={6}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#xp-area)"
                  dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Seu melhor dia foi{" "}
            <span className="font-semibold text-foreground">{bestDay.day}</span>,
            com <span className="tabular font-semibold">{bestDay.xp} XP</span>{" "}
            conquistados.
          </p>
        </div>
      </motion.section>

      <section className="px-5 pt-5" aria-label="Resumo da sua evolução">
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            icon={Sparkles}
            label="XP total"
            value={`${formatXp(xp)} XP`}
            hint={`Nível ${level.name}`}
            tone="bg-[var(--xp-soft)] text-[var(--xp)]"
          />
          <SummaryCard
            icon={TrendingUp}
            label="Próximo nível"
            value={
              level.nextLevelName
                ? `${formatXp(level.xpToNextLevel)} XP`
                : "Concluído"
            }
            hint={
              level.nextLevelName
                ? `Faltam para ${level.nextLevelName}`
                : "Você chegou ao topo da trilha"
            }
            tone="bg-[var(--leaf-soft)] text-[var(--leaf)]"
          />
          <SummaryCard
            icon={Flame}
            label="Sequência"
            value={`${streak} ${pluralize(streak, "dia", "dias")}`}
            hint="Dias seguidos ativos"
            tone="bg-[var(--streak-soft)] text-[var(--streak)]"
          />
          <SummaryCard
            icon={BookOpen}
            label="Aulas"
            value={`${completedLessons.length}`}
            hint={pluralize(completedLessons.length, "concluída", "concluídas")}
            tone="bg-[var(--water-soft)] text-[var(--water)]"
          />
          <SummaryCard
            icon={ChefHat}
            label="Receitas"
            value={`${preparedRecipes.length}`}
            hint={pluralize(preparedRecipes.length, "preparada", "preparadas")}
            tone="bg-[var(--protein-soft)] text-[var(--protein)]"
          />
          <SummaryCard
            icon={Target}
            label="Desafios"
            value={`${completedChallenges.length}`}
            hint={pluralize(
              completedChallenges.length,
              "concluído",
              "concluídos",
            )}
            tone="bg-[var(--leaf-soft)] text-[var(--leaf)]"
          />
        </div>
      </section>

      <section className="px-5 pt-6" aria-label="Histórico de ganhos">
        <h2 className="text-base font-extrabold tracking-tight">
          Histórico de ganhos
        </h2>

        {xpEvents.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Você ainda não pontuou por aqui"
            description="Conclua uma aula, registre a sua água ou prepare uma receita para começar a somar."
            action={
              <Link
                href="/conteudos"
                className={cn(
                  buttonVariants(),
                  "h-11 rounded-xl px-5 text-sm font-bold",
                )}
              >
                Ver as aulas
              </Link>
            }
          />
        ) : (
          <ul className="mt-3 space-y-2.5">
            {xpEvents.map((event) => {
              const Icon = SOURCE_ICON[event.source];

              return (
                <li
                  key={event.id}
                  className="surface-card flex items-center gap-3 p-3.5"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      SOURCE_TONE[event.source],
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold leading-tight">
                      {event.label}
                    </p>
                    <p className="tabular mt-0.5 text-xs text-muted-foreground">
                      {formatEventDate(event.at)}
                    </p>
                  </div>

                  <span className="tabular shrink-0 rounded-full bg-[var(--xp-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--xp)]">
                    +{event.amount} XP
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  tone: string;
}) {
  return (
    <div className="surface-card p-4">
      <span
        className={cn("flex h-9 w-9 items-center justify-center rounded-xl", tone)}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
      </span>
      <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="tabular mt-0.5 text-lg font-extrabold leading-tight tracking-tight">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}

/** "hoje, 14:32" quando o ganho é do dia; caso contrário, data curta. */
function formatEventDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const today = new Date();
  const sameDay =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (sameDay) return `Hoje, ${time}`;

  const day = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
  return `${day}, ${time}`;
}
