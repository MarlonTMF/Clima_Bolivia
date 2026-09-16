/**
 * "2026-09-16" → "Mié 16 sep". Creado en el bloque 08, no en el 10: es
 * lógica pura sin dependencia de UI, igual que weatherCodes.ts, y se
 * prueba junto a él antes de que la interfaz lo consuma.
 *
 * La trampa: `new Date("2026-09-16")` interpreta la fecha como UTC
 * medianoche. En Bolivia (UTC−4) eso puede mostrar el día ANTERIOR si se
 * usan los getters locales (`getDate()`) sobre ese objeto. Se evita
 * parseando año/mes/día a mano y construyendo la fecha en horario local,
 * nunca dejando que el motor interprete el string.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const local = new Date(year, month - 1, day); // horario LOCAL, no UTC

  const formatted = new Intl.DateTimeFormat("es-BO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(local);

  // Intl.DateTimeFormat da "mié, 16 sept" — se ajusta a "Mié 16 sep":
  // sin coma, mes recortado a 3 letras, primera letra en mayúscula.
  return formatted
    .replace(",", "")
    .replace(/^(\p{L})/u, (c) => c.toUpperCase())
    .replace(/\b(\p{L}{3})\p{L}*\.?$/u, "$1");
}
