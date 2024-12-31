const { format } = require('date-fns-tz');
const { Sequelize } = require('sequelize');
const { Paquete, Doc, MovimientoActa } = require('../db_connection');

const generatePaquete = async (req, res) => {
    const anio = format(new Date(), 'yyyy', { timeZone: 'America/Lima' });
    const { rangoInicio, rangoFinal, descripcion, id_encargado } = req.body;

    const cantidadTotal = rangoFinal - rangoInicio + 1;

    const transaction = await Paquete.sequelize.transaction();

    try {
        const paquete = await Paquete.create(
            {
                rangoInicio,
                rangoFinal,
                cantidadTotal,
                descripcion,
            },
            { transaction }
        );

        const actas = [];
        for (let i = rangoInicio; i <= rangoFinal; i++) {
            const numero_acta = `${i.toString().padStart(5, '0')}-${anio}`;

            const existeActa = await Doc.findOne({
                where: { numero_acta },
                transaction, 
            });

            if (existeActa) {
                throw new Error(`El número de acta ${numero_acta} ya existe.`);
            }

            actas.push({
                numero_acta,
                estado: 'almacenada',
                id_paquete: paquete.id,
            });
        }

        await Doc.bulkCreate(actas, { transaction });

        await MovimientoActa.create({
            tipo: 'entrada',
            cantidad: rangoFinal - rangoInicio + 1,
            id_encargado,
            detalle: `Paquete registrado con rango ${rangoInicio}-${rangoFinal}`,
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            data: paquete,
        });
    } catch (error) {
        await transaction.rollback();

        console.error('Error interno al crear el Control de Acta:', error);
        return res.status(500).json({
            message: 'Error interno al crear el Control de Acta',
            data: error.message,
        });
    }
};


const sacarActas = async (req, res) => {
    const { rangoInicio, rangoFinal, id_encargado } = req.body;
    const anio = new Date().getFullYear();

    const numeroActaInicio = `${rangoInicio.toString().padStart(5, '0')}-${anio}`;
    const numeroActaFin = `${rangoFinal.toString().padStart(5, '0')}-${anio}`;

    const transaction = await Doc.sequelize.transaction();  

    try {
        const actasEncontradas = await Doc.findAll({
            where: {
                estado: 'almacenada',
                numero_acta: {
                    [Sequelize.Op.gte]: numeroActaInicio,
                    [Sequelize.Op.lte]: numeroActaFin,
                },
            },
            transaction,  
        });

        if (actasEncontradas.length === 0) {
            throw new Error(`No se encontraron actas almacenadas en el rango especificado ${rangoInicio} - ${rangoFinal}`);
        }

        await Promise.all(
            actasEncontradas.map(acta =>
                acta.update({ estado: 'salida' }, { transaction }) 
            )
        );

        await MovimientoActa.create({
            tipo: 'salida',
            id_encargado,
            cantidad: actasEncontradas.length,
            detalle: `${actasEncontradas.length} actas retiradas del almacén (rango: ${rangoInicio}-${rangoFinal})`,
        }, { transaction }); 

        await transaction.commit();

        return res.status(200).json({
            data: actasEncontradas,
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
    const { id_inspector, actas } = req.body;  
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

        await Promise.all(
            actasEncontradas.map(acta =>
                acta.update({ estado: 'asignada', id_inspector }, { transaction })  
            )
        );

        await MovimientoActa.create({
            tipo: 'asignacion',
            cantidad: actasEncontradas.length,
            usuarioId: 2, 
            detalle: `Actas asignadas al inspector ${id_inspector}`,
        }, { transaction });  

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

    const numerosActa = actas.map(num => `${num.toString().padStart(5, '0')}-${anio}`);

    const transaction = await Doc.sequelize.transaction();  

    try {
        const actasEncontradas = await Doc.findAll({
            where: {
                estado: 'realizada',
                numero_acta: {
                    [Sequelize.Op.in]: numerosActa,  
                },
            },
            transaction,  
        });

        const actasNoEncontradas = numerosActa.filter(numActa => !actasEncontradas.some(acta => acta.numero_acta === numActa));

        if (actasNoEncontradas.length > 0) {
            throw new Error(`Las siguientes actas no fueron encontradas en estado "realizada": ${actasNoEncontradas.join(', ')}`);
        }

        await Promise.all(
            actasEncontradas.map(acta =>
                acta.update({ estado: 'devuelta' }, { transaction })  
            )
        );

        await MovimientoActa.create({
            tipo: 'devolucion',
            cantidad: actasEncontradas.length,
            detalle: `Actas devuelvas`,
        }, { transaction });  

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


module.exports = { generatePaquete, sacarActas, asignarActa, devolverActa };
