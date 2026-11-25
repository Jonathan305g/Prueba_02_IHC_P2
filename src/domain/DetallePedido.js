import { ErrorDeDominio } from './errores.js';

export const CANTIDAD_MINIMA = 1;
export const CANTIDAD_MAXIMA = 20;

export function validarCantidad(cantidad) {
  if (!Number.isInteger(cantidad)) {
    throw new ErrorDeDominio('CANTIDAD_NO_ENTERA', 'La cantidad debe ser un número entero.');
  }
  if (cantidad < CANTIDAD_MINIMA || cantidad > CANTIDAD_MAXIMA) {
    throw new ErrorDeDominio(
      'CANTIDAD_FUERA_DE_RANGO',
      `La cantidad debe estar entre ${CANTIDAD_MINIMA} y ${CANTIDAD_MAXIMA}.`
    );
  }
}

// Línea del pedido. Guarda una copia del nombre y precio para que el pedido
// confirmado no cambie si luego se modifica el catálogo.
export class DetallePedido {
  constructor({ productoId, nombre, precioUnitario, cantidad }) {
    validarCantidad(cantidad);
    this.productoId = productoId;
    this.nombre = nombre;
    this.precioUnitario = precioUnitario;
    this.cantidad = cantidad;
  }

  get subtotal() {
    return redondear(this.precioUnitario * this.cantidad);
  }

  conCantidad(cantidad) {
    return new DetallePedido({ ...this.aObjeto(), cantidad });
  }

  aObjeto() {
    return {
      productoId: this.productoId,
      nombre: this.nombre,
      precioUnitario: this.precioUnitario,
      cantidad: this.cantidad,
    };
  }
}

export function redondear(valor) {
  return Math.round(valor * 100) / 100;
}
