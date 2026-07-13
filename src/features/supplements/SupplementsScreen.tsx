"use client";

import { useCallback } from "react";
import { Info, PackageSearch } from "lucide-react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { CardListSkeleton } from "@/components/common/Skeletons";
import { EmptyState, ErrorState } from "@/components/common/States";
import { SupplementCard } from "./SupplementCard";
import { useAsyncData } from "@/hooks/useAsyncData";
import { supplementsService } from "@/services";
import { NUTRITIONIST } from "@/config/app";
import type { Supplement } from "@/types";

export function SupplementsScreen() {
  const loader = useCallback(() => supplementsService.getSupplements(), []);
  const isEmpty = useCallback(
    (items: Supplement[]) => items.length === 0,
    [],
  );

  const { data, status, reload } = useAsyncData<Supplement[]>(
    loader,
    [],
    isEmpty,
  );

  return (
    <div className="pb-10">
      <ScreenHeader
        title="Suplementos"
        subtitle={`Curadoria de ${NUTRITIONIST.shortName}`}
      />

      <section className="px-5 pt-5">
        <h2 className="text-lg font-extrabold leading-tight tracking-tight">
          Produtos selecionados pela Nutri.
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Marcas e formulações que {NUTRITIONIST.shortName} usa no consultório,
          com o porquê de cada uma.
        </p>
      </section>

      <div className="px-5 pt-5">
        {status === "loading" ? <CardListSkeleton count={3} /> : null}

        {status === "error" ? (
          <ErrorState
            title="Não conseguimos carregar a vitrine"
            description="Os produtos continuam disponíveis. Tente novamente em instantes."
            onRetry={reload}
          />
        ) : null}

        {status === "empty" ? (
          <EmptyState
            icon={PackageSearch}
            title="Nenhum produto por aqui ainda"
            description="A curadoria está sendo atualizada. Volte em breve."
          />
        ) : null}

        {status === "success" && data ? (
          <div className="space-y-4">
            {data.map((supplement, index) => (
              <SupplementCard
                key={supplement.id}
                supplement={supplement}
                index={index}
              />
            ))}
          </div>
        ) : null}
      </div>

      <section className="px-5 pt-6">
        <div className="flex gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
          <Info
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Indicação de caráter educativo. A necessidade, a dose e o momento de
            uso devem ser individualizados com {NUTRITIONIST.name}.
          </p>
        </div>
      </section>
    </div>
  );
}
