import { crearCasosDeUso } from '../application/casosDeUso.js';
import { RepositorioProductosLocal, RepositorioPedidos } from '../infrastructure/repositorios.js';
import { crearAlmacenamiento } from '../infrastructure/almacenamiento.js';
import { el, formatoMoneda } from './components/formato.js';
import { TarjetaProducto } from './components/TarjetaProducto.js';
import { Carrito, ResumenPedido, actualizarCarritoEnSitio } from './components/Carrito.js';
import { crearAvisos } from './components/Avisos.js';

// Composition root: aquí se conectan las capas. Para usar una API, solo cambia esta línea.
const almacenamiento = crearAlmacenamiento();
const casos = crearCasosDeUso({
  repoProductos: new RepositorioProductosLocal(),
  repoPedidos: new RepositorioPedidos(almacenamiento),
});

const $ = (nombre) => document.querySelector(`[data-js="${nombre}"]`);
const ui = {
  buscador: $('buscador'),
  consulta: document.getElementById('consulta'),
  limpiar: $('limpiar-busqueda'),
  categorias: $('categorias'),
  resumenBusqueda: $('resumen-busqueda'),
  productos: $('productos'),
  carrito: $('carrito'),
  carritoContenido: $('carrito-contenido'),
  insignia: $('insignia'),
  insigniaTexto: $('insignia-texto'),
  barraMovil: $('barra-movil'),
  barraTotal: $('barra-total'),
  dialogo: $('dialogo-confirmar'),
  dialogoResumen: $('dialogo-resumen'),
  exito: $('exito'),
  exitoContenido: $('exito-contenido'),
  nuevoPedido: $('nuevo-pedido'),
  recuperacion: $('recuperacion'),
  dialogoCancelar: $('dialogo-cancelar'),
};
const avisos = crearAvisos($('avisos'));

const estado = { consulta: '', categoria: 'todas', carrito: null, recuperacion: null };
let cola = Promise.resolve();
// Serializa las mutaciones para conservar todos los clics y evitar escrituras concurrentes.
function enSerie(accion) {
  return (...args) => {
    const tarea = cola.then(() => accion(...args));
    cola = tarea.catch(() => {});
    return tarea;
  };
}
function olvidarRecuperacion() {
  casos.eliminarDelCarrito.olvidar();
  casos.cancelarPedido.olvidar();
  estado.recuperacion = null;
  pintarRecuperacion();
}
function pintarRecuperacion() {
  ui.recuperacion.hidden = !estado.recuperacion;
  if (!estado.recuperacion) { ui.recuperacion.replaceChildren(); return; }
  ui.recuperacion.replaceChildren(
    el('p', { role: 'status' }, estado.recuperacion.texto),
    el('p', { class: 'ayuda' }, 'Disponible hasta modificar o confirmar el pedido, recargar la página o descartar esta opción.'),
    el('button', { type: 'button', class: 'boton boton--secundario', 'data-js': 'deshacer', onclick: enSerie(deshacer) }, 'Deshacer'),
    el('button', { type: 'button', class: 'boton boton--secundario', onclick: () => { olvidarRecuperacion(); document.getElementById('carrito-titulo').focus(); } }, 'Descartar opción')
  );
}

// ---------- Catálogo y búsqueda ----------

async function pintarCategorias() {
  const categorias = ['todas', ...(await casos.buscarProductos.categorias())];
  ui.categorias.replaceChildren(
    ...categorias.map((c) => {
      const id = `cat-${c.replace(/\s+/g, '-').toLowerCase()}`;
      return el('div', { class: 'chip' },
        el('input', {
          type: 'radio', name: 'categoria', id, value: c,
          checked: c === estado.categoria,
          onchange: () => { estado.categoria = c; pintarCatalogo(); },
        }),
        el('label', { for: id }, c === 'todas' ? 'Todas' : c)
      );
    })
  );
}

