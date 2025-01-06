const { Administrado } = require('../../../config/db_connection');

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

            return newNC || null;

        } catch (error) {
            console.error('Error creando trámite:', error);
            return false;
        }
};


module.exports = { createAdministrado };
