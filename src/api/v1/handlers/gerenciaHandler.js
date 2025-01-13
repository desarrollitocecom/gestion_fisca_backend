const { getRSGController, getAllRSGforGerenciaController, updateRSGNPController } = require("../controllers/rsgController")
const { createRGController, getAllRGforGerenciaController, getRGforAnalista5Controller, getAllRGForGerenciaController } = require("../controllers/rgController")
const { updateDocumento } = require("../controllers/documentoController");
const { responseSocket } = require('../../../utils/socketUtils');
const { gerenciaValidation } = require("../validations/gerenciaValidation")
const { getAllRecursosApelacionesController, updateRecursoApelacionController } = require("../controllers/recursoApelacionController")
const fs = require("node:fs");
const { getIo } = require("../../../sockets");

const getAllRSGforGerenciaHandler = async (req, res) => {
    try {
        const response = await getAllRSGforGerenciaController();

        if (response.length === 0) {
            return res.status(200).json({
                message: "Ya no hay RSG para gerencia",
                data: []
            });
        }

        return res.status(200).json({
            message: "RSGs obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener :", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs." });
    }
};

const getAllRecursosApelacionesHandler = async (req, res) => {
    try {
        const response = await getAllRecursosApelacionesController();

        if (response.length === 0) {
            return res.status(200).json({
                message: "Ya no hay Apelaciones para gerencia",
                data: []
            });
        }

        return res.status(200).json({
            message: "Apelaciones obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener :", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs." });
    }
}



const createRGHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await gerenciaValidation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_rg']) {
            fs.unlinkSync(req.files['documento_rg'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { nro_rg, fecha_rg, id_nc, id_gerente, tipo } = req.body;
    const { id } = req.params

    try {
        const newRG = await createRGController({
            nro_rg,
            fecha_rg,
            documento_rg: req.files['documento_rg'][0],
            id_nc,
            id_gerente,
            tipo
        });
        if (!newRG) {
            return res.status(201).json({ message: 'Error al crear RG', data: [] });
        }

        const response = await updateRecursoApelacionController(id, { id_original: newRG.id, id_gerencia: newRG.id, tipo: 'TERMINADO' })

        await updateDocumento({ id_nc, total_documentos: newRG.documento_rg, nuevoModulo: "RESOLUCION GERENCIAL" });

        if (response) {
            // await responseSocket({ id: newRG.id, method: getRGforAnalista5Controller, socketSendName: 'sendAnalita5fromGerencia', res });
            // io.emit("sendGerencia", { id, remove: true });
            return res.status(200).json({
                message: "Subido Correctamente",
                data: response
              });
          
        } else {
            res.status(400).json({
                message: 'Error al enviar el RG al socket',
            });
        }

    } catch (error) {
        console.error("Error interno al crear RG:", error);
        return res.status(500).json({ message: "Error interno al crear RG", data: error });
    }
};



const createRGRectificacionHandler = async (req, res) => {
    const io = getIo();

    const invalidFields = await gerenciaValidation(req.body, req.files, req.params);

    if (invalidFields.length > 0) {
        if (req.files['documento_rg']) {
            fs.unlinkSync(req.files['documento_rg'][0].path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: invalidFields
        });
    }

    const { nro_rg, fecha_rg, id_nc, id_gerente, tipo } = req.body;
    const { id } = req.params

    try {
        const newRG = await createRGController({
            nro_rg,
            fecha_rg,
            documento_rg: req.files['documento_rg'][0],
            id_nc,
            id_gerente,
            tipo
        });
        if (!newRG) {
            return res.status(201).json({ message: 'Error al crear RG', data: [] });
        }

        const response = await updateRecursoApelacionController(id, { id_gerencia: newRG.id, tipo: 'TERMINADO' })

        await updateDocumento({ id_nc, total_documentos: newRG.documento_rg, nuevoModulo: "RESOLUCION GERENCIAL" });

        if (response) {
            // await responseSocket({ id: newRG.id, method: getRGforAnalista5Controller, socketSendName: 'sendAnalita5fromGerencia', res });
            // io.emit("sendGerencia", { id, remove: true });
            return res.status(200).json({
                message: "Subido Correctamente",
                data: response
              });
          
        } else {
            res.status(400).json({
                message: 'Error al enviar el RG al socket',
            });
        }

    } catch (error) {
        console.error("Error interno al crear RG:", error);
        return res.status(500).json({ message: "Error interno al crear RG", data: error });
    }
};








const getAllRGforGerenciaHandler = async (req, res) => {

    try {
        const response = await getAllRGforGerenciaController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No existen más RG para gerencia',
                data: []
            });
        }

        return res.status(200).json({
            message: "RG obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error interno la obtener los RG para Gerencia:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los RG para Gerencia." });
    }
};

const getAllRGForGerenciaHandler = async (req, res) => {
    try {
      const response = await getAllRGForGerenciaController();
  
      if (response.length === 0) {
        return res.status(200).json({
          message: 'No hay más IFIs para el Area Resolutiva 2',
          data: []
        });
      }
  
      return res.status(200).json({
        message: "IFIs obtenidos correctamente para el Area Resolutiva 2",
        data: response,
      });
    } catch (error) {
      console.error("Error al obtener IFIs para AR2 en el servidor:", error);
      res.status(500).json({ error: "Error interno del servidor al obtener los IFIs para el AR2." });
    }
  }


module.exports = {
    getAllRSGforGerenciaHandler,
    createRGHandler,
    getAllRGforGerenciaHandler,
    getAllRecursosApelacionesHandler,
    createRGRectificacionHandler,
    getAllRGForGerenciaHandler
};
