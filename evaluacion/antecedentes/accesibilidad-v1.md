# Checklist de accesibilidad (v1)

Fecha: 2026-11-25 · Navegador: Chrome Headless (`1280×800` y `390×844`) · Herramientas: navegación real por teclado vía CDP (`Tab`, `Enter`, `Escape`), cálculo matemático de luminancia WCAG 2.1 sobre `:root` de `src/presentation/styles.css` e inspección de DOM/ARIA en `src/presentation/index.html`.

## Teclado

| Comprobación | Resultado (Cumple / No) | Evidencia |
|---|---|---|
| Se llega a todos los controles con Tab en orden lógico | Cumple | Primer `Tab` enfoca `Saltar al catálogo`; secuencia recorre buscador, chips radio de categoría, tarjetas, carrito y pie sin saltos erráticos. |
| El foco siempre se ve | Cumple | `:focus-visible` aplica `outline: 3px solid #0b57d0; outline-offset: 2px;` en `styles.css:39-43` y en `.chip input:focus-visible + label`. |
| Enlaces "Saltar al catálogo / carrito" aparecen con Tab y funcionan | Cumple | Verificado en prueba real: primer `Tab` enfoca `Saltar al catálogo` (`.saltar:focus { top: 0.5rem; }`) apuntando a `#catalogo-titulo` y `#carrito-titulo` (`tabindex="-1"`). |
| Categorías se cambian con flechas | Cumple | Implementadas como grupo `<input type="radio" name="categoria">` dentro de `<fieldset>` (`main.js:47-51`), permitiendo cambio nativo con flechas. |
| Agregar, − / +, Eliminar, Deshacer funcionan con Enter o Espacio | Cumple (con obs.) | Todos son `<button type="button">` nativos; observación en `HE01`: tras eliminar, alcanzar `Deshacer` por teclado exige recorrer el resto del DOM antes de `10 s`. |
| El diálogo de revisión atrapa el foco y se cierra con Esc | Cumple | `<dialog>` nativo (`showModal()`); probado con tecla `Escape`: cierra el diálogo (`open: true → false`) y devuelve el foco a `Revisar y confirmar pedido` (`main.js:211`). |
| Tras confirmar, el foco va al título "Pedido confirmado" | Cumple | `mostrarExito()` ejecuta `document.getElementById('exito-titulo').focus()` (`main.js:236`) sobre `<h2 id="exito-titulo" tabindex="-1">`. |
| No hay trampas de foco | Cumple | No existen ciclos bloqueantes fuera del `<dialog>` modal; `Esc` libera el modal en todo momento. |

## Contraste (WCAG AA: 4.5:1 texto normal, 3:1 texto grande y bordes de controles)

| Elemento | Color texto | Color fondo | Ratio medido | Cumple |
|---|---|---|---|---|
| Texto normal | `#1f1a17` | `#fbf7f2` | **16.16 : 1** | Cumple (AAA) |
| Texto secundario | `#5b524c` | `#ffffff` | **7.62 : 1** | Cumple (AAA) |
| Botón primario | `#ffffff` | `#5a3420` | **10.79 : 1** | Cumple (AAA) |
| Botón eliminar | `#a32020` | `#ffffff` | **7.54 : 1** | Cumple (AAA) |
| Mensaje de error | `#a32020` | `#ffffff` | **7.54 : 1** | Cumple (AAA) |
| Botón − deshabilitado | `#9b918a` | `#ffffff` | **3.08 : 1** | Exento (control deshabilitado; legible pero mejorable bajo luz solar) |
| Aviso de éxito (`.aviso--exito`) | `#1f1a17` | `#e4f3e9` | **15.02 : 1** | Cumple (AAA) |
| Aviso de error (`.aviso--error`) | `#1f1a17` | `#fbe6e6` | **14.42 : 1** | Cumple (AAA) |

## Etiquetas y semántica

| Comprobación | Resultado | Evidencia |
|---|---|---|
| El buscador tiene `<label>` visible | Cumple | `<label for="consulta">Buscar producto</label>` en `index.html:30`. |
| Cada campo de cantidad tiene etiqueta con el nombre del producto | Cumple | `SelectorCantidad.js:55`: `<label for="cant-{id}">Cantidad de {etiqueta}</label>`. |
| Botones − / + tienen nombre accesible ("Agregar una unidad de…") | Cumple | `SelectorCantidad.js:25,31`: `aria-label="Quitar una unidad de …"` y `aria-label="Agregar una unidad de …"`. |
| Encabezados en orden (h1 → h2 → h3) | Cumple | `h1` (`CaféU 2.0`) → `h2` (`Catálogo`, `Tu pedido`, `Pedido confirmado`, `Revisa tu pedido`) → `h3` (nombres de producto y líneas). |
| Idioma de la página `lang="es"` | Cumple | `<html lang="es">` en `index.html:2`. |

## Mensajes de error y estado

| Comprobación | Resultado | Evidencia |
|---|---|---|
| Cantidad fuera de rango muestra el error junto al campo y dice el rango | Cumple (en `change`) | `SelectorCantidad.js:20,42`: `<p id="...-error" class="cantidad__error" aria-live="polite">` asociado con `aria-describedby`. *(Ver `HE04`: no valida en `input` hasta salir del campo).* |
| El error se anuncia por lector de pantalla | Cumple | `aria-live="polite"` en `.cantidad__error` y `role="status" aria-live="polite" aria-atomic="true"` en `.avisos`. |
| Avisos (agregado, eliminado, total) se anuncian sin mover el foco | Cumple | `Avisos.js` inserta mensajes dentro de `[data-js="avisos"]` sin llamar `.focus()`. |
| Búsqueda sin resultados explica qué hacer | Cumple | `main.js:69-70`: `"No hay productos que coincidan con “…”. Revisa la palabra o elige “Todas” en categoría."`. |

## Lighthouse

- **Estado**: No ejecutado en esta revisión (no se instaló CLI de Lighthouse en el entorno local sin dependencias). Se realizaron las comprobaciones equivalentes de contraste WCAG, teclado, ARIA y estructura semántica mediante Chrome DevTools/CDP y scripts de verificación. *(Pendiente adjuntar captura `../evidencias/antes/lighthouse-v1.png` si se corre desde DevTools en navegador de escritorio).*
