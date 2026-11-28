# Modelo general de EcoHuertos

Diagrama entidad-relación de la plataforma.

```mermaid
erDiagram
    USER ||--o{ HUERTA : posee
    USER ||--o{ GUIA : escribe
    USER ||--o{ ACTIVIDAD : registra
    HUERTA ||--o{ ACTIVIDAD : contiene
    THREAD ||--o{ RESPUESTA : contiene
    USER o|--o{ THREAD : publica
    USER o|--o{ RESPUESTA : responde

    USER {
        ObjectId _id PK
        string nombres
        string apellidos
        string username UK
        string email UK
        string password
        string role
        date createdAt
        date updatedAt
    }

    HUERTA {
        ObjectId _id PK
        string nombre
        string descripcion
        string ciudad
        string barrio
        string direccion
        string tipo
        array cultivos
        number areaM2
        ObjectId propietario FK
    }

    GUIA {
        ObjectId _id PK
        string titulo
        string resumen
        string contenido
        string categoria
        ObjectId autor FK
    }

    ACTIVIDAD {
        ObjectId _id PK
        string titulo
        string descripcion
        string tipo
        date fecha
        string estado
        ObjectId huerta FK
        ObjectId autor FK
    }

    THREAD {
        ObjectId _id PK
        string titulo
        string categoria
        string contenido
        string autor
        ObjectId autorId FK
        date fechaCreacion
        array respuestas
    }

    RESPUESTA {
        string autor
        ObjectId autorId FK
        string mensaje
        date fecha
    }
```

## Reglas del modelo

- Cada huerta pertenece a un usuario.
- Un usuario puede poseer varias huertas.
- Las contraseñas se almacenan mediante hash bcrypt.
- Los administradores gestionan las guías.
- Cada actividad pertenece a una huerta y tiene un autor.
- Las actividades pueden estar pendientes o completadas.
- Las respuestas se almacenan dentro de las publicaciones.
- Al eliminar una huerta se eliminan sus actividades.
- Al eliminar un usuario se eliminan sus huertas y las actividades correspondientes.

## Base de datos

MongoDB Atlas almacena la información mediante documentos.
Mongoose permite definir los modelos, validaciones y referencias.

El diagrama representa las relaciones lógicas del sistema.
Las respuestas del foro son documentos anidados.
