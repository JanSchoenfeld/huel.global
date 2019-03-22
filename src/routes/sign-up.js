const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const MongoAPI = require('../models/mongo-api');
const Token = require('../models/token');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('get /sign-up');
    if (req.app.locals.user != undefined) {
        res.redirect('/');
    } else {
        res.render('sign-up', {
            error: {
                userTaken: req.query.err === 'ut'
            }
        });
    }
});

router.post('/', async (req, res) =>  {
    console.log('post /sign-up');
    const mongoUser = new MongoAPI(req.app.locals.db, 'users');
    const testIfUserExists = await mongoUser.findOne({
        "username": req.body.username
    });
    if (testIfUserExists) {
        console.log('/sign-up?err=ut');
        res.redirect('/sign-up?err=ut');
    } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            const user = new User(req.body.username, hash);
            const token = new Token();
            await mongoUser.create(user);
            const result = await mongoUser.findOne({
                "id": user.id
            }, {
                hash: 0,
                _id: 0
            });
            res .locals.user = result;
            console.log('registration success as ' + user.username + ', cookie created');
            res.cookie('jwt', token.create(user));
            res.redirect('/');
        });
    }
});

module.exports = router;