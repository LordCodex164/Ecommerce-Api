const express = require('express');

const router = express.Router();

const {createOrder, getOrders} = require('../controllers/Order');

router.route('/create').post(createOrder);
router.route('/').get(getOrders);

module.exports = router;