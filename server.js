const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;

const server = express()
    .use(express.json())
    .set('trust proxy', true)
    .post('/api/emit', (req, res) => {
        console.log({
            ip: req.ip,
            room: req.body.room,
            comment: req.body.comment
        });
        io.to(req.body.room).emit('comment',req.body.comment);
        res.send("ok");
    })
    .use(express.static('public'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    socket.on("join", (room) => {
        console.log('client joined to: '+room);
        socket.join(room);
    });
    socket.on('disconnect', () => console.log('Client disconnected'));
});

