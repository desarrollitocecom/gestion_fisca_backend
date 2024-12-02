const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("gestion_fiscalizacion", "postgres", "12345678", {
  host: "localhost",
  dialect: "postgres",
});


const Permiso = require("../models/Permiso")(sequelize);


const permisos = [
    "create_descargo_nc",
    "create_descargo_ifi",
    "update_descargo_nc",
    "create_descargo_rsa",
    "update_descargo_rsa",
    "create_descargo_rsgnp",
    "update_descargo_rsgnp",
    "read_nc",
    "update_nc",
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
    "create_ifi",
    "read_ifi",
    "update_ifi",
    "read_mc",
    "create_mc",
    "delete_mc",
    "update_mc",
    "read_rg",
    "create_rg",
    "update_rg",
    "create_permiso",
    "create_rol",
    "read_permiso",
    "read_rol",
    "update_permiso",
    "update_rol",
    "delete_permiso",
    "delete_rol",
    "read_rsa",
    "create_rsa",
    "update_rsa",
    "create_rsg1",
    "update_rsg1",
    "create_rsg2",
    "update_rsg2",
    "create_rsgp",
    "update_rsgp",
    "create_rsgnp",
    "update_rsgnp",
    "read_dc",
    "create_dc",
    "delete_dc",
    "update_dc",
    "read_di",
    "create_di",
    "delete_di",
    "update_di",
    "create_tramite",
    "read_tramite",
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
