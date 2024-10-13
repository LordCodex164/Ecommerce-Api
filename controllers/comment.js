const Comment = require('../models/comment/comment');
const {badRequest}  = require('../errors');
const {StatusCodes} = require('http-status-codes');
const {checkUserPermissions} = require('../utils/checkUserPermissions');

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
        const newComment = await Comment.create({comment: comArr, user: userId, product: productId}).populate('user');
        res.status(201).json({newComment});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getUserComments = async (req, res) => {
    const {id: userId} = req.user;
    try {
        const comments = await Comment.find({user: userId});
        if(!comments){
            throw new badRequest('No comments found');
        }
        
        res.status(200).json({comments});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getProductComments = async (req, res) => {
    const {id: productId} = req.params;
    try {
        const comments = await Comment.find({product: productId}).populate('user', "email");
        if(!comments){
            throw new badRequest('No comments found');
        }
        res.status(200).json({comments});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createComment,
    getUserComments,
    getProductComments
}