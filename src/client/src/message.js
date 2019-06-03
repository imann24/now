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
        return null;
    }
    addMessage(message) {
        message = Object.assign(new Message(), message);
        message.sender = Object.assign(new Sender(), message.sender);
        let newSender = message.sender;
        let lastMessage = this.lastMessage;
        // return this;
        if (lastMessage && newSender.equals(lastMessage.sender)) {
            lastMessage.concat(message);
        } else {
            this.messages.push(message);
        }
        return this;
    }
}

class Message {
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
    Message,
    Sender,
}
