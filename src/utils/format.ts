/** Formatadores de exibicao. Sempre pt-BR. */

export function formatXp(xp: number): string {
  return new Intl.NumberFormat("pt-BR").format(Math.max(0, Math.round(xp)));
}

/** 1800 -> "1,8L". Usado nos cards de resumo. */
export function formatLiters(ml: number): string {
  const liters = Math.max(0, ml) / 1000;
  return `${liters.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}L`;
}

export function formatMl(ml: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(Math.max(0, Math.round(ml)))} ml`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
}

/** Saudacao pela hora local do dispositivo. */
export function greeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function pluralize(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}
