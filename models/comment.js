const mongoose = require('mongoose');

const commentItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

const commentSchema = new mongoose.Schema({
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    comment: [commentItemSchema]
}, {timestamps: true});

commentSchema.statics.calculateTotalComments = async function(productId){
     const stats = await this.aggregate([
        {
            $match: {product: productId}
        },
        {
          $unwind: "$comment"
        },
        {
            $group: {
                _id: null,
                allComments: {$push: "$comment"}
            }
        },
     ])
   if(stats.length > 0){
     try{
      await this.model('Product').findByIdAndUpdate(productId, {
        comments: stats[0]?.allComments
      }, {new: true});
     }
     catch(error){
         console.log(error);
     }
    }
}

commentSchema.post('save', function(){
    this.constructor.calculateTotalComments(this.product);
});

commentSchema.post('remove', function(){
    this.constructor.calculateTotalComments(this.product);
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;