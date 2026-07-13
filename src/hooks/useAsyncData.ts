"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AsyncStatus } from "@/types";

interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
  reload: () => void;
}

interface Result<T> {
  key: string;
  data: T | null;
  status: Exclude<AsyncStatus, "idle" | "loading">;
  error: string | null;
}

/**
 * Carrega dados de um serviço mockado cobrindo os quatro estados da tela:
 * carregando, sucesso, vazio e erro.
 *
 * O estado de carregamento é derivado (o resultado guardado ainda não pertence à
 * requisição atual), e não escrito dentro do efeito: assim a troca de filtro não
 * dispara renderização em cascata.
 *
 * `isEmpty` deixa cada tela decidir o que conta como vazio (lista sem itens,
 * filtro sem resultado...).
 */
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: unknown[] = [],
  isEmpty?: (data: T) => boolean,
): AsyncState<T> {
  const [result, setResult] = useState<Result<T> | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Identidade da requisição atual. String primitiva, então o efeito abaixo
  // depende de um valor estável em vez de um array recriado a cada renderização.
  const key = `${JSON.stringify(deps)}::${reloadToken}`;

  // As funções chegam recriadas a cada renderização: guardamos a última versão
  // sem que ela entre nas dependências e provoque um novo carregamento.
  const loaderRef = useRef(loader);
  const isEmptyRef = useRef(isEmpty);

  useEffect(() => {
    loaderRef.current = loader;
    isEmptyRef.current = isEmpty;
  });

  useEffect(() => {
    let active = true;

    loaderRef
      .current()
      .then((data) => {
        if (!active) return;
        const empty = isEmptyRef.current?.(data) ?? false;
        setResult({
          key,
          data,
          status: empty ? "empty" : "success",
          error: null,
        });
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setResult({
          key,
          data: null,
          status: "error",
          error:
            cause instanceof Error
              ? cause.message
              : "Algo saiu do lugar por aqui. Tente novamente.",
        });
      });

    return () => {
      active = false;
    };
  }, [key]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  const isCurrent = result?.key === key;

  return {
    data: isCurrent ? result.data : null,
    status: isCurrent ? result.status : "loading",
    error: isCurrent ? result.error : null,
    reload,
  };
}
