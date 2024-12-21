const { getAllDataController } = require("../controllers/reporteController")

const getAllDataHandler = async (req, res) => {
    try {
        const response = await getAllDataController();

        if (response.length === 0) {
            return res.status(200).json({
                message: "No hay datos para mostrar en el Excel",
                data: []
            });
        }

        return res.status(200).json({
            message: "Datos del excel obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error interno al obtener datos para el Excel:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los datos para el Excel." });
    }
};


module.exports = {
    getAllDataHandler
};
