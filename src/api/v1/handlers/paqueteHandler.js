const { format } = require('date-fns-tz');
const { Sequelize } = require('sequelize');
const { Paquete, Doc, MovimientoActa, Usuario } = require('../../../config/db_connection');

const { getAllPaquetesController, getOrdenanzasController, getAllSalidasFromPaqueteController, seguimientoController } = require('../controllers/controlActaController')

const generatePaquete = async (req, res) => {
  const { rangoInicio, rangoFinal, descripcion, id_encargado, ordenanza } = req.body;

  const transaction = await Paquete.sequelize.transaction();
  try {
    const paquete = await Paquete.create(
      {
        rangoInicio,
        rangoFinal,
        cantidadTotal: rangoFinal - rangoInicio + 1,
        cantidadActual: rangoFinal - rangoInicio + 1,
        descripcion,
        ordenanza
      },
      { transaction }
    );

    const actas = [];
    const actasExistentes = [];

    for (let i = rangoInicio; i <= rangoFinal; i++) {
      const numero_acta = `${i.toString().padStart(6, '0')}-${ordenanza}`;

      const existeActa = await Doc.findOne({
        where: { numero_acta },
        transaction,
      });

      if (existeActa) {
        actasExistentes.push(numero_acta);
      } else {
        actas.push({
          numero_acta,
          estado: 'almacenada',
          id_paquete: paquete.id,
        });
      }
    }


    if (actasExistentes.length > 0) {
      const errores = actasExistentes.map(
        (acta) => `El número de acta ${acta} ya existe`
      );
      await transaction.rollback();
      return res.status(400).json({
        message: 'Se encontraron los siguientes errores',
        data: errores,
      });
    }

    const findUser = await Usuario.findOne({
      where: {
        id: id_encargado
      }
    });

    const actasCreadas = await Doc.bulkCreate(actas, { transaction });

    for (const acta of actasCreadas) {
      await MovimientoActa.create(
        {
          tipo: 'entrada',
          cantidad: 1,
          id_encargado,
          numero_acta: acta.numero_acta,
          detalle: `Acta registrada por ${findUser.usuario}: ${acta.numero_acta}`,
          id_paquete: paquete.id,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(200).json({
      message: 'Paquete registrado correctamente, actas creadas individualmente',
      data: paquete,
    });

  } catch (error) {
    await transaction.rollback();

    console.error('Error interno al crear el Control de Acta:', error);
    return res.status(500).json({
      message: `${error.message}`,
    });
  }
};


const getAllPaquetes = async (req, res) => {
  try {
    const response = await getAllPaquetesController();

    if (response.length === 0) {
      return res.status(200).json({
        message: "No hay paquetes de actas registrados",
        data: []
      });
    }

    return res.status(200).json({
      message: "Paquetes obtenidos correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener :", error);
    res.status(500).json({ error: "Error interno del servidor al obtener los Paquetes." });
  }
}


const getOrdenanzas = async (req, res) => {
  const response = await getOrdenanzasController();
  if (response.length === 0) {
    return res.status(200).json({
      message: "No hay ordenanzas registradas",
      data: []
    });
  }

  return res.status(200).json({
    message: "Ordenanzas obtenidos correctamente",
    data: response,
  });
}



const getAllSalidasFromPaquete = async (req, res) => {
  const {id} = req.params
  try {
    const response = await getAllSalidasFromPaqueteController(id);

    if (response.length === 0) {
      return res.status(200).json({
        message: "No hay paquetes de actas registrados",
        data: []
      });
    }

    return res.status(200).json({
      message: "Paquetes obtenidos correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener :", error);
    res.status(500).json({ error: "Error interno del servidor al obtener los Paquetes." });
  }
}




const seguimientoHandler = async (req, res) => {
  const { page = 1, limit = 20, numero_acta } = req.query;
  const errores = [];

  if (isNaN(page)) errores.push("El page debe ser un número");
  if (page <= 0) errores.push("El page debe ser mayor a 0");
  if (isNaN(limit)) errores.push("El limit debe ser un número");
  if (limit <= 0) errores.push("El limit debe ser mayor a 0");

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const response = await seguimientoController(Number(page), Number(limit), numero_acta);

    if (response.data.length === 0) {
      return res.status(200).json({
        message: "No se encontró un historial de seguimiento",
        data: {
          data: [],
          totalPage: response.currentPage,
          totalCount: response.totalCount
        }
      });
    }

    return res.status(200).json({
      message: "Historial de seguimiento obtenido correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener estados MC:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener el listado de Seguimiento." });
  }
};



const sacarActas = async (req, res) => {
  const { rangoInicio, rangoFinal, id_encargado, ordenanza } = req.body;
  const numeroActaInicio = `${rangoInicio.toString().padStart(6, '0')}-${ordenanza}`;
  const numeroActaFin = `${rangoFinal.toString().padStart(6, '0')}-${ordenanza}`;
  
  const transaction = await Doc.sequelize.transaction();
  
  try {
    const actasRango = await Doc.findAll({
      where: {
        numero_acta: {
          [Sequelize.Op.gte]: numeroActaInicio,
          [Sequelize.Op.lte]: numeroActaFin,
        },
      },
      transaction,
    });

    if (actasRango.length === 0) {
      throw new Error(`No se encontraron actas en el rango especificado ${rangoInicio} - ${rangoFinal}`);
    }

    const actasNoValidas = actasRango.filter(acta => acta.estado !== 'almacenada');

    if (actasNoValidas.length > 0) {
      const listaNoValidas = actasNoValidas.map(acta => acta.numero_acta).join(', ');
      throw new Error(`Las siguientes actas no se encuentran en el almacén: ${listaNoValidas}`);
    }

    await Promise.all(
      actasRango.map(acta =>
        acta.update({ estado: 'salida' }, { transaction })
      )
    );

    const findUser = await Usuario.findOne({
      where: {
        id: id_encargado
      }
    });

    await Promise.all(
      actasRango.map(acta =>
        MovimientoActa.create(
          {
            tipo: 'salida',
            id_encargado,
            cantidad: 1,
            numero_acta: acta.numero_acta,
            detalle: `Acta retirada por ${findUser.usuario}: ${acta.numero_acta}`,
            id_paquete: acta.id_paquete,
          },
          { transaction }
        )
      )
    );

    await transaction.commit();

    return res.status(200).json({
      message: 'Las actas fueron procesadas correctamente',
      data: actasRango,
    });
  } catch (error) {
    await transaction.rollback();

    console.error('Error al procesar las actas:', error);
    return res.status(500).json({
      message: 'Error interno al procesar las actas',
      data: error.message,
    });
  }
};

const actasActuales = async (req, res) => {
  try {
    const response = await Doc.findAll({
      where: {
        estado: {
          [Sequelize.Op.or]: ['realizada', 'asignada', 'devuelta'],  // Estado puede ser "realizada" o "asignada"
        },
      },
      attributes: [
        [Sequelize.col('usuarioInspector.id'), 'id'],
        [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
        [Sequelize.literal('1'), 'estado'], // Campo constante con valor 1
      ],
      include: [
        {
          model: Usuario,
          as: 'usuarioInspector',
          attributes: [],
        },
      ],
      group: [Sequelize.col('usuarioInspector.id'), Sequelize.col('usuarioInspector.usuario')],
      order: [[Sequelize.col('inspector'), 'DESC']],
    });

    return res.status(200).json({
      message: "Datos obtenidos exitosamente",
      data: response,
    });
  } catch (error) {
    console.error('Error obteniendo los datos:', error);
    return res.status(500).json({
      message: 'Ocurrió un error al obtener los datos',
      error: error.message,
    });
  }
};

const getActaActual = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Doc.findOne({
      where: { id_inspector: id },
      attributes: [
        [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
        [Sequelize.literal(`(SELECT COUNT(*) FROM "Docs" WHERE id_inspector = '${id}')`), 'cantidad_actas'],
      ],
      include: [
        {
          model: Usuario,
          as: 'usuarioInspector',
          attributes: [],
        },
      ],
    });

    return res.status(200).json({
      message: 'Datos obtenidos exitosamente',
      data: response,
    });
  } catch (error) {
    console.error('Error obteniendo las actas:', error);
    return res.status(500).json({
      message: 'Ocurrió un error al obtener los datos',
      error: error.message,
    });
  }
};



const getActasRealizadasActual = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Doc.findAll({
      where: {
        id_inspector: id, // Filtrar por inspector
        [Sequelize.Op.or]: [
          { tipo: 'true' },
          // { estado: 'devuelta' }
        ], // Filtrar por estado 'realizada' o 'devuelta'
      },
      attributes: [
        'id', 'estado', 'numero_acta', // Añade aquí los atributos que desees incluir
        [Sequelize.col('usuarioInspector.usuario'), 'inspector'], // Nombre del inspector
      ],
      include: [
        {
          model: Usuario,
          as: 'usuarioInspector',
          attributes: [],
        },
      ],
    });

    return res.status(200).json({
      message: 'Datos obtenidos exitosamente',
      data: response,
    });
  } catch (error) {
    console.error('Error obteniendo las actas:', error);
    return res.status(500).json({
      message: 'Ocurrió un error al obtener los datos',
      error: error.message,
    });
  }
};


const getActasEntregadasActual = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Doc.findAll({
      where: {
        id_inspector: id, // Filtrar por inspector
        [Sequelize.Op.or]: [
          { estado: 'devuelta' }
        ], // Filtrar por estado 'realizada' o 'devuelta'
      },
      attributes: [
        'id', 'estado', 'numero_acta', // Añade aquí los atributos que desees incluir
        [Sequelize.col('usuarioInspector.usuario'), 'inspector'], // Nombre del inspector
      ],
      include: [
        {
          model: Usuario,
          as: 'usuarioInspector',
          attributes: [],
        },
      ],
    });

    return res.status(200).json({
      message: 'Datos obtenidos exitosamente',
      data: response,
    });
  } catch (error) {
    console.error('Error obteniendo las actas:', error);
    return res.status(500).json({
      message: 'Ocurrió un error al obtener los datos',
      error: error.message,
    });
  }
};












