import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForecastCard } from "./ForecastCard";
import type { DayForecast } from "../types";

const day: DayForecast = {
  date: "2026-09-16",
  maxTemp: 18,
  minTemp: -2,
  condition: { label: "Parcialmente nublado", icon: "partly-cloudy" },
  feelsLikeMax: 15,
  feelsLikeMin: -6,
  windMaxKmh: 17,
};

describe("ForecastCard", () => {
  it("muestra fecha, condición, máxima y mínima con los datos recibidos", () => {
    render(<ForecastCard day={day} isToday={false} />);

    expect(screen.getByText("Parcialmente nublado")).toBeInTheDocument();
    expect(screen.getByText("18°")).toBeInTheDocument();
    expect(screen.getByText("-2°")).toBeInTheDocument();
    expect(screen.getByText(/Sensación 15°\/-6°/)).toBeInTheDocument();
    expect(screen.getByText(/17 km\/h/)).toBeInTheDocument();
    // El texto exacto de formatDate ya está probado en formatDate.test.ts;
    // aquí solo importa que la tarjeta lo muestre, no recalcular el formato.
    expect(screen.getByText(/16 sep/)).toBeInTheDocument();
  });

  it('marca el día de hoy con el badge "HOY", y solo ese día', () => {
    const { rerender } = render(<ForecastCard day={day} isToday={true} />);
    expect(screen.getByText("HOY")).toBeInTheDocument();

    rerender(<ForecastCard day={day} isToday={false} />);
    expect(screen.queryByText("HOY")).not.toBeInTheDocument();
  });
});
