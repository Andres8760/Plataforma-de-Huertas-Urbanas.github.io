const listaHilos = document.getElementById("lista-hilos");
const formNuevoHilo = document.getElementById("form-nuevo-hilo");

function mensajeForo(texto) {
    const aviso = document.getElementById("mensaje-foro");
    if (aviso) aviso.textContent = texto;
    anunciar(texto);
}

function sincronizarAutorForo() {
    if (!formNuevoHilo) return;

    const autor = document.getElementById("hilo-autor");
    autor.value = sesion?.usuario || "";
    autor.readOnly = true;

    formNuevoHilo.hidden = !sesion;

    const invitacion = document.getElementById("invitacion-foro");
    if (invitacion) invitacion.hidden = Boolean(sesion);

    cargarHilosForo();
}

let versionForo = 0;

async function cargarHilosForo() {
    if (!listaHilos) return;

    const version = ++versionForo;

    try {
        const r = await solicitarAPI("/threads");
        const hilos = [...r.data];

        for (let i = 2; i <= r.paginacion.paginas; i++) {
            const siguiente = await solicitarAPI("/threads?page=" + i);
            hilos.push(...siguiente.data);
        }

        if (version !== versionForo) return;

        listaHilos.replaceChildren();

        if (!hilos.length) {
            listaHilos.textContent = "Todavia no hay publicaciones.";
        }

        hilos.forEach(hilo => {
            listaHilos.appendChild(crearTarjetaHilo(hilo));
        });
    } catch (error) {
        if (version === versionForo) {
            listaHilos.textContent = error.message;
        }
    }
}

function crearTarjetaHilo(hilo) {
    const articulo = document.createElement("article");
    articulo.className = "hilo tarjeta-caso";

    const fecha = new Date(hilo.fechaCreacion)
        .toLocaleDateString("es-CO");

    articulo.innerHTML = `
        <small>${escaparHTML(hilo.categoria)}</small>
        <h2 class="t-sub">${escaparHTML(hilo.titulo)}</h2>
        <p>Publicado por <strong>${escaparHTML(hilo.autor)}</strong> - ${fecha}</p>
        <p>${escaparHTML(hilo.contenido)}</p>
    `;

    const detalles = document.createElement("details");
    const resumen = document.createElement("summary");

    resumen.textContent = "Respuestas (" + (hilo.respuestas || []).length + ")";
    detalles.appendChild(resumen);

    (hilo.respuestas || []).forEach(r => {
        const respuesta = document.createElement("div");
        respuesta.className = "respuesta-foro";
        respuesta.innerHTML = `<strong>${escaparHTML(r.autor)}:</strong> ${escaparHTML(r.mensaje)}`;
        detalles.appendChild(respuesta);
    });

    if (sesion) {
        detalles.appendChild(crearFormularioRespuesta(hilo._id));
    }

    articulo.appendChild(detalles);

    if (sesion?.role === "admin") {
        articulo.appendChild(
            botonHuerta("Eliminar publicacion", () => eliminarHilo(hilo._id))
        );
    }

    return articulo;
}

function crearFormularioRespuesta(id) {
    const form = document.createElement("form");
    form.className = "form-respuesta";

    const campo = document.createElement("textarea");
    campo.placeholder = "Escribe tu respuesta";
    campo.setAttribute("aria-label", "Escribe tu respuesta");
    campo.required = true;
    campo.maxLength = 1000;

    const boton = document.createElement("button");
    boton.type = "submit";
    boton.className = "btn btn-fantasma";
    boton.textContent = "Responder";

    form.append(campo, boton);

    form.addEventListener("submit", async evento => {
        evento.preventDefault();

        if (!sesion) return;

        boton.disabled = true;

        try {
            await solicitarAPI("/threads/" + id + "/replies", {
                method: "POST",
                body: JSON.stringify({
                    mensaje: campo.value.trim()
                })
            });

            mensajeForo("Respuesta publicada correctamente.");
            await cargarHilosForo();
        } catch (error) {
            mensajeForo(error.message);
        } finally {
            boton.disabled = false;
        }
    });

    return form;
}

if (formNuevoHilo) {
    formNuevoHilo.addEventListener("submit", async evento => {
        evento.preventDefault();

        if (!sesion) {
            abrirModal(modalLogin);
            return;
        }

        const datos = {
            titulo: document.getElementById("hilo-titulo").value.trim(),
            categoria: document.getElementById("hilo-categoria").value,
            contenido: document.getElementById("hilo-contenido").value.trim()
        };

        const boton = formNuevoHilo.querySelector('[type="submit"]');
        boton.disabled = true;

        try {
            await solicitarAPI("/threads", {
                method: "POST",
                body: JSON.stringify(datos)
            });

            formNuevoHilo.reset();
            mensajeForo("Publicacion creada correctamente.");
            sincronizarAutorForo();
        } catch (error) {
            mensajeForo(error.message);
        } finally {
            boton.disabled = false;
        }
    });
}

async function eliminarHilo(id) {
    if (sesion?.role !== "admin") return;

    if (!confirm("Deseas eliminar esta publicacion y sus respuestas?")) {
        return;
    }

    try {
        await solicitarAPI("/threads/" + id, {
            method: "DELETE"
        });

        mensajeForo("Publicacion eliminada correctamente.");
        await cargarHilosForo();
    } catch (error) {
        mensajeForo(error.message);
    }
}
