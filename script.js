/* ===================== DATOS (localStorage) ===================== */

function leerLS(clave, porDefecto) {
    try {
        const valor = JSON.parse(localStorage.getItem(clave));
        return valor === null || valor === undefined ? porDefecto : valor;
    } catch (error) {
        return porDefecto;
    }
}


let sesion = null;



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

function anunciar(mensaje) {
    const aviso = document.getElementById("aviso-estado");
    if (!aviso) return;
    aviso.textContent = "";
    setTimeout(() => { aviso.textContent = mensaje; }, 50);
}

/* ===================== SUBPESTAÑAS (Mi proyecto) ===================== */

const subtabs = document.querySelectorAll(".subtab");
const paneles = document.querySelectorAll(".panel");

function activarPanel(idPanel) {
    if (!document.getElementById(idPanel)) return;

    subtabs.forEach(s => {
        const activa = s.dataset.panel === idPanel;
        s.classList.toggle("subtab-activa", activa);
        if (activa) {
            s.setAttribute("aria-current", "true");
        } else {
            s.removeAttribute("aria-current");
        }
    });
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

let elementoPrevio = null;

const SELECTOR_FOCO = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function modalAbierto() {
    return [modalLogin, modalRegistro].find(m => !m.classList.contains("oculto")) || null;
}

function abrirModal(modal) {
    elementoPrevio = document.activeElement;
    modal.classList.remove("oculto");

    // El foco pasa al primer campo del diálogo
    const primero = modal.querySelector("input");
    if (primero) primero.focus();
}

function cerrarModal(modal) {
    if (modal.classList.contains("oculto")) return;
    modal.classList.add("oculto");

    // Limpia errores y devuelve el foco a quien abrió el diálogo
    modal.querySelectorAll(".form-error").forEach(e => e.classList.add("oculto"));
    modal.querySelectorAll("[aria-invalid]").forEach(i => i.removeAttribute("aria-invalid"));

    // Si el elemento que abrió el diálogo ya no se ve (p. ej. el botón de login
    // tras iniciar sesión), el foco va al contenido principal
    if (elementoPrevio && elementoPrevio.offsetParent !== null) {
        elementoPrevio.focus();
    } else {
        const principal = document.getElementById("contenido-principal");
        if (principal) principal.focus();
    }
    elementoPrevio = null;
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
    const modal = modalAbierto();
    if (!modal) return;

    // Esc cierra el diálogo (así el foco nunca queda atrapado)
    if (evento.key === "Escape") {
        cerrarModal(modal);
        return;
    }

    // Tab queda dentro del diálogo mientras está abierto
    if (evento.key === "Tab") {
        const focables = Array.from(modal.querySelectorAll(SELECTOR_FOCO))
            .filter(el => el.offsetParent !== null);
        const primero = focables[0];
        const ultimo = focables[focables.length - 1];

        if (evento.shiftKey && document.activeElement === primero) {
            evento.preventDefault();
            ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
            evento.preventDefault();
            primero.focus();
        }
    }
});

function mostrarErrorFormulario(idError, mensaje, idCampo) {
    const elemento = document.getElementById(idError);
    elemento.textContent = mensaje;
    elemento.classList.remove("oculto");

    if (idCampo) {
        const campo = document.getElementById(idCampo);
        campo.setAttribute("aria-invalid", "true");
        campo.setAttribute("aria-describedby", idError);
        campo.focus();
    }
}

