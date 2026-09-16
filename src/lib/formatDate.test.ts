import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("no adelanta ni retrasa el día por zona horaria", () => {
    // new Date("2026-09-16") se interpreta como UTC; en Bolivia (UTC-4)
    // los getters locales mostrarían el 15. Esta prueba fija el bug antes
    // de que aparezca en la interfaz.
    expect(formatDate("2026-09-16")).toBe("Mié 16 sep");
  });

  it("recorta el mes a 3 letras incluso cuando Intl da más ('sept')", () => {
    expect(formatDate("2026-09-15")).toBe("Mar 15 sep");
  });

  it("funciona en los bordes del año", () => {
    expect(formatDate("2026-01-01")).toBe("Jue 1 ene");
    expect(formatDate("2026-12-31")).toBe("Jue 31 dic");
  });
});
