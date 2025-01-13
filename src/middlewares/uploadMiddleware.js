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

const uploadDocumentsDigitador = upload.fields([
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
const uploadDRSA = upload.fields([
    { name: 'documento_DRSA', maxCount: 1 }
])
const uploadRSG = upload.fields([
    { name: 'documento_RSG', maxCount: 1 }
])
const uploadRSGNP = upload.fields([
    { name: 'documento_RSGNP', maxCount: 1 }
])
const uploadDRSGNP = upload.fields([
    { name: 'documento_DRSGNP', maxCount: 1 }
])
const uploadRG = upload.fields([
    { name: 'documento_rg', maxCount: 1 },
])

const uploadActa = upload.fields([
    { name: 'documento_acta', maxCount: 1 },
])

const uploadMC = upload.fields([
    { name: 'documento_ejecucion', maxCount: 1 },
])

const uploadResoSG = upload.fields([
    { name: 'documento_RSG', maxCount: 1 },
])

const uploadRecursoAdministrativo = upload.fields([
    { name: 'documento_Recurso', maxCount: 1}
])

const uploadCargo1 = upload.fields([
    { name: 'documento1', maxCount: 1}
])

const uploadCargo2 = upload.fields([
    { name: 'documento2', maxCount: 1}
])

module.exports = {
    uploadDocuments,
    uploadDocumentsDescargoNC,
    uploadIfi,
    uploadDIFI,
    uploadRSG1,
    uploadRSG2,
    uploadRSA,
    uploadDRSA,
    uploadRSG,
    uploadRSGNP,
    uploadDRSGNP,
    uploadRG,
    uploadNone,
    uploadDocumentsDigitador,
    uploadActa,
    uploadMC,
    uploadResoSG,
    uploadRecursoAdministrativo,
    uploadCargo1,
    uploadCargo2
};
