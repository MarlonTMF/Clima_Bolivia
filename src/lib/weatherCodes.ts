import type { Condition } from "../types";

/**
 * Traduce el estándar WMO 4677 (weather_code de Open-Meteo, ~30 códigos
 * numéricos sin descripción) a 8 categorías legibles en español (D-07).
 *
 * La agrupación es una decisión de producto, no técnica: un usuario no
 * necesita distinguir "llovizna helada ligera" de "llovizna helada densa".
 * Verificado contra open-meteo.com/en/docs el 15-09-2026.
 *
 * `icon` es una CLAVE semántica (WeatherIconKey), no un emoji — se
 * renderiza con un SVG propio (src/components/icons/WeatherIcon.tsx).
 * Los emoji se descartaron por pedido explícito: se leen inconsistentes
 * entre sistemas operativos y poco profesionales.
 */
const GROUPS: Array<{ codes: number[]; condition: Condition }> = [
  { codes: [0], condition: { label: "Despejado", icon: "clear" } },
  { codes: [1, 2], condition: { label: "Parcialmente nublado", icon: "partly-cloudy" } },
  { codes: [3], condition: { label: "Nublado", icon: "cloudy" } },
  { codes: [45, 48], condition: { label: "Niebla", icon: "fog" } },
  { codes: [51, 53, 55, 56, 57], condition: { label: "Llovizna", icon: "drizzle" } },
  // 80-82 son chubascos: se agrupan con lluvia (D-07), no merecen categoría propia.
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], condition: { label: "Lluvia", icon: "rain" } },
  { codes: [71, 73, 75, 77, 85, 86], condition: { label: "Nieve", icon: "snow" } },
  { codes: [95, 96, 99], condition: { label: "Tormenta", icon: "storm" } },
];

const BY_CODE = new Map<number, Condition>(
  GROUPS.flatMap(({ codes, condition }) => codes.map((c) => [c, condition] as const)),
);

/**
 * Un código no reconocido no debe romper la tarjeta: la API puede añadir
 * códigos en el futuro que nuestra tabla no cubra.
 */
export function describeWeatherCode(code: number): Condition {
  return BY_CODE.get(code) ?? { label: "Sin datos", icon: "unknown" };
}
