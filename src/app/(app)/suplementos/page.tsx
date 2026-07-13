import type { Metadata } from "next";
import { SupplementsScreen } from "@/features/supplements/SupplementsScreen";

export const metadata: Metadata = {
  title: "Suplementos",
};

export default function SuplementosPage() {
  return <SupplementsScreen />;
}
