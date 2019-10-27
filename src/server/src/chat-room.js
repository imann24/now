const SlugGenerator = require('./slug-generator');

class ChatRoom {
    constructor() {
        this.slug = new SlugGenerator().generate();
    }
}

module.exports = ChatRoom;
