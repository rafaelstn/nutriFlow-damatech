import type { Metadata } from "next";
import { WaterScreen } from "@/features/progress/WaterScreen";

export const metadata: Metadata = {
  title: "Hidratação",
};

export default function AguaPage() {
  return <WaterScreen />;
}
