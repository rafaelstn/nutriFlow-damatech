"use client";

import { cn } from "@/lib/utils";

/**
 * Filtro por categoria em pílulas roláveis, compartilhado pelas duas abas da
 * tela de Conteúdos. Altura de 44px para o toque no celular.
 */
export function CategoryChips<T extends string>({
  options,
  selected,
  onSelect,
  label,
}: {
  options: readonly T[];
  selected: T;
  onSelect: (option: T) => void;
  /** Descrição do grupo para leitor de tela. */
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5"
    >
      {options.map((option) => {
        const active = option === selected;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            aria-pressed={active}
            className={cn(
              "h-11 shrink-0 rounded-full border px-4 text-[13px] font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
