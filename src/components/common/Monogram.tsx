import { cn } from "@/lib/utils";

/**
 * Avatar monograma. A demo não usa foto de pessoa: as iniciais em um fundo
 * suave da marca são mais elegantes e evitam qualquer dado pessoal real.
 */
export function Monogram({
  initials,
  className,
  highlight = false,
}: {
  initials: string;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full text-sm font-bold tracking-tight",
        highlight
          ? "bg-primary text-primary-foreground ring-2 ring-primary/25"
          : "bg-secondary text-secondary-foreground",
        className,
      )}
    >
      {initials}
    </span>
  );
}
