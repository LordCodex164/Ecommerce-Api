const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
})

router.post("/create", (req, res) => {
    res.send("Product created");
})

module.exports = router;