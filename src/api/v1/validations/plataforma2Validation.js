const { validateUserExistController } = require("../controllers/usuarioController")
const { getNC } = require("../controllers/ncController")
const { getInformeFinalController } = require("../controllers/informeFinalController")
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;


const plataforma2Validation = async (receivedBody, files, params) => {
    const allowedFields = [
        'nro_recurso',
        'fecha_recurso',
        'id_nc',
        'id_plataforma2',
        'tipo_viene',
        'tipo_va'
    ];
    
    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.nro_recurso) {
        errors.push('Ingrese nro_recurso obligatorio');
    }

    if (!receivedBody.fecha_recurso) {
        errors.push('Ingrese fecha_recurso obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha_recurso)) {
        errors.push('El formato de la fecha_recurso debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha_recurso);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_recurso debe ser una fecha válida');
        }
    }

    if (!receivedBody.id_plataforma2) {
        errors.push('La plataforma es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_plataforma2 });

        if (!existingUser) {
            errors.push('La plataforma no existe');
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

    if (!receivedBody.tipo_viene) {
        errors.push('Ingrese tipo_viene obligatorio');
    } else if (!['RSA', 'RSG', 'RSG2'].includes(receivedBody.tipo_viene)) {
        errors.push('El  tipo_viene debe ser RSA o RSG o RSG2');
    }


    if (!receivedBody.tipo_va) {
        errors.push('Ingrese tipo_va obligatorio');
    } else if (!['APELACION', 'RECONSIDERACION'].includes(receivedBody.tipo_va)) {
        errors.push('El  tipo_va debe ser APELACION o RECONSIDERACION');
    }

    if (!files || !files['documento_Recurso']) {
        errors.push('El documento_Recurso es obligatorio');
    } else {
        const file = files['documento_Recurso'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento_Recurso debe ser una imagen en formato PDF');
        }
    }

    return errors;
};



module.exports = { plataforma2Validation };