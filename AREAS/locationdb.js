const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Locations = new Schema({
    NameofShop: {
        type: String,
        required: true
    },
    OwnerName:{
        type:String,
        required:true
    },
    Country:{
        type:String,
        required:true    
    },
    City:{    
        type:String,
        required:true
    },
    State:{
        type:String,
        required:true
    },
    ShopID: {
        type: String,
        unique:true,
        required: true,
    },
    Rating: {
        type: Number,
        // required: true
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
    EmailShop:{
        type:String,
        unique:true,
        required:true
    }
    ,
    Address:{
        type:String,
        required:true
    },
    ImagesShop:[
        {
            data:Buffer,
        contentType:String,
        }
    ]
})
// 
module.exports = mongoose.model("Locations", Locations)