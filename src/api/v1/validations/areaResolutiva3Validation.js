const { validateUserExistController } = require("../controllers/usuarioController")
const { getNC } = require("../controllers/ncController")
const { getRsaController } = require("../controllers/rsaController")
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const allowedFields = [
    'nro_rsg', 'fecha_rsg', 'fecha_notificacion', 'id_nc', 'id_AR3', 'tipo'
];

const areaResolutiva3Validation = async (receivedBody, files, params) => {
    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.nro_rsg) {
        errors.push('Ingrese nro_rsg obligatorio');
    }

    if (!receivedBody.fecha_rsg) {
        errors.push('Ingrese fecha_rsg obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha_rsg)) {
        errors.push('El formato de la fecha_rsg debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha_rsg);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_rsg debe ser una fecha válida');
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

    if (!receivedBody.id_AR3) {
        errors.push('El AR3 es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_AR3 });

        if (!existingUser) {
            errors.push('Este AR3 no existe');
        }
    }

    if (!files || !files['documento_RSG']) {
        errors.push('El documento_RSG es obligatorio');
    } else {
        const file = files['documento_RSG'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento_RSG debe ser una imagen en formato PDF');
        }
    }

    if (!receivedBody.tipo) {
        errors.push('Ingrese tipo obligatorio');
    } else if (!['RSGNP', 'RSGP'].includes(receivedBody.tipo)) {
        errors.push('El tipo debe ser RSGP o RSGNP');
    }

    const existingRSA = await getRsaController(id);

    if (!existingRSA) {
        errors.push('Este RSA no existe');
    }

    return errors;
};



module.exports = { areaResolutiva3Validation };
