"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/common/States";

/**
 * Fronteira de erro da aplicação.
 *
 * A usuária nunca vê pilha de execução nem detalhe técnico: recebe uma mensagem
 * humanizada e um caminho de volta. O detalhe fica no console, para quem está
 * apresentando.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[NutriFlow]", error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <ErrorState
        title="Algo saiu do lugar por aqui"
        description="Não conseguimos carregar esta tela agora. Seus dados continuam salvos no aparelho."
        onRetry={reset}
      />
    </div>
  );
}
