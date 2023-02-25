const ShopModel = require('./locationdb')
const formidable = require('formidable')
const fs = require('fs')
// const bodyParser = require('body-parser')
const { resolveSrv } = require('dns')
// 
exports.getShopbyID = (req, res, next, id) => {
    console.log("id", id)
    ShopModel.findOne({ _id: id }).exec((error, shop) => {
        console.log(shop)
        if (error || !shop) {
            return res.status(400).json({
                error: 'No shop was found'
            })
        }
        req.shop = shop;
        next()
    })
}

exports.getShopOwnerById = (req, res, next, id) => {
    console.log("lets get the shop owner by email")
    // console.log('ID', id)
    // console.log('reqqUEST',req)
    ShopModel.findById(id).exec((err, user) => {
        if (err || !user) {
            console.log("error is here 1", err)
            return res.status(400).json({
                error: "No user found in Db"
            })
        }
        // console.log('user', user)
        // console.log("hui hii")
        req.profile = user;
        next()
    })
}

exports.getAllshopBycountry = async (req, res) => {


    const AllShopsByCountry = await ShopModel.find().sort();

    return res.json({ message: AllShopsByCountry })
}

exports.SubmitLocation = (req, res) => {
    console.log("form ")
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
        // }
        // fields {
        //   NameofLocations: 'Tarun Sinha',
        //   NameofOwner: 'Tarun Sinha',
        //   Country: 'Surat',
        //   City: 'Surat',
        //   State: 'Gujarat',
        //   Address: 'J-5 Rajlaxmi Society',
        //   ShopID: 'SHOP981_ER712'
        // }
        // console.log("biody",req.body)
        // console.log("files", file)
        // console.log("fields", fields)
        // console.log(fields)
        let shop = ShopModel(fields)
        // console.log('nO1', file[0])
        // console.log('nO2', file[1])
        // console.log('nO3',file[2])        
        shop.AddedBy = req.profile.Email
        shop.Date = new Date()
        // var ImagesShop = []
        for (x in file) {
            // console.log("file path", file[x].type)
            // console.log("file path", file[x].filepath,)
            if (x.photo) {
                if (file[x].size > 8300000) {
                    return res.status(400).json({
                        error: 'Problem in the image and its size'
                    })
                }
            }
            shop.ImagesShop.push({
                data: fs.readFileSync(file[x].filepath),
                contentType: file[x].type
            })
        }
        // console.log("images shop", ImagesShop)
        shop.save((errors, prod) => {
            if (errors) {
                console.log('error', errors)
                return res.json({
                    error: 'Problem in the fields'
                })
            }
            res.json(prod)
        })
    })
}

exports.SubmitLocationsImage = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    // console.log("req", req.params.location)
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: 'Problem in the image'
            })
        }
        // console.log("files", file)
        // console.log(fields)
        if (file.photo) {
            if (file.ImagesShop.size > 8300000) {
                return res.status(400).json({
                    error: 'Problem in the image and its size'
                })
            }
        }
        ShopModel.updateOne({ _id: req.params.location },
            {
                $push: {
                    "ImagesShop": {
                        data: fs.readFileSync(file.ImagesShop.filepath),
                        contentType: file.ImagesShop.type
                    }
                }
            }).exec((err, upgrade) => {
                if (err) {
                    return res.json({
                        error: 'Problem in the fields'
                    })
                }
                return res.json({ message: 'done successfullly' })
            })
    })
}
exports.getPhotoofImage = async (req, res, next) => {
    // console.log("image",req.params.image)
    const imagesarray = await ShopModel.find({
        _id: req.params.shopowner
    },
        {
            ImagesShop: {
                "$elemMatch": {
                    _id: req.params.image
                }
            }
        })
    // console.log("--",(req.imagesLocations.ImagesShop[0].data))
    // console.log("images array",(imagesarray[0].ImagesShop[0].data).toString('utf-8'))
    // console.log("images array",imagesarray[0].ImagesShop[0].data)
    if (imagesarray) {
        res.set('Content-Type', imagesarray[0].ImagesShop[0].contentType)
        res.send(imagesarray[0].ImagesShop[0].data)
    }
    next();
}

exports.getImageOne = (req, res, next, id) => {
    console.log('id of image', id)
    ShopModel.findOne({ _id: req.params.shopowner }).exec((err, founded) => {
        if (err) {
            return res.json({ error: 'No user found ' })
        }
        req.imagesLocations = founded
        next();
    })
}
exports.getAllImages = async (req, res) => {
    const x = await ShopModel.findOne({ _id: req.auth._id })
    if (!x) {
        return res.json({ error: 'Error in the database' })
    }
    return res.json({
        message: x.ImagesShop
    })
}