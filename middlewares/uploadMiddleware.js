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
const uploadIfi = upload.fields([
    { name: 'documento_ifi', maxCount: 1 },
])
const uploadDIFI = upload.fields([
    { name: 'documento_DIFI', maxCount: 1 }
])
const uploadRSG1 = upload.fields([
    { name: 'documento', maxCount: 1 }
])
const uploadRSG2 = upload.fields([
    { name: 'documento', maxCount: 1 }
])
const uploadNone = upload.none();

const uploadRSA = upload.fields([
    { name: 'documento_RSA', maxCount: 1 }

])
module.exports = {
    uploadDocuments,
    uploadDocumentsDescargoNC,
    uploadIfi,
    uploadDIFI,
    uploadRSG1,
    uploadRSG2,
    uploadRSA,
    uploadNone
};
