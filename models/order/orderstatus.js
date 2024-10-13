const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
        status:{
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed'],
        default: 'pending'
        },
        order_Id: String,
        user_Id: String,
        updatedBy: {
            type: String,
        },
        remarks: String
}, {timestamps: true});

const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);

module.exports = OrderStatus;