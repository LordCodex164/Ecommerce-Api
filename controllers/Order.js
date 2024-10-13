const Order = require('../models/order/order');
const {createCustomerOrder, updateCustomerOrder, getCustomerOrder, getCustomerOrders, deleteCustomerOrder} = require("../services/order")

const createOrder = async (req, res, next) => {   
    const data = req.body;
    try{
     const newOrder = await createCustomerOrder(data, req.user["email"]);
     res.status(202).send({newOrder, message: "Order created successfully"});
    } 
    catch(error){
        next(error)
    }
} 

const getOrders = async (req, res, next) => {
    try {
    const orders = await getCustomerOrders(req.user.id);
    res.status(200).json({orders});
    } catch (error) { 
        next(error);
    }
}

const getOrder = async (req, res, next) => {
    const {id} = req.params;
    try {
        const order = await getCustomerOrder(id, req.user.id);
        res.status(200).json({order});
    }
    catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    
    const orderId = req.params.id;

    const data = req.body;
    
    try {
       const result = await updateCustomerOrder(orderId, data, req.user["email"]);

       res.status(200).json({result, message: "Order updated successfully"});
    } catch (error) {
        next(error);
    }
}

const deleteOrder = async (req, res, next) => {
    const orderId = req.params.id;
    try {
         const result = await deleteCustomerOrder(orderId, req.user["email"]);
        res.status(200).json({result, message: "Order deleted successfully"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
}