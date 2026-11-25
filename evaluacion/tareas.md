# Tareas de evaluación

Antes de cada participante: LocalStorage vacío y la app abierta en la pantalla principal.

## T1. Buscar un producto y agregarlo

| Campo | Detalle |
|---|---|
| Escenario (se lee en voz alta) | "Tienes 10 minutos antes de tu siguiente clase y quieres un café con leche. Pídelo en la app." |
| Estado inicial | Carrito vacío, buscador vacío, categoría "Todas" |
| Criterio de éxito | "Café con leche" aparece en "Tu pedido" con cantidad 1 |
| Tiempo máximo | << 60 >> segundos |
| Errores a registrar | Agregar otro producto por error, no encontrar el producto, búsqueda sin resultados |

## T2. Modificar la cantidad y verificar el total

| Campo | Detalle |
|---|---|
| Escenario | "Llegaron dos amigos y quieren lo mismo. Cambia tu pedido para que sean 3 cafés con leche y dime cuánto vas a pagar." |
| Estado inicial | Resultado de T1 (1 café con leche en el pedido) |
| Criterio de éxito | Cantidad = 3 y la persona dice el total correcto (<< $3,00 >>) |
| Tiempo máximo | << 60 >> segundos |
| Errores a registrar | Agregar desde el catálogo en vez de cambiar la cantidad (no es error si llega a 3), total dicho incorrecto, cantidad equivocada |

## T3. Eliminar, recuperar y confirmar

| Campo | Detalle |
|---|---|
| Escenario | "Agrega también una empanada de verde. Ahora imagina que la quitaste sin querer: quítala y luego recupérala. Cuando el pedido esté listo, confírmalo y dime tu número de pedido." |
| Estado inicial | Resultado de T2 |
| Criterio de éxito | La empanada se elimina y se recupera con Deshacer (no volviendo a agregarla), el pedido se confirma y la persona lee el número |
| Tiempo máximo | << 120 >> segundos |
| Errores a registrar | No ver el aviso de Deshacer, recuperar volviendo a agregar, cerrar el diálogo sin confirmar, no encontrar el número |

Si el participante recupera la empanada volviendo a agregarla desde el catálogo, la tarea cuenta como éxito parcial (0,5) y se anota como hallazgo.
