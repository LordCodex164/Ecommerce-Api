const Product = require('../models/Product');
const {badRequest}  = require('../errors');
const {StatusCodes} = require('http-status-codes');
const cloudinary = require("../utils/cloudinary");
const errorMiddleware = require('../middlewares/error-handler');

const createProduct = async (req, res, next) => {

    try {
        const product = await Product.create({...req.body, createdBy: req.user.id});
        //checkAdminPermissions(req.user); 
        res.status(StatusCodes.CREATED).json({product});

    } catch (error) {
        next(error);
    }
}

const uploadProductImage = async (req, res, next) => {
    if(!req.file){
      throw new badRequest('No file uploaded');
    }
    if(!req.file.mimetype.startsWith('image')){
        throw new badRequest('Please upload an image file');
    }
    const maxSize = 1024 * 1024;
    if (req.file.size > maxSize) {
        throw new CustomError.BadRequestError('Please upload image smaller 1MB');
    }
    try{
      cloudinary.uploader.upload(req.file.path, async (error, result) => {
        if(error) {
          throw new badRequest('Error uploading image');
        }
        console.log(req.file.path);
        const product = await Product.findByIdAndUpdate(id, {image: result.secure_url}, {new: true});
        res.status(StatusCodes.OK).json({product});
      })
      
    }
    catch(error){
        next(error)
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

    if(filter){
        let filters = filter.replace(reGex, (match) => `-${operatorMap[match]}-`);
        const options = ['price', 'quantity'];
        filters = filters.split(",").forEach((item) => {
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

    const skip = (page - 1) * limit;

    //pagination

    results = results.skip(skip).limit(limit);
    
    const totalProducts = await Product.countDocuments(queryObject);

    const numOfPage = Math.ceil(totalProducts/ limit);

    try {
        const products = await results; 
        res.status(StatusCodes.OK).json({products, totalProducts, numOfPage});
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
    uploadProductImage, 
    getProducts, 
    getAllProducts,
    getProduct,
    editProduct, 
    deleteProduct
};