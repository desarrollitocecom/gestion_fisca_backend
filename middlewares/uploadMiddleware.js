const multer = require('multer');
const path = require('path');

const uploadDir = path.resolve(__dirname, '../uploads');
const upload = multer({ dest: uploadDir });

const uploadDocuments = upload.fields([
    { name: 'documento_nc', maxCount: 1 }, 
    { name: 'documento_acta', maxCount: 1 }, 
    { name: 'documento_medida_complementaria', maxCount: 1 }, 
]);

const uploadDocumentsDescargoNC = upload.fields([
    { name: 'documento', maxCount: 1 }, 
]);

module.exports = { uploadDocuments, uploadDocumentsDescargoNC };
