const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
});

const orderSchema = new mongoose.Schema({
     customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 0
    },
    tax:{
        type: Number,
        required: true,
    },
    amount:{
        type: Number,
        required: true // the total amount of the order
    },
    products: [orderItemSchema],
    paymentIntent: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Cart = mongoose.model('order', orderSchema);

module.exports = Cart;