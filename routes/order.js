const express = require('express');

const router = express.Router();

const {createOrder, getOrders, getOrder, updateOrder, deleteOrder} = require('../controllers/Order');

router.route('/create').post(createOrder);
router.route('/').get(getOrders);
router.route("/:id").get(getOrder).put(updateOrder).delete(deleteOrder);

module.exports = router;