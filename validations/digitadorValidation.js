const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateNC = (body) => {
    const errors = [];
    const {
        id_tipoDocumento,
        nro_documento,
        ordenanza_municipal,
        nro_licencia_funcionamiento,
        nombre_entidad,
        domicilio_entidad,
        distrito_entidad,
        giro_entidad,
        id_infraccion,
        lugar_infraccion,
        placa_rodaje,
        fecha_constancia_notificacion,
        nombres_infractor,
        dni_infractor,
        relacion_infractor,
        observaciones,
        id_digitador,
    } = body;

    if (!id_tipoDocumento) {
        errors.push('El Tipo de Documento debe ser obligatorio');
    }

    if (id_tipoDocumento && isNaN(id_tipoDocumento)) {
        errors.push('El Tipo de Documento debe ser válido');
    }

    if (!nro_documento) {
        errors.push('El número de Documento debe ser obligatorio');
    }

    if (!ordenanza_municipal) {
        errors.push('La Ordenanza Municipal debe ser obligatoria');
    }

    if (
        nro_licencia_funcionamiento &&
        !/^\d{5}-\d{2}$/.test(nro_licencia_funcionamiento)
    ) {
        errors.push(
            'El campo licencia debe tener el formato *****-**, 5 dígitos, guion, 2 dígitos'
        );
    }

    if (!nombre_entidad) {
        errors.push('La entidad debe ser obligatoria');
    }

    if (!domicilio_entidad) {
        errors.push('El domicilio debe ser obligatorio');
    }

    if (!distrito_entidad) {
        errors.push('El distrito debe ser obligatorio');
    }

    if (!giro_entidad) {
        errors.push('El giro debe ser obligatorio');
    }

    if (!id_infraccion) {
        errors.push('La infracción debe ser obligatoria');
    }

    if (!lugar_infraccion) {
        errors.push('El lugar de infracción debe ser obligatorio');
    }

    if (
        placa_rodaje &&
        !/^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}$|^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{2}$/.test(
            placa_rodaje
        )
    ) {
        errors.push(
            'El campo placa debe tener el formato 123-456 o 1234-56, permitiendo letras y números'
        );
    }

    if (!fecha_constancia_notificacion) {
        errors.push('La fecha de inicio debe ser obligatoria');
    } else if (!fechaRegex.test(fecha_constancia_notificacion)) {
        errors.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_constancia_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('Debe ser una fecha válida');
        }
    }

    if (!nombres_infractor) {
        errors.push('El nombre del infractor es obligatorio');
    }

    if (!dni_infractor) {
        errors.push('El dni del infractor es obligatorio');
    }

    if (!relacion_infractor) {
        errors.push('La relación del infractor es obligatoria');
    }

    if (!observaciones) {
        errors.push('Las observaciones de la CN son obligatorias');
    }

    if (!id_digitador) {
        errors.push('El id del digitador es obligatorio');
    }

    return errors;
};

module.exports = { validateNC };
