// Normaliza texto para búsquedas: sin tildes, sin mayúsculas y sin espacios extra.
// "Café con LECHE " -> "cafe con leche"
export function normalizarTexto(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Equivalencias acotadas al vocabulario del catalogo; no alteran el texto visible.
export function normalizarBusqueda(valor) {
  return normalizarTexto(valor).split(' ')
    .map((palabra) => ({ expreso: 'espresso', expresso: 'espresso' })[palabra] ?? palabra)
    .join(' ');
}

