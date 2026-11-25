import { el, formatoMoneda } from './formato.js';

// Tarjeta de producto del catálogo. onAgregar(productoId) lo resuelve main.js.
export function TarjetaProducto(producto, { cantidadEnCarrito = 0, onAgregar }) {
  const idTitulo = `prod-${producto.id}`;
  const agotado = !producto.disponible;

  return el('li', { class: 'producto' },
    el('article', { class: `tarjeta${agotado ? ' tarjeta--agotada' : ''}`, 'aria-labelledby': idTitulo },
      el('p', { class: 'tarjeta__categoria' }, producto.categoria),
      el('h3', { id: idTitulo, class: 'tarjeta__nombre' }, producto.nombre),
      el('p', { class: 'tarjeta__descripcion' }, producto.descripcion),
      el('div', { class: 'tarjeta__pie' },
        el('p', { class: 'tarjeta__precio' }, formatoMoneda(producto.precio)),
        agotado
          ? el('p', { class: 'etiqueta etiqueta--agotado' }, 'Agotado')
          : el('button', {
              type: 'button',
              class: 'boton boton--primario',
              'aria-describedby': idTitulo,
              dataset: { productoId: producto.id },
              onclick: () => onAgregar(producto.id),
            }, 'Agregar')
      ),
      cantidadEnCarrito > 0
        ? el('p', { class: 'tarjeta__en-carrito' }, `En tu pedido: ${cantidadEnCarrito}`)
        : null
    )
  );
}
