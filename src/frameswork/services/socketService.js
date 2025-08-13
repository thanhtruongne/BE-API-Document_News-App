

const socketServiceHandler = (socket,logger) => {
    socket.on('send_message',(data) => {
        
    })

    socket.on('error', (err) => {
        logger.error('Socket error: ' + err.message);
    });
  

    socket.on('disconnect',() => {
        logger.info(' Socket disconnected:', socket.id);
    })

   
    
}

export default socketServiceHandler