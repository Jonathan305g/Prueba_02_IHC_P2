import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { calcularMetricas, puntajeSUS } from '../../scripts/lib/metricas.js';

test('SUS conserva cero y cien; una respuesta omitida no se imputa', () => {
  assert.equal(puntajeSUS([5,1,5,1,5,1,5,1,5,1]), 100);
  assert.equal(puntajeSUS([1,5,1,5,1,5,1,5,1,5]), 0);
  assert.equal(puntajeSUS([5,1,5,1,5,1,5,1,5,'NR']), null);
});
test('el calculo de la fuente excluye P00 y separa ayuda, parcial y fallo', async () => {
  const datos = JSON.parse(await fs.readFile(new URL('../../evaluacion/datos/observaciones.json', import.meta.url), 'utf8'));
  const m = calcularMetricas(datos);
  assert.equal(m.versiones.V1.global.intentos, 6);
  assert.equal(m.versiones.V1.global.autonomos, 2);
  assert.equal(m.versiones.V1.global.con_ayuda, 2);
  assert.equal(m.versiones.V1.global.parciales, 1);
  assert.equal(m.versiones.V1.global.no_completo, 1);
  assert.equal(m.versiones.V1.global.sus_medio, 57.5);
  assert.equal(m.versiones.V2.global.sus_medio, 85);
  assert.equal(m.piloto.intentos, 3);
  assert.equal(m.versiones.V1.tareas.T2.tiempo_medio_s, 45.8);
});
test('sin intentos no se comunica un cero de satisfaccion ni una tasa de exito', () => {
  const m = calcularMetricas({ fuente: {}, registro: [], sus: [] });
  assert.equal(m.versiones.V1.global.tasa_autonoma, null);
  assert.equal(m.versiones.V1.global.sus_medio, null);
  assert.equal(m.versiones.V1.global.tiempo_medio_s, null);
});
