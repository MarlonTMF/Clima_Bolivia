import { describe, it, expect } from "vitest";
import { describeWeatherCode } from "./weatherCodes";

describe("describeWeatherCode", () => {
  it("traduce los códigos documentados", () => {
    expect(describeWeatherCode(0).label).toBe("Despejado");
    expect(describeWeatherCode(95).label).toBe("Tormenta");
  });

  it("agrupa los chubascos con la lluvia (D-07)", () => {
    // 80-82 no merecen categoría propia para el usuario final.
    expect(describeWeatherCode(80)).toEqual(describeWeatherCode(61));
  });

  it("devuelve un valor neutro ante un código desconocido", () => {
    // La API puede añadir códigos nuevos: la tarjeta no debe romperse.
    expect(describeWeatherCode(999)).toEqual({ label: "Sin datos", icon: "❔" });
  });
});
