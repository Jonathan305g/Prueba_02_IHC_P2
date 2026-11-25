# Subida única de William Martínez

Esta actualización está preparada sobre main en `4d9037e30f174e8f78f7e42dfad25fde2dfdf456`. No contiene carpeta `.git` ni modifica el remoto. Todos los archivos de esta actualización los sube William; no se distribuyen entre cinco personas.

La base es la **V1 1.0.0 del repositorio de Jonathan**. Sus 66 archivos se comprobaron antes de preparar el paquete. Véase [base-v1.md](base-v1.md).

## 1. Crear la rama desde la versión actual

```bash
git clone https://github.com/Jonathan305g/Prueba_02_IHC_P2.git
cd Prueba_02_IHC_P2
git switch main
git pull --ff-only origin main
git switch -c william/actualizacion-integral-cafeu
```

Si ya tienes el clon, omite las dos primeras líneas y asegúrate de guardar tus cambios locales antes de cambiar de rama. Si main avanzó desde la base indicada, compara los cambios antes de reemplazar archivos.

## 2. Copiar y verificar

Extrae el ZIP en una carpeta aparte. Copia **el contenido** de `cafeu-ihc-integrador` dentro del clon, donde ya está `package.json`. No copies la carpeta contenedora como subcarpeta y no borres `.git`. Conserva los archivos originales del repositorio que no figuren en la actualización.

```bash
npm test
npm run metricas
npm run comprobar
git status --short
git diff --stat
```

La aplicación se inicia con `npm start`. Las pruebas con usuarios ya fueron realizadas y documentadas en el Excel, según confirmación de William Martínez. La comprobación técnica visual del paquete (`npm run test:ui`) se ejecutó sobre Google Chrome (`15/15` verificaciones aprobadas y capturas en `evidencias/despues/`); véase `evaluacion/validacion-v2.md`.

## 3. Dos commits coherentes

```bash
git add src tests scripts package.json .github
git commit -m "fix: reforzar recuperacion cancelacion busqueda y persistencia de CafeU"
git add README.md docs prototipos evaluacion evidencias
git commit -m "docs: integrar wireframes registros metricas y trazabilidad de la actualizacion"
git status --short
git push -u origin william/actualizacion-integral-cafeu
```

No uses otro nombre de autor para aparentar aportes de compañeros. Los commits deben reflejar la cuenta y autor reales de quien los realiza. La primera confirmación agrupa código y pruebas; la segunda documenta evidencia y límites.

## 4. Pull Request

Base: `main`. Comparar: `william/actualizacion-integral-cafeu`.

Título: **Actualizar CaféU: recuperación, prevención de errores, persistencia y evaluación documentada**

Descripción para copiar:

> La base ofrecía Deshacer durante 10 segundos, vaciaba el carrito sin confirmación y podía anunciar un pedido confirmado aunque fallara LocalStorage. Esta actualización incorpora recuperación dentro del carrito, confirmación al vaciar, búsqueda con equivalencias, validación inmediata de cantidades y guardado conjunto de carrito e historial con errores explícitos.
>
> Se añaden tres wireframes, registros aportados y exportaciones CSV, métricas reproducibles, triangulación, backlog, trazabilidad y documentación de alcance. Se conservan capturas y atribuciones de la base.
>
> Validación: 26 pruebas de Node, 15/15 verificaciones en navegador (Google Chrome) con 10 capturas en `evidencias/despues/`, comparación técnica de persistencia antes/después, `npm run metricas` y `npm run comprobar`. Las sesiones de usuarios ya están realizadas y documentadas en el Excel. El registro conserva los identificadores de versión aportados.

Solicita que un compañero revise el PR y deje una revisión real. No se considera revisado por incluir un nombre en un documento. Cuando corresponda, el equipo decide la integración; esta guía no hace merge ni sube archivos por su cuenta.
