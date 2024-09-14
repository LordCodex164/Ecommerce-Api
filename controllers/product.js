const Product = require('../models/Product');
const {badRequest}  = require('../errors');
const {StatusCodes} = require('http-status-codes');

const createProduct = async (req, res, next) => {
    const {title, description, price, quantity} = req.body;

    if(!title || !description || !price || !quantity) {
       
        throw new badRequest('All Product fields are required');
    }
    console.log(!title)
    try {
        const product = await Product.create({...req.body, createdBy: req.user.id});
        res.status(StatusCodes.CREATED).json({product});
    } catch (error) {
        next(error);
    }
}

const getProducts = async (req, res, next) => {
    const {search, title, description, price, sort, filter} = req.query;
    const queryObject = {
        //by default
        createdBy: req.user.id
    };
    if(search) {
        queryObject.title = {$regex: search, $options: 'i'};
    }
    if(title) {
        queryObject.title = title;
    }
    if(description) {
        queryObject.description = description; 
    }
    if(sort){

    }

    const reGex = /\b(<|>|>=|=|<|<=)\b/g
    
    const operatorMap = {
        '>': '$gt',
        '<': '$lt',
        '>=': '$gte',
        '<=': '$lte',
        '=': '$eq'
    }
    
    console.log("sort", sort)

    if(filter){
        let filters = filter.replace(reGex, (match) => `-${operatorMap[match]}-`);
        const options = ['price', 'quantity'];
        filters = filters.split(",").forEach((item) => {
            console.log(`item`, item)
            const [field, operator, value] = item.split('-');
            if(options.includes(field)){
                queryObject[field] = {[operator] : Number(value)}
             }
        })
    }
     let results = Product.find(queryObject);

    if(sort === 'a-z' ){
        results = results.sort("price");
    }
    if(sort === 'z-a' ){
        results = results.sort("-price");
    }

    if(sort === 'latest' ){
        results = results.sort("-createdAt");
    }

    if(sort === 'oldest' ){
        results = results.sort("createdAt");
    }

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const totalProducts = await Product.countDocuments(queryObject);

    console.log(totalProducts)


    try {
        const products = await results; 
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

