const express = require('express');
const router = express.Router();
const {createComment} = require('../controllers/comment');

router.post('/create', createComment);

module.exports = router;