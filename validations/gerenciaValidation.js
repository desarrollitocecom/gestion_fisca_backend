const { validateUserExistController } = require("../controllers/usuarioController")
const { getNC } = require("../controllers/ncController")
const { getRSGController } = require("../controllers/rsgController")
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const allowedFields = [
    'nro_rg', 'fecha_rg', 'fecha_notificacion', 'id_nc', 'id_gerente', 'tipo'
];

const gerenciaValidation = async (receivedBody, files, params) => {
    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.nro_rg) {
        errors.push('Ingrese nro_rg obligatorio');
    }

    if (!receivedBody.fecha_rg) {
        errors.push('Ingrese fecha_rg obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha_rg)) {
        errors.push('El formato de la fecha_rg debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha_rg);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_rg debe ser una fecha válida');
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

    if (!receivedBody.id_gerente) {
        errors.push('El Gerente es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_gerente });

        if (!existingUser) {
            errors.push('Este Gerente no existe');
        }
    }

    if (!files || !files['documento_rg']) {
        errors.push('El documento_rg es obligatorio');
    } else {
        const file = files['documento_rg'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento_rg debe ser una imagen en formato PDF');
        }
    }

    if (!receivedBody.tipo) {
        errors.push('Ingrese tipo obligatorio');
    } else if (!['FUNDADO_RG', 'ANALISTA_5'].includes(receivedBody.tipo)) {
        errors.push('El tipo debe ser FUNDADO_RG o ANALISTA_5');
    }

    const existingRSG = await getRSGController(id);

    if (!existingRSG) {
        errors.push('Este RSG no existe');
    }

    return errors;
};



module.exports = { gerenciaValidation };
