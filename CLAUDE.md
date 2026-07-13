# NutriFlow (demonstração comercial)

App mobile de nutrição para apresentação a cliente (nutricionista que hoje faz
mentoria online). **Não é produto final.** Sem backend, banco, pagamento,
integração ou autenticação real. Dados 100% mockados, persistidos no aparelho.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 ·
shadcn/ui (**Base UI**, não Radix) · Framer Motion · Zustand + persist ·
React Hook Form + Zod · Recharts · Lucide · Vitest.

## Regras do projeto

1. **Camadas**: UI → features → services → mocks. Componente NUNCA importa de
   `src/mocks` direto: sempre via `src/services`.
2. **XP tem dono**: `useProgressStore.addXp` é a única porta de entrada de
   pontos. Nível é derivado do XP (`getLevelInfo`), nunca gravado.
3. **Anti-duplicidade na store**, não na tela: aula, receita, desafio e
   recompensa não pontuam duas vezes, nem com toque duplo.
4. **Zero emoji na interface.** Ícone Lucide, sempre. Vale para toast e modal.
5. **Acentuação PT-BR correta** em todo texto visível. Identificador, rota e
   import nunca levam acento.
6. **Sem traço/travessão** como separador de frase. Vírgula, ponto, dois-pontos
   ou parênteses.
7. **Nada de `window.alert/confirm/prompt`**: usar `ConfirmDialog` ou `Dialog`.
8. **URLs externas só em `src/config/app.ts`**, com `rel="noopener noreferrer"`
   nos links. Zero `dangerouslySetInnerHTML`.
9. **Mobile-first**: 360 a 430 px. No desktop o app vive dentro da moldura de
   dispositivo (`DeviceFrame`).
10. **Base UI**: `<Button asChild>` não existe. Para link com cara de botão, use
    `buttonVariants()` no `className` do `<Link>`.

## Antes de fechar qualquer alteração

```bash
npm run typecheck && npm run lint && npm test
```

## Onde mexer para rebrand

`src/config/app.ts` (nome, nutricionista, WhatsApp, links) e os tokens de cor em
`src/app/globals.css`. Símbolo em `src/components/brand/Logo.tsx`.

Decisões e premissas: `docs/DECISOES.md`.
