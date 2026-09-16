/**
 * Auditoría de fallos silenciosos.
 *
 * Por qué existe: casi todos los errores reales de este proyecto fueron del
 * mismo tipo — código válido que no produce ningún error y simplemente no
 * hace nada. Una regla CSS que apunta a una clase inexistente, un `outline`
 * sobre un elemento con `opacity: 0`, un `flex-direction` sobre un grid.
 * `tsc` y `oxlint` no los ven porque comprueban sintaxis y tipos, no efecto.
 *
 * Esto comprueba lo que ninguna de las dos herramientas comprueba. No
 * sustituye a mirar la pantalla: reduce la parte que sí es automatizable.
 *
 * Uso: npm run audit
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, no url.pathname: la ruta del proyecto lleva tilde y en una
// URL viaja como %C3%ADa. Es el mismo tipo de fallo silencioso que audita
// este script — funcionaba en cualquier carpeta sin acentos.
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

function archivos(dir, ext, acc = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) archivos(p, ext, acc);
    else if (ext.includes(extname(p))) acc.push(p);
  }
  return acc;
}

const cssBruto = readFileSync(join(RAIZ, "src/index.css"), "utf8");
// Los comentarios se descartan: contienen nombres de archivo como
// "docs/pruebas.md" que el extractor leería como clases .md, .png, .tsx.
const css = cssBruto.replace(/\/\*[\s\S]*?\*\//g, "");
const fuentes = archivos(join(RAIZ, "src"), [".tsx", ".ts"])
  .filter((f) => !f.includes(".test."))
  .map((f) => ({ ruta: f, texto: readFileSync(f, "utf8") }));
const codigo = fuentes.map((f) => f.texto).join("\n");

/* Clases declaradas en el CSS, ignorando pseudo-clases y pseudo-elementos. */
const declaradas = new Set();
for (const m of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) declaradas.add(m[1]);

/* Clases citadas en el código, incluidas las de plantillas condicionales
   como `forecast-card${isToday ? " forecast-card--today" : ""}`: se parte
   por las interpolaciones y se conservan sólo los trozos literales. */
