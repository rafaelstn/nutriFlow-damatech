"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Flame,
  Gift,
  LogOut,
  MessageCircle,
  RotateCcw,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Monogram } from "@/components/common/Monogram";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LevelProgress } from "@/components/gamification/LevelProgress";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./SettingsDialog";
import { useAuthStore, useProgressStore, resetDemo } from "@/stores";
import { APP } from "@/config/app";
import { formatXp, pluralize } from "@/utils/format";
import { getLevelInfo } from "@/utils/gamification";

interface MenuItem {
  key: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
}

export function ProfileScreen() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const xp = useProgressStore((state) => state.xp);
  const streak = useProgressStore((state) => state.currentStreak);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const level = getLevelInfo(xp);

  const items: MenuItem[] = [
    {
      key: "evolucao",
      label: "Minha evolução",
      hint: "Pontos, sequência e histórico",
      icon: TrendingUp,
      href: "/perfil/evolucao",
    },
    {
      key: "recompensas",
      label: "Minhas recompensas",
      hint: "O que os seus pontos já valem",
      icon: Gift,
      href: "/recompensas",
    },
    {
      key: "configuracoes",
      label: "Configurações",
      hint: "Notificações e preferências",
      icon: Settings,
      onClick: () => setSettingsOpen(true),
    },
    {
      key: "mentoria",
      label: "Atendimento personalizado",
      hint: "Plano individual com a Nutri",
      icon: MessageCircle,
      href: "/mentoria",
    },
  ];

  const handleReset = () => {
    resetDemo();
    toast.success("Demonstração restaurada", {
      description: "Todos os dados voltaram ao estado inicial.",
    });
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="pb-10">
      <ScreenHeader title="Perfil" />

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="px-5 pt-5"
        aria-label="Sua conta"
      >
        <div className="surface-card p-5">
          <div className="flex items-center gap-4">
            <Monogram
              initials={user?.initials ?? "MA"}
              highlight
              className="h-14 w-14 text-base"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-extrabold leading-tight tracking-tight">
                {user?.name ?? "Convidada"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? "Demonstração"}
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-2.5 py-0.5 text-[11px] font-bold text-primary">
                Nível {level.name}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <LevelProgress xp={xp} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--xp-soft)] p-3.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--xp)]">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
                Pontos
              </span>
              <p className="tabular mt-1 text-lg font-extrabold leading-none tracking-tight">
                {formatXp(xp)} XP
              </p>
            </div>

            <div className="rounded-xl bg-[var(--streak-soft)] p-3.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--streak)]">
                <Flame className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
                Sequência
              </span>
              <p className="tabular mt-1 text-lg font-extrabold leading-none tracking-tight">
                {streak} {pluralize(streak, "dia", "dias")}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <nav className="px-5 pt-5" aria-label="Opções do perfil">
        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <motion.li
              key={item.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.05 * index,
                duration: 0.35,
                ease: "easeOut",
              }}
            >
              <MenuRow item={item} />
            </motion.li>
          ))}
        </ul>
      </nav>

      <section className="px-5 pt-6" aria-label="Ações da demonstração">
        <div className="surface-card p-5">
          <p className="text-sm font-bold">Apresentando o aplicativo?</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Restaure a demonstração para voltar ao estado inicial: pontos, água,
            aulas, receitas, desafios e recompensas como no primeiro acesso.
          </p>

          <Button
            type="button"
            variant="destructive"
            onClick={() => setResetOpen(true)}
            className="mt-4 h-12 w-full rounded-xl text-sm font-bold"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.4} aria-hidden />
            Resetar demonstração
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setLogoutOpen(true)}
          className="mt-3 h-12 w-full rounded-xl text-sm font-bold text-muted-foreground"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sair
        </Button>

        <p className="tabular mt-4 text-center text-[11px] text-muted-foreground">
          {APP.name}
          <span aria-hidden> · </span>
          versão {APP.version}
        </p>
      </section>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Resetar a demonstração?"
        description="Tudo volta ao estado inicial: pontos, sequência, água, aulas, receitas, desafios e recompensas. Esta ação não pode ser desfeita."
        confirmLabel="Resetar tudo"
        cancelLabel="Manter como está"
        destructive
        onConfirm={handleReset}
      />

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Sair da sua conta?"
        description="Você volta para a tela de entrada. Seu progresso continua salvo neste dispositivo."
        confirmLabel="Sair"
        cancelLabel="Continuar aqui"
        onConfirm={handleLogout}
      />
    </div>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  const Icon = item.icon;

  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </span>

      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-sm font-bold leading-tight">
          {item.label}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {item.hint}
        </span>
      </span>

      <ChevronRight
        className="h-5 w-5 shrink-0 text-muted-foreground"
        aria-hidden
      />
    </>
  );

  const className =
    "surface-card flex min-h-[68px] w-full items-center gap-3.5 p-3.5 transition-shadow hover:shadow-[var(--shadow-float)] active:scale-[0.99]";

  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={item.onClick} className={className}>
      {content}
    </button>
  );
}
