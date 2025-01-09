const { RecursoReconsideracion } = require('../../../config/db_connection');
const { saveImage } = require('../../../utils/fileUtils');

const createRecursoReconsideracionController = async ({ 
        nro_recurso, fecha_recurso, id_nc, id_plataforma2, //documento_recurso
    }) => {

    try {
        // let documento_descargoNCPath = null;

        // if(documento_recurso){
        //     documento_descargoNCPath = saveImage(documento_recurso, 'RecursoApelacion');
        // }
        
        const newDescargoNC = await RecursoReconsideracion.create({
            nro_recurso,
            fecha_recurso,
            //documento: documento_descargoNCPath,
            id_nc,
            id_plataforma2
        });

        return newDescargoNC || null;

    } catch (error) {
        console.error('Error creando Descargo NC desde el controlador:', error);
        return false;
    }
};

const getAllRecursoReconsideracionesController = async () => {
    try {
        const newDescargoNC = await RecursoReconsideracion.findAll({
            where: {id_rsg: null}
        });

        return newDescargoNC || null;

    } catch (error) {
        console.error('Error creando Descargo NC desde el controlador:', error);
        return false;
    }
}

const updateRecursoReconsideracionController = async (id, {id_rsg}) => {
    try {
        const findRecursoReconsideracion = await getRecursoReconsideracionController(id);

        const response = await findRecursoReconsideracion.update({
            id_rsg,
        });

        return response || null;
    } catch (error) {
        console.error('Error creando Descargo NC desde el controlador:', error);
        return false;
    }
}

const getRecursoReconsideracionController = async (id) => {
    try {
        const apelacion = await RecursoReconsideracion.findOne({
            where: { id }
        });
        return apelacion || null;
    } catch (error) {
        console.error('Error al obtener RSA:', error);
        return false
    }
}

module.exports = { createRecursoReconsideracionController, getAllRecursoReconsideracionesController, updateRecursoReconsideracionController };