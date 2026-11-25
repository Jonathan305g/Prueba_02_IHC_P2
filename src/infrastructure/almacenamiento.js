// Adaptadores de almacenamiento clave/valor con la misma interfaz.
// Los repositorios dependen de esta interfaz y no de window.localStorage directamente,
// así las pruebas automatizadas usan la versión en memoria.

export class AlmacenamientoEnMemoria {
  #datos = new Map();
  leer(clave) {
    return this.#datos.has(clave) ? structuredClone(this.#datos.get(clave)) : null;
  }
  escribir(clave, valor) {
    this.#datos.set(clave, structuredClone(valor));
  }
  borrar(clave) {
    this.#datos.delete(clave);
  }
}

export class AlmacenamientoLocal {
  constructor(prefijo = 'cafeu') {
    this.prefijo = prefijo;
  }
  leer(clave) {
    try {
      const texto = window.localStorage.getItem(`${this.prefijo}:${clave}`);
      return texto ? JSON.parse(texto) : null;
    } catch {
      return null; // navegación privada, almacenamiento bloqueado o JSON dañado
    }
  }
  escribir(clave, valor) {
    try {
      window.localStorage.setItem(`${this.prefijo}:${clave}`, JSON.stringify(valor));
    } catch {
      // Si no se puede guardar, la app sigue funcionando en memoria durante la sesión.
    }
  }
  borrar(clave) {
    try {
      window.localStorage.removeItem(`${this.prefijo}:${clave}`);
    } catch {
      /* sin acción */
    }
  }
}

export function crearAlmacenamiento() {
  try {
    const prueba = '__cafeu_prueba__';
    window.localStorage.setItem(prueba, '1');
    window.localStorage.removeItem(prueba);
    return new AlmacenamientoLocal();
  } catch {
    return new AlmacenamientoEnMemoria();
  }
}
