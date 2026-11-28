function mensajeHuerta(mensaje, error = false) {
    let aviso = document.getElementById("mensaje-crud");

    if (!aviso) {
        aviso = document.createElement("p");
        aviso.id = "mensaje-crud";
        aviso.setAttribute("role", "status");
        document.querySelector("main").prepend(aviso);
    }

    aviso.className = error ? "form-error" : "form-ok";
    aviso.textContent = mensaje;
    anunciar(mensaje);
}

function puedeGestionarHuerta(huerta) {
    if (!sesion) return false;

    const propietario = huerta.propietario?._id || huerta.propietario;

    return sesion.role === "admin" ||
        String(propietario) === String(sesion.id);
}

function botonHuerta(texto, accion) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-fantasma";
    boton.textContent = texto;
    boton.addEventListener("click", accion);
    return boton;
}

function crearTarjetaHuerta(huerta, nivel) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-caso";

    tarjeta.innerHTML = `
        <${nivel} class="t-sub">${escaparHTML(huerta.nombre)}</${nivel}>
        <p>Ciudad: ${escaparHTML(huerta.ciudad || "")}</p>
        <p>Barrio: ${escaparHTML(huerta.barrio || "No indicado")}</p>
        <p>Cultivos: ${escaparHTML((huerta.cultivos || []).join(", "))}</p>
        <p>Tipo: ${escaparHTML(huerta.tipo || "")}</p>
        <p>Registrada por: ${escaparHTML(huerta.propietario?.username || (puedeGestionarHuerta(huerta) && sesion.role !== "admin" ? sesion.usuario : "Usuario"))}</p>
    `;

    const acciones = document.createElement("div");
    acciones.className = "acciones-huerta";

    acciones.appendChild(
        botonHuerta("Ver detalle", () => consultarHuerta(huerta._id))
    );

    if (puedeGestionarHuerta(huerta)) {
        acciones.appendChild(
            botonHuerta("Editar", () => editarHuerta(huerta._id))
        );

        acciones.appendChild(
            botonHuerta("Eliminar", () => eliminarHuerta(huerta._id))
        );
    }

    tarjeta.appendChild(acciones);
    return tarjeta;
}

async function renderizarHuertas() {
    if (!contenedorHuertas) return;

    if (formulario) {
        formulario.classList.toggle("oculto", !sesion);
    }

    try {
        const resultado = await solicitarAPI("/huertas");
        const lista = [...resultado.data];

        for (let pagina = 2; pagina <= resultado.paginacion.paginas; pagina++) {
            const siguiente = await solicitarAPI("/huertas?page=" + pagina);
            lista.push(...siguiente.data);
        }

        contenedorHuertas.innerHTML = "";

        if (lista.length === 0) {
            contenedorHuertas.textContent = "No hay huertas registradas.";
        }

        lista.forEach(h => {
            contenedorHuertas.appendChild(crearTarjetaHuerta(h, "h2"));
        });
    } catch (error) {
        contenedorHuertas.textContent = error.message;
    }
}

async function renderizarMisHuertas() {
    if (!contenedorMisHuertas) return;

    contenedorMisHuertas.innerHTML = "";

    if (!sesion) {
        contenedorMisHuertas.textContent = "Inicia sesion para consultar tus huertas.";
        return;
    }

    try {
        const resultado = await solicitarAPI("/huertas/mias");
        if (!sesion) return;
        contenedorMisHuertas.innerHTML = "";

        if (resultado.data.length === 0) {
            contenedorMisHuertas.textContent = "Todavia no tienes huertas.";
        }

        resultado.data.forEach(h => {
            contenedorMisHuertas.appendChild(crearTarjetaHuerta(h, "h3"));
        });
    } catch (error) {
        contenedorMisHuertas.textContent = error.message;
    }
}

async function consultarHuerta(id) {
    try {
        const resultado = await solicitarAPI("/huertas/" + id);
        const h = resultado.data;

        alert([
            "Huerta: " + h.nombre,
            "Descripcion: " + (h.descripcion || "Sin descripcion"),
            "Ciudad: " + h.ciudad,
            "Barrio: " + (h.barrio || "No indicado"),
            "Direccion: " + (h.direccion || "No indicada"),
            "Tipo: " + h.tipo,
            "Cultivos: " + (h.cultivos || []).join(", "),
            "Area: " + (h.areaM2 || "No indicada") + " m2"
        ].join("\n"));
    } catch (error) {
        mensajeHuerta(error.message, true);
    }
}

async function editarHuerta(id) {
    try {
        const resultado = await solicitarAPI("/huertas/" + id);
        const h = resultado.data;

        const datos = {};

        for (const [campo, etiqueta] of [
            ["nombre", "Nombre"],
            ["ciudad", "Ciudad"],
            ["barrio", "Barrio"],
            ["descripcion", "Descripcion"],
            ["direccion", "Direccion"],
            ["tipo", "Tipo: comunitaria, escolar, familiar o institucional"]
        ]) {
            const valor = prompt(etiqueta, h[campo] || "");
            if (valor === null) return;
            datos[campo] = valor.trim();
        }

        const cultivos = prompt(
            "Cultivos separados por comas",
            (h.cultivos || []).join(", ")
        );

        if (cultivos === null) return;

        datos.cultivos = cultivos.split(",").map(c => c.trim()).filter(Boolean);

        const area = prompt("Area en metros cuadrados", h.areaM2 || "");

        if (area === null) return;

        if (area.trim()) datos.areaM2 = Number(area);

        await solicitarAPI("/huertas/" + id, {
            method: "PUT",
            body: JSON.stringify(datos)
        });

        mensajeHuerta("Huerta actualizada correctamente.");
        await renderizarHuertas();
        await renderizarMisHuertas();
    } catch (error) {
        mensajeHuerta(error.message, true);
    }
}

async function eliminarHuerta(id) {
    if (!confirm("Deseas eliminar esta huerta definitivamente?")) return;

    try {
        await solicitarAPI("/huertas/" + id, {
            method: "DELETE"
        });

        mensajeHuerta("Huerta eliminada correctamente.");
        await renderizarHuertas();
        await renderizarMisHuertas();
    } catch (error) {
        mensajeHuerta(error.message, true);
    }
}

if (formulario) {
    formulario.addEventListener("submit", async evento => {
        evento.preventDefault();

        if (!sesion) {
            abrirModal(modalLogin);
            return;
        }

        const datos = {
            nombre: document.getElementById("nombre").value.trim(),
            ciudad: document.getElementById("ubicacion").value.trim(),
            barrio: document.getElementById("barrio").value.trim(),
            descripcion: document.getElementById("descripcion").value.trim(),
            direccion: document.getElementById("direccion").value.trim(),
            tipo: document.getElementById("tipo").value,
            cultivos: document.getElementById("cultivo").value
                .split(",").map(c => c.trim()).filter(Boolean)
        };

        const area = document.getElementById("areaM2").value;

        if (area) datos.areaM2 = Number(area);

        const boton = formulario.querySelector('[type="submit"]');
        boton.disabled = true;

        try {
            await solicitarAPI("/huertas", {
                method: "POST",
                body: JSON.stringify(datos)
            });

            formulario.reset();
            mensajeHuerta("Huerta registrada correctamente.");
            await renderizarHuertas();
        } catch (error) {
            mensajeHuerta(error.message, true);
        } finally {
            boton.disabled = false;
        }
    });
}
