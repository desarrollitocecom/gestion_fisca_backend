const {
    Documento
} = require('../db_connection');

const getDocumento = async (id) => {
    try {
        const response = await Documento.findOne({
            where: { id_nc: id }
        })
        return response || null
    } catch (error) {
        console.error({ message: "Error en el Controlador al traer el documento", data: error })
        return false
    }
}
const createDocumento = async (model, id_nc, docs) => {

    const total_documentos = [{ modulo: model, document_path: docs }];

    try {
        const response = await Documento.create({ id_nc, total_documentos });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el Controlador", data: error })
        return false
    }
}

const updateDocumento = async ({ id_nc, total_documentos, nuevoModulo }) => {
    try {
        
        const response = await Documento.findOne({ where: { id_nc} });
         
        if (response) {
            
            const documentosActuales = response.total_documentos || [];

            const nuevosDocumentos = Array.isArray(total_documentos) ? total_documentos : [total_documentos];

            const totalFinal = [
                ...documentosActuales,
                ...nuevosDocumentos.map(doc => {
                  
                    return {
                        modulo: doc.modulo || nuevoModulo, 
                        document_path: doc.document_path || doc 
                    };
                })
            ];

            await response.update({
                total_documentos: totalFinal
            });

            return response;
        }

        return null;
    } catch (error) {
        console.error({ message: "Error en el Controlador", data: error });
        return false;
    }
};




module.exports = {
    createDocumento,
    getDocumento,
    updateDocumento
}