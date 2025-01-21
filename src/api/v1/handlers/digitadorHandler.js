const { updateNC, getNCforAnalista, getAllNCforDigitadorController, getNC } = require('../controllers/ncController');
const { createEntidad, createInfraccion } = require('../controllers/entidadController');
const { getAllMCController, updateMCController } = require('../controllers/medidaComplementariaController');
const { validateNC } = require('../validations/digitadorValidation');
const { responseSocket } = require('../../../utils/socketUtils')
const {updateDocumento}=require('../controllers/documentoController');
const { getIo } = require("../../../sockets");
const axios = require('axios');

const updateNCHandler = async (req, res) => {
    const io = getIo();
    const id = req.params.id;

    const existingNC = await getNC(id);

    if (!existingNC) {
        return res.status(404).json({ message: 'Este NC no existe' });
    }

    // if (existingNC.id_digitador) {
    //     return res.status(404).json({ message: 'Este NC ya fue digitado' });
    // }

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
        tipo_infraccion,
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
        const tokenResponse = await axios.post('http://172.16.1.60/api/login', {
            email: 'fiscalizacion@municipalidad.sjl.com',
            password: 'fisca**2024$$',
        });
        const token = tokenResponse.data.token;

        // Obtener los datos del infracción desde el endpoint
        const asd = await axios.get(`http://172.16.1.60/api/fiscalizacion/cuis/${id_infraccion}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { value, label, descripcion, medida, tasa } = asd.data;
        // const monto = tasa * 51.50;

        const newInfraccion = await createInfraccion({
            // codigo: label,
            descripcion,
            // monto,
        });





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
            id_infraccion: newInfraccion.id,
            tipo_infraccion,
            lugar_infraccion,
            placa_rodaje,
            fecha_constancia_notificacion,
            nombres_infractor,
            dni_infractor,
            relacion_infractor,
            observaciones,
            estado_digitado: 'DIGITADO',
        });
        // console.log(response);
        if (response) {
            // await responseSocket({id, method: getNCforAnalista, socketSendName: 'sendAnalista1', res});
            // io.emit("sendDigitador", { id, remove: true });
            return res.status(200).json({
                message: 'Se guardó correctamente',
                data: []
            });

        } else {
            return res.status(404).json({ message: 'Error al actualizar el NC' });
        }
    } catch (error) {
        console.error('Error al actualizar NC:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar la NC.' });
    }
};


const allNCforDigitadorHandler = async (req, res) => {
    
    try {
        const response = await getAllNCforDigitadorController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay más tramites NC',
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
        // Obtener el token
        const tokenResponse = await axios.post('http://172.16.1.60/api/login', {
            email: 'fiscalizacion@municipalidad.sjl.com',
            password: 'fisca**2024$$',
        });
        //console.log('token response es: ', tokenResponse)
        const token = tokenResponse.data.token; // Asegúrate de que el token venga en esta propiedad

        // Realizar la solicitud al endpoint correspondiente
        const response = await axios.get('http://172.16.1.60/api/fiscalizacion/cuis', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Retornar los datos obtenidos como respuesta
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error al obtener los códigos:', error.message);
        res.status(500).json({ error: 'Error obteniendo los códigos desde el servicio.' });
    }
};

// Controlador para obtener el detalle por ID
const sendDetalle = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener el token
        const tokenResponse = await axios.post('http://172.16.1.60/api/login', {
            email: 'fiscalizacion@municipalidad.sjl.com',
            password: 'fisca**2024$$',
        });
        const token = tokenResponse.data.token; // Asegúrate de que el token venga en esta propiedad

        // Realizar la solicitud al endpoint correspondiente con el ID
        const response = await axios.get(`http://172.16.1.60/api/fiscalizacion/cuis/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Agregar el campo "monto" calculado al resultado
        const dataWithMonto = response.data.map(item => ({
            ...item,
            monto: item.tasa * 53.50, // Multiplica la tasa por 51.50
        }));

        // Retornar los datos obtenidos como respuesta
        res.status(200).json(dataWithMonto);
    } catch (error) {
        console.error('Error al obtener el detalle:', error.message);
        res.status(500).json({ error: 'Error obteniendo el detalle desde el servicio.' });
    }
};


const getAllMCHandler = async (req, res) => {
    
    try {
        const response = await getAllMCController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay más Medidas Complementarias',
                data: []
            });
        }

        return res.status(200).json({
            message: "Medidas Complementarias obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener las Medidas Complementarias:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener las Medidas Complementarias." });
    }
};

const updateMCHandler = async (req, res) => {
    const id = req.params.id;
    const { id_nc, numero_ejecucion, tipo_ejecucionMC, id_usuarioMC } = req.body;

        const errors = [];

        if(!req.files['documento_ejecucion']){
            errors.push('El documento_ejecucion es obligatorio');
        }else{
           
            if(req.files['documento_ejecucion'][0].mimetype != 'application/pdf'){
                errors.push('El documento_ejecucion debe ser formato PDF');
            }
        }
    
        if (errors.length > 0) {
            if (req.files['documento_ejecucion']) {
                fs.unlinkSync(req.files['documento_ejecucion'][0].path); 
            }
            return res.status(400).json({ error: errors.join(", ") });
        }



    
    try {
        const response = await updateMCController(id, { numero_ejecucion, tipo_ejecucionMC, documento_ejecucion: req.files['documento_ejecucion'][0], id_usuarioMC });
        if (!response) {
            return res.status(404).json({ message: "Medida complementaria no encontrada para actualizar" });
        }
        
        await updateDocumento({id_nc, total_documentos: response.documento_ejecucion, nuevoModulo: 'EJECUCION MEDIDA COMPLEMENTARIA'});

        res.status(200).json({
            message: "Medida complementaria actualizada correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar medida complementaria:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar la medida complementaria." });
    }
};



module.exports = { updateNCHandler, allNCforDigitadorHandler, getCodigos, sendDetalle, getAllMCHandler, updateMCHandler };
