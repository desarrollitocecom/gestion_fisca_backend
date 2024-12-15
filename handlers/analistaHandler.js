const { createDescargoNC } = require('../controllers/ncDescargoController');
const { updateNC, getNC, getAllNCforAnalista } = require('../controllers/ncController');
const {updateDocumento}=require('../controllers/documentoController');
const fs = require('fs');

const createDescargoNCHandler = async (req, res) => {
    const id = req.params.id;

    const { 
            nro_descargo,
            fecha_descargo,
            id_analista1
        } = req.body;

    const errors = [];

    if (!nro_descargo) {
        errors.push('Ingrese nro_descargo obligatorio');
    }

    if (!fecha_descargo) {
        errors.push('Ingrese fecha_descargo obligatorio');
    }

    if(!req.files['documento']){
        errors.push('El documento es obligatorio');
    }else{
       
        if(req.files['documento'][0].mimetype != 'application/pdf'){
            errors.push('El documento debe ser formato PDF');
        }
    }

    if (!id_analista1) {
        errors.push('Ingrese id_analista1 obligatorio');
    }

    if (errors.length > 0) {
        if (req.files['documento']) {
            fs.unlinkSync(req.files['documento'][0].path); 
        }
        return res.status(400).json({ error: errors.join(", ") });
    }

    try {

        const existingNC = await getNC(id); 

        if (!existingNC) {
            return res.status(404).json({ message: "NC no encontrada para actualizar" });
        }

        const newDescargoNC = await createDescargoNC({ 
            nro_descargo,
            fecha_descargo,
            documento: req.files['documento'][0],
            id_estado: 1,
            id_analista1
        });
        
        if (!newDescargoNC) {
            return res.status(400).json({ error: 'Error al crear el Descargo NC' });
        }
        const id_nc=existingNC.id;
        const total_documentos=newDescargoNC.documento;
        const nuevoModulo='DESCARGO - NOTIFICACION DE CARGO';

        
        
     await updateDocumento({id_nc, total_documentos, nuevoModulo});

        const id_descargo_NC = newDescargoNC.id;

        const response = await updateNC(id, { 
            id_descargo_NC,
            estado: 'A_I'
        });

       
         
         
        if (response) {
          res.status(201).json({
                message: 'Descargo NC creado con exito',
                data: response,
            });
        } else {
           res.status(400).json({
                message: 'Error al crear Descargo NC',
            });
        }


    } catch (error) {
        console.error('Error al crear el NC:', error);
        return res.status(500).json({ message: 'Error interno del servidor al crear el Descargo NC' });
    }
};

const getAllNCforAnalistaHandler = async (req, res) => {  
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
        const response = await getAllNCforAnalista(Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más tramites',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Tramites obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener tipos de documentos de identidad:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los tramites." });
    }
};

const sendWithoutDescargoHandler = async (req, res) => {
    const id = req.params.id;

    const { 
        id_analista1
    } = req.body;

    try {

        const existingNC = await getNC(id); 

        if (!existingNC) {
            return res.status(404).json({ message: "NC no encontrada para actualizar" });
        }

        const newDescargoNC = await createDescargoNC({ 
            id_analista1,
            id_estado : 2
        });
        
        if (!newDescargoNC) {
            return res.status(400).json({ error: 'Error al crear el Descargo NC' });
        }
        const id_nc=existingNC.id;
        const total_documentos = '';
        const nuevoModulo='SIN DESCARGO NC';

        
        
     await updateDocumento({id_nc, total_documentos, nuevoModulo});

        const id_descargo_NC = newDescargoNC.id;

        const response = await updateNC(id, { 
            id_descargo_NC,
            estado: 'A_I'
        });

       
         
         
        if (response) {
          res.status(201).json({
                message: 'Descargo NC creado con exito',
                data: response,
            });
        } else {
           res.status(400).json({
                message: 'Error al crear Descargo NC',
            });
        }


    } catch (error) {
        console.error('Error al crear el NC:', error);
        return res.status(500).json({ message: 'Error interno del servidor al crear el Descargo NC' });
    }
}

module.exports = { createDescargoNCHandler, getAllNCforAnalistaHandler, sendWithoutDescargoHandler };
