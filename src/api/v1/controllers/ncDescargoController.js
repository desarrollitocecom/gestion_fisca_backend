const { DescargoNC } = require('../../../config/db_connection');
const { saveImage } = require('../../../utils/fileUtils');

const createDescargoNCController = async ({ 
        nro_descargo,
        fecha_descargo,
        documento,
        id_analista1
    }) => {

    try {
        let documento_descargoNCPath = null;

        if(documento){
            documento_descargoNCPath = saveImage(documento, 'DescargoNC');
        }
        
        const newDescargoNC = await DescargoNC.create({
            nro_descargo,
            fecha_descargo,
            documento: documento_descargoNCPath,
            id_analista1
        });

        return newDescargoNC || null;

    } catch (error) {
        console.error('Error creando Descargo NC desde el controlador:', error);
        return false;
    }
};


module.exports = { createDescargoNCController };