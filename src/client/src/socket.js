import io from 'socket.io-client';

const CHAT_EVENT = 'chat';
const SLUG_EVENT = 'slug';

class Socket {
    constructor() {
        this.socket = io();
        this.slug = null;
        this.socket.on(SLUG_EVENT, function(data) {
             this.slug = data;
             window.history.pushState("chat", "My Chat", "/" + this.slug);
        });
        console.log("CREATING SOCKET");
    };
    sendMessage(message) {
        this.socket.emit(CHAT_EVENT, message);
    };
    subscribeToMessages(handler) {
        this.socket.on(CHAT_EVENT, handler);
    }
}

export default Socket;
