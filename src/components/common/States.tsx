"use client";

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Estado vazio: nada encontrado, sem que nada tenha dado errado. */
export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-8 py-14 text-center",
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden />
      </span>
      <p className="mt-4 text-base font-bold">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-[28ch] text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/**
 * Estado de erro. Mensagem humanizada, sempre com saída.
 * Nunca exibimos detalhe técnico nem pilha de execução para a usuária.
 */
export function ErrorState({
  title = "Não conseguimos carregar agora",
  description = "Verifique sua conexão e tente novamente. Seus dados continuam salvos.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-8 py-14 text-center",
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" strokeWidth={1.8} aria-hidden />
      </span>
      <p className="mt-4 text-base font-bold">{title}</p>
      <p className="mt-1.5 max-w-[30ch] text-sm text-muted-foreground">
        {description}
      </p>
      {onRetry ? (
        <Button onClick={onRetry} variant="secondary" className="mt-5 rounded-full">
          <RotateCcw className="h-4 w-4" aria-hidden />
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
