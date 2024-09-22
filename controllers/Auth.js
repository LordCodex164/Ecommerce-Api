const User = require('../models/Auth');
const BadRequest = require('../errors/badRequest');
const unAuthenticated = require('../errors/unAuthenticated');
const {StatusCodes} = require('http-status-codes');
const sendVerificationEmail = require('../utils/sendVerficationEmail');
const crypto = require("crypto");
const {LOGIN_TOKEN} = require("../helpers/mail_template_helper");
const { badRequest } = require('../errors');
const createToken = require('../helpers/createToken');
const sendOtpEmail = require('../utils/sendOtpMail');
const sendSuccessEmail = require('../utils/sendSuccessEmail');
const argon2 = require("argon2")
const { randomBytes } = require("crypto")

const salt = randomBytes(32);

const register = async (req, res, next) => {
    const {name, email, password, isAdmin} = req.body;
    if(!name || !email || !password) {
        throw new BadRequest('All fields are required');
    }
    
    try {
        const userExists = await User.findOne({email});
        console.log(userExists);
        if(userExists) {
            throw new BadRequest('Email already exists');
        }
        const otpToken = createToken();
        const hashedToken = await argon2.hash(otpToken, { salt });
        //const verificationToken = crypto.randomBytes(40).toString('hex');
        const user = await User.create({...req.body, role: isAdmin ? 'admin' : 'user', passwordToken: hashedToken, passwordTokenExpirationDate: new Date(new Date().getTime() + 10 * 60000) });
         await sendVerificationEmail({
            email: user.email,
            token: otpToken,
            origin: "localhost:8080",
            name: user.name
         })
        res.status(StatusCodes.CREATED).json({user, token: hashedToken, message: "Please check your email to verify your account"});
        
    } catch (error) {
        next(error)
    }
};

const verifyToken = async (otp, hasedToken, email) => {
    try{
       const user = await User.findOne({email})
       if(!user){
           throw new unAuthenticated("User not found")
       }
       if(Date.now() > user.toObject()["passwordTokenExpirationDate"]){
           throw new unAuthenticated("Token expired")
       }
       const isValid = await argon2.verify(user.toObject()["passwordToken"], otp.toString())
       console.log("isValid", isValid)
       console.log("passstoken", user.toObject()["passwordToken"])
       if(!isValid){
           throw new unAuthenticated("Invalid token")
       }
        return user.toObject()
    }
   catch(error){
    console.log("error", error)
   }
}

const verifyEmail = async (req, res, next) => {
    const {hashedToken, email, otpToken} = req.body;
    if(!hashedToken || !email || !otpToken){
        throw new badRequest("Please Provide your otp code")
    }
   try {
    const isUserRecord = await verifyToken(otpToken, hashedToken, email)
   if(!isUserRecord){
     throw new unAuthenticated("User Record not found")
   }
   const user = await User.updateOne({email}, {isVerified: true, passwordToken: "", last_login_date: new Date()}, {new: true})
   await sendSuccessEmail({
    email: isUserRecord.email,
    token: otpToken,
    name: isUserRecord.name
 })
   res.status(200).json({msg: "Email verified successfully"})
   } catch (error) {
      next(error)
   }  
}

const login = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new BadRequest('All fields are required');
    }

    try {
       const user = await User.findOne({email}); 
       if(!user) {
           throw new unAuthenticated('No user with that email');
       }
       const isPasswordCorrect = await user.matchPasswords(password);
       if(!isPasswordCorrect) {
           throw new unAuthenticated('Incorrect password');
       }
       const token = user.createJwtToken();
        res.status(200).json({user, token});
    }

    catch (error){
       next(error)
    }
}

const resendOtp = async(req, res, next) => {
    const {email} = req.body
    if(!email){
        throw new badRequest("Please provide email")
    }
    try {
      const user = await User.findOne({email})
      if(!user){
        throw new unAuthenticated("User not found")
      }
      const token = createToken()
      console.log("token", token)
      const hashedToken = await argon2.hash(token, { salt });

      await User.updateOne({email}, {isVerified: false, passwordToken: hashedToken, passwordTokenExpirationDate: new Date(new Date().getTime() + 10 * 60000)}, {new: true})
      await user.save()
      console.log("user", user)
      await sendOtpEmail({
        email: user.email,
        token,
        origin: "localhost:8080",
        name: user.name
     })
      res.status(200).json({msg: "token sent successfully", hashedToken})
    } catch (error) {
      next(error)
    }
}

const forgotPassword = async(req, res, next) => {

}

module.exports = {
    register, 
    login,
    verifyEmail,
    resendOtp,
    verifyToken
}