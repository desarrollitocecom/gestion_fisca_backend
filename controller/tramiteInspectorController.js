const tramiteInspector = require('../models/TramiteInspector')

const createTramiteInspector = async (nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional) => {
    
    if(nro_nc && documento_nc && nro_acta && documento_acta && nro_opcional && acta_opcional){
        
        try {
            const newTramiteNC = await tramiteInspector.create({nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional}); 
            
            return newTramiteNC || null;
        } catch (error) {
            console.log('error creando usuario');
            return false;
        }
    }else{
        return false;
    }
}

module.exports = { createTramiteInspector }