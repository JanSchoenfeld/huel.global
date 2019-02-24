const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

const users = JSON.parse(fs.readFileSync('./users.json'));

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
        res.send(JSON.stringify(user, null, 2));
    })
})

module.exports = router;