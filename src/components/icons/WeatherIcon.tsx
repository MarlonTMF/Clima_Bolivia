import type { WeatherIconKey } from "../../types";

type Props = {
  code: WeatherIconKey;
  size?: number;
};

/**
 * SVG propio, no emoji ni librería externa (D-03). Trazo simple y
 * consistente (viewBox 24×24, stroke 1.6, currentColor) — mismo lenguaje
 * visual que PinIcon y WindIcon, para que toda la interfaz use un solo
 * estilo de icono en vez de mezclar emoji del sistema operativo.
 */
export function WeatherIcon({ code, size = 24 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (code) {
    case "clear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8" />
        </svg>
      );
    case "partly-cloudy":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="8.5" r="3.5" />
          <path d="M8.5 2.8v1.6M3.6 5.9l1.3 1.1M2 10.8h1.6" />
          <path d="M9.5 20h7a3.8 3.8 0 0 0 .6-7.55A5.2 5.2 0 0 0 7.3 13.2 3.6 3.6 0 0 0 9.5 20Z" />
        </svg>
      );
    case "cloudy":
      return (
        <svg {...common}>
          <path d="M7 19h10.5a4 4 0 0 0 .6-7.95A5.6 5.6 0 0 0 7.6 12.3 3.8 3.8 0 0 0 7 19Z" />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path d="M6 10h8a4 4 0 0 0 .4-7.98A5.2 5.2 0 0 0 5 6.8" opacity="0.55" />
          <path d="M4 13h16M4 17h16M4 21h10" />
        </svg>
      );
    case "drizzle":
      return (
        <svg {...common}>
          <path d="M7 13h10.5a3.8 3.8 0 0 0 .6-7.55A5.2 5.2 0 0 0 7.6 6.2 3.6 3.6 0 0 0 7 13Z" />
          <path d="M9 17v2.2M13 17v2.2M17 17v2.2" strokeWidth="1.8" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path d="M7 12h10.5a3.8 3.8 0 0 0 .6-7.55A5.2 5.2 0 0 0 7.6 5.2 3.6 3.6 0 0 0 7 12Z" />
          <path d="M8.5 16.5 7 20M13 16.5 11.5 20M17.5 16.5 16 20" strokeWidth="1.8" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d="M7 11h10.5a3.8 3.8 0 0 0 .6-7.55A5.2 5.2 0 0 0 7.6 4.2 3.6 3.6 0 0 0 7 11Z" />
          <path d="M9 15.5v6M6.3 17.1l5.4 3.1M15.9 17.1 10.5 20.2" strokeWidth="1.5" />
          <path d="M15 15.5v6M12.3 17.1l5.4 3.1M20.1 17.6l-5.4-3.1" strokeWidth="1.5" transform="translate(0 -1)" />
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path d="M6 11.5h10.5a3.8 3.8 0 0 0 .5-7.55A5.2 5.2 0 0 0 6.6 4.7 3.6 3.6 0 0 0 6 11.5Z" />
          <path d="m13 13-3 5h3l-2 4.5" strokeWidth="1.8" />
        </svg>
      );
    case "unknown":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.6 9.4a2.4 2.4 0 1 1 3.4 2.2c-.9.5-1.4 1-1.4 2.1" strokeWidth="1.8" />
          <circle cx="12" cy="17" r="0.15" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export function PinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21.5S5 15.2 5 9.9a7 7 0 1 1 14 0c0 5.3-7 11.6-7 11.6Z" />
      <circle cx="12" cy="9.8" r="2.3" />
    </svg>
  );
}

export function WindIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h11.5a2.8 2.8 0 1 0-2.6-3.9" />
      <path d="M3 13h15.5a2.8 2.8 0 1 1-2.6 3.9" />
      <path d="M3 18h8.5a2.3 2.3 0 1 1-2.1 3.2" />
    </svg>
  );
}

/** Nube tachada: sin conexión con el servicio. Estados de error y "sin datos". */
export function CloudOffIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.2 6.1A5.2 5.2 0 0 1 17.5 9h.3a3.7 3.7 0 0 1 2.6 6.3" />
      <path d="M15.5 18H6.8A3.8 3.8 0 0 1 6 10.5" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

/** Reloj con flecha hacia atrás: lectura guardada de antes. */
export function HistoryIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.2 10.5a9 9 0 1 1 .8 5" />
      <path d="M3 20v-5h5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

/** Flecha circular: reintentar. */
export function RefreshIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M20.8 4.2V9h-4.8" />
    </svg>
  );
}
