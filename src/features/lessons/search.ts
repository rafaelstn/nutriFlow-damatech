/**
 * Busca da tela de Conteúdos, compartilhada pelas abas de Aulas e de Receitas.
 *
 * A comparação ignora acento e caixa: quem digita "cafe" precisa encontrar
 * "Café da manhã", que é como a pessoa realmente pesquisa no celular.
 */

/**
 * Sinais diacríticos combinantes (faixa U+0300 a U+036F).
 * Construído por RegExp para o arquivo nunca guardar caractere invisível.
 */
const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(DIACRITICS, "").toLowerCase().trim();
}

/** Busca vazia não filtra nada. */
export function matchesQuery(title: string, query: string): boolean {
  const term = normalizeText(query);
  if (!term) return true;
  return normalizeText(title).includes(term);
}
