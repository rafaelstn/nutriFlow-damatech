import type { Metadata } from "next";
import { MentorshipScreen } from "@/features/mentorship/MentorshipScreen";

export const metadata: Metadata = {
  title: "Atendimento personalizado",
};

export default function MentoriaPage() {
  return <MentorshipScreen />;
}
