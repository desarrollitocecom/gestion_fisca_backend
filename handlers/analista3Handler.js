const { getAllRSAforAnalista3Controller, getRsaController, updateRsaController, getRSAforAR3Controller, getRSAforAnalista5Controller } = require("../controllers/rsaController");
const { createDescargoRSAController } = require("../controllers/descargoRsaController");
const { updateDocumento } = require("../controllers/documentoController");
const { analista3DescargoValidation, analista3SinDescargoValidation } = require("../validations/analista3Validation");
const { responseSocket } = require('../utils/socketUtils');
const fs = require("node:fs");
const { getIo } = require("../sockets");

const getAllRSAforAnalista3Handler = async (req, res) => {
    try {
        const response = await getAllRSAforAnalista3Controller();

        if (response.length === 0) {
            return res.status(200).json({
                message: "Ya no hay más RSA para el Analista 3",
                data: []
            });
        }

        return res.status(200).json({
            message: "RSAs obtenidos exitosamente para el Analista 3",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener RSAs en el servidor para el Analista 3:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los RSAs para el Analista 3." });
    }
};

const createDescargoRSAHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await analista3DescargoValidation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_DRSA']) {
            fs.unlinkSync(req.files['documento_DRSA'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }


    const { nro_descargo, fecha_descargo, id_nc, id_analista_3 } = req.body;
    const { id } = req.params

    try {

        const newDescargoRSA = await createDescargoRSAController({ nro_descargo, fecha_descargo, documento_DRSA, id_nc, id_estado: 1, id_analista_3 });

        if (!newDescargoRSA) {
            return res.status(201).json({
                message: 'Error al crear DescargoRSA',
                data: []
            });
        }

        const response = await updateRsaController(id, { id_descargo_RSA: newDescargoRSA.id, id_estado_RSA: 3, tipo: 'AR3' })

        await updateDocumento({ id_nc, total_documentos: newDescargoRSA.documento_DRSA, nuevoModulo: "RECURSO DE RECONCIDERACION" });

        if (response) {
            await responseSocket({ id, method: getRSAforAR3Controller, socketSendName: 'sendAR3', res });
            io.emit("sendAnalista3", { id, remove: true });
        } else {
            res.status(400).json({
                message: 'Error al crear Descargo RSA en el Handler',
            });
        }
    } catch (error) {
        console.error('Error en el servidor al crear RSA:', error);

        return res.status(500).json({
            message: 'Error en el servidor al crear RSA',
            error: error.message
        });
    }
};

const sendWithoutDescargoRSAHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await analista3SinDescargoValidation(req.body, req.params);

    if (invalidFields.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { id_nc, id_analista_3 } = req.body;
    const { id } = req.params

    try {
        const newDescargoRSA = await createDescargoRSAController({ id_nc, id_estado: 2, id_analista_3 });
        if (!newDescargoRSA) {
            return res.status(201).json({
                message: 'Error al crear DescargoRSA',
                data: []
            });
        }

        const response = await updateRsaController(id, { id_descargo_RSA: newDescargoRSA.id, id_estado_RSA: 3, tipo: 'ANALISTA_5' })

        await updateDocumento({ id_nc, total_documentos: '', nuevoModulo: "RECURSO DE RECONCIDERACION" });

        if (response) {
            await responseSocket({ id, method: getRSAforAnalista5Controller, socketSendName: 'sendAnalita5fromAnalista3', res });
            io.emit("sendAnalista3", { id, remove: true });

        } else {
            res.status(400).json({
                message: 'Error al enviar sin Desargo RSA',
            });
        }

    } catch (error) {
        console.error('Error interno al crear DescargoRSA:', error);

        return res.status(500).json({
            message: 'Error interno al crear DescargoRSA',
            error: error.message
        });
    }
};



module.exports = {
    getAllRSAforAnalista3Handler,
    createDescargoRSAHandler,
    sendWithoutDescargoRSAHandler
};
