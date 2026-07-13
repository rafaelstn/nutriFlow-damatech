import type { Metadata } from "next";
import { GoalsScreen } from "@/features/goals/GoalsScreen";

export const metadata: Metadata = {
  title: "Calculadora de metas",
};

export default function MetasPage() {
  return <GoalsScreen />;
}
