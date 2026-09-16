import { useCallback, useEffect, useState } from "react";
import { fetchForecasts } from "./lib/weatherApi";
import { CITIES } from "./data/cities";
import { CitySelector } from "./components/CitySelector";
import { TodayHero } from "./components/TodayHero";
import { ForecastGrid } from "./components/ForecastGrid";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import type { CityForecast } from "./types";

export default function App() {
  const [forecasts, setForecasts] = useState<CityForecast[] | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // D-04: primera ciudad del array, sin caso especial. Sucre, capital
  // constitucional, es CITIES[0] por ese orden — no porque se privilegie.
  const [selectedId, setSelectedId] = useState<string>(CITIES[0].id);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(false);
    fetchForecasts()
      .then((data) => setForecasts(data))
      .catch((cause: unknown) => {
        console.error(cause);
        setError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // oxlint marca un aviso aceptado (set-state-in-effect) en el patrón
  // estándar de carga al montar — ver bloque 11 / AI_LOG para el detalle.
  useEffect(() => {
    load();
  }, [load]);

  const selected = forecasts?.find((f) => f.city.id === selectedId);

  return (
    <>
      <header className="site-header">
        <div className="site-header__brand">
          <span className="site-header__icon" aria-hidden="true">☀️</span>
          <strong>BOLIVIA CLIMA</strong>
          <span className="site-header__divider" aria-hidden="true" />
          <span className="site-header__tag">Pronóstico meteorológico departamental</span>
        </div>
        <span className="site-header__meta">UTC-4 · Hora oficial de Bolivia</span>
      </header>

      <main className="app">
        {isLoading && <LoadingState />}
        {!isLoading && error && <ErrorState onRetry={load} />}

        {!isLoading && !error && forecasts && (
          <>
            <CitySelector cities={CITIES} selectedId={selectedId} onSelect={setSelectedId} />
            {selected && (
              <>
                <TodayHero forecast={selected} />
                <ForecastGrid forecast={selected} />
              </>
            )}
          </>
        )}
      </main>

      <footer className="site-footer">
        <span>Datos: Open-Meteo</span>
        <span>Actualización cada 30 minutos</span>
      </footer>
    </>
  );
}
