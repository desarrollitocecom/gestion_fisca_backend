const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// Variables de entorno
const { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

// Configura la conexión a la base de datos
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false, // Desactiva los logs de Sequelize
});

const db = {};

// Ajusta la ruta para que apunte correctamente a los modelos
const modelsPath = path.join(__dirname, '../api/v1/models');

fs.readdirSync(modelsPath)
  .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js') // Filtra solo archivos .js
  .forEach((file) => {
    const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes); // Ajusta la ruta aquí
    db[model.name] = model;
    console.log(`Modelo ${file} cargado`);
  });

// Configurar asociaciones si los modelos tienen asociaciones
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    console.log("asociando: ", modelName);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
