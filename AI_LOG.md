# Registro de uso de IA

Bitácora de cada intervención relevante de herramientas de IA durante el
desafío. Se escribe **mientras ocurre**, no al final: la sección AI Usage del
README sale de aquí, y un ejemplo concreto de algo que hubo que corregir no se
puede reconstruir de memoria tres días después.

**Qué se registra:** una afirmación que no se sostuvo al verificarla, una
decisión tomada en contra de lo que sugirió la herramienta, una búsqueda propia
que cambió el rumbo, una sugerencia descartada con su razón, o un dato
confirmado contra la fuente oficial —aunque saliera correcto.

**Qué no se registra:** cada prompt escrito, erratas triviales, o cosas
aceptadas sin pensar. Un registro de cuarenta entradas irrelevantes esconde las
cinco que importan.

---

## Plantilla

```
## E-NN · [título: qué se discutió, en una frase]
- **Fecha / bloque:**
- **Tipo:** corrección · descarte · verificación · divergencia · criterio propio
- **Herramienta:**
- **Qué propuso la IA:**
- **Qué encontré o decidí yo:**
- **Cómo se resolvió:**
- **Por qué:**            ← el campo que importa. El razonamiento, no el hecho.
- **Fuente:**
- **Quién tenía razón:**  yo · la IA · ambos en parte · pendiente
- **¿Va al README?**      sí/no — y a qué punto de AI Usage responde
```

---

## Paradas planificadas

Cinco momentos donde ya se sabe que habrá algo que anotar. No son las únicas:
si aparece algo antes, se registra igual.

| Entrada | Bloque | Qué se espera registrar |
|---------|--------|-------------------------|
| E-01 | 02 · Investigación de API | Qué afirmó la IA sobre los límites del plan gratuito de OpenWeather antes de verificar, y qué decía la página oficial. |
| E-02 | 05 · Diseño con Stitch | Qué se adoptó de la referencia visual y qué se descartó (el código con Tailwind), con la razón. |
| E-03 | 07 · Capa de API | Si la primera versión generada del `fetch` omitía alguno de los cinco casos de error, y cuál. |
| E-04 | 08 · Pruebas | Qué pruebas generadas se aceptaron, cuáles hubo que reescribir, y si alguna «pasaba» sin verificar nada real. |
| E-05 | 13 · Revisión delegada | Qué encontró el subagente revisor, qué se aplicó y —sobre todo— qué se descartó y por qué. |

---

## Entradas

## E-00 · Arranque del proyecto
- **Fecha / bloque:** 15-09-2026 · Bloque 01
- **Tipo:** criterio propio
- **Herramienta:** —
- **Qué propuso la IA:** —
- **Qué encontré o decidí yo:** Empezar por investigar y decidir la API y el
  stack antes de escribir código, en lugar de arrancar por el andamiaje. Los
  cuatro primeros commits del proyecto son de documentación.
- **Cómo se resolvió:** El plan de trabajo reserva los bloques 02 y 03
  —95 minutos— a comparar alternativas y escribir las decisiones con su razón,
  antes de crear el primer archivo de código.
- **Por qué:** El enunciado pregunta explícitamente «por qué elegiste esa API».
  Una justificación construida después de la decisión no menciona las
  alternativas descartadas, y esa ausencia se nota al leerla. Escribir las
  decisiones cuando están frescas cuesta la mitad y sale más preciso.
- **Fuente:** —
- **Quién tenía razón:** —
- **¿Va al README?** Sí — «qué parte requirió más razonamiento de tu parte».
