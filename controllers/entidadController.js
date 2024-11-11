const {Entidad}= require ("../db_connection");

 const getAllEntidades = async (page = 1 , limit=20 )=>{
    const offset = (page = 1)* limit ;

    try{
        const response = await Entidad.findAndCountAll({
            limit,
            offset,
            order:[['id','ASC']],           
        });

        return {totalCount : response.count , data: response.rows, currentPage: page} || null;


    }
    catch(error){
        console.error({message :"Error en el controlador al traer todos las Entidades", data : error});
        return false;

    }

 };

 const getEntidades = async (id) => {
    try{
        const response = await Entidad.findOne({where:{id}});
        return response || null;
    }
    catch(error){
        console.error({message:"Error en el controlador al traer la Entidad", data:error})
        return false;
    }
 };

 const createEntidad = async ({nombre}) => {
    
 }