const {
  DocumentoOpcional, DocumentoOpcionalLista
} = require('../../../config/db_connection');

const { saveImage, deleteFile } = require("../../../utils/fileUtils");

const getDocumentoOpcional = async (id) => {
  try {
    const response = await DocumentoOpcionalLista.findOne({
      where: { id_nc: id }
    })
    return response || null
  } catch (error) {
    console.error({ message: "Error en el Controlador al traer el documento", data: error })
    return false
  }
}

const createDocumentoOpcional = async ({
  nro_docOpcional, fecha_docOpcional, documento_opcional, id_plataforma, tipo_documentoOpcional, id_nc
}) => {
  let documento_opcional_path;

  try {

    documento_opcional_path = saveImage(documento_opcional, "Documento Opcional");

    const response = await DocumentoOpcional.create({
      nro_docOpcional, fecha_docOpcional, documento_opcional: documento_opcional_path, id_plataforma, tipo_documentoOpcional, id_nc
    });
    return response || null;

  } catch (error) {
    if (documento_opcional_path) {
      deleteFile(documento_opcional_path);
    }
    console.error("Error al crear el Documento Opcional desde el Controlador:", error);
    return false;
  }
};

const createDocumentoOpcionalLista = async (model, id_nc, docs) => {

  const total_DocumentoOpcionalLista = [{ modulo: model, document_path: docs }];

  try {
    const response = await DocumentoOpcionalLista.create({ id_nc, total_DocumentoOpcionalLista });
    return response || null;
  } catch (error) {
    console.error({ message: "Error en el Controlador", data: error })
    return false
  }
}


const updateDocumentoOpcionalLista = async ({ id_nc, total_DocumentoOpcionalLista, nuevoModulo }) => {
  try {
      console.log( id_nc, total_DocumentoOpcionalLista, nuevoModulo);
      
      const response = await DocumentoOpcionalLista.findOne({ where: { id_nc: id_nc} });
      
      if (response) {
          
          const documentosActuales = response.total_DocumentoOpcionalLista || [];

          const nuevosDocumentos = Array.isArray(total_DocumentoOpcionalLista) ? total_DocumentoOpcionalLista : [total_DocumentoOpcionalLista];

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
              total_DocumentoOpcionalLista: totalFinal
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
  getDocumentoOpcional,
  createDocumentoOpcional,
  createDocumentoOpcionalLista,
  updateDocumentoOpcionalLista
}