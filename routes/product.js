const express = require('express');
const router = express.Router();
const {getProducts, getAllProducts, getProduct, createProduct, deleteProduct, editProduct} = require('../controllers/product');
const {authorizePermissions} = require('../middlewares/isAuth');
const upload = require('../middlewares/multer');

router.route('/').get(getProducts);
router.route('/all').get(getAllProducts);
router.route('/:id').get(getProduct).patch(authorizePermissions("admin"), editProduct).delete(authorizePermissions("admin"), deleteProduct);
router.route('/create').post(authorizePermissions("admin"), createProduct);
router.post("/upload", upload.single('image'), (req, res) => {
    console.log(req.file);
    res.send("file uploaded")
})

module.exports = router;