/**
 * Modelo de datos de la aplicación. NUNCA usar nombres crudos de la API
 * (temperature_2m_max, weather_code...) fuera de src/lib/weatherApi.ts (D-06).
 */

export type City = {
  id: string;
  name: string;
  department: string;
  latitude: number;
  longitude: number;
  /** Metros sobre el nivel del mar. Verificado contra el campo "elevation"
   *  de la propia respuesta de Open-Meteo (docs/api-sample.json), no una
   *  cifra buscada aparte. */
  elevationM: number;
};

/**
 * Claves de icono, no emoji (pedido explícito: los emoji se leen
 * inconsistentes entre sistemas y poco profesionales). Cada clave se
 * renderiza con un SVG propio — ver src/components/icons/WeatherIcon.tsx.
 */
export type WeatherIconKey =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm"
  | "unknown";

export type Condition = {
  label: string;
  icon: WeatherIconKey;
};

export type DayForecast = {
  /** ISO "2026-09-16" */
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: Condition;
  /** D-11: sensación térmica, sí disponible como variable diaria. */
  feelsLikeMax: number;
  feelsLikeMin: number;
  /** D-11: viento máximo del día, km/h. Humedad y presión NO se incluyen:
   *  no existen a granularidad diaria en la API (ver D-11). */
  windMaxKmh: number;
};

export type CityForecast = {
  city: City;
  days: DayForecast[];
};
