const Comment = require('../models/comment');
const {badRequest}  = require('../errors');
const {StatusCodes} = require('http-status-codes');

const createComment = async (req, res) => {
    const {comments, productId} = req.body;
    if(!comments || !productId) {
        throw new badRequest('please provide a valid product id and comments');
    }
    const userId = req.user.id;
    let comArr = []
    for(let i=0; i < comments.length; i++){
        comArr.push({name: comments[i].name, title: comments[i].title})
    }
    try {
        const newComment = await Comment.create({comment: comArr, user: userId, product: productId});
        res.status(201).json({newComment});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createComment
}