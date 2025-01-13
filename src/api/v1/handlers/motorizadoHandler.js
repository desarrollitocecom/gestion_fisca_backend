const { getAllCargoNotificacionForIFIController, getAllHistoryCargoNotificacionForRSGController, getAllHistoryCargoNotificacionForIFIController,
    getAllCargoNotificacionForRSGController, getAllCargoNotificacionForRSAController, getAllHistoryCargoNotificacionForRSAController,
    getAllHistoryCargoNotificacionForRSG2Controller, getAllCargoNotificacionForRSG2Controller, getCargoNotificacionController, updateCargoNotificacionController,
    } = require('../controllers/cargoNotificacionController');
const { getInformeFinalController, updateInformeFinalController } = require('../controllers/informeFinalController')
const { updateResolucionSubgerencialController } = require('../controllers/resolucionSubgerencial')
const { getIo } = require('../../../sockets');
const { updateDocumento } = require('../controllers/documentoController')

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

const getAllCargoNotificacionForRSAHandler = async (req, res) => {

    try {
        const response = await getAllCargoNotificacionForRSAController();

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

const getAllCargoNotificacionForRSG2Handler = async (req, res) => {

    try {
        const response = await getAllCargoNotificacionForRSG2Controller();

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

const getAllHistoryCargoNotificacionForRSAHandler = async (req, res) => {

    try {
        const response = await getAllHistoryCargoNotificacionForRSAController();

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

const getAllHistoryCargoNotificacionForRSG2Handler = async (req, res) => {

    try {
        const response = await getAllHistoryCargoNotificacionForRSG2Controller();

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


const updateCargoNotificacion1ForIFIHandler = async (req, res) => {
    const { id_ifi, id_nc, numero_cargoNotificacion, fecha1, estado_visita, estado_entrega, id_motorizado } = req.body;
    console.log(id_ifi, id_nc, numero_cargoNotificacion, fecha1, estado_visita, estado_entrega, id_motorizado);
    
    const { id } = req.params
    console.log('este id: ', id)
    try {
        const updateCargoNotificacion = await updateCargoNotificacionController(id, {
            numero_cargoNotificacion,
            fecha1,
            estado_visita,
            estado_entrega,
            documento1: req.files['documento1'][0],
            id_motorizado
        });

        if (estado_entrega == 'PERSONA' || estado_entrega == 'PUERTA') {
            await updateInformeFinalController(id_ifi, { fecha_notificacion: fecha1 });
        }

        await updateDocumento({ id_nc, total_documentos: updateCargoNotificacion.documento1, nuevoModulo: 'IFI - CARGO NOTIFICACION 1' });

        if (updateCargoNotificacion) {
            return res.status(200).json({
                message: "Actualizado correctamente",
                data: updateCargoNotificacion
            });
        } else {
            return res.status(500).json({
                message: "Hubo un error al actualizar",
                data: false,
            });
        }

    } catch (error) {
        console.error("Error interno al crear RG:", error);
        return res.status(500).json({ message: "Error interno al crear RG", data: error });
    }
}

const updateCargoNotificacion2ForIFIHandler = async (req, res) => {
    const { id_ifi, id_nc, fecha2, estado_visita, estado_entrega, numero_cargoNotificacion2 } = req.body;
    const { id } = req.params

    try {

        const updateCargoNotificacion = await updateCargoNotificacionController(id, {
            fecha2,
            estado_visita,
            estado_entrega,
            documento2: req.files['documento2'][0],
            numero_cargoNotificacion2
        });

        if (estado_entrega == 'PERSONA' || estado_entrega == 'PUERTA') {
            await updateInformeFinalController(id_ifi, { fecha_notificacion: fecha2 });
        }

        await updateDocumento({ id_nc, total_documentos: updateCargoNotificacion.documento2, nuevoModulo: 'IFI - CARGO NOTIFICACION 2' });

        if (updateCargoNotificacion) {
            return res.status(200).json({
                message: "Actualizado correctamente",
                data: updateCargoNotificacion
            });
        } else {
            return res.status(500).json({
                message: "Hubo un error al actualizar",
                data: false,
            });
        }

    } catch (error) {
        console.error("Error interno al crear RG:", error);
        return res.status(500).json({ message: "Error interno al crear RG", data: error });
    }
}



const updateCargoNotificacion1ForResoSubgHandler = async (req, res) => {
    const { id_rsg, numero_cargoNotificacion, fecha1, estado_visita, estado_entrega } = req.body;
    const { id } = req.params

    try {
        const updateCargoNotificacion = await updateCargoNotificacionController(id, {
            numero_cargoNotificacion,
            fecha1,
            estado_visita,
            estado_entrega,
            documento1: req.files['documento1'][0]
        });

        if (estado_entrega == 'PERSONA' || estado_entrega == 'PUERTA') {
            await updateResolucionSubgerencialController(id_rsg, { fecha_notificacion_rsg: fecha1 });
        }

        if (updateCargoNotificacion) {
            return res.status(200).json({
                message: "Actualizado correctamente",
                data: updateCargoNotificacion
            });
        } else {
            return res.status(500).json({
                message: "Hubo un error al actualizar",
                data: false,
            });
        }

    } catch (error) {
        console.error("Error interno al crear RG:", error);
        return res.status(500).json({ message: "Error interno al crear RG", data: error });
    }
}

const updateCargoNotificacion2ForResoSubgHandler = async (req, res) => {
    const { id_rsg, fecha2, estado_visita, estado_entrega } = req.body;
    const { id } = req.params

    try {

        const updateCargoNotificacion = await updateCargoNotificacionController(id, {
            fecha2,
            estado_visita,
            estado_entrega,
            documento2: req.files['documento2'][0]
        });

        if (estado_entrega == 'PERSONA' || estado_entrega == 'PUERTA') {
            await updateResolucionSubgerencialController(id_rsg, { fecha_notificacion: fecha2 });
        }


        if (updateCargoNotificacion) {
            return res.status(200).json({
                message: "Actualizado correctamente",
                data: updateCargoNotificacion
            });
        } else {
            return res.status(500).json({
                message: "Hubo un error al actualizar",
                data: false,
            });
        }

    } catch (error) {
        console.error("Error interno al crear RG:", error);
        return res.status(500).json({ message: "Error interno al crear RG", data: error });
    }
}


module.exports = {
    getAllCargoNotificacionForIFIHandler, getAllHistoryCargoNotificacionForRSGHandler,
    getAllHistoryCargoNotificacionForIFIHandler, updateCargoNotificacion1ForIFIHandler, getAllCargoNotificacionForRSGHandler,
    getAllCargoNotificacionForRSAHandler, getAllHistoryCargoNotificacionForRSAHandler, getAllCargoNotificacionForRSG2Handler, getAllHistoryCargoNotificacionForRSG2Handler,
    updateCargoNotificacion2ForIFIHandler, updateCargoNotificacion1ForResoSubgHandler, updateCargoNotificacion2ForResoSubgHandler
};
