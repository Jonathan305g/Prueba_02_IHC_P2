# Evaluación heurística y revisión de las correcciones

La matriz original de Emilio Abril, sus cinco hallazgos y severidades se conserva en [antecedentes/heuristicas-v1.md](antecedentes/heuristicas-v1.md), con las capturas originales H01–H05. Esta actualización añade inspección del código y comprobación automatizada en Google Chrome (`15/15` en `verificar-ui.mjs` con capturas en `evidencias/despues/`); no sustituye una segunda evaluación humana independiente.

| Nielsen | Resultado de la inspección de código 2.0.1 | Evidencia y límite |
|---|---|---|
| H1 Visibilidad | Totales, insignia, aviso de error de guardado y modo temporal | `main.js`, `Avisos.js`, pruebas de persistencia y Chrome (`H06-almacenamiento.png`, `modo-memoria.png`); audio de lector no probado |
| H2 Mundo real | Productos y precios conservados; expreso/expresso/espresso equivalentes | `normalizarBusqueda`, prueba de búsqueda y Chrome (`H03-busqueda.png`) |
| H3 Control y libertad | Deshacer próximo y persistente; Conservar en el diálogo | `main.js`, `index.html`; foco, >11 s y `Enter` comprobados en Chrome (`H01-deshacer.png`) |
| H4 Consistencia | Componentes de cantidad, botones y diálogos nativos | `components/`, CSS; viewports `320`–`1366 px` comprobados en Chrome (`H02-movil.png`) |
| H5 Prevención | Validación de dominio, advertencia durante input y confirmación al vaciar | Pruebas de cantidad/cancelación y diálogo probado en Chrome (`H05-cancelacion.png`) |
| H6 Reconocimiento | Categorías, precio, subtotales, total y resumen visible en código | `Carrito.js`, `TarjetaProducto.js`, `index.html`, `pedido-revision.png` |
| H7 Eficiencia | Búsqueda con 200 ms, entrada directa, mutaciones serializadas y actualización en sitio | `main.js`, `SelectorCantidad.js`, `Carrito.js`; clics rápidos y espera de revisión probados en Chrome |
| H8 Minimalismo | Avisos sin superposición fija sobre el catálogo | `styles.css`, `H02-movil.png` y `catalogo-movil.png` |
| H9 Recuperación | Error junto al campo; guardado fallido preserva carrito; Deshacer | Pruebas de regresión, estructura ARIA y Chrome (`H04-cantidad.png`, `H06-almacenamiento.png`) |
| H10 Ayuda | Ejemplo de búsqueda, rango y explicación de duración de Deshacer | Textos de `index.html` y `main.js` |

| Hallazgo v1 | Severidad original | Corrección | Verificación disponible |
|---|---:|---|---|
| HE01 Deshacer a 10 s y foco lejano | 3 | B01 | Caso de uso de restaurar y Chrome (`H01-deshacer.png`) |
| HE02 Contenido cubierto en móvil | 2 | B04 | CSS y Chrome en `390×844` sin superposición (`H02-movil.png`) |
| HE03 Variante de búsqueda | 3 | B03 | Prueba funcional de equivalencias y Chrome (`H03-busqueda.png`) |
| HE04 Error tardío en cantidad | 2 | B05 | Validación de dominio y evento `input` en Chrome (`H04-cantidad.png`) |
| HE05 Cancelación accidental | 3 | B02 | Cancelar/deshacer y diálogo en Chrome (`H05-cancelacion.png`) |

Escala: 0 no problema; 1 cosmético; 2 menor; 3 mayor; 4 catastrófico. PT01 añade un problema de integridad de severidad técnica 4 (B06). La severidad después de corregir no se reduce automáticamente a cero sin repetir la comprobación correspondiente.
