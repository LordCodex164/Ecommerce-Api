const mongoose = require('mongoose');

const singleCommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    title:{
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
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['electronics', 'books', 'clothing', 'other']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dzv6v9kaf/image/upload/v1632197446/ecommerce/placeholder"
    },
    brand: String,
    model: String,
    color: String,
    weight: String,
    author: String,
    publisher: String,
    publication_date: Date,
    size: String,
    material: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    comments: [singleCommentSchema]
},{timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

// productSchema.virtual('comments', {
//     ref: 'Comment',
//     localField: '_id',
//     foreignField: 'product',
//     justOne: false
// });

module.exports = mongoose.model('Product', productSchema);