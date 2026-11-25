import { el, formatoMoneda } from './formato.js';
import { SelectorCantidad } from './SelectorCantidad.js';

export function Carrito(pedido, { onCambiarCantidad, onEliminar, onConfirmar }) {
  if (pedido.estaVacio) {
    return el('div', { class: 'carrito__vacio' },
      el('p', {}, 'Tu pedido está vacío.'),
      el('p', { class: 'ayuda' }, 'Busca un producto en el catálogo y pulsa “Agregar”.')
    );
  }

  const lineas = pedido.detalles.map((d) =>
    el('li', { class: 'linea', dataset: { productoId: d.productoId } },
      el('div', { class: 'linea__info' },
        el('h3', { class: 'linea__nombre' }, d.nombre),
        el('p', { class: 'linea__unitario' }, `${formatoMoneda(d.precioUnitario)} c/u`)
      ),
      SelectorCantidad({
        id: `cant-${d.productoId}`,
        etiqueta: d.nombre,
        valor: d.cantidad,
        onCambiar: (n) => onCambiarCantidad(d.productoId, n),
      }),
      el('p', { class: 'linea__subtotal' },
        el('span', { class: 'sr-only' }, 'Subtotal: '),
        formatoMoneda(d.subtotal)
      ),
      el('button', {
        type: 'button',
        class: 'boton boton--peligro linea__eliminar',
        onclick: () => onEliminar(d.productoId),
      }, 'Eliminar', el('span', { class: 'sr-only' }, ` ${d.nombre}`))
    )
  );

  return el('div', {},
    el('ul', { class: 'lineas' }, lineas),
    el('dl', { class: 'totales' },
      el('div', { class: 'totales__fila' },
        el('dt', {}, 'Artículos'),
        el('dd', {}, String(pedido.cantidadDeArticulos))
      ),
      el('div', { class: 'totales__fila totales__fila--total' },
        el('dt', {}, 'Total'),
        el('dd', { 'data-js': 'total' }, formatoMoneda(pedido.total))
      )
    ),
    el('button', { type: 'button', class: 'boton boton--primario boton--ancho', onclick: onConfirmar },
      'Revisar y confirmar pedido')
  );
}

export function ResumenPedido(pedido) {
  return el('div', { class: 'resumen' },
    el('ul', { class: 'resumen__lista' },
      pedido.detalles.map((d) =>
        el('li', {}, `${d.cantidad} × ${d.nombre}`, el('span', {}, formatoMoneda(d.subtotal)))
      )
    ),
    el('p', { class: 'resumen__total' }, 'Total: ', el('strong', {}, formatoMoneda(pedido.total)))
  );
}
