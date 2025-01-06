const fs = require('fs');
const { getAllIFIforAnalista2Controller, updateInformeFinalController, getInformeFinalController, getIFIforAR2Controller } = require('../controllers/informeFinalController');
const { createDescargoIFI } = require('../controllers/descargoInformeFinalController');
const {updateDocumento}=require('../controllers/documentoController');
const { analista2DescargoValidation, analista2SinDescargoValidation } = require('../validations/analista2Validation')
const {responseSocket} = require('../../../utils/socketUtils')
const { getIo } = require("../../../sockets");

const getAllIFIforAnalista2Handler = async (req, res) => {  

    try {
        const response = await getAllIFIforAnalista2Controller();
  
        if (response.length === 0) {
            return res.status(200).json({
                message: 'No existen IFIs para el Analista 2 en este momento',
                data: []
            });
        }
  
        return res.status(200).json({
            message: "IFIs obtenidos correctamente para el Analista 2",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener IFIs para el Analista 2 desde el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs del Analista 2" });
    }
};

const createDescargoIFIHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await analista2DescargoValidation(req.body, req.files, req.params);

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
        nro_descargo, 
        fecha_descargo,
        id_nc ,
        id_analista_2
    } = req.body;
    const { id } = req.params

    try {
        const newDescargoIFI = await createDescargoIFI({
            nro_descargo, 
            fecha_descargo, 
            documento_DIFI: req.files['documento_DIFI'][0],
            id_nc,
            id_estado: 1,
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

const sendWithoutDescargoIFIHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await analista2SinDescargoValidation(req.body, req.params);

    if (invalidFields.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { 
        id_nc,
        id_analista_2,
    } = req.body;
    const { id } = req.params

    try {
        const newDescargoIFI = await createDescargoIFI({ 
            id_nc,
            id_estado : 2,
            id_analista_2,
        });
        
        if (!newDescargoIFI) {
            return res.status(400).json({ error: 'Error al crear el Descargo IFI' });
        }
        
        const response = await updateInformeFinalController(id, { 
            id_descargo_ifi: newDescargoIFI.id,
            tipo: 'AR2'
        });

        await updateDocumento({id_nc, total_documentos: '', nuevoModulo: 'SIN DESCARGO IFI'});
   
        if (response) {
            await responseSocket({id, method: getIFIforAR2Controller, socketSendName: 'sendAR2', res});
            io.emit("sendAnalista2", { id, remove: true });
        } else {
           res.status(400).json({
                message: 'Error al crear sin descargo IFI en el handler',
            });
        }

    } catch (error) {
        console.error('Error al enviar sin descargo IFI en el servidor:', error);
        return res.status(500).json({ message: 'Error interno del servidor al crear el sin Descargo IFI' });
    }
}

module.exports = { getAllIFIforAnalista2Handler, createDescargoIFIHandler, sendWithoutDescargoIFIHandler };
