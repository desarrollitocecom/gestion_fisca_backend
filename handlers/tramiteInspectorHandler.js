const { createTramiteInspector } = require('../controllers/tramiteInspectorController');

const createTramiteHandler = async(req, res) => {
    
    
    
    const { nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional  } = req.body; 
    const errors = []; 

    if(!nro_nc){ 
        errors.push('ingrese nro_nc obligatorio'); 
    }
    if(!documento_nc){ 
        errors.push('ingrese documento_nc obligatorio'); 
    }
    if(!nro_acta){ 
        errors.push('ingrese nro_acta obligatorio'); 
    }
    if(!documento_acta){ 
        errors.push('ingrese documento_acta obligatorio'); 
    }
    if(!nro_opcional){ 
        errors.push('ingrese nro_opcional obligatorio'); 
    }
    if(!acta_opcional){ 
        errors.push('ingrese acta_opcional obligatorio'); 
    }

    if(errors.length > 0){ 
        return res.status(400).json({error: errors.join(", ")}); 
    }

    try {
        
        const newTramiteInspector = await createTramiteInspector( {nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional} );
        if(newTramiteInspector){ 
            res.status(201).json({ 
                message: 'se creo', 
                data: newTramiteInspector, 
            })
        }else{
            res.status(400).json({ 
                message: 'error al crear',
                data: newTramiteInspector,
            })
        }

    } catch (error) {
        console.error('error al crear', error);
        return res.status(500).json({message: 'error al crear usuario'}); 
    }
}

module.exports = { createTramiteHandler }; 