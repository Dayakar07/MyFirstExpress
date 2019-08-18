const orderSchema = require('../models/order');
const productSchema = require('../models/product');
const mongoose = require('mongoose');

exports.get_all_orders = (req, res, next) => {
    orderSchema.find().select('quantity product _id').populate('product', 'name price').exec().then(result => {
        let orders = {};
        orders.length = result.length;
        orders.orders = result.map((order) => {
            return {
                orderId: order._id,
                product: order.product,
                url: `http://localhost:3001/orders/${order._id}`,
                productUrl: `http://localhost:3001/products/${order.product._id}`,
                quantity: order.quantity
            }
        })
        res.status(200).json(orders)
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
};

exports.get_order_byId = (req, res, next) => {
    orderSchema.findById(req.params.id).select('quantity product _id').populate('product', 'name price').exec().then(result => {
        res.status(200).json({
            orderId: result._id,
            product: result.product,
            productUrl: `http://localhost:3001/products/${result.product._id}`,
            quantity: result.quantity
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
};

exports.post_order = (req, res, next) => {

    productSchema.findById(req.body.productId).exec().then(product => {
        if (!product) {
            return res.status(404).json({
                message: "Product does not exists"
            });
        }
        const order = new orderSchema({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
        return order.save();
    }).then(result => {
        res.status(200).json({
            message: "Order created successfully",
            createdOrder: {
                orderId: result._id,
                url: `http://localhost:3001/orders/${result._id}`,
                ordersUrl: `http://localhost:3001/products/${result.product._id}`,
                quantity: result.quantity
            }
        });
    }).catch(error => {
        res.status(404).json({
            message: "Product does not exists",
            error: error
        });
    });
};

exports.update_order = (req, res, next) => {
    let id = req.params.id;
    let updateValues = {};
    for (const obj of req.body) {
        updateValues[obj.propName] = obj.propValue;
    }
    orderSchema.update({
        _id: id
    }, {
            $set: updateValues
        }).exec().then(result => {
            res.status(200).json({
                success: true,
                message: "Updated product successfully"
            })
        }).catch(error => {
            res.status(500).json({
                error: error
            })
        });
};

exports.delete_order = (req, res, next) => {
    let id = req.params.id;
    orderSchema.remove({
        _id: id
    }).exec().then(result => {
        res.status(200).json({
            success: true,
            message: "Deleted product successfully"
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
};