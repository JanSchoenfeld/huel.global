const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MongoAPI = require('../models/mongo-api');

const router = express.Router();

//expiration time for cookies (ms * s * min * h) = 2 hours
const expTime = 1000 * 60 * 60 * 2;


router.get('/', (req, res) => {
    console.log('get /sign-in');
    if (req.app.locals.user != undefined) {
        console.log('user eingeloggt gehe zu /');
        res.redirect('/');
    } else {
        res.render('sign-in', {
            error: {
                invalidCredentials: req.query.err === 'ic',
                userNotFound: req.query.err === 'unf'
            }
        });
    }
});

//checks if form passwort is equal to hash in users.json
router.post('/', async (req, res) => {
    console.log('post /sign-in');
    const mongoUser = new MongoAPI(req.app.locals.db, 'users');
    const user = await mongoUser.findOne({
        'username': req.body.username
    });

    if (user != null) {
        bcrypt.compare(req.body.password, user.hash, (err, isValid) => {
            if (isValid) {
                res.cookie('jwt', createToken(user));
                res.locals.user = user;
                res.redirect('/');
            } else {
                console.log('pw wrong @sign-in');
                res.clearCookie('jwt');
                res.redirect('/sign-in?err=ic');
            }
        });
    } else {
        console.log('user not found @sign-in');
        res.clearCookie('jwt');
        res.redirect('/sign-in?err=unf');
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