import {Conversation, Msg, Sender} from '../message'

describe('Conversation tests', () => {
    it('creates an empty array of messages', () => {
        const conversation = new Conversation();

        expect(Array.isArray(conversation.messages)).toBe(true);
    });

    it('can add a first message', () => {
        const conversation = new Conversation();
        const message = {
            text: "TEXT",
            sender: {
                name : "NAME",
                id : "ID"
            }
        };

        conversation.addMessage(message);

        const receivedMessage = conversation.messages[0];
        expect(receivedMessage).toBeInstanceOf(Msg);
        expect(receivedMessage.sender).toBeInstanceOf(Sender);
        expect(receivedMessage.text).toBe(message.text);
        expect(receivedMessage.sender.name).toBe(message.sender.name);
        expect(receivedMessage.sender.id).toBe(message.sender.id);
    });

    it('can add two messages from the same sender', () => {
        const conversation = new Conversation();
        const sender = {
            name : "NAME",
            id : "ID"
        }
        const firstMessage = {
            text: "TEXT",
            sender: sender
        };
        const secondMessage = {
            text: "MORE",
            sender: sender
        };

        conversation.addMessage(firstMessage);
        conversation.addMessage(secondMessage);

        const receivedMessage = conversation.messages[0];
        expect(conversation.length).toBe(1);
        expect(receivedMessage).toBeInstanceOf(Msg);
        expect(receivedMessage.sender).toBeInstanceOf(Sender);
        expect(receivedMessage.text).toBe(firstMessage.text + secondMessage.text);
        expect(receivedMessage.sender.name).toBe(sender.name);
        expect(receivedMessage.sender.id).toBe(sender.id);
    });

    it('can add two messages from different senders', () => {
        const conversation = new Conversation();
        const messageSender1 = {
            text: "TEXT",
            sender: {
                name : "NAME1",
                id : "ID1"
            }
        };
        const messageSender2 = {
            text: "TEXT",
            sender: {
                name : "NAME2",
                id : "ID2"
            }
        };

        conversation.addMessage(messageSender1);
        conversation.addMessage(messageSender2);

        const receivedMessageSender1 = conversation.messages[0];
        const receivedMessageSender2 = conversation.messages[1];
        expect(conversation.length).toBe(2);
        expect(receivedMessageSender1).toBeInstanceOf(Msg);
        expect(receivedMessageSender1.sender).toBeInstanceOf(Sender);
        expect(receivedMessageSender1.text).toBe(messageSender1.text);
        expect(receivedMessageSender1.sender.name).toBe(messageSender1.sender.name);
        expect(receivedMessageSender1.sender.id).toBe(messageSender1.sender.id);
        expect(receivedMessageSender2).toBeInstanceOf(Msg);
        expect(receivedMessageSender2.sender).toBeInstanceOf(Sender);
        expect(receivedMessageSender2.text).toBe(messageSender2.text);
        expect(receivedMessageSender2.sender.name).toBe(messageSender2.sender.name);
        expect(receivedMessageSender2.sender.id).toBe(messageSender2.sender.id);
    });

    it('returns the correct last message', () => {
        const conversation = new Conversation();
        const messageSender1 = {
            text: "TEXT",
            sender: {
                name : "NAME1",
                id : "ID1"
            }
        };
        const messageSender2 = {
            text: "TEXT",
            sender: {
                name : "NAME2",
                id : "ID2"
            }
        };
        conversation.addMessage(messageSender1);
        conversation.addMessage(messageSender2);

        const lastMessage = conversation.lastMessage;
        expect(lastMessage.text).toBe(messageSender2.text);
        expect(lastMessage.sender.name).toBe(messageSender2.sender.name);
        expect(lastMessage.sender.id).toBe(messageSender2.sender.id);
    });
});

describe('Msg tests', () => {
    it('initializes correctly', () => {
        const sender = new Sender('NAME');
        const text = 'TEXT';

        const message = new Msg(sender, text);

        expect(message.sender).toBe(sender);
        expect(message.text).toBe(text);
    });

    it('adds additional text', () => {
        const sender = new Sender('NAME');
        const text = 'TEXT';
        const message = new Msg(sender, text);
        const additionalText = 'MORE';

        message.concat(new Msg(sender, additionalText));

        expect(message.text).toBe(text + additionalText);
    });
});

describe('Sender tests', () => {
    it('initializes correctly', () => {
        const name = 'NAME';
        const sender = new Sender(name);

        expect(sender.name).toBe(name);
        expect(sender.id).toBeTruthy();
    });

    it('is equal to itself', () => {
        const name = 'NAME';
        const sender = new Sender(name);

        expect(sender.equals(sender)).toBeTruthy();
    });

    it('is not equal to another sender with the same name', () => {
        const name = 'NAME';
        const sender1 = new Sender(name);
        const sender2 = new Sender(name);

        expect(sender1.equals(sender2)).toBeFalsy();
    });
});
