import type { City } from "../types";

type Props = {
  cities: City[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/**
 * Sigue siendo un <select> nativo (D-03: sin librerías de UI, y garantiza
 * teclado/lector de pantalla sin trabajo extra). Se estiliza como tarjeta
 * bordeada con chevron propio para acercarse a la referencia de Stitch —
 * su versión real es una fila con avatar, badge "Activo" y chevron, que un
 * <select> nativo no puede reproducir con marcado interno enriquecido sin
 * abandonar la semántica accesible.
 */
export function CitySelector({ cities, selectedId, onSelect }: Props) {
  const selected = cities.find((c) => c.id === selectedId);

  return (
    <div className="city-selector">
      <span className="city-selector__label">Seleccionar capital</span>
      <div className="city-selector__control">
        <select
          className="city-selector__select"
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.department}
            </option>
          ))}
        </select>
        {selected && (
          <span className="city-selector__elevation">{selected.elevationM} m</span>
        )}
      </div>
    </div>
  );
}
