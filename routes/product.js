const express = require('express');
const router = express.Router();
const {getProducts, getAllProducts, getProduct, createProduct, deleteProduct, editProduct} = require('../controllers/product');
const {authorizePermissions} = require('../middlewares/isAuth');

router.route('/').get(getProducts);
router.route('/all').get(getAllProducts);
router.route('/:id').get(getProduct).patch(authorizePermissions("admin"), editProduct).delete(authorizePermissions("admin"), deleteProduct);
router.route('/create').post(authorizePermissions("admin"), createProduct);

module.exports = router;