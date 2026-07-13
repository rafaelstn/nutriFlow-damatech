"use client";

/**
 * Última barreira: erro que estoura fora do layout raiz.
 * Precisa renderizar a própria árvore html/body.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[NutriFlow] erro global", error);

  return (
    <html lang="pt-BR">
      <body className="flex min-h-dvh items-center justify-center bg-white px-8 text-center">
        <div>
          <h1 className="text-lg font-bold text-neutral-900">
            Precisamos recarregar o aplicativo
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Algo inesperado aconteceu. Toque no botão para começar de novo.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 h-11 rounded-xl bg-neutral-900 px-6 text-sm font-bold text-white"
          >
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}
