
const {
    createRsaController,
    updateRsaController,
    getRsaController,
    getAllRsaController
} = require('../controllers/rsaController');
const {
    getInformeFinalController,
    updateInformeFinalController
} = require('../controllers/informeFinalController');

const { updateDocumento } = require('../controllers/documentoController');

const { startJobForDocument } = require('../jobs/DescargoJob');

const fs = require('node:fs');
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
// Handler para crear una nueva RSA
const createRsaHandler = async (req, res) => {
    const { id } = req.params;

    const { nro_rsa, fecha_rsa, fecha_notificacion, tipo1, id_evaluar_rsa, id_descargo_RSA, id_nc, id_AR2 } = req.body;

    const documento_RSA = req.files && req.files["documento_RSA"] ? req.files["documento_RSA"][0] : null;

    const errores = [];

    if (!nro_rsa) errores.push('El campo nro_rsa es requerido');

    if (typeof nro_rsa !== 'string') errores.push('El nro_rsa debe ser una cadena de texto');

    if (!id_AR2) errores.push('El campo id_AR2 es requerido');

    if (!isValidUUID(id_AR2)) errores.push('El id_AR2 debe ser una UUID');

    if (!fecha_rsa) errores.push('El campo fecha_rsa es requerido');

    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_rsa)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rsa);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }

    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es requerido');

    if (!fechaRegex.test(fecha_notificacion)) {

        errores.push('El formato de la fecha de notificación debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }


    if (tipo1 && typeof tipo1 !== "string") errores.push('El campo tipo1 debe ser una cadena de texto');

    if (id_evaluar_rsa && typeof id_evaluar_rsa !== "string") errores.push('El campo id_evaluar_rsa debe ser una cadena de texto');

    if (!documento_RSA || documento_RSA.length === 0) {

        errores.push("El documento_RSA es requerido.");

    } else {

        if (documento_RSA.length > 1) {

            errores.push("Solo se permite un documento_RSA.");

        } else if (documento_RSA.mimetype !== "application/pdf") {

            errores.push("El documento_RSA debe ser un archivo PDF.");

        }
    }

    if (errores.length > 0) {

        if (documento_RSA) {

            fs.unlinkSync(documento_RSA.path);

        }
        return res.status(400).json({

            message: 'Se encontraron los siguientes errores',

            data: errores
        });
    }

    try {
        const get_id = await getInformeFinalController(id);

        if (!get_id) {
            return res.status(404).json({ message: "El id del IFI no se encuentra", data: [] })
        }
        const createRsa = await createRsaController({ nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo1, id_evaluar_rsa, id_descargo_RSA, id_nc, id_AR2 });

        if (!createRsa) {
            return res.status(404).json({ message: "Error al crear un RSA", data: [] });
        }
        const total_documentos = createRsa.documento_RSA;

        const nuevoModulo = "RESOLUCION SANCIONADORA ADMINISTRATIVA"

            await updateDocumento({ id_nc, total_documentos, nuevoModulo });

        const id_evaluar = createRsa.id;

        const response = await updateInformeFinalController(id, { id_evaluar})

        const startDate = new Date();

        startJobForDocument(id_evaluar, startDate, 'rsa');

        if (!response) {
            return res.status(201).json({
                message: 'Error al crear el RGA y al asociar',
                data: []
            });
        }
        return res.status(200).json({ message: "RSA creada con éxito", data: response });

    } catch (error) {

        console.error('Error en createRsaHandler:', error);

        return res.status(500).json({ message: "Error en el handler", error });

    }
};

// Handler para actualizar una RSA existente
const updateRsaHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_rsa, fecha_rsa, fecha_notificacion, tipo, id_evaluar_rsa, id_descargo_RSA, id_nc, id_estado_RSA, id_AR2 } = req.body;
    const documento_RSA = req.files && req.files["documento_RSA"] ? req.files["documento_RSA"][0] : null;

    const errores = [];

    // Validaciones de `nro_rsa`
    if (!nro_rsa) errores.push('El campo nro_rsa es requerido');
    if (typeof nro_rsa !== 'string') errores.push('El nro_rsa debe ser una cadena de texto');
    // Validaciones de `id_AR2`
    if (!id_AR2) errores.push('El campo id_AR2 es requerido');
    if (!isValidUUID(id_AR2)) errores.push('El id_AR2 debe ser una UUID');
    // Validaciones de `fecha_rsa`
    if (!fecha_rsa) errores.push('El campo fecha_rsa es requerido');
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_rsa)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rsa);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }
    if (!id_estado_RSA) errores.push('El campo es requerido')
    if (id_estado_RSA && isNaN(id_estado_RSA)) errores.push("El id debe ser un numero")
    // Validaciones de `fecha_notificacion`
    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es requerido');
    if (!fechaRegex.test(fecha_notificacion)) {
        errores.push('El formato de la fecha de notificación debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }

    // Validaciones de `documento_RSA`
    if (!documento_RSA || documento_RSA.length === 0) {
        errores.push("El documento_RSA es requerido.");
    } else {
        if (documento_RSA.length > 1) {
            errores.push("Solo se permite un documento_RSA.");
        } else if (documento_RSA.mimetype !== "application/pdf") {
            errores.push("El documento_RSA debe ser un archivo PDF.");
        }
    }


    // Validaciones de los campos adicionales
    if (tipo && typeof tipo !== "string") errores.push('El campo tipo debe ser una cadena de texto');
    if (id_evaluar_rsa && typeof id_evaluar_rsa !== "string") errores.push('El campo id_evaluar_rsa debe ser una cadena de texto');


    // Si hay errores, devolverlos
    if (errores.length > 0) {
        if (documento_RSA) {
            fs.unlinkSync(documento_RSA.path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const response = await updateRsaController({ id, nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA, id_nc, id_estado_RSA, id_AR2 });

        if (!response) {
            return res.status(400).json({ message: "Error al actualizar el RSA", data: [] });
        }
        return res.status(200).json({ message: "RSA actualizada con éxito", data: response });
    } catch (error) {
        console.error('Error en updateRsaHandler:', error);
        return res.status(500).json({ message: "Error en el handler", error });
    }
};

// Handler para obtener una RSA por ID
const getRsaHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await getRsaController(id);
        if (!response) {
            return res.status(404).json({ message: "RSA no encontrada" });
        }
        return res.status(200).json({ message: "RSA obtenida con éxito", data: response });
    } catch (error) {
        console.error('Error en getRsaHandler:', error);
        return res.status(500).json({ message: "Error en el handler", error });
    }
};

// Handler para obtener todas las RSAs
const getAllRsaHandler = async (req, res) => {
    try {
        const response = await getAllRsaController();
        if (!response) {
            return res.status(404).json({ message: "No se encontraron RSAs" });
        }
        return res.status(200).json({ message: "RSAs obtenidas con éxito", data: response });
    } catch (error) {
        console.error('Error en getAllRsaHandler:', error);
        return res.status(500).json({ message: "Error en el handler", error });
    }
};


module.exports = {
    createRsaHandler,
    updateRsaHandler,
    getRsaHandler,
    getAllRsaHandler,

};
