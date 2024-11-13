const { Administrado, Entidad, Infraccion, MedidaComplementaria, NC } = require("../db_connection");

const updateNC = async (id, { 
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

 }) => {
    
    try {

        let newAdministrado = null;
        let newEntidad = null;
        let newInfraccion = null;

        if (nombres || apellidos || domicilio || distrito || giro) {
            newAdministrado = await Administrado.create({
                nombres,
                apellidos,
                domicilio,
                distrito,
                giro,
            });
        }

        if (nombre_entidad || domicilio_entidad || distrito_entidad || giro_entidad) {
            newEntidad = await Entidad.create({
                nombre_entidad,
                domicilio_entidad,
                distrito_entidad,
                giro_entidad,
            });
        }

        if (actividad_economica || codigo || descripcion || tipo || monto || lugar_infraccion) {
            newInfraccion = await Infraccion.create({
                actividad_economica,    
                codigo,
                descripcion,
                tipo,
                monto,
                lugar_infraccion,
            });
        }

        // const newMC = await MedidaComplementaria.create({
        //     id_documento,
        //     documento_MC,
        //     id_ejecucionMC,
        //     nro_acta_ejecucion,
        //     dc_levantamiento,
        //     id_estado,
        // });
        
        
        const findNC = await NC.findOne({ where: { id } });

        if (findNC) {
            await findNC.update({ 
                id_tipoDocumento,
                nro_documento,
                id_administrado: newAdministrado ? newAdministrado.id : null,
                id_entidad: newEntidad ? newEntidad.id : null,
                nro_licencia_funcionamiento,
                id_infraccion: newInfraccion ? newInfraccion.id : null,
                placa_rodaje,
                fecha_detencion,
                fecha_notificacion,
                observaciones,
                id_medida_complementaria,
                id_digitador
             });
        }

        return findNC ||  null;

    } catch (error) {
        console.error("Error al modificar el Tipo de Documento de Identidad en el controlador:", error);
        return false;
    }
};


module.exports = {
    updateNC
};
