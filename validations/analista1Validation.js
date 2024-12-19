const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateAnalista1 = (body) => {
    const errors = [];
    const {
        nro_descargo,
        fecha_descargo,
        id_analista1
    } = body;

    if (!nro_descargo) {
        errors.push('Ingrese nro_descargo obligatorio');
    }

    if (!fecha_descargo) {
        errors.push('Ingrese fecha_descargo obligatorio');
    }

    if (!id_analista1) {
        errors.push('Ingrese id_analista1 obligatorio');
    }

    if (!fecha_descargo) {
        errors.push('La fecha_descargo debe ser obligatoria');
    } else if (!fechaRegex.test(fecha_descargo)) {
        errors.push('El formato de la fecha_descargo debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_descargo);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_descargo debe ser una fecha válida');
        }
    }

    return errors;
};

module.exports = { validateAnalista1 };
