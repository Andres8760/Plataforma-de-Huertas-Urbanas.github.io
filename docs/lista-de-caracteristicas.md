# Lista de características FDD

Entidad principal: Huerta.

## Conjunto A: Gestión de huertas

| ID | Característica | Conjunto | Responsable | Estado |
|---|---|---|---|---|
| A1 | Listar las huertas | Gestión | Darlyn y Andres | Terminada |
| A2 | Consultar el detalle de una huerta | Gestión | Darlyn y Andres | Terminada |
| A3 | Crear una huerta | Gestión | Darlyn y Andres | Terminada |
| A4 | Modificar los datos de una huerta | Gestión | Darlyn y Andres | Terminada |
| A5 | Eliminar una huerta | Gestión | Darlyn y Andres | Terminada |

## Conjunto B: Autenticación

| ID | Característica | Conjunto | Responsable | Estado |
|---|---|---|---|---|
| B1 | Registrar un usuario | Autenticación | Andres | Terminada |
| B2 | Iniciar la sesión de un usuario | Autenticación | Andres | Terminada |
| B3 | Consultar el perfil del usuario autenticado | Autenticación | Andres | Terminada |
| B4 | Cerrar la sesión de un usuario | Autenticación | Andres | Terminada |

## Conjunto C: Autorización

| ID | Característica | Conjunto | Responsable | Estado |
|---|---|---|---|---|
| C1 | Restringir operaciones a roles autorizados | Autorización | Andres | Terminada |
| C2 | Restringir la gestión de huertas ajenas | Autorización | Andres | Terminada |
| C3 | Adaptar la interfaz según el rol | Autorización | Andres | Terminada |

## Conjunto D: Biblioteca

| ID | Característica | Conjunto | Responsable | Estado |
|---|---|---|---|---|
| D1 | Listar las guías | Biblioteca | Andres | Terminada |
| D2 | Consultar el detalle de una guía | Biblioteca | Andres | Terminada |
| D3 | Crear una guía | Biblioteca | Andres | Terminada |
| D4 | Modificar una guía | Biblioteca | Andres | Terminada |
| D5 | Eliminar una guía | Biblioteca | Andres | Terminada |

## Conjunto E: Administración

| ID | Característica | Conjunto | Responsable | Estado |
|---|---|---|---|---|
| E1 | Consultar estadísticas administrativas | Administración | Andres | Terminada |
| E2 | Listar los usuarios registrados | Administración | Andres | Terminada |
| E3 | Cambiar el rol de un usuario | Administración | Andres | Terminada |
| E4 | Eliminar un usuario | Administración | Andres | Terminada |

## Conjunto F: Funcionalidades comunitarias

| ID | Característica | Conjunto | Responsable | Estado |
|---|---|---|---|---|
| F1 | Registrar actividades de una huerta | Actividades | Andres | Terminada |
| F2 | Consultar el calendario de siembra y cosecha | Calendario | Andres | Terminada |
| F3 | Publicar mensajes en el foro | Foro | Darlyn y Andres | Terminada |
| F4 | Responder publicaciones del foro | Foro | Darlyn y Andres | Terminada |
| F5 | Moderar publicaciones del foro | Foro | Andres | Terminada |
| F6 | Modificar actividades de una huerta | Actividades | Andres | Terminada |
| F7 | Completar actividades de una huerta | Actividades | Andres | Terminada |
| F8 | Eliminar actividades de una huerta | Actividades | Andres | Terminada |

## Conjunto G: Infraestructura y calidad

| ID | Característica | Conjunto | Responsable | Estado |
|---|---|---|---|---|
| G1 | Configurar MongoDB Atlas | Infraestructura | David | Terminada |
| G2 | Establecer la conexión con MongoDB | Infraestructura | David | Terminada |
| G3 | Configurar el servidor Express | Infraestructura | David | Terminada |
| G4 | Configurar las variables de entorno | Infraestructura | Andres | Terminada |
| G5 | Organizar el frontend y backend | Infraestructura | Andres | Terminada |
| G6 | Validar los datos recibidos por la API | Seguridad | Darlyn | Terminada |
| G7 | Ejecutar las pruebas de integración | Pruebas | Andres | Terminada |
| G8 | Documentar las funcionalidades | Documentación | Andres | Terminada |
| G9 | Implementar controladores y rutas del backend | Backend | Darlyn | Terminada |

