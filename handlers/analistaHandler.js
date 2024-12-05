const { createDescargoNC } = require('../controllers/ncDescargoController');
const { updateNC, getNC } = require('../controllers/ncController');
const fs = require('fs');

const createDescargoNCHandler = async (req, res) => {
    const id = req.params.id;

    const { 
            nro_descargo,
            id_estado,
            fecha_descargo,
            id_analista1
        } = req.body;

    const errors = [];

    if (!nro_descargo) {
        errors.push('Ingrese nro_descargo obligatorio');
    }

    if (!id_estado) {
        errors.push('Ingrese id_estado obligatorio');
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
            id_estado,
            fecha_descargo,
            documento: req.files['documento'][0],
            id_analista1
        });
        
        if (!newDescargoNC) {
            return res.status(400).json({ error: 'Error al crear el Descargo NC' });
        }

        const id_descargo_NC = newDescargoNC.id;

        const response = await updateNC(id, { 
            id_descargo_NC,
            id_estado_NC: 3
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


module.exports = { createDescargoNCHandler };
