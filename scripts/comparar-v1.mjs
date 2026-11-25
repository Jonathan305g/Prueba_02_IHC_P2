import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('..', import.meta.url));
const argumento = process.argv[2];
if (!argumento) {
  console.error('Uso: npm run comparar:v1 -- ../CafeU_V1');
  process.exit(1);
}
const base = path.resolve(argumento);
if (base === path.resolve(root)) throw new Error('La base V1 debe estar en otra carpeta.');
const identidad = JSON.parse(await fs.readFile(path.join(root, 'docs/base-v1.json'), 'utf8'));
for (const archivo of identidad.archivos) {
  const bytes = await fs.readFile(path.join(base, archivo.ruta));
  const sha = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(sha, archivo.git_blob_sha, `La copia V1 difiere en ${archivo.ruta}`);
}

async function escenario(carpeta) {
  const cargar = (ruta) => import(pathToFileURL(path.join(carpeta, ruta)).href);
  const [{ crearCasosDeUso }, { RepositorioProductosLocal, RepositorioPedidos }, { AlmacenamientoLocal }] = await Promise.all([
    cargar('src/application/casosDeUso.js'),
    cargar('src/infrastructure/repositorios.js'),
    cargar('src/infrastructure/almacenamiento.js'),
  ]);
  const datos = new Map();
  let bloquear = false;
  const storage = {
    getItem: (clave) => datos.get(clave) ?? null,
    setItem(clave, valor) {
      if (bloquear) throw new Error('Cuota de escritura agotada para esta prueba tecnica');
      datos.set(clave, valor);
    },
    removeItem: (clave) => datos.delete(clave),
  };
  const anterior = globalThis.window;
  globalThis.window = { localStorage: storage };
  try {
    const repoPedidos = new RepositorioPedidos(new AlmacenamientoLocal('cafeu', storage));
    const casos = crearCasosDeUso({ repoProductos: new RepositorioProductosLocal(), repoPedidos });
    const coincidencias = await casos.buscarProductos.ejecutar({ consulta: 'expreso' });
    await casos.agregarAlCarrito.ejecutar('cafe-con-leche');
    bloquear = true;
    const salida = { cantidad_informada: null, cantidad_guardada: null, error_cambio: null, confirmacion_informada: null, error_confirmacion: null };
    try {
      const carrito = await casos.cambiarCantidad.ejecutar('cafe-con-leche', 3);
      salida.cantidad_informada = carrito.buscarDetalle('cafe-con-leche').cantidad;
    } catch (error) { salida.error_cambio = error.codigo ?? error.message; }
    salida.cantidad_guardada = (await repoPedidos.obtenerCarrito()).buscarDetalle('cafe-con-leche').cantidad;
    try {
      const confirmado = await casos.confirmarPedido.ejecutar();
      salida.confirmacion_informada = confirmado.estado;
    } catch (error) { salida.error_confirmacion = error.codigo ?? error.message; }
    salida.historial = (await repoPedidos.listarConfirmados()).length;
    salida.carrito_vacio = (await repoPedidos.obtenerCarrito()).estaVacio;
    salida.busqueda_expreso = coincidencias.map((producto) => producto.nombre);
    return salida;
  } finally {
    if (anterior === undefined) delete globalThis.window;
    else globalThis.window = anterior;
  }
}
const antes = await escenario(base);
const despues = await escenario(root);
assert.equal(antes.cantidad_informada, 3);
assert.equal(antes.cantidad_guardada, 1);
assert.equal(antes.carrito_vacio, true);
assert.equal(despues.error_cambio, 'ALMACENAMIENTO_NO_DISPONIBLE');
assert.equal(despues.error_confirmacion, 'ALMACENAMIENTO_NO_DISPONIBLE');
assert.equal(despues.cantidad_guardada, 1);
assert.equal(despues.carrito_vacio, false);
assert.equal(despues.historial, 0);
assert.deepEqual(antes.busqueda_expreso, []);
assert.deepEqual(despues.busqueda_expreso, ['Capuchino']);
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
const resultado = {
  base_commit: identidad.commit,
  version_actual: pkg.version,
  archivos_v1_verificados: identidad.archivos.length,
  tipo: 'Prueba tecnica en Node con almacenamiento que rechaza escrituras. No es una sesion de participante.',
  antes, despues,
};
await fs.writeFile(path.join(root, 'evidencias/verificacion/persistencia-antes-despues.json'), JSON.stringify(resultado, null, 2) + '\n');
console.log('V1 verificada: 66 archivos. Persistencia y busqueda comparadas: resultado esperado.');
