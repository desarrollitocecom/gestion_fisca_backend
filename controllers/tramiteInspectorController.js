const {TramiteInspector} = require('../db_connection')

const createTramiteInspector = async ({nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional}) => {
        try {
            const newTramiteNC = await TramiteInspector.create(
                {
                    nro_nc,
                    documento_nc,
                    nro_acta,
                    documento_acta,
                    nro_opcional,
                    acta_opcional
                }
            ); 
            console.log('fin');
            return newTramiteNC || null;

        } catch (error) {
            console.log('error creando usuario');
            return false;
        }
}

module.exports = { createTramiteInspector }