require('dotenv').config();
const { Sequelize } = require("sequelize");


const { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;


// Conexión a la base de datos
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
});


const Permiso = require("../models/Permiso")(sequelize);


const permisos = [
  "create_Analista5",
"create_Analista1",
"create_Analista2",
"create_Analista3",
"create_Analista4",
"read_Digitador",
"update_Digitador",
"update_Analista1",
"read_documentos",
"read_ejecucionmc",
"create_ejecucionmc",
"update_ejecucionmc",
"delete_ejecucionmc",
"read_estdescargonc",
"create_estdescargonc",
"delete_estdescargonc",
"update_estdescargonc",
"read_estdescargoifi",
"create_estdescargoifi",
"delete_estdescargoifi",
"update_estdescargoifi",
"read_estadomc",
"create_estadomc",
"delete_estadomc",
"update_estadomc",
"read_estdescargorsa",
"create_estdescargorsa",
"delete_estdescargorsa",
"update_estdescargorsa",
"read_estdescargorsgnp",
"create_estdescargorsgnp",
"delete_estdescargorsgnp",
"update_estdescargorsgnp",
"create_AInstructiva",
"read_AResolutiva1",
"read_AResolutiva2",
"read_mc",
"create_mc",
"delete_mc",
"update_mc",
"create_Gerente",
"create_permiso",
"create_rol",
"read_permiso",
"read_rol",
"update_permiso",
"update_rol",
"delete_permiso",
"delete_rol",
"read_AResolutiva3",
"read_Gerente",
"read_dc",
"create_dc",
"delete_dc",
"update_dc",
"read_di",
"create_di",
"delete_di",
"update_di",
"read_usuarios",
"delete_usuarios",
"all_system_access"


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
