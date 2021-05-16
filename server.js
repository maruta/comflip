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
    .get('/api/heartbeat', function (req, res) {
        console.log({
            ip: req.ip,
            cmd: 'heartbeat',
            room: req.query.room
        });
        res.send('ok');
    })
    .use(express.static('public'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log({
        id: socket.id,
        event: 'connect',
    });
    socket.on("join", (room) => {
        console.log({
            id: socket.id,
            event: 'join',
            room: room
        });
        socket.join(room);
    });
    socket.on('disconnect', () => console.log({
        id: socket.id,
        event: 'disconnect'
    }));
});

