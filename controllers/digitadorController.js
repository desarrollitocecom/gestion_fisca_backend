const { NC } = require("../db_connection");

const updateNC = async (id_tramiteInspector, { 
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

    id_documento,
    documento_MC,
    id_ejecucionMC,
    nro_acta_ejecucion,
    dc_levantamiento,
    id_estado,

    id_descargo_NC,
    id_nro_IFI,
    id_estado_NC,
    id_const_noti,

    id_digitador 

 }) => {
    
    try {
        console.log(id_tramiteInspector);

        const newAdministrado = await Administrado.create({
            nombres,
            apellidos,
            domicilio,
            distrito,
            giro,
        });

        const newEntidad = await Entidad.create({
            nombre_entidad,
            domicilio_entidad,
            distrito_entidad,
            giro_entidad,
        });
        
        const response = await getTipoDocumentoIdentidad(id_tramiteInspector);
        console.log(response);
        // if (response) await response.update({ documento });
        return  null;
    } catch (error) {
        console.error("Error al modificar el Tipo de Documento de Identidad en el controlador:", error);
        return false;
    }
};


module.exports = {
    updateNC
};
