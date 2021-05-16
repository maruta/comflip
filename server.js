const express = require('express');
const socketIO = require('socket.io');
const url = require('url');

const PORT = process.env.PORT || 3000;

const rootUrl = (req) => {
    let s = Object.assign(new URL("http://example.com/"), {
        protocol: req.protocol,
        host: req.get('host')
    });
    return s;
};

const server = express()
    .use(express.json())
    .set('views', __dirname + '/views')
    .engine('html', require('ejs').renderFile)
    .set('view engine', 'html')
    .set('trust proxy', true)
    .post('/api/emit', (req, res) => {
        console.log({
            ip: req.ip,
            room: req.body.room,
            comment: req.body.comment
        });
        io.to(req.body.room).emit('comment', req.body.comment);
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
    .get("/", function (req, res) {
        const data = {
            rootUrl: rootUrl(req)
        };
        res.render("./index.en.ejs", data);
    })
    .get("/ja/", function (req, res) {
        const data = {
            rootUrl: rootUrl(req)
        };
        res.render("./index.ja.ejs", data);
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

