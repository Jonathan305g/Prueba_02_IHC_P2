import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('..', import.meta.url));
async function files(dir) {
  const result = [];
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    if (['.git','node_modules'].includes(item.name)) continue;
    const name = path.join(dir, item.name);
    if (item.isDirectory()) result.push(...await files(name)); else result.push(name);
  }
  return result;
}
const required = ['README.md','docs/analisis-ux.md','docs/requisitos.md','docs/arquitectura.md','docs/sitemap.md','docs/user-flow.md','docs/trazabilidad.md','docs/guia-actualizacion.md','prototipos/wireframes/01-catalogo.svg','prototipos/wireframes/02-carrito.svg','prototipos/wireframes/03-revision.svg','evaluacion/plan.md','evaluacion/tareas.md','evaluacion/consentimiento.md','evaluacion/piloto.md','evaluacion/heuristicas.md','evaluacion/recorrido-cognitivo.md','evaluacion/accesibilidad.md','evaluacion/resultados.csv','evaluacion/sus.csv','evaluacion/metricas.md','evaluacion/hallazgos.md','evaluacion/backlog.md','evaluacion/validacion-v2.md','evaluacion/datos/observaciones.json'];
const errores = [];
for (const f of required) try { await fs.access(path.join(root, f)); } catch { errores.push('Falta ' + f); }
let links = 0;
for (const f of (await files(root)).filter((p) => p.endsWith('.md'))) {
  const text = await fs.readFile(f, 'utf8');
  for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const ref = match[1].split('#')[0];
    if (!ref || /^(https?:|mailto:)/.test(ref)) continue;
    links++;
    const target = path.resolve(path.dirname(f), decodeURIComponent(ref));
    try { await fs.access(target); } catch { errores.push(`${path.relative(root, f)}: enlace inexistente ${ref}`); }
  }
}
const datos = JSON.parse(await fs.readFile(path.join(root, 'evaluacion/datos/observaciones.json'), 'utf8'));
const original = await fs.readFile(path.join(root, 'evaluacion/datos/CafeU_Recoleccion_Pruebas_Completo.xlsx'));
if (createHash('sha256').update(original).digest('hex') !== datos.fuente.sha256) errores.push('El Excel original no coincide con su huella de importación.');
if (errores.length) { console.error(errores.join('\n')); process.exitCode = 1; }
else console.log(`Estructura requerida, ${links} enlaces locales y Excel original: correctos. Esta comprobación no sustituye pruebas de navegador ni evidencia de sesiones.`);
