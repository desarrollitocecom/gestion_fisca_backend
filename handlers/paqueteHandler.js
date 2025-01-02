const { format } = require('date-fns-tz');
const { Sequelize } = require('sequelize');
const { Paquete, Doc, MovimientoActa } = require('../db_connection');

const { getAllPaquetesController, seguimientoController } = require('../controllers/controlActaController')

const generatePaquete = async (req, res) => {
    const anio = format(new Date(), 'yyyy', { timeZone: 'America/Lima' });
    const { rangoInicio, rangoFinal, descripcion, id_encargado } = req.body;

    const transaction = await Paquete.sequelize.transaction();

    try {
        // Crear el paquete
        const paquete = await Paquete.create(
            {
                rangoInicio,
                rangoFinal,
                cantidadTotal: rangoFinal - rangoInicio + 1,
                descripcion,
            },
            { transaction }
        );

        const actas = [];
        const actasExistentes = []; // Lista para almacenar los números de actas que ya existen

        // Iterar por el rango de actas
        for (let i = rangoInicio; i <= rangoFinal; i++) {
            const numero_acta = `${i.toString().padStart(5, '0')}-${anio}`;

            const existeActa = await Doc.findOne({
                where: { numero_acta },
                transaction,
            });

            if (existeActa) {
                actasExistentes.push(numero_acta); // Agregar a la lista de actas existentes
            } else {
                actas.push({
                    numero_acta,
                    estado: 'almacenada',
                    id_paquete: paquete.id,
                });
            }
        }

        // Si hay actas existentes, devolver un error
        if (actasExistentes.length > 0) {
            throw new Error(
                `Los siguientes números de acta ya existen: ${actasExistentes.join(', ')}`
            );
        }

        // Crear las nuevas actas si no hay conflictos
        const actasCreadas = await Doc.bulkCreate(actas, { transaction });

        // Registrar un movimiento para cada acta creada
        for (const acta of actasCreadas) {
            await MovimientoActa.create(
                {
                    tipo: 'entrada',
                    cantidad: 1, // Siempre es 1 por cada registro
                    id_encargado,
                    numero_acta: acta.numero_acta, // Registrar el número de acta individual
                    detalle: `Acta registrada: ${acta.numero_acta}`,
                },
                { transaction }
            );
        }

        // Confirmar la transacción
        await transaction.commit();

        return res.status(200).json({
            message: 'Paquete registrado correctamente, actas creadas individualmente',
            data: paquete,
        });

    } catch (error) {
        // Revertir la transacción en caso de error
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



// const seguimientoHandler = async (req, res) => {
//     try {
//         const response = await seguimientoController();

//         if (response.length === 0) {
//             return res.status(200).json({
//                 message: "No se encontró un historial de seguimiento",
//                 data: []
//             });
//         }

//         return res.status(200).json({
//             message: "Historial de seguimiento obtenido correctamente",
//             data: response,
//         });
//     } catch (error) {
//         console.error("Error al obtener :", error);
//         res.status(500).json({ error: "Error interno del servidor al obtener el listado de Seguimiento." });
//     }
// }


const seguimientoHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un número");
    if (page <= 0) errores.push("El page debe ser mayor a 0");
    if (isNaN(limit)) errores.push("El limit debe ser un número");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0");

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const response = await seguimientoController(Number(page), Number(limit));

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
    const { rangoInicio, rangoFinal, id_encargado } = req.body;
    const anio = new Date().getFullYear();

    const numeroActaInicio = `${rangoInicio.toString().padStart(5, '0')}-${anio}`;
    const numeroActaFin = `${rangoFinal.toString().padStart(5, '0')}-${anio}`;

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

        // Actualizar el estado de las actas a "salida"
        await Promise.all(
            actasRango.map(acta =>
                acta.update({ estado: 'salida' }, { transaction })
            )
        );

        // Crear un movimiento por cada acta procesada
        await Promise.all(
            actasRango.map(acta =>
                MovimientoActa.create(
                    {
                        tipo: 'salida',
                        id_encargado,
                        cantidad: 1, // Siempre 1 por registro
                        numero_acta: acta.numero_acta, // Número de acta procesada
                        detalle: `Acta retirada del almacén: ${acta.numero_acta}`,
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




const asignarActa = async (req, res) => {
    const { id_encargado, id_inspector, actas } = req.body;  
    const anio = new Date().getFullYear(); 

    const numerosActa = actas.map(num => `${num.toString().padStart(5, '0')}-${anio}`);

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
            throw new Error(`Las siguientes actas no fueron encontradas en estado "salida": ${actasNoEncontradas.join(', ')}`);
        }

        // Actualizar el estado de las actas a "asignada"
        await Promise.all(
            actasEncontradas.map(acta =>
                acta.update({ estado: 'asignada', id_inspector }, { transaction })  
            )
        );

        // Crear un movimiento individual por cada acta asignada
        await Promise.all(
            actasEncontradas.map(acta =>
                MovimientoActa.create(
                    {
                        tipo: 'asignacion',
                        cantidad: 1,  // Siempre 1 por cada acta
                        id_encargado,
                        numero_acta: acta.numero_acta, // Número de acta asignada
                        usuarioId: 2,  // Usuario asignado, puedes ajustarlo según sea necesario
                        detalle: `Acta asignada al inspector ${id_inspector}: ${acta.numero_acta}`,
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
    const { actas } = req.body;  
    const anio = new Date().getFullYear(); 

    // Convertir los números de actas con el formato adecuado
    const numerosActa = actas.map(({ numero_acta }) => `${numero_acta.toString().padStart(5, '0')}-${anio}`);
    
    
    const transaction = await Doc.sequelize.transaction();  

    try {
        // Buscar las actas en estado "realizada"
        const actasEncontradas = await Doc.findAll({
            where: {
                estado: 'realizada',
                numero_acta: {
                    [Sequelize.Op.in]: numerosActa,  
                },
            },
            transaction,  
        });

        // Identificar actas no encontradas
        const actasNoEncontradas = numerosActa.filter(numActa => 
            !actasEncontradas.some(acta => acta.numero_acta === numActa)
        );

        if (actasNoEncontradas.length > 0) {
            throw new Error(`Las siguientes actas no fueron encontradas en estado realizada: ${actasNoEncontradas.join(', ')}`);
        }

        // Actualizar el estado de las actas a "devuelta"
        await Promise.all(
            actasEncontradas.map(acta =>
                acta.update({ estado: 'devuelta' }, { transaction })  
            )
        );

        // Crear un movimiento individual para cada acta
        await Promise.all(
            actas.map(({ numero_acta, observacion }) => {
                const numeroActaFormateado = `${numero_acta.toString().padStart(5, '0')}-${anio}`;
                const detalle = observacion || "Entregado correctamente";

                return MovimientoActa.create(
                    {
                        tipo: 'devolucion',
                        cantidad: 1,  // Siempre 1 por cada acta
                        numero_acta: numeroActaFormateado, 
                        usuarioId: 2,  // Ajustar según la lógica de tu aplicación
                        detalle: `Acta ${numeroActaFormateado}: ${detalle}`,
                    },
                    { transaction }
                );
            })
        );

        await transaction.commit();

        return res.status(200).json({
            message: 'Actas devueltas correctamente.',
            data: actasEncontradas,
        });
    } catch (error) {
        await transaction.rollback();

        console.error('Error al devolver las actas:', error);
        return res.status(500).json({
            message: 'Error interno al devolver las actas.',
            data: error.message,  
        });
    }
};



module.exports = { generatePaquete, sacarActas, asignarActa, devolverActa, getAllPaquetes, seguimientoHandler };
