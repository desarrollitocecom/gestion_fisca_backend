const {
getDocumento
    }=require('../controllers/documentoController');
const getDocumentoHandler=async (req,res) => {
    const {id}=req.params
    try {
        const response=await getDocumento(id);
       if(!response){
        return res.status(201).json({message:"Error en el handler ", data:[]})
       }
       return res.status(200).json({message:"Correcto Docs ", data:response})
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({message:"NOOO",data:error})
    }
}
module.exports={
    getDocumentoHandler
}