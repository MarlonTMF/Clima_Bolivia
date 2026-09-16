import { useEffect, useState } from "react";
import { fetchForecasts } from "./lib/weatherApi";
import type { CityForecast } from "./types";

/**
 * Render mínimo, deliberadamente sin estilos ni componentes: el objetivo
 * del bloque 09 es probar que el pipeline de despliegue funciona con datos
 * reales, antes de invertir tiempo en la interfaz (bloque 10).
 */
export default function App() {
  const [forecasts, setForecasts] = useState<CityForecast[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchForecasts()
      .then(setForecasts)
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Error desconocido"),
      );
  }, []);

  return (
    <main style={{ fontFamily: "monospace", padding: "1rem" }}>
      <h1>Clima Bolivia</h1>
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!forecasts && !error && <p>Cargando…</p>}
      {forecasts?.map((f) => (
        <section key={f.city.id}>
          <h2>
            {f.city.name} ({f.city.elevationM} m)
          </h2>
          <ul>
            {f.days.map((d) => (
              <li key={d.date}>
                {d.date} — {d.condition.icon} {d.condition.label} — máx {d.maxTemp}° / mín{" "}
                {d.minTemp}° — sensación {d.feelsLikeMax}°/{d.feelsLikeMin}° — viento{" "}
                {d.windMaxKmh} km/h
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
