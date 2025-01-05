const { validateUserExistController } = require("../controllers/usuarioController")
const { getNC } = require("../controllers/ncController")
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const allowedFields = [
    'nro_ifi', 'fecha', 'id_nc', 'id_AI1', 'tipo'
];

const areaInstructiva1Validation = async (receivedBody, files) => {
    const errors = [];
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.nro_ifi) {
        errors.push('Ingrese nro_ifi obligatorio');
    }

    if (!receivedBody.fecha) {
        errors.push('Ingrese fecha obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha)) {
        errors.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha debe ser una fecha válida');
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

    if (!receivedBody.id_AI1) {
        errors.push('El AI es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_AI1 });

        if (!existingUser) {
            errors.push('Este AI no existe');
        }
    }

    if (!files || !files['documento_ifi']) {
        errors.push('El documento_ifi es obligatorio');
    } else {
        const file = files['documento_ifi'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento_ifi debe ser una imagen en formato PDF');
        }
    }

    if (!receivedBody.tipo) {
        errors.push('Ingrese tipo obligatorio');
    } else if (!['ANALISTA_2', 'RSG1'].includes(receivedBody.tipo)) {
        errors.push('El  tipo debe ser ANALISTA_2 o RSG1');
    }
    
    return errors;
};



module.exports = { areaInstructiva1Validation };
