const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
var moment = require('moment');

app.use('/style', express.static(__dirname + '/src'))
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

//Client Connected
io.on('connection', (socket) => {
  //if Guest Generate Name
  socket.username = 'anonymous'+ Math.floor(Math.random() * 10) + 1;
  //if user Enter User Name set userName
  socket.on('change username', (name) => socket.username = name)
 
  //send and recieve messages event  
  socket.on('message', (msg) => io.emit('message',
  { 'user': socket.username, 'message': msg, 'datetime':moment().format('hh:mm')}))
 
 
  //when any user join to chat room Notify all user except sender By push message from server
  socket.on('join', (username) => {
    //Condition to Handle if Guest or User
    if (username != null) {
      socket.username = username
    }else{
        socket.emit('join',{'username':socket.username});//server send Generated username for Guest to sender Only
    }
    socket.broadcast.emit('message',
    { 'user': 'Server', 'message': socket.username + ' has joined!'})
  })

  //events to Detect users Typing in chat Room
  socket.on('typingMessage', (username) =>
  socket.broadcast.emit("typingMessage", username ))
  socket.on('stopTypingMessage', (username) =>
  socket.broadcast.emit("stopTypingMessage",username))
})

http.listen(3000, () => console.log('listening on port 3000'))