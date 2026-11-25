// Prueba de humo: confirma que las capas se conectan.
// Las pruebas funcionales críticas (T1, T2, T3) van en archivos aparte dentro de esta carpeta.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearCasosDeUso } from '../../src/application/casosDeUso.js';
import { RepositorioProductosLocal, RepositorioPedidos } from '../../src/infrastructure/repositorios.js';
import { AlmacenamientoEnMemoria } from '../../src/infrastructure/almacenamiento.js';

test('la app arranca con catálogo cargado y carrito vacío', async () => {
  const casos = crearCasosDeUso({
    repoProductos: new RepositorioProductosLocal(),
    repoPedidos: new RepositorioPedidos(new AlmacenamientoEnMemoria()),
  });
  const productos = await casos.buscarProductos.ejecutar();
  const carrito = await casos.obtenerCarrito.ejecutar();
  assert.ok(productos.length > 0);
  assert.equal(carrito.estaVacio, true);
});
