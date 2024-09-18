const express = require('express');
const router = express.Router();
const {getCurrentUser} = require('../controllers/user');

router.route('/').get(getCurrentUser);