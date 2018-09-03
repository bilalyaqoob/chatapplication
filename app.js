const express = require('express');
var app = express();
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
const {generateMessage,generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
const port = process.env.PORT || 3000;

app.use('/', (req,res) => {
    res.render('./public/index.html');
});

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('Admin','Welcome to chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message,callback) => {
        console.log('createMessage',message);
        // to send to every one
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
        /* but to send others not user who sends
            socket.broadcast.emit('newMessage',{
            from : message.from,
            text : message.text,
            createdAt: new Date().getTime()
        }); */
    });
    
    socket.on('createLocationMessage',(coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect',() => {
        console.log('user was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
