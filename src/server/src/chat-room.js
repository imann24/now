const _ = require('lodash');
const SlugGenerator = require('./slug-generator');

class ChatRoom {
    constructor() {
        this.slug = new SlugGenerator().generate();
        this.members = [];
    }

    addMember(memberId) {
        this.members.push(memberId);
    }

    removeMember(memberId) {
        _remove(this.members, (id) => (id == memberId));
    }

    memberCount() {
        return this.members.length;
    }
}

module.exports = ChatRoom;
