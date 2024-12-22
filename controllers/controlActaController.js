const {ControlActa, Usuario} = require('../db_connection');
const { Sequelize } = require('sequelize');

const createControlActaController=async ({fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector}) => {
    try {
        const response = await ControlActa.create({
          fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector
        });
        return response || null;
  
    } catch (error) {
      console.error("Error al crear el control de acta:", error);
      return false;
    }
}

const actasActualesHandlerController =async (dia) => {
  try {
      const response = await ControlActa.findAll({
        where: { fecha_laburo: dia },
        attributes: [
            'id',
            [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
            'nro_actas_inicio',
            'observaciones_inicio',
            'nro_actas_realizadas',
            'observaciones_laburo',
            'nro_actas_entregadas',
            'observaciones_fin'
        ],
        include: [
          {
              model: Usuario,
              as: 'usuarioInspector',
              attributes: []
          },

      ],
      });
      return response || null;

  } catch (error) {
    console.error("Error al crear el control de acta:", error);
    return false;
  }
}



const updateControlActaController=async (id,{nro_actas_realizadas, observaciones_laburo, nro_actas_entregadas, observaciones_fin, id_encargadoFin}) => {
  try {
    console.log(id);
    
      const findActaControl = await getControlActa(id);
      console.log(findActaControl);
      
      const response = await findActaControl.update({
        nro_actas_realizadas, observaciones_laburo, nro_actas_entregadas, observaciones_fin, id_encargadoFin
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

module.exports = { createControlActaController, actasActualesHandlerController, updateControlActaController };
