const { updateNC, getNCforAnalista, getAllNC, getNC } = require('../controllers/ncController');
const { createEntidad } = require('../controllers/entidadController');
const { createConstNotifi } = require('../controllers/constanciaNotificacionController')
const { validateNC } = require('../validations/digitadorValidation');
const { getIo } = require('../sockets'); 

const updateNCHandler = async (req, res) => {
    const io = getIo();
    const id = req.params.id;

    const existingNC = await getNC(id);

    if (!existingNC) {
        return res.status(404).json({ message: 'NC no encontrada para actualizar' });
    }

    if (existingNC.id_digitador) {
        return res.status(404).json({ message: 'Este NC ya fue registrado' });
    }

    const errors = validateNC(req.body);

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errors,
        });
    }

    const {
        id_tipoDocumento,
        nro_documento,
        ordenanza_municipal,
        nro_licencia_funcionamiento,
        nombre_entidad,
        domicilio_entidad,
        distrito_entidad,
        giro_entidad,
        id_infraccion,
        lugar_infraccion,
        placa_rodaje,
        fecha_constancia_notificacion,
        nombres_infractor,
        dni_infractor,
        relacion_infractor,
        observaciones,
        id_digitador,
    } = req.body;

    try {
        let id_entidad = null;

        const shouldCreateEntidad = nombre_entidad || domicilio_entidad || distrito_entidad || giro_entidad;

        if (shouldCreateEntidad) {
            const newEntidad = await createEntidad({
                nombre_entidad,
                domicilio_entidad,
                distrito_entidad,
                giro_entidad,
            });

            if (newEntidad) {
                id_entidad = newEntidad.id;
            } else {
                return res.status(400).json({ error: 'Error al crear la Entidad' });
            }
        }

        const response = await updateNC(id, {
            id_tipoDocumento,
            nro_documento,
            ordenanza_municipal,
            nro_licencia_funcionamiento,
            id_entidad,
            id_infraccion,
            lugar_infraccion,
            placa_rodaje,
            fecha_constancia_notificacion,
            nombres_infractor,
            dni_infractor,
            relacion_infractor,
            observaciones,
            estado: 'ANALISTA_1',
            id_digitador,
        });

        if (response) {
            const findNC = await getNCforAnalista(response.id);
            const plainNC = findNC.toJSON();

            io.emit('sendAnalista1', { data: [plainNC] });

            res.status(201).json({ data: [findNC] });
        } else {
            return res.status(404).json({ message: 'Error al actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar NC:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar la NC.' });
    }
};


const allNCHandler = async (req, res) => {
    
    try {
        const response = await getAllNC();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más tramites NC',
                data: []
            });
        }

        return res.status(200).json({
            message: "Tramites NC obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener los trámites NC:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los tramites NC." });
    }
};

const getCodigos = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        
    }
}



module.exports = { updateNCHandler, allNCHandler, getCodigos };
