// T1: buscar un producto (sin importar tildes ni mayúsculas) y agregarlo al pedido.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { crearCasosDeUso } from '../../src/application/casosDeUso.js';
import { RepositorioProductosLocal, RepositorioPedidos } from '../../src/infrastructure/repositorios.js';
import { AlmacenamientoEnMemoria } from '../../src/infrastructure/almacenamiento.js';

let casos;
beforeEach(() => {
  casos = crearCasosDeUso({
    repoProductos: new RepositorioProductosLocal(),
    repoPedidos: new RepositorioPedidos(new AlmacenamientoEnMemoria()),
  });
});

const nombres = (productos) => productos.map((p) => p.nombre);

test('"CAFE", "café" y "cafe leche" encuentran Café con leche', async () => {
  for (const consulta of ['CAFE', 'café', 'cafe leche']) {
    const resultado = await casos.buscarProductos.ejecutar({ consulta });
    assert.ok(nombres(resultado).includes('Café con leche'), `consulta: ${consulta}`);
  }
});

test('"sanduche" encuentra Sánduche mixto', async () => {
  const resultado = await casos.buscarProductos.ejecutar({ consulta: 'sanduche' });
  assert.ok(nombres(resultado).includes('Sánduche mixto'));
});

test('agregar un producto deja cantidad 1 en el carrito', async () => {
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
  const carrito = await casos.obtenerCarrito.ejecutar();
  assert.equal(carrito.buscarDetalle('cafe-con-leche').cantidad, 1);
});

test('agregar el mismo producto dos veces suma la cantidad', async () => {
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
  const carrito = await casos.obtenerCarrito.ejecutar();
  assert.equal(carrito.buscarDetalle('cafe-con-leche').cantidad, 2);
});

test('un producto agotado no se puede agregar', async () => {
  await assert.rejects(casos.agregarAlCarrito.ejecutar('cheesecake'), {
    codigo: 'PRODUCTO_AGOTADO',
  });
});
