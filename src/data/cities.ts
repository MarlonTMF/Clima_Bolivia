import type { City } from "../types";

/**
 * Las 9 capitales departamentales de Bolivia. Coordenadas fijas, sin
 * geocoding (D-04): son ciudades conocidas y estables.
 *
 * EL ORDEN DE ESTE ARRAY ES SIGNIFICATIVO (D-05). La respuesta de la API
 * llega como array en el orden de la petición, y Open-Meteo ajusta las
 * coordenadas a su malla de modelo — no se pueden emparejar comparando
 * coordenadas de vuelta. Si este orden cambia, weatherApi.ts debe construir
 * la URL con el mismo orden, o cada ciudad mostrará el clima de otra sin
 * ningún error visible.
 *
 * Coordenadas y elevación verificadas el 15-09-2026 contra
 * docs/api-sample.json (elevación = campo "elevation" de la respuesta real,
 * no una cifra buscada aparte).
 */
export const CITIES: City[] = [
  { id: "sucre", name: "Sucre", department: "Chuquisaca", latitude: -19.0333, longitude: -65.2627, elevationM: 2783 },
  { id: "la-paz", name: "La Paz", department: "La Paz", latitude: -16.5, longitude: -68.15, elevationM: 3767 },
  { id: "cochabamba", name: "Cochabamba", department: "Cochabamba", latitude: -17.3895, longitude: -66.1568, elevationM: 2564 },
  { id: "oruro", name: "Oruro", department: "Oruro", latitude: -17.9833, longitude: -67.15, elevationM: 3925 },
  { id: "potosi", name: "Potosí", department: "Potosí", latitude: -19.5836, longitude: -65.7531, elevationM: 3962 },
  { id: "tarija", name: "Tarija", department: "Tarija", latitude: -21.5355, longitude: -64.7296, elevationM: 1869 },
  { id: "santa-cruz", name: "Santa Cruz de la Sierra", department: "Santa Cruz", latitude: -17.7833, longitude: -63.1821, elevationM: 421 },
  { id: "trinidad", name: "Trinidad", department: "Beni", latitude: -14.8333, longitude: -64.9, elevationM: 156 },
  { id: "cobija", name: "Cobija", department: "Pando", latitude: -11.0267, longitude: -68.7692, elevationM: 200 },
];
