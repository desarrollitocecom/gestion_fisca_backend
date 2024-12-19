const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateAreaResolutiva1 = (body) => {
    const errors = [];
    const { nro_resolucion, fecha_resolucion, id_nc, id_AR1 } = body;

    if (!nro_resolucion) errors.push('El campo nro_resolucion es requerido');

    if (typeof nro_resolucion !== 'string') errors.push('El nro_resolucion debe ser una cadena de texto');

    if (!id_AR1) errors.push('El campo id_AR1 es requerido');

    if (!id_nc) errors.push('El campo id_nc es requerido');

    if (!fecha_resolucion) errors.push('El campo fecha_resolucion es requerido');

        
    if (!fecha_resolucion) {
        errors.push('La fecha_resolucion debe ser obligatoria');
    } else if (!fechaRegex.test(fecha_resolucion)) {
        errors.push('El formato de la fecha_resolucion debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_resolucion);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_resolucion debe ser una fecha válida');
        }
    }

    return errors;
};

module.exports = { validateAreaResolutiva1 };
