const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const News = new Schema({
    Headline: {
        type: String,
        required: true
    },
    Adder: {
        type: String,
        required: true,
    },
    News: {
        type: String,
        required: true
    },
    DateNews: {
        type: Date,
        required: true
    },
    Comments: [{
        commentedby: String,
        commentdesc: String,
        Dateofcomment: Date,
    }],
    ImageNews: {
        data: Buffer,
        contentType: String,
    }
    ,
    Likes: {
        type: Number
    }
})

module.exports = mongoose.model("New", News)