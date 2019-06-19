import sinon from 'sinon';
import io from 'socket.io-client';

import Socket from '../socket'

it('creates a socket instance', () => {
    const socket = new Socket();

    expect(socket.socket).toBeTruthy();
});

it('sends a message through socket.io', () => {
    const slug = 'SLUG';
    const socket = new Socket();
    const ioSpy = sinon.spy(socket.socket, 'emit');
    const message = 'Test Message';
    socket.slug = slug;

    socket.sendMessage(message);

    expect(ioSpy.withArgs(slug + 'chat', message).called).toBe(true);
});

it('can subscribe before receiving slug', () => {
    const socket = new Socket();
    const handler = function(message) {
        console.log(message);
    }
    const ioSpy = sinon.spy(socket.socket, 'on');

    socket.subscribeToMessages(handler);

    expect(ioSpy.withArgs(sinon.match.any, handler).called).toBe(false);
    expect(socket.unregisteredHandlers).toEqual(
        expect.arrayContaining([handler])
    );
});

it('can subscribe handlers after receiving slug', () => {
    const slug = 'abcd1';
    const socket = new Socket();
    const handler = function(message) {
        console.log(message);
    }
    const ioSpy = sinon.spy(socket.socket, 'on');
    socket.slug = slug;

    socket.subscribeToMessages(handler);

    expect(ioSpy.withArgs(slug + 'chat', handler).called).toBe(true);
    expect(socket.registeredHandlers).toEqual(
        expect.arrayContaining([handler])
    );
});

it('forwards received messages to handlers', () => {
    const socket = new Socket();
    const expectedMessage = 'Hello World';
    const ioStub = sinon.stub(socket.socket, 'on');
    const handler = sinon.spy(function(message) {
        expect(message).toBe(expectedMessage);
    });
    socket.slug = '1234';

    socket.subscribeToMessages(handler);
    ioStub.callArgWith(1, expectedMessage);

    expect(handler.withArgs(expectedMessage).called).toBe(true);
});

it('fires change slug if slug is preset', () => {
    const ioSocket = io();
    const ioSpy = sinon.spy(ioSocket, 'emit');
    const presetSlug = 'SLUGGY';

    const socket = new Socket(presetSlug, ioSocket);

    expect(ioSpy.withArgs('change-slug', presetSlug).called).toBe(true);
});

it('does not fire change slug on slug as empty string', () => {
    const ioSocket = io();
    const ioSpy = sinon.spy(ioSocket, 'emit');

    const socket = new Socket('', ioSocket);

    expect(ioSpy.withArgs('change-slug',
                          sinon.match.any).called).toBe(false);
});
