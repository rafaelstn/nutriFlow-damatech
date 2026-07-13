import type { Supplement } from "@/types";
import { LINKS } from "@/config/app";

/** Vitrine de produtos selecionados. Links externos saem de src/config/app.ts. */
export const MOCK_SUPPLEMENTS: Supplement[] = [
  {
    id: "s-creatina",
    name: "Creatina monoidratada",
    image: "/images/supplements/creatina.jpg",
    category: "Performance",
    description:
      "O suplemento mais estudado do mercado. 3 a 5 gramas por dia, em qualquer horário, todos os dias.",
    benefits: [
      "Mais força e volume de treino",
      "Recuperação muscular acelerada",
      "Segurança comprovada em uso contínuo",
    ],
    priceLabel: "A partir de R$ 89",
    externalUrl: `${LINKS.supplementsStore}/creatina`,
  },
  {
    id: "s-whey",
    name: "Whey protein concentrado",
    image: "/images/supplements/whey.jpg",
    category: "Proteína",
    description:
      "Praticidade para fechar a meta de proteína nos dias em que a rotina não colabora.",
    benefits: [
      "25 gramas de proteína por dose",
      "Absorção rápida no pós-treino",
      "Resolve o lanche em 2 minutos",
    ],
    priceLabel: "A partir de R$ 129",
    externalUrl: `${LINKS.supplementsStore}/whey-protein`,
  },
  {
    id: "s-omega-3",
    name: "Ômega 3",
    image: "/images/supplements/omega-3.jpg",
    category: "Saúde",
    description:
      "Indicado quando o consumo de peixe é baixo. Procure concentração mínima de EPA e DHA no rótulo.",
    benefits: [
      "Apoio à saúde cardiovascular",
      "Ação anti-inflamatória",
      "Suporte à função cognitiva",
    ],
    priceLabel: "A partir de R$ 69",
    externalUrl: `${LINKS.supplementsStore}/omega-3`,
  },
  {
    id: "s-multivitaminico",
    name: "Multivitamínico",
    image: "/images/supplements/multivitaminico.jpg",
    category: "Vitaminas",
    description:
      "Cobertura de micronutrientes para fases de rotina corrida ou restrição alimentar.",
    benefits: [
      "Cobre lacunas da alimentação",
      "Suporte à imunidade",
      "Dose única diária",
    ],
    priceLabel: "A partir de R$ 59",
    externalUrl: `${LINKS.supplementsStore}/multivitaminico`,
  },
];
