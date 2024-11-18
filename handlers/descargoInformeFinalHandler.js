const {
    createDescargoAndAssociate,
    updateDescargoAndAssociate
} = require('../controllers/descargoInformeFinalController');

const createDescargoHandler = async (req, res) => {
    const { nro_descargo, fecha_descargo,  documento_DIFI } = req.body;
    
    try {
        
        const response = await createDescargoAndAssociate({nro_descargo, fecha_descargo,  documento_DIFI});
        
        if (!response) {
            return res.status(400).json({
                message: 'Error al crear y asociar DescargoIFI',
                data: []
            });
        }
        return res.status(200).json({
            message: 'DescargoIFI creado y asociado a IFI correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al crear y asociar DescargoIFI:', error);
        return res.status(500).json({
            message: 'Error al crear y asociar DescargoIFI',
            error
        });
    }
};



const updateDescargoHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_descargo, fecha_descargo, documento_DIFI} = req.body;
    try {
        const response = await updateDescargoAndAssociate(id, nro_descargo, fecha_descargo, documento_DIFI);
        
        if (!response) {
            return res.status(400).json({
                message: `Error al modificar el DescargoIFI con el id: ${id}`,
                data: []
            });
        }
        return res.status(200).json({
            message: 'DescargoIFI actualizado y asociado con IFI correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al actualizar DescargoIFI y asociarlo a IFI:', error);
        return res.status(500).json({
            message: 'Error al actualizar DescargoIFI y asociarlo a IFI',
            data:error
        });
    }
};

module.exports = {
    createDescargoHandler,
    updateDescargoHandler
};

