//Normal code here
var messages = [{
    id: 1,
    text: "Hola soy un mensaje",
    author: "GearCore-Software"
}];
var socketId = [];
//then at the bottom:
function getMessages() {
    return messages;
}
/**
 * modulo de exportacion o call back
 * @param  {[type]} io [Recibe el modulo socket.io y el servidor]
 * @return {[type]}    [Regresa los mensajes-- actualemnte no se usan]
 */
module.exports = function(io) {
    //Socket.IO

    io.on('connection', function(socket) {
        let cliente = { id: socket.id, userId: null };
        socketId.push(cliente);
        console.log(`-> Nueva conexion Sockets.id = [` + cliente.id + `]`);

        // 2019
        socket.on('nuevaUbicacion', function(data) {
            console.log('nuevaUbicacion /n '+data)
            io.sockets.emit('nuevaUbicacion', data);
        });

        //ON Events --old
        socket.emit('messages', messages);
        socket.on('new-message', function(data) {
            messages.push(data);
            io.sockets.emit('messages', messages);
        });
        socket.on('newProperty', function(data) {
            console.log('funcion socketIo.js /n '+data)
            io.sockets.emit('newProperty', data);
        });
        socket.on('upDateUbicacion', function(data) {
            io.sockets.emit('upDateUbicacion', data);
        });
        socket.on('deleteProperty', function(id) {
            io.sockets.emit('deleteProperty', id);
        });
        //End ON Events
        return io;
    });

}, getMessages;

/*
Socket.io: tipos de llamadas socket
Posted on 20 de October de 2013
Para trabajar con socket.io una de las cosas más importantes es saber qué estamos enviando y a quién. Esta micro-entrada presenta las diversas llamadas para saber a qué socket estamos enviando:

Envío a todos los sockets abiertos
socket.emit() – envía de vuelta al cliente que ha enviado la petición (cliente A a cliente A)
socket.broadcast.emit() – envía a todos los clientes menos al que ha enviado la petición (cliente A a todos menos a cliente A)
io.sockets.emit() – envía a todos los clientes incluido el que ha enviado la petición (cliente A a todos incluido cleinte A)
io.sockets.socket(socketid).emit() – envia a un cliente específico mediante su socket id (cliente A a cliente específico)
Envíop a sockets en rooms específicas
socket.broadcast.to(‘nombrederoom’).emit() – envía a todos los clientes de nombrederoom menos al que ha enviado la petición (cliente A a todos los clientes en nombrederoom menos a cliente A)
io.sockets.in(‘nombrederoom’).emit() – envía a todos los clientes de nombrederoom incluido el que ha enviado la petición (cliente A a todos los clientes en nombrederoom incluido cliente A)


*/

/*

Glosario

nuevaUbicacion.-
    utilizado para cuando se realize una nueva ubicacion, mandara un mensaje a todos los que esten conectados

 */