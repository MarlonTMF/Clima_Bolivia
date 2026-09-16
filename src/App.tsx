import { useCallback, useEffect, useState } from "react";
import { fetchForecasts } from "./lib/weatherApi";
import { saveForecasts, readForecasts } from "./lib/forecastCache";
import { CITIES } from "./data/cities";
import { CitySelector } from "./components/CitySelector";
import { TodayHero } from "./components/TodayHero";
import { ForecastGrid } from "./components/ForecastGrid";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { StaleBanner } from "./components/StaleBanner";
import { WeatherIcon } from "./components/icons/WeatherIcon";
import type { CityForecast } from "./types";

/**
 * Cuatro estados, no tres. "stale" existe porque una carga fallida con copia
 * guardada no es lo mismo que una carga fallida sin nada que mostrar: en el
 * primer caso hay datos reales, sólo que viejos, y ocultarlos sería peor que
 * enseñarlos con su aviso.
 */
type Status = "loading" | "ok" | "stale" | "error";

export default function App() {
  const [forecasts, setForecasts] = useState<CityForecast[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  // D-04: primera ciudad del array, sin caso especial. Sucre, capital
  // constitucional, es CITIES[0] por ese orden — no porque se privilegie.
  const [selectedId, setSelectedId] = useState<string>(CITIES[0].id);

  const load = useCallback(() => {
    setStatus("loading");
    fetchForecasts()
      .then((data) => {
        setForecasts(data);
        setSavedAt(null);
        setStatus("ok");
        saveForecasts(data);
      })
      .catch((cause: unknown) => {
        console.error(cause);
        const cached = readForecasts();
        if (cached) {
          setForecasts(cached.forecasts);
          setSavedAt(cached.savedAt);
          setStatus("stale");
        } else {
          setStatus("error");
        }
      });
  }, []);

  // oxlint marca un aviso aceptado (set-state-in-effect) en el patrón
  // estándar de carga al montar — ver bloque 11 / AI_LOG para el detalle.
  useEffect(() => {
    load();
  }, [load]);

  const selected = forecasts?.find((f) => f.city.id === selectedId);
  const selectedCity = CITIES.find((c) => c.id === selectedId) ?? CITIES[0];
  const showData = (status === "ok" || status === "stale") && selected;

  return (
    <>
      <header className="site-header">
        <div className="site-header__brand">
          <span className="site-header__icon">
            <WeatherIcon code="clear" size={20} />
          </span>
          <strong>BOLIVIA CLIMA</strong>
          <span className="site-header__divider" aria-hidden="true" />
          <span className="site-header__tag">Pronóstico meteorológico departamental</span>
        </div>
        <span className="site-header__meta">UTC-4 · Hora oficial de Bolivia</span>
      </header>

      <main className="app">
        {status === "stale" && savedAt !== null && (
          <StaleBanner savedAt={savedAt} onRetry={load} />
        )}

        {/* El selector no depende de la API (D-04), así que se muestra en los
            cuatro estados: durante la carga y ante un fallo sigue siendo útil
            y evita que la página dé un salto cuando llegan los datos. */}
        <CitySelector cities={CITIES} selectedId={selectedId} onSelect={setSelectedId} />

        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState cityName={selectedCity.name} onRetry={load} />}

        {showData && (
          <>
            <TodayHero forecast={selected} isStale={status === "stale"} />
            <ForecastGrid forecast={selected} />
          </>
        )}
      </main>

      <footer className="site-footer">
        <span>Datos: Open-Meteo</span>
        <span>Se actualiza al abrir la página</span>
      </footer>
    </>
  );
}
