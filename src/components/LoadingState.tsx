/**
 * Esqueleto de carga, no un spinner.
 *
 * El diseño mantiene la estructura completa de la página y sólo vacía lo que
 * depende de la API: el panel de hoy y las 7 tarjetas. Así la página no da un
 * salto de layout cuando llegan los datos, y quien mira ya entiende qué va a
 * aparecer y dónde.
 *
 * El selector de ciudad NO es esqueleto: sus datos son estáticos (D-04), no
 * vienen de la API, así que puede mostrarse completo y usarse mientras carga.
 */
export function LoadingState() {
  return (
    <section className="skeleton" aria-busy="true">
      {/* aria-busy en la sección ya comunica la carga. El texto oculto da
          la versión leíble; sin role="status", que es del aviso de datos
          antiguos — tenerlo en los dos los vuelve indistinguibles. */}
      <span className="sr-only">Cargando el pronóstico…</span>

      <div className="today-hero skeleton__hero">
        <div className="today-hero__place">
          <span className="skeleton__bar skeleton__bar--xs" />
          <span className="skeleton__bar skeleton__bar--title" />
          <span className="skeleton__bar skeleton__bar--sm" />
        </div>
        <div className="today-hero__reading">
          <span className="skeleton__block" />
          <div className="skeleton__stack">
            <span className="skeleton__bar skeleton__bar--sm" />
            <span className="skeleton__bar skeleton__bar--xs" />
          </div>
        </div>
      </div>

      <div className="skeleton__grid-head">
        <h2 className="skeleton__heading">Pronóstico a 7 días</h2>
        <span className="skeleton__sync">
          <span className="skeleton__pulse" aria-hidden="true" />
          Sincronizando
        </span>
      </div>

      <div className="forecast-grid skeleton__grid">
        {Array.from({ length: 7 }, (_, i) => (
          <article key={i} className="forecast-card skeleton__card">
            <span className="skeleton__bar skeleton__bar--sm" />
            <span className="skeleton__circle" />
            <span className="skeleton__bar skeleton__bar--md" />
            <div className="skeleton__temps">
              <span className="forecast-card__temp-label">MÁX</span>
              <span className="skeleton__bar skeleton__bar--xs" />
              <span className="forecast-card__temp-label">MÍN</span>
              <span className="skeleton__bar skeleton__bar--xs" />
            </div>
            <span className="skeleton__bar skeleton__bar--sm" />
          </article>
        ))}
      </div>

      <p className="skeleton__foot">
        <span className="skeleton__pulse" aria-hidden="true" />
        Conectando con servicio meteorológico…
      </p>
    </section>
  );
}
