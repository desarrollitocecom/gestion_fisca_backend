const {
    createDescargoAndAssociate,
    updateDescargoAndAssociate
} = require('../controllers/descargoInformeFinalController');
const fs = require('node:fs');
const createDescargoHandler = async (req, res) => {
    const { nro_descargo, fecha_descargo } = req.body;
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

    // Validaciones de `documento_DIFI`
    if (!documento_DIFI) {
        errores.push('El documento_DIFI es requerido');
    } else {
        if (documento_DIFI.mimetype !== 'application/pdf') {
            errores.push('El documento debe ser un archivo PDF');
        }
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
        const response = await createDescargoAndAssociate({nro_descargo, fecha_descargo, documento_DIFI});

        if (!response) {
            return res.status(400).json({
                message: 'Error al crear y asociar DescargoIFI',
                data: []
            });
        }
        return res.status(200).json({
            message: 'DescargoIFI creado y asociado a IFI correctamente',
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
    const { nro_descargo, fecha_descargo } = req.body;
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
        const response = await updateDescargoAndAssociate({id, nro_descargo, fecha_descargo, documento_DIFI});

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





















// const {
//     createDescargoAndAssociate,
//     updateDescargoAndAssociate
// } = require('../controllers/descargoInformeFinalController');

// const createDescargoHandler = async (req, res) => {
//     const { nro_descargo, fecha_descargo,  documento_DIFI } = req.body;
    
//     try {
        
//         const response = await createDescargoAndAssociate({nro_descargo, fecha_descargo,  documento_DIFI});
        
//         if (!response) {
//             return res.status(400).json({
//                 message: 'Error al crear y asociar DescargoIFI',
//                 data: []
//             });
//         }
//         return res.status(200).json({
//             message: 'DescargoIFI creado y asociado a IFI correctamente',
//             data: response
//         });
//     } catch (error) {
//         console.error('Error al crear y asociar DescargoIFI:', error);
//         return res.status(500).json({
//             message: 'Error al crear y asociar DescargoIFI',
//             error
//         });
//     }
// };



// const updateDescargoHandler = async (req, res) => {
//     const { id } = req.params;
//     const { nro_descargo, fecha_descargo, documento_DIFI} = req.body;
//     try {
//         const response = await updateDescargoAndAssociate(id, nro_descargo, fecha_descargo, documento_DIFI);
        
//         if (!response) {
//             return res.status(400).json({
//                 message: `Error al modificar el DescargoIFI con el id: ${id}`,
//                 data: []
//             });
//         }
//         return res.status(200).json({
//             message: 'DescargoIFI actualizado y asociado con IFI correctamente',
//             data: response
//         });
//     } catch (error) {
//         console.error('Error al actualizar DescargoIFI y asociarlo a IFI:', error);
//         return res.status(500).json({
//             message: 'Error al actualizar DescargoIFI y asociarlo a IFI',
//             data:error
//         });
//     }
// };

// module.exports = {
//     createDescargoHandler,
//     updateDescargoHandler
// };

