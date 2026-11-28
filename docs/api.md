# Documentación de la API

Base URL local: `http://localhost:3000/api` · Formato: JSON.
Autenticación: cabecera `Authorization: Bearer <token>`.
Respuestas correctas: `{ "ok": true, "data": ... }`. Errores: `{ "ok": false, "mensaje": "...", "detalles": [...] }`.

## Endpoints

| Método | Ruta | Auth | Roles | Código éxito | Descripción |
|--------|------|:----:|-------|:------------:|-------------|
| GET | `/health` | No | — | 200 | Estado de la API |
| POST | `/auth/register` | No | — | 201 | B1. Registrar usuario |
| POST | `/auth/login` | No | — | 200 | B2. Iniciar sesión, devuelve JWT |
| GET | `/auth/me` | Sí | usuario, admin | 200 | B3. Perfil del usuario autenticado |
| POST | `/auth/logout` | Sí | usuario, admin | 200 | B4. Cerrar sesión |
| GET | `/huertas` | No | — | 200 | A1. Listar huertas (`?q=&ciudad=&tipo=&page=&limit=`) |
| GET | `/huertas/mias` | Sí | usuario, admin | 200 | C2. Huertas del usuario autenticado |
| GET | `/huertas/:id` | No | — | 200 | A2. Detalle de una huerta |
| POST | `/huertas` | Sí | usuario, admin | 201 | A3. Crear huerta |
| PUT | `/huertas/:id` | Sí | usuario (propias), admin | 200 | A4. Modificar huerta (solo los campos enviados) |
| DELETE | `/huertas/:id` | Sí | usuario (propias), admin | 200 | A5. Eliminar huerta |
| GET | `/guias` | No | — | 200 | D1. Listar guías (`?q=&categoria=&page=&limit=`) |
| GET | `/guias/:id` | No | — | 200 | D2. Detalle de una guía |
| POST | `/guias` | Sí | admin | 201 | D3. Crear guía |
| PUT | `/guias/:id` | Sí | admin | 200 | D4. Modificar guía |
| DELETE | `/guias/:id` | Sí | admin | 200 | D5. Eliminar guía |
| GET | `/admin/stats` | Sí | admin | 200 | E1. Estadísticas |
| GET | `/admin/users` | Sí | admin | 200 | E2. Listar usuarios |
| PATCH | `/admin/users/:id/role` | Sí | admin | 200 | E3. Cambiar rol |
| DELETE | `/admin/users/:id` | Sí | admin | 200 | E4. Eliminar usuario |
| GET | `/threads` | No | — | 200 | G1. Listar hilos del foro (`?page=&limit=`) |
| POST | `/threads` | Sí | usuario, admin | 201 | G2. Publicar un hilo |
| POST | `/threads/:id/replies` | Sí | usuario, admin | 201 | G3. Responder a un hilo |
| DELETE | `/threads/:id` | Sí | admin | 200 | G4. Eliminar un hilo (moderación) |

## Códigos de estado usados
200 OK · 201 Created · 400 datos inválidos · 401 sin sesión/token inválido · 403 sin permiso · 404 no encontrado · 409 duplicado (usuario/correo) · 429 demasiados intentos · 500 error del servidor.

## Ejemplos

### POST `/auth/register`
```json
{
  "nombres": "Ana", "apellidos": "Pérez", "username": "anap",
  "email": "ana@correo.com", "password": "Clave12345"
}
```
Respuesta `201`:
```json
{
  "ok": true, "mensaje": "Cuenta creada",
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "_id": "665f...", "nombres": "Ana", "apellidos": "Pérez", "username": "anap", "email": "ana@correo.com", "role": "usuario" }
  }
}
```
La contraseña debe tener 8-72 caracteres, con letras y números.

### POST `/auth/login`
```json
{ "identificador": "anap", "password": "Clave12345" }
```
`identificador` acepta usuario o correo. Respuesta `200` igual a la del registro. Credenciales erróneas → `401`.

### POST `/huertas` (requiere token)
```json
{
  "nombre": "Huerta La Esperanza", "ciudad": "Cali", "barrio": "San Antonio",
  "tipo": "comunitaria", "cultivos": ["lechuga", "tomate"], "areaM2": 40
}
```
Respuesta `201`:
```json
{
  "ok": true, "mensaje": "Huerta creada",
  "data": { "_id": "6660...", "nombre": "Huerta La Esperanza", "ciudad": "Cali", "propietario": "665f...", "tipo": "comunitaria" }
}
```

### POST `/threads` (requiere token)
Categorías válidas: `Compostaje`, `Control de Plagas`, `Siembra Urbana`, `Riego`, `General` (por defecto).
El autor se toma del token; no se envía en el cuerpo.
```json
{
  "titulo": "¿Cómo preparar compostaje casero sin malos olores?",
  "categoria": "Compostaje",
  "contenido": "Tengo un balcón pequeño y quiero empezar a compostar."
}
```
Respuesta `201`:
```json
{
  "ok": true, "mensaje": "Hilo publicado",
  "data": { "_id": "6661...", "titulo": "¿Cómo preparar compostaje casero sin malos olores?", "autor": "anap", "categoria": "Compostaje", "respuestas": [] }
}
```

### POST `/threads/:id/replies` (requiere token)
```json
{ "mensaje": "Mezcla restos de cocina con hojas secas y airea cada semana." }
```
Respuesta `201` con el hilo actualizado (`data.respuestas` incluye la nueva respuesta).

### Error de validación (400)
```json
{ "ok": false, "mensaje": "Datos inválidos", "detalles": [ { "campo": "nombre", "mensaje": "El nombre debe tener entre 2 y 100 caracteres" } ] }
```

### Sin sesión (401)
`POST /threads` sin cabecera `Authorization`:
```json
{ "ok": false, "mensaje": "Debes iniciar sesión" }
```

### Error de autorización (403)
`PUT /huertas/:id` sobre una huerta ajena con rol `usuario`:
```json
{ "ok": false, "mensaje": "Solo puedes modificar tus propias huertas" }
```
