const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('sign-up');
})

router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {

        let user = new User(req.body.username, hash);
        console.log(JSON.stringify(user, null, 2));

        fs.writeFile('./users.json', user, (err, data) =>{
            console.log(data.toString('utf8'));
            res.send(JSON.stringify(user, null, 2));
        })
    })
})

module.exports = router;