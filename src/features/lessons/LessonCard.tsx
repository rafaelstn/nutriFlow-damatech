"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import type { Lesson } from "@/types";
import { formatMinutes } from "@/utils/format";

/**
 * Cartão de aula da lista.
 *
 * Mostra em uma olhada o que a pessoa precisa decidir: do que se trata, quanto
 * tempo custa e onde ela parou. Aula concluída troca a barra pelo selo, para o
 * progresso nunca competir com o que já foi vencido.
 */
export function LessonCard({
  lesson,
  index = 0,
}: {
  lesson: Lesson;
  index?: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index, 6) * 0.05,
        duration: 0.35,
        ease: "easeOut",
      }}
    >
      <Link
        href={`/conteudos/aulas/${lesson.id}`}
        className="surface-card group flex gap-3 overflow-hidden p-3 transition-shadow hover:shadow-[var(--shadow-float)]"
      >
        <div className="relative h-[76px] w-28 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={lesson.thumbnail}
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
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[11px] font-bold uppercase tracking-wide text-primary">
              {lesson.category}
            </span>
            <span className="text-[11px] text-muted-foreground" aria-hidden>
              ·
            </span>
            <span className="tabular inline-flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" strokeWidth={2} aria-hidden />
              {formatMinutes(lesson.durationMinutes)}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug">
            {lesson.title}
          </p>

          {lesson.completed ? (
            <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-2 py-0.5 text-[11px] font-bold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
              Concluída
            </span>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lesson.progress}%` }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
              <span className="tabular text-[11px] font-bold text-muted-foreground">
                {lesson.progress}%
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.li>
  );
}
