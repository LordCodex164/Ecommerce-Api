const Order = require('../models/Order');
const Product = require('../models/Product');
const fakeStripeApi = require('../utils/fakeStripeApi');

const createOrder = async (req, res, next) => {   

    const {products: orderProducts, tax, shippingFee} = req.body;

    if(!orderProducts || orderProducts.length === 0) {
        return res.status(400).json({message: "Products are required"});
    }

    let subTotal = 0;
    let products = [];
    for(let product of orderProducts){
        if(!product.quantity) {
            return res.status(400).json({message: "Product Price and Quantity are required"});
        }
        const dbProduct = await Product.findOne({_id: product._id});
        console.log("dbProduct", dbProduct);

        if(!dbProduct) {
            return res.status(400).json({message: `Product not found`});
        }

        if(dbProduct.quantity < product.quantity) {
            return res.status(400).json({message: `Product quantity is not enough`});
        }
        products.push({
            product: dbProduct._id,
            quantity: product.quantity,
            price: dbProduct.price
    })
    subTotal += product.quantity * dbProduct.price;
}

  const total = subTotal + shippingFee + tax;

  const paymentIntent = await fakeStripeApi({
        amount: total,
        currency: 'usd',
  });

  const order = await Order.create({
      customer: req.user.id,
      products,
      shippingFee,
      tax,
      amount: total,
      paymentIntent: paymentIntent.clientSecret
  });

    try{
     res.status(202).send({order, message: "Order created successfully"});
    } 

    catch(error){
        next(error)
    }
} 

const getOrders = async (req, res, next) => {
    try {
    const orders = await Order.find({customer: req.user.id}).populate('products');
    res.status(200).json({orders});
    } catch (error) {
        next(error);
    }
}

const updateOrders = async (req, res, next) => {
    const {id} = req.params;
    const {status, tax, amount, paymentIntent} = req.body;

    try {
        const order = await Order.findOneAndUpdate({_id: id, customer: req.user.id}, {status, tax, amount, paymentIntent}, {new: true, runValidators: true});
        if(!order) {
            return res.status(400).json({message: "Order not found"});
        }
        res.status(200).json({order});
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createOrder,
    getOrders,
    
}