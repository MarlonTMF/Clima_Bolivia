import { formatDate } from "../lib/formatDate";
import type { DayForecast } from "../types";

type Props = {
  day: DayForecast;
  isToday: boolean;
};

/**
 * Composición fijada en docs/design/tokens.md: fecha (+ badge HOY) →
 * condición → máxima dominante / mínima secundaria en la misma línea →
 * sensación térmica → viento. La máxima y la mínima se distinguen por
 * tamaño y color, no solo por la etiqueta — deben leerse de un vistazo.
 */
export function ForecastCard({ day, isToday }: Props) {
  return (
    <article className={`forecast-card${isToday ? " forecast-card--today" : ""}`}>
      <header className="forecast-card__date">
        {formatDate(day.date)}
        {isToday && <span className="forecast-card__badge">HOY</span>}
      </header>

      <p className="forecast-card__condition">
        <span aria-hidden="true">{day.condition.icon}</span> {day.condition.label}
      </p>

      <p className="forecast-card__temps">
        <span className="forecast-card__max">{day.maxTemp}°</span>
        <span className="forecast-card__min">{day.minTemp}°</span>
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
