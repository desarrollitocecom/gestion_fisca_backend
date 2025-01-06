const { DescargoIFI } = require('../../../config/db_connection');
const { saveImage, deleteFile } = require('../../../utils/fileUtils');
const createDescargoAndAssociate = async ({ nro_descargo, fecha_descargo, documento_DIFI,id_nc ,id_analista_2}) => {
    let documento_DIFI_path;
    try {
        documento_DIFI_path = saveImage(documento_DIFI, 'Descargos_IFIs')
        const newDescargo = await DescargoIFI.create({
            nro_descargo,
            fecha_descargo,
            documento_DIFI: documento_DIFI_path,
            id_nc,
            id_analista_2
        });

        return newDescargo || null;
    } catch (error) {
        if (documento_DIFI_path) {
            deleteFile(documento_DIFI_path);
        }
        console.error('Error al crear y asociar DescargoIFI:', error);
        return false
    }
};
const updateDescargoAndAssociate = async ({ id, nro_descargo, fecha_descargo, documento_DIFI,id_nc,id_analista_2 }) => {
    let documento_DIFI_path;
    try {

        const descargo = await DescargoIFI.findOne({ where: { id } });
        documento_DIFI_path = descargo.documento_DIFI
        if (documento_DIFI) {
            documento_DIFI_path = saveImage(documento_DIFI, 'Descargos_IFIs');
            if (descargo.documento_DIFI) {
                deleteFile(descargo.documento_DIFI);
            }
        }
        if (descargo) {
            await descargo.update({
                nro_descargo,
                fecha_descargo,
                documento_DIFI: documento_DIFI_path,
                id_nc,
                id_analista_2
            });
        }

        return descargo || null;
    } catch (error) {
        if (documento_DIFI_path) {
            deleteFile(documento_DIFI_path);
        }
        console.error('Error al actualizar DescargoIFI y asociarlo a IFI:', error);
        return { message: 'Error al actualizar DescargoIFI y asociarlo a IFI', error };
    }
};


const createDescargoIFI = async ({ nro_descargo, fecha_descargo, documento_DIFI,id_nc, id_estado ,id_analista_2}) => {
    let documento_DIFI_path;
    try {
        if(documento_DIFI){
            documento_DIFI_path = saveImage(documento_DIFI, 'Descargos_IFIs')
        }
        const newDescargo = await DescargoIFI.create({
            nro_descargo,
            fecha_descargo,
            documento_DIFI: documento_DIFI_path,
            id_nc,
            id_estado,
            id_analista_2
        });

        return newDescargo || null;
    } catch (error) {
        if (documento_DIFI_path) {
            deleteFile(documento_DIFI_path);
        }
        console.error('Error al crear y asociar DescargoIFI:', error);
        return false
    }
};

module.exports = {
    createDescargoAndAssociate,
    updateDescargoAndAssociate,
    createDescargoIFI
};
