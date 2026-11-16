# TaskFlow

## Descripción general

TaskFlow es un gestor de tareas personales con una interfaz en español, adaptable a celulares, tabletas y computadoras. Permite organizar actividades, establecer prioridades y consultar el progreso desde el navegador.

El proyecto se desarrolla como parte de la actividad académica **«Desplegar aplicaciones de alta disponibilidad mediante el uso de bases de datos gestionadas, contenedores y balanceo de carga en AWS»**. Esta versión utiliza exportación estática de Next.js y está preparada para su futura publicación mediante AWS Amplify Hosting.

## Funcionalidades principales

- Crear tareas con título, descripción opcional y prioridad alta, media o baja.
- Editar tareas y eliminar cada una con confirmación.
- Marcar tareas como completadas o volver a dejarlas pendientes.
- Buscar en títulos y descripciones sin distinguir mayúsculas de minúsculas.
- Combinar búsqueda con los filtros Todas, Pendientes y Completadas.
- Consultar estadísticas de todas las tareas, independientemente de la búsqueda o filtro seleccionado.
- Guardar automáticamente los cambios y recuperar las tareas desde `localStorage`.
- Mostrar estados de carga, mensajes sin resultados y avisos de errores de almacenamiento.

## Tecnologías utilizadas

| Tecnología | Uso |
| --- | --- |
| Next.js 16.4.6 con App Router | Estructura y exportación estática |
| React 19.3 | Componentes y estado de la aplicación |
| TypeScript 5 | Tipado estricto |
| Tailwind CSS 4.3.3 | Diseño y estilos adaptables |
| Lucide React | Iconografía |
| API `localStorage` del navegador | Persistencia local |
| ESLint 9 | Análisis estático del código |
| Ejecutor de pruebas integrado en Node.js | Pruebas de almacenamiento |
| Git y GitHub | Control de versiones y futuro repositorio público |
| AWS Amplify Hosting | Alojamiento estático previsto |

Las versiones resueltas de las dependencias se registran en `package-lock.json`.

## Requisitos previos

- **Node.js 22** y **npm**, incluido con Node.js.
- Git, si se obtiene el código mediante clonación.
- Un navegador moderno con JavaScript habilitado.
- Acceso a Internet para la instalación inicial de dependencias.

Para comprobar las herramientas:

```bash
node --version
npm --version
```

## Instalación

Descarga o clona el repositorio cuando esté publicado. Desde el directorio que contiene la carpeta del proyecto, ejecuta:

```bash
cd gestor-tareas
npm ci
```

Si la terminal ya está abierta en la raíz del proyecto, ejecuta únicamente `npm ci`. Este comando instala las dependencias a partir del archivo de bloqueo existente.

No hay variables de entorno obligatorias. No es necesario crear un archivo `.env.local` ni copiar `.env.example` para ejecutar la aplicación; este último documenta la configuración actual.

## Ejecución local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Si el puerto está ocupado, utiliza la dirección que indique la terminal. Para detener el servidor, pulsa `Ctrl+C`.

En Windows, si PowerShell bloquea `npm.ps1`, utiliza `npm.cmd` en lugar de `npm`, por ejemplo: `npm.cmd run dev`.

## Validación: lint, pruebas y compilación

Ejecuta los siguientes comandos desde la raíz del proyecto:

```bash
npm run lint
node --experimental-strip-types --test tests/task-storage.test.mjs
npm run build
```

- **Lint:** comprueba el código con ESLint.
- **Pruebas:** ejecuta las nueve pruebas de almacenamiento. Cubren recuperación, conservación de campos, almacenamiento vacío, datos inválidos, acceso bloqueado y errores de escritura. En Node.js 22.14 pueden aparecer advertencias sobre el soporte experimental de TypeScript y la detección del tipo de módulo; no representan pruebas fallidas.
- **Compilación:** comprueba TypeScript y genera la exportación estática en `out/`, incluidos `index.html`, JavaScript, CSS y recursos públicos.

La configuración utiliza `output: "export"`. El contenido de `out/` puede servirse desde un alojamiento estático sin un servidor Node.js en producción. El script `npm run start` conserva el comando predeterminado `next start`, pero no sirve esta exportación; para producción se publica `out/`.

Para una comprobación manual, crea tareas, edita sus datos, alterna su estado, combina búsquedas y filtros y confirma una eliminación. Recarga después de cada operación para verificar que los datos persisten en el mismo navegador y dirección.

## Estructura del proyecto

