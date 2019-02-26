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
    res.render('sign-up', {
        error: {
            userTaken: req.query.err === 'ut'
        }
    });
});

router.post('/', async (req, res) => {

    const mongoUser = new MongoAPI(req.app.locals.db, 'users');
    const testIfUserExists = await mongoUser.findOne({
        "username": req.body.username
    });
    if (testIfUserExists) {
        res.redirect('/sign-up?err=ut');
    } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            const user = new User(req.body.username, hash);
            await mongoUser.create(user);
            //maybe exclude hash?
            const result = await mongoUser.findOne({
                "id": user.id
            });
            res.app.locals.user = result;
            res.cookie('jwt', createToken(user));
            res.redirect('/');
        });
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