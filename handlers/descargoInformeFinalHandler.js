const {
    createDescargoAndAssociate,
    updateDescargoAndAssociate
} = require('../controllers/descargoInformeFinalController');
const {
    getInformeFinalController,
    updateInformeFinalController
}=require('../controllers/informeFinalController');
const { updateDocumento }=require('../controllers/documentoController');
const fs = require('node:fs');

function isValidUUID(uuid1) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid1);
}
const createDescargoHandler = async (req, res) => {
    const {id}=req.params;
    const { 
        nro_descargo, 
        fecha_descargo,
        id_nc ,
        id_analista_2
    } = req.body;

 
    const documento_DIFI = req.files && req.files["documento_DIFI"] ? req.files["documento_DIFI"][0] : null;

    const errores = [];

    if (!nro_descargo) errores.push('El campo nro_descargo es requerido');

    if (typeof nro_descargo !== 'string') errores.push('El nro_descargo debe ser una cadena de texto');

    if (!fecha_descargo) errores.push('El campo fecha_descargo es requerido');

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_descargo)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {

        const parsedFecha = new Date(fecha_descargo);

        if (isNaN(parsedFecha.getTime())) {

            errores.push('Debe ser una fecha válida');

        }
    }


if (!id_analista_2) errores.push('El campo id_analista_2 es requerido');

if (!isValidUUID(id_analista_2)) errores.push('El id_analista_2 debe ser una UUID');

if (!id_nc) errores.push('El campo id_nc es requerido');

if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (!documento_DIFI) {
        errores.push('El documento_DIFI es requerido');
    } else {
        if (documento_DIFI.mimetype !== 'application/pdf') {
            errores.push('El documento debe ser un archivo PDF');
        }
    }

    if (errores.length > 0) {
        if (documento_DIFI) {
            fs.unlinkSync(documento_DIFI.path); 
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const newDescargoIFI = await createDescargoAndAssociate({
            nro_descargo, 
            fecha_descargo, 
            documento_DIFI,
            id_nc,
            id_analista_2});
        
        const get_id=await getInformeFinalController(id);
    
        if(!get_id){

            return res.status(404).json({message:"No se encuentra id del IFI",data:[]})
        }
        const id_descargo_ifi=newDescargoIFI.id;

        const id_estado_IFI=3;

        const response=await updateInformeFinalController(id,{id_descargo_ifi,id_estado_IFI})

        if (!response) {
            return res.status(400).json({
                message: 'Error al crear y asociar DescargoIFI',
                data: []
            });
        }
        const total_documentos=newDescargoIFI.documento_DIFI

        const nuevoModulo="DESCARGO INFORME FINAL INSTRUCTIVO"

        await updateDocumento({id_nc, total_documentos, nuevoModulo});

        return res.status(200).json({

            message: 'DescargoIFI creado y Asociado a IFI ',
            
            data: response
        });
    } catch (error) {
        console.error('Error al crear y asociar DescargoIFI:', error);
        return res.status(500).json({
            message: 'Error al crear y asociar DescargoIFI',
            error: error.message
        });
    }
};

const updateDescargoHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_descargo, fecha_descargo,id_nc,id_analista_2 } = req.body;
    const documento_DIFI = req.files && req.files["documento_DIFI"] ? req.files["documento_DIFI"][0] : null;
    const errores = [];

    // Validaciones de `nro_descargo`
    if (!nro_descargo) errores.push('El campo nro_descargo es requerido');
    if (typeof nro_descargo !== 'string') errores.push('El nro_descargo debe ser una cadena de texto');

    // Validaciones de `fecha_descargo`
    if (!fecha_descargo) errores.push('El campo fecha_descargo es requerido');
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_descargo)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_descargo);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }
// Validaciones de `id_analista_2`
if (!id_analista_2) errores.push('El campo id_analista_2 es requerido');
if (!isValidUUID(id_analista_2)) errores.push('El id_analista_2 debe ser una UUID');
// Validaciones de `id_nc`
if (!id_nc) errores.push('El campo id_nc es requerido');
if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');
    // Validaciones de `documento_DIFI`
    if (documento_DIFI && documento_DIFI.mimetype !== 'application/pdf') {
        errores.push('El documento debe ser un archivo PDF');
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        if (documento_DIFI) {
            fs.unlinkSync(documento_DIFI.path); 
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const response = await updateDescargoAndAssociate({id, nro_descargo, fecha_descargo, documento_DIFI,id_nc,id_analista_2});

        if (!response) {
            return res.status(400).json({
                message: `Error al modificar el DescargoIFI con el id: ${id}`,
                data: []
            });
        }

        return res.status(200).json({
            message: 'DescargoIFI actualizado y asociado con IFI correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al actualizar DescargoIFI y asociarlo a IFI:', error);
        return res.status(500).json({
            message: 'Error al actualizar DescargoIFI y asociarlo a IFI',
            error: error.message
        });
    }
};

module.exports = {
    createDescargoHandler,
    updateDescargoHandler
};