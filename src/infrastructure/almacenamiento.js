// Adaptadores de almacenamiento clave/valor con la misma interfaz.
// Los repositorios dependen de esta interfaz y no de window.localStorage directamente,
// así las pruebas automatizadas usan la versión en memoria.

export class AlmacenamientoEnMemoria {
  modo = 'memoria';
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
  modo = 'local';
  constructor(prefijo = 'cafeu', storage = globalThis.localStorage ?? globalThis.window?.localStorage) {
    this.prefijo = prefijo;
    this.storage = storage;
  }
  leer(clave) {
    try {
      const texto = this.storage.getItem(`${this.prefijo}:${clave}`);
      return texto === null ? null : JSON.parse(texto);
    } catch (cause) {
      throw new ErrorDeAlmacenamiento('No se pudieron leer los datos guardados. Revisa los permisos del navegador y vuelve a intentarlo.', cause);
    }
  }
  escribir(clave, valor) {
    try {
      this.storage.setItem(`${this.prefijo}:${clave}`, JSON.stringify(valor));
    } catch (cause) {
      throw new ErrorDeAlmacenamiento('No se pudo guardar el cambio. Tu pedido anterior se conserva. Libera espacio o habilita el almacenamiento y vuelve a intentarlo.', cause);
    }
  }
  borrar(clave) {
    try {
      this.storage.removeItem(`${this.prefijo}:${clave}`);
    } catch (cause) {
      throw new ErrorDeAlmacenamiento('No se pudo borrar el dato guardado. El cambio no se aplicó.', cause);
    }
  }
}

export class ErrorDeAlmacenamiento extends Error {
  constructor(mensaje, cause) {
    super(mensaje, { cause });
    this.name = 'ErrorDeAlmacenamiento';
    this.codigo = 'ALMACENAMIENTO_NO_DISPONIBLE';
  }
}

export function crearAlmacenamiento() {
  try {
    const prueba = '__cafeu_prueba__';
    const local = new AlmacenamientoLocal();
    local.escribir(prueba, 1);
    local.borrar(prueba);
    return local;
  } catch {
    return new AlmacenamientoEnMemoria();
  }
}

