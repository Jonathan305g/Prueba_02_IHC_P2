import { el, formatoMoneda } from './formato.js';
import { SelectorCantidad } from './SelectorCantidad.js';

export function Carrito(pedido, { onCambiarCantidad, onEliminar, onConfirmar, onCancelar }) {
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
        el('span', { 'data-js': 'subtotal' }, formatoMoneda(d.subtotal))
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
        el('dd', { 'data-js': 'articulos' }, String(pedido.cantidadDeArticulos))
      ),
      el('div', { class: 'totales__fila totales__fila--total' },
        el('dt', {}, 'Total'),
        el('dd', { 'data-js': 'total' }, formatoMoneda(pedido.total))
      )
    ),
    el('button', { type: 'button', class: 'boton boton--primario boton--ancho', onclick: onConfirmar },
      'Revisar y confirmar pedido'),
    el('button', { type: 'button', class: 'boton boton--secundario boton--ancho boton--cancelar', onclick: onCancelar },
      'Cancelar pedido')
  );
}

export function actualizarCarritoEnSitio(contenedor, pedido) {
  if (pedido.estaVacio) return false;
  const lineasActuales = [...contenedor.querySelectorAll('.linea')];
  if (lineasActuales.length !== pedido.detalles.length) return false;
  const coinciden = pedido.detalles.every((d, i) => lineasActuales[i].dataset.productoId === d.productoId);
  if (!coinciden) return false;

  pedido.detalles.forEach((d, i) => {
    const linea = lineasActuales[i];
    linea.querySelector('.cantidad')?.actualizar?.(d.cantidad);
    const subtotal = linea.querySelector('[data-js="subtotal"]');
    if (subtotal) subtotal.textContent = formatoMoneda(d.subtotal);
  });
  const articulos = contenedor.querySelector('[data-js="articulos"]');
  if (articulos) articulos.textContent = String(pedido.cantidadDeArticulos);
  const total = contenedor.querySelector('[data-js="total"]');
  if (total) total.textContent = formatoMoneda(pedido.total);
  return true;
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
