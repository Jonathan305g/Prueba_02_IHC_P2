# Métricas de las rondas aportadas

Fuente: [Excel recibido](datos/CafeU_Recoleccion_Pruebas_Completo.xlsx), conservado sin modificar. Datos editables y exportados en [observaciones.json](datos/observaciones.json), [resultados.csv](resultados.csv), [sus.csv](sus.csv) y [sesiones.csv](sesiones.csv). Regeneración: `npm run metricas`. No se utilizan las celdas calculadas del Excel como entrada.

**Estado:** las pruebas con usuarios ya se realizaron y sus resultados están registrados en el Excel, según confirmación de William Martínez. Se conservan los campos V1/V2 del libro y la comparación describe esas sesiones. Consulte [validacion-v2.md](validacion-v2.md).

## Definiciones

- Éxito autónomo = intentos autónomos / intentos incluidos.
- Finalización completa = (autónomos + completados con ayuda) / intentos incluidos. Una recuperación desde catálogo en T3 es parcial y no cuenta como completa.
- Tiempo medio = media de todos los intentos incluidos, también fallos y cierres por tiempo. Se informa además el tiempo de tareas completas en `metricas.json`.
- SEQ = media de respuestas numéricas 1–7; NR no equivale a cero.
- SUS = suma de aportes impares (respuesta − 1) y pares (5 − respuesta), multiplicada por 2,5. Se exige responder los diez ítems. Son puntos 0–100, no un porcentaje.
- P00 se presenta aparte. Una incidencia excluida permanece en la fuente pero no entra en las tasas.

## Por tarea

| Ronda | Tarea | n | Autónomos | Con ayuda | Parciales | No completó | Éxito autónomo | Finalización | Tiempo medio (s) | SEQ | Errores críticos / no críticos |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| V1 | T1 | 2 | 1 | 1 | 0 | 0 | 50 % | 100 % | 44 | 4,5 | 0 / 3 |
| V1 | T2 | 2 | 1 | 0 | 0 | 1 | 50 % | 50 % | 45,8 | 3,5 | 1 / 2 |
| V1 | T3 | 2 | 0 | 1 | 1 | 0 | 0 % | 50 % | 109,3 | 3 | 0 / 4 |
| V2 | T1 | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 25,5 | 6 | 0 / 0 |
| V2 | T2 | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 21 | 6,5 | 0 / 0 |
| V2 | T3 | 2 | 1 | 1 | 0 | 0 | 50 % | 100 % | 74,2 | 5,5 | 0 / 1 |

## Por ronda

| Ronda | Personas | Intentos | Éxito autónomo | Finalización completa | Tiempo medio (s) | SEQ medio | SUS medio (puntos) | Ayudas | Errores totales |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| V1 | 2 | 6 | 33,33 % | 66,67 % | 66,37 | 3,67 | 57,5 | 2 | 10 |
| V2 | 2 | 6 | 83,33 % | 100 % | 40,23 | 6 | 85 | 1 | 1 |

## Por participante

| Ronda | Participante | Intentos | Éxito autónomo | Tiempo medio (s) | SEQ medio | SUS (puntos) |
|---|---|---:|---:|---:|---:|---:|
| V1 | P01 | 3 | 33,33 % | 66,87 | 3,33 | 52,5 |
| V1 | P02 | 3 | 33,33 % | 65,87 | 4 | 62,5 |
| V2 | P01 | 3 | 100 % | 35,6 | 6,33 | 92,5 |
| V2 | P02 | 3 | 66,67 % | 44,87 | 5,67 | 77,5 |

## Piloto P00, excluido de los promedios de usuarios

3 intentos; tiempo medio 61,93 s; SEQ medio 4; SUS 57,5 puntos. Ajustes en [piloto.md](piloto.md).

## Interpretación y límites

En el archivo, el éxito autónomo pasa de 33,33 % a 83,33 % y SUS de 57,5 a 85 puntos. La diferencia de SUS es de 27,5 puntos. Las pruebas con usuarios figuran como realizadas. Estos cambios son descriptivos: se repiten las mismas dos personas, con posible aprendizaje, y el diseño de evaluación no permite aislar un efecto causal de las correcciones. La muestra es descriptiva y los intentos de una misma persona no son participantes independientes. Las sesiones declaradas fueron en portátil; la revisión móvil de esta entrega es técnica.

Se conservan las notas CU-104 a CU-108 tal como fueron aportadas. No coinciden con el formato completo del generador de la base (CU-tiempo-aleatorio); se mantienen como anotaciones originales del registro, sin completar caracteres ni atribuirles un formato distinto.
