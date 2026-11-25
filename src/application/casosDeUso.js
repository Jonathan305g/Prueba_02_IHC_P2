// Capa de aplicación: un caso de uso por acción del usuario.
// Orquesta dominio + repositorios. No conoce el DOM ni localStorage.

export class BuscarProductos {
  constructor(repoProductos) {
    this.repoProductos = repoProductos;
  }
  async ejecutar({ consulta = '', categoria = 'todas' } = {}) {
    const productos = await this.repoProductos.listar();
    return productos
      .filter((p) => categoria === 'todas' || p.categoria === categoria)
      .filter((p) => p.coincideCon(consulta));
  }
  async categorias() {
    const productos = await this.repoProductos.listar();
    return [...new Set(productos.map((p) => p.categoria))];
  }
}

export class ObtenerCarrito {
  constructor(repoPedidos) {
    this.repoPedidos = repoPedidos;
  }
  async ejecutar() {
    return this.repoPedidos.obtenerCarrito();
  }
}

export class AgregarAlCarrito {
  constructor(repoProductos, repoPedidos) {
    this.repoProductos = repoProductos;
    this.repoPedidos = repoPedidos;
  }
  async ejecutar(productoId, cantidad = 1) {
    const producto = await this.repoProductos.buscarPorId(productoId);
    if (!producto) throw new Error(`No existe el producto ${productoId}`);
    const carrito = await this.repoPedidos.obtenerCarrito();
    const actualizado = carrito.agregar(producto, cantidad);
    await this.repoPedidos.guardarCarrito(actualizado);
    return { carrito: actualizado, producto };
  }
}

export class CambiarCantidad {
  constructor(repoPedidos) {
    this.repoPedidos = repoPedidos;
  }
  async ejecutar(productoId, cantidad) {
    const carrito = await this.repoPedidos.obtenerCarrito();
    const actualizado = carrito.cambiarCantidad(productoId, cantidad);
    await this.repoPedidos.guardarCarrito(actualizado);
    return actualizado;
  }
}

// Eliminar guarda la última línea quitada para poder deshacer (recuperación de errores).
export class EliminarDelCarrito {
  constructor(repoPedidos) {
    this.repoPedidos = repoPedidos;
    this.ultimoEliminado = null;
  }
  async ejecutar(productoId) {
    const carrito = await this.repoPedidos.obtenerCarrito();
    const { pedido, eliminado } = carrito.eliminar(productoId);
    await this.repoPedidos.guardarCarrito(pedido);
    this.ultimoEliminado = eliminado;
    return { carrito: pedido, eliminado: eliminado.detalle };
  }
  async deshacer() {
    if (!this.ultimoEliminado) return null;
    const carrito = await this.repoPedidos.obtenerCarrito();
    const restaurado = carrito.restaurar(this.ultimoEliminado);
    await this.repoPedidos.guardarCarrito(restaurado);
    this.ultimoEliminado = null;
    return restaurado;
  }
  olvidar() {
    this.ultimoEliminado = null;
  }
}

// Cancelar vacía el carrito completo; se puede deshacer mientras no se agregue otra cosa.
export class CancelarPedido {
  constructor(repoPedidos) {
    this.repoPedidos = repoPedidos;
    this.anterior = null;
  }
  async ejecutar() {
    const carrito = await this.repoPedidos.obtenerCarrito();
    if (carrito.estaVacio) return { carrito, cancelado: null };
    await this.repoPedidos.vaciarCarrito();
    this.anterior = carrito;
    return { carrito: await this.repoPedidos.obtenerCarrito(), cancelado: carrito };
  }
  async deshacer() {
    if (!this.anterior) return null;
    await this.repoPedidos.guardarCarrito(this.anterior);
    const restaurado = this.anterior;
    this.anterior = null;
    return restaurado;
  }
  olvidar() {
    this.anterior = null;
  }
}

export class ConfirmarPedido {
  constructor(repoPedidos) {
    this.repoPedidos = repoPedidos;
  }
  async ejecutar() {
    const carrito = await this.repoPedidos.obtenerCarrito();
    const confirmado = carrito.confirmar();
    await this.repoPedidos.confirmarCarrito(confirmado);
    return confirmado;
  }
}

// Punto único de creación de los casos de uso (composition root).
export function crearCasosDeUso({ repoProductos, repoPedidos }) {
  return {
    buscarProductos: new BuscarProductos(repoProductos),
    obtenerCarrito: new ObtenerCarrito(repoPedidos),
    agregarAlCarrito: new AgregarAlCarrito(repoProductos, repoPedidos),
    cambiarCantidad: new CambiarCantidad(repoPedidos),
    eliminarDelCarrito: new EliminarDelCarrito(repoPedidos),
    cancelarPedido: new CancelarPedido(repoPedidos),
    confirmarPedido: new ConfirmarPedido(repoPedidos),
  };
}

