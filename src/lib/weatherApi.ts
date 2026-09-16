import { CITIES } from "../data/cities";
import { describeWeatherCode } from "./weatherCodes";
import type { CityForecast, DayForecast } from "../types";

/**
 * Llamada directa a Open-Meteo (D-01), sin backend en medio. Si algún día
 * se antepusiera un proxy (D-09: diseñado y finalmente descartado) o se
 * cambiara de proveedor, esta es la ÚNICA línea que cambia — el resto de
 * este archivo no se entera, gracias a la separación de D-06.
 */
const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 10_000;

/**
 * Variables diarias verificadas contra open-meteo.com/en/docs (D-01, D-11).
 * apparent_temperature_* y wind_speed_10m_max SÍ existen a granularidad
 * diaria. Humedad y presión NO, y por eso no están aquí (D-11).
 */
const DAILY_VARS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "wind_speed_10m_max",
].join(",");

function buildUrl(): string {
  const params = new URLSearchParams({
    latitude: CITIES.map((c) => c.latitude).join(","),
    longitude: CITIES.map((c) => c.longitude).join(","),
    daily: DAILY_VARS,
    timezone: "America/La_Paz",
    forecast_days: "7",
  });
  return `${BASE_URL}?${params}`;
}

/**
 * Forma mínima que se lee de la respuesta cruda. Nada de esto sale de este
 * archivo (D-06): App.tsx y los componentes solo conocen CityForecast.
 */
type RawDaily = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  wind_speed_10m_max: number[];
};
type RawEntry = { daily?: Partial<RawDaily> };

export async function fetchForecasts(): Promise<CityForecast[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Caso 1 — red caída: fetch rechaza y cae directo al catch de abajo.
    const response = await fetch(buildUrl(), { signal: controller.signal });

    // Caso 2 — HTTP no-OK: fetch NO lanza en 4xx/5xx. Sin esta comprobación,
    // un 500 se intentaría parsear como si fuera JSON válido.
    if (!response.ok) {
      throw new Error(`El servicio de clima respondió ${response.status}.`);
    }

    const payload: unknown = await response.json();

    // Con una coordenada Open-Meteo devuelve un objeto; con varias, un
    // array (D-05). Siempre pedimos 9, pero se normaliza por si acaso.
    const entries: RawEntry[] = Array.isArray(payload) ? payload : [payload as RawEntry];

    // Caso 4 — JSON con forma inesperada: validar ANTES de mapear.
    if (entries.length !== CITIES.length) {
      throw new Error(`Se esperaban ${CITIES.length} ciudades y llegaron ${entries.length}.`);
    }

    return entries.map((entry, i) => {
      const daily = entry.daily;
      if (!daily?.time?.length) {
        throw new Error(`La respuesta para ${CITIES[i].name} no trae datos diarios.`);
      }
      // A partir de aquí se asume que los demás arrays existen: Open-Meteo
      // los entrega siempre juntos cuando `time` está presente. Es una
      // simplificación deliberada — los 5 casos de error documentados
      // cubren los fallos reales, no cada combinación teórica posible.
      const days: DayForecast[] = daily.time.map((date, d) => ({
        date,
        maxTemp: Math.round(daily.temperature_2m_max![d]),
        minTemp: Math.round(daily.temperature_2m_min![d]),
        feelsLikeMax: Math.round(daily.apparent_temperature_max![d]),
        feelsLikeMin: Math.round(daily.apparent_temperature_min![d]),
        windMaxKmh: Math.round(daily.wind_speed_10m_max![d]),
        // Caso 5 — código WMO desconocido: describeWeatherCode nunca
        // falla, devuelve un valor neutro (D-07).
        condition: describeWeatherCode(daily.weather_code![d]),
      }));
      return { city: CITIES[i], days };
    });
  } catch (cause) {
    // Caso 3 — timeout: distinguir el abort deliberado de otros fallos,
    // para que el mensaje que vea el usuario sea el correcto.
    if (cause instanceof DOMException && cause.name === "AbortError") {
      throw new Error("El servicio de clima tardó demasiado en responder.");
    }
    throw cause;
  } finally {
    clearTimeout(timer);
  }
}
