const { validateUserExistController } = require("../controllers/usuarioController")
const { getNC } = require("../controllers/ncController")
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;


const opcionalDocumentValidation = async (receivedBody, files, params) => {
    const allowedFields = [
        'nro_docOpcional',
        'fecha_docOpcional',
        'id_plataforma',
        'tipo_documentoOpcional'
    ];
    
    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.tipo_documentoOpcional) {
        errors.push('Ingrese tipo_documentoOpcional obligatorio');
    }

    if (!receivedBody.nro_docOpcional) {
        errors.push('Ingrese nro_docOpcional obligatorio');
    }

    if (!receivedBody.fecha_docOpcional) {
        errors.push('Ingrese fecha_docOpcional obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha_docOpcional)) {
        errors.push('El formato de la fecha_docOpcional debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha_docOpcional);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_docOpcional debe ser una fecha válida');
        }
    }

    if (!files || !files['documento_opcional']) {
        errors.push('El documento_opcional es obligatorio');
    } else {
        const file = files['documento_opcional'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento_opcional debe ser un PDF');
        }
    }

    if (!receivedBody.id_plataforma) {
        errors.push('El plataformista es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_plataforma });

        if (!existingUser) {
            errors.push('Este plataformista no existe');
        }
    }

    const existingNC = await getNC(id);

    if (!existingNC) {
        errors.push('Este NC no existe');
    }

    return errors;
};

module.exports = { opcionalDocumentValidation };