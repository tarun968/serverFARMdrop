const ProductModel = require('./productsDB')
// 
exports.Feedback = async (req, res, next) => {
    console.log("in the feedback function")
    ProductModel.findOneAndUpdate({ _id: req.productfound._id },
        {
            $push: {
                Feedbacks: {
                    GivenBy: req.profile.Email,
                    FeedbackDesc: req.body.Feedback,
                    DateofFB: new Date(),
                    Stars: req.body.Star
                }
            }
        }).exec((err, products) => {
            if (err || !products) {
                return res.status(400).json({
                    message: 'Not done'
                })
            }
            // console.log("product after the feedback", products)
        })
    next()
}

exports.getProductbyId = (req, res, next, id) => {
    ProductModel.findOne({ _id: id }).exec((error, product) => {
        if (error || !product) {
            return res.status(400).json({
                errormessage: 'no such product was found'
            })
        }
        req.productfound = product;
        next()
    })
}
exports.getPhoto = async(req,res) =>{
    console.log("product image")
    if(req.productfound.ImageProduct.data){
        res.set('Content-Type',req.productfound.ImageProduct.contentType)
        return res.send(req.productfound.ImageProduct.data)
    }   
    next();
}

exports.RatingCalc =  async (req, res) => {
    console.log('in the feedback', req.productfound)
    var total_stars = 0;
    req.productfound.Feedbacks.forEach(element => {
        total_stars = total_stars + element.Stars
    });
    total_stars = total_stars / req.productfound.Feedbacks.length
    ProductModel.findOneAndUpdate({ _id: req.productfound._id }, {
        $set: { Rating: total_stars }
    }).exec((err, product) => {
        if (err || !product) {
            console.log('erorr in the feddbacs',err)
            return res.json({ message: 'Not done successfully' })
        }
        return res.status(200).json({
            message: 'Pushed successfully'
        })
    })
}
exports.productDelete = (req,res) => {
    const producttodelete = req.productfound;
    producttodelete.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error:'Failed to delete the product'
            })
        }
        return res.json({Message:"Deletion Successfull",
    deletedProduct})
    })
}