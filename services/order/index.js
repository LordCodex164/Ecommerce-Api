const Order = require('../../models/order/order');
const OrderStatus = require('../../models/order/orderstatus');
const Product = require('../../models/product/product');
const fakeStripeApi = require('../../utils/fakeStripeApi');

const createCustomerOrder = async (data, email) => {
    try{
    const {products: orderProducts, tax, shippingFee, userId} = data;

    if(!orderProducts || orderProducts.length === 0) {
        return res.status(400).json({message: "Products are required"});
    }

    let subTotal = 0;
    let products = [];
    for(let product of orderProducts){
        if(!product.quantity) {
            return {message: "Product Price and Quantity are required"};
        }
        const dbProduct = await Product.findOne({_id: product.id});
        
        if(!dbProduct) {
            throw new Error(`Product with id ${product.id} not found`);
        }

        if(dbProduct.quantity < product.quantity) {
            throw new Error(`Product quantity is not enough`);
        }
        products.push({
            product: dbProduct._id,
            quantity: product.quantity,
            price: dbProduct.price
    })
    subTotal += product.quantity * dbProduct.price;
}

  const total = subTotal + shippingFee + tax;

  const paymentIntent = await fakeStripeApi({
        amount: total,
        currency: 'usd'
  });

  const order = await Order.create({
      customer: userId,
      products,
      shippingFee,
      tax,
      amount: total,
      paymentIntent: paymentIntent.clientSecret
  });
    return order;
}
    catch(error){
        throw new Error(error);
    }
}

//get all orders that belongs to a customer
const getCustomerOrders = async (userId) => {
   
    try {
        const orders = await Order.aggregate([
            {
                $addFields: {
                    _id: {$toString: "$_id"},
                    user_id: {$toString: "$customer"}
                }
            },
            {
                $match: {
                    customer: userId,
                    isDeleted: false
                }
            },
            //do a lookup from the order status and get the recent status
            {
                $lookup: {
                    from: "orderstatuses",
                    let: {order_Id: "$_id"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$order_Id", "$$order_Id"]
                                }
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $limit: 1
                        }, 
                        {
                            $project: {
                                _id: 0,
                                status: 1,
                                remarks: 1,
                                updatedBy: 1,
                                createdAt: 1
                            }
                        }
                    ],
                    as: "recent_status_details"
                },
                //get the first element of the recent status
            },
            {
                $addFields: {
                    recent_status_details: {$arrayElemAt: ["$recent_status_details", 0]}
                }
            }
        ]);

        return orders;
    } catch (error) {
        throw new Error(error);
    }
}

//get a order that belongs to a customer
const getCustomerOrder = async (orderId, userId) => {
    try {
        const order = await Order.findOne({_id: orderId, customer: userId}).populate('products');
        return order;
    } catch (error) {
        throw new Error(error);
    }
}

//update customer order
const updateCustomerOrder = async (orderId, data, email) => {
  
    try {
        const order_status_to_update = {
            status: data["status"],
            order_Id: orderId,
            updatedBy: email,
            remarks: data["remarks"]
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, order_status_to_update, {new: true});
        if(!updatedOrder){
            throw new Error("Order not found");
        }

        let userId
        
        //get the user id of the order
        const order = await Order.aggregate([
            {
              $addFields: {
                _id: {$toString: "$_id"},
                user_id: {$toString: "$customer"}
              } 
            },
            {
                $match: {
                    _id: orderId
                }
            },
        ])

          userId = order[0].user_id;

        //create order status
         await OrderStatus.create({...order_status_to_update, user_Id: userId});
        return updatedOrder;
    } catch (error) {
        throw new Error(error);
    }
}

//soft delete customer order

const deleteCustomerOrder = async (orderId, userId) => {
    try {
        const order = await Order.findOne({_id: orderId, customer: userId});
        if(!order){
            throw new Error("Order not found");
        }
        const deletedOrder = await Order.findByIdAndUpdate(id, {$set: {isDeleted: true}}, {new: true});
        return deletedOrder;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    createCustomerOrder,
    updateCustomerOrder,
    getCustomerOrders,
    getCustomerOrder,
    deleteCustomerOrder
}