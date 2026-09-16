import { CloudOffIcon, HistoryIcon, RefreshIcon } from "./icons/WeatherIcon";

type Props = {
  cityName: string;
  onRetry: () => void;
};

/**
 * Un mensaje único y accionable, nunca el texto técnico crudo de
 * weatherApi.ts (ese es el contrato que verifican las pruebas del bloque 08
 * — /500/, /datos diarios/, etc. — no lo que debe ver un visitante).
 * "role=alert" para que un lector de pantalla lo anuncie sin que el usuario
 * tenga que ir a buscarlo.
 *
 * Como en el diseño, el error no vacía la página: la rejilla sigue ahí con
 * los 7 días marcados "Sin datos", para que se vea qué falta y no sólo que
 * algo falló.
 */
export function ErrorState({ cityName, onRetry }: Props) {
  return (
    <>
      <section className="error-state" role="alert">
        <span className="error-state__icon" aria-hidden="true">
          <CloudOffIcon size={30} />
        </span>
        <h2 className="error-state__title">No se pudo actualizar el pronóstico de {cityName}</h2>
        <p className="error-state__message">
          No fue posible conectar con el servicio meteorológico para obtener la información más
          reciente. Comprueba tu conexión a internet o inténtalo nuevamente en unos instantes.
        </p>
        <button type="button" className="error-state__retry" onClick={onRetry}>
          <RefreshIcon size={16} />
          Reintentar pronóstico
        </button>
        <p className="error-state__last">
          <HistoryIcon size={13} /> Último intento fallido: hace unos momentos
        </p>
      </section>

      <div className="skeleton__grid-head">
        <h2 className="skeleton__heading">Pronóstico a 7 días</h2>
        <span className="error-state__nodata">Datos no disponibles</span>
      </div>

      <div className="forecast-grid" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <article key={i} className="forecast-card forecast-card--empty">
            <span className="forecast-card__date">Día {i + 1}</span>
            <span className="forecast-card__icon">
              <CloudOffIcon size={26} />
            </span>
            <span className="forecast-card__condition">Sin datos</span>
            <div className="forecast-card__temps">
              <span className="forecast-card__max">--°</span>
              <span className="forecast-card__min">--°</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
