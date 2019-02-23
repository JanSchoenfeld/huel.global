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

//posts form data and hashes password (should be sign-up, actually)
router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        let user = new User(req.body.username, hash);
        users.push(user);
        fs.writeFileSync('./users.json', JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        })
        res.send(JSON.stringify(users, null, 2));
    })
})

//checks if form passwort is equal to hash in users.json
// router.post('/', (req, res) => {
//     bcrypt.compare(req.body.password, user.hash, (err, isValid) => {
//         if(isValid){
//             res.send('korrektes passwort, korrekter typ');
//         }else{
//             res.send('passwort nix korrekt');
//         }
//     })
// })

module.exports = router;