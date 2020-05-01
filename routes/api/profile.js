const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
    res.send("PRofile routes")
})


module.exports = router;