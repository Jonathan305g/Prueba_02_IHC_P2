# Triangulación de hallazgos

Se contrastan los hallazgos heurísticos originales con las notas V1 aportadas. No se atribuyen causas que las notas no especifican. Las mejoras implementadas están en [backlog](backlog.md); los límites de la comparación en [validación](validacion-v2.md).

| ID | Heurística / recorrido | Observaciones aportadas | Interpretación sustentada | Corrección |
|---|---|---|---|---|
| HA01 | HE01, recuperación T3 | P01 recupera con pista; P02 vuelve a agregar; T3 tiene 0/2 autónomos | La recuperación merece prioridad; los registros no prueban que el temporizador fuera la única causa | Deshacer persistente y próximo al carrito (B01) |
| HA02 | HE02, superposición móvil | Las sesiones aportadas fueron en portátil | Hallazgo de inspección móvil, sin corroboración en estas sesiones | Avisos en flujo y espacio inferior (B04) |
| HA03 | HE03, búsqueda con variantes | P02 borra una búsqueda sin resultados y requiere una pista; no se anotó la consulta literal | Hay dificultad de búsqueda; no puede afirmarse que haya usado «expreso» | Equivalencia de vocabulario (B03) |
| HA04 | HE04, recorrido T2 | P01 deja dos unidades y falla a 60 s; P02 llega a cuatro y corrige | La cantidad presenta errores; las notas no documentan que se introdujeran 0 o 99 | Advertencia durante edición y validación de dominio (B05) |
| HA05 | HE05, cancelación global | T3 no solicita cancelar todo el pedido | Prevención basada en la inspección, sin resultado de usuario para ese diálogo | Confirmación explícita al vaciar (B02) |
| HA06 | Prueba técnica PT01 | Las sesiones no registran fallo de cuota | La base puede anunciar cantidad/confirmación no guardada. Reproducido con rechazo de escritura en Node | Estado conjunto y propagación de error (B06) |

## Conclusiones de los datos aportados

1. Eficacia: V1 presenta 33,33 % de éxito autónomo y 66,67 % de finalización completa; la recuperación T3 es el punto más débil de las tareas registradas.
2. Eficiencia: T3 tiene el mayor tiempo medio V1 (109,3 s); el cierre por tiempo de P01 en T2 se conserva en el promedio, sin ocultarlo.
3. Satisfacción: SUS medio V1 es 57,5 puntos y SEQ medio 3,67/7. La ronda V2 registrada presenta valores superiores. Las sesiones ya se realizaron, según confirmación de William Martínez; la muestra pequeña y la repetición de participantes limitan la atribución causal de la diferencia.

Recomendaciones técnicas: comprobar recuperación con teclado y en teléfono; registrar la consulta literal y distinguir repetición de consigna frente a pistas; mantener las firmas fuera del repositorio. No generalizar a la población universitaria a partir de dos personas.
