"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useLessonsStore } from "@/stores";
import { formatMinutes } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

/** Passo do avanço simulado, em pontos percentuais por tique. */
const STEP_PERCENT = 2;
const TICK_MS = 320;

/**
 * Player demonstrativo.
 *
 * Não existe vídeo hospedado nesta apresentação: a reprodução é simulada e
 * grava o percentual assistido na store, para o "continue de onde parou" da
 * Home reagir de verdade. O aviso abaixo do player deixa isso explícito, em vez
 * de fingir um recurso que ainda não existe.
 */
export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const completed = useLessonsStore((state) =>
    state.completedIds.includes(lesson.id),
  );
  const storedPercent = useLessonsStore(
    (state) => state.progressById[lesson.id],
  );
  const setProgress = useLessonsStore((state) => state.setProgress);

  const initialPercent = completed ? 100 : (storedPercent ?? lesson.progress);

  const [percent, setPercent] = useState(initialPercent);
  const [playing, setPlaying] = useState(false);

  // O relógio da reprodução lê o percentual do ref, não do closure do efeito:
  // assim o intervalo é criado uma única vez por sessão de reprodução.
  const percentRef = useRef(initialPercent);

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      const next = Math.min(100, percentRef.current + STEP_PERCENT);
      percentRef.current = next;
      setPercent(next);

      if (next >= 100) {
        clearInterval(timer);
        setPlaying(false);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [playing]);

  // Aula concluída já vale 100 por regra da store: não sobrescrevemos.
  useEffect(() => {
    if (!completed) setProgress(lesson.id, percent);
  }, [percent, completed, lesson.id, setProgress]);

  const finished = percent >= 100;
  const elapsedMinutes = Math.round((lesson.durationMinutes * percent) / 100);

  function toggle() {
    if (finished) {
      percentRef.current = 0;
      setPercent(0);
      setPlaying(true);
      return;
    }
    setPlaying((current) => !current);
  }

  const actionLabel = finished
    ? "Assistir novamente"
    : playing
      ? "Pausar a aula"
      : "Reproduzir a aula";

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/70 bg-foreground shadow-[var(--shadow-card)]">
        <Image
          src={lesson.thumbnail}
          alt=""
          fill
          priority
          sizes="(max-width: 480px) 100vw, 420px"
          className={cn(
            "object-cover transition-all duration-700",
            playing ? "scale-105 opacity-40" : "opacity-70",
          )}
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
          aria-hidden
        />

        <button
          type="button"
          onClick={toggle}
          aria-label={actionLabel}
          className="absolute inset-0 flex items-center justify-center focus-visible:outline-none"
        >
          <motion.span
            whileTap={{ scale: 0.92 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-[var(--shadow-float)]"
          >
            {finished ? (
              <RotateCcw className="h-6 w-6" strokeWidth={2.2} aria-hidden />
            ) : playing ? (
              <Pause className="h-6 w-6" strokeWidth={2.2} aria-hidden />
            ) : (
              <Play
                className="h-6 w-6 translate-x-0.5"
                strokeWidth={2.2}
                aria-hidden
              />
            )}
          </motion.span>
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
          <div className="tabular flex items-center justify-between text-[11px] font-semibold text-white/90">
            <span>
              {formatMinutes(elapsedMinutes)} de{" "}
              {formatMinutes(lesson.durationMinutes)}
            </span>
            <span>{percent}%</span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/25">
            <motion.div
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="h-full rounded-full bg-white"
            />
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Reprodução demonstrativa. O vídeo da aula entra na versão publicada.
      </p>
    </div>
  );
}
