const { validateUserExistController } = require("../controllers/usuarioController")
const { getNC } = require("../controllers/ncController")
const { getInformeFinalController } = require("../controllers/informeFinalController")
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const allowedFields = [
    'nro_resolucion', 'fecha_resolucion', 'id_nc', 'id_AR1'
];

const areaResolutiva1Validation = async (receivedBody, files, params) => {
    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.nro_resolucion) {
        errors.push('Ingrese nro_resolucion obligatorio');
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

    if (!receivedBody.id_AR1) {
        errors.push('El AR1 es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_AR1 });

        if (!existingUser) {
            errors.push('Este AR1 no existe');
        }
    }

    if (!files || !files['documento']) {
        errors.push('El documento es obligatorio');
    } else {
        const file = files['documento'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento debe ser una imagen en formato PDF');
        }
    }

    const existingIFI = await getInformeFinalController(id);

    if (!existingIFI) {
        errors.push('Este IFI no existe');
    }
    
    return errors;
};



module.exports = { areaResolutiva1Validation };
