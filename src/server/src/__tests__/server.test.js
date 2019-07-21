// TODO: fully mock out socket.io behavior in server
// --> jest.mock('socket.io');

it('can create a server', () => {
    let server;
    try {
        server = require('../server');
        expect(server).toBeTruthy();
    } finally {
        if (server) {
            server.shutDown();
        }
    }
});
