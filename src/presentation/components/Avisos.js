import { el } from './formato.js';

// Avisos temporales en una región aria-live. Un aviso puede traer una acción (p. ej. Deshacer).
// Mientras el puntero o el foco están sobre el aviso, no se cierra.
export function crearAvisos(contenedor) {
  let temporizador = null;

  function cerrar() {
    clearTimeout(temporizador);
    contenedor.replaceChildren();
  }

  function mostrar(mensaje, { tipo = 'info', accion = null, duracion = 6000 } = {}) {
    cerrar();
    const aviso = el('div', { class: `aviso aviso--${tipo}` },
      el('p', { class: 'aviso__texto' }, mensaje),
      accion
        ? el('button', {
            type: 'button',
            class: 'boton boton--secundario aviso__accion',
            onclick: async () => {
              cerrar();
              await accion.ejecutar();
            },
          }, accion.texto)
        : null,
      el('button', { type: 'button', class: 'aviso__cerrar', 'aria-label': 'Cerrar aviso', onclick: cerrar }, '×')
    );

    const programar = () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(cerrar, duracion);
    };
    aviso.addEventListener('mouseenter', () => clearTimeout(temporizador));
    aviso.addEventListener('mouseleave', programar);
    aviso.addEventListener('focusin', () => clearTimeout(temporizador));
    aviso.addEventListener('focusout', programar);

    contenedor.append(aviso);
    programar();
    return aviso;
  }

  return { mostrar, cerrar };
}
