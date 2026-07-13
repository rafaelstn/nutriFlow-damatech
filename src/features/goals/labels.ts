import type { ActivityLevel, Objective, Sex } from "@/utils/nutrition";

/**
 * Rotulos exibidos na interface.
 *
 * O valor do dominio continua sendo o slug sem acento definido em
 * utils/nutrition ("sedentario", "manutencao"...). O texto acentuado vive aqui e
 * so aparece na tela: nenhum identificador do codigo carrega acento.
 */

export const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
];

export const OBJECTIVE_OPTIONS: { value: Objective; label: string }[] = [
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "manutencao", label: "Manutenção" },
  { value: "hipertrofia", label: "Hipertrofia" },
];

export const ACTIVITY_OPTIONS: {
  value: ActivityLevel;
  label: string;
  hint: string;
}[] = [
  { value: "sedentario", label: "Sedentário", hint: "Pouco ou nenhum treino" },
  { value: "leve", label: "Leve", hint: "1 a 2 treinos na semana" },
  { value: "moderado", label: "Moderado", hint: "3 a 4 treinos na semana" },
  { value: "intenso", label: "Intenso", hint: "5 a 6 treinos na semana" },
  { value: "atleta", label: "Atleta", hint: "Treino diário ou competição" },
];
