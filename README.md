# EcoHuertos - Plataforma de Huertas Urbanas Colaborativas

Plataforma web orientada a fortalecer la soberanía alimentaria,
la sostenibilidad ambiental y la educación mediante la gestión
colaborativa de huertas urbanas.

## Integrantes

| Integrante | Responsabilidad |
|---|---|
| Darlyn Dayana Grisales Orozco | Controladores, rutas, modelo Thread y validación del backend. |
| David Alejandro Clavijo Guevara | Configuración de MongoDB Atlas, conexión a la base de datos y servidor. |
| Andres Felipe Gelpud Calvache | Desarrollo frontend, integración de API REST, autenticación, CRUD, roles, biblioteca, administración, calendario, actividades, pruebas y documentación. |

## Objetivos de Desarrollo Sostenible

- ODS 2: Hambre cero.
- ODS 4: Educación de calidad.
- ODS 11: Ciudades y comunidades sostenibles.
- ODS 12: Producción y consumo responsables.

## Funcionalidades

- Registro e inicio de sesión mediante JWT.
- CRUD de huertas comunitarias.
- Calendario de siembra y cosecha.
- Registro y seguimiento de actividades.
- Foro comunitario con publicaciones y respuestas.
- Biblioteca de guías.
- Panel administrativo con gestión de usuarios y roles.

## Tecnologías

- Frontend: HTML5, CSS3 y JavaScript.
- Backend: Node.js y Express.
- Base de datos: MongoDB Atlas y Mongoose.
- Autenticación: JWT.
- Seguridad: bcryptjs, Helmet, CORS y express-rate-limit.
- Validación: express-validator.
- Control de versiones: Git y GitHub.
- Entorno de desarrollo: GitHub Codespaces.

MongoDB permite almacenar documentos relacionados con usuarios,
huertas, guías, actividades y publicaciones comunitarias.

## Trabajo colaborativo

El proyecto fue desarrollado por tres integrantes.

- Darlyn: controladores, rutas, Thread y validación del backend.
- David: MongoDB Atlas, conexión a la base de datos y servidor.
- Andres: desarrollo restante, frontend, integración, funcionalidades, pruebas y documentación.

Parte del desarrollo se realizó fuera de GitHub y posteriormente se integró al repositorio.

## Estado

Las siete funcionalidades del MVP están implementadas y probadas manualmente:

- Registro de usuarios.
- Gestión de huertas comunitarias.
- Calendario de siembra y cosecha.
- Registro de actividades.
- Foro comunitario.
- Biblioteca de guías.
- Panel administrativo.

El sistema cuenta con API REST, JWT, roles de usuario y administrador, MongoDB y comunicación asíncrona mediante fetch.

## Requisitos

- Node.js 22 o superior.
- npm, Python 3 y Git.
- MongoDB Atlas.

## Ejecutar el backend

    cd backend
    npm ci
    cp -n .env.example .env

Configurar las credenciales en .env y ejecutar:

    npm run seed
    npm run dev

El backend funciona en el puerto 3000.

## Ejecutar el frontend

Desde otra terminal:

    cd frontend
    python3 -m http.server 5500 --bind 0.0.0.0

En Codespaces, abrir el puerto 5500 en el navegador.
El puerto 3000 debe ser público para consumir la API externa.

Configurar la dirección del backend en frontend/js/api.js
y los orígenes permitidos en CORS_ORIGINS.

## Variables de entorno

| Variable | Descripción |
|---|---|
| PORT | Puerto del servidor |
| MONGODB_URI | Conexión a MongoDB Atlas |
| JWT_SECRET | Clave secreta de autenticación |
| JWT_EXPIRES_IN | Duración del token |
| BCRYPT_ROUNDS | Costo del hash de contraseñas |
| CORS_ORIGINS | Orígenes permitidos |
| SEED_ADMIN_PASSWORD | Contraseña del administrador de prueba |
| SEED_USER_PASSWORD | Contraseña del usuario de prueba |

Consultar backend/.env.example.
Nunca publicar el archivo .env con credenciales reales.

## Usuarios de prueba

| Rol | Usuario | Correo | Contraseña |
|---|---|---|---|
| Administrador | admin | admin@ecohuertos.test | SEED_ADMIN_PASSWORD |
| Usuario | vecina | usuario@ecohuertos.test | SEED_USER_PASSWORD |

Las contraseñas se configuran en el archivo .env.
Las cuentas se crean mediante npm run seed.

## Estructura del proyecto

    backend/
        src/
            config/
            controllers/
            middlewares/
            models/
            routes/
            utils/
        package.json
        .env.example
    frontend/
        css/
        js/
        assets/
        index.html
    docs/
    README.md
    .gitignore

## Documentación

- [Lista de características FDD](docs/lista-de-caracteristicas.md)
- [Modelo general](docs/modelo-general.md)
- [Roles y permisos](docs/roles-y-permisos.md)
- [Documentación de la API REST](docs/api.md)

## Consideraciones de despliegue

GitHub Pages aloja el frontend.
GitHub Codespaces ejecuta el backend.
El espacio de código debe permanecer activo para que la API funcione.