async function pintarCatalogo() {
  const productos = await casos.buscarProductos.ejecutar(estado);
  const cantidades = new Map(estado.carrito.detalles.map((d) => [d.productoId, d.cantidad]));

  ui.productos.replaceChildren(
    ...productos.map((p) =>
      TarjetaProducto(p, { cantidadEnCarrito: cantidades.get(p.id) ?? 0, onAgregar: enSerie(agregar) })
    )
  );

  if (productos.length === 0) {
    ui.resumenBusqueda.textContent =
      `No hay productos que coincidan con “${estado.consulta}”. Revisa la palabra o elige “Todas” en categoría.`;
  } else if (estado.consulta) {
    ui.resumenBusqueda.textContent =
      `${productos.length} ${productos.length === 1 ? 'resultado' : 'resultados'} para “${estado.consulta}”.`;
  } else {
    ui.resumenBusqueda.textContent = '';
  }
}

let esperaBusqueda;
ui.consulta.addEventListener('input', () => {
  clearTimeout(esperaBusqueda);
  esperaBusqueda = setTimeout(() => {
    estado.consulta = ui.consulta.value;
    pintarCatalogo();
  }, 200);
});
ui.buscador.addEventListener('submit', (e) => {
  e.preventDefault();
  estado.consulta = ui.consulta.value;
  pintarCatalogo();
});
ui.limpiar.addEventListener('click', () => {
  ui.consulta.value = '';
  estado.consulta = '';
  pintarCatalogo();
  ui.consulta.focus();
});

// ---------- Carrito ----------

function pintarCarrito({ enfocar } = {}) {
  const pedido = estado.carrito;
  const actualizado = actualizarCarritoEnSitio(ui.carritoContenido, pedido);
  if (!actualizado) {
    ui.carritoContenido.replaceChildren(
      Carrito(pedido, {
        onCambiarCantidad: enSerie(cambiarCantidad),
        onEliminar: enSerie(eliminar),
        onConfirmar: enSerie(abrirConfirmacion),
        onCancelar: enSerie(abrirCancelacion),
      })
    );
  }
  const articulos = pedido.cantidadDeArticulos;
  ui.insignia.textContent = String(articulos);
  ui.insigniaTexto.textContent = articulos === 1 ? 'producto' : 'productos';
  ui.barraTotal.textContent = formatoMoneda(pedido.total);
  ui.barraMovil.hidden = pedido.estaVacio;

  if (enfocar && !actualizado) {
    const objetivo = ui.carritoContenido.querySelector(enfocar);
    (objetivo ?? document.getElementById('carrito-titulo')).focus();
  }
}

async function agregar(productoId) {
  try {
    const { carrito, producto } = await casos.agregarAlCarrito.ejecutar(productoId);
    olvidarRecuperacion();
    estado.carrito = carrito;
    pintarCarrito();
    await pintarCatalogo();
    const cantidad = carrito.buscarDetalle(productoId).cantidad;
    avisos.mostrar(`Agregaste ${producto.nombre}. Llevas ${cantidad} en tu pedido. Total: ${formatoMoneda(carrito.total)}.`, { tipo: 'exito' });
    // El foco vuelve al botón del producto para seguir agregando sin perder la posición.
    ui.productos.querySelector(`[data-producto-id="${productoId}"]`)?.focus();
  } catch (e) {
    avisos.mostrar(e.message, { tipo: 'error' });
  }
}

async function cambiarCantidad(productoId, cantidad) {
  estado.carrito = await casos.cambiarCantidad.ejecutar(productoId, cantidad); // si falla, lo muestra SelectorCantidad
  olvidarRecuperacion();
  pintarCarrito({ enfocar: `#cant-${CSS.escape(productoId)}` });
  await pintarCatalogo();
  const d = estado.carrito.buscarDetalle(productoId);
  avisos.mostrar(`${d.nombre}: ${d.cantidad}. Nuevo total: ${formatoMoneda(estado.carrito.total)}.`);
}

async function eliminar(productoId) {
  const lineas = [...ui.carritoContenido.querySelectorAll('.linea')];
  const indice = lineas.findIndex((l) => l.dataset.productoId === productoId);
  try {
    const { carrito, eliminado } = await casos.eliminarDelCarrito.ejecutar(productoId);
    casos.cancelarPedido.olvidar();
    estado.carrito = carrito;
    estado.recuperacion = { tipo: 'linea', texto: `Quitaste ${eliminado.nombre} del pedido.` };
    pintarRecuperacion();
    // Foco a la siguiente línea (o al título si el carrito quedó vacío).
    const siguiente = carrito.detalles[Math.min(indice, carrito.detalles.length - 1)];
    pintarCarrito({ enfocar: siguiente ? `#cant-${CSS.escape(siguiente.productoId)}` : null });
    if (!siguiente) document.getElementById('carrito-titulo').focus();
    await pintarCatalogo();
    avisos.cerrar();
    $('deshacer').focus();
  } catch (e) {
    avisos.mostrar(e.message, { tipo: 'error' });
  }
}

