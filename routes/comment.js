const express = require('express');
const router = express.Router();
const {createComment, getUserComments, getProductComments} = require('../controllers/comment');
const {authorizePermissions} = require('../middlewares/isAuth');

router.post('/create', authorizePermissions("user"), createComment);
router.get('/', getUserComments);
router.get('/:id', getProductComments);

module.exports = router;