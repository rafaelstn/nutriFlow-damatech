import type { ReactNode } from "react";

/**
 * Moldura do aplicativo.
 *
 * No celular (até 430px) o app ocupa a tela inteira, sem moldura, e o scroll
 * acontece dentro do conteúdo, nunca na página: por isso a altura é fixa
 * (`h-dvh`), e não mínima.
 *
 * No desktop ele é centralizado dentro de um aparelho premium. A altura respeita
 * a janela (`min(880px, 100dvh - 4rem)`), senão a moldura é cortada em telas
 * baixas, que é o caso do notebook usado na apresentação.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh overflow-hidden bg-background md:flex md:items-center md:justify-center md:bg-[radial-gradient(120%_120%_at_50%_0%,var(--leaf-soft)_0%,var(--background)_55%)] md:p-8">
      <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-background md:h-[min(880px,calc(100dvh-4rem))] md:rounded-[2.75rem] md:border md:border-border/60 md:device-frame">
        {children}
      </div>
    </div>
  );
}
