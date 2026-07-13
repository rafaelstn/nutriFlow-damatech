"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho das telas internas: voltar, título e uma ação opcional à direita.
 * O topo é ferramenta de navegação, não tarja decorativa.
 */
export function ScreenHeader({
  title,
  subtitle,
  action,
  onBack,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  onBack?: () => void;
  className?: string;
}) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex items-center gap-3 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur-xl",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => (onBack ? onBack() : router.back())}
        aria-label="Voltar"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition-colors hover:bg-secondary active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold leading-tight">{title}</h1>
        {subtitle ? (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
