const socketIoMock = require('socket.io')();

it('can create a server', () => {
    let server;
    try {
        server = require('../server');

        expect(server).toBeTruthy();
        expect(socketIoMock.on.mock.calls.length).toBe(1);
        expect(socketIoMock.set.mock.calls.length).toBe(1);
    } finally {
        if (server) {
            server.shutDown();
        }
    }
});
