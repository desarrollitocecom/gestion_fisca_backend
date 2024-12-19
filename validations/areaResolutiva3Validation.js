const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateRSG = (body) => {
    const errors = [];
    const { nro_rsg, fecha_rsg, fecha_notificacion, id_nc, id_AR3, tipo } = body;

    if (!nro_rsg) errors.push('El campo nro_rsg es requerido');

    if (typeof nro_rsg !== 'string') errors.push('El nro_rsg debe ser una cadena de texto');

    if (!id_AR3) errors.push('El campo id_AR2 es requerido');

    if (!tipo) errors.push('El campo tipo es requerido');

    if (!id_nc) errors.push('El campo id_nc es requerido');

    if (!fecha_rsg) errors.push('El campo fecha_resolucion es requerido'); 
    if (!fecha_rsg) {
        errors.push('La fecha_rsg debe ser obligatoria');
    } else if (!fechaRegex.test(fecha_rsg)) {
        errors.push('El formato de la fecha_rsg debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rsg);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_rsg debe ser una fecha válida');
        }
    }

    if (!fecha_notificacion) errors.push('El campo fecha_notificacion es requerido');   
    if (!fecha_notificacion) {
        errors.push('La fecha_notificacion debe ser obligatoria');
    } else if (!fechaRegex.test(fecha_notificacion)) {
        errors.push('El formato de la fecha_notificacion debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_notificacion debe ser una fecha válida');
        }
    }

    return errors;
};

module.exports = { validateRSG };
