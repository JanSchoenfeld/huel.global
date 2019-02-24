const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

//load json file with user arrays into users
const users = JSON.parse(fs.readFileSync('./users.json'));

router.get('/', (req, res) => {
    res.render('sign-in');
});

//checks if form passwort is equal to hash in users.json
router.post('/', (req, res) => {

    let user = users.find(function (element) {
        if (element.username === req.body.username) {
            console.log('user is ' + element.username);
            return element;
        }
    });

    if (user != undefined) {
        bcrypt.compare(req.body.password, user.hash, (err, isValid) => {
            if (isValid) {
                res.send('korrektes passwort, korrekter typ');
            } else {
                res.send('passwort nix korrekt');
            }
        })
    } else {
        console.log('user existiert nicht!');
        res.send('user existiert nicht!');
    }

})

module.exports = router;