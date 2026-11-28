# Modelo general

Diagrama entidad-relación (se visualiza en GitHub gracias a Mermaid).

```mermaid
erDiagram
    USER ||--o{ HUERTA : "es propietario de"
    USER ||--o{ GUIA : "escribe (solo admin)"
    USER ||--o{ THREAD : "publica"
    THREAD ||--o{ RESPUESTA : "contiene"

    USER {
        ObjectId _id
        string nombres
        string apellidos
        string username UK
        string email UK
        string password "hash bcrypt"
        string role "usuario | admin"
        date createdAt
    }
    HUERTA {
        ObjectId _id
        string nombre
        string descripcion
        string ciudad
        string barrio
        string direccion
        string tipo "comunitaria | escolar | familiar | institucional"
        string[] cultivos
        number areaM2
        ObjectId propietario FK
        date createdAt
    }
    GUIA {
        ObjectId _id
        string titulo
        string resumen
        string contenido
        string categoria "suelo | siembra | riego | plagas | compostaje | cosecha | general"
        ObjectId autor FK
        date createdAt
    }
    THREAD {
        ObjectId _id
        string titulo
        string contenido
        string categoria "Compostaje | Control de Plagas | Siembra Urbana | Riego | General"
        string autor "username tomado del token"
        ObjectId autorId FK
        date fechaCreacion
    }
    RESPUESTA {
        string autor "username tomado del token"
        ObjectId autorId FK
        string mensaje
        date fecha
    }
```

## Reglas del modelo
- Un usuario puede tener muchas huertas; cada huerta pertenece a un solo propietario.
- Al eliminar un usuario desde el panel admin se eliminan también sus huertas.
- Las respuestas del foro son subdocumentos embebidos dentro de su hilo (`THREAD.respuestas`).
- En el foro, el autor se toma siempre del token JWT, nunca del cuerpo de la petición (no se puede suplantar).
- La contraseña nunca se devuelve en las respuestas de la API.
