const {TramiteInspector} = require('../db_connection');
const fs = require('fs');
const path = require('path');

const createTramiteInspector = async ({nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional}) => {
        try {
            const base64DataNC = documento_nc.replace(/^data:image\/\w+;base64,/, '');
            const bufferNC = Buffer.from(base64DataNC, 'base64');
            const fileNameNC = `NC_${nro_nc}_${Date.now()}.pdf`; 
            const filePathNC = path.join(__dirname, '../uploads/NC', fileNameNC);
            fs.writeFileSync(filePathNC, bufferNC);
            documento_nc = fileNameNC;

            const base64DataAF = documento_acta.replace(/^data:image\/\w+;base64,/, '');
            const bufferAF = Buffer.from(base64DataAF, 'base64');
            const fileNameAF = `NC_${nro_nc}_${Date.now()}.pdf`; 
            const filePathAF = path.join(__dirname, '../uploads/NC', fileNameAF);
            fs.writeFileSync(filePathAF, bufferAF);
            documento_acta = fileNameAF;

            if(acta_opcional){
                const base64DataAF = documento_acta.replace(/^data:image\/\w+;base64,/, '');
                const bufferAF = Buffer.from(base64DataAF, 'base64');
                const fileNameAF = `NC_${nro_nc}_${Date.now()}.pdf`; 
                const filePathAF = path.join(__dirname, '../uploads/NC', fileNameAF);
                fs.writeFileSync(filePathAF, bufferAF);
                documento_acta = fileNameAF;
            }


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