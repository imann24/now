import io from 'socket.io-client';

const CHAT_EVENT = 'chat';

class Socket {
    constructor(presetSlug, ioSocket) {
        this.socket = ioSocket || io(this.getSocketAddress(), {
            transports: ['websocket']
        });
        this.messageHandlers = [];
        this.socket.on(CHAT_EVENT, (message) => {
            this.handleMessageReceived(message);
        });
    };
    handleMessageReceived(message) {
        this.messageHandlers.forEach((h) => {
            h(message);
        });
    };
    getSocketAddress() {
        let address = window.location.protocol === 'https:' ? 'wss' : 'ws';
        address += `://${window.location.hostname}`;
        if (window.location.host.includes(":")) {
            address += `:${process.env.PORT || '5000'}`;
        }
        return address;
    };
    inviteToChat(inviter, number) {
        this.socket.emit('invite', {
             inviter: inviter,
             number: number,
             url: window.location.href });
    };
    subscribeToMessages(handler) {
        this.messageHandlers.push(handler);
    };
    join(currentSlug, onWelcome) {
        this.socket.on('welcome', (welcomePackage) => {
            onWelcome(welcomePackage);
        });
        this.socket.emit('join', {
            slug: currentSlug
        });
    };
    handleUserCountChange(onUserCountChange) {
        this.socket.on('user-count', (userCount) => {
            onUserCountChange(userCount);
        });
    };
    chat(message) {
        this.socket.emit(CHAT_EVENT, message);
    };
}

export default Socket;
