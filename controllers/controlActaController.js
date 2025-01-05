const {ControlActa, Usuario, TramiteInspector, Paquete, RangoActa, MovimientoActa, Doc, Ordenanza} = require('../db_connection');
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
            as: 'controlActa', 
            attributes: ['id', 'numero_acta', 'estado'], 
          },
      ]
    })

    return response
  } catch (error) {
    
  }
}

const updateControlActaController=async (id, id_inspector) => {
  try {
    console.log('inspector', id_inspector);
    
      const findActaControl = await getControlActa(id);
      
      const response = await findActaControl.update({
        estado:'realizada',
        tipo: true
      });

      const findUser = await Usuario.findOne({
        where: {
          id: id_inspector
        }
      });

      await MovimientoActa.create(
        {
            tipo: 'realizacion',
            cantidad: 1,
            numero_acta: response.numero_acta, 
            detalle: `Acta Realizada: ${response.numero_acta} --- Inspector: ${findUser.usuario}`,
            id_paquete: response.id_paquete,
        }
    )

      return response || null;

  } catch (error) {
    console.error("Error al crear el control de acta:", error);
    return false;
  }
}


const getControlActa = async (id) => {
  try {
    console.log(id, 'asd');
    
      const findControlActa = await Doc.findOne({ 
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
    // Obtener todos los paquetes
    const paquetes = await Paquete.findAll({
      order: [['createdAt', 'DESC']],
    });

    // Obtener las cantidades de actas devueltas por paquete
    const paquetesConDevueltos = await Promise.all(
      paquetes.map(async (paquete) => {
        const cantidadDevueltos = await MovimientoActa.count({
          where: {
            id_paquete: paquete.id,
            tipo: 'salida', // Filtrar solo las actas devueltas
          },
        });

        // Retornar el paquete con la cantidad devuelta calculada
        return {
          ...paquete.toJSON(), // Convertir el paquete en objeto plano
          cantidadDevueltos,
          cantidadActual: paquete.cantidadTotal - cantidadDevueltos, // Calcular la cantidad actual
        };
      })
    );

    return paquetesConDevueltos;
  } catch (error) {
    console.error('Error obteniendo los Paquetes:', error);
    return false;
  }
};





const getOrdenanzasController = async (id) => {
  try {
    const ordenanzas = await Ordenanza.findAll({});
    return ordenanzas;
  } catch (error) {
    console.error('Error obteniendo las ordenanzas: ', error);
    return false;
  }
};


const getAllSalidasFromPaqueteController = async (id) => {
  try {
    const totalSalidas = await MovimientoActa.count({
      where: {
        tipo: 'salida', 
        id_paquete: id, 
      },
    });
    return totalSalidas;
  } catch (error) {
    console.error('Error obteniendo las salidas del paquete:', error);
    return false;
  }
};


const seguimientoController = async (page = 1, limit = 20, numero_acta) => {
  const offset = (page - 1) * limit;
  const whereClause = numero_acta ? { numero_acta } : {}; // Filtro dinámico

  try {
      const response = await MovimientoActa.findAndCountAll({
          limit,
          offset,
          where: whereClause, // Aplica el filtro aquí
          order: [['createdAt', 'DESC']]
      });
      return { 
          totalCount: response.count, 
          data: response.rows, 
          currentPage: page 
      } || null;
  } catch (error) {
      console.error({ message: "Error en el controlador al traer todos los Estados MC", data: error });
      return false;
  }
};




module.exports = { createControlActaController, getOrdenanzasController, getAllSalidasFromPaqueteController, seguimientoController, actasActualesHandlerController, updateControlActaController, getActaActualController, updateActaInspector, getAllPaquetesController };
