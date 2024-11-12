const { TramiteInspector } = require('../db_connection');
const fs = require('fs');
const path = require('path');

// Función para guardar archivos PDF desde base64 en una carpeta específica
const saveBase64ToFile = (base64Data, prefix, nro, folder) => {
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');
    const fileName = `${prefix}_${nro}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, `../uploads/${folder}`, fileName);
    fs.writeFileSync(filePath, buffer);
    return fileName;
};

const createTramiteInspector = async ({ nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional, id_inspector }) => {
    try {
        documento_nc = saveBase64ToFile(documento_nc, 'NC', nro_nc, 'NC');

        documento_acta = saveBase64ToFile(documento_acta, 'Acta', nro_nc, 'AF');

        if (acta_opcional) {
            acta_opcional = saveBase64ToFile(acta_opcional, 'ActaOpcional', nro_nc, 'Opcional');
        }

        const newTramiteNC = await TramiteInspector.create({
            nro_nc,
            documento_nc,
            nro_acta,
            documento_acta,
            nro_opcional,
            acta_opcional,
        });

        console.log('Trámite creado con éxito');
        return newTramiteNC || null;

    } catch (error) {
        console.error('Error creando trámite:', error);
        return false;
    }
};

module.exports = { createTramiteInspector };
