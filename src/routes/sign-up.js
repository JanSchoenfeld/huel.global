const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const MongoAPI = require('../models/mongo-api');

const router = express.Router();

//cookie expiration time
const expTime = 1000 * 60 * 60 * 2;

router.get('/', (req, res) => {
    res.render('sign-up');
});

router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        let user = new User(req.body.username, hash);

        const mongoUser = new MongoAPI(req.app.locals.db, 'users');
        mongoUser.create(user);
        const filter = {"id": user.id};
        res.cookie('jwt', createToken(user));
        //maybe use a promise?
        res.send(mongoUser.findOne(filter));
    });
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