import { DEMO_CREDENTIALS, MOCK_USER } from "@/mocks/user";
import type { User } from "@/types";
import { ServiceError, commitMock, fetchMock } from "./mock-api";

/**
 * Autenticação de demonstração.
 *
 * Não há sessão, token nem senha armazenada: a validação abaixo existe apenas
 * para o formulário ter um caminho de erro real na apresentação.
 */

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async login({ email, password }: LoginInput): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const matches =
      normalizedEmail === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password;

    if (!matches) {
      await commitMock(null);
      throw new ServiceError(
        "E-mail ou senha não conferem. Use as credenciais da demonstração.",
        "invalid_credentials",
      );
    }

    return commitMock(MOCK_USER);
  },

  async getCurrentUser(): Promise<User> {
    return fetchMock(MOCK_USER);
  },
};
