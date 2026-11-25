// T2: modificar la cantidad y verificar el total.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { crearCasosDeUso } from '../../src/application/casosDeUso.js';
import { RepositorioProductosLocal, RepositorioPedidos } from '../../src/infrastructure/repositorios.js';
import { AlmacenamientoEnMemoria } from '../../src/infrastructure/almacenamiento.js';

let casos;
beforeEach(async () => {
  casos = crearCasosDeUso({
    repoProductos: new RepositorioProductosLocal(),
    repoPedidos: new RepositorioPedidos(new AlmacenamientoEnMemoria()),
  });
  await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
});

test('cambiar a 3 cafés con leche deja el total en 3,00', async () => {
  await casos.cambiarCantidad.ejecutar('cafe-con-leche', 3);
  const carrito = await casos.obtenerCarrito.ejecutar();
  assert.equal(carrito.total, 3);
});

test('con 3 cafés con leche y 1 sánduche mixto el total es 4,75', async () => {
  await casos.cambiarCantidad.ejecutar('cafe-con-leche', 3);
  await casos.agregarAlCarrito.ejecutar('sanduche-mixto');
  const carrito = await casos.obtenerCarrito.ejecutar();
  assert.equal(carrito.total, 4.75);
});

for (const invalida of [0, 21, 2.5]) {
  test(`la cantidad ${invalida} se rechaza y el carrito no cambia`, async () => {
    const codigo = Number.isInteger(invalida) ? 'CANTIDAD_FUERA_DE_RANGO' : 'CANTIDAD_NO_ENTERA';
    await assert.rejects(casos.cambiarCantidad.ejecutar('cafe-con-leche', invalida), { codigo });

    const carrito = await casos.obtenerCarrito.ejecutar();
    assert.equal(carrito.buscarDetalle('cafe-con-leche').cantidad, 1);
    assert.equal(carrito.total, 1);
  });
}
