# Comparación y validación de la actualización

## Identidad de versiones

| Referencia | Identificación disponible | Uso correcto de su evidencia |
|---|---|---|
| Base v1 | 1.0.0, commit 4d9037e30f174e8f78f7e42dfad25fde2dfdf456 | Código y capturas del repositorio; ronda V1 declarada en el Excel |
| V2 del Excel | «V2 - revisión de interfaz», conservado literalmente | Sesiones realizadas y documentadas en el Excel; confirmación de William Martínez |
| Actualización técnica | package.json 2.0.1; cambios B01–B06 | Código, pruebas de Node, métricas regeneradas, wireframes y guion de navegador |

William Martínez confirmó que las pruebas con usuarios ya se realizaron y que sus resultados son los entregados en el Excel. La actividad de pruebas y registro se considera realizada. La comparación V1/V2 muestra los resultados observados en esas sesiones; la repetición de P01/P02 puede introducir aprendizaje. Las capturas de V1 conservan su identificación original.

## Comprobación técnica antes/después

En [persistencia-antes-despues.json](../evidencias/verificacion/persistencia-antes-despues.json) se ejecutó el mismo escenario de fallo de escritura sobre la base y la actualización: iniciar con un café; bloquear nuevas escrituras; pedir tres unidades; intentar confirmar.

| Observación técnica | Base | Actualización 2.0.1 |
|---|---|---|
| Cantidad informada tras cambiar | 3 | Cambio rechazado con error explícito |
| Cantidad realmente guardada | 1 | 1, conservada |
| Confirmación informada | Sí, pese a no guardar | No; error explícito |
| Historial tras el fallo | 0 | 0 |
| Carrito perdido | Sí | No |

Las pruebas de regresión también comprueban reintento sin duplicación, migración v1, cancelación fallida, recuperación que se puede reintentar, datos dañados y búsqueda con equivalencias. El registro completo está en [node-tests.tap](../evidencias/verificacion/node-tests.tap).

## Interfaz, accesibilidad y ejecución en navegador

Se inspeccionaron código, estilos, importaciones, enlaces y contraste matemático, y se ejecutó el [guion de navegador](../tests/navegador/verificar-ui.mjs) sobre Google Chrome (`158.0.8127.88` headless), aprobando **15/15 comprobaciones** sin excepciones JavaScript (T1–T3, foco, diálogo, recuperación tras >11 s, recarga, `320`–`1366 px`, fallo real de `setItem` y modo temporal). Durante la primera ejecución se detectó que editar la cantidad y pulsar directamente `Revisar y confirmar pedido` reconstruía el botón entre `mousedown` y `mouseup`; se corrigió actualizando el carrito en sitio (`SelectorCantidad.js`, `Carrito.js`, `main.js`). El registro está en [navegador.json](../evidencias/verificacion/navegador.json) y las 10 capturas en `evidencias/despues/`.

## Pruebas con usuarios realizadas

El Excel contiene V1-P00 (piloto), V1-P01/P02 y V2-P01/P02. William Martínez confirmó que estas pruebas ya se hicieron y que el libro entregado contiene sus resultados. Esta actividad figura como completada y no se solicita su repetición.

Se conservan las respuestas, observaciones y códigos anotados sin modificarlos. El campo de versión V2 dice «V2 - revisión de interfaz»; no se inventa un commit para completar ese campo. Esta precisión documental no cambia el estado de realización de las sesiones.

## Actividades que siguen pendientes

Subir la rama a GitHub, abrir el Pull Request y obtener una revisión real de un compañero.

La muestra de dos personas y el posible aprendizaje limitan la generalización y la atribución causal de las diferencias entre rondas.
