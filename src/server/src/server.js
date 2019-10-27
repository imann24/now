const port = process.env.PORT || 5000;
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = require('socket.io')(server);
const ChatRoom = require('./chat-room');
const SMSClient = require('./sms')
const clientDir = '../../client/build';
const rooms = {};
const debugMode = false;
const sms = new SMSClient();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, clientDir)));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, clientDir, 'index.html'));
    });
}

io.set('origins', '*:*');

let chatRooms = {};
function getRoom(currentSlug) {
    if (!currentSlug || !chatRooms[currentSlug]) {
        let chat = new ChatRoom();
        if (currentSlug) {
            chat.slug = currentSlug;
        } else {
            currentSlug = chat.slug;
        }
        chatRooms[chat.slug] = chat;
    }
    return chatRooms[currentSlug];
}

io.on('connection', socket => {
    let chatRoom;
    socket.on('join', (state) => {
        chatRoom = getRoom(state.slug);
        socket.join(chatRoom.slug);
        io.in(chatRoom.slug).clients((err, clients) => {
            socket.emit('welcome', {
                slug: chatRoom.slug,
                userCount: clients.length
            });
            socket.to(chatRoom.slug).emit('user-count', clients.length);
        });
        socket.on('chat', (payload) => {
            socket.to(chatRoom.slug).emit('chat', payload);
        });
        socket.on('invite', (contact) => {
            sms.sendMessage(contact.number,
                            `${contact.inviter} is inviting you to chat on Now @ ${contact.url}`);
        });
    });
});

exports.shutDown = function() {
    server.close();
};
