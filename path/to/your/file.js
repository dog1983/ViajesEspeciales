function enriquecerCarpetasConOrden(carpetas) {
    return carpetas.map(carpeta => {
        const orden = obtenerOrdenPorId(carpeta.orden_id);
        if (orden) {
            carpeta.contratante_id = orden.contratante_id;
            carpeta.subcontratante_id = orden.subcontratante_id;
        } else {
            carpeta.contratante_id = null;
            carpeta.subcontratante_id = null;
        }
        return carpeta;
    });
}

function obtenerOrdenPorId(orden_id) {
    // Lógica para obtener la orden por ID desde la base de datos o una API
    // Esta es una función de ejemplo y debe ser implementada para retornar un objeto de orden.
    return { contratante_id: 1, subcontratante_id: 2 }; // Valor demostral
}