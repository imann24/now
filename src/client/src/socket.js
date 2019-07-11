import io from 'socket.io-client';

const CHAT_EVENT = 'chat';
const SLUG_EVENT = 'slug';

class Socket {
    constructor(presetSlug, ioSocket) {
        this.socket = ioSocket || io(
            `ws://localhost:${process.env.PORT || '5000'}`,
            {transports: ['websocket']});
        this.slug = presetSlug;
        this.registeredHandlers = [];
        this.unregisteredHandlers = [];
        if (this.slug) {
            this.socket.emit('change-slug', this.slug);
            return;
        }
        let that = this;
        this.socket.on(SLUG_EVENT, function(data) {
             that.slug = data;
             window.history.pushState('chat', 'My Chat', '/' + that.slug);
             that.unregisteredHandlers.forEach((h) => {
                 that.socket.on(that.slug + CHAT_EVENT, h);
             });
             that.registeredHandlers = that.registeredHandlers.concat(that.unregisteredHandlers);
             that.unregisteredHandlers = [];
        });
    };
    sendMessage(message) {
        this.socket.emit(this.slug + CHAT_EVENT, message);
    };
    subscribeToMessages(handler) {
        if (this.slug) {
            this.registeredHandlers.push(handler);
            this.socket.on(this.slug + CHAT_EVENT, handler);
        } else {
            this.unregisteredHandlers.push(handler);
        }
    }
}

export default Socket;
