// Error de regla de negocio. La capa de presentación lo muestra al usuario tal cual,
// por eso el mensaje debe decir qué pasó y cómo corregirlo.
export class ErrorDeDominio extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.name = 'ErrorDeDominio';
    this.codigo = codigo;
  }
}
