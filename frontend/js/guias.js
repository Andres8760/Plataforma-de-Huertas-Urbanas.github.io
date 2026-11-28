const listaGuias = document.getElementById("lista-guias");
const botonNuevaGuia = document.getElementById("nueva-guia");

function mensajeGuia(texto) {
    const elemento = document.getElementById("mensaje-guias");
    if (elemento) elemento.textContent = texto;
}

async function cargarGuias() {
    if (!listaGuias) return;

    try {
        const resultado = await solicitarAPI("/guias");
        const guias = [...resultado.data];

        for (let i = 2; i <= resultado.paginacion.paginas; i++) {
            const r = await solicitarAPI("/guias?page=" + i);
            guias.push(...r.data);
        }

        listaGuias.replaceChildren();

        if (!guias.length) {
            listaGuias.textContent = "No hay guias registradas.";
        }

        guias.forEach(g => {
            listaGuias.appendChild(tarjetaGuia(g));
        });

        botonNuevaGuia.classList.toggle(
            "oculto", sesion?.role !== "admin"
        );
    } catch (error) {
        mensajeGuia(error.message);
    }
}

function tarjetaGuia(g) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-caso";

    tarjeta.innerHTML = `
        <h2 class="t-sub">${escaparHTML(g.titulo)}</h2>
        <p>Categoria: ${escaparHTML(g.categoria)}</p>
        <p>${escaparHTML(g.resumen || "")}</p>
        <p>Autor: ${escaparHTML(g.autor?.username || "EcoHuertos")}</p>
    `;

    const acciones = document.createElement("div");
    acciones.className = "acciones-huerta";

    acciones.appendChild(
        botonHuerta("Leer guia", () => leerGuia(g._id))
    );

    if (sesion?.role === "admin") {
        acciones.appendChild(
            botonHuerta("Editar", () => editarGuia(g._id))
        );

        acciones.appendChild(
            botonHuerta("Eliminar", () => eliminarGuia(g._id))
        );
    }

    tarjeta.appendChild(acciones);
    return tarjeta;
}

async function leerGuia(id) {
    try {
        const r = await solicitarAPI("/guias/" + id);
        alert(r.data.titulo + "\n\n" + r.data.contenido);
    } catch (error) {
        mensajeGuia(error.message);
    }
}

function datosGuia(g = {}) {
    const datos = {};

    for (const [campo, etiqueta] of [
        ["titulo", "Titulo de la guia"],
        ["resumen", "Resumen de la guia"],
        ["categoria", "Categoria: suelo, siembra, riego, plagas, compostaje, cosecha o general"],
        ["contenido", "Contenido de la guia"]
    ]) {
        const valor = prompt(
            etiqueta,
            g[campo] || (campo === "categoria" ? "general" : "")
        );

        if (valor === null) return null;

        datos[campo] = valor.trim();
    }

    const categorias = [
        "suelo", "siembra", "riego", "plagas",
        "compostaje", "cosecha", "general"
    ];

    if (datos.titulo.length < 3 || datos.titulo.length > 120 ||
        datos.contenido.length < 10 || datos.contenido.length > 10000 ||
        datos.resumen.length > 300 ||
        !categorias.includes(datos.categoria)) {
        mensajeGuia("Revisa los campos y la categoria.");
        return null;
    }

    return datos;
}

async function crearGuia() {
    if (sesion?.role !== "admin") return;

    const datos = datosGuia();
    if (!datos) return;

    try {
        await solicitarAPI("/guias", {
            method: "POST",
            body: JSON.stringify(datos)
        });

        mensajeGuia("Guia creada correctamente.");
        await cargarGuias();
    } catch (error) {
        mensajeGuia(error.message);
    }
}

async function editarGuia(id) {
    try {
        const r = await solicitarAPI("/guias/" + id);
        const datos = datosGuia(r.data);

        if (!datos) return;

        await solicitarAPI("/guias/" + id, {
            method: "PUT",
            body: JSON.stringify(datos)
        });

        mensajeGuia("Guia actualizada correctamente.");
        await cargarGuias();
    } catch (error) {
        mensajeGuia(error.message);
    }
}

async function eliminarGuia(id) {
    if (!confirm("Deseas eliminar esta guia?")) return;

    try {
        await solicitarAPI("/guias/" + id, {
            method: "DELETE"
        });

        mensajeGuia("Guia eliminada correctamente.");
        await cargarGuias();
    } catch (error) {
        mensajeGuia(error.message);
    }
}

if (botonNuevaGuia) {
    botonNuevaGuia.addEventListener("click", crearGuia);
}
