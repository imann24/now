import sinon from 'sinon';

import Socket from '../socket'

it('creates a socket instance', () => {
    const socket = new Socket();

    expect(socket.socket).toBeTruthy();
});

it('sends a message through socket.io', () => {
    const socket = new Socket();
    const ioSpy = sinon.spy(socket.socket, 'emit');
    const message = 'Test Message';

    socket.chat(message);

    expect(ioSpy.withArgs('chat', message).called).toBe(true);
});

it('can subscribe to messsages', () => {
    const message = 'Hello World';
    const socket = new Socket();
    let wasCalled = false;
    const handler = function(receivedMessage) {
        wasCalled = true;
        expect(message).toBe(receivedMessage);
    };

    socket.subscribeToMessages(handler);
    socket.handleMessageReceived(message);

    expect(socket.messageHandlers).toEqual(
        expect.arrayContaining([handler])
    );
    expect(wasCalled).toBeTruthy();
});
