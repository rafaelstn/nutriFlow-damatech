"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Diálogo de confirmação do design do aplicativo.
 *
 * Nunca usar window.confirm, window.alert ou window.prompt: o diálogo nativo do
 * navegador quebra a identidade visual da demonstração.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
  icon,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  icon?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2.5rem)] max-w-sm rounded-3xl">
        <DialogHeader className="items-center text-center sm:text-center">
          {icon ? <div className="mb-1">{icon}</div> : null}
          <DialogTitle className="text-lg font-extrabold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            variant={destructive ? "destructive" : "default"}
            className="h-11 w-full rounded-xl font-bold"
          >
            {confirmLabel}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="h-11 w-full rounded-xl font-semibold"
          >
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
