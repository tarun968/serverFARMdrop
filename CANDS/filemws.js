const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// 
const User = new Schema({
    Phone: {
        type: String,
        required: true
    },
    Purchases:[],
    Email: {
        type: String,
        required: true,
        unique:true,
    },
    Password: {
        type: String,
        required: true,
        unique:true
    },
    Role: {
        type: Number,
        required: true
    },
    FDMarket: {
        type: String,
        required: true
    },
    Reference: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('User',User)