# CaféU 2.0

Aplicación web para la cafetería universitaria: consultar productos, armar un pedido y confirmarlo. Es la prueba práctica integradora de Interacción Humano-Computador (Ingeniería de Software, quinto semestre, UTA-FISEI).

## Equipo y reparto

| Integrante | Responsabilidad | Rama |
|---|---|---|
| Pablo Lozada | Estructura del repositorio, implementación v1 (4 capas), `docs/arquitectura.md`, README | `pablo/base-v1` |
| William Martínez | Análisis UX y requisitos (Actividades 1 y 2): `docs/analisis-ux.md`, `docs/requisitos.md`, sitemap, user flow, trazabilidad | `william/ux-requisitos` |
| Manuel Cuzme | Wireframes y planificación de la evaluación (Actividad 4), piloto P00 y sesiones P01/P02 (Actividad 6) | `manuel/plan-evaluacion` |
| Emilio Abril | Evaluación heurística, recorrido cognitivo y accesibilidad (Actividad 5); métricas, hallazgos y backlog (Actividad 7) | `emilio/heuristica-metricas` |
| Jonathan Gamboa | Pruebas automatizadas T1–T3, correcciones v2, validación v1/v2, evidencias antes/después, revisión y merge de PRs | `jonathan/pruebas-v2` |

Cada integrante trabaja en su rama y abre un Pull Request hacia `main`. Otro integrante lo revisa antes de fusionarlo.

## Requisitos

- Node.js 20 o superior (no usa paquetes de npm).
- Un navegador actual (Chrome, Edge o Firefox).

## Instalación y ejecución

```bash
git clone https://github.com/Jonathan305g/Prueba_02_IHC_P2.git
cd Prueba_02_IHC_P2
npm start
```

Abrir `http://localhost:5173`. El servidor redirige a `src/presentation/`.

También funciona con la extensión Live Server de VS Code abriendo `src/presentation/index.html`. No se puede abrir con doble clic (`file://`) porque los módulos ES necesitan un servidor.

## Pruebas

```bash
npm test
```

Usa el runner nativo de Node (`node --test`), que busca todos los archivos `*.test.js`. Las pruebas están en `tests/pruebas-automatizadas/`.

## Funcionalidades

- Catálogo por categorías con productos agotados marcados.
- Búsqueda que ignora tildes y mayúsculas y acepta varias palabras en cualquier orden (`cafe leche`, `SANDUCHE`).
- Carrito con selector de cantidad (botones − / + y escritura directa, de 1 a 20), subtotal por línea y total.
- Eliminar un producto o cancelar el pedido completo, con opción **Deshacer** durante 10 segundos.
- Revisión del pedido en un diálogo antes de confirmar; número de pedido al confirmar.
- El carrito se guarda en LocalStorage y sobrevive a recargar la página.
- Mobile First, navegación completa por teclado, foco visible, enlaces para saltar secciones y avisos anunciados por lector de pantalla.

## Arquitectura

Presentación → Aplicación → Dominio ← Infraestructura. Detalle, diagramas y decisiones en [docs/arquitectura.md](docs/arquitectura.md).

```
cafeu-ihc-integrador/
├── README.md
├── docs/            analisis-ux, requisitos, arquitectura, sitemap, user-flow, trazabilidad
├── prototipos/      wireframes/, version-v1/ (capturas de la v1)
├── src/             presentation/, application/, domain/, infrastructure/
├── tests/           pruebas-automatizadas/
├── evaluacion/      plan, tareas, consentimiento, piloto, heuristicas, recorrido-cognitivo,
│                    accesibilidad, resultados.csv, metricas, hallazgos, backlog, validacion-v2
└── evidencias/      antes/, despues/
```

## Evidencias

| Actividad | Archivos |
|---|---|
| 1. Análisis UX | [docs/analisis-ux.md](docs/analisis-ux.md) |
| 2. Requisitos y AI | [docs/requisitos.md](docs/requisitos.md), [docs/sitemap.md](docs/sitemap.md), [docs/user-flow.md](docs/user-flow.md), [docs/trazabilidad.md](docs/trazabilidad.md) |
| 3. Implementación | [src/](src/), [docs/arquitectura.md](docs/arquitectura.md), [tests/](tests/), [prototipos/](prototipos/) |
| 4. Planificación | [evaluacion/plan.md](evaluacion/plan.md), [evaluacion/tareas.md](evaluacion/tareas.md), [evaluacion/consentimiento.md](evaluacion/consentimiento.md) |
| 5. Heurística y accesibilidad | [evaluacion/heuristicas.md](evaluacion/heuristicas.md), [evaluacion/recorrido-cognitivo.md](evaluacion/recorrido-cognitivo.md), [evaluacion/accesibilidad.md](evaluacion/accesibilidad.md) |
| 6. Pilotaje y pruebas | [evaluacion/piloto.md](evaluacion/piloto.md), [evaluacion/resultados.csv](evaluacion/resultados.csv) |
| 7. Triangulación y v2 | [evaluacion/metricas.md](evaluacion/metricas.md), [evaluacion/hallazgos.md](evaluacion/hallazgos.md), [evaluacion/backlog.md](evaluacion/backlog.md), [evaluacion/validacion-v2.md](evaluacion/validacion-v2.md), [evidencias/](evidencias/) |

## Limitaciones

- Los datos viven en el navegador (LocalStorage). No hay servidor, pagos ni cuentas de usuario; el pedido confirmado no llega a una cocina real.
- El catálogo es fijo (`src/infrastructure/data/productos.js`). La arquitectura permite cambiarlo por una API sin tocar dominio ni aplicación.
- La evaluación con usuarios se hizo con una muestra pequeña (P01 y P02). Las métricas son descriptivas y no se pueden generalizar.
