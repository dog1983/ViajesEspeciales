// api.js
const BASE_URL = 'api.php';  // archivo PHP que maneja las peticiones

async function peticion(accion, recurso, datos = null, id = null) {
    const url = new URL(BASE_URL, window.location.href);
    url.searchParams.append('accion', accion);
    url.searchParams.append('tabla', recurso);
    if (id) url.searchParams.append('id', id);

    const opciones = {
        method: (accion === 'select' || accion === 'login') ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    if (datos && accion !== 'select' && accion !== 'login') {
        opciones.body = JSON.stringify(datos);
    } else if (accion === 'login') {
        opciones.body = JSON.stringify(datos);
        opciones.method = 'POST';
    }
    // Para select con filtros, mandamos un POST con el objeto filtro
    if (accion === 'select' && datos && Object.keys(datos).length > 0) {
        opciones.method = 'POST';
        opciones.body = JSON.stringify({ filtros: datos });
    }

    const resp = await fetch(url, opciones);
    if (!resp.ok) throw new Error('Error HTTP: ' + resp.status);
    const json = await resp.json();
    if (json.error) throw new Error(json.error);
    return json.data;
}

export const api = {
    select: (tabla, filtros = {}) => peticion('select', tabla, filtros),
    insert: (tabla, datos) => peticion('insert', tabla, datos),
    update: (tabla, id, datos) => peticion('update', tabla, datos, id),
    delete: (tabla, id) => peticion('delete', tabla, null, id),
    login: (usuario, password) => peticion('login', 'usuarios', { usuario, password })
};
