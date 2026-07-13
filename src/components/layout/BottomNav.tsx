"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Home, Target, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/conteudos", label: "Conteúdos", icon: BookOpen },
  { href: "/desafios", label: "Desafios", icon: Target },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="relative z-20 shrink-0 border-t border-border/70 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <ul className="flex items-stretch justify-between px-2 pt-1.5 pb-1.5">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-x-3 -top-1.5 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
                <Icon
                  className={cn("h-[22px] w-[22px]", active && "stroke-[2.4]")}
                  aria-hidden
                />
                <span className="text-[11px] font-semibold leading-none">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
