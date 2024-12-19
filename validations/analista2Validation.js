const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateAnalista2 = (body) => {
    const errors = [];
    const {
        nro_descargo, 
        fecha_descargo,
        id_nc ,
        id_analista_2
    } = body;

    if (!nro_descargo) errors.push('El campo nro_descargo es requerido');

    if (typeof nro_descargo !== 'string') errors.push('El nro_descargo debe ser una cadena de texto');

    if (!id_analista_2) errors.push('El campo id_analista_2 es requerido');


    if (!id_nc) errors.push('El campo id_nc es requerido');


    if (!fecha_descargo) errors.push('El campo fecha_descargo es requerido');

    if (!fechaRegex.test(fecha_descargo)) {
        errors.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {

        const parsedFecha = new Date(fecha_descargo);

        if (isNaN(parsedFecha.getTime())) {

            errors.push('Debe ser una fecha válida');

        }
    }

    return errors;
};

module.exports = { validateAnalista2 };
