// const {
//     createDescargoRgController,
//     updateDescargoRgController,
    
// } = require('../controllers/descargoRgController');

// // Crear un descargo
// const createDescargoRgHandler = async (req, res) => {
//     const{ nro_descargo, fecha_descargo, documento_descargo }=req.body
//     try {
//         const newDescargo = await createDescargoRgController({ nro_descargo, fecha_descargo, documento_descargo });
//         if(!newDescargo){
//             return  res.status(201).json({ message: "Descargo no fue creado ", data:[] });
//         }
//         return res.status(200).json({ message: "Descargo creado con éxito", data: newDescargo });
//     } catch (error) {
//         console.error("Error al crear el descargo:", error);
//         return res.status(500).json({ message: "Error al crear el descargo", error: error.message });
//     }
// };

// // Actualizar un descargo
// const updateDescargoRgHandler = async (req, res) => {
//     const { id } = req.params;
//     const{ nro_descargo, fecha_descargo, documento_descargo }=req.body

//     try {
//         const updatedDescargo = await updateDescargoRgController({id, nro_descargo, fecha_descargo, documento_descargo });
//         if (!updatedDescargo) {
//             return res.status(201).json({ message: "Descargo no encontrado" });
//         }
//         return res.status(200).json({ message: "Descargo actualizado con éxito", data: updatedDescargo });
//     } catch (error) {
//         console.error("Error al actualizar el descargo:", error);
//         return res.status(500).json({ message: "Error al actualizar el descargo", error: error.message });
//     }
// };

const {
    createDescargoRgController,
    updateDescargoRgController
} = require('../controllers/descargoRgController');

// Crear un descargo
const createDescargoRgHandler = async (req, res) => {
    const { nro_descargo, fecha_descargo } = req.body;
    const errores = [];
    const documento_descargo =req.files["documento_descargo"][0];

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
    if (!documento_descargo) errores.push('El campo documento_descargo es requerido');
    if (documento_descargo && documento_descargo.mimetype !== 'application/pdf') {
        errores.push('El documento_descargo debe ser un archivo PDF');
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const newDescargo = await createDescargoRgController({ nro_descargo, fecha_descargo, documento_descargo });
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
const updateDescargoRgHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_descargo, fecha_descargo} = req.body;
    const errores = [];
    const documento_descargo =req.files["documento_descargo"][0];
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
    if (documento_descargo && documento_descargo.mimetype !== 'application/pdf') {
        errores.push('El documento_descargo debe ser un archivo PDF');
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const updatedDescargo = await updateDescargoRgController({ id, nro_descargo, fecha_descargo, documento_descargo });
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
    createDescargoRgHandler,
    updateDescargoRgHandler,
};
