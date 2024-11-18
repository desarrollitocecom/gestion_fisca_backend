const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function saveImage(file, folder) {
    const uploadDir = path.resolve(__dirname, `../uploads/${folder}`);
    const uniqueFileName = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const newPath = path.join(uploadDir, `${uniqueFileName}${fileExtension}`);

    fs.renameSync(file.path, newPath);

    const relativePath = path.relative(path.resolve(__dirname, '../'), newPath).replace(/\\/g, '/');
    return relativePath.replace(/^.\//, '');
}

module.exports = { saveImage };
