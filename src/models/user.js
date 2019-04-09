const uuidv4 = require('uuid/v4');

//class for creating user objects and persisting them
class User {
    
    constructor(name, hash) {
        this.id = uuidv4();
        this.createdAt = Date.now();
        this.name = name;
        this.portfolio = [];
        this.hash = hash;
    }
}

module.exports = User;