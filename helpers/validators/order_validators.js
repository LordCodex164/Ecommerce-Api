const {validator} = require("./index");


//validate the new order

const validate_new_order = (req, res, next) => {
    const rules = {
       userId: 'required|string',
       shippingFee: 'required|numeric',
       tax: 'required|numeric',
       products: 'required|array',
            'products.*.id': 'required|string',
            'products.*.quantity': 'required|numeric',
            'products.*.price': 'required|numeric',
    }
    validator(req.body, rules, {}, (err, status) => {
        if (!status) {
            return res.status(400).json({
                message: 'Validation failed',
                err: err.errors[Object.keys(err.errors)[0]][0]
            });
        }
        else {
            next();
        };
    });
}

// validate the update order

const validate_update_order = (req, res, next) => { 
    const rules = {
        status: 'required|string|in:pending,processing,completed,cancelled,refunded,failed',
        remarks: 'string',
        paymentIntent: 'string|required'
    }
    validator(req.body, rules, {}, (err, status) => {
        if (!status) {
            return res.status(400).json({
                message: 'Validation failed',
                err: err.errors[Object.keys(err.errors)[0]][0]
            });
        }
        else {
            next();
        };
    });
}

module.exports = {
    validate_update_order,
    validate_new_order
}