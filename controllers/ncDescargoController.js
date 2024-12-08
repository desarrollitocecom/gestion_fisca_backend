const { DescargoNC } = require('../db_connection');
const { saveImage } = require('../utils/fileUtils');

const createDescargoNC = async ({ 
        nro_descargo,
        fecha_descargo,
        documento,
        id_analista1
    }) => {

    try {
        const documento_descargoNCPath = saveImage(documento, 'DescargoNC');

        const newDescargoNC = await DescargoNC.create({
            nro_descargo,
            id_estado: 1,
            fecha_descargo,
            documento: documento_descargoNCPath,
            id_analista1
        });

        console.log('NC creado con éxito');
        return newDescargoNC || null;

    } catch (error) {
        console.error('Error creando trámite:', error);
        return false;
    }
};

module.exports = { createDescargoNC };