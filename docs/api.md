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

### Error de validación (400)
```json
{ "ok": false, "mensaje": "Datos inválidos", "detalles": [ { "campo": "nombre", "mensaje": "El nombre debe tener entre 2 y 100 caracteres" } ] }
```

### Error de autorización (403)
`PUT /huertas/:id` sobre una huerta ajena con rol `usuario`:
```json
{ "ok": false, "mensaje": "Solo puedes modificar tus propias huertas" }
```

## Foro comunitario

| Método | Ruta | Autenticación | Roles | HTTP |
|---|---|---|---|---|
| GET | /api/threads | No | Todos | 200 |
| POST | /api/threads | Sí | usuario, admin | 201 |
| POST | /api/threads/:id/replies | Sí | usuario, admin | 200 |
| DELETE | /api/threads/:id | Sí | admin | 200 |

Los autores se obtienen del usuario autenticado mediante JWT.

### Crear una publicación

POST /api/threads

Ejemplo de petición:

    {
      "titulo": "Cultivo de tomate",
      "categoria": "CATEGORIA_VALIDA",
      "contenido": "Compartamos consejos para cultivar tomates."
    }

La categoría debe corresponder a una opción permitida por el formulario y el modelo Thread.

Respuesta ilustrativa:

    {
      "ok": true,
      "data": {
        "titulo": "Cultivo de tomate",
        "autor": "vecina"
      }
    }

### Responder una publicación

POST /api/threads/:id/replies

Ejemplo de petición:

    {
      "mensaje": "Recomiendo preparar el suelo con compost."
    }

### Eliminar una publicación

DELETE /api/threads/:id

Requiere autenticación y rol administrador.

La eliminación incluye las respuestas almacenadas en la publicación.

## Calendario y actividades

| Método | Ruta | Autenticación | Roles | HTTP |
|---|---|---|---|---|
| GET | /api/actividades | No | Todos | 200 |
| POST | /api/actividades | Sí | Propietario o admin | 201 |
| PATCH | /api/actividades/:id | Sí | Propietario o admin | 200 |
| DELETE | /api/actividades/:id | Sí | Propietario o admin | 200 |

Tipos de actividades:

- siembra
- cosecha
- riego
- mantenimiento
- taller

Estados permitidos: pendiente y completada.

### Registrar una actividad

POST /api/actividades

Ejemplo de petición:

    {
      "titulo": "Sembrar tomates",
      "descripcion": "Preparar semillas y suelo.",
      "tipo": "siembra",
      "fecha": "2026-12-01",
      "huerta": "ID_DE_LA_HUERTA"
    }

Respuesta HTTP 201, simplificada:

    {
      "ok": true,
      "mensaje": "Actividad registrada",
      "data": {
        "titulo": "Sembrar tomates",
        "estado": "pendiente"
      }
    }

### Modificar una actividad

PATCH /api/actividades/:id

Ejemplo de petición:

    {
      "titulo": "Sembrar tomates y lechugas",
      "fecha": "2026-12-05"
    }

### Completar una actividad

PATCH /api/actividades/:id

Ejemplo de petición:

    {
      "estado": "completada"
    }

Respuesta HTTP 200, simplificada:

    {
      "ok": true,
      "mensaje": "Actividad actualizada"
    }

### Eliminar una actividad

DELETE /api/actividades/:id

Respuesta HTTP 200:

    {
      "ok": true,
      "mensaje": "Actividad eliminada"
    }

Al eliminar una huerta también se eliminan sus actividades asociadas.

Los identificadores utilizados deben corresponder a documentos existentes en MongoDB.

## Ejemplos de administración

### Consultar estadísticas

GET /api/admin/stats

Respuesta ilustrativa:

    {
      "ok": true,
      "data": {
        "usuarios": 4,
        "admins": 1,
        "huertas": 2,
        "guias": 1
      }
    }

### Cambiar el rol de un usuario

PATCH /api/admin/users/:id/role

Petición:

    {
      "role": "usuario"
    }

Los roles permitidos son usuario y admin.

## Seguridad de las peticiones

Las rutas protegidas requieren el encabezado:

    Authorization: Bearer TOKEN_JWT

Las peticiones con cuerpo JSON requieren:

    Content-Type: application/json

## Códigos de respuesta

| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos |
| 401 | Autenticación requerida |
| 403 | Permisos insuficientes |
| 404 | Recurso no encontrado |
| 409 | Conflicto de datos |
| 429 | Límite de peticiones superado |
| 500 | Error interno |

## Consideraciones

- Las contraseñas se almacenan mediante hash bcrypt.
- Los permisos se verifican en el backend.
- El cierre de sesión elimina el JWT del cliente.
- Los JWT emitidos conservan su validez hasta su expiración.
- Las credenciales se gestionan mediante variables de entorno.
- Las respuestas ilustrativas pueden omitir campos automáticos de MongoDB.
