const { createDescargoNC } = require('../controllers/ncDescargoController');
const { updateNC, getNC, getAllNCforAnalista, getNCforInstructiva } = require('../controllers/ncController');
const { updateDocumento } = require('../controllers/documentoController');
const fs = require('fs');
const { analista1DescargoValidation, analista1SinDescargoValidation } = require('../validations/analista1Validation');
const { responseSocket } = require('../../../utils/socketUtils')
const { getAllRSAforPlataformaController } = require('../controllers/rsaController')
const { getAllRSG2forPlataformaController } = require('../controllers/rsg2Controller')
const { getIo } = require("../../../sockets");

const getAllRSAforPlataformaHandler = async (req, res) => {
    try {
        const response = await getAllRSAforPlataformaController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay RSAs para Plataforma',
                data: []
            });
        }

        return res.status(200).json({
            message: "Lista para Plataforma obtenido correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error del servidor al traer la lista para el Analista 1:", error);
        res.status(500).json({ error: "Error del servidor al traer la lista para el Analista 1" });
    }
};

const getAllRSG2forPlataformaHandler = async (req, res) => {
    try {
        const response = await getAllRSG2forPlataformaController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay RSGs para Plataforma',
                data: []
            });
        }

        return res.status(200).json({
            message: "Lista para Plataforma obtenido correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error del servidor al traer la lista para el Analista 1:", error);
        res.status(500).json({ error: "Error del servidor al traer la lista para el Analista 1" });
    }
};


const getAllDataForPlataformaHandler = async (req, res) => {
    try {
      // Ejecutar ambos controladores en paralelo
      const [rsaResponse, rsgResponse] = await Promise.all([
        getAllRSAforPlataformaController(),
        getAllRSG2forPlataformaController()
      ]);
  
      // Combinar las respuestas en un solo arreglo
      const combinedResponse = [
        ...rsaResponse,
        ...rsgResponse
      ];
  
      if (combinedResponse.length === 0) {
        return res.status(200).json({
          message: 'No hay datos para Plataforma',
          data: []
        });
      }
  
      return res.status(200).json({
        message: 'Datos para Plataforma obtenidos correctamente',
        data: combinedResponse,
      });
    } catch (error) {
      console.error('Error del servidor al traer los datos para Plataforma:', error);
      return res.status(500).json({
        error: 'Error del servidor al traer los datos para Plataforma',
      });
    }
  };
  

module.exports = { getAllRSAforPlataformaHandler, getAllRSG2forPlataformaHandler, getAllDataForPlataformaHandler };
