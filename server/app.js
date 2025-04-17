const express = require('express');
const http = require('http');
const Server = require('socket.io').Server
const mongoose = require("mongoose")
const Chat = require('./models/chat.js')
const { timeStamp } = require('console')
const Connection = require('./db.js')
const app = express()
Connection()
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("connected");

    const loadMessages = async () => {
        try {
            const messages = await Chat.find().sort({timeStamp : 1}).exec();
            socket.emit('chat', messages)
        } catch(err) {
            console.log(err)
        }
    }
    loadMessages();

    socket.on('newMessage', async (msg) => {
        try {
            const newMessage = new Chat(msg)
            await newMessage.save()
            io.emit('message', msg)
        }catch(err) {
            console.log(err)
        }
    })


    socket.on("disconnect", () => {
        console.log("disconnect")
    })
})

server.listen("3002", () => {
    console.log("running on 3002 port")
})