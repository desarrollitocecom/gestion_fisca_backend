const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateAreaInstructiva1 = (body) => {
    const errors = [];
    const { nro_ifi, fecha, id_nc, id_AI1, tipo } = body;

    if (!nro_ifi) errors.push('El campo es requerido')
    if (typeof nro_ifi != 'string') errors.push('El nro debe ser una cadena de texto')
    if (!fecha) errors.push("El campo es requerido")
    if (!Date.parse(fecha)) errors.push("Debe ser una fecha y seguir el formato YYYY-MM-DD")
        
    if (!fecha) {
        errors.push('La fecha debe ser obligatoria');
    } else if (!fechaRegex.test(fecha)) {
        errors.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha debe ser una fecha válida');
        }
    }
    if (!id_AI1) errors.push('El campo id_AI1 es requerido');

    if (!id_nc) errors.push('El campo id_nc es requerido');

    return errors;
};

module.exports = { validateAreaInstructiva1 };
