# Evaluación heurística (v1)

Evaluadores: Emilio Abril (revisión individual sobre v1; segunda revisión pendiente de par) · Fecha: 2026-11-25 · Dispositivos: Escritorio (`1280×800`, Chrome) y Móvil (`390×844`, Chrome DevTools)

## Revisión de las 10 heurísticas

| N.º | Heurística | ¿Se cumple? (Sí / Parcial / No) | Evidencia |
|---|---|---|---|
| H1 | Visibilidad del estado del sistema | Sí | Región fija `role="status"` (`aria-live="polite"`) en `Avisos.js` muestra confirmaciones con total (`Agregaste Café con leche... Total: $1,00`), insignia en cabecera y texto `En tu pedido: N` en cada tarjeta. |
| H2 | Relación entre el sistema y el mundo real | Parcial | `normalizarTexto` ignora tildes y mayúsculas (`cafe leche` encuentra `Café con leche`), pero `Producto.coincideCon` exige coincidencia literal sin sinónimos: buscar `expreso` (grafía habitual en español) no encuentra `Capuchino` (`Espresso...`). |
| H3 | Control y libertad del usuario | Parcial | Existe `Deshacer` tras eliminar una línea o cancelar el pedido, pero el aviso dura `10 s` y está al final del DOM (`index.html:78`), lejos del foco en `#carrito`, dificultando alcanzarlo por teclado antes de que desaparezca. |
| H4 | Consistencia y estándares | Parcial | Usa `<dialog>`, landmarks y botones `−` / `+` de `44×44 px`; sin embargo, en móvil (`390×844`) la barra fija `.barra-movil` y `.avisos` (`bottom: 5.5rem`) se superponen a la parte inferior del catálogo al desplazarse. |
| H5 | Prevención de errores | Parcial | El diálogo `Revisa tu pedido` previene confirmar por error, pero el botón `Cancelar pedido` está pegado (`margin-top: 0.5rem`) al botón primario `Revisar y confirmar pedido` (`Carrito.js:48-51`) y vacía todo el carrito sin confirmación previa. |
| H6 | Reconocer antes que recordar | Sí | Chips visibles de categorías (`Todas`, `Bebidas calientes`, `Bebidas frías`, `Snacks`, `Almuerzos`, `Postres`), precios unitarios, subtotales y resumen completo antes de confirmar. |
| H7 | Flexibilidad y eficiencia de uso | Parcial | Búsqueda en tiempo real (debounce `200 ms`) y botones `−` / `+` más entrada numérica directa; sin embargo, falta tolerancia a sinónimos comunes (`expreso` → `espresso`) y atajo rápido para volver al aviso de `Deshacer`. |
| H8 | Diseño estético y minimalista | Parcial | Jerarquía visual limpia en escritorio; en móvil `390×844` la barra fija inferior y el aviso superpuesto compiten visualmente con las tarjetas inferiores. |
| H9 | Ayudar a reconocer, diagnosticar y recuperarse de errores | Parcial | Al perder el foco (`change`), `SelectorCantidad.js` muestra el error junto al campo (`La cantidad debe estar entre 1 y 20.`) y restaura el valor previo; sin embargo, mientras el usuario escribe (`input`) `0` o `99` no recibe advertencia inmediata. |
| H10 | Ayuda y documentación | Sí | El buscador incluye ejemplo (`Ej.: cafe, empanada, jugo`) y nota visible (`Puedes escribir sin tildes ni mayúsculas.`), y el estado sin resultados sugiere revisar la palabra o elegir `Todas`. |

## Hallazgos

Severidad: 0 no es problema · 1 cosmético · 2 menor · 3 mayor · 4 catastrófico

| ID | Hallazgo | Heurística | Pantalla | Evidencia (captura) | Sev. evaluador 1 | Sev. evaluador 2 | Severidad final | Recomendación |
|---|---|---|---|---|---|---|---|---|
| HE01 | El aviso con `Deshacer` dura 10 s y se ubica al final del DOM (`index.html:78`), mientras el foco tras eliminar queda en el carrito (`cant-...` o `#carrito-titulo`), obligando a recorrer múltiples `Tab` para recuperarlo con teclado | H3 · H7 | Carrito / Avisos (escritorio) | [../evidencias/antes/H01.png](../evidencias/antes/H01.png) | 3 | — | 3 | Incluir botón/enlace `Deshacer` dentro del propio bloque de `#carrito` o permitir enfocar el aviso con un atajo/acción inmediata y ampliar el margen temporal cuando hay acción de recuperación. |
| HE02 | En móvil (`390×844`), la barra fija inferior `Ver pedido` (`styles.css:171`) y el aviso flotante cubren parcialmente el contenido inferior del catálogo al desplazarse | H4 · H8 | Catálogo móvil (`390×844`) | [../evidencias/antes/H02.png](../evidencias/antes/H02.png) | 2 | — | 2 | Aumentar el `padding-bottom` del contenedor principal en móvil (`>= 7.5rem`) y reubicar el aviso en la parte superior debajo de la cabecera en viewports pequeños. |
| HE03 | La búsqueda no reconoce variantes ortográficas o términos parciales habituales (`expreso` devuelve 0 resultados aunque *Capuchino* incluye `Espresso` en su descripción) | H2 · H7 | Buscador / Catálogo | [../evidencias/antes/H03.png](../evidencias/antes/H03.png) | 3 | — | 3 | Incorporar palabras clave/sinónimos en el catálogo (`expreso` para `Capuchino` y `Café americano`) o normalizar variantes comunes en `Producto.coincideCon`. |
| HE04 | El campo numérico de cantidad (`SelectorCantidad.js:49`) valida solo en el evento `change` (al salir del campo), permitiendo escribir `0`, negativos o `99` sin advertencia inmediata mientras se edita | H5 · H9 | Selector de cantidad en carrito | [../evidencias/antes/H04.png](../evidencias/antes/H04.png) | 2 | — | 2 | Mostrar validación preventiva en el evento `input` cuando el valor sale del rango `1–20` manteniendo la restauración al confirmar el cambio. |
| HE05 | El botón `Cancelar pedido` (`Carrito.js:50`) está pegado (`0.5rem`) al botón primario `Revisar y confirmar pedido` con el mismo ancho completo y vacía el carrito sin confirmación previa | H5 | Panel de carrito | [../evidencias/antes/H05.png](../evidencias/antes/H05.png) | 3 | — | 3 | Separar visualmente `Cancelar pedido` (estilo secundario/peligro discreto con mayor separación) o solicitar confirmación explícita en diálogo antes de vaciar todo el pedido. |
