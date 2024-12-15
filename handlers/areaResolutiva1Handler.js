const {getAllIFIforAR1Controller, getInformeFinalController, updateInformeFinalController} = require('../controllers/informeFinalController');
const {createRSG1Controller} = require('../controllers/rsg1Controller');
const {updateDocumento}=require('../controllers/documentoController');


const fs = require('node:fs');

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

const getAllIFIforAR1Handler = async (req, res) => {  
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
        const response = await getAllIFIforAR1Controller(Number(page), Number(limit));
  
        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más IFIs',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }
  
        return res.status(200).json({
            message: "IFIs obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener IFIs para AR1:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs." });
    }
};

const createRSG1Handler = async (req, res) => {
    const { id } = req.params;

    const { nro_resolucion, fecha_resolucion, id_nc, id_AR1 } = req.body;

    const documento = req.files && req.files["documento"] ? req.files["documento"][0] : null;

    const errores = [];

    if (!nro_resolucion) errores.push('El campo nro_resolucion es requerido');

    if (typeof nro_resolucion !== 'string') errores.push('El nro_resolucion debe ser una cadena de texto');

    if (!id_AR1) errores.push('El campo id_AR1 es requerido');

    if (!isValidUUID(id_AR1)) errores.push('El id_AR1 debe ser una UUID');

    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (!fecha_resolucion) errores.push('El campo fecha_resolucion es requerido');

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_resolucion)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_resolucion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }


    if (!documento) {
        errores.push('El documento es requerido');
    } else {
        if (documento.mimetype !== 'application/pdf') {
            errores.push('El documento debe ser un archivo PDF');
        }
    }

    if (errores.length > 0) {
        if (documento) {
            fs.unlinkSync(documento.path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const existingIFI = await getInformeFinalController(id);
        
        if (!existingIFI) {
            return res.status(404).json({ message: "El id del IFI no se encuentra", data: [] })
        }
        
        const newRsg1 = await createRSG1Controller({ nro_resolucion, fecha_resolucion, documento, id_nc, id_AR1 });

        if (!newRsg1) {
            return res.status(404).json({ message: "Error al crear el RSG1", data: [] })
        }
       
        const id_evaluar = newRsg1.id;

        const response = await updateInformeFinalController(id, { id_evaluar })

        const total_documentos = newRsg1.documento;

        const nuevoModulo = "RESOLUCION SUBGERENCIAL 1"

        await updateDocumento({ id_nc, total_documentos, nuevoModulo });

        if (!response) {
            return res.status(400).json({
                message: 'Error al crear el RGS1 y al asociar',
                data: []
            });
        }
        return res.status(200).json({
            message: "RSG1 creado correctamente y asociado a IFI",
            data: response,
        });
    } catch (error) {
        console.error("Error al crear RSG1:", error);
        return res.status(500).json({ error: "Error interno del servidor al crear RSG1." });
    }
};


module.exports = {
    getAllIFIforAR1Handler,
    createRSG1Handler
}
