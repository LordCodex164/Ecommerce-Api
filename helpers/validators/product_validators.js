const {validator} = require("./index");


  const validate_new_product = (req, res, next) => {
        const rules = {
            title: 'required|string',
            price: 'required|numeric',
            description: 'required|string',
            quantity: 'required|numeric',
            image: 'string',
            category: 'required|string|in:electronics,books,clothing,other'
        }
        validator(req.body, rules, {}, (err, status) => {
            if (!status) {
                return res.status(400).json({
                    message: 'Validation failed',
                    err: err.errors[Object.keys(err.errors)[0]][0]
                });
            }
            else {
                let validationParams = getProductValidator(req.body.category);
                validator(req.body, validationParams, {}, (err, status) => {
                    if (!status) {
                        return res.status(400).json({
                            message: 'Validation failed',
                            err: err.errors[Object.keys(err.errors)[0]][0]
                        });
                    }
                    else {
                        req.body.validate_category_array = validationParams;
                        next();
                    }
                })
            };
        });
    }

const electronicsValidator = () => {
    const rules = {
        brand: 'required|string',
        model: 'required|string',
        color: 'required|string|in:red,blue,green,black,white',
        weight: 'required|string',
    }
    return rules
}

const booksValidator = () => {
    const rules = {
        author: 'required|string',
        publisher: 'required|string',
        publication_date: 'required|string',
    }
    return rules
}

const clothingValidator = () => {
    const rules = {
        brand: 'required|string',
        color: 'required|string',
        size: 'required|string',
        material: 'required|string',
    }
    return rules
}

const otherValidator = () => {
    const rules = {
        brand: 'required|string',
        color: 'required|string',
        weight: 'required|string',
        material: 'required|string',
    }
    return rules
}

const getProductValidator = (category) => {
   switch (category) {
         case 'electronics':
              return electronicsValidator();
         case 'books':
              return booksValidator();
         case 'clothing':
              return clothingValidator();
         case 'other':
              return otherValidator();
         default:
              return null;
    }
}

module.exports = {
    validate_new_product
}