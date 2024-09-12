const mongoose = require('mongoose');
const brcrypt = require('bcryptjs');
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
        minLength: [6, 'Password must be at least 6 characters']
    }
});

userSchema.pre('save', async function(next) {
    const salt = await brcrypt.genSalt(10);
    await brcrypt.hash(this.password, salt)
    next();
});

userSchema.methods.createJwtToken = function() {
    return jwt.sign({id: this._id, email: this.email}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

userSchema.methods.matchPasswords = async function(password) {
    return await brcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;