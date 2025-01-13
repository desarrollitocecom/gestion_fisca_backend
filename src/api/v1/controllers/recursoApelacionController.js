const { RecursoApelacion,Usuario } = require('../../../config/db_connection');
const { saveImage } = require('../../../utils/fileUtils');
const { Sequelize } = require('sequelize');

const createRecursoApelacionController = async ({ 
        nro_recurso, fecha_recurso, id_nc, id_plataforma2, documento_recurso
    }) => {

    try {
        let documento_descargoNCPath = null;

        if(documento_recurso){
            documento_descargoNCPath = saveImage(documento_recurso, 'RecursoApelacion');
        }
        
        const newDescargoNC = await RecursoApelacion.create({
            nro_recurso,
            fecha_recurso,
            documento: documento_descargoNCPath,
            id_nc,
            id_plataforma2
        });

        return newDescargoNC || null;

    } catch (error) {
        console.error('Error creando Descargo NC desde el controlador:', error);
        return false;
    }
};

const getAllRecursosApelacionesController = async () => {
    try {
        const apelaciones = await RecursoApelacion.findAll({
            where: {
                id_gerencia: null,
            },
            attributes: {
                include: [
                    [Sequelize.col('Usuarios.usuario'), 'analista4']
                ]
            },
            include: [
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: [],
                }
            ],
        });
        return apelaciones || null;
    } catch (error) {
        console.error('Error al obtener RSA:', error);
        return false
    }
}

const updateRecursoApelacionController = async (id, { id_gerencia, tipo }) => {
    try {

        const findRecursoApelacion = await getRecursoApelacionController(id);

        const response = await findRecursoApelacion.update({
            id_gerencia,
            tipo
        });

        return response || null;

    } catch (error) {
        console.error('Error creando Descargo NC desde el controlador:', error);
        return false;
    }
}

const getRecursoApelacionController = async (id) => {
    try {
        const apelacion = await RecursoApelacion.findOne({
            where: { id }
        });
        return apelacion || null;
    } catch (error) {
        console.error('Error al obtener RSA:', error);
        return false
    }
}

module.exports = { createRecursoApelacionController, getAllRecursosApelacionesController, updateRecursoApelacionController, getRecursoApelacionController };