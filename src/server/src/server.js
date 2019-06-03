const port = process.env.PORT || 5000;
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = require('socket.io')(server);
const ChatRoom = require('./chat-room');
const clientDir = '../../client/build';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, clientDir)));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, clientDir, 'index.html'));
    });
}

io.set("origins", "*:*");

io.on('connection', socket => {
     let chat = new ChatRoom();
     socket.emit('slug', chat.slug);
     socket.on('chat', state => {
          socket.broadcast.emit('chat', state);
     });
});
