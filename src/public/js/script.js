const socket = io()

socket.emit('mensaje', "hola servidor")

socket.on('respuesta', (info) => {
    if(info) {
        socket.on('')
    }
})