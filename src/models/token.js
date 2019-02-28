const jwt = require('jsonwebtoken');

class Token {

    constructor() {
        this.iat = Date.now();
        this.exp = Date.now() + 1000 * 10; //* 60 * 2;
    }

    create(user) {
        const claimsSet = {
            id: user.id,
            name: user.username,
            iat: this.iat,
            exp: this.exp
        };
        return jwt.sign(claimsSet, 'secret', {
            algorithm: 'HS256'
        });
    }

}

module.exports = Token;