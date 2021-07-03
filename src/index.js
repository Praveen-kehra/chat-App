const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage , generateLocation } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryParth = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryParth))


io.on('connection', (socket) => {
    console.log('New socket Connected')


    //sends message to all user except the current user
    // socket.broadcast.emit('message', generateMessage('A new user has joined'))
    // socket.emit('message', generateMessage("Welcome!"))
    // socket.emit('message', generateMessage('Weolcome!!!'))

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({ id: socket.id, username, room})
        
        if(error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`"${user.username}" has joined!`))
        socket.emit('message', generateMessage('Admin','Weolcome!!!'))
        io.to(user.room).emit('roomData' ,{
            room: user.room,
            users: getUsersRoom(user.room)
        })
        callback()
        
        // socket.emit, io.emit, socket.broadcast
        //io.to.emit(to specific room), socket.boradcast.to.emit()
    })

    socket.on('sendMessage', (message, callback)=>{

        const user = getUser(socket.id)
        // console.log("in index room checking! ",user)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        
        io.to(user.room).emit('message', generateMessage(user.username, message))
        // io.to(user.id).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) =>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocation(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', generateMessage('Amin',`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersRoom(user.room)
            })
        }
    })
    
})




server.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})