const getActasPorRealizarActual = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Doc.findAll({
      where: {
        id_inspector: id, // Filtrar por inspector
        [Sequelize.Op.or]: [
          { estado: 'asignada' },
          { estado: 'realizada' }
        ], // Filtrar por estado 'realizada' o 'devuelta'
      },
      attributes: [
        'id', 'estado', 'numero_acta', // Añade aquí los atributos que desees incluir
        [Sequelize.col('usuarioInspector.id'), 'id_inspector'],
        [Sequelize.col('usuarioInspector.usuario'), 'inspector'], // Nombre del inspector
      ],
      include: [
        {
          model: Usuario,
          as: 'usuarioInspector',
          attributes: [],
        },
      ],
    });

    return res.status(200).json({
      message: 'Datos obtenidos exitosamente',
      data: response,
    });
  } catch (error) {
    console.error('Error obteniendo las actas:', error);
    return res.status(500).json({
      message: 'Ocurrió un error al obtener los datos',
      error: error.message,
    });
  }
};





























const asignarActa = async (req, res) => {
  const { id_encargado, id_inspector, actas, ordenanza } = req.body;

  const numerosActa = actas.map(num => `${num.toString().padStart(6, '0')}-${ordenanza}`);

  const transaction = await Doc.sequelize.transaction();

  try {
    const actasEncontradas = await Doc.findAll({
      where: {
        estado: 'salida',
        numero_acta: {
          [Sequelize.Op.in]: numerosActa,
        },
      },
      transaction,
    });

    const actasNoEncontradas = numerosActa.filter(numActa => !actasEncontradas.some(acta => acta.numero_acta === numActa));


    if (actasNoEncontradas.length > 0) {
      const errores = actasNoEncontradas.map(
        numActa => `No se encontró el acta: ${numActa}`
      );

      await transaction.rollback(); // Rollback explícito
      return res.status(400).json({
        message: "Se encontraron los siguientes errores",
        data: errores,
      });
    }



    await Promise.all(
      actasEncontradas.map(acta =>
        acta.update({ estado: 'asignada', id_inspector }, { transaction })
      )
    );

    const nombreInspector = await Usuario.findOne({ 
      where: { id: id_inspector } 
    });

    const findUser = await Usuario.findOne({
      where: {
        id: id_encargado
      }
    });

    await Promise.all(
      actasEncontradas.map(acta =>
        MovimientoActa.create(
          {
            tipo: 'asignacion',
            cantidad: 1,
            id_encargado,
            numero_acta: acta.numero_acta,
            usuarioId: 2,
            detalle: `Acta Asignada por ${findUser.usuario}: ${acta.numero_acta} - Inspector ${nombreInspector.usuario}`,
            id_paquete: acta.id_paquete,
          },
          { transaction }
        )
      )
    );

    await transaction.commit();

    return res.status(200).json({
      message: 'Actas asignadas correctamente.',
      data: actasEncontradas,
    });
  } catch (error) {
    await transaction.rollback();

    console.error('Error al asignar las actas:', error);
    return res.status(500).json({
      message: 'Error interno al asignar las actas.',
      data: error.message,
    });
  }
};


