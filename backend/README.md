# EcoHuertos · Backend (API REST)

Node.js + Express + MongoDB (Mongoose). Autenticación con JWT y autorización por roles (`usuario`, `admin`).
Recursos: huertas, guías, foro (hilos y respuestas) y panel administrativo.

## Requisitos
- Node.js 18.11 o superior
- Una base MongoDB: cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas) o MongoDB local

## Instalación y ejecución
```bash
cd backend
npm install
cp .env.example .env      # en Windows: copy .env.example .env
# edita .env: MONGODB_URI y JWT_SECRET
npm run seed              # crea usuarios de prueba y datos de ejemplo
npm run dev               # desarrollo (o: npm start)
```
La API queda en `http://localhost:3000/api`. Comprueba con `http://localhost:3000/api/health`.

> Si venías usando la versión anterior del foro: la variable de conexión ahora se llama `MONGODB_URI` (antes `MONGO_URI`).

## Variables de entorno
| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (3000) |
| `MONGODB_URI` | Cadena de conexión de MongoDB |
| `JWT_SECRET` | Clave para firmar tokens (mínimo 16 caracteres) |
| `JWT_EXPIRES_IN` | Duración del token (ej. `2h`) |
| `BCRYPT_ROUNDS` | Costo del hash de contraseñas |
| `CORS_ORIGINS` | Orígenes del front permitidos, separados por coma (sin barra final) |
| `TRUST_PROXY` | Opcional. `1` si la API corre detrás de un proxy (Codespaces, Render...) |
| `SEED_ADMIN_PASSWORD`, `SEED_USER_PASSWORD` | Contraseñas de los usuarios de prueba |

## Usuarios de prueba (tras `npm run seed`)
| Rol | Correo | Contraseña |
|-----|--------|-----------|
| admin | admin@ecohuertos.test | Admin12345 |
| usuario | usuario@ecohuertos.test | Usuario12345 |

## Probar rápido con curl
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" \
  -d '{"identificador":"usuario@ecohuertos.test","password":"Usuario12345"}'

curl http://localhost:3000/api/huertas
curl http://localhost:3000/api/threads
```

## Estructura
```
src/
  config/        conexión a la base de datos
  controllers/   lógica de cada recurso
  middlewares/   auth (JWT), role (permisos), validate, errorHandler
  models/        User, Huerta, Guia, Thread
  routes/        definición de endpoints y reglas de validación
  utils/         JWT, errores, helpers
  app.js         configuración de Express
  server.js      arranque
  seed.js        datos de prueba
```
Documentación de endpoints: [`/docs/api.md`](../docs/api.md) · Roles: [`/docs/roles-y-permisos.md`](../docs/roles-y-permisos.md)
