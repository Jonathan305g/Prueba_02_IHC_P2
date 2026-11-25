# Backlog de mejoras

Prioridad = severidad (`0–4`) × impacto (`1` = afecta una tarea o un participante · `2` = dos · `3` = todas o ambos participantes).

> **Nota**: Priorización preliminar basada en la evaluación heurística (`HE01`–`HE05`) y el recorrido cognitivo (`RC01`–`RC03`). El puntaje final y la confirmación definitiva se validarán tras triangular con P01 y P02.

| Prioridad | ID | Problema | Hallazgo(s) | Severidad | Impacto | Puntaje | Corrección propuesta | ¿Entra en v2? | Responsable |
|---|---|---|---|---|---|---|---|---|---|
| 1 | B01 | Aviso `Deshacer` al final del DOM con 10 s de duración y foco lejano en `#carrito` | HA01 (HE01, RC02) | 3 | 2 (T3 / teclado) | 6 | Mostrar acción `Deshacer` también dentro de `#carrito` (o mover foco/atajo al aviso y ampliar margen temporal). | Sí | Jonathan Gamboa |
| 2 | B02 | `Cancelar pedido` pegado (`0.5rem`) a `Revisar y confirmar pedido` sin confirmación previa | HA05 (HE05, RC03) | 3 | 2 (T3 / móvil) | 6 | Separar visualmente `Cancelar pedido` y añadir diálogo de confirmación antes de vaciar todo el pedido. | Sí | Jonathan Gamboa |
| 3 | B03 | Búsqueda no reconoce variantes habituales como `expreso` para `Capuchino` | HA03 (HE03) | 3 | 1 (T1) | 3 | Añadir palabras clave/sinónimos en `productos.js` (`expreso`) o equivalencias en `normalizarTexto`. | Evaluar post-P01/P02 | Jonathan Gamboa |
| 4 | B04 | Barra móvil `Ver pedido` y aviso flotante cubren contenido inferior en `390×844` | HA02 (HE02) | 2 | 2 (T1–T3 móvil) | 4 | Aumentar `padding-bottom` móvil y posicionar avisos debajo de la cabecera en viewports pequeños. | Evaluar post-P01/P02 | Jonathan Gamboa |
| 5 | B05 | Selector de cantidad valida solo en `change` y no advierte durante `input` | HA04 (HE04, RC01) | 2 | 1 (T2) | 2 | Validar preventivamente en `input` cuando el valor sale de `1–20`. | No (baja prioridad) | Jonathan Gamboa |

## Criterio de selección para la v2

Se proponen inicialmente **B01** y **B02** por tener la severidad más alta (`3`) en flujos críticos de recuperación y prevención de errores (`T3`), y porque su mejora es directamente re-medible con las mismas tareas `T2` y `T3` tras implementar la v2. *(Se confirmará o ajustará junto a los hallazgos reales de P01 y P02).*
