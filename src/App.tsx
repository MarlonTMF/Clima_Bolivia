import { useCallback, useEffect, useState } from "react";
import { fetchForecasts } from "./lib/weatherApi";
import { CITIES } from "./data/cities";
import { CitySelector } from "./components/CitySelector";
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
        // El detalle técnico (el que prueban weatherApi.test.ts) va a la
        // consola para quien depure. La pantalla solo muestra un mensaje
        // accionable — ver ErrorState.
        console.error(cause);
        setError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // oxlint marca un aviso aquí (set-state-in-effect): es el patrón estándar
  // de "cargar al montar". Evitarlo exigiría Suspense o una librería de
  // datos, que contradice D-03 para un proyecto de este tamaño. Aceptado.
  useEffect(() => {
    load();
  }, [load]);

  const selected = forecasts?.find((f) => f.city.id === selectedId);

  return (
    <main className="app">
      <header className="app__header">
        <h1>Clima Bolivia</h1>
        <p className="app__subtitle">Pronóstico de 7 días para las 9 capitales departamentales</p>
      </header>

      {isLoading && <LoadingState />}
      {!isLoading && error && <ErrorState onRetry={load} />}

      {!isLoading && !error && forecasts && (
        <>
          <CitySelector cities={CITIES} selectedId={selectedId} onSelect={setSelectedId} />
          {selected && <ForecastGrid forecast={selected} />}
        </>
      )}
    </main>
  );
}
