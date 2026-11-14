/* ===================== DATOS (localStorage) ===================== */

function leerLS(clave, porDefecto) {
    try {
        const valor = JSON.parse(localStorage.getItem(clave));
        return valor === null || valor === undefined ? porDefecto : valor;
    } catch (error) {
        return porDefecto;
    }
}

let huertas = leerLS("ecohuertos_huertas", []);
let usuarios = leerLS("ecohuertos_usuarios", []);
let sesion = leerLS("ecohuertos_sesion", null); // null = invitado

function guardarHuertas() {
    localStorage.setItem("ecohuertos_huertas", JSON.stringify(huertas));
}

function guardarUsuarios() {
    localStorage.setItem("ecohuertos_usuarios", JSON.stringify(usuarios));
}

function guardarSesion() {
    if (sesion) {
        localStorage.setItem("ecohuertos_sesion", JSON.stringify(sesion));
    } else {
        localStorage.removeItem("ecohuertos_sesion");
    }
}

function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

/* ===================== ELEMENTOS COMUNES ===================== */

const pagina = document.body.dataset.pagina;

const authInvitado = document.getElementById("auth-invitado");
const authUsuario = document.getElementById("auth-usuario");
const nombreUsuarioSpan = document.getElementById("nombre-usuario");
const tabProyecto = document.getElementById("tab-proyecto");

const modalLogin = document.getElementById("modal-login");
const modalRegistro = document.getElementById("modal-registro");

const formulario = document.getElementById("form-huerta");
const contenedorHuertas = document.getElementById("contenedor-huertas");
const contenedorMisHuertas = document.getElementById("contenedor-mis-huertas");

/* ===================== HUERTAS ===================== */

function crearTarjetaHuerta(huerta) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-caso";
    tarjeta.innerHTML = `
        <h3>${escaparHTML(huerta.nombre)}</h3>
        <p>Ubicación: ${escaparHTML(huerta.ubicacion)}</p>
        <p>Cultivo: ${escaparHTML(huerta.cultivo)}</p>
        ${huerta.autor ? `<p>Registrada por: ${escaparHTML(huerta.autor)}</p>` : ""}
    `;
    return tarjeta;
}

function renderizarHuertas() {
    if (!contenedorHuertas) return;

    contenedorHuertas.innerHTML = "";

    if (huertas.length === 0) {
        contenedorHuertas.innerHTML = "<p>Aún no hay huertas registradas.</p>";
        return;
    }

    huertas.forEach(huerta => {
        contenedorHuertas.appendChild(crearTarjetaHuerta(huerta));
    });
}

function renderizarMisHuertas() {
    if (!contenedorMisHuertas) return;

    contenedorMisHuertas.innerHTML = "";

    if (!sesion) {
        contenedorMisHuertas.innerHTML = "<p>Inicia sesión para ver tus huertas registradas.</p>";
        return;
    }

    const misHuertas = huertas.filter(h => h.autor === sesion.usuario);

    if (misHuertas.length === 0) {
        contenedorMisHuertas.innerHTML = "<p>Todavía no has registrado ninguna huerta.</p>";
        return;
    }

    misHuertas.forEach(huerta => {
        contenedorMisHuertas.appendChild(crearTarjetaHuerta(huerta));
    });
}

if (formulario) {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        huertas.push({
            nombre: document.getElementById("nombre").value.trim(),
            ubicacion: document.getElementById("ubicacion").value.trim(),
            cultivo: document.getElementById("cultivo").value.trim(),
            autor: sesion ? sesion.usuario : null
        });

        guardarHuertas();
        renderizarHuertas();
        formulario.reset();
    });
}

/* ===================== SUBPESTAÑAS (Mi proyecto) ===================== */

const subtabs = document.querySelectorAll(".subtab");
const paneles = document.querySelectorAll(".panel");

function activarPanel(idPanel) {
    if (!document.getElementById(idPanel)) return;

    subtabs.forEach(s => s.classList.toggle("subtab-activa", s.dataset.panel === idPanel));
    paneles.forEach(p => p.classList.toggle("panel-activo", p.id === idPanel));
}

subtabs.forEach(subtab => {
    subtab.addEventListener("click", (evento) => {
        evento.preventDefault();
        activarPanel(subtab.dataset.panel);
        history.replaceState(null, "", subtab.getAttribute("href"));
    });
});

function panelDesdeHash() {
    const enlace = document.querySelector(`.subtab[href="${location.hash}"]`);
    if (enlace) activarPanel(enlace.dataset.panel);
}

/* ===================== MODALES ===================== */

function abrirModal(modal) {
    modal.classList.remove("oculto");
}

function cerrarModal(modal) {
    modal.classList.add("oculto");
}

