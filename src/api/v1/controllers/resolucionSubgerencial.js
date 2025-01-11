const { RSA, Usuario, NC, TramiteInspector, ResolucionSubgerencial, ResolucionSancionadora } = require('../../../config/db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const { saveImage, deleteFile } = require('../../../utils/fileUtils')
const { Sequelize } = require('sequelize');
const myCache = require("../../../middlewares/cacheNodeStocked");

const createResoSAController = async ({ nro_rsa, fecha_rsa, documento_RSA, id_nc, id_AR2 }) => {
    let documento_path;
    try {
        documento_path = saveImage(documento_RSA, 'Resolucion(RSA)')

        const newRsa = await ResolucionSancionadora.create({
            nro_rsa,
            fecha_rsa,
            documento_RSA: documento_path,
            id_nc,
            id_AR2,
            estado: 'PLATAFORMA_SANCION'
        });

        return newRsa || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al crear RSA:', error);
        return false
    }
};

const updateResolucionSubgerencialController = async (id, { tipo_evaluar, id_evaluar_rsg }) => {
    try {

        const resoSubgerencial = await getResolucionSubgerencialController(id);

        if (resoSubgerencial) {
            await resoSubgerencial.update({
                tipo_evaluar,
                id_evaluar_rsg
            });
        }

        return resoSubgerencial || null;
    } catch (error) {

        console.error('Error al actualizar RSA:', error);
        return false
    }
};

const getResolucionSubgerencialController = async (id) => {
    try {
        console.log(id);

        const rsg = await ResolucionSubgerencial.findOne({ where: { id } });
        return rsg || null;
    } catch (error) {
        console.error('Error al obtener RSA:', error);
        return false
    }
};














const getAllRSAforAR3Controller = async () => {
    try {
        const response = await RSA.findAll({
            where: { tipo: 'AR3' },
            order: [['id', 'ASC']],
            attributes: [
                'id',
                'createdAt',
                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'area_instructiva3'],
                'tipo'
            ],
            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: [],
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: []
                },
            ],
        });

        const modifiedResponse = response.map(item => {
            const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
            const cachedValue = myCache.get(`AResolutivaThree-${id}`); // Obtener valor del cache si existe

            return {
                ...item.toJSON(),
                disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
            };
        });

        return modifiedResponse || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los IFI para RSG2", data: error });
        return false;
    }
};

const updateRsaController = async (id, { nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_RSG, id_descargo_RSA, id_nc, id_estado_RSA, id_AR2 }) => {
    try {

        const rsa = await getRsaController(id);
        if (rsa) {
            await rsa.update({
                nro_rsa,
                fecha_rsa,
                fecha_notificacion,
                documento_RSA,
                tipo,
                id_evaluar_rsa,
                id_descargo_RSA,
                id_nc,
                id_RSG,
                id_estado_RSA,
                id_AR2
            });
        }

        return rsa || null;
    } catch (error) {

        console.error('Error al actualizar RSA:', error);
        return false
    }
};

const getRsaController = async (id) => {
    try {
        const rsa = await RSA.findOne({ where: { id } });
        return rsa || null;
    } catch (error) {
        console.error('Error al obtener RSA:', error);
        return false
    }
};


const getAllRsaController = async () => {
    try {
        const response = await RSA.findAll({
            where: { tipo: null },
            attributes: ['id', 'id_AR2', 'createdAt',

                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'analista3'],
            ],

            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: []
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: []
                },

            ],
        });
        return response || null;
    } catch (error) {
        console.error("Error al traer todos los RSA", error);
        return false;
    }
};



const getAllRSAforPlataformaController = async () => {
    try {
        const response = await ResolucionSancionadora.findAll({
            where: {
                estado: 'PLATAFORMA_SANCION'
            }
        });

        const formattedResponse = response.map(item => ({
            id: item.id,
            numero: item.nro_rsa,
            createdAt: item.createdAt,
            id_nc: item.id_nc,
            tipo_viene: 'RSA'
        }));

        return formattedResponse || null;
    } catch (error) {
        return false
    }
}

const getAllRSGforAR2Controller = async () => {
    try {
        const response = await ResolucionSubgerencial.findAll({
            attributes: [
                'id',
                [Sequelize.col('nro_rsg'), 'nro'],
                [Sequelize.col('documento_RSG'), 'documento'],
                'tipo',
                'id_nc',
                [Sequelize.literal(`
              CASE 
                WHEN tipo_evaluar = null THEN true
                ELSE false
              END
            `), 'activo'],
                'createdAt',
            ],
        });

        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los IFI para RSG1", data: error });
        return false;
    }
}

module.exports = {
    updateRsaController,
    getRsaController,
    getAllRsaController,
    getAllRSAforAR3Controller,

    getAllRSAforPlataformaController,
    createResoSAController,
    updateResolucionSubgerencialController,
    getAllRSGforAR2Controller
};

