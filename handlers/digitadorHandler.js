const { updateNC, getNCforAnalista, getAllNC, getNC } = require('../controllers/ncController');
const { createEntidad, createInfraccion } = require('../controllers/entidadController');
const { getAllMCController } = require('../controllers/medidaComplementariaController');
const { validateNC } = require('../validations/digitadorValidation');
const { responseSocket } = require('../utils/socketUtils')



const sql = require("mssql");

const updateNCHandler = async (req, res) => {
    const id = req.params.id;

    const existingNC = await getNC(id);

    if (!existingNC) {
        return res.status(404).json({ message: 'Este NC no existe' });
    }

    // if (existingNC.id_digitador) {
    //     return res.status(404).json({ message: 'Este NC ya fue digitado' });
    // }

    const errors = validateNC(req.body);

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errors,
        });
    }

    const {
        id_tipoDocumento,
        nro_documento,
        ordenanza_municipal,
        nro_licencia_funcionamiento,
        nombre_entidad,
        domicilio_entidad,
        distrito_entidad,
        giro_entidad,
        id_infraccion,
        lugar_infraccion,
        placa_rodaje,
        fecha_constancia_notificacion,
        nombres_infractor,
        dni_infractor,
        relacion_infractor,
        observaciones,
        id_digitador,
    } = req.body;

    try {
        let pool = await sql.connect(config);
        
        console.log(id_infraccion);
        
        // Consulta SQL
        const query = `
            SELECT 
                s.subconcepto_id AS value, 
                s.codigo_sancion AS label, 
                s.descripcion, 
                m.descripcion AS medida, 
                s.tasa
            FROM mante.subconcepto s
            INNER JOIN medida_complementaria m ON s.medida_complementaria = m.id
            WHERE (codigo_area = '99') AND (codigo_complementario = '26') AND (subconcepto_id = ${id_infraccion})
        `;
        console.log('asd');
        // Ejecutar la consulta
        const result = await pool.request().query(query);
        const {value, label, descripcion, medida, tasa } = result.recordset[0];
        const monto = tasa * 51.50;
        console.log(value, label, medida, tasa, monto);
        
        const newInfraccion = await createInfraccion({
            codigo: label,
            descripcion,
            monto
        });





        let id_entidad = null;

        const shouldCreateEntidad = nombre_entidad || domicilio_entidad || distrito_entidad || giro_entidad;

        if (shouldCreateEntidad) {
            const newEntidad = await createEntidad({
                nombre_entidad,
                domicilio_entidad,
                distrito_entidad,
                giro_entidad,
            });

            if (newEntidad) {
                id_entidad = newEntidad.id;
            } else {
                return res.status(400).json({ error: 'Error al crear la Entidad' });
            }
        }

        const response = await updateNC(id, {
            id_tipoDocumento,
            nro_documento,
            ordenanza_municipal,
            nro_licencia_funcionamiento,
            id_entidad,
            id_infraccion: newInfraccion.id,
            lugar_infraccion,
            placa_rodaje,
            fecha_constancia_notificacion,
            nombres_infractor,
            dni_infractor,
            relacion_infractor,
            observaciones,
            estado: 'ANALISTA_1',
            id_digitador,
        });
        // console.log(response);
        if (response) {
            await responseSocket({id, method: getNCforAnalista, socketSendName: 'sendAnalista1', res});
        } else {
            return res.status(404).json({ message: 'Error al actualizar el NC' });
        }
    } catch (error) {
        console.error('Error al actualizar NC:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar la NC.' });
    }
};


const allNCHandler = async (req, res) => {
    
    try {
        const response = await getAllNC();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay más tramites NC',
                data: []
            });
        }

        return res.status(200).json({
            message: "Tramites NC obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener los trámites NC:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los tramites NC." });
    }
};

const config = {
    user: 'jjhuaman', // Usuario de la base de datos
    password: 'Asdfgh@2024', // Contraseña de la base de datos
    server: '172.16.1.97', // Nombre o IP del servidor (ej. localhost o 192.168.x.x)
    database: 'bd_cloud_10122024', // Nombre de tu base de datos
    options: {
        encrypt: false, // Usa true si estás usando Azure; false para una base de datos local
        trustServerCertificate: true // Usa true si confías en el certificado del servidor
    }
};

const getCodigos = async (req, res) => {
    try {
        // Crear una conexión con SQL Server
        let pool = await sql.connect(config);

        // Consulta SQL
        const query = `
            SELECT s.subconcepto_id as value, s.codigo_sancion as label 
            FROM mante.subconcepto s
            INNER JOIN medida_complementaria m ON s.medida_complementaria = m.id
            WHERE (codigo_area = '99') AND (codigo_complementario = '26')
        `;

        // Ejecutar la consulta
        const result = await pool.request().query(query);

        // Retornar los resultados como respuesta
        res.status(200).json(result.recordset);

        // Cerrar la conexión
        sql.close();
    } catch (error) {
        console.error(error);

        // Enviar un mensaje de error al cliente
        res.status(500).json({ error: "Error ejecutando la consulta" });
    }
};


const sendDetalle = async (req, res) => {
    const { id } = req.params;
    try {
        // Crear una conexión con SQL Server
        let pool = await sql.connect(config);

        // Consulta SQL
        const query = `
            SELECT 
                s.subconcepto_id AS value, 
                s.codigo_sancion AS label, 
                s.descripcion, 
                m.descripcion AS medida, 
                s.tasa
            FROM mante.subconcepto s
            INNER JOIN medida_complementaria m ON s.medida_complementaria = m.id
            WHERE (codigo_area = '99') AND (codigo_complementario = '26') AND (subconcepto_id = ${id})
        `;

        // Ejecutar la consulta
        const result = await pool.request().query(query);

        // Agregar el campo "monto" calculado al resultado
        const dataWithMonto = result.recordset.map(item => ({
            ...item,
            monto: item.tasa * 51.50, // Multiplica la tasa por 60
        }));

        // Retornar los resultados como respuesta
        res.status(200).json(dataWithMonto);

        // Cerrar la conexión
        sql.close();
    } catch (error) {
        console.error(error);

        // Enviar un mensaje de error al cliente
        res.status(500).json({ error: "Error ejecutando la consulta" });
    }
};


const getMCHandler = async (req, res) => {
    
    try {
        const response = await getAllMCController();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay más Medidas Complementarias',
                data: []
            });
        }

        return res.status(200).json({
            message: "Medidas Complementarias obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener las Medidas Complementarias:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener las Medidas Complementarias." });
    }
};

module.exports = { updateNCHandler, allNCHandler, getCodigos, sendDetalle, getMCHandler };
