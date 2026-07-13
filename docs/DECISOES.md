# Decisões de projeto (NutriFlow, demonstração comercial)

Registro das escolhas que não são óbvias no código, incluindo as ambiguidades do
briefing e a premissa adotada em cada uma.

## Escopo

Esta é uma **demonstração comercial navegável**, não o produto final. Não existe
backend, banco, pagamento, integração nem autenticação real. Todos os dados são
mockados e ficam no aparelho (localStorage, via Zustand persist).

## Arquitetura

**Camadas: UI → Feature Modules → Mock Services → Mock Data.**
Nenhum componente importa de `src/mocks` diretamente; tudo passa por
`src/services`. Os serviços têm a mesma assinatura que uma API real teria, então
a troca por HTTP é a substituição do corpo das funções, sem tocar na interface.

**Latência artificial** de 300 a 700 ms nas leituras (`src/services/mock-api.ts`),
para a demonstração exercitar skeletons de verdade e parecer um app em operação.

## Estado e gamificação

**A `useProgressStore` é a fonte única do XP.** Nenhuma outra store escreve em
`xp`: todas chamam a ação central `addXp`. O nível nunca é gravado, é sempre
derivado do XP em `getLevelInfo` (`src/utils/gamification.ts`). Isso evita o
clássico bug de nível e pontos divergirem no meio da apresentação.

**Guardas anti-duplicidade** ficam na store (fonte única do estado), não na
interface e não duplicadas no serviço: aula concluída, receita preparada, desafio
concluído e recompensa resgatada não pontuam nem se repetem, mesmo com toque
duplo (a verificação é refeita depois do `await`).

**Teto diário de XP de água** (`XP_RULES.maxWaterLogsPerDay`, 8 registros). A água
continua sendo registrada depois do teto, mas sem pagar XP: evita que a
apresentação vire farm de pontos no botão de +500 ml.

**Ranking reativo.** O ranking não é uma lista fixa: os competidores são fixos, e
a Mariana entra com o XP atual dela, recalculado a cada ponto conquistado
(`buildRanking`). Ao empatar, ela fica na frente, porque acabou de pontuar.

**Resgate de recompensa não debita pontos.** É uma solicitação enviada à
nutricionista, coerente com o modelo de mentoria. Documentado aqui porque é uma
regra de negócio, não um esquecimento.

## Interface

**Moldura de dispositivo.** Entre 360 e 430 px o app ocupa a tela inteira. No
desktop ele é centralizado dentro de um aparelho premium, para a apresentação em
notebook parecer um app rodando em um telefone.

**Zero emoji na interface.** O briefing sugeria emoji em alguns textos
("+50 XP conquistados 🎉", "Boa tarde, Mariana 👋"). Foi trocado por ícone SVG
(Lucide) com traço consistente: é a regra de acabamento premium da casa, e emoji
em botão, card ou toast derruba a percepção de produto pronto. Os textos foram
mantidos, sem o glifo.

**Sem foto de pessoa.** Avatares são monogramas (iniciais em fundo da marca).
Evita dado pessoal real e mantém o visual coeso.

**Imagens baixadas para `public/`.** As 29 fotos (Unsplash, licença livre) estão
no repositório, e não em CDN: a demonstração precisa funcionar sem internet na
sala do cliente. Créditos em `docs/CREDITS.md`.

## Segurança e privacidade (demo)

Nenhuma paciente real, nenhum dado clínico verdadeiro e nenhum dado sensível.
A nutricionista da demo (Dra. Helena Rocha, CRN-3 12345) é fictícia. Formulários
validados com Zod, nenhum uso de `dangerouslySetInnerHTML`, links externos sempre
com `rel="noopener noreferrer"` e URLs centralizadas em `src/config/app.ts`.

A calculadora de metas exibe o aviso obrigatório (`DISCLAIMER`): é estimativa
educativa, não prescrição clínica.

## Rebrand

Trocar nome, marca e contato exige mexer em dois lugares:
`src/config/app.ts` (nome, tagline, nutricionista, WhatsApp, links) e os tokens
de cor em `src/app/globals.css`. O símbolo é SVG em `src/components/brand/Logo.tsx`.
