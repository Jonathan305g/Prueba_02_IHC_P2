# Verificación realizada

Se ejecutaron 26 pruebas de Node: 26 aprobadas, 0 fallos, 0 omitidas. El [registro TAP](node-tests.tap) contiene sus nombres y resultados. Incluye las 15 pruebas originales, 8 regresiones de persistencia/búsqueda y 3 comprobaciones de métricas.

También se comprobó la sintaxis de los archivos JS/MJS, la estructura de la entrega, los enlaces Markdown locales, la integridad del Excel original mediante SHA-256 y las relaciones de contraste CSS. `npm run comprobar` reproduce las comprobaciones de estructura, enlaces y Excel.

Se reconstruyeron los 66 archivos del commit V1 de Jonathan y se verificó su identidad Git. La V1 supera sus 15 pruebas originales: [registro](node-v1.txt). La [comparación de archivos](base-v1.json) y la [identidad de origen](../../docs/base-v1.md) permiten distinguir la base de esta actualización.

[Persistencia antes/después](persistencia-antes-despues.json) ejecuta el mismo fallo de cuota sobre el commit base y el código corregido. El cambio fallido ya no se comunica como guardado y la confirmación fallida conserva el carrito.

La [comprobación en navegador](navegador.json) se ejecutó mediante `tests/navegador/verificar-ui.mjs` en Google Chrome (`158.0.8127.88` headless): **15 comprobaciones aprobadas, 0 fallos**, generando 10 capturas técnicas en [evidencias/despues/](../despues/README.md). Los [wireframes](../../prototipos/wireframes/README.md) son diagramas de diseño y complementan las capturas de funcionamiento.
