const listaActividades = document.getElementById("lista-actividades");
const nuevaActividad = document.getElementById("nueva-actividad");
const filtroActividad = document.getElementById("filtro-actividad");

let versionActividades = 0;

function mensajeActividad(texto) {
    document.getElementById("mensaje-actividades").textContent = texto;
}

async function cargarActividades() {
    const version = ++versionActividades;

    nuevaActividad.classList.toggle("oculto", !sesion);

    try {
        const r = await solicitarAPI("/actividades");

        if (version !== versionActividades) return;

        const actividades = r.data.filter(a =>
            !filtroActividad.value || a.tipo === filtroActividad.value
        );

        listaActividades.replaceChildren();

        if (!actividades.length) {
            listaActividades.textContent = "No hay actividades registradas.";
        }

        actividades.forEach(a => {
            listaActividades.appendChild(tarjetaActividad(a));
        });
    } catch (error) {
        if (version === versionActividades) {
            mensajeActividad(error.message);
        }
    }
}

function tarjetaActividad(a) {
    const articulo = document.createElement("article");
    articulo.className = "evento tarjeta-caso";

    const fecha = new Date(a.fecha);

    articulo.innerHTML = `
        <div class="evento-fecha">
            <span class="evento-dia">${fecha.getUTCDate()}</span>
            <span class="evento-mes">${fecha.toLocaleString("es-CO", {month:"short", timeZone:"UTC"})}</span>
        </div>
        <div class="evento-info">
            <h2 class="t-sub">${escaparHTML(a.titulo)}</h2>
            <p>Huerta: ${escaparHTML(a.huerta?.nombre || "")}</p>
            <p>Tipo: ${escaparHTML(a.tipo)}</p>
            <p>${escaparHTML(a.descripcion || "")}</p>
            <p>Estado: ${escaparHTML(a.estado)}</p>
            <p>Fecha: ${fecha.toLocaleDateString("es-CO", {timeZone:"UTC"})}</p>
        </div>
    `;

    const acciones = document.createElement("div");
    acciones.className = "acciones-huerta";

    if (sesion && (sesion.role === "admin" ||
        String(a.huerta?.propietario) === String(sesion.id))) {

        acciones.appendChild(
            botonHuerta("Editar", () => editarActividad(a))
        );

        if (a.estado === "pendiente") {
            acciones.appendChild(
                botonHuerta("Completar", () => completarActividad(a._id))
            );
        }

        acciones.appendChild(
            botonHuerta("Eliminar", () => eliminarActividad(a._id))
        );
    }

    articulo.querySelector(".evento-info").appendChild(acciones);
    return articulo;
}

function datosActividad(a = {}) {
    const datos = {};

    for (const [campo, etiqueta] of [
        ["titulo", "Titulo de la actividad"],
        ["descripcion", "Descripcion"],
        ["tipo", "Tipo: siembra, cosecha, riego, mantenimiento o taller"],
        ["fecha", "Fecha (AAAA-MM-DD)"]
    ]) {
        let anterior = a[campo] || "";

        if (campo === "fecha") {
            anterior = anterior.slice(0, 10) ||
                new Date().toISOString().slice(0, 10);
        }

        const valor = prompt(etiqueta, anterior);

        if (valor === null) return null;

        datos[campo] = valor.trim();
    }

    const tipos = [
        "siembra", "cosecha", "riego", "mantenimiento", "taller"
    ];

    const fecha = new Date(datos.fecha);

    if (datos.titulo.length < 3 ||
        datos.titulo.length > 100 ||
        datos.descripcion.length > 1000 ||
        !tipos.includes(datos.tipo) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha) ||
        isNaN(fecha.getTime()) ||
        fecha.toISOString().slice(0, 10) !== datos.fecha) {
        mensajeActividad("Revisa los datos y la fecha.");
        return null;
    }

    return datos;
}

async function registrarActividad() {
    if (!sesion) return;

    try {
        const r = await solicitarAPI(
            sesion.role === "admin" ? "/huertas" : "/huertas/mias"
        );

        const huertas = [...r.data];

        for (let i = 2; i <= (r.paginacion?.paginas || 1); i++) {
            const siguiente = await solicitarAPI("/huertas?page=" + i);
            huertas.push(...siguiente.data);
        }

        if (!huertas.length) {
            mensajeActividad("Primero debes registrar una huerta.");
            return;
        }

        const opciones = huertas.map((h, i) =>
            (i + 1) + ". " + h.nombre
        ).join("\n");

        const seleccion = prompt("Selecciona una huerta:\n" + opciones);

        if (seleccion === null) return;

        const indice = Number(seleccion) - 1;

        if (!Number.isInteger(indice) || !huertas[indice]) {
            mensajeActividad("Selecciona una huerta valida.");
            return;
        }

        const datos = datosActividad();

        if (!datos) return;

        datos.huerta = huertas[indice]._id;

        await solicitarAPI("/actividades", {
            method: "POST",
            body: JSON.stringify(datos)
        });

        mensajeActividad("Actividad registrada correctamente.");
        await cargarActividades();
    } catch (error) {
        mensajeActividad(error.message);
    }
}

async function editarActividad(a) {
    const datos = datosActividad(a);

    if (!datos) return;

    try {
        await solicitarAPI("/actividades/" + a._id, {
            method: "PATCH",
            body: JSON.stringify(datos)
        });

        mensajeActividad("Actividad actualizada.");
        await cargarActividades();
    } catch (error) {
        mensajeActividad(error.message);
    }
}

async function completarActividad(id) {
    if (!confirm("Marcar actividad como completada?")) return;

    try {
        await solicitarAPI("/actividades/" + id, {
            method: "PATCH",
            body: JSON.stringify({ estado: "completada" })
        });

        mensajeActividad("Actividad completada.");
        await cargarActividades();
    } catch (error) {
        mensajeActividad(error.message);
    }
}

async function eliminarActividad(id) {
    if (!confirm("Deseas eliminar esta actividad?")) return;

    try {
        await solicitarAPI("/actividades/" + id, {
            method: "DELETE"
        });

        mensajeActividad("Actividad eliminada.");
        await cargarActividades();
    } catch (error) {
        mensajeActividad(error.message);
    }
}

nuevaActividad.addEventListener("click", registrarActividad);

filtroActividad.addEventListener("change", cargarActividades);
