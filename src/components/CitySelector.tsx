import type { City } from "../types";
import { CountryMap } from "./CountryMap";

type Props = {
  cities: City[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/**
 * Tarjeta rica (avatar, badge "ACTIVO", capital + elevación) sobre la
 * referencia real de Stitch. El <select> nativo sigue siendo el control
 * interactivo real (D-03: sin librerías de UI, teclado y lector de
 * pantalla gratis) — se superpone invisible sobre la tarjeta completa, así
 * que un clic en cualquier punto de la tarjeta abre el picker nativo. Es
 * el mismo patrón que el mapa: la interacción vive en HTML accesible
 * estándar, el resto es decoración.
 */
/**
 * Iniciales explícitas, no un algoritmo genérico. "La" en "La Paz" es
 * parte del nombre (debe contar → "LP"); "de la" en "Santa Cruz de la
 * Sierra" son conectores (no deben contar → "SC"). Con solo 9 ciudades
 * fijas, una tabla es más simple y más correcta que una heurística que
 * intente adivinar la diferencia — mismo criterio que D-04 aplica a las
 * coordenadas.
 */
const INITIALS: Record<string, string> = {
  sucre: "S",
  "la-paz": "LP",
  cochabamba: "C",
  oruro: "O",
  potosi: "P",
  tarija: "T",
  "santa-cruz": "SC",
  trinidad: "T",
  cobija: "C",
};

export function CitySelector({ cities, selectedId, onSelect }: Props) {
  const selected = cities.find((c) => c.id === selectedId);
  const initials = selected ? INITIALS[selected.id] : "";

  return (
    <section className="city-picker" aria-label="Seleccionar capital y región">
      <div className="city-picker__head">
        <h2>Seleccionar capital &amp; región</h2>
        <span className="city-picker__count">9 capitales departamentales</span>
      </div>

      <div className="city-picker__body">
        <CountryMap cities={cities} selectedId={selectedId} onSelect={onSelect} />

        <div className="city-card">
          <span className="city-card__eyebrow">Departamento seleccionado</span>

          <div className="city-card__row">
            {selected && (
              <>
                <span className="city-card__avatar" aria-hidden="true">
                  {initials}
                </span>
                <div className="city-card__info">
                  <p className="city-card__name">
                    {selected.name}
                    <span className="city-card__active">Activo</span>
                  </p>
                  <p className="city-card__caption">
                    Capital: {selected.name} · {selected.elevationM} m s. n. m. · {selected.department}
                  </p>
                </div>
                <span className="city-card__elevation">
                  {selected.elevationM}m
                  <span aria-hidden="true"> ⌄</span>
                </span>
              </>
            )}

            {/* Control real: invisible, cubre toda la tarjeta. */}
            <select
              className="city-card__select"
              value={selectedId}
              onChange={(e) => onSelect(e.target.value)}
              aria-label="Seleccionar capital departamental"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.department}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
