const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const notFound = require('./errors/not-found');
require("express-async-errors")
const auth = require("./routes/auth")
const errorMiddleware = require('./middlewares/error-handler');
const isAuth = require('./middlewares/isAuth');
const product = require('./routes/product');

app.get('/', (req, res) => {
    res.send('Hello World')
});
app.use(express.json());
app.use('/api/v1/auth', auth);
app.use('/api/v1/products', isAuth, product);
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