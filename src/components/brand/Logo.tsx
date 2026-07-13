import { cn } from "@/lib/utils";
import { APP } from "@/config/app";

/**
 * Marca do aplicativo. Símbolo desenhado em SVG (folha em fluxo contínuo),
 * sem dependência de imagem externa. Trocar a marca significa trocar este
 * componente e os tokens de cor.
 */

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={APP.name}
      className={cn("h-10 w-10", className)}
    >
      <rect width="40" height="40" rx="12" className="fill-primary" />
      <path
        d="M11 27c0-7.18 5.82-13 13-13h5v4.5c0 6.35-5.15 11.5-11.5 11.5H11V27Z"
        className="fill-primary-foreground"
        fillOpacity="0.92"
      />
      <path
        d="M11.5 29.5c3-7.5 8.5-11.5 15-13"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Escalas da assinatura da marca. `lg` existe para a abertura (login), onde a
 * marca precisa de presenca; `md` para uso dentro do aplicativo.
 */
const LOGO_SIZE = {
  md: { gap: "gap-2.5", mark: "h-9 w-9", name: "text-xl" },
  lg: { gap: "gap-3", mark: "h-14 w-14", name: "text-[26px]" },
} as const;

export function Logo({
  className,
  showName = true,
  size = "md",
}: {
  className?: string;
  showName?: boolean;
  size?: keyof typeof LOGO_SIZE;
}) {
  const scale = LOGO_SIZE[size];

  return (
    <div className={cn("flex items-center", scale.gap, className)}>
      <LogoMark className={scale.mark} />
      {showName ? (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground",
            scale.name,
          )}
        >
          {APP.name}
        </span>
      ) : null}
    </div>
  );
}
