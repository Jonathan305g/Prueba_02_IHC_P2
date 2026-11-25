const mean = (values) => values.length ? values.reduce((sum, n) => sum + n, 0) / values.length : null;
const ratio = (n, d) => d ? n / d : null;
export function puntajeSUS(respuestas) {
  if (!Array.isArray(respuestas) || respuestas.length !== 10 || !respuestas.every((n) => Number.isInteger(n) && n >= 1 && n <= 5)) return null;
  return respuestas.reduce((sum, n, i) => sum + (i % 2 === 0 ? n - 1 : 5 - n), 0) * 2.5;
}
function resumir(registros, cuestionarios) {
  const n = registros.length;
  const autonomos = registros.filter((r) => r.resultado === 'Autónomo').length;
  const ayuda = registros.filter((r) => r.resultado === 'Con ayuda').length;
  const parciales = registros.filter((r) => r.resultado === 'Parcial').length;
  const fallos = registros.filter((r) => r.resultado === 'No completó').length;
  const seq = registros.map((r) => r.seq).filter(Number.isFinite);
  const sus = cuestionarios.map((r) => puntajeSUS(r.respuestas)).filter((n) => n !== null);
  return {
    intentos: n, participantes: new Set(registros.map((r) => r.participante)).size,
    autonomos, con_ayuda: ayuda, parciales, no_completo: fallos,
    tasa_autonoma: ratio(autonomos, n), tasa_finalizacion: ratio(autonomos + ayuda, n),
    tiempo_medio_s: mean(registros.map((r) => r.tiempo_s)),
    tiempo_medio_completas_s: mean(registros.filter((r) => ['Autónomo', 'Con ayuda'].includes(r.resultado)).map((r) => r.tiempo_s)),
    seq_medio: mean(seq), respuestas_seq: seq.length,
    errores_criticos: registros.reduce((s, r) => s + r.errores_criticos, 0),
    errores_no_criticos: registros.reduce((s, r) => s + r.errores_no_criticos, 0),
    ayudas: registros.reduce((s, r) => s + r.ayudas, 0),
    sus_medio: mean(sus), sus_completos: sus.length,
  };
}
export function calcularMetricas(datos) {
  const incluidos = datos.registro.filter((r) => r.uso === 'Incluir');
  for (const r of incluidos) {
    if (!Number.isFinite(r.tiempo_s) || r.tiempo_s <= 0) throw new Error(`Tiempo no válido: ${r.sesion}/${r.tarea}`);
    for (const key of ['errores_criticos', 'errores_no_criticos', 'ayudas']) if (!Number.isInteger(r[key]) || r[key] < 0) throw new Error(`Conteo no válido: ${r.sesion}/${key}`);
    if (!['Autónomo', 'Con ayuda', 'Parcial', 'No completó'].includes(r.resultado)) throw new Error(`Resultado no válido: ${r.sesion}`);
    if (r.seq !== 'NR' && !(Number.isInteger(r.seq) && r.seq >= 1 && r.seq <= 7)) throw new Error(`SEQ no válido: ${r.sesion}`);
  }
  const usuarios = incluidos.filter((r) => r.participante !== 'P00');
  const versiones = Object.fromEntries(['V1', 'V2'].map((ronda) => {
    const rows = usuarios.filter((r) => r.ronda === ronda);
    const sus = datos.sus.filter((r) => r.ronda === ronda && r.participante !== 'P00');
    return [ronda, {
      global: resumir(rows, sus),
      tareas: Object.fromEntries(['T1', 'T2', 'T3'].map((t) => [t, resumir(rows.filter((r) => r.tarea === t), [])])),
      participantes: Object.fromEntries([...new Set(rows.map((r) => r.participante))].map((p) => [p, resumir(rows.filter((r) => r.participante === p), sus.filter((r) => r.participante === p))])),
    }];
  }));
  return { fuente: datos.fuente, versiones, piloto: resumir(incluidos.filter((r) => r.participante === 'P00'), datos.sus.filter((r) => r.participante === 'P00')) };
}
