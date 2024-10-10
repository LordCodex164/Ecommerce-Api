const express = require('express');
const router = express.Router();
const {getProducts, getAllProducts, getProduct, createProduct, deleteProduct, editProduct, uploadProductImage} = require('../controllers/product');
const {authorizePermissions} = require('../middlewares/isAuth');
const upload = require('../middlewares/multer');
const {validate_new_product} = require('../helpers/validators/product_validators');

// here we are defining the get routes for the product
router.route('/').get(getProducts);
router.route('/all').get(getAllProducts);
router.route('/:id').get(getProduct).patch(authorizePermissions("admin"), editProduct).delete(authorizePermissions("admin"), deleteProduct);

// here is the validate new product function imported from the validators 
router.route('/create').post(validate_new_product, authorizePermissions("admin"), createProduct);

// here we are defining the post route for uploading images
router.route("/upload/:id").post(authorizePermissions("admin"), upload.single('image'), uploadProductImage);

module.exports = router;
