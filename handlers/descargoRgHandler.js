const {
    createDescargoRgController,
    updateDescargoRgController,
    getDescargoRgController,
    getAllDescargoRgController,
} = require('../controllers/descargoRgController');

// Crear un descargo
const createDescargoRgHandler = async (req, res) => {
    const{ nro_descargo, fecha_descargo, documento_descargo }=req.body
    try {
        const newDescargo = await createDescargoRgController({ nro_descargo, fecha_descargo, documento_descargo });
        if(!newDescargo){
            return  res.status(201).json({ message: "Descargo no fue creado ", data:[] });
        }
        return res.status(200).json({ message: "Descargo creado con éxito", data: newDescargo });
    } catch (error) {
        console.error("Error al crear el descargo:", error);
        return res.status(500).json({ message: "Error al crear el descargo", error: error.message });
    }
};

// Actualizar un descargo
const updateDescargoRgHandler = async (req, res) => {
    const { id } = req.params;
    const{ nro_descargo, fecha_descargo, documento_descargo }=req.body

    try {
        const updatedDescargo = await updateDescargoRgController({id, nro_descargo, fecha_descargo, documento_descargo });
        if (!updatedDescargo) {
            return res.status(201).json({ message: "Descargo no encontrado" });
        }
        return res.status(200).json({ message: "Descargo actualizado con éxito", data: updatedDescargo });
    } catch (error) {
        console.error("Error al actualizar el descargo:", error);
        return res.status(500).json({ message: "Error al actualizar el descargo", error: error.message });
    }
};

// Obtener un descargo por ID
const getDescargoRgHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const descargo = await getDescargoRgController(id);
        if (!descargo) {
            return res.status(201).json({ message: "Descargo no encontrado" });
        }
        return  res.status(200).json({ message: "Descargo encontrado",data: descargo });
    } catch (error) {
        console.error("Error al obtener el descargo:", error);
        return res.status(500).json({ message: "Error al obtener el descargo", data:error });
    }
};

// Obtener todos los descargos
const getAllDescargoRgHandler = async (req, res) => {
    try {
        const descargos = await getAllDescargoRgController();
        if(!descargos){
            return res.status(201).json({ message: "Descargos no encontrados",data: [] });
        }
        return res.status(200).json({ message: "Descargos encontrados",data: descargos });
    } catch (error) {
        console.error("Error al obtener los descargos:", error);
        return res.status(500).json({ message: "Error al obtener los descargos", data: error });
    }
};

module.exports = {
    createDescargoRgHandler,
    updateDescargoRgHandler,
    getDescargoRgHandler,
    getAllDescargoRgHandler
};
