# Accesibilidad de la actualización 2.0.1

Antecedente: [checklist v1](antecedentes/accesibilidad-v1.md). Alcance actual: inspección de HTML/CSS/JavaScript, cálculo de luminancia WCAG y ejecución automatizada en Google Chrome (`verificar-ui.mjs`: teclado, foco, diálogo `Escape`, validación inmediata y viewports `320`–`1366 px`, `15/15` aprobadas). La escucha real con lector de pantalla y una auditoría Lighthouse completa no se ejecutaron en esta actualización.

| Comprobación | Evidencia en código | Estado |
|---|---|---|
| Semántica e idioma | html lang=es, main, section, h1/h2/h3 y fieldset/legend | Inspeccionado |
| Etiquetas | Label del buscador y de cada cantidad; nombres de botones −/+ | Inspeccionado |
| Foco | :focus-visible; salto a catálogo/carrito; foco en Deshacer y título de éxito | Comprobado en Chrome (`verificar-ui.mjs`) |
| Teclado y modal | Botones nativos y dialog.showModal con Conservar inicial | Comprobado en Chrome (`Escape`, `Tab`, `Enter` en `verificar-ui.mjs`) |
| Error y estado | aria-invalid, aria-describedby, role=alert para error, role=status para información | Atributos comprobados en DOM (`verificar-ui.mjs`); audio de lector no probado |
| Cantidades | Rango 1–20, validación input y change | Comprobado en Node y Chrome (`H04-cantidad.png`) |
| Área táctil y responsive | Mínimos 44 px, media queries 600/960, espacio de barra inferior | Comprobado en `320`, `360`, `600`, `960`, `1366 px` (`H02-movil.png`) |
| Recuperación | Dentro del carrito y sin cierre por segundos | Comprobado tras >11 s y activación con `Enter` (`H01-deshacer.png`) |

## Contraste calculado

| Elemento | Primer plano | Fondo | Ratio | Umbral |
|---|---|---|---:|---:|
| Texto normal | #1f1a17 | #fbf7f2 | 16.16 : 1 | 4.5 : 1 |
| Texto secundario | #5b524c | #ffffff | 7.62 : 1 | 4.5 : 1 |
| Boton primario | #ffffff | #5a3420 | 10.79 : 1 | 4.5 : 1 |
| Error | #a32020 | #ffffff | 7.54 : 1 | 4.5 : 1 |
| Foco sobre blanco | #0b57d0 | #ffffff | 6.39 : 1 | 3 : 1 |
| Texto de recuperacion | #1f1a17 | #fff4d6 | 15.73 : 1 | 4.5 : 1 |

Fórmula: linealización sRGB, luminancia 0,2126R + 0,7152G + 0,0722B y (Lmayor+0,05)/(Lmenor+0,05). Los colores y el resultado están en [contraste.json](../evidencias/verificacion/contraste.json). La legibilidad final bajo luz, zoom y pantalla real requiere comprobar el diseño renderizado.
