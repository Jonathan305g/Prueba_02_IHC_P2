# Backlog priorizado y correcciones

Puntaje = severidad 0–4 × impacto 1–3. Impacto: 1 una acción puntual; 2 flujo crítico o varios perfiles; 3 integridad general del pedido. La priorización distingue evidencia de participantes e inspección. Implementar no implica que haya una reevaluación empírica aprobada.

| Orden | ID | Problema | Severidad | Impacto | Puntaje | Evidencia | Estado de código | Verificación |
|---|---|---|---|---|---|---|---|---|
| 1 | B06 | Confirmación perdida o estado no guardado sin aviso | 4 | 3 | 12 | PT01, comparación Node antes/después | Implementado | Regresión de persistencia aprobada |
| 2 | B01 | Deshacer temporal y distante | 3 | 2 | 6 | HE01, HA01, T3 V1 | Implementado | Aprobado en Node y Chrome (`H01-deshacer.png`) |
| 3 | B02 | Vaciado global sin confirmación | 3 | 2 | 6 | HE05, HA05 | Implementado | Aprobado en Node y Chrome (`H05-cancelacion.png`) |
| 4 | B03 | Variante expreso no encuentra producto | 3 | 1 | 3 | HE03, HA03 sin consulta literal | Implementado | Aprobado en Node y Chrome (`H03-busqueda.png`) |
| 5 | B04 | Aviso y barra cubren contenido móvil | 2 | 1 | 2 | HE02, sin sesiones móviles aportadas | Implementado | Aprobado en Chrome `320`–`1366 px` (`H02-movil.png`) |
| 6 | B05 | Falta de advertencia inmediata al editar cantidad | 2 | 1 | 2 | HE04, T2 V1 | Implementado | Aprobado en Node y Chrome (`H04-cantidad.png`) |

La actualización preparada para William implementa todos los cambios. Se conservan autoría y responsabilidades históricas del equipo; no se adjudican estos cambios a commits de compañeros inexistentes. El cierre de la evaluación de usuarios se documenta con sus límites en [validacion-v2.md](validacion-v2.md).
