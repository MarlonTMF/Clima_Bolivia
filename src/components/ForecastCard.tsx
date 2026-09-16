import { formatDate } from "../lib/formatDate";
import type { DayForecast } from "../types";

type Props = {
  day: DayForecast;
  isToday: boolean;
};

/**
 * Composición fiel a la referencia de Stitch (PantallaPrincipal): fecha +
 * badge HOY → icono grande y condición → MÁX/MÍN con etiqueta → sensación
 * → viento. Las etiquetas "MÁX"/"MÍN" son parte del diseño, no un extra —
 * se habían omitido en la primera implementación.
 */
export function ForecastCard({ day, isToday }: Props) {
  return (
    <article className={`forecast-card${isToday ? " forecast-card--today" : ""}`}>
      <header className="forecast-card__date">
        {formatDate(day.date)}
        {isToday && <span className="forecast-card__badge">HOY</span>}
      </header>

      <div className="forecast-card__condition">
        <span className="forecast-card__icon" aria-hidden="true">
          {day.condition.icon}
        </span>
        <span className="forecast-card__condition-label">{day.condition.label}</span>
      </div>

      <p className="forecast-card__temps">
        <span className="forecast-card__temp-group">
          <span className="forecast-card__temp-label">MÁX</span>
          <span className="forecast-card__max">{day.maxTemp}°</span>
        </span>
        <span className="forecast-card__temp-group">
          <span className="forecast-card__temp-label">MÍN</span>
          <span className="forecast-card__min">{day.minTemp}°</span>
        </span>
      </p>

      <p className="forecast-card__feels">
        Sensación {day.feelsLikeMax}°/{day.feelsLikeMin}°
      </p>

      <p className="forecast-card__wind">
        <span aria-hidden="true">💨</span> {day.windMaxKmh} km/h
      </p>
    </article>
  );
}
