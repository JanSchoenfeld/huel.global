const express = require('express');
const bcrypt = require('bcrypt');
const MongoAPI = require('../models/mongo-api');
const Token = require('../models/token');

const router = express.Router();

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
    let user = await mongoUser.findOne({
        'name': req.body.username.toLowerCase()
    }, {
        _id: 0,
        id: 1,
        name: 1,
        portfolio: 1,
        hash: 1
    });
    const deleted = await mongoUser.delete(user.id);
    console.log(deleted);
    user = null;
    if (user != null) { 
        bcrypt.compare(req.body.password, user.hash, (err, isValid) => {
            if (isValid) {
                const token = new Token();
                res.cookie('jwt', token.create(user));
                delete user.hash;
                res.locals.user = user;
                console.log('login success as ' + user.name + ', cookie created');
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



module.exports = router;