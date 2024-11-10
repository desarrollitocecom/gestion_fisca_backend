const {TramiteInspector} = require('../db_connection')

const createTramiteInspector = async ({nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional}) => {
        try {

            
            const base64Data = documento_nc.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Definir la ruta para guardar la imagen
            
            
            const fileName = `NC_${nro_nc}_${Date.now()}.pdf`; // Incluye nro_nc en el nombre del archivo
            const filePath = path.join(__dirname, '../uploads/NC', fileName);
            console.log('asdasd00');
            // Guardar el archivo en la carpeta 'uploads/NC'
            fs.writeFileSync(filePath, buffer);

            // Actualizar `documento_nc` para almacenar la ruta o nombre del archivo en la base de datos
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