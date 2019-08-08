// socket server
const { io } = require('../server');
const { Users } = require('../classes/usuarios');
const createMessage = require('../utils/utilities');

const users = new Users();

io.on('connection', (client) => {
    client.on('chatLogin', function(user, callback){
        if(!user.nombre || !user.sala){
            return callback({
                err: true,
                mensaje: 'El nombre o la sala son necesarios'
            })
        }

        client.join(user.sala);

        let activeUsers = users.addUser(client.id, user.nombre, user.sala);
        let roomUsers = users.getUsersByGroup(user.sala) // Array de users en la sala

        client.broadcast.to(user.sala).emit('loginEvent', users.getUsersByGroup(user.sala) )
        client.broadcast.to(user.sala).emit('sendMessage', createMessage('Admin', `${user.nombre} has joined`));

        callback(roomUsers);
    })

    client.on('sendMessage', function(data, callback){
        let user = users.getUser(client.id);

        let message = createMessage(data.name, data.message);
        
        client.broadcast.to(user.room).emit('sendMessage', message);
        
        callback(message);
    })

    client.on('disconnect', function(){
        let offlineUser = users.removeUser(client.id);

        client.broadcast.to(offlineUser.room).emit('logoutEvent', createMessage('Admin', `${offlineUser.username} left the chat`))
        client.broadcast.to(offlineUser.room).emit('loginEvent', users.getUsersByGroup(offlineUser.room))        
    })

    //Mensaje privado
    client.on('P2Pmessage', (data) => {
        let user = users.getUser(client.id)

        client.broadcast.to(data.receiver).emit('P2Pmessage', createMessage(user.username, data.message))
    })

    client.on('Istyping', function(data){
        console.log('Server gets ', data)
        client.broadcast.to(data.room).emit('Istyping', data)

        client.broadcast.to(data.room).emit('notTyping')
    })
});