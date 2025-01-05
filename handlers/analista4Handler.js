const { getRSGController, getAllRSGforAnalista4Controller, getRSGforGerenciaController, getRSGforAnalista5Controller, updateRSGNPController } = require("../controllers/rsgController")
const { createDescargoRSGNPController } = require('../controllers/descargoRsgnpController');
const { updateDocumento } = require("../controllers/documentoController");
const { responseSocket } = require("../utils/socketUtils")
const { analista4DescargoValidation, analista4SinDescargoValidation } = require("../validations/analista4Validation")
const fs = require("node:fs");
const { getIo } = require("../sockets");


const getAllRSGforAnalista4Handler = async (req, res) => {
    try {
        const response = await getAllRSGforAnalista4Controller();

        if (response.length === 0) {
            return res.status(200).json({
                message: "Ya no hay más RSG para el Analista 4",
                data: [],
            });
        }

        return res.status(200).json({
            message: "RSGs obtenidos correctamente para el Analista 4",
            data: response,
        });
    } catch (error) {
        console.error("Error en el servidor al obtener los RSGs para el Analista 4:", error);
        res
            .status(500)
            .json({ error: "Error en el servidor al obtener los RSGs para el Analista 4." });
    }
};

const createDescargoRSGNPHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await analista4DescargoValidation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_DRSGNP']) {
            fs.unlinkSync(req.files['documento_DRSGNP'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { nro_descargo, fecha_descargo, id_nc, id_analista_4 } = req.body;
    const { id } = req.params

    try {
        const newDescargo = await createDescargoRSGNPController({ nro_descargo, fecha_descargo, documento_DRSGNP: req.files['documento_DRSGNP'][0], id_nc, id_analista_4 });

        if (!newDescargo) {
            return res.status(400).json({
                message: "Error al crear el Descargo RSGNP",
                data: []
            });
        }

        const response = await updateRSGNPController(id, { id_descargo_RSG: newDescargo.id, id_estado_RSGNP: 3, tipo: 'GERENCIA' })

        await updateDocumento({ id_nc, total_documentos: newDescargo.documento_DRSG, nuevoModulo: "RECURSO DE APELACION" });

        if (response) {
            await responseSocket({ id, method: getRSGforGerenciaController, socketSendName: 'sendGerencia', res });
            io.emit("sendAnalista4", { id, remove: true });
        } else {
            res.status(400).json({
                message: 'Error al crear Descargo RSGNP',
            });
        }

    } catch (error) {
        console.error("Error interno al crear el descargo RSGNP:", error);
        return res.status(500).json({ message: "Error interno al crear el descargo RSGNP", error: error.message });
    }
};


const sendWithoutDescargoRSGNPHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await analista4SinDescargoValidation(req.body, req.params);

    if (invalidFields.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { id_nc, id_analista_4 } = req.body;
    const { id } = req.params

    try {
        const newDescargo = await createDescargoRSGNPController({ id_nc, id_analista_4 });

        if (!newDescargo) {
            return res.status(400).json({
                message: "Error al crear el sin Descargo RSGNP",
                data: []
            });
        }

        const response = await updateRSGNPController(id, { id_descargo_RSG: newDescargo.id, id_estado_RSGNP: 3, tipo: 'ANALISTA_5' })

        await updateDocumento({ id_nc, total_documentos: '', nuevoModulo: "RECURSO DE APELACION" });

        if (response) {
            await responseSocket({ id, method: getRSGforAnalista5Controller, socketSendName: 'sendAnalita5fromAnalista4', res });
            io.emit("sendAnalista4", { id, remove: true });
        } else {
            res.status(400).json({
                message: 'Error al enviar al socket los datos',
            });
        }

    } catch (error) {
        console.error("Error al crear el descargo RSGNP:", error);
        return res.status(500).json({ message: "Error al crear el descargo RSNP", error: error.message });
    }
};

module.exports = {
    getAllRSGforAnalista4Handler,
    createDescargoRSGNPHandler,
    sendWithoutDescargoRSGNPHandler
};
