const express = require('express');
const fetch = require('node-fetch');

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

module.exports = router;