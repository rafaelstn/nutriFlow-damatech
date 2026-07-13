"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Supplement } from "@/types";

/**
 * Cartao de produto da vitrine.
 *
 * A URL vem sempre do dado (`supplement.externalUrl`, montado em config/app.ts).
 * Nenhum link e escrito aqui. Toda saida para fora do app abre em nova aba com
 * rel="noopener noreferrer".
 */
export function SupplementCard({
  supplement,
  index,
}: {
  supplement: Supplement;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4, ease: "easeOut" }}
      className="surface-card overflow-hidden"
    >
      <div className="relative h-40 w-full bg-secondary">
        <Image
          src={supplement.image}
          alt={supplement.name}
          fill
          sizes="(max-width: 480px) 100vw, 420px"
          // O primeiro produto é o LCP da tela: carrega sem esperar a rolagem.
          priority={index === 0}
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-foreground backdrop-blur-sm">
          {supplement.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-base font-extrabold leading-tight tracking-tight">
          {supplement.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {supplement.description}
        </p>

        <ul className="mt-3 space-y-1.5">
          {supplement.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--leaf-soft)] text-primary">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
              <span className="text-xs leading-relaxed text-foreground/90">
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="tabular text-sm font-bold">{supplement.priceLabel}</p>

          <a
            href={supplement.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-11 rounded-xl px-4 text-sm font-bold",
            )}
          >
            Ver produto
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
