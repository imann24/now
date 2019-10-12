import uuidv4 from 'uuid/v4'

class Conversation {
    constructor() {
        this.messages = [];
    }
    get length() {
        return this.messages.length;
    }
    get lastMessage() {
        if(this.messages.length) {
            return this.messages[this.messages.length - 1];
        }
        return '';
    }
    addMessage(message) {
        message = Object.assign(new Msg(), message);
        message.sender = Object.assign(new Sender(), message.sender);
        // let newSender = message.sender;
        // let lastMessage = this.lastMessage;
        this.messages.push(message);
        return this;
    }
}

class Msg {
    constructor(sender, text) {
        this.sender = sender;
        this.text = text;
    }
    concat(message) {
        this.text += message.text;
    }
}

class Sender {
    constructor(name) {
        this.name = name;
        this.id = uuidv4();
    }
    equals(sender) {
        if(sender instanceof Sender) {
            return this.name === sender.name &&
                    this.id === sender.id;
        }
        return false;
    }
}

export {
    Conversation,
    Msg,
    Sender,
}