```text
gestor-tareas/
├── app/                     # Página principal, diseño global y estilos
├── components/tasks/        # Panel, formulario, tarjetas, lista y estadísticas
├── hooks/use-tasks.ts        # Estado, operaciones CRUD y persistencia
├── lib/task-storage.ts      # Lectura, validación y escritura del almacenamiento
├── types/task.ts            # Modelo de datos y tipos compartidos
├── tests/                   # Pruebas automatizadas de almacenamiento
├── public/                  # Recursos estáticos
├── amplify.yml              # Instrucciones de compilación para Amplify
├── next.config.ts           # Exportación estática y configuración de Tailwind
├── .env.example             # Documentación de variables de entorno
└── package-lock.json        # Versiones resueltas de dependencias
```

## Almacenamiento local

Las tareas se guardan bajo la clave **`taskflow-tasks`** en `localStorage`. Se conservan el identificador, el título, la descripción, la prioridad, el estado y la fecha de creación.

La lectura ocurre después del montaje en el navegador, para evitar problemas de hidratación. No se escribe una lista vacía antes de completar esa lectura. Cada operación CRUD actualiza el almacenamiento sin guardar los filtros ni la búsqueda.

Si los datos guardados son inválidos o no pueden leerse, se conservan sin sobrescribirlos y la aplicación permite trabajar en memoria durante esa sesión. Si falla una escritura, aparece un aviso y se reintenta al realizar otra operación. Los cambios que no se hayan guardado pueden perderse al recargar o cerrar la página.

Los datos pertenecen al navegador y al origen utilizado: protocolo, dominio y puerto. Las tareas de `localhost` no se trasladan automáticamente a la futura dirección pública.

## Despliegue mediante AWS Amplify

El código se alojará en un **repositorio público de GitHub**. Posteriormente, AWS Amplify se conectará a ese repositorio y a su rama principal para compilar y publicar la aplicación.

La preparación está realizada; la publicación aún está pendiente. El procedimiento previsto es:

1. Publicar el código fuente y el archivo de bloqueo en GitHub, manteniendo excluidos los archivos generados y privados.
2. Conectar AWS Amplify Hosting al repositorio y a la rama principal elegida.
3. Usar la raíz de `gestor-tareas` como raíz de la aplicación. El archivo `amplify.yml` está pensado para un repositorio cuya raíz sea esta carpeta.
4. Revisar las instrucciones de compilación definidas en `amplify.yml`:
   - Seleccionar Node.js 22.
   - Instalar con `npm ci --cache .npm --prefer-offline`.
   - Compilar con `npm run build`.
   - Publicar todos los archivos de **`out/`**.
   - Reutilizar la caché de npm y `.next/cache/` entre compilaciones.
5. Verificar que Amplify aloje la exportación como sitio estático, con plataforma `WEB` y directorio de salida `out/`.
6. Una vez publicado, comprobar el CRUD, la búsqueda, los filtros y la persistencia desde la dirección pública. Actualizar este README con esa dirección y preparar las capturas de la aplicación y del estado `Deployed` en Amplify.

**Configuración pendiente de verificar en AWS:** `amplify.yml` no selecciona por sí mismo la plataforma de alojamiento. La autodetección de Next.js puede proponer `WEB_COMPUTE` y `.next`; esa configuración corresponde a la integración administrada de Next.js y debe revisarse para este proyecto, que publicará archivos exportados. La configuración efectiva de la plataforma se comprobará al conectar AWS.

No se necesita una base de datos, autenticación, servicios de backend ni variables de entorno obligatorias. Las tareas se almacenan en el navegador, no en AWS. Node.js y npm se utilizan durante la compilación, no como servidor de producción.

Consulta la [referencia de `amplify.yml`](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html), la [referencia de plataformas de Amplify](https://docs.aws.amazon.com/amplify/latest/APIReference/API_CreateApp.html) y las [consideraciones de autodetección de Next.js](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html).

## URL pública del despliegue

Pendiente de publicación en AWS Amplify.

## Consideraciones y limitaciones

- No existe autenticación, sincronización entre dispositivos ni actualización automática entre pestañas.
- Las tareas solo se conservan mientras el navegador mantenga sus datos locales. Borrar los datos del sitio, usar otra dirección o cambiar de perfil puede dejar la lista vacía. En navegación privada, la duración del almacenamiento depende del navegador.
- Si el almacenamiento está bloqueado, dañado o sin espacio disponible, el aviso de la aplicación indica que los cambios pueden no conservarse.
- La versión actual no incluye base de datos, copias de seguridad remotas ni importación o exportación de tareas.
- La aplicación requiere JavaScript para recuperar y gestionar las tareas.
- La arquitectura utiliza archivos estáticos y persistencia local; no incorpora contenedores, balanceadores ni una base de datos gestionada.
- El repositorio público, la URL de producción y la validación en AWS están pendientes. Las comprobaciones locales no sustituyen las pruebas del despliegue real.
- `node_modules/`, `.next/`, `out/`, las cachés y los archivos de entorno privados no se deben subir. `.env.example` sí forma parte de la documentación versionable.
