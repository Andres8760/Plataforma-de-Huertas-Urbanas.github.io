# EcoHuertos - Backend

API REST desarrollada con Node.js, Express, MongoDB Atlas y Mongoose.

## Instalación

    npm ci
    cp -n .env.example .env

Configurar las variables de entorno con las credenciales propias.

## Ejecución

    npm run seed
    npm run dev

El servidor utiliza el puerto 3000.

## Comprobar el servidor

    curl http://localhost:3000/api/health

## Funcionalidades

- Registro y autenticación JWT.
- Autorización por roles.
- CRUD de huertas.
- Biblioteca de guías.
- Foro comunitario.
- Calendario y actividades.
- Panel administrativo.

## Seguridad

- Hash de contraseñas con bcrypt.
- Validación de datos con express-validator.
- Protección HTTP con Helmet.
- Control de orígenes mediante CORS.
- Limitación de peticiones.
- Variables de entorno para credenciales.

## Documentación

- [README principal](../README.md)
- [API REST](../docs/api.md)
- [Roles y permisos](../docs/roles-y-permisos.md)
- [Modelo general](../docs/modelo-general.md)
- [Características FDD](../docs/lista-de-caracteristicas.md)

## Despliegue

El backend se ejecuta mediante GitHub Codespaces.
El puerto 3000 debe estar disponible para el frontend.

El espacio de código debe permanecer activo para atender peticiones.
