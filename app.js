const express = require('express');
const app = express();
const products = require('./api/routes/products');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('./config/databse');
const orders = require('./api/routes/orders');
const path = require('path');
const user = require('./api/routes/user');
const authCheck = require('./api/auth/auth');
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads/')));
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEAD,OPTIONS');
        return res.status(200).json({});
    }
    next();
})

app.use('/products', authCheck, products);
app.use('/orders', authCheck, orders);
app.use('/users', user)

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 200;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;