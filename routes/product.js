const express = require('express');
const router = express.Router();
const {getProducts, getAllProducts, getProduct, createProduct, deleteProduct, editProduct} = require('../controllers/product');

router.route('/').get(getProducts);
router.route('/all').get(getAllProducts);
router.route('/:id').get(getProduct).patch(editProduct).delete(deleteProduct);
router.route('/create').post(createProduct);

module.exports = router;