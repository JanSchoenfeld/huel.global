const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('privacy-policy') ;
});

module.exports = router;