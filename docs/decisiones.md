# Decisiones técnicas

## D-01 · API de clima: Open-Meteo

**Contexto.** Necesito pronóstico diario a 7 días con temperatura máxima,
mínima y condición climática para 9 coordenadas fijas. Las llamadas salen de
una función serverless propia (ver D-09), no del navegador, con caché de 30
minutos — unos 48 refrescos al día como máximo.

**Alternativas consideradas.** OpenWeather (One Call 3.0), WeatherAPI.com y
Meteosource, comparadas contra documentación oficial.

**Decisión.** Open-Meteo.

**Razón.** Con el backend en medio, la exposición de la clave y el CORS dejan de
discriminar, así que la decisión se apoya en tres hechos medibles:

1. **Cobertura del requisito.** WeatherAPI ofrece solo 3 días de pronóstico
   diario en su plan gratuito; el desafío pide 7. Queda descartada por no
   cumplir el requisito, no por preferencia.
2. **Holgura de cuota.** Open-Meteo resuelve las 9 ciudades en una sola
   petición: 48 llamadas diarias sobre un límite de 10 000. OpenWeather exige
   una petición por ciudad — 432 diarias sobre 1 000, el 43 % de la cuota.
   Meteosource, con el mismo patrón, necesitaría 432 sobre un límite de 400:
   **lo excede**.
3. **Superficie operativa.** Sin clave, sin cuenta que mantener y sin secreto
   que rotar. Una petición dentro del proxy en lugar de nueve significa menos
   puntos de fallo parcial que manejar.

**Consecuencia.** La API devuelve códigos WMO numéricos en lugar de
descripciones, así que la traducción al español la mantengo yo (ver D-07). Y
una limitación real: **el uso gratuito es no comercial, bajo licencia CC-BY
4.0**. Para un uso comercial haría falta su plan de pago, o reevaluar
OpenWeather con proxy — que ya tengo montado.

**Umbrales que cambiarían la decisión.** Superar las 10 000 llamadas diarias, o
que el proyecto pase a uso comercial.

**Verificado el.** 15-09-2026, contra open-meteo.com/en/docs,
open-meteo.com/en/terms, openweathermap.org/api/one-call-3,
weatherapi.com/pricing.aspx y meteosource.com/pricing.

**Pendiente de confirmar.** Si «One Call by Call» exige registrar un método de
pago para acceder a su cuota gratuita. La documentación consultada respalda las
1 000 llamadas diarias gratuitas, pero no cita textualmente el requisito de
tarjeta. Se redacta como modelo de pago por uso, que es lo documentado.

**Petición de referencia.** La respuesta guardada en `docs/api-sample.json`
procede de esta llamada, ejecutada el 15-09-2026:

```
https://api.open-meteo.com/v1/forecast?latitude=-19.0333,-16.5,-17.3895,-17.9833,-19.5836,-21.5355,-17.7833,-14.8333,-11.0267&longitude=-65.2627,-68.15,-66.1568,-67.15,-65.7531,-64.7296,-63.1821,-64.9,-68.7692&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/La_Paz&forecast_days=7
```

El orden de las coordenadas **es el mismo que el de `src/data/cities.ts`** y no
debe cambiarse: la respuesta llega como array en el orden de la petición, así
que un desajuste asignaría a cada ciudad el pronóstico de otra sin fallar.

---
