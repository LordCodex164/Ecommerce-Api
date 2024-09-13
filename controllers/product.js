const Product = require('../models/Product');
const {badRequest}  = require('../errors');
const {StatusCodes} = require('http-status-codes');

const createProduct = async (req, res, next) => {
    const {title, description, price, quantity} = req.body;

    if(!title || !description || !price || !quantity) {
        throw new badRequest('All Product fields are required');
    }

    try {
        const product = await Product.create({...req.body, createdBy: req.user.id});
        res.status(StatusCodes.CREATED).json({product});
    } catch (error) {
        next(error);
    }
}

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({createdBy: req.user.id}).sort('createdAt');
        res.status(StatusCodes.OK).json({products});
    } catch (error) {
        next(error);
    }   
}

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({})
        res.status(StatusCodes.OK).json({products});
    } catch (error) {
        next(error);
    }   
}

const getProduct = async (req, res, next) => {
    const {id} = req.params;
    if(!id) {
        throw new badRequest('Please provide a valid product id');
    }
    try {
        const product = await Product.findById(id);
        if(!product) {
            throw new badRequest('Product not found');
        }
        res.status(StatusCodes.OK).json({product});
    } catch (error) {
        next(error);
    }   
}

const editProduct = async (req, res, next) => {
    const {id: userId} = req.user;
    const {id} = req.params;

    try {
     const product = await Product.findByIdAndUpdate({_id: id, createdBy: userId}, req.body, {
        new: true,
        runValidators: true
     })

      if(!product) {
            throw new badRequest('Product not found');
        }
        product.save();
        res.status(StatusCodes.OK).json({product});
    }
    catch(error){
        next(error)
    }   
}

const deleteProduct = async (req, res, next) => {
    const {id: userId} = req.user;
    const {id} = req.params;
    if(!id) {
        throw new badRequest('Please provide a valid product id');
    }
    try {
    const product = await Product.findByIdAndDelete({_id: id, createdBy: userId});
    if(!product) {
        throw new badRequest('Product not found');
    }
    res.status(StatusCodes.OK).json({msg: 'Product deleted successfully'});
    }
    catch(error){
        next(error)
    }
}

module.exports = {
    createProduct, 
    getProducts, 
    getAllProducts,
    getProduct,
    editProduct, 
    deleteProduct
};

