
const { getDescargoRgController } = require('../controllers/descargoRgController');
const {
    createInformeFinalController,
    updateInformeFinalController,
    getAllInformeFinalController,
    getInformeFinalController
}=require('../controllers/informeFinalController');

const fs=require('node:fs');
function saveImagen(file) {
    const newpath=`./uploads/ifi/${file.originalname}`
    fs.renameSync(file.path,newpath);
    return newpath
}
const   createInformeFinalHandler=async (req,res) => {
    const {nro_ifi, fecha,tipo,id_evaluar,id_descargo_ifi}=req.body;
    const doc=saveImagen(req.files['documento_ifi'][0]).replace(/^.\//,'');
  try {
       
        const response=await createInformeFinalController({nro_ifi,fecha,documento_ifi:doc,tipo,id_evaluar,id_descargo_ifi});
        if(!response)
            return res.status(201).json({
            message:'Error al crear nuevo informe Final ',
            data:[]
        })
      return  res.status(200).json({message:'Nuevo Informe Final Creado',data:response})
    } catch (error) {
        console.error('Error al crear el Informe final:', error);
        return res.status(500).json({
            message: 'Error al crear el informe Final',
            error: error.message
        });
    }
};

const updateInformeFinalHandler=async (req,res) => {
    const {id}=req.params
    const {nro_ifi, fecha, documento_ifi,tipo,id_evaluar,id_descargo_ifi}=req.body; 
    try {
        
        const response=await updateInformeFinalController({id,nro_ifi,fecha,documento_ifi,tipo,id_evaluar,id_descargo_ifi});
        if(!response)res.status(201).json({
            message:`Error al Modificar el IFI con el id:${id}`,
            data:[]
        })
        res.status(200).json({message:'Nuevo Informe Final Modificado',data:response})
    } catch (error) {
        console.error('Error al modificar el Informe final:', error);
        return res.status(500).json({ message: 'Error al moficar el informe Final', error });
    }
}
const getAllInformesFinalesHandler=async (req,res) => {
    try {
        const response=await getAllInformeFinalController();
        
        if(!response)
            return res.status(201).json({message:'No se pudo traer todos IFIs',data:[]})
        return res.status(200).json({
            message:"Estos son los IFIs",
            data:response
        });
        
    } catch (error) {
        console.error('Error al Traer los IFIs :', error);
        return res.status(500).json({ message: 'Error al Traer los IFIs', error });
    }
};
const getInformeFinalHandler=async (req,res) => {
    const {id}=req.params;
    try {
        const response=await getInformeFinalController(id);
        if(!response) res.status(201).json({message:'No se pudo traer IFI',data:[]})
        return res.status(200).json({message:'  IFI',data:response});
    } catch (error) {
        console.error('Error al Traer el IFI :', error);
        return res.status(500).json({ message: 'Error al Traer el IFI', error });
    }
}
module.exports={
    createInformeFinalHandler,
    updateInformeFinalHandler,
    getAllInformesFinalesHandler,
    getInformeFinalHandler
}
