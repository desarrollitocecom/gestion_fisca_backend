const {
    createDescargoRSGNPController,
    updateDescargoRSGNPController
} = require('../controllers/descargoRsgnpController');
const {
    updateRsgnpController,
    getRsgnpController
} = require('../controllers/rsgnpController');
const { updateDocumento }=require('../controllers/documentoController');

const fs = require('node:fs');
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
// Crear un descargo
const createDescargoRSGNPHandler = async (req, res) => {
    const {id}=req.params;

    const { nro_descargo, fecha_descargo, id_nc, id_analista_4 } = req.body;

    const errores = [];

    const documento_DRSGNP = req.files && req.files["documento_DRSGNP"] ? req.files["documento_DRSGNP"][0] : null;
    
    
    if (!nro_descargo) errores.push('El campo nro_descargo es requerido');

    if (typeof nro_descargo !== 'string') errores.push('El nro_descargo debe ser una cadena de texto');

    if (!fecha_descargo) errores.push('El campo fecha_descargo es requerido');

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_descargo)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD para fecha_descargo');

    } else {

        const parsedFecha = new Date(fecha_descargo);

        if (isNaN(parsedFecha.getTime())) {

            errores.push('Debe ser una fecha válida para fecha_descargo');
        }
    }
   
    if (!id_analista_4) errores.push('El campo id_analista_4 es requerido');

    if (!isValidUUID(id_analista_4)) errores.push('El id_analista_4 debe ser una UUID');

    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    
    if (!documento_DRSGNP || documento_DRSGNP.length === 0) {

        errores.push("El documento_DRSGNP es requerido.");

    } else {

        if (documento_DRSGNP.length > 1) {

            errores.push("Solo se permite un documento_DRSGNP.");

        } else if (documento_DRSGNP.mimetype !== "application/pdf") {

            errores.push("El documento_DRSGNP debe ser un archivo PDF.");
        }
    }

    if (errores.length > 0) {
        if (documento_DRSGNP) {
            fs.unlinkSync(documento_DRSGNP.path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
       
        const get_id=await getRsgnpController(id);

        if(!get_id){

            return res.status(404).json({message:"No se encuentra id del RSGNP",data:[]})
        }
        const newDescargo = await createDescargoRSGNPController({ nro_descargo, fecha_descargo, documento_DRSGNP, id_nc, id_analista_4 });
       
        if (!newDescargo) {

            return res.status(400).json({ 
                message: "Descargo no fue creado",
                data: [] });
        }
        const id_descargo_RSGNP=newDescargo.id;

        const id_estado_RSGNP=3;
     
        const response=await updateRsgnpController(id,{id_descargo_RSGNP,id_estado_RSGNP})

        if (!response) {
            return res.status(400).json({
                message: 'Error al crear y asociar DescargoRSGNP',
                data: []
            });
        }
        const total_documentos = newDescargo.documento_DRSGNP;

        const nuevoModulo = "RECURSO DE APELACION"

        await updateDocumento({ id_nc, total_documentos, nuevoModulo });

        return res.status(200).json({ message: "DescargoRSGNP creado con éxito y asociado a RSGNP correctamente", data: newDescargo });

    } catch (error) {

        console.error("Error al crear el descargo:", error);

        return res.status(500).json({ message: "Error al crear el descargo", error: error.message });
    }
};

// Actualizar un descargo
const updateDescargoRSGNPHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_descargo, fecha_descargo, id_nc, id_analista_4 } = req.body;
    const errores = [];
    const documento = req.files && req.files["documento"] ? req.files["documento"][0] : null;

    // Validación del campo nro_descargo
    if (!nro_descargo) errores.push('El campo nro_descargo es requerido');
    if (typeof nro_descargo !== 'string') errores.push('El nro_descargo debe ser una cadena de texto');

    // Validación de fecha_descargo
    if (!fecha_descargo) errores.push('El campo fecha_descargo es requerido');
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_descargo)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD para fecha_descargo');
    } else {
        const parsedFecha = new Date(fecha_descargo);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida para fecha_descargo');
        }
    }
    // Validaciones de `id_analista_4`
    if (!id_analista_4) errores.push('El campo id_analista_4 es requerido');
    if (!isValidUUID(id_analista_4)) errores.push('El id_analista_4 debe ser una UUID');
    // Validaciones de `id_nc`
    if (!id_nc) errores.push('El campo id_nc es requerido');
    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');
    // Validación de documento_descargo
    if (!documento || documento.length === 0) {
        errores.push("El documento es requerido.");
    } else {
        if (documento.length > 1) {
            errores.push("Solo se permite un documento.");
        } else if (documento.mimetype !== "application/pdf") {
            errores.push("El documento debe ser un archivo PDF.");
        }
    }

    // Si hay errores, devolverlos
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
        const updatedDescargo = await updateDescargoRSGNPController({ id, nro_descargo, fecha_descargo, documento, id_nc, id_analista_4 });
        if (!updatedDescargo) {
            return res.status(404).json({ message: "Descargo no encontrado" });
        }
        return res.status(200).json({ message: "Descargo actualizado con éxito", data: updatedDescargo });
    } catch (error) {
        console.error("Error al actualizar el descargo:", error);
        return res.status(500).json({ message: "Error al actualizar el descargo", error: error.message });
    }
};

module.exports = {
    createDescargoRSGNPHandler,
    updateDescargoRSGNPHandler,
};
