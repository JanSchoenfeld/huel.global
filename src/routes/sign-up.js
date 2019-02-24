const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const users = JSON.parse(fs.readFileSync('./users.json'));

//cookie expiration time
const expTime = 1000 * 60 * 60 * 2;

router.get('/', (req, res) => {
    res.render('sign-up');
})

router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        let user = new User(req.body.username, hash);
        users.push(user);
        fs.writeFileSync('./users.json', JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        })
        res.cookie('jwt', createToken(user), {
            expires: new Date(Date.now() + expTime)
        });
        console.log(JSON.stringify(res, null, 2));
        res.send(JSON.stringify(user, null, 2));
    })
})

function createToken(user) {
    const claimsSet = {
        id: user.id,
        name: user.username,
        iat: Date.now(),
    };
    return jwt.sign(claimsSet, 'secret', {
        algorithm: 'HS256'
    });
}

module.exports = router;