const devolverActa = async (req, res) => {
  const { actas, id_encargado } = req.body;

  const transaction = await Doc.sequelize.transaction();

  try {
    // Obtenemos solo los números de acta
    const numerosActa = actas.map(({ numero_acta }) => numero_acta.toString());


    // Buscar actas en la base de datos
    const actasEncontradas = await Doc.findAll({
      where: {
        estado: {
          [Sequelize.Op.or]: ['realizada', 'asignada'],  // Estado puede ser "realizada" o "asignada"
        },
        numero_acta: {
          [Sequelize.Op.in]: numerosActa, // Coincidir números de actas directamente
        },
      },
      transaction,
    });

    // Identificar actas no encontradas
    const actasNoEncontradas = numerosActa.filter(numActa =>
      !actasEncontradas.some(acta => acta.numero_acta === numActa)
    );

    if (actasNoEncontradas.length > 0) {
      const errores = actasNoEncontradas.map(
        numActa => `No se encontró el acta: ${numActa}`
      );
      await transaction.rollback();
      return res.status(400).json({
        message: "Se encontraron los siguientes errores",
        data: errores,
      });
    }

    // Actualizar estado de las actas encontradas
    // Crear un mapa de número_acta -> id_paquete para referencias rápidas
    const mapaActas = actasEncontradas.reduce((map, acta) => {
      map[acta.numero_acta] = acta.id_paquete; // Relacionar numero_acta con id_paquete
      return map;
    }, {});

    // Actualizar el estado de las actas a 'devuelta'
    await Promise.all(
      actasEncontradas.map(acta =>
        acta.update({ estado: 'devuelta' }, { transaction })
      )
    );

    const findUser = await Usuario.findOne({
      where: {
        id: id_encargado
      }
    });

    // Crear registros en MovimientoActa
    await Promise.all(
      actas.map(({ numero_acta, observacion }) => {
        const detalle = observacion || "Entregado correctamente";

        return MovimientoActa.create(
          {
            tipo: 'devolucion',
            cantidad: 1,
            numero_acta, // Guardar el número sin formatear
            usuarioId: 2,
            detalle: `Acta devuelta a ${findUser.usuario}: ${numero_acta}`,
            id_paquete: mapaActas[numero_acta], 
            id_encargado
          },
          { transaction }
        );
      })
    );


    // Confirmar la transacción
    await transaction.commit();

    return res.status(200).json({
      message: 'Actas devueltas correctamente.',
      data: actasEncontradas,
    });
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();

    console.error('Error al devolver las actas:', error);
    return res.status(500).json({
      message: 'Error interno al devolver las actas.',
      data: error.message,
    });
  }
};



module.exports = { generatePaquete, sacarActas, getAllSalidasFromPaquete, getOrdenanzas, asignarActa, devolverActa, getAllPaquetes, seguimientoHandler, getActasEntregadasActual, actasActuales, getActaActual, getActasRealizadasActual, getActasPorRealizarActual };
