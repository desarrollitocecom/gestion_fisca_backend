const { Administrado } = require('../db_connection');

const createAdministrado = async ({ 
        nombres,
        apellidos,
        domicilio,
        distrito,
        giro, 
    }) => {
        try {
            const newNC = await Administrado.create({
                nombres,
                apellidos,
                domicilio,
                distrito,
                giro,
            });

            console.log('Administrado creado con éxito');
            return newNC || null;

        } catch (error) {
            console.error('Error creando trámite:', error);
            return false;
        }
};


module.exports = { createAdministrado };
