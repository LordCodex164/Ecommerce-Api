const Product = require('../models/Product');
const {badRequest}  = require('../errors');

const createProduct = async (req, res, next) => {
    const {name, description, price, quantity} = req.body;

    if(!name || !description || !price || !quantity) {
        throw new badRequest('All fields are required');
    }

    try {
        const product = await Product.create({name, description, price});
        res.status(StatusCodes.CREATED).json({product});
    } catch (error) {
        next(error);
        res.status(400).json({error: error.message});
    }
}

const getAllProducts = async (req, res) => {
    console.log(req.user);
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({products});
}

module.exports = {createProduct, getAllProducts};

