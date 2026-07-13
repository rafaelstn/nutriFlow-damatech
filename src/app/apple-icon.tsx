import { ImageResponse } from "next/og";
import { APP } from "@/config/app";

/**
 * Ícone para iOS (atalho na tela inicial e alguns previews de link).
 * PNG gerado no build, porque o Safari não aceita SVG como apple-touch-icon.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = APP.name;

const BRAND = "#2d795c";
const LIGHT = "#fcfcf8";

const MARK = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
    <path d="M11 27c0-7.18 5.82-13 13-13h5v4.5c0 6.35-5.15 11.5-11.5 11.5H11V27Z" fill="${LIGHT}"/>
    <path d="M11.5 29.5c3-7.5 8.5-11.5 15-13" stroke="${BRAND}" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
)}`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK} width={124} height={124} alt="" />
      </div>
    ),
    size,
  );
}
