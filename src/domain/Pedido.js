import { ErrorDeDominio } from './errores.js';
import { DetallePedido, CANTIDAD_MAXIMA, redondear } from './DetallePedido.js';

export const ESTADO = Object.freeze({ BORRADOR: 'borrador', CONFIRMADO: 'confirmado' });

// Agregado raíz. Un pedido en borrador es el carrito; al confirmarlo queda inmutable.
// Cada operación devuelve un Pedido nuevo para que la presentación pueda comparar estados.
export class Pedido {
  constructor({ id, detalles = [], estado = ESTADO.BORRADOR, creadoEn, confirmadoEn = null } = {}) {
    this.id = id ?? generarId();
    this.detalles = detalles.map((d) => (d instanceof DetallePedido ? d : new DetallePedido(d)));
    this.estado = estado;
    this.creadoEn = creadoEn ?? new Date().toISOString();
    this.confirmadoEn = confirmadoEn;
  }

  get total() {
    return redondear(this.detalles.reduce((suma, d) => suma + d.subtotal, 0));
  }

  get cantidadDeArticulos() {
    return this.detalles.reduce((suma, d) => suma + d.cantidad, 0);
  }

  get estaVacio() {
    return this.detalles.length === 0;
  }

  buscarDetalle(productoId) {
    return this.detalles.find((d) => d.productoId === productoId) ?? null;
  }

  agregar(producto, cantidad = 1) {
    this.#exigirBorrador();
    if (!producto.disponible) {
      throw new ErrorDeDominio('PRODUCTO_AGOTADO', `"${producto.nombre}" no está disponible por ahora.`);
    }
    const existente = this.buscarDetalle(producto.id);
    if (existente) {
      const nueva = existente.cantidad + cantidad;
      if (nueva > CANTIDAD_MAXIMA) {
        throw new ErrorDeDominio(
          'CANTIDAD_FUERA_DE_RANGO',
          `Ya tienes ${existente.cantidad} de "${producto.nombre}". El máximo por producto es ${CANTIDAD_MAXIMA}.`
        );
      }
      return this.#conDetalles(
        this.detalles.map((d) => (d.productoId === producto.id ? d.conCantidad(nueva) : d))
      );
    }
    const detalle = new DetallePedido({
      productoId: producto.id,
      nombre: producto.nombre,
      precioUnitario: producto.precio,
      cantidad,
    });
    return this.#conDetalles([...this.detalles, detalle]);
  }

  cambiarCantidad(productoId, cantidad) {
    this.#exigirBorrador();
    this.#exigirDetalle(productoId);
    return this.#conDetalles(
      this.detalles.map((d) => (d.productoId === productoId ? d.conCantidad(cantidad) : d))
    );
  }

  // Devuelve el pedido sin la línea y la posición que tenía, para poder restaurarla.
  eliminar(productoId) {
    this.#exigirBorrador();
    const detalle = this.#exigirDetalle(productoId);
    const posicion = this.detalles.indexOf(detalle);
    const pedido = this.#conDetalles(this.detalles.filter((d) => d !== detalle));
    return { pedido, eliminado: { detalle, posicion } };
  }

  restaurar({ detalle, posicion }) {
    this.#exigirBorrador();
    if (this.buscarDetalle(detalle.productoId)) return this;
    const detalles = [...this.detalles];
    detalles.splice(Math.min(posicion, detalles.length), 0, detalle);
    return this.#conDetalles(detalles);
  }

  confirmar() {
    this.#exigirBorrador();
    if (this.estaVacio) {
      throw new ErrorDeDominio('PEDIDO_VACIO', 'Agrega al menos un producto antes de confirmar el pedido.');
    }
    return new Pedido({
      ...this.aObjeto(),
      estado: ESTADO.CONFIRMADO,
      confirmadoEn: new Date().toISOString(),
    });
  }

  aObjeto() {
    return {
      id: this.id,
      detalles: this.detalles.map((d) => d.aObjeto()),
      estado: this.estado,
      creadoEn: this.creadoEn,
      confirmadoEn: this.confirmadoEn,
    };
  }

  static desdeObjeto(obj) {
    return new Pedido(obj);
  }

  #conDetalles(detalles) {
    return new Pedido({ ...this.aObjeto(), detalles });
  }

  #exigirBorrador() {
    if (this.estado !== ESTADO.BORRADOR) {
      throw new ErrorDeDominio('PEDIDO_CONFIRMADO', 'Este pedido ya fue confirmado y no se puede modificar.');
    }
  }

  #exigirDetalle(productoId) {
    const detalle = this.buscarDetalle(productoId);
    if (!detalle) {
      throw new ErrorDeDominio('DETALLE_NO_ENCONTRADO', 'Ese producto ya no está en el carrito.');
    }
    return detalle;
  }
}

function generarId() {
  const aleatorio = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CU-${Date.now().toString(36).toUpperCase()}-${aleatorio}`;
}