const usadas = new Set();
const anotar = (txt) => {
  for (const c of txt.split(/\s+/)) {
    if (/^-?[_a-zA-Z][\w-]*$/.test(c)) usadas.add(c);
  }
};
for (const m of codigo.matchAll(/className\s*=\s*(?:"([^"]*)"|\{([\s\S]*?)\}\s*(?:>|\s[a-zA-Z-]+=))/g)) {
  if (m[1] !== undefined) {
    anotar(m[1]);
    continue;
  }
  const expr = m[2] ?? "";
  // Cada literal de cadena o plantilla dentro de la expresión.
  for (const t of expr.matchAll(/["'`]([^"'`]*)["'`]/g)) anotar(t[1]);
  // Y los trozos literales de las plantillas, partidos por ${...}.
  for (const tpl of expr.matchAll(/`([\s\S]*?)`/g)) {
    for (const trozo of tpl[1].split(/\$\{[\s\S]*?\}/)) anotar(trozo);
  }
}

const problemas = [];

/* 1. Reglas muertas: CSS que apunta a una clase que nadie usa.
      Fue el hallazgo [03] de la revisión: .city-selector__elevation existía
      en el CSS pero el componente usaba .city-card__elevation, así que la
      regla móvil no se aplicaba nunca. */
// Para las reglas muertas no se usa el extractor de className: basta con
// que el nombre aparezca en alguna parte del código. Es más tosco, pero no
// da falsos positivos con ternarios dentro de plantillas — y un falso
// positivo aquí lleva a borrar CSS que sí se usaba.
const muertas = [...declaradas]
  .filter((c) => !usadas.has(c) && !codigo.includes(c))
  .sort();
if (muertas.length) {
  problemas.push({
    titulo: "Clases definidas en el CSS que ningún componente usa",
    detalle: "La regla existe, es válida y no hace nada. Renombra o elimina.",
    items: muertas,
  });
}

/* 2. Estilos que nunca se aplican: el componente usa una clase sin CSS. */
const huerfanas = [...usadas].filter((c) => !declaradas.has(c)).sort();
if (huerfanas.length) {
  problemas.push({
    titulo: "Clases usadas en componentes sin ninguna regla CSS",
    detalle: "El elemento se renderiza sin los estilos que el nombre promete.",
    items: huerfanas,
  });
}

/* 3. flex-* dentro de un bloque que es grid (y al revés). Este error se
      cometió DOS veces en el mismo día: `flex-direction: row` sobre una
      tarjeta que a ese ancho es `display: grid`. La propiedad se ignora sin
      avisar. */
const cruces = [];
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const sel = m[1].trim().split("\n").pop().trim();
  const cuerpo = m[2];
  const display = /display\s*:\s*(grid|flex)/.exec(cuerpo)?.[1];
  const usaFlexOnly = /(flex-direction|flex-wrap|justify-content\s*:\s*space-)/.test(cuerpo);
  const usaGridOnly = /(grid-template|grid-column|grid-row)/.test(cuerpo);
  if (display === "grid" && usaFlexOnly) cruces.push(`${sel} → display:grid con propiedades de flex`);
  if (display === "flex" && usaGridOnly) cruces.push(`${sel} → display:flex con propiedades de grid`);
}
if (cruces.length) {
  problemas.push({
    titulo: "Propiedades de flex y grid mezcladas en la misma regla",
    detalle: "La que no corresponde al display se ignora en silencio.",
    items: cruces,
  });
}

/* 4. Contorno de foco sobre algo invisible. Fue el hallazgo [02]: el
      outline estaba sobre un select con opacity:0, y opacity se aplica al
      elemento entero incluido su contorno, así que el foco no se veía
      aunque el CSS fuera correcto.

      Se resuelve con dos listas y una intersección, en vez de construir una
      expresión regular a partir del selector: hacerlo al vuelo obliga a
      escapar el texto y es justo donde falló el primer intento. */
const invisibles = new Set();
const conFoco = new Map();
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const cuerpo = m[2];
  const opacidadCero = /opacity\s*:\s*0(\.0+)?\s*(;|$)/m.test(cuerpo);
  for (const sel of m[1].split(",")) {
    const limpio = sel.trim().split(/\r?\n/).pop().trim();
    if (!limpio) continue;
    if (opacidadCero) invisibles.add(limpio);
    if (limpio.includes(":focus-visible") && /outline|box-shadow|border/.test(cuerpo)) {
      conFoco.set(limpio, limpio.replace(/:focus-visible\b/, "").trim());
    }
  }
}
const focoInvisible = [];
for (const [sel, base] of conFoco) {
  // Sólo cuenta si el contorno se pinta sobre el MISMO elemento invisible.
  // Si el selector lo lleva a un ancestro visible (con :has, o un padre),
  // no hay problema — que es precisamente cómo se corrigió.
  if (invisibles.has(base)) {
    focoInvisible.push(sel + " → el elemento base (" + base + ") tiene opacity:0");
  }
}
if (focoInvisible.length) {
  problemas.push({
    titulo: "Contorno de foco sobre un elemento invisible",
    detalle: "opacity:0 se aplica también al outline: el foco no se ve.",
    items: focoInvisible,
  });
}

/* 5. La limpieza de Testing Library. Sin globals:true no se registra sola,
      y las pruebas se contaminan entre sí pasando por casualidad. */
const setup = readFileSync(join(RAIZ, "src/test-setup.ts"), "utf8");
const viteCfg = readFileSync(join(RAIZ, "vite.config.ts"), "utf8");
if (!/globals\s*:\s*true/.test(viteCfg) && !/cleanup\s*\(\s*\)/.test(setup)) {
  problemas.push({
    titulo: "Testing Library no desmonta entre pruebas",
    detalle: "Sin globals:true hace falta cleanup() explícito en test-setup.",
    items: ["src/test-setup.ts"],
  });
}

/* 6. Textos de interfaz que prometen una frecuencia que el código no cumple. */
const promesas = [];
for (const f of fuentes) {
  for (const m of f.texto.matchAll(/>([^<>{}]*\b(?:cada \d+\s*(?:minutos?|horas?)|actualización automática)[^<>{}]*)</gi)) {
    promesas.push(`${f.ruta.split(/[\\/]/).pop()} → "${m[1].trim()}"`);
  }
}
if (promesas.length && !/setInterval|setTimeout/.test(codigo)) {
  problemas.push({
    titulo: "La interfaz promete una frecuencia de actualización que no existe",
    detalle: "No hay setInterval en el código: el texto sería falso.",
    items: promesas,
  });
}

/* ---------- informe ---------- */
if (!problemas.length) {
  console.log("Auditoría de fallos silenciosos: sin hallazgos.");
  process.exit(0);
}
console.log("Auditoría de fallos silenciosos\n");
for (const p of problemas) {
  console.log(`  ${p.titulo}`);
  console.log(`  ${p.detalle}`);
  for (const i of p.items) console.log(`    · ${i}`);
  console.log("");
}
console.log(`${problemas.length} categoría(s) con hallazgos.`);
process.exit(1);
