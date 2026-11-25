# Recorrido cognitivo (v1)

Usuario objetivo: Mateo Villacís, persona definida en `docs/analisis-ux.md` (21 años, estudiante de 5.º semestre FISEI-UTA, primera vez que usa la app desde móvil/escritorio en un receso de 10 minutos).

Preguntas por paso:

- **P1.** ¿El usuario intentará lograr este efecto?
- **P2.** ¿El usuario notará que la acción correcta está disponible?
- **P3.** ¿Asociará la acción correcta con el efecto que busca?
- **P4.** Después de la acción, ¿verá que avanzó hacia su objetivo?

## T2. Modificar la cantidad y verificar el total

Estado inicial: 1 *Café con leche* (`$1,00`) en `Tu pedido` (`evaluacion/tareas.md`).

| Paso | Acción correcta | P1 | P2 | P3 | P4 | Comentario / problema |
|---|---|---|---|---|---|---|
| 1 | Ir a "Tu pedido" (en móvil: bajar o pulsar "Ver pedido · $1,00") | Sí | Sí | Sí | Sí | En escritorio `Tu pedido` es visible a la derecha; en móvil la barra fija `Ver pedido` destaca el acceso directo. |
| 2 | Pulsar `+` dos veces en la línea de *Café con leche* (o escribir `3` en el campo numérico) | Sí | Sí | Sí | Parcial | Los botones `−` y `+` (`44×44 px`) son claros; sin embargo, si el usuario decide escribir `3` manualmente y borra el `1` o escribe `0` antes de salir del campo, no ve validación hasta el evento `change` (hallazgo `HE04`). |
| 3 | Leer el total actualizado (`$3,00`) | Sí | Sí | Sí | Sí | El total cambia de inmediato a `$3,00` en `.totales__fila--total` y el aviso `aria-live` confirma `Café con leche: 3. Nuevo total: $3,00.`. |

## T3. Eliminar, recuperar y confirmar

Estado inicial: resultado de T2 (3 *Café con leche*, total `$3,00`).

| Paso | Acción correcta | P1 | P2 | P3 | P4 | Comentario / problema |
|---|---|---|---|---|---|---|
| 1 | Buscar y agregar *Empanada de verde* | Sí | Sí | Sí | Sí | La búsqueda por `empanada` o `verde` muestra el producto y el botón `Agregar` actualiza el carrito a `$4,00`. |
| 2 | Pulsar `Eliminar` en la línea de *Empanada de verde* | Sí | Sí | Sí | Parcial | El botón `Eliminar` está claramente etiquetado, pero al pulsarlo el foco salta al campo de cantidad del primer producto (`#cant-cafe-con-leche`) mientras el aviso con `Deshacer` aparece al final del DOM. |
| 3 | Pulsar `Deshacer` en el aviso | Sí | Parcial | Sí | Sí | Quien usa puntero ve el aviso flotante durante `10 s`; sin embargo, quien navega con teclado queda en el carrito y debe avanzar varios `Tab` hasta el final del DOM antes de que expire el tiempo (`HE01`). |
| 4 | Pulsar `Revisar y confirmar pedido` | Sí | Parcial | Sí | Sí | El botón primario destaca, pero justo debajo (`0.5rem`) aparece `Cancelar pedido` con el mismo ancho completo (`HE05`), lo que puede inducir un toque accidental con el pulgar en móvil. |
| 5 | Pulsar `Confirmar pedido` en el diálogo `Revisa tu pedido` | Sí | Sí | Sí | Sí | El modal muestra resumen completo, atrapa el foco y permite volver con `Volver y editar` o `Esc`. |
| 6 | Leer el número de pedido (`CU-...`) | Sí | Sí | Sí | Sí | La sección `Pedido confirmado` recibe el foco en `#exito-titulo` y muestra el código en fuente monoespaciada. |

## Problemas encontrados

| ID | Tarea / paso | Pregunta que falla | Descripción | Se convierte en hallazgo |
|---|---|---|---|---|
| RC01 | T2 · Paso 2 | P4 (parcial) | Al editar manualmente el campo numérico de cantidad, no hay retroalimentación preventiva en `input` hasta perder el foco (`change`). | HE04 |
| RC02 | T3 · Paso 3 | P2 (parcial) | El foco tras eliminar permanece en `#cant-...` mientras el botón `Deshacer` queda al final del DOM con temporizador de `10 s`. | HE01 |
| RC03 | T3 · Paso 4 | P2 (parcial) | `Cancelar pedido` está visualmente pegado a `Revisar y confirmar pedido` sin confirmación previa al cancelar. | HE05 |



## Revisión de diseño tras la actualización 2.0.1

El recorrido anterior corresponde a la base v1. La tabla siguiente es una inspección razonada de los cambios; no se declara como una ejecución observada en navegador.

| Tarea y paso | ¿Sabe qué lograr? | ¿Ve una acción? | ¿Relaciona acción con objetivo? | ¿Percibe progreso? |
|---|---|---|---|---|
| T2, editar cantidad | Consigna pide tres en total | Campo, − y + etiquetados | Etiqueta incluye producto y rango | Totales y error de dominio; interfaz por comprobar |
| T2, cantidad inválida | Mantener entero entre 1 y 20 | Mensaje en input y validación al cambiar | Error junto al campo con aria-describedby | Se conserva el último valor válido; probar en navegador |
| T3, eliminar | Quitar la empanada | Eliminar por producto | Nombre accesible incluye producto | Panel de recuperación dentro del carrito |
| T3, recuperar | Restaurar lo eliminado | Deshacer recibe foco y no tiene plazo por segundos | Texto identifica la eliminación | Reaparecen producto y total; caso de uso probado |
| T3, confirmar | Revisar y obtener código | Revisión y confirmación separadas | Resumen de líneas y total | Éxito solo tras guardar; persistencia probada |
| Cancelar todo | Vaciar con posibilidad de conservar | Diálogo Conservar / Sí, vaciar | Explicación del efecto | Deshacer disponible tras vaciar; diálogo por comprobar |

La próxima comprobación debe observar si se reconoce Deshacer sin pista, si Conservar recibe el foco y si los errores se anuncian correctamente por lector. La revisión técnica de foco y lector de pantalla se distingue de las sesiones con usuarios ya realizadas y registradas en el Excel.
