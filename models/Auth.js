const mongoose = require('mongoose');
const crypto = require("crypto-js");
const jwt = require('jsonwebtoken');
const {createJwtToken} = require('../utils');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters'],
        maxLength: [100, 'Password must be at most 12 characters']
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verificationToken: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordTokenExpirationDate: Date,
    passwordToken: {
        type: String
    }
});

userSchema.pre('save', async function() {
    console.log(this.isModified('password'));
    const hashedPassword = crypto.AES.encrypt(this.password, process.env.SECRET_KEY).toString();
    this.password = hashedPassword;
});

userSchema.methods.createJwtToken = function() {
    return createJwtToken(this._id, this.email);
}

userSchema.methods.matchPasswords = async function(password) {
   const decryptedPassword = crypto.AES.decrypt(this.password, process.env.SECRET_KEY).toString(crypto.enc.Utf8);
   return password === decryptedPassword;
}

const User = mongoose.model('User', userSchema);

module.exports = User;