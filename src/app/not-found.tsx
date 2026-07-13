"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/common/States";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <EmptyState
        icon={Compass}
        title="Não encontramos esta tela"
        description="O conteúdo que você procurou não existe ou mudou de lugar."
        action={
          <Link
            href="/home"
            className={cn(
              buttonVariants(),
              "h-11 rounded-xl px-6 text-sm font-bold",
            )}
          >
            Voltar para a Home
          </Link>
        }
      />
    </div>
  );
}
