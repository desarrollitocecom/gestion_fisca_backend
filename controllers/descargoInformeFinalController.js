const {DescargoIFI } = require('../db_connection');
const createDescargoAndAssociate = async ({nro_descargo, fecha_descargo, documento_DIFI}) => {
    try {
        const newDescargo = await DescargoIFI.create({
            nro_descargo,
            fecha_descargo,
            documento_DIFI,
            
        });

        return newDescargo || null;
    } catch (error) {
        console.error('Error al crear y asociar DescargoIFI:', error);
        return false
    }
};
const updateDescargoAndAssociate = async (descargoId, nro_descargo, fecha_descargo, documento_RSA) => {
    try {
     
        const descargo = await DescargoIFI.findOne({ where: { id: descargoId } });

        await descargo.update({
            nro_descargo,
            fecha_descargo,
            documento_RSA 
        });

        return descargo|| null ;
    } catch (error) {
        console.error('Error al actualizar DescargoIFI y asociarlo a IFI:', error);
        return { message: 'Error al actualizar DescargoIFI y asociarlo a IFI', error };
    }
};
module.exports = {
    createDescargoAndAssociate,
    updateDescargoAndAssociate
};
