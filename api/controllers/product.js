const productSchema = require('../models/product');
const mongoose = require('mongoose');
exports.get_all_products = (req, res, next) => {
    productSchema.find().select('name price _id productImage').exec().then(result => {
        let products = {};
        products.count = result.length;
        products.products = result.map(product => {
            return {
                url: `http://192.168.137.1:3001/products/${product._id}`,
                productId: product._id,
                productImage: product.productImage,
                name: product.name,
                price: product.price

            }
        })
        res.status(200).json(products);
    }).catch(error => {
        res.status(500).json(error)
    })
};

exports.get_product_byId = (req, res, next) => {
    let id = req.params.id;
    productSchema.findById(id).select('name price _id productImage').exec().then(result => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(404).json({
                message: "Not a valid Entry please try with correct id"
            })
        }
    }).catch(error => {
        res.status(404).json({
            message: "Not a valid Entry please try with correct id"
        })
    })
};

exports.post_product = (req, res, next) => {
    const product = new productSchema({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: 'uploads/' + req.file.filename
    });
    product.save().then(result => {
        res.status(200).json({
            url: `http://localhost:3001/products/${result._id}`,
            productId: result._id,
            name: result.name,
            price: result.price

        });
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
};

exports.update_product = (req, res, next) => {
    let id = req.params.id;
    let updateValues = {};
    for (const obj of req.body) {
        updateValues[obj.propName] = obj.propValue;
    }
    productSchema.update({
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

exports.delete_product = (req, res, next) => {
    let id = req.params.id;
    productSchema.remove({
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
}