const {
    createRGController,
    updateRGController,
    getRGController,
    getAllRGController
} = require('../controllers/rgController');
const {
     getRsgnpController,
     updateRsgnpController

}=require('../controllers/rsgnpController')

const { updateDocumento } = require('../controllers/documentoController');
const fs = require('node:fs');
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
// Crear un registro RG
const createRGHandler = async (req, res) => {
    const {id}=req.params;

    const { nro_rg, fecha_rg, fecha_notificacion, estado, id_nc, id_gerente } = req.body;

    const errores = [];

    const documento_rg = req.files && req.files["documento_rg"] ? req.files["documento_rg"][0] : null;

    if (!nro_rg) errores.push('El campo nro_rg es obligatorio');

    if (!fecha_rg) errores.push('El campo fecha_rg es obligatorio');

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_rg)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD');

    } else {

        const parsedFecha = new Date(fecha_rg);

        if (isNaN(parsedFecha.getTime())) {

            errores.push('Debe ser una fecha válida');
        }
    }
    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es obligatorio');

    if (!fechaRegex.test(fecha_notificacion)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD');

    } else {

        const parsedFecha = new Date(fecha_notificacion);

        if (isNaN(parsedFecha.getTime())) {
            
            errores.push('Debe ser una fecha válida');
        }
    }
    if (estado && typeof estado !== "string") errores.push('El campo estado es obligatorio');


    if (!documento_rg || documento_rg.length === 0) {

        errores.push("El documento_rg es requerido.");

    } else {
        if (documento_rg.length > 1) {

            errores.push("Solo se permite un documento_rg.");

        } else if (documento_rg.mimetype !== "application/pdf") {

            errores.push("El documento_rg debe ser un archivo PDF.");

        }
    }
    
    if (!id_gerente) errores.push('El campo id_gerente es requerido');

    if (!isValidUUID(id_gerente)) errores.push('El id_gerente debe ser una UUID');


    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');


    if (errores.length > 0) {

        if (documento_rg) {
            fs.unlinkSync(documento_rg.path);
        }
        
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {

        const get_id = await getRsgnpController(id);

        if (!get_id) {
            return res.status(404).json({ message: "El id del RSGNP no se encuentra", data: [] })
        }
        const newRG = await createRGController({
            nro_rg,
            fecha_rg,
            fecha_notificacion,
            estado,
            documento_rg,
            id_nc,
            id_gerente
        });
        if (!newRG) {
            return res.status(201).json({ message: 'Error al crear RG', data: [] });
        }
        const id_rg = newRG.id;

        const response = await updateRsgnpController(id, { id_rg })

        if (!response) {
            return res.status(201).json({
                message: 'Error al crear el RG y al asociar con RSGNP',
                data: []
            });
        }  
        const total_documentos = newRG.documento_rg;

        const nuevoModulo = "RESOLUCION GERENCIAL"

        await updateDocumento({ id_nc, total_documentos, nuevoModulo });

        return res.status(200).json({ message: "RG creado con éxito Y Asociado a RSGNP", data: response });
    } catch (error) {
        console.error("Error al crear RG:", error);
        return res.status(500).json({ message: "Error al crear RG", data: error });
    }
};

// Actualizar un registro RG
const updateRGHandler = async (req, res) => {
    const { id } = req.params;

    const { nro_rg, fecha_rg, fecha_notificacion, estado, id_nc, id_gerente } = req.body;

    const errores = [];

    const documento_rg = req.files && req.files["documento_rg"] ? req.files["documento_rg"][0] : null;

    if (!nro_rg) errores.push('El campo nro_rg es obligatorio');

    if (!fecha_rg) errores.push('El campo fecha_rg es obligatorio');


    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_rg)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD');

    } else {

        const parsedFecha = new Date(fecha_rg);

        if (isNaN(parsedFecha.getTime())) {

            errores.push('Debe ser una fecha válida');

        }
    }
    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es obligatorio');

    if (!fechaRegex.test(fecha_notificacion)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD');

    } else {

        const parsedFecha = new Date(fecha_notificacion);

        if (isNaN(parsedFecha.getTime())) {

            errores.push('Debe ser una fecha válida');

        }
    }
    if (estado && typeof estado !== "string") errores.push('El campo estado es obligatorio');

    if (!id_gerente) errores.push('El campo id_gerente es requerido');

    if (!isValidUUID(id_gerente)) errores.push('El id_gerente debe ser una UUID');

    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (!documento_rg || documento_rg.length === 0) {

        errores.push("El documento_rg es requerido.");

    } else {
        if (documento_rg.length > 1) {

            errores.push("Solo se permite un documento_rg.");

        } else if (documento_rg.mimetype !== "application/pdf") {

            errores.push("El documento_rg debe ser un archivo PDF.");
        }
    }
   
    if (errores.length > 0) {
        if (documento_rg) {
            fs.unlinkSync(documento_rg.path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const updatedRG = await updateRGController({
            id,
            nro_rg,
            fecha_rg,
            fecha_notificacion,
            estado,
            documento_rg,
            id_nc,
            id_gerente
        });

        if (!updatedRG) {
            return res.status(404).json({ message: "RG no encontrado" });
        }
        return res.status(200).json({ message: "RG actualizado con éxito", data: updatedRG });
    } catch (error) {
        console.error("Error al actualizar RG:", error);
        return res.status(500).json({ message: "Error al actualizar RG", data: error });
    }
};

// Obtener un registro RG por ID
const getRGHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const rg = await getRGController(id);
        if (!rg) {
            return res.status(404).json({ message: "RG no encontrado", data: [] });
        }
        return res.status(200).json({ message: "RG encontrado", data: rg });
    } catch (error) {
        console.error("Error al obtener RG:", error);
        return res.status(500).json({ message: "Error al obtener RG", data: error });
    }
};

// Obtener todos los registros RG
const getAllRGHandler = async (req, res) => {
    try {
        const rgs = await getAllRGController();
        if (!rgs) {
            return res.status(404).json({ message: 'RGs no encontrados', data: [] });
        }
        return res.status(200).json({ message: 'RGs encontrados', data: rgs });
    } catch (error) {
        console.error("Error al obtener RGs:", error);
        return res.status(500).json({ message: "Error al obtener RGs", data: error });
    }
};
module.exports = {
    createRGHandler,
    updateRGHandler,
    getRGHandler,
    getAllRGHandler
};
