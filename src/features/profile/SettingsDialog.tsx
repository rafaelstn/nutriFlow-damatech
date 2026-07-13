"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

/**
 * Configuracoes da demonstracao.
 *
 * As preferencias sao locais e existem para mostrar o comportamento da tela:
 * nao ha backend nesta demonstracao, e o texto deixa isso claro para quem
 * assiste a apresentacao.
 */

const PREFERENCES = [
  {
    id: "reminder-water",
    label: "Lembretes de hidratação",
    hint: "Um toque leve ao longo do dia",
    initial: true,
  },
  {
    id: "reminder-lessons",
    label: "Aulas e conteúdos novos",
    hint: "Aviso quando a Nutri publicar",
    initial: true,
  },
  {
    id: "reminder-weekly",
    label: "Resumo semanal",
    hint: "Seu progresso todo domingo",
    initial: false,
  },
] as const;

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      PREFERENCES.map((preference) => [preference.id, preference.initial]),
    ),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2.5rem)] max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight">
            Configurações
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Preferências de notificação desta demonstração.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-1">
          {PREFERENCES.map((preference) => (
            <li
              key={preference.id}
              className="flex items-center justify-between gap-4 py-2.5"
            >
              <label htmlFor={preference.id} className="min-w-0 cursor-pointer">
                <span className="block text-sm font-bold leading-tight">
                  {preference.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {preference.hint}
                </span>
              </label>

              <Switch
                id={preference.id}
                checked={values[preference.id]}
                onCheckedChange={(checked) =>
                  setValues((current) => ({
                    ...current,
                    [preference.id]: checked,
                  }))
                }
                className="shrink-0"
              />
            </li>
          ))}
        </ul>

        <DialogFooter className="mt-1 flex-col gap-2 sm:flex-col">
          <Button
            onClick={() => onOpenChange(false)}
            className="h-11 w-full rounded-xl font-bold"
          >
            Concluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
