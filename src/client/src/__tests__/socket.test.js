import Socket from '../socket'

it('creates an empty list of message handlers', () => {
    const socket = new Socket();

    expect(Array.isArray(socket.messageHandlers)).toBe(true);
});

it('creates a socket instance', () => {
    const socket = new Socket();

    expect(socket.socket).toBeTruthy();
});
