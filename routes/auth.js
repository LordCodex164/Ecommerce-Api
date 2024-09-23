const express = require('express');
const router = express.Router();
const {register, login, verifyEmail, resendOtp} = require('../controllers/Auth');

router.post('/login', login);
router.post('/register', register);
router.post("/verify_email", verifyEmail);
router.post("/resend_otp", resendOtp)


module.exports = router;