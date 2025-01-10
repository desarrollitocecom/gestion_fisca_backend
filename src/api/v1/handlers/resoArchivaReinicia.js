const { getAllNCCaduco } = require('../controllers/ncController');
const { getAllIFICaduco } = require('../controllers/informeFinalController')
const { updateNC, getNC, getAllNCforAnalista, getNCforInstructiva } = require('../controllers/ncController');
const { updateDocumento } = require('../controllers/documentoController');
const fs = require('fs');
const { responseSocket } = require('../../../utils/socketUtils')
const { getIo } = require("../../../sockets");

const getAllNCIFI = async (req, res) => {
    try {
      // Ejecutar ambos controladores en paralelo
      const [ncResponse, ifiResponse] = await Promise.all([
        getAllNCCaduco(),
        getAllIFICaduco(),
      ]);
  
      // Combinar las respuestas en un solo arreglo
      const combinedResponse = [
        ...ncResponse,
        ...ifiResponse
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

module.exports = { getAllNCIFI };
