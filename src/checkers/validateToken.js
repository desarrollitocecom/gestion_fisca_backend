const jwt = require("jsonwebtoken");
const { getToken } = require("../api/v1/controllers/usuarioController");

const excludedPaths = [
    { path: "/logininspector/registro", method: "POST" }, // Ruta para autenticación inicial
  ];

const loginMiddleware = async (req, res, next) => {

    const isExcluded = excludedPaths.some(
        (route) => route.path === req.path && route.method === req.method
      );
    
      if (isExcluded) {
        return next(); // Saltar el middleware si la ruta es pública
      }
    const token = req.headers.authorization?.split("___")[1]; // Obtener el token del header

    if (!token) {
        return res.status(401).json({ message: "No se detecto sesion de usuario", request: token });
    }
   
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar si el token es válido
        const dbToken = await getToken(decoded.usuario);
        if (dbToken.dataValues.token !== token) {
            return res.status(401).json({ message: "Sesión inválida o expiró debido a un inicio en otro dispositivo" });
        }

        req.user = token; // Almacena la información del usuario en req para el próximo middleware
        next();
    } catch (error) {
        console.error("Error en loginMiddleware:", error.message);
        return res.status(401).json({ message: "Token inválido o expirado", data: error.message });
    }
};

module.exports = loginMiddleware;
