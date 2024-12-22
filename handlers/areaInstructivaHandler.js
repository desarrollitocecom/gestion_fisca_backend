const {
    updateNC,
    getAllNCforInstructiva,
  } = require("../controllers/ncController");
  const {
    createInformeFinalController,
    getIFIforAR1Controller,
    getIFIforAnalista2Controller,
  } = require("../controllers/informeFinalController");
  const { updateDocumento } = require("../controllers/documentoController");
  const {
    validateAreaInstructiva1,
  } = require("../validations/areaInstructiva1Validation");
  const { responseSocket } = require("../utils/socketUtils");
  const { getIo, getValuesByPrefix } = require("../sockets");
  // const jwt = require('jsonwebtoken');
  
  const getAllNCforInstructivaHandler = async (req, res) => {
    try {
      const response = await getAllNCforInstructiva();
  
      if (response.length === 0) {
        return res.status(200).json({
          message: "Ya no hay más tramites",
          data: [],
        });
      }
  
      return res.status(200).json({
        message: "Tramites obtenidos correctamente Instructiva fetch",
        data: response,
      });
    } catch (error) {
      console.error("Error al obtener tipos de documentos de identidad:", error);
      res
        .status(500)
        .json({ error: "Error interno del servidor al obtener los tramites." });
    }
  };
  
  const createInformeFinalHandler = async (req, res) => {
    const io = getIo();
    const { nro_ifi, fecha, id_nc, id_AI1, tipo } = req.body;
  
    const errors = validateAreaInstructiva1(req.body);
  
    const documento_ifi =
      req.files && req.files["documento_ifi"]
        ? req.files["documento_ifi"][0]
        : null;
  
    if (!documento_ifi || documento_ifi.length === 0) {
      errors.push("El documento_ifi es requerido.");
    } else {
      if (documento_ifi.length > 1) {
        errors.push("Solo se permite un documento_ifi.");
      } else if (documento_ifi.mimetype !== "application/pdf") {
        errors.push("El documento debe ser un archivo PDF.");
      }
    }
  
    if (errors.length > 0) {
      if (documento_ifi) {
        fs.unlinkSync(documento_ifi.path);
      }
      return res.status(400).json({
        message: "Se encontraron los Siguientes Errores",
        data: errors,
      });
    }
  
    try {
      const newIFI = await createInformeFinalController({
        nro_ifi,
        fecha,
        documento_ifi,
        id_nc,
        id_AI1,
        tipo,
      });
  
      await updateDocumento({
        id_nc,
        total_documentos: newIFI.documento_ifi,
        nuevoModulo: "INFORME FINAL INSTRUCTIVO",
      });
  
      const response = await updateNC(id_nc, {
        id_nro_IFI: newIFI.id,
        estado: "TERMINADO",
      });
  
      if (response) {
        if (tipo == "RSG1") {
          await responseSocket({
            id: newIFI.id,
            method: getIFIforAR1Controller,
            socketSendName: "sendAR1",
            res,
          });
        }
        if (tipo == "ANALISTA_2") {
          await responseSocket({
            id: newIFI.id,
            method: getIFIforAnalista2Controller,
            socketSendName: "sendAnalista2",
            res,
          });
        }
  
        io.emit("sendAI1", { id: id_nc, remove: true });
      } else {
        res.status(400).json({
          message: "Error al crear IFI Handler en Area Instructiva",
        });
      }
    } catch (error) {
      console.error(
        "Error al crear IFI en Area Instructiva desde el servidor:",
        error
      );
      return res.status(500).json({
        message: "Error al crear IFI en Area Instructiva desde el servidor",
        error: error.message,
      });
    }
  };
  
  module.exports = { getAllNCforInstructivaHandler, createInformeFinalHandler };