"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Garrafa de agua que enche conforme o progresso.
 *
 * O nivel da agua e derivado do percentual (nunca guardado). A onda e um unico
 * caminho repetido que desliza na horizontal: da vida ao liquido sem virar
 * animacao gratuita. Com "prefers-reduced-motion" a onda para e so o nivel sobe.
 */

const VIEW_WIDTH = 160;
const VIEW_HEIGHT = 280;

/** Silhueta do corpo da garrafa. Serve de recorte para a agua e de contorno. */
const BODY_PATH =
  "M60 30 C60 52 26 62 26 96 L26 240 C26 258 38 270 56 270 L104 270 C122 270 134 258 134 240 L134 96 C134 62 100 52 100 30 Z";

/** Crista da onda com o dobro da largura do desenho, para deslizar sem emenda. */
const WAVE_PATH =
  "M0 16 Q40 2 80 16 T160 16 T240 16 T320 16 L320 300 L0 300 Z";
const WAVE_PATH_BACK =
  "M0 16 Q40 30 80 16 T160 16 T240 16 T320 16 L320 300 L0 300 Z";

/** Altura util do liquido: do fundo (268) ao ombro da garrafa (44). */
const BOTTOM_Y = 268;
const TOP_Y = 44;
const WAVE_CREST = 16;

export function WaterBottle({
  percent,
  consumedLabel,
  goalLabel,
}: {
  percent: number;
  consumedLabel: string;
  goalLabel: string;
}) {
  const reduceMotion = useReducedMotion();
  const safePercent = Math.min(100, Math.max(0, percent));

  // Quando esta zerado, a onda descansa abaixo do fundo e nada aparece.
  const surfaceY =
    safePercent <= 0
      ? VIEW_HEIGHT + WAVE_CREST
      : BOTTOM_Y - (safePercent / 100) * (BOTTOM_Y - TOP_Y) - WAVE_CREST;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-[248px] w-auto"
      role="img"
      aria-label={`Garrafa com ${safePercent}% da meta. ${consumedLabel} de ${goalLabel}.`}
    >
      <defs>
        <clipPath id="water-bottle-clip">
          <path d={BODY_PATH} />
        </clipPath>
      </defs>

      {/* Vidro: fundo suave sempre visivel, mesmo com a garrafa vazia. */}
      <path d={BODY_PATH} className="fill-[var(--water-soft)]" opacity={0.5} />

      <g clipPath="url(#water-bottle-clip)">
        <motion.g
          initial={false}
          animate={{ y: surfaceY }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          <motion.g
            animate={reduceMotion ? undefined : { x: [0, -160] }}
            transition={{ duration: 9, ease: "linear", repeat: Infinity }}
          >
            <path
              d={WAVE_PATH_BACK}
              className="fill-[var(--water)]"
              opacity={0.45}
            />
          </motion.g>

          <motion.g
            animate={reduceMotion ? undefined : { x: [-160, 0] }}
            transition={{ duration: 6.5, ease: "linear", repeat: Infinity }}
          >
            <path d={WAVE_PATH} className="fill-[var(--water)]" opacity={0.9} />
          </motion.g>
        </motion.g>
      </g>

      {/* Contorno e brilho: dao volume sem precisar de gradiente berrante. */}
      <path
        d={BODY_PATH}
        fill="none"
        className="stroke-[var(--water)]"
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <path
        d="M44 108 L44 226"
        className="stroke-white"
        strokeOpacity={0.5}
        strokeWidth={6}
        strokeLinecap="round"
      />

      {/* Gargalo e tampa. */}
      <rect
        x={61}
        y={22}
        width={38}
        height={12}
        rx={4}
        className="fill-[var(--water-soft)] stroke-[var(--water)]"
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <rect
        x={57}
        y={4}
        width={46}
        height={20}
        rx={7}
        className="fill-[var(--water)]"
        opacity={0.85}
      />
    </svg>
  );
}
