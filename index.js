const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
var moment = require('moment');

app.use('/style', express.static(__dirname + '/style'))
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

io.on('connection', (socket) => {
  socket.username = 'anonymous'+ Math.floor(Math.random() * 10) + 1  ;
  socket.on('change username', (name) => socket.username = name)
  socket.on('message', (msg) => io.emit('message',
  { 'user': socket.username, 'message': msg, 'datetime':moment().format('hh:mm')}))
  socket.on('join', (username) => {
    if (username != null) {
      socket.username = username
    }else{
        socket.emit('join',{'username':socket.username});
    }
    socket.broadcast.emit('message',
    { 'user': 'Server', 'message': socket.username + ' has joined!'})
  })
  socket.on('typingMessage', (username) =>
  socket.broadcast.emit("typingMessage", username ))
  socket.on('stopTypingMessage', (username) =>
  socket.broadcast.emit("stopTypingMessage",username))
})

http.listen(3000, () => console.log('listening on port 3000'))