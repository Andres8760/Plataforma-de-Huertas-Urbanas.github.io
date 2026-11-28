# Roles y permisos de EcoHuertos

## Roles del sistema

- Visitante: persona sin una sesión iniciada.
- Usuario: persona registrada en la plataforma.
- Admin: administrador de la plataforma.

## Matriz de permisos

| Operación | Visitante | Usuario | Admin |
|---|---|---|---|
| Registrarse | Sí | Sí | Sí |
| Iniciar sesión | Sí | Sí | Sí |
| Consultar perfil | No | Propio | Propio |
| Cerrar sesión | No | Sí | Sí |
| Listar huertas | Sí | Sí | Sí |
| Consultar detalle de huerta | Sí | Sí | Sí |
| Crear huertas | No | Sí | Sí |
| Modificar huertas | No | Propias | Todas |
| Eliminar huertas | No | Propias | Todas |
| Consultar mis huertas | No | Sí | Sí |
| Consultar calendario | Sí | Sí | Sí |
| Registrar actividades | No | Huertas propias | Todas |
| Editar actividades | No | Huertas propias | Todas |
| Completar actividades | No | Huertas propias | Todas |
| Eliminar actividades | No | Huertas propias | Todas |
| Consultar publicaciones | Sí | Sí | Sí |
| Crear publicaciones | No | Sí | Sí |
| Responder publicaciones | No | Sí | Sí |
| Eliminar publicaciones | No | No | Sí |
| Listar guías | Sí | Sí | Sí |
| Leer guías | Sí | Sí | Sí |
| Crear guías | No | No | Sí |
| Editar guías | No | No | Sí |
| Eliminar guías | No | No | Sí |
| Acceder al panel administrativo | No | No | Sí |
| Consultar estadísticas | No | No | Sí |
| Listar usuarios | No | No | Sí |
| Cambiar roles | No | No | Sí |
| Eliminar usuarios | No | No | Sí |

## Aplicación de permisos

- protect: verifica la autenticación mediante JWT.
- restrictTo: verifica los roles autorizados.
- canManage: comprueba la propiedad de las huertas.
- comprobarHuerta: comprueba los permisos sobre las actividades.
- auth.js del frontend: adapta la interfaz según la sesión y el rol.

Los usuarios nuevos reciben el rol usuario.

Los permisos se verifican en el servidor.
Ocultar botones en el frontend no sustituye la autorización.

## Respuestas HTTP

- 200: operación realizada correctamente.
- 201: recurso creado correctamente.
- 400: datos inválidos.
- 401: autenticación requerida o token inválido.
- 403: permisos insuficientes.
- 404: recurso no encontrado.
- 429: límite de peticiones superado.
- 500: error interno del servidor.

## Restricciones adicionales

- Los usuarios normales no pueden gestionar huertas ajenas.
- Los usuarios normales no pueden acceder a funciones administrativas.
- La interfaz impide que el administrador elimine su propia cuenta o cambie su propio rol.
- El cierre de sesión elimina el token almacenado en el navegador.
- Los tokens JWT emitidos conservan su validez hasta su expiración.
