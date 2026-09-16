import type { CityForecast } from "../types";

type Props = {
  forecast: CityForecast;
};

/**
 * Réplica del panel "hoy" de la referencia de Stitch (PantallaPrincipal).
 * Una diferencia honesta y deliberada: el diseño original mostraba "11.4°"
 * como lectura instantánea de temperatura actual. No tenemos ese dato —
 * solo pronóstico diario (D-01) — así que el número grande es la MÁXIMA de
 * hoy, no una cifra inventada. La composición (subtítulo de altitud, nombre
 * grande, condición, número grande + sensación + viento a la derecha) sí
 * sigue la referencia.
 */
export function TodayHero({ forecast }: Props) {
  const today = forecast.days[0];

  return (
    <section className="today-hero">
      <div className="today-hero__place">
        <p className="today-hero__caption">
          <span aria-hidden="true">📍</span> {forecast.city.elevationM} m s. n. m. ·{" "}
          {forecast.city.department}
        </p>
        <h2 className="today-hero__city">{forecast.city.name}</h2>
        <p className="today-hero__condition">
          <span aria-hidden="true">{today.condition.icon}</span> {today.condition.label}
        </p>
      </div>
      <div className="today-hero__reading">
        <span className="today-hero__temp">{today.maxTemp}°</span>
        <div className="today-hero__details">
          <span>Sensación {today.feelsLikeMax}°</span>
          <span className="today-hero__wind">
            <span aria-hidden="true">💨</span> {today.windMaxKmh} km/h
          </span>
        </div>
      </div>
    </section>
  );
}
