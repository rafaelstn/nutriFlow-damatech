import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { APP } from "@/config/app";

/**
 * Imagem de compartilhamento (WhatsApp, LinkedIn, Telegram, Twitter).
 *
 * Redes sociais não leem favicon nem SVG: elas pedem um PNG absoluto via
 * og:image. Esta imagem é gerada no build a partir do mesmo símbolo da marca.
 *
 * As cores são literais porque a geração acontece fora do documento, sem acesso
 * aos tokens CSS: verde --primary = #2d795c, claro --primary-foreground = #fcfcf8.
 */
export const alt = `${APP.name}, ${APP.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#2d795c";
const LIGHT = "#fcfcf8";

/** Mesmo desenho de src/components/brand/Logo.tsx, embutido como data URI. */
const MARK = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
    <path d="M11 27c0-7.18 5.82-13 13-13h5v4.5c0 6.35-5.15 11.5-11.5 11.5H11V27Z" fill="${BRAND}"/>
    <path d="M11.5 29.5c3-7.5 8.5-11.5 15-13" stroke="${LIGHT}" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
)}`;

/**
 * A fonte da marca vai embutida: o gerador roda fora do navegador e, sem o
 * arquivo, ele ignora o peso e devolve o texto em uma fonte genérica.
 */
const fontPath = (file: string) => join(process.cwd(), "src/app/_fonts", file);

export default async function OpengraphImage() {
  const [regular, extraBold] = await Promise.all([
    readFile(fontPath("PlusJakartaSans-Regular.ttf")),
    readFile(fontPath("PlusJakartaSans-ExtraBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND,
          backgroundImage: `radial-gradient(120% 120% at 15% 0%, #3a8f6d 0%, ${BRAND} 45%, #235f49 100%)`,
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 168,
            height: 168,
            borderRadius: 46,
            background: LIGHT,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK} width={104} height={104} alt="" />
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: LIGHT,
          }}
        >
          {APP.name}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 30,
            color: "rgba(252, 252, 248, 0.78)",
          }}
        >
          {APP.tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Plus Jakarta Sans",
          data: regular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Plus Jakarta Sans",
          data: extraBold,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
}
