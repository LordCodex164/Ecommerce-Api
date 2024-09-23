const express = require('express');
const router = express.Router();
const {getProducts, getAllProducts, getProduct, createProduct, deleteProduct, editProduct, uploadProductImage} = require('../controllers/product');
const {authorizePermissions} = require('../middlewares/isAuth');
const upload = require('../middlewares/multer');

router.route('/').get(getProducts);
router.route('/all').get(getAllProducts);
router.route('/:id').get(getProduct).patch(authorizePermissions("admin"), editProduct).delete(authorizePermissions("admin"), deleteProduct);
router.route('/create').post(authorizePermissions("admin"), createProduct);
router.route("/upload/:id").post(authorizePermissions("admin"), upload.single('image'), uploadProductImage);

module.exports = router;