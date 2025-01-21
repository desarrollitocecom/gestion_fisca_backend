const { getActasFiscalizacion } = require('../controllers/actasFiscalizacionController')

const getActasFiscalizacionHandler = async (req, res) => {
    try {
        const response = await getActasFiscalizacion();

        if (response.length === 0) {
            return res.status(200).json({
                message: "Ya no hay Actas de Fiscalizacion Registradas",
                data: []
            });
        }

        return res.status(200).json({
            message: "Actas de Fiscalizacion Registradas Correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener las Actas de Fiscalizacion en el Servidor:", error);
        res.status(500).json({ error: "Error al obtener las Actas de Fiscalizacion en el Servidor" });
    }
};

module.exports = {
    getActasFiscalizacionHandler,
};
