const { TramiteInspector, MedidaComplementaria, EstadoMC, TipoDocumentoComplementario, EjecucionMC } = require('../db_connection');
const { saveImage, deleteFile } = require('../utils/fileUtils');

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
            attributes: { exclude: ['id_medida_complementaria'] },
            where: {
                id_inspector: id,
            },
            include: [
                {
                    model: MedidaComplementaria, 
                    as: 'medidaComplementaria',
                    attributes: { exclude: ['id_estado', 'id_documento', 'id_ejecucionMC'] },
                    include: [
                        {
                            model: TipoDocumentoComplementario,
                            as: 'tipoDocumento', 
                        },
                        {
                            model: EjecucionMC,
                            as: 'ejecucion'
                        },
                        {
                            model: EstadoMC,
                            as: 'estado', 
                        }
                        
                    ],
                },
            ],
            limit,
            offset,
            order: [['id', 'DESC']]
        });

        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tramites", data: error });
        return false;
    }
};



module.exports = { createTramiteInspector, getAllTramiteInspectorById };
