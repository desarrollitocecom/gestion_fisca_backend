require('dotenv').config();
const { Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const argon2 = require("argon2");

const { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

// Conexión a la base de datos
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
});

// Importar modelos
const TipoDocumentoComplementario = require("../models/TipoDocumentoComplementario")(sequelize);
const Infraccion = require("../models/Infraccion")(sequelize);
const EstadoMC = require("../models/EstadoMC")(sequelize);
const EstadoNC = require("../models/EstadoNC")(sequelize);
const EstadoIFI = require("../models/EstadoIFI")(sequelize);
const EstadoRSGNP = require("../models/EstadoRSGNP")(sequelize);
const EstadoRSA = require("../models/EstadoRSA")(sequelize);
const EjecucionMC = require("../models/EjecucionMC")(sequelize);
const TipoDocumentoIdentidad = require("../models/TipoDocumentoIdentidad")(sequelize);
const EstadoDescargoNC = require("../models/EstadoDescargoNC")(sequelize);
const EstadoRG = require("../models/EstadoRG")(sequelize);

const insertData = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");

    // Sincronizar modelos
    //await sequelize.sync({ force: true }); // CUIDADO: Elimina y vuelve a crear tablas

    // Insertar datos ficticios en TipoDocumentoComplementario
    await TipoDocumentoComplementario.bulkCreate([
      { documento: "Licencia de Funcionamiento" },
      { documento: "Certificado de Defensa Civil" },
      { documento: "Permiso Municipal" },
    ]);

    // Insertar datos ficticios en Infraccion
    await Infraccion.bulkCreate([
      {
        actividad_economica: "Comercio",
        codigo: "C01",
        descripcion: "Venta sin autorización",
        tipo: "Grave",
        monto: 500,
        lugar_infraccion: "Mercado Central",
      },
      {
        actividad_economica: "Transporte",
        codigo: "T02",
        descripcion: "Falta de seguro vehicular",
        tipo: "Moderada",
        monto: 300,
        lugar_infraccion: "Avenida Principal",
      },
      {
        actividad_economica: "Construcción",
        codigo: "B03",
        descripcion: "Construcción sin licencia",
        tipo: "Grave",
        monto: 1000,
        lugar_infraccion: "Zona Industrial",
      },
    ]);

    // Insertar datos ficticios en EstadoMC
    await EstadoMC.bulkCreate([
      { nombre: "Pendiente" },
      { nombre: "En Proceso" },
      { nombre: "Finalizado" },
    ]);

    // Insertar datos ficticios en EstadoNC
    await EstadoNC.bulkCreate([
      { tipo: "Observado" },
      { tipo: "Validado" },
      { tipo: "Rechazado" },
      { tipo: "Terminado" },
    ]);
    await EstadoIFI.bulkCreate([
      { nombre: "Pendiente" },
      { nombre: "En Proceso" },
      { nombre: "Finalizado" },
    ]);
    await EstadoRSA.bulkCreate([
      { nombre: "Pendiente" },
      { nombre: "En Proceso" },
      { nombre: "Finalizado" },
      { nombre: "Archivado" },
    ]);
    await EstadoRSGNP.bulkCreate([
      { nombre: "Pendiente" },
      { nombre: "En Proceso" },
      { nombre: "Finalizado" },
      { nombre: "Archivado" },
    ]);
    await EstadoRG.bulkCreate([
      { tipo: "No Procedente" },
      { tipo: "Archivado" },
    ]);

    // Insertar datos ficticios en EjecucionMC
    await EjecucionMC.bulkCreate([
      { nombre: "Ejecución Inicial" },
      { nombre: "Ejecución Intermedia" },
      { nombre: "Ejecución Final" },
    ]);

    // Insertar datos ficticios en EstadoDescargoNC
    await EstadoDescargoNC.bulkCreate([
      { tipo: "CON DESCARGO" },
      { tipo: "SIN DESCARGO" },
      { tipo: "ANULADO" },
    ]);


    // Insertar datos ficticios en TipoDocumentoIdentidad
    await TipoDocumentoIdentidad.bulkCreate([
      { documento: "DNI" },
      { documento: "Pasaporte" },
      { documento: "Carnet de Extranjería" },
    ]);


    console.log("Datos insertados correctamente.");
  } catch (error) {
    console.error("Error al insertar datos ficticios:", error.message);
  } finally {
    await sequelize.close();
    console.log("Conexión cerrada.");
  }
};

insertData();