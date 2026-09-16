import { COUNTRY_OUTLINE_D, DEPT_PATHS, DEPT_CENTROIDS } from "../data/bolivia-map";
import type { City } from "../types";

type Props = {
  cities: City[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/**
 * Contorno real de los 9 departamentos de Bolivia, no una silueta dibujada
 * a mano. Derivado de "Bolivia, administrative divisions - es - colored.svg"
 * (Wikimedia Commons, © TUBS, CC BY-SA 4.0 — atribución completa en
 * docs/decisiones.md). Las 9 formas se separaron por color de relleno y se
 * emparejaron con los nombres reales de departamento comparando la
 * posición de cada forma contra las etiquetas de texto del propio archivo
 * (no se adivinó ninguna asignación a ojo). Coordenadas redondeadas a 1
 * decimal para aligerar el archivo (87 KB → 67 KB), verificado que el
 * render no cambia.
 */
export function CountryMap({ cities, selectedId, onSelect }: Props) {
  return (
    <div className="country-map">
      <svg
        className="country-map__svg"
        viewBox="0 0 1342.633 1488.904"
        role="group"
        aria-label="Mapa de Bolivia con las 9 capitales departamentales"
      >
        <path className="country-map__outline" d={COUNTRY_OUTLINE_D} />
        {cities.map((c) => {
          const d = DEPT_PATHS[c.id];
          if (!d) return null;
          const isActive = c.id === selectedId;
          return (
            <path
              key={c.id}
              className={`country-map__dept${isActive ? " country-map__dept--active" : ""}`}
              d={d}
              role="button"
              tabIndex={0}
              aria-label={`Ver pronóstico de ${c.name}`}
              aria-pressed={isActive}
              onClick={() => onSelect(c.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(c.id);
                }
              }}
            />
          );
        })}
        {(() => {
          const pos = DEPT_CENTROIDS[selectedId];
          const city = cities.find((c) => c.id === selectedId);
          if (!pos || !city) return null;
          return (
            <text className="country-map__label" x={pos.x} y={pos.y} textAnchor="middle">
              {city.name}
            </text>
          );
        })()}
      </svg>
    </div>
  );
}
