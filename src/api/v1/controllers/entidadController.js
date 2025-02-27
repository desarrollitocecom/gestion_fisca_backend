const { Entidad, Infraccion } = require("../../../config/db_connection");

const createEntidad = async ({
    nombre_entidad,
    domicilio_entidad,
    distrito_entidad,
    giro_entidad
    }) => {

    try {
        const newEntidad = Entidad.create({
            nombre_entidad,
            domicilio_entidad,
            distrito_entidad,
            giro_entidad
        });

        return newEntidad || null;

    } catch (error) {
        console.error('Entidad creando trámite:', error);
        return false;
    }
 };

 const createInfraccion = async ({
    actividad_economica,
    codigo,
    descripcion,
    tipo,
    monto
    }) => {

    try {
        const newInfraccion = Infraccion.create({
            actividad_economica,
            codigo,
            descripcion,
            tipo,
            monto
        });

        return newInfraccion || null;

    } catch (error) {
        console.error('Infraccion creando trámite:', error);
        return false;
    }
 };

 module.exports = {
    createEntidad,
    createInfraccion
};
