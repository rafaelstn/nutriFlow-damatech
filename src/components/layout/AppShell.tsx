"use client";

import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

/**
 * Estrutura das telas autenticadas: conteúdo rolável e navegação fixa embaixo.
 * A barra nunca sai da tela, nem no celular nem dentro da moldura do desktop.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
