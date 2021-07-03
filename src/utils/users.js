const users = []

const addUser = ({ id, username , room}) =>{
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if(!username || !room) {
        return {
            error: "Username and room required"
        }
    }

    // check for existing user
    const existingUser = users.find((user)=>{

        return user.room === room && user.username === username
    })

    if(existingUser) {
        return {
            error: "Username already taken, pick another!"
        }
    }

    const user = { id, username, room }
    users.push(user)
    return {user}

}
const removeUser = (id) => {
    const index = users.findIndex(user => {
        return user.id === id
    })
    if(index!==-1) {
        return users.splice(index, 1)[0]
    }
} 

const getUser = (id) => {
    return users.find( (user) => {
       return user.id === id
    } )
}

const getUsersRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}


addUser({
    id: 22,
    username: "Praveen Kumar",
    room: "Delhi"
})

addUser({
    id: 42,
    username: "Rohan",
    room: 'Mumbai'
})

// const user = getUser(42)
// console.log(user)

// const usersList = getUsersRoom('Dhaka')
// console.log(usersList)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersRoom
}
