import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { DeviceFrame } from "@/components/layout/DeviceFrame";
import { XpOverlay } from "@/components/gamification/XpOverlay";
import { APP } from "@/config/app";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP.siteUrl),
  title: `${APP.name} | ${APP.tagline}`,
  description: APP.description,
  applicationName: APP.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: APP.siteUrl,
    siteName: APP.name,
    title: `${APP.name} | ${APP.tagline}`,
    description: APP.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP.name} | ${APP.tagline}`,
    description: APP.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F6F2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} h-full overflow-hidden`}>
      <body className="h-full overflow-hidden">
        <DeviceFrame>{children}</DeviceFrame>
        <XpOverlay />
        <Toaster position="top-center" richColors closeButton={false} />
      </body>
    </html>
  );
}
