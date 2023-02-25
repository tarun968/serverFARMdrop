const { NewsComment } = require('../INFO/func');
var { Order } = require('./ordersdb')
const Razorpay = require('razorpay')
const crypto = require('crypto')
var userModel = require('../CANDS/filemws')
// 
const ProductModel = require('../PRODUCT/productsDB')
exports.updateStatus = (req, res) => {
    console.log("Here we come and welcome,fjelferl", req.body, req.body.status)
    Order.updateOne(
        { _id: req.body.orderId },
        { $set: { status: req.body.status.status } },
        (err, order) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    error: "Cannot update order status"
                });
            }
            console.log("It was successful")
            res.json(order);
        }
    );
};
exports.getStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};
exports.getAllOrderstoAdmin = (req,res) => {
    Order.find({}).exec((err, order) => {
        if (err) {
            return res.status(400).json({ error: 'Orders Not found' })
        }
        return res.json(order)
    })
}

exports.getAorder = (req,res) => {
    console.log("get a rder",req.profile._id)
    console.log("get a rder",req.order._id)
    Order.findOne({User:req.profile._id,_id:req.order._id}).exec((err, order) => {
        if (err) {
            return res.status(400).json({ error: 'Orders Not found' })
        }
        return res.json(order)
    })
}