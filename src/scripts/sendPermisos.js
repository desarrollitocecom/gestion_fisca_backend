require("dotenv").config();
const { Sequelize } = require("sequelize");


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


const Permiso = require("../api/v1/models/Permiso")(sequelize);


const permisos = [
  //ADMINISTRADOR
  "all_system_access",

  //GESTOR ACTAS
  "read_GestorActas", "create_GestorActas", "update_GestorActas",

  //INSPECTOR
  "read_Inspector", "create_Inspector", "update_Inspector",

  //DIGITADOR
  "read_Digitador", "create_Digitador", "update_Digitador",

  //AnalistaNC
  "read_AnalistaNC", "create_AnalistaNC", "update_AnalistaNC",

  //AreaInstructiva
  "read_AreaInstructiva", "create_AreaInstructiva", "update_AreaInstructiva",

  //AreaResolutiva1
  "read_AreaResolutiva1", "create_AreaResolutiva1", "update_AreaResolutiva1",

  //ANALISTAIFI
  "read_AnalistaIFI", "create_AnalistaIFI", "update_AnalistaIFI",

  //AreaResolutiva2
  "read_AreaResolutiva2", "create_AreaResolutiva2", "update_AreaResolutiva2",

  //ANALISTARSA
  "read_AnalistaRSA", "create_AnalistaRSA", "update_AnalistaRSA",

  //AreaResolutiva3
  "read_AreaResolutiva3", "create_AreaResolutiva3", "update_AreaResolutiva3",

  //ANALISTARSG
  "read_AnalistaRSG", "create_AnalistaRSG", "update_AnalistaRSG",

  //Gerencia
  "read_Gerencia", "create_Gerencia", "update_Gerencia",

  //ANALISTAActa
  "read_AnalistaActa", "create_AnalistaActa", "update_AnalistaActa",

]

const insertPermisos = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");

    await Permiso.sync({ alter: true });
    const permisosData = permisos.map((nombre) => ({
      nombre,
      descripcion: `Permiso para ${nombre.replace(/[-_]/g, " ")}`,
      state: true,
    }));

    await Permiso.bulkCreate(permisosData);
    console.log("Permisos insertados correctamente.");
  } catch (error) {
    console.error("Error al insertar permisos:", error.message);
  } finally {
    await sequelize.close();
    console.log("Conexión cerrada.");
  }
};

insertPermisos();