document.getElementById("btn-abrir-login").addEventListener("click", () => abrirModal(modalLogin));
document.getElementById("btn-abrir-registro").addEventListener("click", () => abrirModal(modalRegistro));

document.querySelectorAll("[data-cerrar]").forEach(boton => {
    boton.addEventListener("click", () => {
        cerrarModal(document.getElementById(boton.dataset.cerrar));
    });
});

[modalLogin, modalRegistro].forEach(modal => {
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) cerrarModal(modal);
    });
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarModal(modalLogin);
        cerrarModal(modalRegistro);
    }
});

function mostrarErrorFormulario(idError, mensaje) {
    const elemento = document.getElementById(idError);
    elemento.textContent = mensaje;
    elemento.classList.remove("oculto");
}

function ocultarErrorFormulario(idError) {
    document.getElementById(idError).classList.add("oculto");
}

/* ===================== SESIÓN ===================== */

function actualizarUISesion() {
    if (sesion) {
        authInvitado.classList.add("oculto");
        authUsuario.classList.remove("oculto");
        nombreUsuarioSpan.textContent = sesion.usuario;
        tabProyecto.classList.remove("oculto");

        const nombreCompleto = document.getElementById("info-nombre-completo");
        if (nombreCompleto) {
            nombreCompleto.textContent = `${sesion.nombres} ${sesion.apellidos}`;
            document.getElementById("info-usuario").textContent = sesion.usuario;
            document.getElementById("info-correo").textContent = sesion.correo;
        }
    } else {
        authUsuario.classList.add("oculto");
        authInvitado.classList.remove("oculto");
        tabProyecto.classList.add("oculto");
    }

    renderizarMisHuertas();
}

function iniciarSesion(usuario) {
    // La contraseña no se guarda en la sesión, solo en la lista de usuarios
    sesion = {
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        usuario: usuario.usuario,
        correo: usuario.correo
    };
    guardarSesion();
    actualizarUISesion();
}

function cerrarSesion() {
    sesion = null;
    guardarSesion();
    // "Mi proyecto" es privado: si estás ahí, vuelves al inicio
    if (pagina === "proyecto") {
        window.location.href = "index.html";
        return;
    }
    actualizarUISesion();
}

document.getElementById("form-login").addEventListener("submit", (evento) => {
    evento.preventDefault();
    ocultarErrorFormulario("error-login");

    const identificador = document.getElementById("login-identificador").value.trim().toLowerCase();
    const clave = document.getElementById("login-clave").value;

    const usuario = usuarios.find(u =>
        u.usuario.toLowerCase() === identificador || u.correo.toLowerCase() === identificador
    );

    if (!usuario) {
        mostrarErrorFormulario("error-login", "No encontramos una cuenta con ese usuario o correo.");
        return;
    }

    if (usuario.clave !== clave) {
        mostrarErrorFormulario("error-login", "La contraseña es incorrecta.");
        return;
    }

    iniciarSesion(usuario);
    cerrarModal(modalLogin);
    evento.target.reset();
});

document.getElementById("form-registro").addEventListener("submit", (evento) => {
    evento.preventDefault();
    ocultarErrorFormulario("error-registro");

    const nombres = document.getElementById("registro-nombres").value.trim();
    const apellidos = document.getElementById("registro-apellidos").value.trim();
    const usuario = document.getElementById("registro-usuario").value.trim();
    const correo = document.getElementById("registro-correo").value.trim();
    const clave = document.getElementById("registro-clave").value;

    if (usuarios.some(u => u.usuario.toLowerCase() === usuario.toLowerCase())) {
        mostrarErrorFormulario("error-registro", "Ese nombre de usuario ya está en uso.");
        return;
    }

    if (usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase())) {
        mostrarErrorFormulario("error-registro", "Ya existe una cuenta con ese correo.");
        return;
    }

    const nuevoUsuario = { nombres, apellidos, usuario, correo, clave };
    usuarios.push(nuevoUsuario);
    guardarUsuarios();

    iniciarSesion(nuevoUsuario);
    cerrarModal(modalRegistro);
    evento.target.reset();
});

document.getElementById("btn-salir").addEventListener("click", cerrarSesion);

/* ===================== INICIO DE PÁGINA ===================== */

actualizarUISesion();
renderizarHuertas();

// "Mi proyecto" solo para usuarios con sesión: si no hay, vuelve al inicio con el login abierto
if (pagina === "proyecto") {
    if (!sesion) {
        window.location.replace("index.html?login=1");
    } else {
        panelDesdeHash();
        window.addEventListener("hashchange", panelDesdeHash);
    }
}

// Permite abrir el login desde otra página (?login=1)
if (new URLSearchParams(location.search).get("login") === "1" && !sesion) {
    abrirModal(modalLogin);
    history.replaceState(null, "", location.pathname);
}
