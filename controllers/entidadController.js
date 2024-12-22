const { Entidad, Infraccion } = require("../db_connection");

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

        console.log('Entidad creado con éxito');
        return newEntidad || null;

    } catch (error) {
        console.error('Entidad creando trámite:', error);
        return false;
    }
 };

 const createInfraccion = async ({
    codigo,
    descripcion,
    monto
    }) => {

    try {
        const newInfraccion = Infraccion.create({
            codigo,
            descripcion,
            monto
        });

        console.log('Infraccion creado con éxito');
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
