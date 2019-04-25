import io from 'socket.io-client';

const CHAT_EVENT = 'chat';

class Socket {
    constructor() {
        this.socket = io();
    };
    sendMessage(message) {
        this.socket.emit(CHAT_EVENT, message);
    };
    subscribeToMessages(handler) {
        this.socket.on(CHAT_EVENT, handler);
    }
}

export default Socket;
