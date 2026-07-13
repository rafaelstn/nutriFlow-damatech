import type { Reward } from "@/types";

/**
 * Loja de recompensas. O campo `available` é recalculado no serviço a partir do
 * XP atual: aqui ele guarda apenas o valor inicial.
 */
export const MOCK_REWARDS: Reward[] = [
  {
    id: "rw-ebook",
    title: "E-book exclusivo",
    description:
      "30 receitas rápidas com até 400 kcal, organizadas por refeição e tempo de preparo.",
    image: "/images/rewards/ebook.jpg",
    requiredPoints: 1000,
    type: "conteudo",
    available: true,
    redeemed: false,
  },
  {
    id: "rw-cardapio",
    title: "Cardápio de lanches",
    description:
      "Um mês de opções de lanche pré e pós-treino, com lista de compras pronta.",
    image: "/images/rewards/cardapio-lanches.jpg",
    requiredPoints: 2000,
    type: "conteudo",
    available: true,
    redeemed: false,
  },
  {
    id: "rw-consulta",
    title: "Consulta de revisão",
    description:
      "30 minutos por vídeo com a nutricionista para ajustar o seu plano atual.",
    image: "/images/rewards/consulta.jpg",
    requiredPoints: 5000,
    type: "servico",
    available: false,
    redeemed: false,
  },
  {
    id: "rw-kit-suplementos",
    title: "Kit de suplementos",
    description:
      "Kit com creatina, whey e multivitamínico das marcas selecionadas pela Nutri.",
    image: "/images/rewards/kit-suplementos.jpg",
    requiredPoints: 8000,
    type: "produto",
    available: false,
    redeemed: false,
  },
  {
    id: "rw-desconto-mentoria",
    title: "20% de desconto na mentoria",
    description:
      "Desconto no acompanhamento individual de 3 meses, com contato direto pelo WhatsApp.",
    image: "/images/rewards/mentoria.jpg",
    requiredPoints: 10000,
    type: "desconto",
    available: false,
    redeemed: false,
  },
];
