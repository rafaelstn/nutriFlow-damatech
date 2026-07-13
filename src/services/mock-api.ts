import { MOCK_LATENCY } from "@/config/app";

/**
 * Infraestrutura da camada de serviços mockados.
 *
 * Toda leitura passa por aqui e paga uma latência artificial, para que a
 * interface exercite skeletons e estados de carregamento como faria contra uma
 * API real. Quando existir backend, basta trocar o corpo destas funções por
 * fetch, mantendo a mesma assinatura.
 */

export function delay(
  minMs: number = MOCK_LATENCY.minMs,
  maxMs: number = MOCK_LATENCY.maxMs,
): Promise<void> {
  const ms = Math.round(minMs + Math.random() * Math.max(0, maxMs - minMs));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Erro de domínio da camada de serviço, com mensagem já humanizada. */
export class ServiceError extends Error {
  constructor(
    message: string,
    readonly code: string = "service_error",
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

/**
 * Simula uma requisição de leitura: latência e cópia defensiva do mock, para
 * que nenhuma tela mute o dado de origem por engano.
 */
export async function fetchMock<T>(data: T, latency = true): Promise<T> {
  if (latency) await delay();
  return structuredClone(data);
}

/** Simula uma requisição de escrita, mais rápida que a leitura. */
export async function commitMock<T>(data: T): Promise<T> {
  await delay(180, 380);
  return structuredClone(data);
}
