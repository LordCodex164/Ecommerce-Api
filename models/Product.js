const mongoose = require('mongoose');

const singleCommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comment: {
        type: String,
        required: true
    }
},{timestamps: true});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dzv6v9kaf/image/upload/v1632197446/ecommerce/placeholder"
    },
    comments: {
        type: Array,
        default: [],
        comments: [singleCommentSchema]
    }
},{timestamps: true});

module.exports = mongoose.model('Product', productSchema);