async function deshacer() {
  try {
    const restaurado = estado.recuperacion?.tipo === 'linea'
      ? await casos.eliminarDelCarrito.deshacer()
      : await casos.cancelarPedido.deshacer();
    if (!restaurado) return;
    estado.carrito = restaurado;
    olvidarRecuperacion();
    pintarCarrito({ enfocar: '.linea .cantidad__campo' });
    await pintarCatalogo();
    avisos.mostrar('Se recuperó tu pedido.', { tipo: 'exito' });
  } catch (e) {
    avisos.mostrar(e.message, { tipo: 'error' });
  }
}

function abrirCancelacion() {
  if (estado.carrito.estaVacio) return;
  ui.dialogoCancelar.returnValue = '';
  ui.dialogoCancelar.showModal();
}
ui.dialogoCancelar.addEventListener('close', enSerie(async () => {
  if (ui.dialogoCancelar.returnValue === 'vaciar') await cancelarPedido();
  else document.querySelector('.boton--cancelar')?.focus();
}));

async function cancelarPedido() {
  try {
  const { carrito, cancelado } = await casos.cancelarPedido.ejecutar();
  if (!cancelado) return;
  casos.eliminarDelCarrito.olvidar();
  estado.carrito = carrito;
  estado.recuperacion = { tipo: 'pedido', texto: `Quitaste los ${cancelado.cantidadDeArticulos} artículos de tu pedido.` };
  pintarRecuperacion();
  pintarCarrito({ enfocar: null });
  document.getElementById('carrito-titulo').focus();
  await pintarCatalogo();
  avisos.cerrar();
  $('deshacer').focus();
  } catch (e) {
    avisos.mostrar(e.message, { tipo: 'error' });
  }
}

// ---------- Confirmación ----------

function abrirConfirmacion() {
  if (estado.carrito.estaVacio) return;
  ui.dialogoResumen.replaceChildren(ResumenPedido(estado.carrito));
  ui.dialogo.returnValue = '';
  ui.dialogo.showModal();
}

ui.dialogo.addEventListener('close', enSerie(async () => {
  if (ui.dialogo.returnValue !== 'confirmar') {
    document.querySelector('.carrito .boton--ancho')?.focus();
    return;
  }
  try {
    const confirmado = await casos.confirmarPedido.ejecutar();
    olvidarRecuperacion();
    estado.carrito = await casos.obtenerCarrito.ejecutar();
    mostrarExito(confirmado);
  } catch (e) {
    avisos.mostrar(e.message, { tipo: 'error' });
  }
}));

function mostrarExito(pedido) {
  avisos.cerrar();
  ui.exitoContenido.replaceChildren(
    el('p', {}, 'Tu número de pedido es ', el('strong', { class: 'codigo' }, pedido.id), '.'),
    el('p', { class: 'ayuda' }, 'Muéstralo en caja para pagar y retirar tu pedido.'),
    ResumenPedido(pedido)
  );
  document.querySelector('.catalogo').hidden = true;
  ui.carrito.hidden = true;
  ui.barraMovil.hidden = true;
  ui.exito.hidden = false;
  document.getElementById('exito-titulo').focus();
}

ui.nuevoPedido.addEventListener('click', async () => {
  ui.exito.hidden = true;
  document.querySelector('.catalogo').hidden = false;
  ui.carrito.hidden = false;
  pintarCarrito();
  await pintarCatalogo();
  ui.consulta.focus();
});

// ---------- Inicio ----------

async function iniciar() {
  $('modo-memoria').hidden = almacenamiento.modo !== 'memoria';
  estado.carrito = await casos.obtenerCarrito.ejecutar();
  await pintarCategorias();
  await pintarCatalogo();
  pintarCarrito();
}

iniciar().catch((e) => avisos.mostrar(e.message, { tipo: 'error', duracion: 0 }));

