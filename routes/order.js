const express = require('express');
const {validate_update_order, validate_new_order} = require('../helpers/validators/order_validators');
const router = express.Router();

const {createOrder, getOrders, getOrder, updateOrder, deleteOrder} = require('../controllers/Order');

router.route('/create').post(validate_new_order, createOrder);
router.route('/').get(getOrders);
router.route("/update/:id").get(getOrder).put(validate_update_order, updateOrder).delete(deleteOrder);

module.exports = router;