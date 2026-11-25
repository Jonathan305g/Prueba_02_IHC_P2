# User flows

## 1. Compra

```mermaid
flowchart TD
  I([Inicio]) --> B[Explora categorías o escribe en el buscador]
  B --> R{¿Hay resultados?}
  R -- No --> M[Muestra: No hay productos que coincidan] --> B
  R -- Sí --> D{¿Producto disponible?}
  D -- No --> AG[Tarjeta marcada como Agotado sin botón Agregar] --> B
  D -- Sí --> A[Pulsa Agregar]
  A --> AV[Actualiza carrito, insignia, barra móvil y muestra aviso]
  AV --> MC{¿Agrega más productos?}
  MC -- Sí --> B
  MC -- No --> VC[Va a Tu pedido o pulsa Ver pedido en móvil]
  VC --> RC[Pulsa Revisar y confirmar pedido]
  RC --> DL[Diálogo modal: Revisa tu pedido]
  DL --> CF{¿Confirma?}
  CF -- Volver y editar --> VC
  CF -- Confirmar pedido --> OK([Pedido confirmado · código CU-...])
```

## 2. Modificación

```mermaid
flowchart TD
  M0([Carrito con productos]) --> ACT{¿Cómo modifica?}
  ACT -- Botón − o + --> VAL{¿Dentro de 1 a 20?}
  ACT -- Escritura directa en campo --> VAL2{¿Entero entre 1 y 20?}
  VAL -- No / límite --> DIS[Botón − en 1 o + en 20 deshabilitado] --> M0
  VAL -- Sí --> UPD[Actualiza cantidad, subtotal y total; guarda en LocalStorage]
  VAL2 -- No --> ERR[Muestra error junto al campo y restaura valor anterior] --> M0
  VAL2 -- Sí --> UPD
  UPD --> REV[Pulsa Revisar y confirmar pedido]
  REV --> DL[Diálogo modal: Revisa tu pedido]
  DL --> VE{¿Desea editar algo?}
  VE -- Pulsa Volver y editar --> M0
  VE -- Confirma pedido --> OK([Pedido confirmado · código CU-...])
```

## 3. Eliminación y cancelación

```mermaid
flowchart TD
  C[Pedido con productos] --> A{Acción}
  A -->|Eliminar línea| E[Quitar producto y guardar recuperación]
  A -->|Cancelar pedido| D[Diálogo de vaciado]
  D -->|Conservar o Escape| C
  D -->|Sí, vaciar| V[Vaciar y guardar recuperación]
  E --> R[Deshacer dentro del carrito]
  V --> R
  R -->|Deshacer| C
  R -->|Otra edición o descarte| F[Termina opción de recuperación]
```

Sin vencimiento por segundos: la opción termina al modificar o confirmar el pedido, recargar o descartarla. Los errores de persistencia interrumpen la acción y mantienen el estado anterior; se informa cómo reintentar. La revisión de confirmación se procesa después de los cambios de cantidad en cola.
