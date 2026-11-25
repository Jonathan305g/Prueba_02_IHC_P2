// Servidor estático sin dependencias para ejecutar la app con módulos ES.
// Uso: npm start  ->  http://localhost:5173
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const puerto = Number(process.env.PORT) || 5173;
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (ruta === '/') {
    res.writeHead(302, { Location: '/src/presentation/' });
    return res.end();
  }
  const relativa = normalize(ruta.endsWith('/') ? `${ruta}index.html` : ruta).replace(/^([/\\])+/, '');
  if (relativa.startsWith('..')) {
    res.writeHead(403);
    return res.end();
  }
  try {
    const contenido = await readFile(join(raiz, relativa));
    res.writeHead(200, { 'Content-Type': tipos[extname(relativa)] ?? 'application/octet-stream' });
    res.end(contenido);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  }
}).listen(puerto, () => {
  console.log(`CaféU 2.0 en http://localhost:${puerto}`);
});
