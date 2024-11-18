const { updateNC, getNC, getAllNC } = require('../controllers/ncController');
const { createAdministrado } = require('../controllers/administradoController');
const { createEntidad } = require('../controllers/entidadController');
const { createConstNotifi } = require('../controllers/constanciaNotificacionController')

const updateNCHandler = async (req, res) => {
    const id = req.params.id;

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

            id_infraccion,
            nro_licencia_funcionamiento,
            placa_rodaje,
            fecha_detencion,
            fecha_notificacion,
            observaciones,
            id_digitador,

            fecha,
            hora,
            lugar,
            caracteristicas,
            nro_nc,
            nombre_test1,
            doc_test1,
            nombre_test2,
            doc_test2,
            puerta,
            nro_pisos,
            nro_suministro,
            observaciones_cn

        } = req.body;

        const errores = [];

    try {

        const existingNC = await getNC(id); 

        if (!existingNC) {
            return res.status(404).json({ message: "NC no encontrada para actualizar" });
        }

        let id_administrado = null;

        const shouldCreateAdministrado = nombres || apellidos || domicilio || distrito || giro;

        if(shouldCreateAdministrado) {
            const shouldCreateAdministrado = await createAdministrado({
                nombres,
                apellidos,
                domicilio,
                distrito,
                giro,
            });

            if (shouldCreateAdministrado) {
                id_administrado = shouldCreateAdministrado.id;
            } else {
                return res.status(400).json({ error: 'Error al crear el Administrado' });
            }
        }

        let id_entidad = null;

        const shouldCreateEntidad = nombre_entidad || domicilio_entidad || distrito_entidad || giro_entidad;

        if(shouldCreateEntidad) {
            const shouldCreateEntidad = await createEntidad({
                nombre_entidad,
                domicilio_entidad,
                distrito_entidad,
                giro_entidad,
            });

            if (shouldCreateEntidad) {
                id_entidad = shouldCreateEntidad.id;
            } else {
                return res.status(400).json({ error: 'Error al crear la Entidad' });
            }
        }

        let id_const_noti = null;

        const shouldCreateConstNofi = fecha || hora || lugar || caracteristicas || nro_nc || nombre_test1 || doc_test1 || nombre_test2 || doc_test2 || puerta || nro_pisos || nro_suministro || observaciones_cn;

        if(shouldCreateConstNofi) {
            const shouldCreateConstNofi = await createConstNotifi({
                fecha,
                hora,
                lugar,
                caracteristicas,
                nro_nc,
                nombre_test1,
                doc_test1,
                nombre_test2,
                doc_test2,
                puerta,
                nro_pisos,
                nro_suministro,
                observaciones_cn
            });

            if (shouldCreateConstNofi) {
                id_const_noti = shouldCreateConstNofi.id;
            } else {
                return res.status(400).json({ error: 'Error al crear la ConstanciaNotificacion' });
            }
        }

        // console.log(id);
        const response = await updateNC(id, { 
            id_tipoDocumento: id_tipoDocumento, 
            nro_documento, 

            id_administrado,
            id_entidad,
            id_infraccion: id_infraccion,

            nro_licencia_funcionamiento,
            placa_rodaje,
            fecha_detencion,
            fecha_notificacion,
            observaciones,

            id_const_noti,
            id_digitador
        });

        if (!response) {
            return res.status(404).json({ message: "NC no encontrada para actualizar" });
        }

        res.status(200).json({
            message: "NC actualizada correctamente",
            data: response
        });

    } catch (error) {
        console.error("Error al actualizar NC:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar la NC." });
    }
};



const allNCHandler = async (req, res) => {
    
    const { page = 1, limit = 20 } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un número");
    if (page <= 0) errores.push("El page debe ser mayor a 0");
    if (isNaN(limit)) errores.push("El limit debe ser un número");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0");

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const response = await getAllNC( Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más tramites',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
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

module.exports = { updateNCHandler, allNCHandler };
