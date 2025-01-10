const fs = require('fs');
const { getAllNCforPlataformaController, updateNC, getNCforInstructiva } = require("../controllers/ncController")
const { getAllIFIforPlataformaController, updateInformeFinalController, getIFIforAR2Controller } = require("../controllers/informeFinalController")
const { createDescargoNCController } = require("../controllers/ncDescargoController")
const { createDescargoIFI } = require("../controllers/descargoInformeFinalController")
const { plataformaDescargoNCValidation, plataformaDescargoIFIValidation } = require("../validations/plataformaValidation")
const { updateDocumento } = require('../controllers/documentoController');
const { getIo } = require("../../../sockets");
const { responseSocket } = require('../../../utils/socketUtils')

const getAllNCforPlataformaHandler = async (req, res) => {
    try {
        const response = await getAllNCforPlataformaController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay NCs para Plataforma',
                data: []
            });
        }

        return res.status(200).json({
            message: "Lista para Plataforma obtenido correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error del servidor al traer la lista para el Plataforma:", error);
        res.status(500).json({ error: "Error del servidor al traer la lista para el Plataforma" });
    }
}

const createDescargoNCHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await plataformaDescargoNCValidation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento']) {
            fs.unlinkSync(req.files['documento'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { 
        nro_descargo, fecha_descargo, id_analista1
    } = req.body;

    const { id } = req.params

    try {
        const newDescargoNC = await createDescargoNCController({
            nro_descargo,
            fecha_descargo,
            documento: req.files['documento'][0],
            id_analista1
        });

        if (!newDescargoNC) {
            return res.status(400).json({ error: 'Error al crear el Descargo NC' });
        }

        await updateDocumento({ id_nc: id, total_documentos: newDescargoNC.documento, nuevoModulo: 'DESCARGO - NOTIFICACION DE CARGO' });

        const response = await updateNC(id, {
            id_descargo_NC: newDescargoNC.id,
            estado: 'A_I'
        });

        if (response) {
            await responseSocket({ id, method: getNCforInstructiva, socketSendName: 'sendAI1', res });
            io.emit("sendAnalista1", { id, remove: true });
        } else {
            res.status(400).json({
                message: 'Error al actualizar el NC desde el Analista1',
            });
        }

    } catch (error) {
        console.error('Error interno del servidor al actualizar el NC desde el Analista1:', error);
        return res.status(500).json({ message: 'Error interno del servidor al actualizar el NC desde el Analista1' });
    }
};

const getAllIFIforPlataformaHandler = async (req, res) => {  

    try {
        const response = await getAllIFIforPlataformaController();
  
        if (response.length === 0) {
            return res.status(200).json({
                message: 'No existen IFIs para Plataforma en este momento',
                data: []
            });
        }
  
        return res.status(200).json({
            message: "IFIs obtenidos correctamente para Plataforma",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener IFIs para Plataforma desde el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs del Plataforma" });
    }
};

const createDescargoIFIHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await plataformaDescargoIFIValidation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_DIFI']) {
            fs.unlinkSync(req.files['documento_DIFI'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { 
        nro_descargo, fecha_descargo, id_nc , id_analista_2
    } = req.body;
    const { id } = req.params

    try {
        const newDescargoIFI = await createDescargoIFI({
            nro_descargo, 
            fecha_descargo, 
            documento_DIFI: req.files['documento_DIFI'][0],
            id_nc,
            id_analista_2
        });

        const response = await updateInformeFinalController(id,{id_descargo_ifi: newDescargoIFI.id,tipo:'AR2'})

        await updateDocumento({id_nc, total_documentos: newDescargoIFI.documento_DIFI, nuevoModulo: "DESCARGO INFORME FINAL INSTRUCTIVO"});

        if (response) {
            await responseSocket({id, method: getIFIforAR2Controller, socketSendName: 'sendAR2', res});
            io.emit("sendAnalista2", { id, remove: true });
        } else {
           res.status(400).json({
                message: 'Error al crear Descargo IFI',
            });
        }

    } catch (error) {
        console.error('Error al crear el Descargo IFI en el servidor:', error);
        return res.status(500).json({
            message: 'Error interno al crear el Descargo IFI',
            error: error.message
        });
    }
};


module.exports = { getAllNCforPlataformaHandler, createDescargoNCHandler, getAllIFIforPlataformaHandler, createDescargoIFIHandler };
