# CaféU 2.0 · Actualización 2.0.1

Aplicación local de pedidos para la cafetería universitaria. Actualización preparada para que **William Martínez** la integre mediante una sola rama sobre `Jonathan305g/Prueba_02_IHC_P2`. Base: commit `4d9037e30f174e8f78f7e42dfad25fde2dfdf456`.

**Base V1 confirmada:** versión 1.0.0 del repositorio de Jonathan. Se verificaron sus 66 archivos y se ejecutaron sus 15 pruebas originales; esta actualización supera 26 pruebas. [Identidad y comparación de la base](docs/base-v1.md). Para empezar con el ZIP, consulta [LEEME.txt](LEEME.txt).

El código incluye las cinco mejoras del backlog y una corrección de persistencia. El Excel recibido está conservado sin modificar y sus métricas se regeneran desde datos editables. **Las pruebas con usuarios ya se realizaron y sus resultados están en el Excel, según confirmación de William Martínez.** La comprobación técnica en navegador (`npm run test:ui`) también se ejecutó con **15/15 verificaciones aprobadas** y capturas guardadas en [evidencias/despues/](evidencias/despues/README.md). Véanse [validación](evaluacion/validacion-v2.md) y [control de entrega](docs/control-entrega.md).

## Instalación y ejecución

Requisitos: Node.js 20 o superior y un navegador con módulos ES y `<dialog>`. La aplicación y las pruebas de Node no necesitan paquetes externos.

```bash
git clone https://github.com/Jonathan305g/Prueba_02_IHC_P2.git
cd Prueba_02_IHC_P2
npm start
```

Si usas el ZIP, abre una terminal en la carpeta que contiene `package.json` y ejecuta `npm start`. Abre http://localhost:5173. Para cambiar el puerto: `$env:PORT=5174` en PowerShell o `PORT=5174 npm start` en Bash. También puede usarse Live Server sobre `src/presentation/index.html`. Los módulos no se ejecutan con doble clic mediante `file://`.

## Pruebas y métricas

```bash
npm test
npm run metricas
npm run comprobar
```

[Registro de pruebas](evidencias/verificacion/node-tests.tap), [persistencia antes/después](evidencias/verificacion/persistencia-antes-despues.json), [contraste](evidencias/verificacion/contraste.json), [métricas](evaluacion/metricas.md).

El guion de navegador está en [tests/navegador/verificar-ui.mjs](tests/navegador/verificar-ui.mjs). Para ejecutarlo en un equipo con Playwright: `npm install --no-save --package-lock=false playwright`, definir `CAFEU_CHROMIUM_PATH` (o instalar Chromium con `npx playwright install chromium`) y correr `npm run test:ui`. Inicia su propio servidor en el puerto 5190. Ejecutado sobre Google Chrome (`158.0.8127.88`) con **15/15 comprobaciones aprobadas**. [Estado observado](evidencias/verificacion/navegador.json).

## Funcionalidades

- Catálogo de 17 productos, filtros, precios y disponibilidad.
- Búsqueda sin tildes ni distinción de mayúsculas; palabras en cualquier orden y equivalencias `expreso` / `expresso` / `espresso`.
- Carrito, cantidades enteras 1–20, subtotales y total en USD. Advertencia de cantidad inválida mientras se escribe.
- Eliminación con **Deshacer dentro del carrito**, sin vencimiento por segundos durante esa edición. La recuperación termina al modificar o confirmar el pedido, recargar o descartar la opción.
- Cancelación completa con diálogo de confirmación y opción de recuperar el pedido.
- Revisión antes de confirmar, código de pedido y almacenamiento del historial local.
- Escritura conjunta de carrito e historial: si guardar falla, se informa el error y se conserva el pedido anterior. Modo temporal explícito si LocalStorage está bloqueado desde el inicio.
- CSS Mobile First, controles de 44 px, etiquetas, enlaces de salto y avisos ARIA. Avisos en el flujo del documento para evitar tapar contenido.

## Arquitectura

Presentación → Aplicación → Dominio; Infraestructura implementa repositorios y depende del dominio. `main.js` crea e inyecta los adaptadores. [Arquitectura y persistencia](docs/arquitectura.md).

## Evidencias por actividad

| Actividad | Evidencia |
|---|---|
| 1. Persona, contexto y experiencia | [Análisis UX](docs/analisis-ux.md) |
| 2. Requisitos y arquitectura de información | [Requisitos](docs/requisitos.md), [sitemap](docs/sitemap.md), [user flow](docs/user-flow.md), [trazabilidad](docs/trazabilidad.md) |
| 3. Arquitectura e implementación | [Código](src/presentation/index.html), [arquitectura](docs/arquitectura.md), [pruebas](tests/pruebas-automatizadas/humo.test.js) |
| 4. Planificación | [Plan](evaluacion/plan.md), [tareas](evaluacion/tareas.md), [consentimiento](evaluacion/consentimiento.md), [cuestionario](evaluacion/cuestionario.md) |
| 5. Inspección | [Heurísticas](evaluacion/heuristicas.md), [recorrido](evaluacion/recorrido-cognitivo.md), [accesibilidad](evaluacion/accesibilidad.md) |
| 6. Piloto y registros | [Piloto](evaluacion/piloto.md), [Excel](evaluacion/datos/CafeU_Recoleccion_Pruebas_Completo.xlsx), [observaciones](evaluacion/datos/observaciones.json) |
| 7. Métricas, corrección y comparación | [Métricas](evaluacion/metricas.md), [hallazgos](evaluacion/hallazgos.md), [backlog](evaluacion/backlog.md), [validación](evaluacion/validacion-v2.md) |
| Prototipado | [Tres wireframes](prototipos/wireframes/README.md), [capturas originales de v1](prototipos/version-v1/v1-escritorio-01-catalogo.png) |
| Actualización y entrega | [Cambios](docs/cambios-2.0.1.md), [guía de rama y commits](docs/guia-actualizacion.md), [evidencias](evidencias/README.md) |

## Equipo y contribuciones

| Integrante | Aporte asignado en el repositorio base |
|---|---|
| Pablo Lozada | Base, implementación v1, arquitectura |
| William Martínez | UX, requisitos, arquitectura de información y trazabilidad |
| Manuel Cuzme | Prototipado y evaluación |
| Emilio Abril | Heurística, accesibilidad, métricas y backlog |
| Jonathan Gamboa | Pruebas, integración y coordinación de v2 |

La actualización se entrega para que William suba todos sus archivos. La asignación original no demuestra por sí sola la ejecución de cada actividad; los commits y revisiones existentes en GitHub son la evidencia de colaboración. No se crean contribuciones ni aprobaciones ficticias. [Guía de integración](docs/guia-actualizacion.md).

## Limitaciones

Los datos son propios de este navegador y origen (protocolo, host y puerto); no hay cuentas, pagos, envío a cocina ni sincronización entre dispositivos. No se resuelven ediciones simultáneas en varias pestañas. El modo en memoria dura hasta recargar. La migración conserva las claves antiguas como respaldo; si el almacenamiento está lleno, la operación se rechaza sin afirmar éxito. Los datos dañados se informan y no se borran automáticamente: conserva una copia antes de restablecer el sitio.

P01/P02 son dos personas y las conclusiones son descriptivas. El archivo declara que repiten en V2; puede existir aprendizaje. El campo de versión V2 y los códigos anotados se conservan tal como constan en el Excel; no se les asigna un commit que no figure en el registro. No se recibieron capturas de las sesiones con participantes; en `evidencias/despues/` constan las 10 capturas técnicas de la verificación automatizada en navegador.
