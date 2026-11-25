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
