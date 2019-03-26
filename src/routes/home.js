const express = require('express');
const fetch = require('node-fetch');
const MongoAPI = require('../models/mongo-api');

const router = express.Router();
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

router.get('/', async (req, res) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-CMC_PRO_API_KEY': '6529d989-ac88-401e-88ad-343c34478107'
        }
    });
    const json = await response.json();
    res.render('home', {
        coins: json.data
    });
});

router.post('/', async (req, res) => {
    let updatedUser = req.app.locals.user;
    if (!updatedUser.portfolio.length) {
        updatedUser.portfolio = [];
    }
    updatedUser.portfolio.push(req.body);
    const mongoUser = new MongoAPI(req.app.locals.db, 'users');
    const result = await mongoUser.update(updatedUser);
    if (result) {
        res.locals.user = updatedUser;
        res.redirect('/');
    } else {
        res.send("DBerror");
    }
});

module.exports = router;