const {
    createRsgnpController,
    updateRsgnpController,
    getRsgnpController,
    getAllRsgnpController,

} = require("../controllers/rsgnpController");
const {
    updateRsaController,
    getRsaController
} = require('../controllers/rsaController');
const { updateDocumento } = require('../controllers/documentoController');
const { startJobForDocument } = require('../jobs/DescargoJob');

const fs = require('node:fs');

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
const updateinRsaHandler = async (req, res) => {
    const { uuid, id } = req.body;
    const vRSGNP = "RSGNP";
    const errores = []
    if (!uuid) errores.push('El campo es requerido')
    if (!isValidUUID(uuid)) errores.push('Debe ser un tipo uuid')
    if (!id) errores.push('El campo es requerido')
    if (!isValidUUID(id)) errores.push('Debe ser un tipo uuid')
    if (errores > 0) {
        return res.status(404).json({
            message: 'Se Encontraron los siguientes Errores',
            data: errores
        })
    }

    try {
        const rsgnp = await getRsgnpController(id);
        if (!rsgnp) {
            return res.status(201).json({ message: "No se ecuentra el ID en RSGNP", data: [] })
        }
        const Rsa = await updateinRsaController(uuid, vRSGNP, rsgnp.id);
        if (!Rsa) {
            return res.status(201).json({ message: "No se pudo modificar el RSGNP", data: [] })
        }


        return res.status(200).json({ message: 'Nuevo RSA modificado', data: Rsa })
    } catch (error) {
        console.error("Error al modificar RSGNP:", error);
        return res.status(500).json({ error: "Error interno del servidor al obtener modificar RSGNP." });
    }
}

const createRsgnpHandler = async (req, res) => {
    const { id } = req.params;

    const { nro_rsg, fecha_rsg, fecha_notificacion, id_descargo_RSGNP, id_rg, id_nc, id_AR3 ,tipo} = req.body;

    const errores = [];

    const documento_RSGNP = req.files && req.files["documento_RSGNP"] ? req.files["documento_RSGNP"][0] : null;

    if (!nro_rsg) errores.push('El campo nro_rsg es requerido');

    if (typeof nro_rsg !== 'string') errores.push('El nro_rsg debe ser una cadena de texto');

    if (!fecha_rsg) errores.push('El campo fecha_rsg es requerido');

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_rsg)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rsg);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida para fecha_rsg');
        }
    }

    if (!id_AR3) errores.push('El campo id_AR3 es requerido');

    if (!isValidUUID(id_AR3)) errores.push('El id_AR3 debe ser una UUID');

    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es requerido');

    if (!fechaRegex.test(fecha_notificacion)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD para fecha_notificacion');
    } else {
        const parsedFecha1 = new Date(fecha_notificacion);
        if (isNaN(parsedFecha1.getTime())) {
            errores.push('Debe ser una fecha válida para fecha_notificacion');
        }
    }


    if (!documento_RSGNP || documento_RSGNP.length === 0) {

        errores.push("El documento_RSGNP es requerido.");

    } else {
        if (documento_RSGNP.length > 1) {
            errores.push("Solo se permite un documento_RSGNP.");
        } else if (documento_RSGNP.mimetype !== "application/pdf") {
            errores.push("El documento_RSGNP debe ser un archivo PDF.");
        }
    }

    if (id_descargo_RSGNP && typeof id_descargo_RSGNP !== "string") errores.push('El campo id_descargo_RSGNP debe ser una cadena de texto');

    if (id_rg && typeof id_rg !== "string") errores.push('El campo id_rg debe ser una cadena de texto');

    if (errores.length > 0) {
        if (documento_RSGNP) {
            fs.unlinkSync(documento_RSGNP.path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }


    try {
        const get_id = await getRsaController(id);

        if (!get_id) {
            return res.status(404).json({ message: "El id del RSA no se encuentra", data: [] })
        }

        const newRsgnp = await createRsgnpController({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg, id_nc, id_AR3 });

        if (!newRsgnp) {
            return res.status(400).json({ message: 'No fue creado con éxito', data: [] });
        }
        const id_evaluar_rsa = newRsgnp.id;


        const response = await updateRsaController(id, { id_evaluar_rsa, tipo })

        if (!response) {
            return res.status(201).json({
                message: 'Error al crear el RGSNP y al asociar con RSA',
                data: []
            });
        }

        const total_documentos = newRsgnp.documento_RSGNP;

        const nuevoModulo = "RESOLUCION SUBGERENCIAL NO PROCEDENTE"

            await updateDocumento({ id_nc, total_documentos, nuevoModulo });

        const startDate = new Date();

        startJobForDocument(id_evaluar_rsa, startDate, 'rsgnp');

        return res.status(200).json({ message: 'RGSNP creado  con éxito y asociado con RSA', data: response });
    
    } catch (error) {
        console.error("Error al crear RSGNP:", error);

        return res.status(500).json({ error: error.message });

    }
};

const updateRsgnpHandler = async (req, res) => {
    const { id } = req.params;
    const {tipo } = req.body;
   
    try {
        const RSGNP = await updateRsgnpController(id,{ tipo });
        if (!RSGNP) {
            return res.status(201).json({ message: "Error al Modificar el RSGNP", data: [] })
        }
        return res.status(200).json({ message: " RSGNP Modificado", data: RSGNP });
    } catch (error) {
        console.error("Error al modificar RSGNP:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getRsgnpHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const rsgnp = await getRsgnpController(id);
        if (!rsgnp) {
            return res.status(404).json({ message: 'RSGNP no encontrado' });
        }
        return res.status(200).json(rsgnp);
    } catch (error) {
        console.error("Error al obtener RSGNP:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getAllRsgnpHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    try {
        const rsgnps = await getAllRsgnpController(Number(page), Number(limit));
        if (rsgnps.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más IFIs',
                data: {
                    data: [],
                    totalPage: rsgnps.currentPage,
                    totalCount: rsgnps.totalCount
                }
            });
        }
        return res.status(200).json({
            message: "RSAs obtenidos correctamente",
            data: rsgnps,
        });
    } catch (error) {
        console.error("Error al obtener todos los RSGNP:", error);
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createRsgnpHandler,
    updateRsgnpHandler,
    getRsgnpHandler,
    getAllRsgnpHandler,
    updateinRsaHandler
};
