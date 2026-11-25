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
const CLAVE_ESTADO = 'estado-v2';

// Guarda el pedido en borrador (carrito) y el historial de pedidos confirmados.
export class RepositorioPedidos {
  constructor(almacenamiento) {
    this.almacenamiento = almacenamiento;
  }
  #leerEstado() {
    const estado = this.almacenamiento.leer(CLAVE_ESTADO);
    if (estado) {
      if (estado.version !== 1 || !Array.isArray(estado.pedidos)) {
        throw new Error('Los datos guardados tienen un formato desconocido. Conserva una copia antes de restablecer el navegador.');
      }
      return estado;
    }
    // Migracion diferida: las claves v1 se conservan hasta guardar el nuevo estado.
    const pedidos = this.almacenamiento.leer(CLAVE_HISTORIAL) ?? [];
    if (!Array.isArray(pedidos)) throw new Error('El historial guardado no es válido. Conserva una copia antes de restablecerlo.');
    return { version: 1, carrito: this.almacenamiento.leer(CLAVE_CARRITO), pedidos };
  }
  #guardarEstado(estado) {
    // Un solo setItem publica carrito e historial juntos o no publica ninguno.
    this.almacenamiento.escribir(CLAVE_ESTADO, estado);
  }
  async obtenerCarrito() {
    const guardado = this.#leerEstado().carrito;
    if (!guardado) return new Pedido();
    try {
      return Pedido.desdeObjeto(guardado);
    } catch {
      throw new Error('El carrito guardado no es válido. Conserva una copia antes de restablecer el navegador.');
    }
  }
  async guardarCarrito(pedido) {
    this.#guardarEstado({ ...this.#leerEstado(), carrito: pedido.aObjeto() });
  }
  async vaciarCarrito() {
    this.#guardarEstado({ ...this.#leerEstado(), carrito: null });
  }
  async guardarConfirmado(pedido) {
    const estado = this.#leerEstado();
    this.#guardarEstado({ ...estado, pedidos: [pedido.aObjeto(), ...estado.pedidos].slice(0, 20) });
  }
  async confirmarCarrito(pedido) {
    const estado = this.#leerEstado();
    this.#guardarEstado({ version: 1, carrito: null, pedidos: [pedido.aObjeto(), ...estado.pedidos].slice(0, 20) });
  }
  async listarConfirmados() {
    const historial = this.#leerEstado().pedidos;
    return historial.map((p) => Pedido.desdeObjeto(p));
  }
}

