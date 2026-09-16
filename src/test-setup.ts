import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Testing Library desmonta sola sólo cuando encuentra un `afterEach` global,
 * y este proyecto no usa `globals: true` en vitest.config. Sin esto, cada
 * render se quedaba en el documento y las pruebas siguientes veían el DOM de
 * las anteriores.
 *
 * No era teórico: al añadir las pruebas de "datos antiguos", el aviso de una
 * prueba seguía presente en la siguiente y la hacía fallar. Las pruebas que
 * ya existían pasaban por casualidad — buscaban elementos que no aparecían
 * en los árboles acumulados.
 */
afterEach(() => {
  cleanup();
});
