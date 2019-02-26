const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MongoAPI = require('../models/mongo-api');

const router = express.Router();

//expiration time for cookies (ms * s * min * h) = 2 hours
const expTime = 1000 * 60 * 60 * 2;


router.get('/', (req, res) => {
    res.render('sign-in');
});

//checks if form passwort is equal to hash in users.json
router.post('/', async (req, res) => {

    const mongoUser = new MongoAPI(req.app.locals.db, 'users');
    const user = await mongoUser.findOne({
        'username': req.body.username
    });

    if (user != undefined) {
        bcrypt.compare(req.body.password, user.hash, (err, isValid) => {
            if (isValid) {
                res.cookie('jwt', createToken(user));
                res.locals.user = user;
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