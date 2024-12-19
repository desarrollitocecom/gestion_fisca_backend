const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateRSG2 = (body) => {
    const errors = [];
    const { nro_resolucion2, fecha_resolucion, id_nc, id_AR2 } = body;

    if (!nro_resolucion2) errors.push('El campo nro_resolucion2 es requerido');

    if (typeof nro_resolucion2 !== 'string') errors.push('El nro_resolucion2 debe ser una cadena de texto');

    if (!id_AR2) errors.push('El campo id_AR2 es requerido');


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

const validateRSA = (body) => {
    const errors = [];
    const { nro_rsa, fecha_rsa, fecha_notificacion, id_nc, id_AR2 } = body;

    if (!nro_rsa) errors.push('El campo nro_rsa es requerido');

    if (typeof nro_rsa !== 'string') errors.push('El nro_rsa debe ser una cadena de texto');

    if (!id_AR2) errors.push('El campo id_AR2 es requerido');

    if (!id_nc) errors.push('El campo id_nc es requerido');

    if (!fecha_rsa) errors.push('El campo fecha_rsa es requerido');
    if (!fecha_rsa) {
        errors.push('La fecha_rsa debe ser obligatoria');
    } else if (!fechaRegex.test(fecha_rsa)) {
        errors.push('El formato de la fecha_rsa debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rsa);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_rsa debe ser una fecha válida');
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

module.exports = { validateRSG2, validateRSA };
