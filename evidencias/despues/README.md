# Estado de la evidencia posterior

Las correcciones se encuentran en `src/` y su comprobación de persistencia en [persistencia-antes-despues.json](../verificacion/persistencia-antes-despues.json). Las pruebas de Node están en [node-tests.tap](../verificacion/node-tests.tap).

La verificación técnica en navegador (`npm run test:ui`, Google Chrome `158.0.8127.88` headless) se ejecutó con **15/15 comprobaciones aprobadas** ([navegador.json](../verificacion/navegador.json)) y generó 10 capturas en esta carpeta:

- `H01-deshacer.png`, `H02-movil.png`, `H03-busqueda.png`, `H04-cantidad.png`, `H05-cancelacion.png`, `H06-almacenamiento.png`
- `catalogo-movil.png`, `modo-memoria.png`, `pedido-revision.png`, `pedido-confirmado.png`
