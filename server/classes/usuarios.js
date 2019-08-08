class Users {
    constructor(){
        this.users = [];
    }

    addUser(id, username, room){
        let user = {
            id,
            username,
            room
        }

        this.users.push(user);

        return this.users;
    }

    getUser(id) {
        let user = this.users.filter( el =>{
            return el.id === id
        })[0];  

        console.log('Classes', user)

        return user;
    }

    getAllUsers(){
        return this.users
    }

    getUsersByGroup(sala){
        let roomUsers = this.users.filter(user => {
            return user.room === sala
        })

        return roomUsers
    }

    removeUser(id){

        let offlineUser = this.getUser(id);

        this.users = this.users.filter( user=>{
            return user.id != id
        })

        return offlineUser;
    }
}

module.exports = {
    Users
}