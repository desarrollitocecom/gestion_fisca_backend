const {
    createInformeFinalController,
    updateInformeFinalController,
    getAllInformeFinalController,
    getInformeFinalController
} = require('../controllers/informeFinalController');
const {deleteFile}=require('../utils/fileUtils')
const fs = require('node:fs');
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
const createInformeFinalHandler = async (req, res) => {
    const { nro_ifi, fecha, tipo, id_evaluar, id_descargo_ifi } = req.body;
    const documento_ifi = req.files["documento_ifi"][0]
    const errores = []
    if (!nro_ifi) errores.push('El campo es requerido')
    if (typeof nro_ifi != 'string') errores.push('El nro debe ser una cadena de texto')
    if (!fecha) errores.push("El campo es requerido")
    if (!Date.parse(fecha)) errores.push("Debe ser una fecha y seguir el formato YYYY-MM-DD")
    if (!documento_ifi || documento_ifi.length === 0) {
        errores.push("El documento_ifi es requerido.");
    } else {
        if (documento_ifi.length > 1) {
            errores.push("Solo se permite un documento_ifi.");
        } else if (documento_ifi.mimetype !== "application/pdf") {
            errores.push("El documento debe ser un archivo PDF.");
        }
    }

   
    if (errores.length > 0) {
        if (documento_ifi) {
            fs.unlinkSync(documento_ifi.path); 
        }        
       return res.status(400).json({
        message: "Se encontraron los Siguientes Errores",
        data: errores
    })}
    try {

        const response = await createInformeFinalController({ nro_ifi, fecha, documento_ifi, tipo, id_evaluar, id_descargo_ifi });
        if (!response){
            
            return res.status(201).json({
                message: 'Error al crear nuevo informe Final ',
                data: []
            })}
        return res.status(200).json({ message: 'Nuevo Informe Final Creado', data: response })
    } catch (error) {
        console.error('Error al crear el Informe final:', error);
        return res.status(500).json({
            message: 'Error al crear el informe Final',
            error: error.message
        });
    }
};

const updateInformeFinalHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_ifi, fecha, tipo, id_evaluar, id_descargo_ifi } = req.body;
    const documento_ifi = req.files["documento_ifi"][0];
    const errores = [];

    // Validaciones de `nro_ifi`
    if (!nro_ifi) errores.push('El campo nro_ifi es requerido');
    if (typeof nro_ifi !== 'string') errores.push('El nro_ifi debe ser una cadena de texto');

    // Validaciones de `fecha`
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        // Verificar si la fecha es válida al crear un objeto Date
        const parsedFecha = new Date(fecha);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }

    // Validaciones de `documento_ifi`
    if (documento_ifi && documento_ifi.mimetype !== 'application/pdf') {
        errores.push('El documento debe ser un archivo PDF.');
    }

    // Validaciones adicionales
    if (tipo && typeof tipo !== 'string') errores.push('El tipo debe ser una cadena de texto');
    if (id_evaluar && !isValidUUID(id_evaluar)) errores.push('El id_evaluar debe ser un uuid');
    if (id_descargo_ifi && !isValidUUID(id_descargo_ifi)) errores.push('El id_descargo_ifi debe ser un uuid');
    if (errores.length > 0) {
       return res.status(400).json({
            message: "Se encontraron los Siguientes Errores",
            data: errores
        })
    }
    try {
      
        const response = await updateInformeFinalController({ id, nro_ifi, fecha, documento_ifi, tipo, id_evaluar, id_descargo_ifi });
        if (!response){
             //deleteFile(documento_ifi);
            return res.status(201).json({
            message: `Error al Modificar el IFI `,
            data: []
        })}
        res.status(200).json({ message: 'Nuevo Informe Final Modificado', data: response })
    } catch (error) {
        console.error('Error al modificar el Informe final:', error);
        return res.status(500).json({ message: 'Error al moficar el informe Final', error });
    }
}
const getAllInformesFinalesHandler = async (req, res) => {
    try {
        const response = await getAllInformeFinalController();

        if (!response)
            return res.status(201).json({ message: 'No se pudo traer todos IFIs', data: [] })
        return res.status(200).json({
            message: "Estos son los IFIs",
            data: response
        });

    } catch (error) {
        console.error('Error al Traer los IFIs :', error);
        return res.status(500).json({ message: 'Error al Traer los IFIs', error });
    }
};
const getInformeFinalHandler = async (req, res) => {
    const { id } = req.params;
    if(!isValidUUID(id)){
        res.status(404).json(
            "El id debe ser un uuid"
        )
    }
    try {
        const response = await getInformeFinalController(id);
        if (!response) res.status(201).json({ message: 'No se pudo traer IFI', data: [] })
        return res.status(200).json({ message: '  IFI', data: response });
    } catch (error) {
        console.error('Error al Traer el IFI :', error);
        return res.status(500).json({ message: 'Error al Traer el IFI', error });
    }
}
module.exports = {
    createInformeFinalHandler,
    updateInformeFinalHandler,
    getAllInformesFinalesHandler,
    getInformeFinalHandler
}
