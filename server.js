const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const notFound = require('./errors/not-found');
require("express-async-errors")
const auth = require("./routes/auth")
const product = require('./routes/product');
const order = require('./routes/order');
const User = require('./routes/user');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit")
const xss = require('xss-clean');
const {isAuth} = require('./middlewares/isAuth');
const errorMiddleware = require('./middlewares/error-handler');
app.use(express.json());
app.use(cors());
app.use(helmet());
//app.use(xss());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes"
})
app.use(limiter);
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the E-commerce API</h1> <a href="https://documenter.getpostman.com/view/21411890/2sAXqng5D3">API Documentation</h2>');
});
app.use('/api/v1/auth', auth);
app.use('/api/v1/products', isAuth, product);
app.use('/api/v1/orders', isAuth, order);
app.use('/api/v1/users', isAuth, User);
app.use(notFound);
app.use(errorMiddleware);

const start = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        if(connection) {
            app.listen(3000, () => {
                console.log('Server is running on port 3000');
            });
        }
    } catch (error) {
       throw new Error('Error connecting to database');
    }
}

start();