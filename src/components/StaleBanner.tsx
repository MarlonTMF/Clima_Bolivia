import { HistoryIcon, RefreshIcon } from "./icons/WeatherIcon";
import { describeAge, formatClock } from "../lib/forecastCache";

type Props = {
  savedAt: number;
  onRetry: () => void;
};

/**
 * Aviso de que lo que se ve no es reciente.
 *
 * La antigüedad se calcula de la marca de tiempo guardada, no es un texto
 * fijo: si dijera "hace 2 horas" siempre, sería justo la clase de afirmación
 * falsa en la interfaz que este proyecto viene corrigiendo.
 */
export function StaleBanner({ savedAt, onRetry }: Props) {
  return (
    <section className="stale-banner" role="status">
      <span className="stale-banner__icon" aria-hidden="true">
        <HistoryIcon size={22} />
      </span>

      <div className="stale-banner__text">
        <p className="stale-banner__head">
          <span className="stale-banner__tag">Copia guardada en caché</span>
          <strong>Mostrando datos de {describeAge(savedAt)}</strong>
          <span className="stale-banner__clock">{formatClock(savedAt)} BOT</span>
        </p>
        <p className="stale-banner__detail">
          El servicio meteorológico en línea no responde temporalmente. Se exhiben las últimas
          lecturas registradas de forma segura.
        </p>
      </div>

      <button type="button" className="stale-banner__retry" onClick={onRetry}>
        <RefreshIcon size={16} />
        Reintentar sincronización
      </button>
    </section>
  );
}
