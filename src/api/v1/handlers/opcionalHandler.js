const { getAllNCController } = require("../controllers/ncController");
const { updateDocumento } = require("../controllers/documentoController");

const getAllNCHandler = async (req, res) => {
    try {
        const response = await getAllNCController();

        if (response.length === 0) {
            return res.status(200).json({
                message: "Ya existe NC registrados",
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


module.exports = {
    getAllNCHandler
};
