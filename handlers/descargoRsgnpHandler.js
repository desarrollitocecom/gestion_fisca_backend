const {
    createDescargoRSGNPController,
    updateDescargoRSGNPController
} = require('../controllers/descargoRsgnpController');
const fs = require('node:fs');

// Crear un descargo
const createDescargoRSGNPHandler = async (req, res) => {
    const { nro_descargo, fecha_descargo,id_nc } = req.body;
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
        const newDescargo = await createDescargoRSGNPController({ nro_descargo, fecha_descargo, documento,id_nc });
        if (!newDescargo) {
            return res.status(400).json({ message: "Descargo no fue creado", data: [] });
        }
        return res.status(201).json({ message: "Descargo creado con éxito", data: newDescargo });
    } catch (error) {
        console.error("Error al crear el descargo:", error);
        return res.status(500).json({ message: "Error al crear el descargo", error: error.message });
    }
};

// Actualizar un descargo
const updateDescargoRSGNPHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_descargo, fecha_descargo,id_nc} = req.body;
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
        const updatedDescargo = await updateDescargoRSGNPController({ id, nro_descargo, fecha_descargo, documento,id_nc});
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
