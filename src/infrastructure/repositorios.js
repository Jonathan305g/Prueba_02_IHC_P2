import { Producto } from '../domain/Producto.js';
import { Pedido } from '../domain/Pedido.js';
import { PRODUCTOS_SEMILLA } from './data/productos.js';

// Repositorio de productos de solo lectura.
export class RepositorioProductosLocal {
  #productos;
  constructor(semilla = PRODUCTOS_SEMILLA) {
    this.#productos = semilla.map((p) => new Producto(p));
  }
  async listar() {
    return [...this.#productos];
  }
  async buscarPorId(id) {
    return this.#productos.find((p) => p.id === id) ?? null;
  }
}

const CLAVE_CARRITO = 'carrito';
const CLAVE_HISTORIAL = 'pedidos';

// Guarda el pedido en borrador (carrito) y el historial de pedidos confirmados.
export class RepositorioPedidos {
  constructor(almacenamiento) {
    this.almacenamiento = almacenamiento;
  }
  async obtenerCarrito() {
    const guardado = this.almacenamiento.leer(CLAVE_CARRITO);
    if (!guardado) return new Pedido();
    try {
      return Pedido.desdeObjeto(guardado);
    } catch {
      // Datos dañados o de una versión anterior: se empieza con un carrito vacío.
      this.almacenamiento.borrar(CLAVE_CARRITO);
      return new Pedido();
    }
  }
  async guardarCarrito(pedido) {
    this.almacenamiento.escribir(CLAVE_CARRITO, pedido.aObjeto());
  }
  async vaciarCarrito() {
    this.almacenamiento.borrar(CLAVE_CARRITO);
  }
  async guardarConfirmado(pedido) {
    const historial = this.almacenamiento.leer(CLAVE_HISTORIAL) ?? [];
    historial.unshift(pedido.aObjeto());
    this.almacenamiento.escribir(CLAVE_HISTORIAL, historial.slice(0, 20));
  }
  async listarConfirmados() {
    const historial = this.almacenamiento.leer(CLAVE_HISTORIAL) ?? [];
    return historial.map((p) => Pedido.desdeObjeto(p));
  }
}
