const { TramiteInspector, NC } = require('../db_connection');
const fs = require('fs');
const path = require('path');


// Función para guardar archivos PDF desde base64 en una carpeta específica
const saveBase64ToFile = (base64Data, prefix, nro, folder) => {
    const nroFormatted = nro.replace(/\s+/g, '_');
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');
    const fileName = `${prefix}_${nroFormatted}_${Date.now()}.pdf`;
    const filePath = path.posix.join('uploads', folder, fileName); // Ruta con `/` incluso en Windows
    const fullFilePath = path.join(__dirname, '../', filePath); // Ruta absoluta

    fs.writeFileSync(fullFilePath, buffer);
    return filePath;
};

const createTramiteInspector = async ({ nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional, id_inspector }) => {
    try {
        // Guardar los archivos base64 y obtener las rutas
        documento_nc = saveBase64ToFile(documento_nc, 'NC', nro_nc, 'NC');
        documento_acta = saveBase64ToFile(documento_acta, 'AF', nro_nc, 'AF');

        // Si existe el acta opcional, también guardarla
        if (acta_opcional) {
            acta_opcional = saveBase64ToFile(acta_opcional, 'ActaOpcional', nro_nc, 'Opcional');
        }

        // Crear el trámite en la tabla TramiteInspector
        const newTramiteNC = await TramiteInspector.create({
            nro_nc,
            documento_nc, 
            nro_acta,
            documento_acta,
            nro_opcional,
            acta_opcional,
            id_inspector
        });

        // Usar el id generado del trámite para crear el registro en NC
        const newNC = await NC.create({
            id_tramiteInspector: newTramiteNC.id // Usar el id del trámite creado
        });

        console.log('Trámite creado con éxito');
        return newTramiteNC || null;

    } catch (error) {
        console.error('Error creando trámite:', error);
        return false;
    }
};



const getAllTramiteInspector = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await TramiteInspector.findAndCountAll({
            limit,
            offset,
            order: [['id', 'DESC']]
        });

        // Codifica en Base64 los documentos desde el controlador
        const dataWithBase64 = response.rows.map(tramite => {
            const documentosBase64 = {};

            const columnasConDocumentos = ['documento_nc', 'documento_acta', 'acta_opcional'];

            columnasConDocumentos.forEach(columna => {
                if (tramite[columna]) {
                    try {
                        const filePath = path.join(__dirname, '../', tramite[columna]);
                        if (fs.existsSync(filePath)) {
                            const fileBuffer = fs.readFileSync(filePath);
                            documentosBase64[columna] = fileBuffer.toString('base64');
                        } else {
                            documentosBase64[columna] = null;
                        }
                    } catch (error) {
                        console.error(`Error al leer el archivo ${tramite[columna]}:`, error);
                        documentosBase64[columna] = null;
                    }
                }
            });

            return {
                ...tramite.dataValues,
                ...documentosBase64 
            };
        });

        return { totalCount: response.count, data: dataWithBase64, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tramites", data: error });
        return false;
    }
};



module.exports = { createTramiteInspector, getAllTramiteInspector };
