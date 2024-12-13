
const {
    createRsaController,
    updateRsaController,
    getRsaController,
    getAllRsaController,
    getAllRSAforAR3Controller,
    getAllRSAforAN5Controller
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

    const { nro_rsa, fecha_rsa, fecha_notificacion, tipo1, id_evaluar_rsa, id_descargo_RSA, id_nc, id_AR2,tipo } = req.body;

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

        const response = await updateInformeFinalController(id, { id_evaluar,tipo})

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
const updateRsasendAN5Handler = async (req, res) => {
    const { id } = req.params;
    const {tipo } = req.body;
    

    try {
        const response = await updateRsaController(id,{tipo});

        if (!response) {
            return res.status(400).json({ message: "Error al actualizar el RSA", data: [] });
        }
        return res.status(200).json({ message: "RSA actualizado con éxito", data: response });
    } catch (error) {
        console.error('Error en updateRsaHandler:', error);
        return res.status(500).json({ message: "Error en el handler", error });
    }
};
const getAllRSAforAN5Handler=async (req,res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
  
    if (isNaN(page)) errores.push("El page debe ser un número");
    if (page <= 0) errores.push("El page debe ser mayor a 0");
    if (isNaN(limit)) errores.push("El limit debe ser un número");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0");
  
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
  
    try {
        const response = await getAllRSAforAN5Controller(Number(page), Number(limit));
  
        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más RSAs',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }
  
        return res.status(200).json({
            message: "RSAs obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener RSAs para AR1:", error);
      return  res.status(500).json({ error: "Error interno del servidor al obtener los RSAs." });
    }
}
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
const getAllRSAforAR3Handler = async (req, res) => {  
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
  
    if (isNaN(page)) errores.push("El page debe ser un número");
    if (page <= 0) errores.push("El page debe ser mayor a 0");
    if (isNaN(limit)) errores.push("El limit debe ser un número");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0");
  
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
  
    try {
        const response = await getAllRSAforAR3Controller(Number(page), Number(limit));
  
        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más IFIs',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }
  
        return res.status(200).json({
            message: "IFIs obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener IFIs para AR1:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs." });
    }
  };


module.exports = {
    createRsaHandler,
    updateRsasendAN5Handler,
    getRsaHandler,
    getAllRsaHandler,
    getAllRSAforAR3Handler,
    getAllRSAforAN5Handler

};
