# Cambios de la actualización 2.0.1

Base técnica: `4d9037e30f174e8f78f7e42dfad25fde2dfdf456`. Integración preparada para William Martínez; no se ha escrito al repositorio remoto.

| ID | Antes | Cambio implementado | Evidencia verificable |
|---|---|---|---|
| B01 / HE01 | Deshacer en un aviso que caduca a los 10 s | Recuperación dentro del carrito, foco sobre Deshacer y fin por otra edición o cierre de la página, sin temporizador | `main.js`, `verificar-ui.mjs` (`15/15` aprobadas), captura `H01-deshacer.png` |
| B02 / HE05 | Cancelar vacía inmediatamente | Diálogo con Conservar como opción inicial; vaciar exige acción explícita y permite Deshacer | `index.html`, `main.js`, `verificar-ui.mjs`, captura `H05-cancelacion.png` |
| B03 / HE03 | expreso no coincide con espresso | Equivalencias acotadas de consulta y texto de producto | `normalizarBusqueda`, prueba funcional, captura `H03-busqueda.png` |
| B04 / HE02 | Avisos flotantes y barra móvil compiten con contenido | Avisos en flujo normal y espacio inferior con área segura | `styles.css`, comprobación móvil `320`–`1366 px`, captura `H02-movil.png` |
| B05 / HE04 | Error de cantidad aparece al salir | Validación en `input`, más comprobación al confirmar el cambio; actualización en sitio sin perder clics | `SelectorCantidad.js`, `Carrito.js`, `main.js`, captura `H04-cantidad.png` |
| B06 / PT01 | Se ignora el error de guardado y puede anunciarse una confirmación perdida | Errores propagados, estado único para carrito/historial y aviso de modo temporal | Pruebas de persistencia y comparación técnica antes/después |

Además: serialización de mutaciones para evitar pérdidas por clics concurrentes; la revisión espera al cambio de cantidad. Se incorporan tres wireframes, datos editables y CSV, cálculo reproducible, límites de evidencia, guía de integración y automatización de pruebas de Node en GitHub Actions.

El paquete incluye la identidad comprobada de los 66 archivos de la V1, el registro de sus 15 pruebas originales y el comando `npm run comparar:v1 -- ../CafeU_V1` para repetir la comparación técnica. RF02, RF05 y RNF04 describen la búsqueda con equivalencias, la recuperación sin temporizador y la persistencia conjunta de la actualización.

Las pruebas con usuarios están realizadas y documentadas en el Excel, según confirmación de William Martínez. Los registros V1/V2 permanecen sin renombrar y no se les asigna un commit ausente del archivo. La revisión de un compañero se documentará mediante el Pull Request.
