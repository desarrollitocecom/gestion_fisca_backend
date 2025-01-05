const { validateUserExistController } = require("../controllers/usuarioController")
const { getNC } = require("../controllers/ncController")
const { getRsaController } = require("../controllers/rsaController")
const { getRSGController } = require("../controllers/rsgController")
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const allowedFields = [
    'nro_descargo', 'fecha_descargo', 'id_nc', 'id_analista_4'
];

const analista4DescargoValidation = async (receivedBody, files, params) => {
    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.nro_descargo) {
        errors.push('Ingrese nro_descargo obligatorio');
    }

    if (!receivedBody.fecha_descargo) {
        errors.push('Ingrese fecha_descargo obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha_descargo)) {
        errors.push('El formato de la fecha_descargo debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha_descargo);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_descargo debe ser una fecha válida');
        }
    }

    if (!files || !files['documento_DRSGNP']) {
        errors.push('El documento_DRSGNP es obligatorio');
    } else {
        const file = files['documento_DRSGNP'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento_DRSGNP debe ser una imagen en formato PDF');
        }
    }

    if (!receivedBody.id_analista_4) {
        errors.push('El analista 4 es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_analista_4 });

        if (!existingUser) {
            errors.push('Este analista no existe');
        }
    }

    const existingRSG = await getRSGController(id);

    if(!existingRSG){
        errors.push('Este RSG no existe');
    }

    if (!receivedBody.id_nc) {
        errors.push('El campo id_nc es requerido')
    } else {
        const existingNC = await getNC(receivedBody.id_nc);

        if (!existingNC) {
            errors.push('Este NC no existe');
        }
    }

    return errors;
};

const analista4SinDescargoValidation = async (receivedBody, params) => {

    const allowedFields = [
        'id_nc', 'id_analista_4'
    ];

    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.id_analista_4) {
        errors.push('El analista 4 es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_analista_4 });

        if (!existingUser) {
            errors.push('Este analista no existe');
        }
    }

    const existingRSG = await getRSGController(id);

    if(!existingRSG){
        errors.push('Este RSG no existe');
    }

    if (!receivedBody.id_nc) {
        errors.push('El campo id_nc es requerido')
    } else {
        const existingNC = await getNC(receivedBody.id_nc);

        if (!existingNC) {
            errors.push('Este NC no existe');
        }
    }

    return errors;
};


module.exports = { analista4DescargoValidation, analista4SinDescargoValidation };
