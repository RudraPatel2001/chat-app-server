const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()
const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    console.log('Connected to -> ' + socket.id)

    socket.on('joinroom', room => {
        socket.join(room)
        console.log(`User ${socket.id} joined ${room}`)
    })

    socket.on("sendmsg", msgObj => {
        socket.to(msgObj.room).emit("rcvmsg", msgObj)
    })

    socket.on('disconnect', () => {
        console.log('Disconnected from -> ' + socket.id)
    })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, console.log(`Server Running on ${PORT}`))