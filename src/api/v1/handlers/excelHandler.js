const { getAllDataController } = require("../controllers/reporteController")

const getAllDataHandler = async (req, res) => {

    const { page = 1, limit = 20, ordenanza = null, actividad_economica = null, fecha_NC = null } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un número");
    if (page < 0) errores.push("El page no puede ser negativo");
    if (isNaN(limit)) errores.push("El limit debe ser un número");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0");

    if (fecha_NC) {
        const fechas = fecha_NC.split('|');
        
        if (fechas.length !== 2) {
            errores.push("El parámetro fecha_NC debe tener el formato 'start|end'.");
        } else {
            const [startFecha, endFecha] = fechas;

            // Verificar que ambas fechas sean válidas
            const startDate = new Date(startFecha);
            const endDate = new Date(endFecha);

            if (isNaN(startDate.getTime())) {
                errores.push("La fecha de inicio no es válida.");
            }
            if (isNaN(endDate.getTime())) {
                errores.push("La fecha de fin no es válida.");
            }

            // Verificar que la fecha de inicio no sea mayor que la fecha de fin
            if (startDate > endDate) {
                errores.push("La fecha de inicio no puede ser mayor que la fecha de fin.");
            }
        }
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    let fecha_NCObj = null;
        if (fecha_NC) {
            const [start, end] = fecha_NC.split('|'); // Suponiendo que se pasa como "start|end"
            fecha_NCObj = { start, end };
        }
    console.log(fecha_NCObj);
    
    try {
        const response = await getAllDataController(Number(page), Number(limit), ordenanza, actividad_economica, fecha_NCObj);

        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay más NC',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Datos del excel obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error interno al obtener datos para el Excel:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los datos para el Excel." });
    }
};


module.exports = {
    getAllDataHandler
};
