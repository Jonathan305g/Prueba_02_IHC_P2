import { ErrorDeDominio } from './errores.js';
import { normalizarTexto } from './texto.js';

export class Producto {
  constructor({ id, nombre, descripcion = '', categoria, precio, disponible = true }) {
    if (!id) throw new ErrorDeDominio('PRODUCTO_SIN_ID', 'El producto necesita un identificador.');
    if (!nombre) throw new ErrorDeDominio('PRODUCTO_SIN_NOMBRE', 'El producto necesita un nombre.');
    if (!Number.isFinite(precio) || precio < 0) {
      throw new ErrorDeDominio('PRECIO_INVALIDO', `El precio de "${nombre}" no es válido.`);
    }
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.precio = precio;
    this.disponible = disponible;
    Object.freeze(this);
  }

  // Coincide si cada palabra de la consulta aparece en el nombre, la descripción o la categoría,
  // sin importar tildes ni mayúsculas.
  coincideCon(consulta) {
    const palabras = normalizarTexto(consulta).split(' ').filter(Boolean);
    if (palabras.length === 0) return true;
    const texto = normalizarTexto(`${this.nombre} ${this.descripcion} ${this.categoria}`);
    return palabras.every((p) => texto.includes(p));
  }
}
