type Props = {
  onRetry: () => void;
};

/**
 * Un mensaje único y accionable, nunca el texto técnico crudo de
 * weatherApi.ts (ese es el contrato que verifican las pruebas del bloque
 * 08 — /500/, /datos diarios/, etc. — no lo que debe ver un visitante).
 * "role=alert" para que un lector de pantalla lo anuncie sin que el
 * usuario tenga que ir a buscarlo.
 */
export function ErrorState({ onRetry }: Props) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__message">
        No pudimos obtener el pronóstico. Revisa tu conexión e inténtalo de nuevo.
      </p>
      <button type="button" className="error-state__retry" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  );
}
