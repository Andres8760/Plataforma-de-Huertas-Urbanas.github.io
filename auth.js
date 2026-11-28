function iniciarSesion(usuario, token) {
    if (token) guardarToken(token);

    sesion = {
        id: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        usuario: usuario.username,
        correo: usuario.email,
        role: usuario.role
    };

    actualizarUISesion();
    if (typeof cargarGuias === "function") cargarGuias();
    sincronizarAutorForo();
    renderizarHuertas();
}

async function recuperarSesion() {
    if (!obtenerToken()) return;

    try {
        const resultado = await solicitarAPI("/auth/me");
        iniciarSesion(resultado.data);
    } catch (error) {
        eliminarToken();
        sesion = null;
    }
}

async function cerrarSesion() {
    try {
        await solicitarAPI("/auth/logout", {
            method: "POST"
        });
    } catch (error) {
        console.warn(error.message);
    } finally {
        eliminarToken();
        sesion = null;
        actualizarUISesion();
    if (typeof cargarGuias === "function") cargarGuias();
        sincronizarAutorForo();
    renderizarHuertas();

        if (pagina === "proyecto") {
            location.href = "index.html";
        }

        anunciar("Sesion cerrada.");
    }
}

document.getElementById("form-login").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    ocultarErrorFormulario("error-login");

    const identificador = document.getElementById("login-identificador").value.trim();
    const password = document.getElementById("login-clave").value;

    try {
        const resultado = await solicitarAPI("/auth/login", {
            method: "POST",
            body: JSON.stringify({ identificador, password })
        });

        iniciarSesion(resultado.data.user, resultado.data.token);
        cerrarModal(modalLogin);
        evento.target.reset();
        anunciar("Sesion iniciada correctamente.");
    } catch (error) {
        mostrarErrorFormulario("error-login", error.message);
    }
});

document.getElementById("form-registro").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    ocultarErrorFormulario("error-registro");

    const datos = {
        nombres: document.getElementById("registro-nombres").value.trim(),
        apellidos: document.getElementById("registro-apellidos").value.trim(),
        username: document.getElementById("registro-usuario").value.trim(),
        email: document.getElementById("registro-correo").value.trim(),
        password: document.getElementById("registro-clave").value
    };

    try {
        const resultado = await solicitarAPI("/auth/register", {
            method: "POST",
            body: JSON.stringify(datos)
        });

        iniciarSesion(resultado.data.user, resultado.data.token);
        cerrarModal(modalRegistro);
        evento.target.reset();
        anunciar("Cuenta creada correctamente.");
    } catch (error) {
        mostrarErrorFormulario("error-registro", error.message);
    }
});

document.getElementById("btn-salir").addEventListener("click", cerrarSesion);

async function iniciarPagina() {
    localStorage.removeItem("ecohuertos_usuarios");
    localStorage.removeItem("ecohuertos_sesion");

    await recuperarSesion();

    actualizarUISesion();
    if (typeof cargarGuias === "function") cargarGuias();
    sincronizarAutorForo();
    renderizarHuertas();
    renderizarHuertas();

    if (pagina === "proyecto") {
        if (!sesion) {
            location.replace("index.html?login=1");
            return;
        }

        panelDesdeHash();
        window.addEventListener("hashchange", panelDesdeHash);
    }

    if (new URLSearchParams(location.search).get("login") === "1" && !sesion) {
        abrirModal(modalLogin);
        history.replaceState(null, "", location.pathname);
    }
}

iniciarPagina();
