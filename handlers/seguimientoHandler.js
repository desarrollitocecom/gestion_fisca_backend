const { createDescargoNC } = require('../controllers/ncDescargoController');
const { updateNC, getNC, getAllNCforAnalista, getNCforInstructiva } = require('../controllers/ncController');
const {getAllNCSeguimientoController}=require('../controllers/seguimientoController');
const { getIo } = require('../sockets'); 


const getAllNCSeguimientoHandler = async (req, res) => {  

    try {
        const response = await getAllNCSeguimientoController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más tramites',
                data: []
            });
        }

        return res.status(200).json({
            message: "Tramites obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener tipos de documentos de identidad:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los tramites." });
    }
};


module.exports = { getAllNCSeguimientoHandler };