function ocultarErrorFormulario(idError) {
    document.getElementById(idError).classList.add("oculto");

    // Quita la marca de error de los campos del mismo formulario
    const form = document.getElementById(idError).closest("form");
    form.querySelectorAll("[aria-invalid]").forEach(campo => {
        campo.removeAttribute("aria-invalid");
        if (campo.getAttribute("aria-describedby") === idError) {
            campo.removeAttribute("aria-describedby");
        }
    });
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

/* ===================== FORO (MongoDB Atlas API) ===================== */

const API_FORO = "https://humble-lamp-xr5wjxgj7wpvfpx9r-3000.app.github.dev/api/threads";
const listaHilos = document.getElementById("lista-hilos");
const formNuevoHilo = document.getElementById("form-nuevo-hilo");

// Si hay sesión activa, pre-llena y bloquea el campo de autor
function sincronizarAutorForo() {
    const inputAutor = document.getElementById("hilo-autor");
    if (!inputAutor) return;
    if (sesion) {
        inputAutor.value = sesion.usuario;
        inputAutor.readOnly = true;
    } else {
        inputAutor.value = "";
        inputAutor.readOnly = false;
    }
}

async function cargarHilosForo() {
    if (!listaHilos) return;

    try {
        const respuesta = await fetch(API_FORO);
        const resultado = await respuesta.json();

        if (!resultado.success || !resultado.data) {
            listaHilos.innerHTML = "<p>No se pudieron cargar los hilos del foro.</p>";
            return;
        }

        if (resultado.data.length === 0) {
            listaHilos.innerHTML = "<p>Aún no hay hilos publicados. ¡Sé el primero en abrir un tema!</p>";
            return;
        }

        listaHilos.innerHTML = "";

        resultado.data.forEach(hilo => {
            const fecha = new Date(hilo.fechaCreacion).toLocaleDateString("es-CO", {
                year: "numeric", month: "short", day: "numeric"
            });

            const articulo = document.createElement("article");
            articulo.className = "hilo tarjeta-caso";
            articulo.style.marginBottom = "1.5rem";

            const respuestasHTML = (hilo.respuestas || []).map(r => `
                <div style="padding: 0.6rem 0.9rem; margin-top: 0.5rem; border-left: 3px solid currentColor; opacity: 0.9;">
                    <p style="margin: 0;"><strong>${escaparHTML(r.autor)}:</strong> ${escaparHTML(r.mensaje)}</p>
                </div>
            `).join("");

            articulo.innerHTML = `
                <small style="font-weight: 700; text-transform: uppercase;">🌱 ${escaparHTML(hilo.categoria)}</small>
                <h2 class="t-sub" style="margin-top: 0.3rem;">${escaparHTML(hilo.titulo)}</h2>
                <p style="font-size: 0.9rem; opacity: 0.8;">Publicado por <strong>${escaparHTML(hilo.autor)}</strong> · ${fecha} · ${(hilo.respuestas || []).length} respuestas</p>
                <p style="margin: 0.8rem 0;">${escaparHTML(hilo.contenido)}</p>

                <details style="margin-top: 1rem;">
                    <summary style="cursor: pointer; font-weight: 600;">💬 Ver y agregar respuestas (${(hilo.respuestas || []).length})</summary>
                    <div style="margin-top: 0.8rem;">
                        ${respuestasHTML || "<p style='font-size: 0.9rem;'>Sin respuestas todavía.</p>"}
                        
                        <form class="form-respuesta" data-id="${hilo._id}" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
                            <input type="text" name="autor" placeholder="Tu nombre" value="${sesion ? escaparHTML(sesion.usuario) : ""}" ${sesion ? "readonly" : ""} required>
                            <input type="text" name="mensaje" placeholder="Escribe una respuesta..." required>
                            <button type="submit" class="btn btn-fantasma" style="align-self: flex-start;">Responder</button>
                        </form>
                    </div>
                </details>
            `;

            listaHilos.appendChild(articulo);
        });

        // Escuchar envíos de respuestas en cada hilo
        document.querySelectorAll(".form-respuesta").forEach(form => {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const idHilo = form.dataset.id;
                const autor = form.elements["autor"].value.trim();
                const mensaje = form.elements["mensaje"].value.trim();

                try {
                    const res = await fetch(`${API_FORO}/${idHilo}/replies`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ autor, mensaje })
                    });

                    if (res.ok) {
                        anunciar("Respuesta publicada correctamente.");
                        cargarHilosForo();
                    }
                } catch (err) {
                    console.error("Error al responder:", err);
                }
            });
        });

    } catch (error) {
        console.error("Error al conectar con la API del foro:", error);
        listaHilos.innerHTML = "<p>Error de conexión con el servidor del foro. Verifica que el puerto 3000 esté en Public.</p>";
    }
}

if (formNuevoHilo) {
    sincronizarAutorForo();
    formNuevoHilo.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const nuevoHilo = {
            titulo: document.getElementById("hilo-titulo").value.trim(),
            autor: document.getElementById("hilo-autor").value.trim(),
            categoria: document.getElementById("hilo-categoria").value,
            contenido: document.getElementById("hilo-contenido").value.trim()
        };

        try {
            const respuesta = await fetch(API_FORO, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoHilo)
            });

            if (respuesta.ok) {
                formNuevoHilo.reset();
                sincronizarAutorForo();
                anunciar("Hilo publicado exitosamente en la comunidad.");
                cargarHilosForo();
            }
        } catch (error) {
            console.error("Error al publicar hilo:", error);
            anunciar("No se pudo publicar el hilo. Revisa tu conexión.");
        }
    });
}

if (pagina === "foro") {
    cargarHilosForo();
}