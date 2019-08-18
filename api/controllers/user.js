const userSchema = require('./../models/user');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/env.json');
const mongoose = require('mongoose');

exports.sign_up = (req, res, next) => {
    const bycryptPwd = bycrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new userSchema({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save().then(result => {
                console.log(result);
                res.status(200).json({
                    message: "User Created",
                    result: result
                });
            }).catch(error => {
                console.log(error);
                res.status(500).json({
                    error: error
                })
            });
        }
    });

};

exports.sign_in = (req, res, next) => {
    userSchema.find({
        email: req.body.email
    }).then(result => {
        if (result.length < 1) {
            return res.status(404).json({
                message: "Auth failed"
            });
        } else {
            bycrypt.compare(req.body.password, result[0].password, (error, status) => {
                if (error) {
                    return res.status(500).json(error)
                }
                if (status) {
                    const token = jwt.sign({
                        email: result[0].email,
                        _id: result[0]._id
                    }, config.env.jwt_Token, {
                            expiresIn: '1h'
                        });
                    res.status(200).json({
                        message: "Auth Successful",
                        token: token
                    })
                }
            })
        }
    }).catch(error => {
        error: error
    })
};

exports.delete_user = (req, res, next) => {

    userSchema.remove({
        _id: req.params.id
    }).exec().then(result => {
        res.status(200).json({
            message: "Deleted Successfully",
            result: result
        });
    }).catch(error => {
        res.status(500).json(error);
    })

};

exports.get_user = (req, res, next) => {
    userSchema.findById({
        _id: req.params.id
    }).select("_id email").exec().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(404).json({
            error: error
        })
    });
};
exports.get_all_users = (req, res, next) => {
    userSchema.find().select("_id email password").exec().then(result => {
        let users = {};
        users.length = result.length;
        users.users = result.map(user => {
            return {
                _id: user._id,
                email: user.email
            }
        })
        res.status(200).json(users)
    }).catch(error => {
        res.status(500).json(error)
    })
};