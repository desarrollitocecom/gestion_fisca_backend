const {
    getEstadoDescargoNCById,
    getAllEstadoDescargoNC,
    createEstadoDescargoNC,
    deleteEstadoDescargoNC,
    updateEstadoDescargoNC,
  } = require('../controllers/EstadoDescargoNCController');
  
  // Handler para obtener un Estado por ID
  const getEstadoDescargoNCByIdHandler = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: 'El ID es requerido.' });
    }
  
    try {
      const estado = await getEstadoDescargoNCById(id);
      if (!estado) {
        return res.status(404).json({ message: 'Estado no encontrado.' });
      }
      return res.status(200).json({ data: estado });
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener el estado.', details: error.message });
    }
  };
  
  // Handler para obtener todos los Estados
  const getAllEstadoDescargoNCHandler = async (req, res) => {
    try {
      const estados = await getAllEstadoDescargoNC();
      if (estados.length === 0) {
        return res.status(404).json({ message: 'No se encontraron estados.' });
      }
      return res.status(200).json({ data: estados });
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener los estados.', details: error.message });
    }
  };
  
  // Handler para crear un nuevo Estado
  const createEstadoDescargoNCHandler = async (req, res) => {
    const { tipo } = req.body;
    const errores = [];
  
    if (!tipo) errores.push('El campo "tipo" es requerido.');
    if (typeof tipo !== 'string') errores.push('El "tipo" debe ser una cadena de texto.');
  
    if (errores.length > 0) {
      return res.status(400).json({ message: 'Errores en la validación.', errores });
    }
  
    try {
      const newEstado = await createEstadoDescargoNC({ tipo });
      return res.status(201).json({ message: 'Estado creado con éxito.', data: newEstado });
    } catch (error) {
      return res.status(500).json({ error: 'Error al crear el estado.', details: error.message });
    }
  };
  
  // Handler para eliminar (desactivar) un Estado
  const deleteEstadoDescargoNCHandler = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: 'El ID es requerido.' });
    }
  
    try {
      const estado = await deleteEstadoDescargoNC(id);
      if (!estado) {
        return res.status(404).json({ message: 'Estado no encontrado.' });
      }
      return res.status(200).json({ message: 'Estado desactivado con éxito.', data: estado });
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar el estado.', details: error.message });
    }
  };
  
  // Handler para actualizar un Estado
  const updateEstadoDescargoNCHandler = async (req, res) => {
    const { id } = req.params;
    const { tipo } = req.body;
    const errores = [];
  
    if (!id) errores.push('El campo "id" es requerido.');
    if (!tipo) errores.push('El campo "tipo" es requerido.');
    if (typeof tipo !== 'string') errores.push('El "tipo" debe ser una cadena de texto.');
  
    if (errores.length > 0) {
      return res.status(400).json({ message: 'Errores en la validación.', errores });
    }
  
    try {
      const updatedEstado = await updateEstadoDescargoNC(id, { tipo });
      if (!updatedEstado) {
        return res.status(404).json({ message: 'Estado no encontrado.' });
      }
      return res.status(200).json({ message: 'Estado actualizado con éxito.', data: updatedEstado });
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar el estado.', details: error.message });
    }
  };
  
  module.exports = {
    getEstadoDescargoNCByIdHandler,
    getAllEstadoDescargoNCHandler,
    createEstadoDescargoNCHandler,
    deleteEstadoDescargoNCHandler,
    updateEstadoDescargoNCHandler,
  };
  