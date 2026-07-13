import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService, type LoginInput } from "@/services";
import { MOCK_USER } from "@/mocks/user";

/**
 * Identidade da usuária.
 *
 * Métricas (XP, água, sequência) NÃO moram aqui: elas pertencem à
 * useProgressStore, que é a fonte única de verdade da gamificação.
 */
export interface AuthIdentity {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar: string | null;
}

interface AuthState {
  user: AuthIdentity | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  reset: () => void;
  setHasHydrated: (value: boolean) => void;
}

const identityFrom = (user: typeof MOCK_USER): AuthIdentity => ({
  id: user.id,
  name: user.name,
  email: user.email,
  initials: user.initials,
  avatar: user.avatar,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: async (input) => {
        const user = await authService.login(input);
        set({ user: identityFrom(user), isAuthenticated: true });
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      reset: () => set({ user: null, isAuthenticated: false }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "nutriflow:auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);

/** Nome curto para saudação: "Mariana Alves" vira "Mariana". */
export function firstName(name: string | undefined | null): string {
  if (!name) return "";
  return name.trim().split(" ")[0];
}
