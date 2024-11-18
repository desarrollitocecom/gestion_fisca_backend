const { ConstanciaNotificacion } = require('../db_connection');

const createConstNotifi = async ({ 
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
    }) => {
        try {
            const newNC = await ConstanciaNotificacion.create({
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

            console.log('ConstanciaNotificacion creado con éxito');
            return newNC || null;

        } catch (error) {
            console.error('Error creando ConstanciaNotificacion:', error);
            return false;
        }
};


module.exports = { createConstNotifi };
