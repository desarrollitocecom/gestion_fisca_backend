const {ControlActa, Usuario, TramiteInspector, Paquete, RangoActa, MovimientoActa} = require('../db_connection');
const { Sequelize } = require('sequelize');

const createControlActaController=async ({numero_actas, id_inspector, observaciones_inicio, id_encargadoInicio, fecha_laburo}) => {
    try {
        const response = await RangoActa.create({
          numero_actas, id_inspector, observaciones_inicio, id_encargadoInicio, fecha_laburo, estado: 'INICIADO'
        });
        return response || null;
  
    } catch (error) {
      console.error("Error al crear el control de acta:", error);
      return false;
    }
}

const actasActualesHandlerController = async (dia) => {
  try {
    const response = RangoActa.findAll({
      where: {fecha_laburo: dia},
      attributes: [
        'id',
        [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
        'estado'
      ],
      order: [
        [Sequelize.col('usuarioInspector.usuario'), 'ASC'] 
      ],
      include: [
         {
             model: Usuario,
             as: 'usuarioInspector',
             attributes: []
         },
         {
            model: ControlActa,
            as: 'controlActa', 
            attributes: ['id', 'numero_acta', 'estado'], 
          },
      ]
    })

    return response
  } catch (error) {
    
  }
}

const getActaActualController = async (id) => {
  try {
    const response = RangoActa.findAll({
      where: {id},
      attributes: [
        'id', 'numero_actas', 'observaciones_inicio', 'observaciones_final', 'estado',
        [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
        [Sequelize.col('usuarioEncargadoInicio.usuario'), 'usuarioEntregoActas']
      ],
      include: [
         {
             model: Usuario,
             as: 'usuarioInspector',
             attributes: []
         },
         {
            model: Usuario,
            as: 'usuarioEncargadoInicio',
            attributes: []
         },
         {
            model: ControlActa,
            as: 'controlActa', // Este alias debe coincidir con el definido en la asociación
            attributes: ['id', 'numero_acta', 'estado'], // Ajusta los atributos que necesitas
          },
      ]
    })

    return response
  } catch (error) {
    
  }
}


const updateControlActaController=async (id,{nro_actas_realizadas, observaciones_laburo, nro_actas_entregadas, observaciones_fin, id_encargadoFin, estado}) => {
  try {
    console.log(id);
    
      const findActaControl = await getControlActa(id);
      console.log(findActaControl);
      
      const response = await findActaControl.update({
        nro_actas_realizadas, observaciones_laburo, nro_actas_entregadas, observaciones_fin, id_encargadoFin, estado
      });
      return response || null;

  } catch (error) {
    console.error("Error al crear el control de acta:", error);
    return false;
  }
}


const getControlActa = async (id) => {
  try {
    console.log(id, 'asd');
    
      const findControlActa = await ControlActa.findOne({ 
          where: { id } 
      });

      return findControlActa || null;
  } catch (error) {
      console.error({ message: "Error al encontrar el Acta Control", data: error });
      return false;
  }
}

const updateActaInspector = async () => {

}

const getAllPaquetesController = async () => {
  try {
    const response = await Paquete.findAll();
    return response;
  } catch (error) {
      console.error('Error obteniendos los Paquetes:', error);
      return false
  }
}

const seguimientoController = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  try {
      const response = await MovimientoActa.findAndCountAll({
          limit,
          offset,
          order: [['createdAt', 'ASC']]
      });
      return { totalCount: response.count, data: response.rows, currentPage: page } || null;
  } catch (error) {
      console.error({ message: "Error en el controlador al traer todos los Estados MC", data: error });
      return false;
  }
};



module.exports = { createControlActaController, seguimientoController, actasActualesHandlerController, updateControlActaController, getActaActualController, updateActaInspector, getAllPaquetesController };
