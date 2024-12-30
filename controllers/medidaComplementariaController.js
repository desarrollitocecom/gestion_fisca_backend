const { MedidaComplementaria, TramiteInspector, Usuario, NC, TipoDocumentoComplementario } = require("../db_connection");
const { saveImage } = require('../utils/fileUtils');
const { Sequelize } = require('sequelize');


const getAllMCController = async () => {
    try {
        const response = await NC.findAll({
            where: Sequelize.where(Sequelize.col('tramiteInspector.medidaComplementaria.estado'), 'PENDIENTE'),
            attributes: [
                [Sequelize.col('tramiteInspector.medidaComplementaria.id'), 'id'],
                ['id', 'id_nc'],
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.medidaComplementaria.nombre_MC'), 'nombre_MC'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'inspector'],
            ], 
            include: [
                {
                    model: TramiteInspector,
                    as: 'tramiteInspector',
                    include: [
                        {
                            model: MedidaComplementaria,
                            as: 'medidaComplementaria',
                            attributes: []
                        },
                        {
                            model: Usuario, 
                            as: 'inspectorUsuario',
                            attributes: []
                        },
                    ],
                    attributes: []
                },         
            ]
        });
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al traer todas las Medidas Complementarias:", error);
        return false;
    }
};

// Obtener una medida complementaria por ID
const getMedidaComplementaria = async (id) => {
    try {
        const response = await MedidaComplementaria.findOne({
            where: { id }
        });
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al traer la Medida Complementaria:", error);
        return false;
    }
};

// Crear una nueva medida complementaria
const createMedidaComplementaria = async ({ 
    nombre_MC, 
    nro_medida_complementaria, 
    documento_medida_complementaria, 
    }) => {

    let documento_MCPath;

    try {
        documento_MCPath = saveImage(documento_medida_complementaria, "Medida Complementaria");

        const response = await MedidaComplementaria.create({ 
            nombre_MC, 
            nro_medida_complementaria,
            documento_medida_complementaria: documento_MCPath,
            estado: 'PENDIENTE'
            });
            
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al crear la Medida Complementaria:", error);
        return false;
    }
};

// Actualizar una medida complementaria
const updateMCController = async (id, { numero_ejecucion, tipo_ejecucionMC, documento_ejecucion, id_usuarioMC }) => {
    try {

        let documento_ejecucionNCPath = null;

        if(documento_ejecucion){
            documento_ejecucionNCPath = saveImage(documento_ejecucion, 'Ejecucion_Medida_Complementaria');
        }

        const medida = await getMedidaComplementaria(id);
        if (medida) await medida.update({ numero_ejecucion, tipo_ejecucionMC, documento_ejecucion: documento_ejecucionNCPath, id_usuarioMC, estado: 'REALIZADO' });
        return medida || null;
    } catch (error) {
        console.error("Error al modificar la Medida Complementaria en el controlador:", error);
        return false;
    }
};

// Eliminar una medida complementaria (cambia el estado a false)
const deleteMedidaComplementaria = async (id) => {
    try {
        const medida = await MedidaComplementaria.findByPk(id);

        if (!medida) {
            console.error("Medida Complementaria no encontrada");
            return null;
        }

        // Cambia el estado a false en lugar de eliminar el registro
        medida.state = false;
        await medida.save();

        return medida;
    } catch (error) {
        console.error("Error al cambiar de estado al eliminar Medida Complementaria:", error);
        return false;
    }
};


const getAllTipoMCController = async () => {
    
    try {
        const response = await TipoDocumentoComplementario.findAll({
            order: [['id', 'ASC']],
            attributes: ['id', 'documento']
        });
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al traer todas las Medidas Complementarias:", error);
        return false;
    }
}


module.exports = {
    getMedidaComplementaria,
    createMedidaComplementaria,
    updateMCController,
    deleteMedidaComplementaria,
    getAllMCController,
    getAllTipoMCController
};
