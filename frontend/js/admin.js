const contenidoAdmin = document.getElementById("contenido-admin");
const usuariosAdmin = document.getElementById("usuarios-admin");
const estadisticasAdmin = document.getElementById("estadisticas-admin");

function mensajeAdmin(texto) {
    document.getElementById("mensaje-admin").textContent = texto;
}

async function cargarPanelAdmin() {
    contenidoAdmin.hidden = true;
    usuariosAdmin.replaceChildren();
    estadisticasAdmin.replaceChildren();

    if (sesion?.role !== "admin") {
        mensajeAdmin("Acceso restringido a administradores.");
        return;
    }

    try {
        await cargarEstadisticas();
        await cargarUsuarios();

        if (sesion?.role === "admin") {
            contenidoAdmin.hidden = false;
            mensajeAdmin("");
        }
    } catch (error) {
        mensajeAdmin(error.message);
    }
}

async function cargarEstadisticas() {
    const r = await solicitarAPI("/admin/stats");

    estadisticasAdmin.replaceChildren();

    const datos = [
        ["Usuarios", r.data.usuarios],
        ["Administradores", r.data.admins],
        ["Huertas", r.data.huertas],
        ["Guias", r.data.guias]
    ];

    datos.forEach(([nombre, cantidad]) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-estadistica";

        const titulo = document.createElement("h3");
        titulo.textContent = nombre;

        const numero = document.createElement("strong");
        numero.textContent = cantidad;

        tarjeta.append(titulo, numero);
        estadisticasAdmin.appendChild(tarjeta);
    });
}

async function cargarUsuarios() {
    const r = await solicitarAPI("/admin/users");
    const usuarios = [...r.data];

    for (let i = 2; i <= r.paginacion.paginas; i++) {
        const siguiente = await solicitarAPI("/admin/users?page=" + i);
        usuarios.push(...siguiente.data);
    }

    usuariosAdmin.replaceChildren();

    usuarios.forEach(u => {
        const fila = document.createElement("tr");

        const datos = [
            u.nombres + " " + u.apellidos,
            u.username,
            u.email,
            u.role
        ];

        datos.forEach(valor => {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const acciones = document.createElement("td");

        if (String(u._id) !== String(sesion?.id)) {
            acciones.appendChild(
                botonHuerta("Cambiar rol", () => cambiarRolUsuario(u))
            );

            acciones.appendChild(
                botonHuerta("Eliminar", () => eliminarUsuarioAdmin(u))
            );
        } else {
            acciones.textContent = "Tu cuenta";
        }

        fila.appendChild(acciones);
        usuariosAdmin.appendChild(fila);
    });
}

async function cambiarRolUsuario(usuario) {
    if (sesion?.role !== "admin") return;

    const nuevoRol = usuario.role === "admin" ? "usuario" : "admin";

    if (!confirm("Cambiar el rol de " + usuario.username + " a " + nuevoRol + "?")) {
        return;
    }

    try {
        await solicitarAPI("/admin/users/" + usuario._id + "/role", {
            method: "PATCH",
            body: JSON.stringify({ role: nuevoRol })
        });

        await cargarPanelAdmin();
        mensajeAdmin("Rol actualizado correctamente.");
    } catch (error) {
        mensajeAdmin(error.message);
    }
}

async function eliminarUsuarioAdmin(usuario) {
    if (sesion?.role !== "admin") return;

    if (String(usuario._id) === String(sesion.id)) {
        mensajeAdmin("No puedes eliminar tu propia cuenta.");
        return;
    }

    if (!confirm("Eliminar definitivamente al usuario " + usuario.username + "?")) {
        return;
    }

    try {
        await solicitarAPI("/admin/users/" + usuario._id, {
            method: "DELETE"
        });

        await cargarPanelAdmin();
        mensajeAdmin("Usuario eliminado correctamente.");
    } catch (error) {
        mensajeAdmin(error.message);
    }
}
