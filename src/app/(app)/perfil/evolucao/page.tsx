import type { Metadata } from "next";
import { EvolutionScreen } from "@/features/profile/EvolutionScreen";

export const metadata: Metadata = {
  title: "Minha evolução",
};

export default function EvolucaoPage() {
  return <EvolutionScreen />;
}
