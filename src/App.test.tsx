import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { CITIES } from "./data/cities";
import type { CityForecast } from "./types";

vi.mock("./lib/weatherApi", () => ({
  fetchForecasts: vi.fn(),
}));
import { fetchForecasts } from "./lib/weatherApi";

function forecastFor(cityId: string, maxTemp: number): CityForecast {
  const city = CITIES.find((c) => c.id === cityId)!;
  return {
    city,
    days: Array.from({ length: 7 }, (_, i) => ({
      date: `2026-09-${16 + i}`,
      maxTemp,
      minTemp: maxTemp - 10,
      condition: { label: "Despejado", icon: "clear" as const },
      feelsLikeMax: maxTemp - 2,
      feelsLikeMin: maxTemp - 12,
      windMaxKmh: 10,
    })),
  };
}

const ALL_FORECASTS = CITIES.map((c, i) => forecastFor(c.id, 10 + i));

afterEach(() => {
  vi.mocked(fetchForecasts).mockReset();
});

describe("App", () => {
  it("cambiar de ciudad en el selector muestra el pronóstico de la nueva ciudad", async () => {
    vi.mocked(fetchForecasts).mockResolvedValue(ALL_FORECASTS);
    const user = userEvent.setup();

    render(<App />);

    // CITIES[0] = Sucre, la ciudad por defecto (D-04).
    expect(await screen.findByRole("heading", { name: "Sucre" })).toBeInTheDocument();

    const select = screen.getByRole("combobox", { name: /seleccionar capital departamental/i });
    await user.selectOptions(select, "la-paz");

    expect(await screen.findByRole("heading", { name: "La Paz" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Sucre" })).not.toBeInTheDocument();
  });

  it("si la carga falla, muestra el error y Reintentar recupera los datos", async () => {
    vi.mocked(fetchForecasts).mockRejectedValueOnce(new Error("red caída"));
    const user = userEvent.setup();

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/no pudimos obtener el pronóstico/i);
    // El texto técnico del catch (weatherApi.test.ts lo verifica aparte)
    // no debe filtrarse a la pantalla — ver bloque 11.
    expect(screen.queryByText(/red caída/i)).not.toBeInTheDocument();

    vi.mocked(fetchForecasts).mockResolvedValue(ALL_FORECASTS);
    await user.click(screen.getByRole("button", { name: /reintentar/i }));

    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    expect(await screen.findByRole("heading", { name: "Sucre" })).toBeInTheDocument();
  });
});
