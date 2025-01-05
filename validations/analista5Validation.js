const { validateUserExistController } = require("../controllers/usuarioController")
const { getNC } = require("../controllers/ncController")
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

const allowedFields = [
    'nro_acta', 'fecha_acta', 'id_nc', 'id_analista_5', 'tipo'
];

const analista5Validation = async (receivedBody, files, params) => {
    const errors = [];
    const id = params.id;
    const receivedFields = Object.keys(receivedBody);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    invalidFields.forEach(field => {
        errors.push(`El campo ${field} no está permitido`);
    });

    if (!receivedBody.nro_acta) {
        errors.push('Ingrese nro_acta obligatorio');
    }

    if (!receivedBody.fecha_acta) {
        errors.push('Ingrese fecha_acta obligatorio');
    } else if (!fechaRegex.test(receivedBody.fecha_acta)) {
        errors.push('El formato de la fecha_acta debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(receivedBody.fecha_acta);
        if (isNaN(parsedFecha.getTime())) {
            errors.push('fecha_acta debe ser una fecha válida');
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

    if (!receivedBody.id_analista_5) {
        errors.push('El analista 5 es obligatorio');
    } else {
        const existingUser = await validateUserExistController({ id: receivedBody.id_analista_5 });

        if (!existingUser) {
            errors.push('Este analista no existe');
        }
    }

    if (!receivedBody.tipo) {
        errors.push('Ingrese tipo obligatorio');
    } else if (!['analista3', 'analista4', 'gerencia'].includes(receivedBody.tipo)) {
        errors.push('El tipo debe ser analista3 o analista4 o gerencia');
    }

    // const existingRSG = await getRSGController(id);

    // if(!existingRSG){
    //     errors.push('Este RSG no existe');
    // }

    

    if (!files || !files['documento_acta']) {
        errors.push('El documento_acta es obligatorio');
    } else {
        const file = files['documento_acta'][0];
        if (!['application/pdf'].includes(file.mimetype)) {
            errors.push('El documento_acta debe ser una imagen en formato PDF');
        }
    }

    return errors;
};


module.exports = { analista5Validation };
