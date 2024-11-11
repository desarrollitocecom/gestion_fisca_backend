const {TramiteInspector} = require('../db_connection');
const fs = require('fs');
const path = require('path');

const createTramiteInspector = async ({nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional}) => {
        try {
            console.log('a');
            const base64Data = documento_nc.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            console.log('b');     
            const fileName = `NC_${nro_nc}_${Date.now()}.pdf`; 
            console.log('c'); 
            const filePath = path.join(__dirname, '../uploads/NC', fileName);
            console.log('d');
            fs.writeFileSync(filePath, buffer);

            documento_nc = fileName;

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