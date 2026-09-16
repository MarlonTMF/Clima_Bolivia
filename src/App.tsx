import { useEffect, useState } from "react";
import { fetchForecasts } from "./lib/weatherApi";
import { CITIES } from "./data/cities";
import { CitySelector } from "./components/CitySelector";
import { ForecastGrid } from "./components/ForecastGrid";
import type { CityForecast } from "./types";

export default function App() {
  const [forecasts, setForecasts] = useState<CityForecast[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // D-04: primera ciudad del array, sin caso especial. Sucre, capital
  // constitucional, es CITIES[0] por ese orden — no porque se privilegie.
  const [selectedId, setSelectedId] = useState<string>(CITIES[0].id);

  useEffect(() => {
    fetchForecasts()
      .then(setForecasts)
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Error desconocido"),
      );
  }, []);

  const selected = forecasts?.find((f) => f.city.id === selectedId);

  return (
    <main className="app">
      <header className="app__header">
        <h1>Clima Bolivia</h1>
        <p className="app__subtitle">Pronóstico de 7 días para las 9 capitales departamentales</p>
      </header>

      {/* Estados de carga y error reales llegan en el bloque 11.
          Placeholder mínimo aquí para que la app no se rompa mientras tanto. */}
      {error && <p role="alert">Error: {error}</p>}
      {!forecasts && !error && <p>Cargando…</p>}

      {forecasts && (
        <>
          <CitySelector cities={CITIES} selectedId={selectedId} onSelect={setSelectedId} />
          {selected && <ForecastGrid forecast={selected} />}
        </>
      )}
    </main>
  );
}
