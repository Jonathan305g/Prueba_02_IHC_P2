import { el } from './formato.js';
import { CANTIDAD_MINIMA, CANTIDAD_MAXIMA } from '../../domain/DetallePedido.js';

// Control − [n] + reutilizable. Acepta clic, teclado y escritura directa.
// onCambiar(nuevaCantidad) devuelve una promesa; si falla, se muestra el error junto al campo.
export function SelectorCantidad({ id, etiqueta, valor, onCambiar }) {
  const idError = `${id}-error`;

  const campo = el('input', {
    id,
    type: 'number',
    inputmode: 'numeric',
    min: CANTIDAD_MINIMA,
    max: CANTIDAD_MAXIMA,
    step: 1,
    value: valor,
    class: 'cantidad__campo',
    'aria-describedby': idError,
  });
  const error = el('p', { id: idError, class: 'cantidad__error', 'aria-live': 'polite' });

  const menos = el('button', {
    type: 'button',
    class: 'cantidad__boton',
    'aria-label': `Quitar una unidad de ${etiqueta}`,
    disabled: valor <= CANTIDAD_MINIMA,
  }, '−');
  const mas = el('button', {
    type: 'button',
    class: 'cantidad__boton',
    'aria-label': `Agregar una unidad de ${etiqueta}`,
    disabled: valor >= CANTIDAD_MAXIMA,
  }, '+');

  async function aplicar(nueva) {
    error.textContent = '';
    campo.removeAttribute('aria-invalid');
    try {
      await onCambiar(nueva);
    } catch (e) {
      campo.setAttribute('aria-invalid', 'true');
      error.textContent = e.message;
      campo.value = valor;
    }
  }

  menos.addEventListener('click', () => aplicar(valor - 1));
  mas.addEventListener('click', () => aplicar(valor + 1));
  campo.addEventListener('change', () => {
    const texto = campo.value.trim();
    aplicar(texto === '' ? NaN : Number(texto));
  });

  return el('div', { class: 'cantidad' },
    el('label', { for: id, class: 'cantidad__etiqueta' }, `Cantidad de ${etiqueta}`),
    el('div', { class: 'cantidad__fila' }, menos, campo, mas),
    error
  );
}
