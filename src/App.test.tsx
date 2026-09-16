import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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

// App guarda cada carga correcta en localStorage. Sin limpiarlo, una prueba
// anterior deja copia y la siguiente entra en "datos antiguos" en vez de en
// "error" — lo encontró esta misma suite al fallar. Se limpia ANTES de cada
// prueba, no después: así no depende del orden en que corren los afterEach
// (el de Testing Library desmonta, y el desmontaje puede escribir).
beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.mocked(fetchForecasts).mockReset();
  localStorage.clear();
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

    expect(await screen.findByRole("alert")).toHaveTextContent(/no se pudo actualizar el pronóstico/i);
    // El texto técnico del catch (weatherApi.test.ts lo verifica aparte)
    // no debe filtrarse a la pantalla — ver bloque 11.
    expect(screen.queryByText(/red caída/i)).not.toBeInTheDocument();

    vi.mocked(fetchForecasts).mockResolvedValue(ALL_FORECASTS);
    await user.click(screen.getByRole("button", { name: /reintentar pronóstico/i }));

    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    expect(await screen.findByRole("heading", { name: "Sucre" })).toBeInTheDocument();
  });

  it("si falla tras una carga correcta, muestra los datos guardados con aviso", async () => {
    // Primera carga correcta: deja copia en localStorage.
    vi.mocked(fetchForecasts).mockResolvedValueOnce(ALL_FORECASTS);
    const { unmount } = render(<App />);
    expect(await screen.findByRole("heading", { name: "Sucre" })).toBeInTheDocument();
    unmount();

    // Segunda visita con la API caída: hay copia, así que NO es el estado
    // de error — se muestran los datos viejos avisando de que lo son.
    vi.mocked(fetchForecasts).mockRejectedValue(new Error("red caída"));
    render(<App />);

    const aviso = await screen.findByRole("status");
    expect(aviso).toHaveTextContent(/copia guardada en caché/i);
    expect(aviso).toHaveTextContent(/mostrando datos de hace/i);
    // Los datos siguen visibles, que es el motivo de este estado. El título
    // del panel lleva además el distintivo de lectura guardada.
    expect(
      await screen.findByRole("heading", { name: /Sucre.*última lectura guardada/i })
    ).toBeInTheDocument();
    // Y no se muestra la pantalla de error.
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("si falla sin copia guardada, muestra el estado de error", async () => {
    vi.mocked(fetchForecasts).mockRejectedValue(new Error("red caída"));

    render(<App />);

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
