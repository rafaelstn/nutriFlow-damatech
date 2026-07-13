"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  hint?: string;
}

/**
 * Escolha unica em formato de cartao.
 *
 * Preferido ao menu suspenso: no celular, tocar em um alvo grande e mais rapido
 * e mais legivel do que abrir uma lista. Acessivel por teclado, porque o radio
 * continua sendo um radio de verdade (apenas visualmente oculto).
 */
export function OptionField({
  legend,
  options,
  registration,
  columns = 2,
  error,
}: {
  legend: string;
  options: Option[];
  registration: UseFormRegisterReturn;
  columns?: 1 | 2 | 3;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-foreground">{legend}</legend>

      <div
        className={cn(
          "mt-2 grid gap-2",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-3",
        )}
      >
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              value={option.value}
              className="peer sr-only"
              {...registration}
            />
            <span
              className={cn(
                "flex min-h-[52px] flex-col justify-center rounded-xl border border-border bg-card px-3 py-2.5 transition-colors",
                "peer-checked:border-primary peer-checked:bg-[var(--leaf-soft)] peer-checked:shadow-[var(--shadow-card)]",
                "peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
              )}
            >
              <span className="text-sm font-bold leading-tight text-foreground">
                {option.label}
              </span>
              {option.hint ? (
                <span className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {option.hint}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </div>

      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
