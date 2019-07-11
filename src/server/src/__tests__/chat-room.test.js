const ChatRoom = require('../chat-room');

it('each room has a unique slug', () => {
    const room1 = new ChatRoom();
    const room2 = new ChatRoom();

    expect(room1.slug === room2.slug).toBe(false);
});
