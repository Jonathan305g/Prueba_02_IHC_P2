# Matriz de trazabilidad

Pruebas automatizadas: archivos en `tests/pruebas-automatizadas/` (`humo.test.js` existente y pruebas funcionales T1–T3 acordadas con Jonathan). Tareas de usabilidad: `evaluacion/tareas.md` (Manuel). Heurísticas y análisis: `docs/analisis-ux.md`.

| Requisito | Pantalla / componente | Prueba automatizada | Tarea de usabilidad | Heurística relacionada |
|---|---|---|---|---|
| RF01 | Catálogo · filtro de categorías (`pintarCategorias`, `TarjetaProducto.js`) | `humo.test.js` · `t1-buscar-agregar.test.js` | T1 | H1 · Visibilidad del estado del sistema · H2 · Relación con el mundo real |
| RF02 | Catálogo · buscador (`main.js`, `texto.js`) | `t1-buscar-agregar.test.js` | T1 | H2 · Relación con el mundo real · H7 · Flexibilidad y eficiencia de uso |
| RF03 | Tarjeta de producto (`TarjetaProducto.js`, `AgregarAlCarrito`) | `t1-buscar-agregar.test.js` | T1 | H1 · Visibilidad del estado del sistema · H5 · Prevención de errores |
| RF04 | Carrito · selector de cantidad y totales (`Carrito.js`, `SelectorCantidad.js`) | `t2-cantidad-total.test.js` | T2 | H4 · Consistencia y estándares · H9 · Recuperación de errores |
| RF05 | Carrito · eliminar / cancelar · aviso Deshacer (`Avisos.js`, `EliminarDelCarrito`, `CancelarPedido`) | `t3-eliminar-confirmar.test.js` | T3 | H3 · Control y libertad del usuario · H5 · Prevención de errores |
| RF06 | Diálogo de revisión · pantalla de confirmación (`index.html`, `main.js`, `ConfirmarPedido`) | `t3-eliminar-confirmar.test.js` | T3 | H1 · Visibilidad del estado · H5 · Prevención de errores |
| RNF01 | Layout Mobile First, barra móvil y zonas táctiles ≥ 44×44 px (`styles.css`) | Revisión responsive en navegador (360 px / 600 px / 960 px) | T1, T2, T3 (en móvil) | H7 · Flexibilidad y eficiencia de uso · H8 · Diseño estético y minimalista |
| RNF02 | Enlaces de salto, foco visible, semántica y región `aria-live` (`index.html`, `styles.css`, `Avisos.js`) | Revisión de teclado, contraste y lector de pantalla | T1, T2, T3 | H1 · Visibilidad del estado · H4 · Consistencia y estándares |
| RNF03 | Búsqueda con debounce (200 ms) y cálculo local sin dependencias externas (`main.js`, `domain/`) | `npm test` (`humo.test.js` y suite `t1`–`t3`) | T1, T2 | H7 · Flexibilidad y eficiencia de uso |
| RNF04 | Persistencia en `localStorage` y respaldo en memoria (`almacenamiento.js`, `repositorios.js`) | `humo.test.js` (`AlmacenamientoEnMemoria`) y prueba de recarga | T2, T3 | H5 · Prevención de errores · H9 · Recuperación ante fallos |
