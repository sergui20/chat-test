var socket = io();

if (!params.has('nombre') || !params.has('sala')) {
    // window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    amigo: params.get('friend'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('chatLogin', usuario, function(resp) {
        // console.log('Usuarios conectados', resp);
        renderRoom(usuario.amigo)
        renderUsers(resp)
    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('sendMessage', function(mensaje) {
    // console.log('Servidor:', mensaje);
    renderMessage(mensaje, false)

    let html = '';
    typingBox.html(html)
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('loginEvent', function(personas) {
    renderUsers(personas, false)
});

socket.on('logoutEvent', function(mensaje){
    renderMessage(mensaje)
})

// Mensajes privados
socket.on('P2Pmessage', function(mensaje) {
    console.log('Mensaje Privado:', mensaje);
});

// Typing event
socket.on('Istyping', function(data){
    renderTypingBox(data);
})

socket.on('notTyping', function(){
    setTimeout(function(){
        let html = '';
        typingBox.html(html);
    },3000)
})