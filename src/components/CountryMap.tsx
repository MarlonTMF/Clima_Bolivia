import type { City } from "../types";

type Props = {
  cities: City[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/**
 * Silueta ilustrativa, NO un contorno geográfico preciso — mismo criterio
 * que ya documentamos al descartar el HTML de Stitch (D-08): es una imagen
 * ilustrativa con zonas interactivas, no un mapa real. Lo único que SÍ es
 * exacto son las posiciones de los puntos: se calcularon proyectando la
 * latitud/longitud real de cada ciudad (src/data/cities.ts) sobre este
 * panel, no se dibujaron a ojo.
 */
const MARKERS: Record<string, { x: number; y: number }> = {
  sucre: { x: 84.9, y: 175.4 },
  "la-paz": { x: 42.7, y: 134.1 },
  cochabamba: { x: 71.9, y: 148.6 },
  oruro: { x: 57.3, y: 158.2 },
  potosi: { x: 77.8, y: 184.3 },
  tarija: { x: 92.7, y: 216.1 },
  "santa-cruz": { x: 115.4, y: 155 },
  trinidad: { x: 90.2, y: 106.9 },
  cobija: { x: 33.6, y: 44.9 },
};

export function CountryMap({ cities, selectedId, onSelect }: Props) {
  return (
    <div className="country-map">
      <svg
        className="country-map__svg"
        viewBox="0 0 220 260"
        role="img"
        aria-label="Mapa ilustrativo de Bolivia con las 9 capitales departamentales"
      >
        {/* Silueta suavizada, orientativa. No usar para nada que requiera precisión geográfica. */}
        <path
          className="country-map__silhouette"
          d="M 33 40 L 60 30 L 100 35 L 130 55 L 150 90 L 165 130 L 155 165 L 130 190 L 105 235 L 85 230 L 70 200 L 45 190 L 30 160 L 20 110 L 25 70 Z"
        />
        {cities.map((c) => {
          const pos = MARKERS[c.id];
          if (!pos) return null;
          const isActive = c.id === selectedId;
          return (
            <g key={c.id}>
              <circle
                className={`country-map__dot${isActive ? " country-map__dot--active" : ""}`}
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 6 : 3.5}
              />
              {isActive && (
                <text className="country-map__dot-label" x={pos.x} y={pos.y - 11}>
                  {c.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Botones reales superpuestos con coordenadas porcentuales: los
          puntos del SVG son decorativos, la interacción vive en HTML
          semántico normal (más simple de hacer accesible que hit-areas
          dentro del propio SVG). */}
      <div className="country-map__hotspots">
        {cities.map((c) => {
          const pos = MARKERS[c.id];
          if (!pos) return null;
          return (
            <button
              key={c.id}
              type="button"
              className="country-map__hotspot"
              style={{ left: `${(pos.x / 220) * 100}%`, top: `${(pos.y / 260) * 100}%` }}
              onClick={() => onSelect(c.id)}
              aria-label={`Ver pronóstico de ${c.name}`}
              aria-pressed={c.id === selectedId}
            />
          );
        })}
      </div>
    </div>
  );
}
