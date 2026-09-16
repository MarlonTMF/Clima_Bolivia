import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchForecasts } from "./weatherApi";
import { CITIES } from "../data/cities";
import sample from "../../docs/api-sample.json";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function mockFetch(impl: (url: string, init: RequestInit) => unknown) {
  vi.stubGlobal("fetch", vi.fn(impl));
}

describe("fetchForecasts", () => {
  it("mapea la respuesta real a nuestro modelo", async () => {
    // Fixture: la respuesta guardada en el bloque 02, no un JSON inventado
    // — verifica contra datos verdaderos, no contra nuestras propias
    // suposiciones sobre cómo debería lucir la respuesta.
    mockFetch(() => new Response(JSON.stringify(sample), { status: 200 }));

    const result = await fetchForecasts();

    expect(result).toHaveLength(9);
    expect(result[0].days).toHaveLength(7);
    expect(result[0].city.id).toBe("sucre");
    // D-11: los campos ampliados deben llegar poblados, no undefined.
    expect(result[1].days[0].feelsLikeMax).toBeTypeOf("number");
    expect(result[1].days[0].windMaxKmh).toBeTypeOf("number");
    // Prueba de humo: Potosí (3962 m) y Santa Cruz (421 m) deben diferir.
    const potosi = result.find((f) => f.city.id === "potosi")!;
    const santaCruz = result.find((f) => f.city.id === "santa-cruz")!;
    expect(Math.abs(potosi.days[0].maxTemp - santaCruz.days[0].maxTemp)).toBeGreaterThan(3);
  });

  it("pide las coordenadas en el mismo orden que CITIES (D-05)", async () => {
    // La trampa del proyecto: la respuesta llega como array en el orden de
    // la petición, así que si la URL se construyera desde otra lista, cada
    // ciudad mostraría el clima de otra SIN que falle nada. Ninguna prueba
    // miraba la URL, así que un desajuste pasaba en verde. Esto lo fija.
    let pedida = "";
    mockFetch((url) => {
      pedida = String(url);
      return new Response(JSON.stringify(sample), { status: 200 });
    });

    await fetchForecasts();

    const params = new URL(pedida).searchParams;
    expect(params.get("latitude")).toBe(CITIES.map((c) => c.latitude).join(","));
    expect(params.get("longitude")).toBe(CITIES.map((c) => c.longitude).join(","));
  });

  it("falla con mensaje claro ante un HTTP 500 (caso 2)", async () => {
    // fetch NO lanza en 5xx. Sin comprobar response.ok esto se parsearía
    // como si fuera un JSON válido y fallaría de forma mucho más confusa.
    mockFetch(() => new Response("<html>error</html>", { status: 500 }));
    await expect(fetchForecasts()).rejects.toThrow(/500/);
  });

  it("falla cuando la red rechaza (caso 1)", async () => {
    mockFetch(() => Promise.reject(new TypeError("Failed to fetch")));
    await expect(fetchForecasts()).rejects.toThrow();
  });

  it("aborta si el servicio tarda más que el timeout (caso 3)", async () => {
    vi.useFakeTimers();

    // La trampa documentada en el runbook: un stub que nunca resuelve NO
    // aborta solo. TIENE que escuchar la señal y rechazar cuando se activa,
    // o la prueba se queda colgada esperando una promesa que nunca llega.
    mockFetch(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );

    const promise = fetchForecasts();
    const assertion = expect(promise).rejects.toThrow(/tardó demasiado/);
    await vi.advanceTimersByTimeAsync(10_000); // dispara el AbortController
    await assertion;
  });

  it("falla si una ciudad no trae datos diarios (caso 4)", async () => {
    // Con 9 entradas se pasa la validación de conteo y se llega de verdad
    // a la validación por-ciudad. Con menos de 9, el código falla antes
    // (ver la siguiente prueba) — son dos formas distintas de JSON
    // inesperado y ambas están cubiertas.
    const malformed = Array.from({ length: 9 }, () => ({ latitude: -16.5 }));
    mockFetch(() => new Response(JSON.stringify(malformed), { status: 200 }));
    await expect(fetchForecasts()).rejects.toThrow(/datos diarios/);
  });

  it("falla si llegan menos ciudades de las 9 esperadas", async () => {
    // Variante del caso 4: forma "casi correcta" pero de longitud distinta.
    const partial = (sample as unknown[]).slice(0, 3);
    mockFetch(() => new Response(JSON.stringify(partial), { status: 200 }));
    await expect(fetchForecasts()).rejects.toThrow(/9 ciudades/);
  });
});
