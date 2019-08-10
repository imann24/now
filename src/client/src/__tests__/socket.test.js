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
    };
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
    };
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

    expect(socket).toBeTruthy();
    expect(ioSpy.withArgs('change-slug', presetSlug).called).toBe(true);
});

it('does not fire change slug on slug as empty string', () => {
    const ioSocket = io();
    const ioSpy = sinon.spy(ioSocket, 'emit');

    const socket = new Socket('', ioSocket);

    expect(socket).toBeTruthy();
    expect(ioSpy.withArgs('change-slug',
                          sinon.match.any).called).toBe(false);
});

it('updates the slug on the slug event', () => {
    const ioSocket = io();
    const ioStub = sinon.stub(ioSocket, 'on');
    const socket = new Socket('', ioSocket);
    const newSlug = 'NEW_SLUG';

    ioStub.callArgWith(1, newSlug);

    expect(socket.slug).toEqual(newSlug);
});

it('updates the message name of a handler on slug change', () => {
    const ioSocket = io();
    const ioSpy = sinon.spy(ioSocket, 'on');
    const socket = new Socket('', ioSocket);
    const newSlug = 'NEW_SLUG';
    const handler = function(message) {
        console.log(message);
    };
    socket.subscribeToMessages(handler);

    ioSpy.callArgWith(1, newSlug);

    expect(socket.slug).toEqual(newSlug);
    expect(ioSpy.withArgs(newSlug + 'chat', handler).called).toBe(true);
    expect(socket.registeredHandlers).toEqual(
        expect.arrayContaining([handler])
    );
});

it('updates the message name for mulitple handlers on slug change', () => {
    const ioSocket = io();
    const ioSpy = sinon.spy(ioSocket, 'on');
    const socket = new Socket('', ioSocket);
    const newSlug = 'NEW_SLUG';
    const handler1 = function(message) {
        console.log(message);
    };
    const handler2 = function(message) {
        console.log(message);
    };
    socket.subscribeToMessages(handler1);
    socket.subscribeToMessages(handler2);

    ioSpy.callArgWith(1, newSlug);

    expect(socket.slug).toEqual(newSlug);
    expect(ioSpy.withArgs(newSlug + 'chat', handler1).called).toBe(true);
    expect(ioSpy.withArgs(newSlug + 'chat', handler2).called).toBe(true);
    expect(socket.registeredHandlers).toEqual(
        expect.arrayContaining([handler1, handler2])
    );
});
