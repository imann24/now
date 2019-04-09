import io from 'socket.io-client';

const CHAT_EVENT = 'chat';

class Socket {
    constructor() {
        this.socket = io();
        this.messageHandlers = [];
        this.socket.on(CHAT_EVENT, (message) => {
            this.messageHandlers.forEach(function(handler) {
                handler(message);
            });
        });
    };
    sendMessage(message) {
        this.socket.emit(CHAT_EVENT, message);
    };
    subscribeToMessages(handler) {
        this.messageHandlers.push(handler);
    }
}

export default Socket;
