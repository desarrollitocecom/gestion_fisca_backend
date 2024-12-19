const fs = require('fs');
const { getAllIFIforAnalista2Controller, updateInformeFinalController, getInformeFinalController, getIFIforAR2Controller } = require('../controllers/informeFinalController');
const { createDescargoIFI } = require('../controllers/descargoInformeFinalController');
const {updateDocumento}=require('../controllers/documentoController');
const {validateAnalista2} = require('../validations/analista2Validation')
const {responseSocket} = require('../utils/socketUtils')

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
    const {id}=req.params;
    const existingIFI=await getInformeFinalController(id);

    if(!existingIFI){
        return res.status(404).json({message:"No se encuentra id del IFI",data:[]})
    }

    const { 
        nro_descargo, 
        fecha_descargo,
        id_nc ,
        id_analista_2
    } = req.body;

    const errors = validateAnalista2(req.body);

    const documento_DIFI = req.files && req.files["documento_DIFI"] ? req.files["documento_DIFI"][0] : null;

    if (!documento_DIFI) {
        errors.push('El documento_DIFI es requerido');
    } else {
        if (documento_DIFI.mimetype !== 'application/pdf') {
            errors.push('El documento debe ser un archivo PDF');
        }
    }

    if (errors.length > 0) {
        if (documento_DIFI) {
            fs.unlinkSync(documento_DIFI.path); 
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errors',
            data: errors
        });
    }

    try {
        const newDescargoIFI = await createDescargoIFI({
            nro_descargo, 
            fecha_descargo, 
            documento_DIFI,
            id_nc,
            id_estado: 1,
            id_analista_2
        });

        const response = await updateInformeFinalController(id,{id_descargo_ifi: newDescargoIFI.id,tipo:'AR2'})

        await updateDocumento({id_nc, total_documentos: newDescargoIFI.documento_DIFI, nuevoModulo: "DESCARGO INFORME FINAL INSTRUCTIVO"});

        if (response) {
            await responseSocket({id, method: getIFIforAR2Controller, socketSendName: 'sendAR2', res});
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
    const {id}=req.params;
    const existingIFI = await getInformeFinalController(id); 

    if (!existingIFI) {
        return res.status(404).json({ message: "IFI no encontrada para actualizar" });
    }

    const { 
        id_nc,
        id_analista_2,
    } = req.body;

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
