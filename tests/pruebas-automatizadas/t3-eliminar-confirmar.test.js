// T3: eliminar y recuperar un producto, cancelar y recuperar el pedido, confirmar.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { crearCasosDeUso } from '../../src/application/casosDeUso.js';
import { RepositorioProductosLocal, RepositorioPedidos } from '../../src/infrastructure/repositorios.js';
import { AlmacenamientoEnMemoria } from '../../src/infrastructure/almacenamiento.js';

let casos;
let repoPedidos;
beforeEach(async () => {
  repoPedidos = new RepositorioPedidos(new AlmacenamientoEnMemoria());
  casos = crearCasosDeUso({ repoProductos: new RepositorioProductosLocal(), repoPedidos });
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
  await casos.agregarAlCarrito.ejecutar('empanada-verde');
  await casos.agregarAlCarrito.ejecutar('agua');
});

test('eliminar y deshacer devuelve la línea a la misma posición', async () => {
  await casos.eliminarDelCarrito.ejecutar('empanada-verde');
  await casos.eliminarDelCarrito.deshacer();
  const carrito = await casos.obtenerCarrito.ejecutar();
  assert.equal(carrito.detalles[1].productoId, 'empanada-verde');
});

test('cancelar el pedido y deshacer recupera todas las líneas', async () => {
  const antes = await casos.obtenerCarrito.ejecutar();
  await casos.cancelarPedido.ejecutar();
  assert.equal((await casos.obtenerCarrito.ejecutar()).estaVacio, true);

  await casos.cancelarPedido.deshacer();
  const restaurado = await casos.obtenerCarrito.ejecutar();
  assert.deepEqual(
    restaurado.detalles.map((detalle) => detalle.productoId),
    antes.detalles.map((detalle) => detalle.productoId)
  );
});

test('no se puede confirmar un pedido vacío', async () => {
  await casos.cancelarPedido.ejecutar();
  await assert.rejects(casos.confirmarPedido.ejecutar(), { codigo: 'PEDIDO_VACIO' });
});

test('confirmar guarda el pedido en el historial y vacía el carrito', async () => {
  await casos.confirmarPedido.ejecutar();
  const confirmados = await repoPedidos.listarConfirmados();
  const carrito = await casos.obtenerCarrito.ejecutar();
  assert.equal(confirmados.length, 1);
  assert.equal(confirmados[0].estado, 'confirmado');
  assert.equal(carrito.estaVacio, true);
});
