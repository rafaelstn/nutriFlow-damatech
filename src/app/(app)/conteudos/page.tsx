"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonsTab } from "@/features/lessons/LessonsTab";
import { RecipesTab } from "@/features/recipes/RecipesTab";

/**
 * Conteúdos: aulas e receitas.
 *
 * A busca vive aqui, acima das abas, porque a intenção da usuária é uma só
 * ("achar aquilo que eu quero"), enquanto o filtro por categoria pertence a
 * cada aba, que tem vocabulário próprio.
 */
export default function ContentPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="pb-8">
      <header className="px-5 pt-6">
        <h1 className="text-xl font-extrabold leading-tight tracking-tight">
          Conteúdos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aulas e receitas para colocar o seu plano em prática.
        </p>
      </header>

      <div className="px-5 pt-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar aula ou receita"
            aria-label="Buscar aula ou receita"
            className="h-11 w-full rounded-full border border-border/70 bg-card pl-10 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      <Tabs defaultValue="aulas" className="mt-4">
        <div className="px-5">
          <TabsList className="flex h-12 w-full rounded-full bg-muted p-1 group-data-horizontal/tabs:h-12">
            <TabsTrigger
              value="aulas"
              className="h-full rounded-full text-sm font-bold data-active:bg-card data-active:text-foreground"
            >
              Aulas
            </TabsTrigger>
            <TabsTrigger
              value="receitas"
              className="h-full rounded-full text-sm font-bold data-active:bg-card data-active:text-foreground"
            >
              Receitas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="aulas" className="px-5 pt-5">
          <LessonsTab query={query} />
        </TabsContent>

        <TabsContent value="receitas" className="px-5 pt-5">
          <RecipesTab query={query} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
