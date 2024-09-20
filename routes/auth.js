const express = require('express');
const router = express.Router();
const {register, login, verifyEmail} = require('../controllers/Auth');

router.post('/login', login);
router.post('/register', register);
router.post("/verify_email", verifyEmail);

module.exports = router;