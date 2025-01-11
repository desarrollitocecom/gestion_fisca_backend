const {getAllCargoNotificacionForIFIController, getAllHistoryCargoNotificacionForRSGController, getAllHistoryCargoNotificacionForIFIController, getAllCargoNotificacionForRSGController}=require('../controllers/cargoNotificacionController');
const { getIo } = require('../../../sockets'); 


const getAllCargoNotificacionForIFIHandler = async (req, res) => {  

    try {
        const response = await getAllCargoNotificacionForIFIController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay Cargo de Notificaciones para los Informes Finales',
                data: []
            });
        }

        return res.status(200).json({
            message: "Informes Finales obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener los Informes Finales:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los Informes Finales." });
    }
};

const getAllCargoNotificacionForRSGHandler = async (req, res) => {  

    try {
        const response = await getAllCargoNotificacionForRSGController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay Cargo de Notificaciones para los RSG Finales',
                data: []
            });
        }

        return res.status(200).json({
            message: "Informes Finales obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener los Informes Finales:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los Informes Finales." });
    }
};





const getAllHistoryCargoNotificacionForIFIHandler = async (req, res) => {  

    try {
        const response = await getAllHistoryCargoNotificacionForIFIController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay Cargo de Notificaciones para los Informes Finales',
                data: []
            });
        }

        return res.status(200).json({
            message: "Informes Finales obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener los Informes Finales:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los Informes Finales." });
    }
};

const getAllHistoryCargoNotificacionForRSGHandler = async (req, res) => {  

    try {
        const response = await getAllHistoryCargoNotificacionForRSGController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay Cargo de Notificaciones para los Informes Finales',
                data: []
            });
        }

        return res.status(200).json({
            message: "Informes Finales obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener los Informes Finales:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los Informes Finales." });
    }
};

const createCargoNotificacionForIFIHandler = async (req, res) => {
    
}


module.exports = { getAllCargoNotificacionForIFIHandler, getAllHistoryCargoNotificacionForRSGHandler, getAllHistoryCargoNotificacionForIFIHandler, createCargoNotificacionForIFIHandler, getAllCargoNotificacionForRSGHandler };
