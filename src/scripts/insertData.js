require('dotenv').config();
const { Sequelize } = require("sequelize");
const argon2 = require("argon2");

const { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

// Conexión a la base de datos
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  // dialectOptions: {
  //   ssl: {
  //     require: true, // Requiere SSL para la conexión
  //     rejectUnauthorized: false // Permite conexiones con certificados no confiables (opcional, dependiendo del entorno)
  //   }
  // }
});

// Importar modelos
const TipoDocumentoComplementario = require("../api/v1/models/TipoDocumentoComplementario")(sequelize);
//const Infraccion = require("../api/v1/models/Infraccion")(sequelize);

const EjecucionMC = require("../api/v1/models/EjecucionMC")(sequelize);
const TipoDocumentoIdentidad = require("../api/v1/models/TipoDocumentoIdentidad")(sequelize);

const Ordenanza = require("../api/v1/models/Ordenanza")(sequelize);
const Usuario = require("../api/v1/models/Usuario")(sequelize);

const insertData = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");

    await Usuario.bulkCreate([
      {
        usuario: "James",
        contraseña: await argon2.hash("james123"),
        correo: "james@hotmail.com",
        id_rol: "1",
        dni: "12345601",
      },
      {
        usuario: "Emmanuel",
        contraseña: await argon2.hash("emmanuel123"),
        correo: "emmanuel@hotmail.com",
        id_rol: "1",
        dni: "12345602",
      },
      {
        usuario: "Emmanuel2",
        contraseña: await argon2.hash("emmanuel123"),
        correo: "emmanuel2@hotmail.com",
        id_rol: "1",
        dni: "12345603",
      },
      {
        usuario: "Marco",
        contraseña: await argon2.hash("marco123"),
        correo: "marco@hotmail.com",
        id_rol: "1",
        dni: "12345604",
      },
      {
        usuario: "JamesFisca",
        correo: "jamesFisca@hotmail.com",
        id_rol: "3",
        dni: "71261019",
      },
    ]);

    // Insertar datos ficticios en TipoDocumentoComplementario
    await TipoDocumentoComplementario.bulkCreate([
      { documento: "SIN MEDIDA COMPLEMENTARIA" },
      { documento: "ACTA DE EJECUCIÓN DE MEDIDA PROVICIONAL" },
      { documento: "VALORIZACIÓN DE LA OBRA" },
      { documento: "ACTA DE RETENCIÓN Y/O DECOMISO" },
      { documento: "ACTA DE EVALUACIÓN SANITARIA" },
      { documento: "INFORME TÉCNICO" },
    ]);

    // Insertar datos ficticios en Infraccion
    // await Infraccion.bulkCreate([
    //   {
    //     actividad_economica: "Comercio",
    //     codigo: "C01",
    //     descripcion: "Venta sin autorización",
    //     tipo: "Grave",
    //     monto: 500,
    //     lugar_infraccion: "Mercado Central",
    //   },
    //   {
    //     actividad_economica: "Transporte",
    //     codigo: "T02",
    //     descripcion: "Falta de seguro vehicular",
    //     tipo: "Moderada",
    //     monto: 300,
    //     lugar_infraccion: "Avenida Principal",
    //   },
    //   {
    //     actividad_economica: "Construcción",
    //     codigo: "B03",
    //     descripcion: "Construcción sin licencia",
    //     tipo: "Grave",
    //     monto: 1000,
    //     lugar_infraccion: "Zona Industrial",
    //   },
    // ]);




    // Insertar datos ficticios en EjecucionMC
    await EjecucionMC.bulkCreate([
      { nombre: "Ejecución Inicial" },
      { nombre: "Ejecución Intermedia" },
      { nombre: "Ejecución Final" },
    ]);

    // Insertar datos ficticios en EstadoDescargoNC


    await Ordenanza.bulkCreate([
      { nombre: "2025" }
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