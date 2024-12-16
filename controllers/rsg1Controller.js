const { RSG1, NC, TramiteInspector, Usuario, DescargoNC, IFI } = require('../db_connection'); 
const {saveImage,deleteFile}=require('../utils/fileUtils')
const { Sequelize } = require('sequelize');

const createRSG1Controller = async ({nro_resolucion, fecha_resolucion, documento,id_nc,id_AR1}) => {
    let documento_path;

    try {
        documento_path=saveImage(documento,'Resolucion(RSG1)')  
        
        const newRSG1 = await RSG1.create({
            nro_resolucion,
            fecha_resolucion,
            documento:documento_path,
            id_nc,
            id_AR1
        });

        return newRSG1 || null;
    } catch (error){
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al crear RSG1:', error);
        return false;
    };   
};
const getRSG1Controller=async (id) => {
    try {
        const response=await RSG1.findByPk(id)
        return response || null 
    } catch (error) {
        console.error('Error  crear RSG1:', error);
        return false;
    }
}

const updateRSG1Controller = async ({id, nro_resolucion, fecha_resolucion, documento,id_nc,id_AR1}) => {
    let documento_path;
    try {
          
        const rsg1 = await RSG1.findOne({ where: { id } });
        documento_path=rsg1.documento
        if (documento) {
            documento_path = saveImage(documento, 'Resolucion(RSG1)');
            if (rsg1.documento) {
                deleteFile(rsg1.documento);
            }
        }
        if(rsg1){
        await rsg1.update({
            nro_resolucion,
            fecha_resolucion,
            documento:documento_path,
            id_nc,
            id_AR1
        });}

        return rsg1 || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al actualizar RSG1:', error);
        return { message: 'Error al actualizar RSG1', error };
    }
};

const getAllRSG1forAR1Controller = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await NC.findAndCountAll({ 
            limit,
            offset,
            // where: { tipo: 'AN5' }, 
            order: [['id', 'ASC']],
            attributes: [
                'id',
                // 'createdAt',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'usuarioInspector'],
                [Sequelize.col('tramiteInspector.documento_nc'), 'documento_nc'],
                [Sequelize.col('tramiteInspector.documento_acta'), 'documento_acta'],
                [Sequelize.col('digitadorUsuario.usuario'), 'usuarioDigitador'],
                [Sequelize.col('descargoNC.analistaUsuario.usuario'), 'usuarioAnalista1'],
                [Sequelize.col('descargoNC.documento'), 'documento_descargoNC'],
                [Sequelize.col('IFI.Usuarios.usuario'), 'usuarioAreaInstructiva1'],
                [Sequelize.col('IFI.documento_ifi'), 'documento_ifi'],
            ],
            include: [
                {
                    model: TramiteInspector, 
                    as: 'tramiteInspector', 
                    include: [
                        {
                            model: Usuario,
                            as: 'inspectorUsuario'
                        }
                    ],
                    attributes: [], 
                },
                {
                  model: Usuario, 
                  as: 'digitadorUsuario',
                  attributes: []
                },
                {
                    model: DescargoNC, 
                    as: 'descargoNC', 
                    include: [
                        {
                            model: Usuario,
                            as: 'analistaUsuario'
                        }
                    ],
                    attributes: [], 
                },
                {
                    model: IFI, 
                    as: 'IFI', 
                    include: [
                        {
                            model: Usuario,
                            as: 'Usuarios'
                        }
                    ],
                    attributes: [], 
                },
            ]
        });

        const transformedData = response.rows.map(row => ({
            id: row.id,
            nro_nc: row.nro_nc,
            tramiteInspector: {
                usuarioInspector: row.get('usuarioInspector'),
                documento_nc: row.get('documento_nc'),
                documento_acta: row.get('documento_acta'),
            },
            usuarioDigitador: row.get('usuarioDigitador'),
            descargoNC: {
                usuarioAnalista1: row.get('usuarioAnalista1'),
                documento_descargoNC: row.get('documento_descargoNC'),
            },
            usuarioAreaInstructiva1: row.get('usuarioAreaInstructiva1'),
            documento_ifi: row.get('documento_ifi'),
        }));


        return { totalCount: response.count, data: transformedData, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los reportes de RSG1", data: error });
        return false;
    }
};


module.exports = {
    createRSG1Controller,
    updateRSG1Controller,
    getRSG1Controller,
    getAllRSG1forAR1Controller
};
