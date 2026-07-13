import type { LucideIcon } from "lucide-react";
import { Ban, Beef, Droplets, Footprints, Palette } from "lucide-react";
import type { ChallengeIcon } from "@/types";

/**
 * Mapa tipado de icone do desafio.
 *
 * O dado traz apenas o nome do icone (`droplets`, `ban`...), como faria uma API
 * real. O `Record<ChallengeIcon, LucideIcon>` garante, em tempo de compilacao,
 * que todo icone novo do dominio tenha um componente correspondente.
 */
export const CHALLENGE_ICONS: Record<ChallengeIcon, LucideIcon> = {
  droplets: Droplets,
  ban: Ban,
  beef: Beef,
  palette: Palette,
  footprints: Footprints,
};

/** Tom visual por icone, sempre dentro dos tokens da marca. */
export const CHALLENGE_TONES: Record<ChallengeIcon, { chip: string; bar: string }> =
  {
    droplets: {
      chip: "bg-[var(--water-soft)] text-[var(--water)]",
      bar: "bg-[var(--water)]",
    },
    ban: {
      chip: "bg-[var(--streak-soft)] text-[var(--streak)]",
      bar: "bg-[var(--streak)]",
    },
    beef: {
      chip: "bg-[var(--protein-soft)] text-[var(--protein)]",
      bar: "bg-[var(--protein)]",
    },
    palette: {
      chip: "bg-[var(--xp-soft)] text-[var(--xp)]",
      bar: "bg-[var(--xp)]",
    },
    footprints: {
      chip: "bg-[var(--leaf-soft)] text-[var(--leaf)]",
      bar: "bg-[var(--leaf)]",
    },
  };
