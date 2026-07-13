"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Beef, CheckCircle2, Clock, Flame } from "lucide-react";
import type { Recipe } from "@/types";
import { formatMinutes } from "@/utils/format";

/**
 * Cartão de receita no grid de duas colunas.
 *
 * Foto primeiro, porque é ela que faz a pessoa querer cozinhar. Calorias, tempo
 * e proteína aparecem juntos: é a leitura que decide se a receita cabe no dia.
 */
export function RecipeCard({
  recipe,
  index = 0,
}: {
  recipe: Recipe;
  index?: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index, 7) * 0.04,
        duration: 0.35,
        ease: "easeOut",
      }}
      className="h-full"
    >
      <Link
        href={`/conteudos/receitas/${recipe.id}`}
        className="surface-card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-float)]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={recipe.image}
            alt=""
            fill
            sizes="(max-width: 480px) 50vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {recipe.prepared ? (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[10px] font-bold text-primary backdrop-blur-sm">
              <CheckCircle2 className="h-3 w-3" strokeWidth={2.4} aria-hidden />
              Preparada
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-3">
          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {recipe.category}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug">
            {recipe.title}
          </p>

          <div className="tabular mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3 w-3" strokeWidth={2} aria-hidden />
              {recipe.calories} kcal
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" strokeWidth={2} aria-hidden />
              {formatMinutes(recipe.prepTimeMinutes)}
            </span>
          </div>

          <div className="mt-auto pt-2">
            <span className="tabular inline-flex w-fit items-center gap-1 rounded-full bg-[var(--protein-soft)] px-2 py-1 text-[11px] font-bold text-[var(--protein)]">
              <Beef className="h-3 w-3" strokeWidth={2.2} aria-hidden />
              {recipe.proteinGrams}g de proteína
            </span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}
