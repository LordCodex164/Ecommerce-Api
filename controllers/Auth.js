const User = require('../models/Auth');
const BadRequest = require('../errors/badRequest');
const unAuthenticated = require('../errors/unAuthenticated');
const {StatusCodes} = require('http-status-codes');
const sendVerificationEmail = require('../utils/sendVerficationEmail');
const crypto = require("crypto");
const sendPostEmail = require("../services/mailer");
const sendPostMarkEmail = require('../services/mailer');
const {LOGIN_TOKEN} = require("../helpers/mail_template_helper");
const { badRequest } = require('../errors');
const createToken = require('../helpers/createToken');
const sendOtpEmail = require('../utils/sendOtpMail');
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
        const verificationToken = crypto.randomBytes(40).toString('hex');
        const user = await User.create({...req.body, role: isAdmin ? 'admin' : 'user', verificationToken});
        console.log(user);
        const token = user.createJwtToken();
        const email_data = {
            ...{verificationToken},
            email,
            ...user.toObject()
        }
         await sendVerificationEmail({
            email: user.email,
            token: verificationToken,
            origin: "localhost:8080",
            name: user.name
         })
        res.status(StatusCodes.CREATED).json({user, token, message: "Please check your email to verify your account"});
        
    } catch (error) {
        next(error)
    }
};

const verifyEmail = async (req, res, next) => {
    console.log("req.body", req.body)
    const {verificationToken, email} = req.body;
    if(!verificationToken) {
        throw new BadRequest('Invalid Token');
    }
   try {
    let user = await User.findOne({email})
    console.log("User", user)
   if(!user){
     throw new unAuthenticated("Validation failed")
   }
   if(user.verificationToken !== verificationToken){
     throw new unAuthenticated("Validation Error: Incorrect token")
   }

   (user.verfied = Date.now()), (user.isVerified = true)
   user.verificationToken = ""

   await user.save()
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

module.exports = {
    register, 
    login,
    verifyEmail,
    resendOtp
}