# Base V1 y contenido de la actualización

| Dato | Valor |
|---|---|
| Repositorio de origen | https://github.com/Jonathan305g/Prueba_02_IHC_P2 |
| Versión de partida | 1.0.0 (V1) |
| Commit | `4d9037e30f174e8f78f7e42dfad25fde2dfdf456` |
| Archivos originales comprobados | 66, mediante sus identificadores Git de contenido |
| Versión resultante | 2.0.1, con las correcciones B01–B06 |

La V1 es el punto de partida del código, de las capturas originales y de las sesiones V1 registradas en el Excel. El nombre académico «CaféU 2.0» no cambia la versión técnica 1.0.0 de esa base. La actualización conserva el catálogo, los precios, la arquitectura por capas, las pruebas funcionales originales y las capturas V1.

La identidad de cada archivo original está en [base-v1.json](base-v1.json). La [comparación de archivos](../evidencias/verificacion/base-v1.json) distingue lo conservado, lo modificado y lo añadido. No faltan archivos originales en el paquete.

## Comparación técnica reproducible

Desde un clon del repositorio, obtener la V1 en otra carpeta:

```bash
git worktree add --detach ../CafeU_V1 4d9037e30f174e8f78f7e42dfad25fde2dfdf456
```

Desde la carpeta de esta actualización:

```bash
npm run comparar:v1 -- ../CafeU_V1
```

El comando primero comprueba los 66 archivos de la V1. Después ejecuta en ambas versiones el mismo fallo de escritura y la consulta `expreso`. Actualiza [persistencia-antes-despues.json](../evidencias/verificacion/persistencia-antes-despues.json). La base informa una cantidad que no guarda y puede perder el carrito al confirmar; la actualización rechaza esos cambios e informa el error. `expreso` pasa de cero resultados a encontrar Capuchino.

## Datos de evaluación

El Excel original permanece sin modificar. P00 es el piloto y se excluye de los promedios de P01/P02. Las filas etiquetadas V2 se conservan como fueron aportadas: su campo de versión dice «V2 - revisión de interfaz» y no identifica un commit. William Martínez confirmó que las pruebas con usuarios ya se realizaron y corresponden a los resultados entregados en este Excel. La actividad se registra como realizada; se mantiene literalmente la identificación de versión del libro, sin asignarle un commit adicional. Véase [validación](../evaluacion/validacion-v2.md).

## Integración

William Martínez puede subir el contenido del paquete en una sola rama mediante los dos commits de la [guía de actualización](guia-actualizacion.md). El ZIP contiene los archivos completos para ejecutar el proyecto; no incluye historial Git ni paquetes instalados.
