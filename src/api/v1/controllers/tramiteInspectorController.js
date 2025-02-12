const { TramiteInspector, MedidaComplementaria, EstadoMC, Doc, TipoDocumentoComplementario, EjecucionMC, ControlActa } = require('../../../config/db_connection');
const { saveImage, deleteFile } = require('../../../utils/fileUtils');
const { Sequelize, Op } = require('sequelize');

const getMyActasController = async (id) => {
    try {
        const response = await Doc.findAll({
            where: {
                id_inspector: id,
                estado: 'asignada',
            },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'numero_acta']
        });

        return response
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tramites", data: error });
        return false;
    }
}



const createTramiteInspector = async ({ nro_nc, documento_nc, nro_acta, documento_acta, id_medida_complementaria, estado, id_inspector }) => {
    let documento_ncPath = null;
    let documento_actaPath = null;

    try {
        // Solo guardar si el archivo existe
        if (documento_nc) {
            documento_ncPath = saveImage(documento_nc, "NC");
        }

        if (documento_acta) {
            documento_actaPath = saveImage(documento_acta, 'AF');
        }

        const newTramiteNC = await TramiteInspector.create({
            nro_nc,
            documento_nc: documento_ncPath,
            nro_acta,
            documento_acta: documento_actaPath,
            id_medida_complementaria,
            estado,
            id_inspector
        });

        return newTramiteNC;
    } catch (error) {
        console.error('Error creando trámite:', error);

        if (documento_ncPath) deleteFile(documento_ncPath);
        if (documento_actaPath) deleteFile(documento_actaPath);

        return false;
    }
};


const getAllTramiteInspectorById = async (id, page = 1, limit = 20, inicio = null, fin = null) => {
    const offset = (page - 1) * limit;

    let whereCondition = { id_inspector: id };

    if (inicio && fin) {
        let fechaStart = new Date(inicio); 
        let fechaEnd = new Date(fin);    

        fechaStart.setUTCHours(0, 0, 0, 0);
        fechaEnd.setUTCHours(23, 59, 59, 999);

        whereCondition['createdAt'] = {
            [Op.between]: [fechaStart, fechaEnd]
        }
    }

    try {
        const response = await TramiteInspector.findAndCountAll({
            where: {
                ...whereCondition,
                // nro_nc: { [Sequelize.Op.ne]: null },
            },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'nro_nc', 'documento_nc', 'nro_acta', 'documento_acta',
                [Sequelize.col('medidaComplementaria.nro_medida_complementaria'), 'nro_mc'],
                [Sequelize.col('medidaComplementaria.nombre_MC'), 'nombre_MC'],
                [Sequelize.col('medidaComplementaria.documento_medida_complementaria'), 'documento_mc'],
                'createdAt'
            ],
            include: [
                {
                    model: MedidaComplementaria,
                    as: 'medidaComplementaria',
                    attributes: []
                },
            ],
            limit,
            offset,
        });

        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tramites", data: error });
        return false;
    }
};


const getTramiteInspector = async (id) => {
    console.log(id)
    try {
        const response = await TramiteInspector.findOne({
            where: {
                id: id,
            },
            attributes: ['id', 'nro_nc', 'documento_nc', 'nro_acta', 'documento_acta',
                [Sequelize.col('medidaComplementaria.nro_medida_complementaria'), 'nro_mc'],
                [Sequelize.col('medidaComplementaria.nombre_MC'), 'nombre_MC'],
                [Sequelize.col('medidaComplementaria.documento_medida_complementaria'), 'documento_mc'],
                'createdAt'
            ],
            include: [
                {
                    model: MedidaComplementaria,
                    as: 'medidaComplementaria',
                    attributes: []
                },
            ],
        });

        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tramites", data: error });
        return false;
    }
};

const getDoc = async (id) => {
    try {
        const response = await Doc.findOne({
            where: {
                id: id
            }
        })

        return response
    } catch (error) {
        return false
    }
}




module.exports = { createTramiteInspector, getTramiteInspector, getAllTramiteInspectorById, getMyActasController, getDoc };
