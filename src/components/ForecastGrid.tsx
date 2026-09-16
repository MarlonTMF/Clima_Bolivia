import { ForecastCard } from "./ForecastCard";
import type { CityForecast } from "../types";

type Props = {
  forecast: CityForecast;
};

/**
 * Hoy en La Paz, no en el navegador del visitante. Un visitante en otro
 * huso horario no debe ver marcada como "hoy" una fecha que en Bolivia ya
 * es mañana — se calcula en America/La_Paz, igual que la API (D-05).
 */
function todayInBolivia(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/La_Paz" }).format(new Date());
}

/** Los 7 días de la ciudad activa, en fila horizontal sin scroll (D-05, D-06). */
export function ForecastGrid({ forecast }: Props) {
  const today = todayInBolivia();

  return (
    <section className="forecast-grid" aria-label={`Pronóstico de ${forecast.days.length} días para ${forecast.city.name}`}>
      {forecast.days.map((day) => (
        <ForecastCard key={day.date} day={day} isToday={day.date === today} />
      ))}
    </section>
  );
}
