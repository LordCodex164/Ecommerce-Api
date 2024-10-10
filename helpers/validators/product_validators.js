const {validator} = require("./index");


  const validate_new_product = (req, res, next) => {
        const rules = {
            title: 'required|string',
            price: 'required|numeric',
            description: 'required|string',
            quantity: 'required|string',
            image: 'string',
        }
        validator(req.body, rules, {}, (err, status) => {
            if (!status) {
                return res.status(400).json({
                    message: 'Validation failed',
                    err: err.errors[Object.keys(err.errors)[0]][0]
                });
            }
            return next();
        });
    }

module.exports = {
    validate_new_product
}