## Trazabilidad

| Características | Rama de integración | Código principal |
|---|---|---|
| A1-A5 | feature/crud-huertas-frontend | huertas.js, huertas.controller.js |
| B1-B4 | feature/integracion-frontend-api | auth.js, api.js, auth.controller.js |
| C1-C3 | feature/panel-administrativo | auth.js, role.js, admin.js |
| D1-D5 | feature/biblioteca-guias | guias.js, guias.controller.js |
| E1-E4 | feature/panel-administrativo | admin.js, admin.controller.js |
| F3-F5 | feature/integracion-foro | foro.js, threads.controller.js |
| F1-F2, F6-F8 | feature/calendario-actividades | actividades.js, actividades.controller.js |
| G1-G4 | fix/configuracion-backend | server.js, db.js, app.js, .env.example |
| G5 | feature/organizacion-proyecto | frontend/, backend/ |

Las ramas corresponden a la integración de funcionalidades.
Parte del desarrollo original se realizó fuera de GitHub.

## Historial de commits

```text
68b0200 refactor: organizar frontend y backend y limpiar registros asociados
f88488e feat: implementar calendario y registro de actividades
82061c3 feat: integrar foro comunitario con API y JWT
da1159b feat(C3): implementar panel administrativo y permisos por rol
34830e4 feat: implementar biblioteca de guias con permisos administrativos
a844e8a feat(A1-A5): integrar CRUD de huertas y permisos en frontend
5dd332e feat(B1-B4): integrar autenticacion JWT con frontend
11a33f5 fix: corregir servidor y configurar backend REST
b99bd01 Add trust proxy setting and update CORS origins
90ab420 Add threads routes for CRUD operations
e758aa5 Create Thread model with response schema
0d1345d Implement thread management controller functions
f3bdaec Add files via upload
749f816 Delete ecohuertos-paso1-backend.zip
0547eb4 Add files via upload
2f6b2af Docs: Agregar sección de backend y MongoDB Atlas al README
ea811a1 Docs: Agregar sección de backend y MongoDB Atlas al README
1fc2a97 Feat: Foro conectado a MongoDB Atlas, sección Nosotros y Términos y Condiciones
77a6b69 Feat: Conectar foro con MongoDB Atlas, actualizar Nosotros y agregar Términos y Condiciones
2c4be7e Update README.md
89fe32e Update README.md
20e58e7 Add files via upload
e8668ba Add files via upload
5f72c0d Add files via upload
88daa8f Delete styles.css
5647915 Delete script.js
1b0e900 Update styles.css
c6f892f Update script.js
f3e83e1 Eliminate redundant comments in index.html
d436c19 Replace comments with HTML comment syntax
0d8cd10 Update comment syntax for HTML sections
e3ea0a8 Update project status in README
2c331be Update footer text in index.html
05cffa2 Remove redundant comment from styles.css
6508a9b Update author roles in index.html
f348e88 Update project motivation and team member details
196655d Fix renderizarHuertas function call
4e95a8d Add styles for author card and avatar
9c5d3ad Add 'Nosotros' section with team details
eccdab8 Add authors to the footer of index.html
6d3e6cd Refactor session management and user handling
541e2f0 Add styles for form error messages
2f10f2b Update user information fields in index.html
81aaa01 Refactor huertas rendering and session handling
23e4330 Refactor styles and update color variables
e57d941 Update title and restructure header in index.html
341e389 Add initial styles for the website layout
e0b5d4b Add functionality to manage and display huertas
9e185b0 Add initial HTML structure for urban gardens platform
a9f9b78 Revise README with new project title and info
e9c66a6 Initial commit
```
