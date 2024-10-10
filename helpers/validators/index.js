const Validator = require("validatorjs");

const validator = (data, rules, customMessages, callback) => {
    const validation = new Validator(data, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
} 


module.exports = {
    validator
}