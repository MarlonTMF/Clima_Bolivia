import type { CityForecast } from "../types";

/**
 * Copia local de la última respuesta correcta.
 *
 * Es la capa cliente del diseño de D-09. Del proxy con caché en servidor se
 * descartó la parte de servidor, no esta: guardar en el navegador no necesita
 * backend, y es lo que da datos reales a la pantalla "Datos antiguos" que el
 * diseño contempla.
 *
 * Todo va en try/catch porque localStorage lanza en modo privado y cuando el
 * almacenamiento está lleno. Que falle la copia no puede romper la carga.
 */
const KEY = "clima-bolivia:ultimo-pronostico:v1";

export type CachedForecasts = {
  savedAt: number;
  forecasts: CityForecast[];
};

export function saveForecasts(forecasts: CityForecast[]): void {
  try {
    const payload: CachedForecasts = { savedAt: Date.now(), forecasts };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Sin copia local la aplicación sigue funcionando: sólo pierde el
    // respaldo ante un fallo posterior de la API.
  }
}

export function readForecasts(): CachedForecasts | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    // Lo guardado en el navegador puede venir de una versión anterior de la
    // aplicación, así que no se confía en su forma: se comprueba.
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as CachedForecasts).savedAt !== "number" ||
      !Array.isArray((parsed as CachedForecasts).forecasts) ||
      (parsed as CachedForecasts).forecasts.length === 0
    ) {
      return null;
    }
    return parsed as CachedForecasts;
  } catch {
    return null;
  }
}

/** "hace unos minutos", "hace 2 horas", "hace 3 días" — sin librerías. */
export function describeAge(savedAt: number, now: number = Date.now()): string {
  const minutes = Math.floor((now - savedAt) / 60_000);
  if (minutes < 1) return "hace unos segundos";
  if (minutes < 60) return minutes === 1 ? "hace 1 minuto" : `hace ${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "hace 1 hora" : `hace ${hours} horas`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "hace 1 día" : `hace ${days} días`;
}

/** Hora local de Bolivia en formato 24 h, para la banda de aviso. */
export function formatClock(savedAt: number): string {
  return new Intl.DateTimeFormat("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/La_Paz",
  }).format(new Date(savedAt));
}
