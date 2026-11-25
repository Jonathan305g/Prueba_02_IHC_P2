# Índice y procedencia de evidencias

| Material | Procedencia | Qué demuestra |
|---|---|---|
| `antes/H01.png` a `H05.png` | Archivos originales del repositorio en 4d9037e, conservados | Hallazgos de la base v1 |
| `../prototipos/version-v1/` | Diez capturas originales del mismo commit | Estados de la base en escritorio y móvil |
| `../prototipos/wireframes/` | Tres bocetos SVG creados para esta actualización | Propuesta de estructura e interacción; no son capturas de la app |
| `../evaluacion/datos/CafeU_Recoleccion_Pruebas_Completo.xlsx` | Archivo aportado por el usuario, sin modificar | Registros declarados, respuestas y contexto |
| `verificacion/node-tests.tap` | Ejecución real de pruebas en Node | Resultados de dominio, casos de uso, persistencia y cálculos |
| `verificacion/persistencia-antes-despues.json` | Mismo fallo de escritura contra base y actualización | Corrección de pérdida de integridad |
| `verificacion/contraste.json` | Cálculo matemático de colores CSS | Relaciones de contraste, no auditoría visual completa |
| `verificacion/navegador.json` | Ejecución real de `verificar-ui.mjs` en Google Chrome (`158.0.8127.88`) | 15/15 comprobaciones técnicas aprobadas en escritorio y móvil |
| `despues/*.png` | Capturas generadas por `verificar-ui.mjs` sobre la actualización `2.0.1` | Evidencia visual de HE01–HE05, fallo de guardado, modo memoria y flujos |

No se recibieron capturas de participantes. No se renombran las capturas v1 como imágenes de v2; las 10 capturas técnicas de `despues/` corresponden a la ejecución automatizada en navegador de la actualización `2.0.1`.
