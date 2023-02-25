const newsModel = require('./filedbs')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
// 
exports.getNewsbyId = (req, res, next, id) => {
    console.log("lets get the new by id")
    newsModel.findOne({ _id: id }).exec((err, news) => {
        if (err || !news) {
            console.log("9999")
            return res.status(400).json({
                error: "No News with such ID found in Db"
            })
        }
        req.news_item = news;
        next()
    })
}

exports.AddingNews = async (req, res) => {
    try {
        const record_new = await new newsModel({
            Headline: req.body.Heading,
            Adder: req.profile.Email,
            News: req.body.Desc,
            Date: new Date(),
            Comments: [],
            Likes: 0,
        })
        await record_new.save();
        return res.json({ record_new });
    } catch (err) {
        console.log('error', err)
    }
}
exports.NewsComment = async (req, res) => {
    try {

        let form = new formidable.IncomingForm()
    form.keepExtensions = true
    console.log("pro",req.profile.Email)
    form.parse(req, (err, fields, file) => {
        console.log("____",fields)
        var comnts = {
            commentedby: req.profile.Email,
            commentdesc: fields.commentdesc,
            Dateofcomment: new Date()
        }
        newsModel.findOneAndUpdate(
            { _id: req.params.news },
            { $push: { Comments: comnts } },
            { new: true },
            (err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: "Unable to save purchase list"
                    });
                }
                res.json({ Message: "Updated successfully" })
            })    
    })
        console.log(req.body, req.params)
            } catch (e) {
        console.log("", e)
    }
}



exports.SubmitFormNews = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, file) => {
        if (err) {
            console.log("error")
            console.log(err)
            return res.status(400).json({
                error: 'Problem in the image'
            })
        }
        let News = newsModel(fields)
        console.log('fields are')
        console.log('fields are', fields)
        console.log(file)
        if (file.photo) {
            if (file.photo.size > 8300000) {
                return res.status(400).json({
                    Message: 'Problem in the image and its size'
                })
            }
        }
        console.log('here', file.ImageNews.type)
        News.Adder = req.profile.Email
        News.DateNews = new Date()
        // console.log(product)
        News.ImageNews.data = fs.readFileSync(file.ImageNews.filepath)
        News.ImageNews.contentType = file.ImageNews.type
        console.log(file.ImageNews.type)
        News.save((errors, prod) => {
            if (errors) {
                console.log('error', errors)
                return res.json({
                    Message: 'Problem in the fields'
                })
            }
            res.json(prod)
        })
    })
}


exports.getAllnews = async (req, res) => {
    const AllNews = await newsModel.find({})
    // console.log("All",AllNews)
    if (!AllNews) {
        return res.status(400).json({ error: 'no one found' })
    }
    return res.status(200).json({ message: AllNews })
}

exports.getNewstoFront = async (req, res) => {
    // console.log(req.body.ID)
    const News = await newsModel.find({ _id: req.params.news }).exec()
    if (!News) {
        return res.json({ Error: "Sorry" })
    }
    return res.json({ Message: News })
}


exports.getPhotoNews = async (req, res) => {
    console.log("news item")
    if (req.news_item.ImageNews.data) {
        res.set('Content-Type', req.news_item.ImageNews.contentType)
        return res.send(req.news_item.ImageNews.data)
    }
    next();
}