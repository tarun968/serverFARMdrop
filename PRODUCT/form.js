const ProductModel = require('./productsDB')
const formidable = require('formidable')
const _ = require('lodash')
// 
const fs = require('fs')
exports.UpdateForm = (req, res) => {
    console.log("update products")
    console.log(req.body)
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
        let product = req.productfound
        product = _.extend(product, fields)
        console.log(file)
        if (file.photo) {
            if (file.photo.size > 8300000) {
                return res.status(400).json({
                    error: 'Problem in the image and its size'
                })
            }
        }
        product.ImageProduct.data = fs.readFileSync(file.ImageProduct.filepath)
        product.ImageProduct.contentType = file.ImageProduct.type
        product.save((errors, prod) => {
            if (errors) {
                console.log('error', errors)
                return res.json({
                    error: 'Problem in the Updating'
                })
            }
            res.json(prod)
        })
    })
}



exports.SubmitForm = (req, res) => {
    console.log("form in the index")
    console.log(req.body)
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    console.log("form ")
    form.parse(req, (err, fields, file) => {
        if (err) {
            console.log("error")
            console.log(err)
            return res.status(400).json({
                error: 'Problem in the image'
            })
        }
        let product = ProductModel(fields)
        console.log('fields are', product)
        console.log('fields are', fields)
        console.log(file)
        if (file.photo) {
            if (file.photo.size > 8300000) {
                return res.status(400).json({
                    Message: 'Problem in the image and its size'
                })
            }
        }
        console.log('here', file.ImageProduct.type)
        product.AddedBy = req.profile.Email
        product.Date = new Date()
        console.log(product)
        product.ImageProduct.data = fs.readFileSync(file.ImageProduct.filepath)
        product.ImageProduct.contentType = file.ImageProduct.type
        console.log(file.ImageProduct.type)
        product.save((errors, prod) => {
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
