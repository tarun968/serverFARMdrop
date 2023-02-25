const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    product:{
        type:ObjectId,
        ref:"Products"
    },
    name:String,
    count:Number,
    price:Number
})
const Orders = new Schema({
    products:[ProductSchema],
    transaction_id:{},
    address:{type:String},
    status:{
        type:String,
        default:"",
        enum:["Cancelled","Delivered","Shipped","Processing","Recieved"]
    },
    amount:{type:Number},
    address:String,
    user:{
        type:ObjectId,
        ref:"User"
    },

})
const Order =  mongoose.model("Orders", Orders)
const Cart = mongoose.model("ProductSchema", ProductSchema)
module.exports = {Order,Cart}