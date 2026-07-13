"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAuthStore } from "@/stores";

/**
 * Área autenticada da demonstração.
 *
 * Não existe sessão real: a guarda apenas devolve a apresentação para o login
 * quando não há usuária ativa, e espera a hidratação do armazenamento local
 * para não piscar a tela errada.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated) {
    return <div className="flex-1 bg-background" aria-hidden />;
  }

  return <AppShell>{children}</AppShell>;
}
