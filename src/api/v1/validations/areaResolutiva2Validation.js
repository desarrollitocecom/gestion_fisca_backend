const { validateUserExistController } = require("../controllers/usuarioController")
const { getNC } = require("../controllers/ncController")
const { getInformeFinalController } = require("../controllers/informeFinalController")
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const areaResolutiva2RSG2Validation = async (receivedBody, files, params) => {
    const allowedFields = [
        'nro_resolucion2', 'fecha_resolucion', 'id_nc', 'id_AR2'
    ];

    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.nro_resolucion2) {
        errors.push('Ingrese nro_resolucion2 obligatorio');
    }

    if (!receivedBody.fecha_resolucion) {
        errors.push('Ingrese fecha_resolucion obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha_resolucion)) {
        errors.push('El formato de la fecha_resolucion debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha_resolucion);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_resolucion debe ser una fecha válida');
        }
    }

    if (!receivedBody.id_nc) {
        errors.push('El campo id_nc es requerido')
    } else {
        const existingNC = await getNC(receivedBody.id_nc);

        if (!existingNC) {
            errors.push('Este NC no existe');
        }
    }

    if (!receivedBody.id_AR2) {
        errors.push('El AR2 es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_AR2 });

        if (!existingUser) {
            errors.push('Este AR2 no existe');
        }
    }

    const existingIFI = await getInformeFinalController(id);
    if (!existingIFI) {
        errors.push('Este IFI no existe');
    }


    if (!files || !files['documento']) {
        errors.push('El documento es obligatorio');
    } else {
        const file = files['documento'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento debe ser una imagen en formato PDF');
        }
    }
    
    return errors;
};



const areaResolutiva2RSAValidation = async (receivedBody, files, params) => {
    const allowedFields = [
        'nro_rsa', 'fecha_rsa', 'fecha_notificacion', 'tipo', 'id_evaluar_rsa', 'id_nc', 'id_AR2'
    ];

    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.nro_rsa) {
        errors.push('Ingrese nro_rsa obligatorio');
    }

    if (!receivedBody.fecha_rsa) {
        errors.push('Ingrese fecha_rsa obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha_rsa)) {
        errors.push('El formato de la fecha_rsa debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha_rsa);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_rsa debe ser una fecha válida');
        }
    }

    if (!receivedBody.fecha_notificacion) {
        errors.push('Ingrese fecha_notificacion obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha_notificacion)) {
        errors.push('El formato de la fecha_notificacion debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_notificacion debe ser una fecha válida');
        }
    }

    if (!receivedBody.id_nc) {
        errors.push('El campo id_nc es requerido')
    } else {
        const existingNC = await getNC(receivedBody.id_nc);

        if (!existingNC) {
            errors.push('Este NC no existe');
        }
    }

    if (!receivedBody.id_AR2) {
        errors.push('El AR2 es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_AR2 });

        if (!existingUser) {
            errors.push('Este AR2 no existe');
        }
    }

    const existingIFI = await getInformeFinalController(id);
    if (!existingIFI) {
        errors.push('Este IFI no existe');
    }
    

    if (!files || !files['documento_RSA']) {
        errors.push('El documento_RSA es obligatorio');
    } else {
        const file = files['documento_RSA'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento_RSA debe ser una imagen en formato PDF');
        }
    }
    
    return errors;
};


module.exports = { areaResolutiva2RSG2Validation, areaResolutiva2RSAValidation };
