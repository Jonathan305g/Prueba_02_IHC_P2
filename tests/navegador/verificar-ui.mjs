import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = process.env.CAFEU_PROJECT_DIR ?? fileURLToPath(new URL('../..', import.meta.url));
const url = process.env.CAFEU_QA_URL ?? 'http://127.0.0.1:5190';
const output = path.join(root, 'evidencias/despues');
await fs.mkdir(output, { recursive: true });
await fs.mkdir(path.join(root, 'evidencias/verificacion'), { recursive: true });
const server = process.env.CAFEU_QA_URL ? null : spawn(process.execPath, ['scripts/servidor.js'], { cwd: root, env: { ...process.env, PORT: '5190' }, stdio: 'ignore' });
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CAFEU_CHROMIUM_PATH ?? chromium.executablePath(), args: ['--no-sandbox'] });
} catch (error) {
  server?.kill();
  throw error;
}
const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const checks = [];
async function check(nombre, accion) { await accion(); checks.push({ nombre, resultado: 'Pasa' }); console.log('PASA:', nombre); }
async function waitApp(p = page) { await p.locator('button[data-producto-id="cafe-con-leche"]').waitFor(); }
async function add(id, p = page) { await p.locator(`button[data-producto-id="${id}"]`).click(); await p.locator(`.linea[data-producto-id="${id}"]`).waitFor(); }
async function cantidad(n, p = page) { await p.waitForFunction((valor) => document.querySelector('#cant-cafe-con-leche')?.value === String(valor), n); }
async function capture(name, p = page) { await p.screenshot({ path: path.join(output, name + '.png'), fullPage: true }); }
try {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(url)).ok) break; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await page.goto(url); await waitApp();
  await check('T1: busqueda sin tildes, agregado y total USD 1', async () => {
    await page.locator('#consulta').fill('CAFE LECHE');
    await page.waitForFunction(() => document.querySelectorAll('.tarjeta').length === 1);
    await add('cafe-con-leche'); await cantidad(1);
    assert.match(await page.locator('[data-js="total"]').innerText(), /1[,.]00/);
  });
  await check('T2: cantidad 3, total USD 3 y persistencia tras recarga', async () => {
    await page.locator('#cant-cafe-con-leche').fill('3'); await page.locator('#cant-cafe-con-leche').press('Tab');
    await cantidad(3); await page.reload(); await waitApp(); await cantidad(3);
    assert.match(await page.locator('[data-js="total"]').innerText(), /3[,.]00/);
  });
  await check('HE04: validacion inmediata de cero sin modificar el total', async () => {
    await page.locator('#cant-cafe-con-leche').fill('0');
    assert.equal(await page.locator('#cant-cafe-con-leche').getAttribute('aria-invalid'), 'true');
    assert.match(await page.locator('#cant-cafe-con-leche-error').innerText(), /1 y 20/);
    assert.match(await page.locator('[data-js="total"]').innerText(), /3[,.]00/);
    await capture('H04-cantidad');
    await page.locator('#cant-cafe-con-leche').press('Tab'); await cantidad(3);
  });
  await check('HE03: expreso encuentra Capuchino', async () => {
    await page.locator('#consulta').fill('expreso');
    await page.waitForFunction(() => document.querySelectorAll('.tarjeta').length === 1 && document.querySelector('.tarjeta__nombre')?.textContent === 'Capuchino');
    await capture('H03-busqueda');
    await page.locator('[data-js="limpiar-busqueda"]').click(); await waitApp();
  });
  await add('empanada-verde');
  await check('HE01: deshacer tiene foco y permanece disponible despues de 11 s', async () => {
    await page.locator('.linea[data-producto-id="empanada-verde"] button.linea__eliminar').click();
    await page.locator('[data-js="deshacer"]').waitFor();
    assert.equal(await page.locator('[data-js="deshacer"]').evaluate((el) => el === document.activeElement), true);
    await page.clock.install(); await page.clock.fastForward(11000);
    assert.equal(await page.locator('[data-js="deshacer"]').isVisible(), true);
    await capture('H01-deshacer');
    await page.keyboard.press('Enter'); await page.locator('.linea[data-producto-id="empanada-verde"]').waitFor();
    assert.match(await page.locator('[data-js="total"]').innerText(), /4[,.]00/);
  });
  await check('HE05: conservar y Escape no vacian; vaciar exige confirmacion y puede deshacerse', async () => {
    await page.getByRole('button', { name: 'Cancelar pedido', exact: true }).click();
    await page.locator('[data-js="dialogo-cancelar"][open]').waitFor(); await capture('H05-cancelacion');
    await page.getByRole('button', { name: 'Conservar pedido', exact: true }).click(); await cantidad(3);
    await page.getByRole('button', { name: 'Cancelar pedido', exact: true }).click();
    await page.locator('[data-js="dialogo-cancelar"][open]').waitFor(); await page.keyboard.press('Escape'); await cantidad(3);
    await page.getByRole('button', { name: 'Cancelar pedido', exact: true }).click();
    await page.locator('[data-js="dialogo-cancelar"][open]').waitFor();
    await page.getByRole('button', { name: 'Sí, vaciar pedido', exact: true }).click();
    await page.locator('[data-js="deshacer"]').waitFor();
    assert.equal(await page.locator('.linea').count(), 0);
    await page.locator('[data-js="deshacer"]').click(); await cantidad(3);
    assert.equal(await page.locator('.linea').count(), 2);
  });
  await check('T3: revision, Escape seguro, confirmacion, foco y una sola orden', async () => {
    await page.getByRole('button', { name: 'Revisar y confirmar pedido', exact: true }).click();
    await page.locator('[data-js="dialogo-confirmar"][open]').waitFor(); await capture('pedido-revision');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[data-js="exito"]').isVisible(), false);
    await page.getByRole('button', { name: 'Revisar y confirmar pedido', exact: true }).click();
    await page.locator('[data-js="dialogo-confirmar"][open]').waitFor();
    await page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click();
    await page.locator('[data-js="exito"]:visible').waitFor();
    assert.match(await page.locator('.codigo').innerText(), /^CU-[A-Z0-9]+-[A-Z0-9]+$/);
    assert.equal(await page.locator('#exito-titulo').evaluate((el) => el === document.activeElement), true);
    await capture('pedido-confirmado');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('cafeu:estado-v2')).pedidos.length), 1);
  });
  await page.reload(); await waitApp();
  await check('cinco clics rapidos conservan cinco unidades', async () => {
    await page.locator('button[data-producto-id="cafe-con-leche"]').evaluate((el) => { for (let i = 0; i < 5; i++) el.click(); });
    await cantidad(5);
  });
  await check('la revision espera al cambio de cantidad antes de mostrar el total', async () => {
    await page.locator('#cant-cafe-con-leche').fill('3');
    await page.getByRole('button', { name: 'Revisar y confirmar pedido', exact: true }).click();
    await page.locator('[data-js="dialogo-confirmar"][open]').waitFor();
    assert.match(await page.locator('[data-js="dialogo-resumen"]').innerText(), /3 × Café con leche/);
    assert.match(await page.locator('[data-js="dialogo-resumen"] .resumen__total').innerText(), /3[,.]00/);
  });
  await check('fallo real de setItem: no hay exito ni perdida de carrito; reintento sin duplicar', async () => {
    await page.evaluate(() => {
      window.__qaSet = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === 'cafeu:estado-v2') throw new DOMException('Cuota agotada', 'QuotaExceededError');
        return window.__qaSet.call(this, key, value);
      };
    });
    await page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'No se pudo guardar' }).waitFor(); await capture('H06-almacenamiento');
    assert.equal(await page.locator('[data-js="exito"]').isVisible(), false);
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('cafeu:estado-v2')));
    assert.equal(state.carrito.detalles[0].cantidad, 3); assert.equal(state.pedidos.length, 1);
    await page.evaluate(() => { Storage.prototype.setItem = window.__qaSet; });
    await page.getByRole('button', { name: 'Revisar y confirmar pedido', exact: true }).click();
    await page.locator('[data-js="dialogo-confirmar"][open]').waitFor();
    await page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click();
    await page.locator('[data-js="exito"]:visible').waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('cafeu:estado-v2')).pedidos.length), 2);
  });
  const mobile = await context.newPage(); await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(url); await waitApp(mobile); await capture('catalogo-movil', mobile); await add('cafe-con-leche', mobile);
  await check('HE02: movil sin desbordamiento y acciones sin barra superpuesta', async () => {
    const btn = mobile.getByRole('button', { name: 'Revisar y confirmar pedido', exact: true });
    await btn.scrollIntoViewIfNeeded();
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await btn.evaluate((el) => { const b = el.getBoundingClientRect(); return el.contains(document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2)); }), true);
    await capture('H02-movil', mobile);
  });
  await check('responsive: 320, 360, 600, 960 y 1366 px sin desbordamiento horizontal', async () => {
    for (const width of [320, 360, 600, 960, 1366]) {
      await mobile.setViewportSize({ width, height: 900 });
      assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, String(width));
    }
  });
  await check('teclado: salto al catalogo y foco visible', async () => {
    const keyboardPage = await context.newPage(); await keyboardPage.goto(url); await waitApp(keyboardPage);
    await keyboardPage.keyboard.press('Tab');
    assert.equal(await keyboardPage.evaluate(() => document.activeElement.textContent.trim()), 'Saltar al catálogo');
    await keyboardPage.keyboard.press('Enter');
    assert.equal(await keyboardPage.evaluate(() => document.activeElement.id), 'catalogo-titulo');
    await keyboardPage.close();
  });
  await check('almacenamiento bloqueado al iniciar: aviso de modo temporal y recarga sin promesa de persistencia', async () => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(() => { Storage.prototype.setItem = function () { throw new DOMException('Bloqueado', 'SecurityError'); }; });
    const p = await ctx.newPage(); await p.goto(url); await waitApp(p);
    assert.equal(await p.locator('[data-js="modo-memoria"]').isVisible(), true);
    await add('cafe-con-leche', p); await cantidad(1, p); await capture('modo-memoria', p);
    await p.reload(); await waitApp(p); assert.equal(await p.locator('.linea').count(), 0);
    await ctx.close();
  });
  await check('sin excepciones JavaScript durante los recorridos de escritorio', async () => assert.deepEqual(errors, []));
  const report = { version: '2.0.1', fecha_utc: new Date().toISOString(), navegador: await browser.version(), alcance: 'Verificacion tecnica automatizada. No son sesiones de usuarios ni tiempos de usabilidad.', checks };
  await fs.writeFile(path.join(root, 'evidencias/verificacion/navegador.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ comprobaciones: checks.length, fallos: 0 }));
} catch (error) {
  await capture('error-qa');
  throw error;
} finally {
  await browser.close(); server?.kill();
}
