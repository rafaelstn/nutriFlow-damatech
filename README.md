# NutriFlow

Demonstração comercial navegável de um aplicativo de nutrição, construída para
apresentação ao cliente. Não é o produto final: **todos os dados são mockados**,
não há backend, banco, pagamento, integração nem autenticação real.

O nome NutriFlow é provisório e foi desenhado para ser substituído: ver
"Rebrand" mais abaixo.

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
```

Acesso de demonstração (já vem preenchido na tela de login):

```
mariana@demo.com
123456
```

A apresentação funciona **offline**: as 29 imagens estão em `public/images/`, e
nenhuma requisição sai do aparelho.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run typecheck` | TypeScript strict, sem emitir |
| `npm run lint` | ESLint |
| `npm test` | Vitest (motor de gamificação, ranking e cálculos) |

## Como apresentar (roteiro sugerido)

1. **Splash e login**: a marca aparece, as credenciais já estão preenchidas.
2. **Home**: água, proteína, sequência e pontos. Progresso semanal com o gráfico.
3. **Conteúdos**: abra uma aula e marque como concluída. Ganha 50 XP, com animação.
4. **Ranking**: mostre a Mariana em 3º, a 250 XP do segundo lugar.
5. **Desafios**: registre o dia do Desafio Hidratação (está em 5/7). Ao fechar 7/7,
   o modal de conclusão entrega 300 XP.
6. **Volte ao Ranking**: ela ultrapassa o Lucas Mendes e **sobe para o 2º lugar,
   com a animação de mudança de posição**. É o momento alto da demonstração.
7. **Água**: registre um copo, veja a garrafa encher e mais 10 XP entrarem.
8. **Recompensas**: com o XP novo, resgate o e-book.
9. **Metas**: calcule as metas da pessoa e mostre o aviso de conteúdo educativo.
10. **Mentoria**: o botão de WhatsApp é a conversão da demonstração.
11. **Perfil**: "Resetar demonstração" devolve tudo ao estado inicial, para a
    próxima apresentação começar limpa.

## Arquitetura

```
UI  →  Feature Modules  →  Mock Services  →  Mock Data
```

```
src/
  app/          rotas (App Router). (app)/ é a área autenticada, com bottom nav
  components/   ui (shadcn), layout, gamification, common, brand
  features/     um módulo por tela: auth, home, lessons, recipes, challenges,
                ranking, rewards, progress, goals, supplements, mentorship, profile
  services/     camada mockada com a assinatura de uma API real
  stores/       Zustand (auth, progress, lessons, recipes, challenges, rewards)
  mocks/        dados de demonstração
  types/        contratos de domínio
  utils/        gamificação, nutrição e formatação
  config/       branding, links externos e regras de XP
```

**Nenhum componente importa de `src/mocks` diretamente.** Tudo passa por
`src/services`, que simula latência de 300 a 700 ms e tem a mesma assinatura que
uma API real teria. Trocar o mock por HTTP é substituir o corpo dessas funções.

**A `useProgressStore` é a fonte única do XP**, com a ação central `addXp`.
Nenhuma outra store escreve pontos: todas chamam essa ação. O nível nunca é
gravado, é derivado do XP.

## Gamificação

| Ação | XP |
|---|---|
| Concluir aula | 50 |
| Preparar receita | 30 |
| Registrar água | 10 (até 8 registros por dia) |
| Concluir desafio | definido no desafio (o de Hidratação paga 300) |

Cada ação é protegida contra duplicidade: aula concluída, receita preparada,
desafio fechado e recompensa resgatada não pontuam de novo, nem com toque duplo.

O **ranking reage ao XP em tempo real**: os concorrentes são fixos, a usuária
entra na lista com o XP atual e a posição é recalculada a cada ponto.

## Rebrand

Trocar nome, cores e contato exige mexer em dois arquivos:

- `src/config/app.ts`: nome, tagline, nutricionista, número de WhatsApp e links.
- `src/app/globals.css`: tokens de cor (`--primary`, `--water`, `--protein`,
  `--streak`, `--xp`).

O símbolo é SVG em `src/components/brand/Logo.tsx`. Nenhuma URL externa está
espalhada pelo código.

## Documentação

- `docs/DECISOES.md`: decisões de projeto e premissas adotadas nas ambiguidades.
- `docs/CREDITS.md`: créditos das imagens (Unsplash, licença livre).
