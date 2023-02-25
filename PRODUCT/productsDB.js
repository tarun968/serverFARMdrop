const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Products = new Schema({
    NameofProduct: {
        type: String,
        required: true
    },
    ProductID: {
        type: String,
        unique:true,
        required: true,
    },
    Rating: {
        type: Number,
    },
    AddedBy:{
        type:String,
        required:true
    },
    Date: {
        type: Date,
        required: true
    },
    Feedbacks: [{
        GivenBy: String,
        FeedbackDesc: String,
        DateofFB: Date,
        Stars:{
            type:Number,
            min:1,
            max:5
        }
    }],
    Price:{
        required:true,
        type:Number
    },
    ImageProduct:{
        data:Buffer,
        contentType:String
    },
    Quantity:{
        type:Number,
        min:0,
    }
})

module.exports = mongoose.model("Products", Products)