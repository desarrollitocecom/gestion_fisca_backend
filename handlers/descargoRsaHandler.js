const {
    createDescargoRsaController,
    updateDescargoRsaController
} = require('../controllers/descargoRsaController');

const createDescargoRsaHandler = async (req, res) => {
    const { nro_descargo, fecha_descargo } = req.body;
    const documento_DRSA = req.files && req.files["documento_DRSA"] ? req.files["documento_DRSA"][0] : null;

    const errores = [];

    // Validaciones de `nro_descargo`
    if (!nro_descargo) errores.push('El campo nro_descargo es requerido');
    if (typeof nro_descargo !== 'string') errores.push('El nro_descargo debe ser una cadena de texto');

    // Validaciones de `fecha_descargo`
    if (!fecha_descargo) errores.push('El campo fecha_descargo es requerido');
    // Verificar que la fecha tiene el formato 'YYYY-MM-DD'
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_descargo)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_descargo);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }

    // Validaciones de `documento_DRSA`
    if (!documento_DRSA) {
        errores.push('El documento_DRSA es requerido');
    } else {
        if (documento_DRSA.mimetype !== 'application/pdf') {
            errores.push('El documento debe ser un archivo PDF');
        }
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const response = await createDescargoRsaController({nro_descargo, fecha_descargo, documento_DRSA});

        if (!response) {
            return res.status(201).json({
                message: 'Error al crear y asociar DescargoRSA',
                data: []
            });
        }
        return res.status(200).json({
            message: 'DescargoRSA creado y asociado a RSA correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al crear DescargoRSA:', error);
        return res.status(500).json({
            message: 'Error al crear DescargoRSA',
            error: error.message
        });
    }
};

const updateDescargoRsaHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_descargo, fecha_descargo } = req.body;
    const documento_DRSA = req.files && req.files["documento_DRSA"] ? req.files["documento_DRSA"][0] : null;
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

    // Validaciones de `documento_RSA`
    if (documento_RSA && documento_RSA.mimetype !== 'application/pdf') {
        errores.push('El documento debe ser un archivo PDF');
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const response = await updateDescargoRsaController(id, nro_descargo, fecha_descargo, documento_DRSA);

        if (!response) {
            return res.status(400).json({
                message: `Error al modificar el DescargoRSA con el id: ${id}`,
                data: []
            });
        }

        return res.status(200).json({
            message: 'DescargoRSA actualizado y asociado con RSA correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al actualizar DescargoRSA:', error);
        return res.status(500).json({
            message: 'Error al actualizar DescargoRSA',
            error: error.message
        });
    }
};

module.exports = {
    createDescargoRsaHandler,
    updateDescargoRsaHandler
};

/*const {
    createDescargoRsaController,
    updateDescargoRsaController
} = require('../controllers/descargoRsaController');

const createDescargoRsaHandler = async (req, res) => {
    const { nro_descargo, fecha_descargo,  documento_DRSA } = req.body;
    
    try {
        
        const response = await createDescargoRsaController({nro_descargo, fecha_descargo,  documento_DRSA});
        
        if (!response) {
            return res.status(201).json({
                message: 'Error al crear y asociar DescargoRSA',
                data: []
            });
        }
        return res.status(200).json({
            message: 'DescargoRSA creado y asociado a RSA correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al crear DescargoRSA:', error);
        return res.status(500).json({
            message: 'Error al crear DescargoRSA'
        });
    }
};



const updateDescargoRsaHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_descargo, fecha_descargo, documento_RSA} = req.body;
    try {
        const response = await updateDescargoRsaController(id, nro_descargo, fecha_descargo, documento_RSA);
        
        if (!response) {
            return res.status(400).json({
                message: `Error al modificar el DescargoRSA con el id: ${id}`,
                data: []
            });
        }
        return res.status(200).json({
            message: 'DescargoRSAactualizado y asociado con RSAcorrectamente',
            data: response
        });
    } catch (error) {
        console.error('Error al actualizar DescargoRSA:', error);
        return res.status(500).json({
            message: 'Error al actualizar DescargoRSA',
            error
        });
    }
};

module.exports = {
   createDescargoRsaHandler,
   updateDescargoRsaHandler
};

*/