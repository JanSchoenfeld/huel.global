const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

//router object for /users
router.get('/', (req, res) => {
    res.send('Welcome on /users!');
});


module.exports = router;