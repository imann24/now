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

function updateMemberCount(socket, chat) {
    socket.broadcast.emit(chat.slug + 'member-count', chat.memberCount());
}

function setupHandlers(socket, chat) {
    socket.on(chat.slug + 'chat', (state) => {
        socket.broadcast.emit(chat.slug + 'chat', state);
    });
    socket.on(chat.slug + 'invite', (contact) => {
        sms.sendMessage(contact.number,
                        `${contact.inviter} is inviting you to chat on Now @ ${contact.url}`);
    });
    socket.on(`${chat.slug}join`, (memberId) => {
        chat.addMember(memberId);
        updateMemberCount(socket, chat);
    });
    socket.on(`${chat.slug}leave`, (memberId) => {
        chat.removeMember(memberId);
        updateMemberCount(socket, chat);
    });
}

io.on('connection', socket => {
     let chat = new ChatRoom();
     socket.emit('slug', chat.slug);
     rooms[chat.slug] = [socket.id];
     socket.on('change-slug', (slug) => {
         rooms[chat.slug] = rooms[chat.slug].filter((id) => {
             return id !== socket.id;
         });
         if(!rooms[chat.slug].length) {
             delete rooms[chat.slug];
         }
         chat.slug = slug.toString();
         if(!rooms[slug.toString()]) {
             rooms[slug.toString()] = [];
         }
         rooms[slug].push(socket.id);
         setupHandlers(socket, chat);
     });
     setupHandlers(socket, chat);
     if (debugMode) {
         console.log(rooms);
     }
});

exports.shutDown = function() {
    server.close();
};
