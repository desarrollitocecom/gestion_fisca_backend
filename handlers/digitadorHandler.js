const { updateNC, getNC, getAllNC } = require('../controllers/ncController');
const { createAdministrado } = require('../controllers/administradoController');
const { createEntidad } = require('../controllers/entidadController');
const { createConstNotifi } = require('../controllers/constanciaNotificacionController')

const updateNCHandler = async (req, res) => {
    const id = req.params.id;
    
    const existingNC = await getNC(id); 
    
        if (!existingNC) {
            return res.status(404).json({ message: "NC no encontrada para actualizar" });
        }

        if (existingNC.id_digitador) {
            return res.status(404).json({ message: "Este NC ya fue registrado" });
        }

    const { 
            id_tipoDocumento, 
            nro_documento, 
            nro_licencia_funcionamiento,

            nombre_entidad,
            domicilio_entidad,
            distrito_entidad,
            giro_entidad,

            id_infraccion,
            lugar_infraccion,
            placa_rodaje,

            fecha_deteccion_inicio,
            hora_deteccion_inicio,
            fecha_deteccion_fin,
            hora_deteccion_fin,
            
            nombres_infractor,
            dni_infractor,
            relacion_infractor,

            nro_nc,
            hora,
            dia,
            mes,
            anio,
            lugar,
            caracteristicas,

            nombre_test1,
            dni_test1,
            nombre_test2,
            dni_test2,

            puerta,
            nro_pisos,
            nro_suministro,
            observaciones,

            id_digitador,

        } = req.body;

        const errors = [];

        if(!id_tipoDocumento){
            errors.push('El Tipo de Documento debe ser obligatorio');
        }

        if (id_tipoDocumento !== undefined && id_tipoDocumento !== null && (isNaN(id_tipoDocumento))) {
            errors.push('El Tipo de Documento debe ser válido');
        }

        if(!nro_documento){
            errors.push('El número de Documento debe ser obligatorio');
        }

        if (nro_documento !== undefined && nro_documento !== null && (!/^(10|20)\d{9}$/.test(nro_documento))) {
            errors.push('El número de Documento debe ser un número válido de 11 dígitos y comenzar con 10 o 20');
        }

        if(!nro_licencia_funcionamiento){
            errors.push('El número de Documento debe ser obligatorio');
        }
             
        if (nro_licencia_funcionamiento !== undefined && nro_licencia_funcionamiento !== null && (!/^\d{5}-\d{2}$/.test(nro_licencia_funcionamiento))) {
            errors.push('El campo licencia debe tener el formato *****-**, 5 dígitos, guion, 2 dígitos');
        }

        if(!nombre_entidad){
            errors.push('La entidad debe ser obligatorio');
        }

        if(!domicilio_entidad){
            errors.push('El domicilio debe ser obligatorio');
        }

        if(!distrito_entidad){
            errors.push('El distrito debe ser obligatorio');
        }

        if(!giro_entidad){
            errors.push('El giro debe ser obligatorio');
        }

        if(!id_infraccion){
            errors.push('La infracción debe ser obligatoria');
        }

        if(!lugar_infraccion){
            errors.push('El lugar de infracción debe ser obligatorio');
        }

        if(placa_rodaje){
            if (placa_rodaje !== undefined && placa_rodaje !== null && (!/^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}$|^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{2}$/.test(placa_rodaje))) {
                errors.push('El campo placa debe tener el formato 123-456 o 1234-56, permitiendo letras y números');
            }           
        }

        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

        if(!fecha_deteccion_inicio){
            errors.push('La fecha de inicio debe ser obligatorio');
        }

        if(fecha_deteccion_inicio){
            if (!fechaRegex.test(fecha_deteccion_inicio)) {
                errors.push('El formato de la fecha de inicio debe ser YYYY-MM-DD');
            } else {
        
                const parsedFecha = new Date(fecha_deteccion_inicio);
        
                if (isNaN(parsedFecha.getTime())) {
        
                    errors.push('Debe ser una fecha de inicio válida');
        
                }
            }
        }

        if(!hora_deteccion_inicio){
            errors.push('La hora de inicio debe ser obligatorio');
        }

        if (hora_deteccion_inicio !== undefined && hora_deteccion_inicio !== null && (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora_deteccion_inicio))) {
            errors.push('La hora de inicio debe estar en el formato HH:MM y ser una hora válida en formato 24 horas');
        }

        if(!fecha_deteccion_fin){
            errors.push('La fecha de fin debe ser obligatorio');
        }

        if(fecha_deteccion_fin){
            if (!fechaRegex.test(fecha_deteccion_fin)) {
                errors.push('El formato de la fecha fin debe ser YYYY-MM-DD');
            } else {
        
                const parsedFecha = new Date(fecha_deteccion_fin);
        
                if (isNaN(parsedFecha.getTime())) {
        
                    errors.push('Debe ser una fecha válida');
        
                }
            }
        }

        if(!hora_deteccion_fin){
            errors.push('La hora de fin debe ser obligatorio');
        }

        if (hora_deteccion_fin !== undefined && hora_deteccion_fin !== null && (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora_deteccion_fin))) {
            errors.push('La hora de fin debe estar en el formato HH:MM y ser una hora válida en formato 24 horas');
        }

        if(!nombres_infractor){
            errors.push('El nombre del infractor es obligatorio');
        }

        if(!dni_infractor){
            errors.push('El dni del infractor es obligatorio');
        }

        if(!relacion_infractor){
            errors.push('La relacion del infractor es obligatorio');
        }

        if(!nro_nc){
            errors.push('El nro de NC de la CN es obligatorio');
        }

        if(!hora){
            errors.push('La hora de la CN es obligatorio');
        }

        if(!dia){
            errors.push('El dia de la CN es obligatorio');
        }

        if(!mes){
            errors.push('El mes de la CN es obligatorio');
        }

        if(!anio){
            errors.push('El año de la CN es obligatorio');
        }

        if(!lugar){
            errors.push('El lugar de la CN es obligatorio');
        }

        if(!caracteristicas){
            errors.push('Las caracteristicas de la CN son obligatorio');
        }

        if(!nombre_test1){
            errors.push('El nombre del testigo 1 es obligatorio');
        }

        if(!dni_test1){
            errors.push('El DNI del testigo 1 es obligatorio');
        }

        if (dni_test1 !== undefined && dni_test1 !== null && (!/^\d{8}$/.test(dni_test1))) {
            errors.push('El DNI del testigo 1 debe tener 8 digitos');
        }

        if(!nombre_test2){
            errors.push('El nombre del testigo 2 es obligatorio');
        }

        if(!dni_test2){
            errors.push('El DNI del testigo 1 es obligatorio');
        }

        if (dni_test2 !== undefined && dni_test2 !== null && (!/^\d{8}$/.test(dni_test2))) {
            errors.push('El DNI del testigo 1 debe tener 8 digitos');
        }


        if(!puerta){
            errors.push('La puerta de la CN es obligatorio');
        }

        if(!nro_pisos){
            errors.push('Los nro de pisos de la CN es obligatorio');
        }

        if(!observaciones){
            errors.push('Las observaciones de la CN son obligatorias');
        }

        if(!id_digitador){
            errors.push('El id del digitador es obligatorio');
        }

        
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Se encontraron los siguientes errores',
                data: errors
            });
        }
        

    try {

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

        const shouldCreateConstNofi = hora || dia || mes || anio || lugar || caracteristicas || nombre_test1 || dni_test1 || nombre_test2 || dni_test2 || puerta || nro_pisos || nro_suministro || observaciones;

        if(shouldCreateConstNofi) {
            const shouldCreateConstNofi = await createConstNotifi({
                hora,   //time
                dia,    //integer
                mes,    //text
                anio,   //integer
                lugar,  //string
                caracteristicas,  //string

                nro_nc,  //string
                nombre_test1,  //string  
                dni_test1,  //integer
                nombre_test2,  //string
                dni_test2,  //integer
                puerta,  //string
                nro_pisos,  //string
                nro_suministro,  //string
                observaciones,  //string
            });

            if (shouldCreateConstNofi) {
                id_const_noti = shouldCreateConstNofi.id;
            } else {
                return res.status(400).json({ error: 'Error al crear la ConstanciaNotificacion' });
            }
        }

        const response = await updateNC(id, { 
            id_tipoDocumento, //integer
            nro_documento,  //integer
            nro_licencia_funcionamiento, //integer

            id_entidad,  //fk
            id_infraccion,  //fk integer
            lugar_infraccion, //string
            placa_rodaje, //integer
            
            fecha_deteccion_inicio,  //dateonly
            hora_deteccion_inicio,  //time
            fecha_deteccion_fin,  //dateonly
            hora_deteccion_fin,  //time

            nombres_infractor,  //string
            dni_infractor,  //integer
            relacion_infractor,  //string

            id_const_noti,
            id_digitador,
            id_estado_NC: 2
        });

        if (!response) {
            return res.status(404).json({ message: "Error al actualizar" });
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
