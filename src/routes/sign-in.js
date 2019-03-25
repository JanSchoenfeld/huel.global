const express = require('express');
const bcrypt = require('bcrypt');
const MongoAPI = require('../models/mongo-api');
const Token = require('../models/token');

const router = express.Router();

router.get('/', (req, res) => {
    if (req.app.locals.user != undefined) {
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
    const mongoUser = new MongoAPI(req.app.locals.db, 'users');
    const user = await mongoUser.findOne({
        'username': req.body.username.toLowerCase()
    }, {
        _id: 0
    });
    if (user != null) {
        bcrypt.compare(req.body.password, user.hash, (err, isValid) => {
            if (isValid) {
                const token = new Token();
                res.cookie('jwt', token.create(user));
                delete user.hash;
                res.app.locals.user = user;
                res.redirect('/');
            } else {
                res.clearCookie('jwt');
                res.redirect('/sign-in?err=ic');
            }
        });
    } else {
        res.clearCookie('jwt');
        res.redirect('/sign-in?err=unf');
    }

});



module.exports = router;