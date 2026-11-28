const API_URL = "https://refactored-lamp-4jpwxwj5gjq7f5wv-3000.app.github.dev/api";

function obtenerToken() {
    return sessionStorage.getItem("ecohuertos_token");
}

function guardarToken(token) {
    sessionStorage.setItem("ecohuertos_token", token);
}

function eliminarToken() {
    sessionStorage.removeItem("ecohuertos_token");
}

async function solicitarAPI(ruta, opciones = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...opciones.headers
    };

    const token = obtenerToken();

    if (token) {
        headers.Authorization = "Bearer " + token;
    }

    let respuesta;

    try {
        respuesta = await fetch(API_URL + ruta, {
            ...opciones,
            headers
        });
    } catch (error) {
        throw new Error("No se pudo conectar con el servidor.");
    }

    const resultado = await respuesta.json();

    if (respuesta.ok === false || resultado.ok === false) {
        const error = new Error(resultado.mensaje || "Error del servidor");
        error.status = respuesta.status;
        throw error;
    }

    return resultado;
}
