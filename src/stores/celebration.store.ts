import { create } from "zustand";

/**
 * Estado efêmero de comemoração (não persiste).
 *
 * Qualquer tela dispara a mesma animação de XP, garantindo que o feedback de
 * ganho de pontos seja idêntico no app inteiro.
 */
interface CelebrationState {
  xpGain: { amount: number; key: number } | null;
  celebrateXp: (amount: number) => void;
  clearXp: () => void;
}

let celebrationKey = 0;

export const useCelebrationStore = create<CelebrationState>((set) => ({
  xpGain: null,

  celebrateXp: (amount) => {
    if (amount <= 0) return;
    celebrationKey += 1;
    set({ xpGain: { amount, key: celebrationKey } });
  },

  clearXp: () => set({ xpGain: null }),
}));
