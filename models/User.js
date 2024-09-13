const mongoose = require('mongoose');
const crypto = require("crypto-js");
const jwt = require('jsonwebtoken');

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
    }
});

userSchema.pre('save', async function() {
    const hashedPassword = crypto.AES.encrypt(this.password, process.env.SECRET_KEY).toString();
    this.password = hashedPassword;
});

userSchema.methods.createJwtToken = function() {
    return jwt.sign({id: this._id, email: this.email}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

userSchema.methods.matchPasswords = async function(password) {
   const decryptedPassword = crypto.AES.decrypt(this.password, process.env.SECRET_KEY).toString(crypto.enc.Utf8);
   return password === decryptedPassword;
}

const User = mongoose.model('User', userSchema);

module.exports = User;