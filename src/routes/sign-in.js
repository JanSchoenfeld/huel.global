const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

//load json file with user arrays into users
const users = JSON.parse(fs.readFileSync('./users.json'));
//expiration time for cookies (ms * s * min * h) = 2 hours
const expTime = 1000 * 20 * 60 * 2;


router.get('/', (req, res) => {
    res.render('sign-in');
});

//checks if form passwort is equal to hash in users.json
router.post('/', (req, res) => {

    let user = users.find(function (element) {
        if (element.username === req.body.username) {
            return element;
        }
    });

    if (user != undefined) {
        bcrypt.compare(req.body.password, user.hash, (err, isValid) => {
            if (isValid) {
                res.cookie('jwt', createToken(user))
                res.send('korrektes passwort, korrekter typ');
            } else {
                res.clearCookie('jwt');
                res.send('passwort nix korrekt');
            }
        });
    } else {
        res.clearCookie('jwt');
        res.send('user existiert nicht!');
    }

});

function createToken(user) {
    const claimsSet = {
        id: user.id,
        name: user.username,
        iat: Date.now(),
        exp: Date.now() + expTime
    };
    return jwt.sign(claimsSet, 'secret', {
        algorithm: 'HS256'
    });
}

module.exports = router;