import io from 'socket.io-client';

const CHAT_EVENT = 'chat';
const SLUG_EVENT = 'slug';

class Socket {
    constructor(presetSlug, ioSocket) {
        this.socket = ioSocket || io(this.getSocketAddress(), {transports: ['websocket']});
        this.slug = presetSlug;
        this.registeredHandlers = [];
        this.unregisteredHandlers = [];
        this.memberCountHandlers = [];
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
    getSocketAddress() {
        let address = window.location.protocol === 'https:' ? 'wss' : 'ws';
        address += `://${window.location.hostname}`;
        if (window.location.host.includes(":")) {
            address += `:${process.env.PORT || '5000'}`;
        }
        return address;
    };
    sendMessage(message) {
        this.socket.emit(this.slug + CHAT_EVENT, message);
    };
    inviteToChat(inviter, number) {
        this.socket.emit(this.slug + 'invite',
                         { inviter: inviter,
                           number: number,
                           url: window.location.href });
    };
    subscribeToMessages(handler) {
        if (this.slug) {
            this.registeredHandlers.push(handler);
            this.socket.on(this.slug + CHAT_EVENT, handler);
        } else {
            this.unregisteredHandlers.push(handler);
        }
    };
    onMemberCountChange(memberCountHandler) {
        this.memberCountHandlers.push(memberCountHandler);
    };
}

export default Socket;
