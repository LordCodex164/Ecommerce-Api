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
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordTokenExpirationDate: Date,
    passwordToken: {
        type: String
    },
    last_login_date: {
        type: Date
    },
    profilePicture: {
        type: String
    }
});

userSchema.pre('save', async function(next) {
    console.log(this.isModified('password'));
    if(!this.isModified("password")) return next();
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