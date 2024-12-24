const { getRSGController, getAllRSGforGerenciaController, updateRSGNPController } = require("../controllers/rsgController")
const { createRGController, getAllRGforGerenciaController, getRGforAnalista5Controller } = require("../controllers/rgController")
const { updateDocumento } = require("../controllers/documentoController");
const {responseSocket} = require('../utils/socketUtils');
const fs = require("node:fs");
const { getIo } = require("../sockets");

const getAllRSGforGerenciaHandler = async (req, res) => {
    try {
        const response = await getAllRSGforGerenciaController();

        if (response.length === 0) {
            return res.status(200).json({
                message: "Ya no hay RSG para gerencia",
                data: []
            });
        }

        return res.status(200).json({
            message: "RSGs obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener :", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs." });
    }
};


const createRGHandler = async (req, res) => {
    const io = getIo();

    const { id } = req.params;
    const existingRSG = await getRSGController(id);

    if (!existingRSG) {
        return res.status(404).json({ message: "No se encuentra id del RSGNP", data: [] })
    }

    const { nro_rg, fecha_rg, fecha_notificacion, id_nc, id_gerente, tipo } = req.body;

    const errores = [];

    const documento_rg = req.files && req.files["documento_rg"] ? req.files["documento_rg"][0] : null;

    if (!nro_rg) errores.push('El campo nro_rg es obligatorio');

    if (!fecha_rg) errores.push('El campo fecha_rg es obligatorio');

    if (!tipo) errores.push('El campo tipo es obligatorio');

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_rg)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD');

    } else {

        const parsedFecha = new Date(fecha_rg);

        if (isNaN(parsedFecha.getTime())) {

            errores.push('Debe ser una fecha válida');
        }
    }
    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es obligatorio');

    if (!fechaRegex.test(fecha_notificacion)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD');

    } else {

        const parsedFecha = new Date(fecha_notificacion);

        if (isNaN(parsedFecha.getTime())) {

            errores.push('Debe ser una fecha válida');
        }
    }

    if (!documento_rg || documento_rg.length === 0) {

        errores.push("El documento_rg es requerido.");

    } else {
        if (documento_rg.length > 1) {
            errores.push("Solo se permite un documento_rg.");
        } else if (documento_rg.mimetype !== "application/pdf") {
            errores.push("El documento_rg debe ser un archivo PDF.");
        }
    }

    if (!id_gerente) errores.push('El campo id_gerente es requerido');
    if (!id_nc) errores.push('El campo id_nc es requerido');



    if (errores.length > 0) {

        if (documento_rg) {
            fs.unlinkSync(documento_rg.path);
        }

        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const newRG = await createRGController({
            nro_rg,
            fecha_rg,
            fecha_notificacion,
            documento_rg,
            id_nc,
            id_gerente,
            tipo
        });
        if (!newRG) {
            return res.status(201).json({ message: 'Error al crear RG', data: [] });
        }

        const response = await updateRSGNPController(id, { id_evaluar_rsg: newRG.id, tipo: 'TERMINADO' })

        await updateDocumento({ id_nc, total_documentos: newRG.documento_rg, nuevoModulo: "RESOLUCION GERENCIAL" });

        if (response) {
            await responseSocket({ id: newRG.id, method: getRGforAnalista5Controller, socketSendName: 'sendAnalita5fromGerencia', res });
            io.emit("sendGerencia", { id, remove: true });
            
        } else {
            res.status(400).json({
                message: 'Error al enviar el RG al socket',
            });
        }

    } catch (error) {
        console.error("Error interno al crear RG:", error);
        return res.status(500).json({ message: "Error interno al crear RG", data: error });
    }
};



const getAllRGforGerenciaHandler = async (req, res) => {

    try {
        const response = await getAllRGforGerenciaController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No existen más RG para gerencia',
                data: []
            });
        }

        return res.status(200).json({
            message: "RG obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error interno la obtener los RG para Gerencia:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los RG para Gerencia." });
    }
};












module.exports = {
    getAllRSGforGerenciaHandler,
    createRGHandler,
    getAllRGforGerenciaHandler
};
