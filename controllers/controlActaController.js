const {ControlActa, Usuario, TramiteInspector} = require('../db_connection');
const { Sequelize } = require('sequelize');

const createControlActaController=async ({fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector}) => {
    try {
        const response = await ControlActa.create({
          fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector, estado: 'INICIADO'
        });
        return response || null;
  
    } catch (error) {
      console.error("Error al crear el control de acta:", error);
      return false;
    }
}

const actasActualesHandlerController =async (dia) => {
  try {
      const tramitesPorInspector = await TramiteInspector.findAll({
        attributes: [
          'id_inspector',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'nro_actas_realizadas'],
        ],
        where: Sequelize.where(
          Sequelize.fn('DATE', Sequelize.col('createdAt')),
          dia
        ),
        group: ['id_inspector'],
      });

      const tramitesMap = tramitesPorInspector.reduce((acc, tramite) => {
        // Verificar que 'nro_actas_realizadas' sea válido y convertir a número
        const nroActasRealizadas = tramite.dataValues.nro_actas_realizadas || 0;
        acc[tramite.dataValues.id_inspector] = parseInt(nroActasRealizadas, 10);
        return acc;
      }, {});

      

      const response = await ControlActa.findAll({
        where: { fecha_laburo: dia },
        attributes: [
            'id',
            [Sequelize.col('usuarioInspector.id'), 'id_inspector'],
            [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
            'nro_actas_inicio',
            'observaciones_inicio',
            'nro_actas_realizadas',
            'observaciones_laburo',
            'nro_actas_entregadas',
            'observaciones_fin',
            'estado'
        ],
        include: [
          {
              model: Usuario,
              as: 'usuarioInspector',
              attributes: []
          },

      ],
      });

      

      const result = response.map((acta) => {
        const nroActasRealizadas =
          tramitesMap[acta.dataValues.id_inspector] || 0; // Si no hay trámites, usar 0
        return {
          ...acta.dataValues,
          nro_actas_realizadas: nroActasRealizadas,
        };
      });
      // console.log(result);

      return result || null;

  } catch (error) {
    console.error("Error al traer control de actas actuales:", error);
    return false;
  }
}



const updateControlActaController=async (id,{nro_actas_realizadas, observaciones_laburo, nro_actas_entregadas, observaciones_fin, id_encargadoFin}) => {
  try {
    console.log(id);
    
      const findActaControl = await getControlActa(id);
      console.log(findActaControl);
      
      const response = await findActaControl.update({
        nro_actas_realizadas, observaciones_laburo, nro_actas_entregadas, observaciones_fin, id_encargadoFin, estado: 'FINALIZADO'
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
