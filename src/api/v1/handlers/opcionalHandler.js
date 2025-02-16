const { getAllNCController } = require("../controllers/ncController");
const { createDocumentoOpcional, createDocumentoOpcionalLista, getDocumentoOpcional, updateDocumentoOpcionalLista } = require("../controllers/documentoOpcionalController");
const { opcionalDocumentValidation } = require("../validations/opcionalDocumentValidation")
const fs = require('fs');

const getAllNCHandler = async (req, res) => {
    try {
        const response = await getAllNCController();

        if (response.length === 0) {
            return res.status(200).json({
                message: "No existen NC registrados",
                data: []
            });
        }

        return res.status(200).json({
            message: "NC obtenidos exitosamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener NCs en el servidor", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los NCs." });
    }
};

const createOpcionalDocumentHandler = async (req, res) => {

    const invalidFields = await opcionalDocumentValidation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_opcional']) {
            fs.unlinkSync(req.files['documento_opcional'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { 
        nro_docOpcional, fecha_docOpcional, id_plataforma, tipo_documentoOpcional
    } = req.body;

    const { id } = req.params

    try {
        const newDocumentOptional = await createDocumentoOpcional({
            nro_docOpcional,
            fecha_docOpcional,
            documento_opcional: req.files['documento_opcional'][0],
            id_plataforma,
            tipo_documentoOpcional,
            id_nc: id
        });

        if (!newDocumentOptional) {
            return res.status(400).json({ error: 'Error al crear el Documento Opcional' });
        }

        console.log(id);

        const existingLista = await getDocumentoOpcional(id);

        console.log(existingLista)

        if (existingLista){
            await updateDocumentoOpcionalLista({ id_nc: id, total_DocumentoOpcionalLista: newDocumentOptional.documento_opcional, nuevoModulo: tipo_documentoOpcional });
        } else {
            await createDocumentoOpcionalLista(tipo_documentoOpcional, id, newDocumentOptional.documento_opcional);
        }
        
        if (newDocumentOptional) {
            return res.status(200).json({
                message: 'Documento Opcional creado con éxito',
                data: newDocumentOptional
              });
        } else {
            res.status(400).json({
                message: 'Error al crear el Documento Opcional',
            });
        }

    } catch (error) {
        console.error('Error interno del servidor al crear el Documento Opcional:', error);
        return res.status(500).json({ message: 'Error interno del servidor al crear el Documento Opcional' });
    }
};


module.exports = {
    getAllNCHandler,
    createOpcionalDocumentHandler
};
