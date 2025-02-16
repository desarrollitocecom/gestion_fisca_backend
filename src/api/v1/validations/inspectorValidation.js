const { validateUserExistController } = require("../controllers/usuarioController")
const { validateActa } = require("../controllers/ncController")

const allowedFields = [
    'nombre_MC',
    'nro_medida_complementaria',
    'id_controlActa',
    'nro_nc',
    'nro_acta',
    'id_inspector',
    'latitud',
    'longitud'
];

const inspectorValidation = async (receivedBody, files) => {
    const errors = [];                  

    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo "${field}" no está permitido`);
    });

    if (receivedBody.nro_nc) {
        if (!files || !files['documento_nc']) {
            errors.push('El documento_nc es obligatorio');
        } else {
            const file = files['documento_nc'][0];
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
                errors.push('El documento_nc debe ser una imagen en formato JPEG o PNG');
            }
        }
    }


    if (!receivedBody.nro_acta) {
        errors.push('Ingrese nro_acta obligatorio');
    }


    if (!files || !files['documento_acta']) {
        errors.push('El documento_acta es obligatorio');
    } else {
        const file = files['documento_acta'][0];
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
            errors.push('El documento_acta debe ser una imagen en formato JPEG o PNG');
        }
    }
    if (!receivedBody.id_inspector) {
        errors.push('El inspector es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_inspector });

        if (!existingUser) {
            errors.push('Este inspector no existe');
        }
    }

    const existingActa = await validateActa(receivedBody.nro_acta)

    if (existingActa) {
        errors.push('Esta acta ya fue registrada. Por favor comuniquese con su superior');
    }




    const relatedFields = [receivedBody.nombre_MC, receivedBody.nro_medida_complementaria, files['documento_medida_complementaria']];
    const anyRelatedFieldFilled = relatedFields.some(field => field !== undefined && field !== null);

    if (anyRelatedFieldFilled) {
        if (!receivedBody.nombre_MC) {
            errors.push('El campo nombre_MC es obligatorio cuando se proporciona alguno de los otros campos relacionados.');
        }
        if (!receivedBody.nro_medida_complementaria) {
            errors.push('El campo nro_medida_complementaria es obligatorio cuando se proporciona alguno de los otros campos relacionados.');
        }
        if (!files || !files['documento_medida_complementaria']) {
            errors.push('El documento_medida_complementaria es obligatorio');
        } else {
            const file = files['documento_medida_complementaria'][0];
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
                errors.push('El documento_medida_complementaria debe ser una imagen en formato JPEG o PNG');
            }
        }
    }

    return errors;
};

module.exports = inspectorValidation;
