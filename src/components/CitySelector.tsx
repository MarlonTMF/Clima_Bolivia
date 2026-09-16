import type { City } from "../types";

type Props = {
  cities: City[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/**
 * Desplegable, no lista ni grilla (corrección de nombre respecto al plan
 * original: "CityList.tsx" se convirtió en esto tras adoptar la referencia
 * del selector móvil de Stitch — ver docs/design/tokens.md). Nueve nombres
 * de longitud muy dispar ("Oruro" vs "Santa Cruz de la Sierra") caben sin
 * romperse en un <select>, cosa que una grilla de tarjetas no garantiza.
 */
export function CitySelector({ cities, selectedId, onSelect }: Props) {
  const selected = cities.find((c) => c.id === selectedId);

  return (
    <label className="city-selector">
      <span className="city-selector__label">Ciudad</span>
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
      {selected && <span className="city-selector__elevation">{selected.elevationM} m s. n. m.</span>}
    </label>
  );
}
