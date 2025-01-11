const { getAllIFIforAR2Controller, getInformeFinalController, updateInformeFinalController } = require('../controllers/informeFinalController');
const { updateDocumento } = require('../controllers/documentoController');
const { createRSG2Controller, getAllRSG2forAR2Controller } = require('../controllers/rsg2Controller');
const { createRSAController, createResoSAController, getRSGforAnalista3Controller, getRSAforAnalista3Controller } = require('../controllers/rsaController');
const { areaResolutiva2RSG2Validation, areaResolutiva2RSAValidation } = require('../validations/areaResolutiva2Validation')
const fs = require('node:fs');
const { responseSocket } = require('../../../utils/socketUtils')
const { getIo } = require("../../../sockets");

const getAllIFIforAR2Handler = async (req, res) => {

    try {
        const response = await getAllIFIforAR2Controller();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay más IFIs para el Area Resolutiva 2',
                data: []
            });
        }

        return res.status(200).json({
            message: "IFIs obtenidos correctamente para el Area Resolutiva 2",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener IFIs para AR2 en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs para el AR2." });
    }
};

const createRSG2Handler = async (req, res) => {
    const io = getIo();

    const invalidFields = await areaResolutiva2RSG2Validation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_RSG']) {
            fs.unlinkSync(req.files['documento_RSG'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { nro_rsg, fecha_rsg, tipo, id_nc, id_AR2 } = req.body;
    const { id } = req.params

    try {
        let estado
        if (tipo == 'A_TODO') {
            estado = 'ARCHIVO'
        } else {
            estado = 'PLATAFORMA_SANCION'
        }

        const newRsg2 = await createRSG2Controller({ nro_rsg, fecha_rsg, tipo, id_nc, id_AR2, estado, documento_RSG: req.files['documento_RSG'][0] });

        if (!newRsg2) {
            return res.status(404).json({ message: "Error al crear el RSG2 en el AR2", data: [] })
        }

        await updateDocumento({ id_nc, total_documentos: newRsg2.documento_RSG, nuevoModulo: "RESOLUCION SUBGERENCIAL 2" });

        const response = await updateInformeFinalController(id, { id_original: newRsg2.id, id_evaluar: newRsg2.id, tipo: 'TERMINADO_RSG2' })


        if (response) {
            await responseSocket({ id: newRsg2.id, method: getRSGforAnalista3Controller, socketSendName: 'sendAnalista3', res });

            io.emit("sendAR2", { id, remove: true });

        } else {
            res.status(400).json({
                message: 'Error al crear el RSG',
            });
        }



    } catch (error) {
        console.error("Error al crear RSG2 en el servidor:", error);
        return res.status(500).json({ error: "Error interno del servidor al crear RSG2." });
    }
};

const createRSAHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await areaResolutiva2RSAValidation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_RSA']) {
            fs.unlinkSync(req.files['documento_RSA'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { nro_rsa, fecha_rsa, id_nc, id_AR2 } = req.body;
    const { id } = req.params

    try {

        const newRSA = await createResoSAController({ nro_rsa, fecha_rsa, documento_RSA: req.files['documento_RSA'][0], id_nc, id_AR2 });

        if (!newRSA) {
            return res.status(404).json({ message: "Error al crear un RSA", data: [] });
        }

        await updateDocumento({ id_nc, total_documentos: newRSA.documento_RSA, nuevoModulo: "RESOLUCION SANCIONADORA ADMINISTRATIVA" });

        const response = await updateInformeFinalController(id, { id_evaluar: newRSA.id, tipo: 'TERMINADO' })

        if (response) {
            await responseSocket({ id: newRSA.id, method: getRSAforAnalista3Controller, socketSendName: 'sendAnalista3', res });

            io.emit("sendAR2", { id, remove: true });

        } else {
            res.status(400).json({
                message: 'Error al crear el RSA',
            });
        }

    } catch (error) {
        console.error('Error al crear el RSA en el servidor:', error);
        return res.status(500).json({ message: "Error en el RSA en el servidor", error });
    }
};

const getAllRSG2forAR2Handler = async (req, res) => {

    try {
        const response = await getAllRSG2forAR2Controller();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más RSG2 para el AR2',
                data: []
            });
        }

        return res.status(200).json({
            message: "RSG2 obtenidos exitosamente en el AR2",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener los RSG2 para el AR2 en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los RSG2 en el AR2." });
    }
};

const createRSARectificacionHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await areaResolutiva2RSAValidation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_RSA']) {
            fs.unlinkSync(req.files['documento_RSA'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { nro_rsa, fecha_rsa, id_nc, id_AR2 } = req.body;
    const { id } = req.params

    try {

        const newRSA = await createResoSAController({ nro_rsa, fecha_rsa, documento_RSA: req.files['documento_RSA'][0], id_nc, id_AR2 });

        if (!newRSA) {
            return res.status(404).json({ message: "Error al crear un RSA", data: [] });
        }

        await updateDocumento({ id_nc, total_documentos: newRSA.documento_RSA, nuevoModulo: "RESOLUCION RECTIFICACION SANCIONADORA" });

        const response = await updateInformeFinalController(id, { id_original: newRSA.id, id_evaluar: newRSA.id, tipo: 'TERMINADO' })

        if (response) {

            await responseSocket({ id: newRSA.id, method: getRSAforAnalista3Controller, socketSendName: 'sendAnalista3', res });
            io.emit("sendAR2", { id, remove: true });
            // res.status(200).json({
            //     message: 'LO LOGRAMOS',
            // });
        } else {
            res.status(400).json({
                message: 'Error al crear el RSA',
            });
        }

    } catch (error) {
        console.error('Error al crear el RSA en el servidor:', error);
        return res.status(500).json({ message: "Error en el RSA en el servidor", error });
    }
};

const createRSG2RectificacionHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await areaResolutiva2RSG2Validation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_RSG']) {
            fs.unlinkSync(req.files['documento_RSG'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { nro_rsg, fecha_rsg, tipo, id_nc, id_AR2 } = req.body;
    const { id } = req.params

    try {
        let estado
        if (tipo == 'A_TODO') {
            estado = 'ARCHIVO'
        } else {
            estado = 'PLATAFORMA_SANCION'
        }

        const newRsg2 = await createRSG2Controller({ nro_rsg, fecha_rsg, tipo, id_nc, id_AR2, estado, documento_RSG: req.files['documento_RSG'][0] });

        if (!newRsg2) {
            return res.status(404).json({ message: "Error al crear el RSG2 en el AR2", data: [] })
        }

        await updateDocumento({ id_nc, total_documentos: newRsg2.documento_RSG, nuevoModulo: "RESOLUCION SUBGERENCIAL RECTIFICACION" });

        const response = await updateInformeFinalController(id, { id_evaluar: newRsg2.id, tipo: 'TERMINADO_RSG2' })


        if (response) {
            await responseSocket({ id: newRsg2.id, method: getRSGforAnalista3Controller, socketSendName: 'sendAnalista3', res });

            io.emit("sendAR2", { id, remove: true });

        } else {
            res.status(400).json({
                message: 'Error al crear el RSG',
            });
        }



    } catch (error) {
        console.error("Error al crear RSG2 en el servidor:", error);
        return res.status(500).json({ error: "Error interno del servidor al crear RSG2." });
    }
};


module.exports = {
    getAllIFIforAR2Handler,
    createRSG2Handler,
    createRSAHandler,
    getAllRSG2forAR2Handler,
    createRSG2RectificacionHandler,
    createRSARectificacionHandler
}
