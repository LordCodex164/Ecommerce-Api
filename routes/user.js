const express = require('express');
const router = express.Router();
const {getCurrentUser, updateUser} = require('../controllers/user');

router.route('/').get(getCurrentUser);
router.route('/:id').patch(updateUser);

module.exports = router;