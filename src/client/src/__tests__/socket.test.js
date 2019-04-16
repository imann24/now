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

    socket.sendMessage(message);

    expect(ioSpy.withArgs('chat', message).called).toBe(true);
});

it('can subscribe handlers', () => {
    const socket = new Socket();
    const handler = function(message) {
        console.log(message);
    }
    const ioSpy = sinon.spy(socket.socket, 'on');

    socket.subscribeToMessages(handler);

    expect(ioSpy.withArgs('chat', handler).called).toBe(true);
});

it('forwards received messages to handlers', () => {
    const socket = new Socket();
    const expectedMessage = 'Hello World';
    const ioStub = sinon.stub(socket.socket, 'on');
    const handler = sinon.spy(function(message) {
        expect(message).toBe(expectedMessage);
    });

    socket.subscribeToMessages(handler);
    ioStub.callArgWith(1, expectedMessage);

    expect(handler.withArgs(expectedMessage).called).toBe(true);
});
