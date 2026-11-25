import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AlmacenamientoLocal, AlmacenamientoEnMemoria } from '../../src/infrastructure/almacenamiento.js';
import { RepositorioPedidos, RepositorioProductosLocal } from '../../src/infrastructure/repositorios.js';
import { crearCasosDeUso } from '../../src/application/casosDeUso.js';

function contexto() {
  const valores = new Map();
  const storage = {
    bloqueado: false,
    getItem: (clave) => valores.get(clave) ?? null,
    setItem(clave, valor) {
      if (this.bloqueado) throw new Error('QuotaExceededError');
      valores.set(clave, valor);
    },
    removeItem: (clave) => valores.delete(clave),
  };
  const adaptador = new AlmacenamientoLocal('cafeu', storage);
  const repo = new RepositorioPedidos(adaptador);
  const casos = crearCasosDeUso({ repoProductos: new RepositorioProductosLocal(), repoPedidos: repo });
  return { valores, storage, adaptador, repo, casos };
}

test('una escritura bloqueada no informa un cambio ni pierde el carrito guardado', async () => {
  const { storage, casos } = contexto();
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
  storage.bloqueado = true;
  await assert.rejects(casos.cambiarCantidad.ejecutar('cafe-con-leche', 3), { codigo: 'ALMACENAMIENTO_NO_DISPONIBLE' });
  const carrito = await casos.obtenerCarrito.ejecutar();
  assert.equal(carrito.total, 1);
  assert.equal(carrito.detalles[0].cantidad, 1);
});

test('una confirmacion fallida conserva carrito e historial y permite reintentar una sola vez', async () => {
  const { storage, valores, casos, repo } = contexto();
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
  const antes = valores.get('cafeu:estado-v2');
  storage.bloqueado = true;
  await assert.rejects(casos.confirmarPedido.ejecutar(), { codigo: 'ALMACENAMIENTO_NO_DISPONIBLE' });
  assert.equal(valores.get('cafeu:estado-v2'), antes);
  assert.equal((await repo.listarConfirmados()).length, 0);
  assert.equal((await casos.obtenerCarrito.ejecutar()).total, 1);
  storage.bloqueado = false;
  await casos.confirmarPedido.ejecutar();
  const recargado = new RepositorioPedidos(new AlmacenamientoLocal('cafeu', storage));
  assert.equal((await recargado.obtenerCarrito()).estaVacio, true);
  assert.equal((await recargado.listarConfirmados()).length, 1);
  await assert.rejects(casos.confirmarPedido.ejecutar(), { codigo: 'PEDIDO_VACIO' });
});

test('migrar un carrito v1 conserva su identificador, productos e historial', async () => {
  const { adaptador, valores, storage, casos } = contexto();
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche', 3);
  const base = JSON.parse(valores.get('cafeu:estado-v2'));
  const confirmado = (await casos.obtenerCarrito.ejecutar()).confirmar().aObjeto();
  valores.delete('cafeu:estado-v2');
  adaptador.escribir('carrito', base.carrito);
  adaptador.escribir('pedidos', [confirmado]);
  const repo = new RepositorioPedidos(new AlmacenamientoLocal('cafeu', storage));
  const carrito = await repo.obtenerCarrito();
  assert.equal(carrito.id, base.carrito.id);
  assert.equal(carrito.total, 3);
  await repo.guardarCarrito(carrito.cambiarCantidad('cafe-con-leche', 2));
  assert.equal((await repo.listarConfirmados())[0].id, confirmado.id);
  assert.equal((await repo.obtenerCarrito()).total, 2);
  assert.ok(valores.has('cafeu:carrito'));
});

test('una cancelacion fallida no habilita deshacer ni vacia el carrito', async () => {
  const { storage, casos } = contexto();
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
  storage.bloqueado = true;
  await assert.rejects(casos.cancelarPedido.ejecutar());
  assert.equal(casos.cancelarPedido.anterior, null);
  assert.equal((await casos.obtenerCarrito.ejecutar()).total, 1);
});

test('un intento fallido de deshacer conserva la recuperacion para reintentar', async () => {
  const { storage, casos } = contexto();
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
  await casos.eliminarDelCarrito.ejecutar('cafe-con-leche');
  storage.bloqueado = true;
  await assert.rejects(casos.eliminarDelCarrito.deshacer());
  assert.ok(casos.eliminarDelCarrito.ultimoEliminado);
  storage.bloqueado = false;
  assert.equal((await casos.eliminarDelCarrito.deshacer()).total, 1);
});

test('un JSON danado se informa y no se sobrescribe silenciosamente', () => {
  const { valores, adaptador } = contexto();
  valores.set('cafeu:estado-v2', '{');
  assert.throws(() => adaptador.leer('estado-v2'), { codigo: 'ALMACENAMIENTO_NO_DISPONIBLE' });
  assert.equal(valores.get('cafeu:estado-v2'), '{');
});

test('la memoria conserva datos durante la sesion y declara su modo', () => {
  const memoria = new AlmacenamientoEnMemoria();
  memoria.escribir('carrito', { cantidad: 3 });
  assert.deepEqual(memoria.leer('carrito'), { cantidad: 3 });
  assert.equal(memoria.modo, 'memoria');
  assert.equal(new AlmacenamientoEnMemoria().leer('carrito'), null);
});

test('expreso y expresso encuentran Capuchino sin alterar filtros ni precios', async () => {
  const { casos } = contexto();
  for (const consulta of ['expreso', 'EXPRESSO', 'espresso']) {
    const encontrados = await casos.buscarProductos.ejecutar({ consulta });
    assert.equal(encontrados.some((p) => p.id === 'capuchino' && p.precio === 1.5), true);
    assert.equal((await casos.buscarProductos.ejecutar({ consulta, categoria: 'Snacks' })).length, 0);
  }
});
