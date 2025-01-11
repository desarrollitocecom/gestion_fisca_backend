const { getIo } = require('../sockets'); 

const responseSocket = async({id, method, socketSendName, res}) => {
    const io = getIo();
    
    if (!id || !method || !socketSendName || !res) {
        throw new Error('Faltan paremetros en el socket');
    }

    try {
        const dataResult = await method(id);
        //console.log(dataResult);
        
        const plainResult = dataResult.toJSON();
    
        io.emit(socketSendName, { data: [plainResult] });
        // console.log('lo que envio e emmanuel:', plainResult);
        
        res.status(201).json({ message:'Enviado correctamente', data: [dataResult] });
      } catch (error) {
        console.error('Error en el socket:', error);
        res.status(500).json({ message: 'Error en el socket', error });
      }

}

module.exports = { responseSocket };
