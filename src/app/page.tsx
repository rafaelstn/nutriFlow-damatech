"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/brand/Logo";
import { APP, SPLASH_DURATION_MS } from "@/config/app";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/login"), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-primary px-8">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.06, 1], opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", times: [0, 0.65, 1] }}
        className="relative"
      >
        <motion.span
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: 0, scale: 2.2 }}
          transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity }}
          className="absolute inset-0 rounded-[28px] bg-primary-foreground"
        />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-primary-foreground shadow-[var(--shadow-float)]">
          <LogoMark className="h-16 w-16" />
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mt-7 text-3xl font-extrabold tracking-tight text-primary-foreground"
      >
        {APP.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="mt-2 text-sm font-medium text-primary-foreground/75"
      >
        {APP.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-12 h-1 w-24 overflow-hidden rounded-full bg-primary-foreground/20"
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: SPLASH_DURATION_MS / 1000, ease: "easeInOut" }}
          className="h-full w-full rounded-full bg-primary-foreground/80"
        />
      </motion.div>
    </div>
  );
}
