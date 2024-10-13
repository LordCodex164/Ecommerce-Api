const mongoose = require("mongoose")

const TokenSchema = mongoose.Schema({
    ip: String,
    userAgent: String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    refreshToken: String,
    isValid: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Token', TokenSchema)