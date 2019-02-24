const uuidv4 = require('uuid/v4');

//class for creating user objects and persisting them
class User {
    
    constructor(username, hash) {
        this.id = uuidv4();
        this.createdAt = Date.now();
        this.username = username;
        this.hash = hash;
    }
}

module.exports = User;