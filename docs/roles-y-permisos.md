# Roles y permisos

Roles: **visitante** (sin sesión), **usuario** (registrado) y **admin**.
Todo registro nuevo recibe el rol `usuario`; solo un admin puede cambiar el rol de otra persona.

| Operación | Visitante | Usuario | Admin |
|-----------|:---------:|:-------:|:-----:|
| Listar / consultar huertas (A1, A2) | ✅ | ✅ | ✅ |
| Crear una huerta (A3) | ❌ | ✅ | ✅ |
| Modificar una huerta (A4) | ❌ | Solo las suyas | Todas |
| Eliminar una huerta (A5) | ❌ | Solo las suyas | Todas |
| Ver «mis huertas» (C2) | ❌ | ✅ | ✅ |
| Listar / consultar guías (D1, D2) | ✅ | ✅ | ✅ |
| Crear / modificar / eliminar guías (D3–D5) | ❌ | ❌ | ✅ |
| Registrarse (B1) e iniciar sesión (B2) | ✅ | ✅ | ✅ |
| Ver perfil y cerrar sesión (B3, B4) | ❌ | ✅ | ✅ |
| Panel administrativo: estadísticas, usuarios, cambio de rol (E1–E4) | ❌ | ❌ | ✅ |

## Códigos de error asociados
- **401 Unauthorized**: no hay token, es inválido o expiró.
- **403 Forbidden**: hay sesión, pero el rol no permite la operación o el recurso pertenece a otra persona.

## Dónde se aplica en el código
- `middlewares/auth.js` (`protect`): verifica el JWT.
- `middlewares/role.js` (`restrictTo`): restringe por rol (C1).
- `utils/helpers.js` (`canManage`): verifica propiedad del recurso (C2).
