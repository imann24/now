const port = process.env.PORT || 5000;
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = require('socket.io')(server);
const ChatRoom = require('./chat-room');
const clientDir = '../../client/build';
const rooms = {};
const debugMode = false;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, clientDir)));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, clientDir, 'index.html'));
    });
}

io.set('origins', '*:*');

io.on('connection', socket => {
     let chat = new ChatRoom();
     socket.emit('slug', chat.slug);
     rooms[chat.slug] = [socket.id];
     socket.on('change-slug', slug => {
         rooms[chat.slug] = rooms[chat.slug].filter(id => {
             return id !== socket.id;
         });
         if(!rooms[chat.slug].length) {
             delete rooms[chat.slug];
         }
         chat.slug = slug;
         if(!rooms[slug]) {
             rooms[slug] = [];
         }
         rooms[slug].push(socket.id);
         socket.on(chat.slug + 'chat', state => {
              socket.broadcast.emit(chat.slug + 'chat', state);
         });
         if (debugMode) console.log(rooms);
     })
     socket.on(chat.slug + 'chat', state => {
          socket.broadcast.emit(chat.slug + 'chat', state);
     });
     if (debugMode) console.log(rooms);
});

exports.shutDown = function() {
    server.close();
};
