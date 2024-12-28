const { TramiteInspector, MedidaComplementaria, EstadoMC, TipoDocumentoComplementario, EjecucionMC, ControlActa } = require('../db_connection');
const { saveImage, deleteFile } = require('../utils/fileUtils');
const { Sequelize } = require('sequelize');

const getLocalDate = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000; // Offset en milisegundos
    const localTime = new Date(now.getTime() - offsetMs);
    return localTime.toISOString().split('T')[0];
  };

const getMyActasController = async (id) => {
    try {
        const response = await ControlActa.findAll({
            where: {
                id_inspector: id,
                estado: 'ENTREGADO',
                fecha: getLocalDate()
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


    let documento_ncPath;
    let documento_actaPath;

    try {
        documento_ncPath = saveImage(documento_nc, "NC");
        documento_actaPath = saveImage(documento_acta, 'AF');

        const newTramiteNC = await TramiteInspector.create({
            nro_nc,
            documento_nc: documento_ncPath,
            nro_acta,
            documento_acta: documento_actaPath,
            id_medida_complementaria,
            estado,
            id_inspector
        });

        console.log('Trámite creado con éxito');
        return newTramiteNC;
    } catch (error) {
        console.error('Error creando trámite:', error);

        deleteFile(documento_ncPath);
        deleteFile(documento_actaPath);

        return false;
    }
};

const getAllTramiteInspectorById = async (id, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await TramiteInspector.findAndCountAll({
            where: {
                id_inspector: id,
            },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'nro_nc', 'documento_nc', 'nro_acta', 'documento_acta',
                            [Sequelize.col('medidaComplementaria.nro_medida_complementaria'), 'nro_mc'],
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



module.exports = { createTramiteInspector, getAllTramiteInspectorById, getMyActasController };
