const {
    createDescargoRsaController,
    updateDescargoRsaController
} = require('../controllers/descargoRsaController');

const createDescargoRsaHandler = async (req, res) => {
    const { nro_descargo, fecha_descargo,  documento_DRSA } = req.body;
    
    try {
        console.log( nro_descargo, fecha_descargo,  documento_DRSA);
        
        const response = await createDescargoRsaController({nro_descargo, fecha_descargo,  documento_DRSA});
        console.log("responseAÑEEEEEEE:",response);
        
        if (!response) {
            return res.status(201).json({
                message: 'Error al crear y asociar DescargoRSA',
                data: []
            });
        }
        return res.status(200).json({
            message: 'DescargoRSA creado y asociado a RSA correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al crear DescargoRSA:', error);
        return res.status(500).json({
            message: 'Error al crear DescargoRSA'
        });
    }
};



const updateDescargoRsaHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_descargo, fecha_descargo, documento_RSA} = req.body;
    try {
        const response = await updateDescargoRsaController(id, nro_descargo, fecha_descargo, documento_RSA);
        
        if (!response) {
            return res.status(400).json({
                message: `Error al modificar el DescargoRSA con el id: ${id}`,
                data: []
            });
        }
        return res.status(200).json({
            message: 'DescargoRSAactualizado y asociado con RSAcorrectamente',
            data: response
        });
    } catch (error) {
        console.error('Error al actualizar DescargoRSA:', error);
        return res.status(500).json({
            message: 'Error al actualizar DescargoRSA',
            error
        });
    }
};

module.exports = {
   createDescargoRsaHandler,
   updateDescargoRsaHandler
};

