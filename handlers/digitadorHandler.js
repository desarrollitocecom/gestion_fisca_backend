const { updateNC } = require('../controllers/digitadorController');

const createNCHandler = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const { 
            id_tipoDocumento, 
            nro_documento, 

            nombres,
            apellidos,
            domicilio,
            distrito,
            giro,

            nombre_entidad,
            domicilio_entidad,
            distrito_entidad,
            giro_entidad,

            nro_licencia_funcionamiento,

            actividad_economica,
            codigo,
            descripcion,
            tipo,
            monto,
            lugar_infraccion,

            placa_rodaje,
            fecha_detencion,
            fecha_notificacion,
            observaciones,

            // id_documento,
            // documento_MC,
            // id_ejecucionMC,
            // nro_acta_ejecucion,
            // dc_levantamiento,
            // id_estado,

            id_medida_complementaria,

            id_digitador    
        } = req.body;

        const errores = [];

    try {
        const response = await updateNC(id, { 
            id_tipoDocumento, 
            nro_documento, 

            nombres,
            apellidos,
            domicilio,
            distrito,
            giro,

            nombre_entidad,
            domicilio_entidad,
            distrito_entidad,
            giro_entidad,

            nro_licencia_funcionamiento,

            actividad_economica,
            codigo,
            descripcion,
            tipo,
            monto,
            lugar_infraccion,

            placa_rodaje,
            fecha_detencion,
            fecha_notificacion,
            observaciones,

            // id_documento,
            // documento_MC,
            // id_ejecucionMC,
            // nro_acta_ejecucion,
            // dc_levantamiento,
            // id_estado,

            id_medida_complementaria,

            id_digitador  
        });

        if (!response) {
            return res.status(404).json({ message: "Ejecución MC no encontrada para actualizar" });
        }

        res.status(200).json({
            message: "Ejecución MC actualizada correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar ejecución MC:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar la ejecución MC." });
    }
};

module.exports = { createNCHandler };
