const { NewsComment } = require('../INFO/func');
var { Order } = require('./ordersdb')
const Razorpay = require('razorpay')
const crypto = require('crypto')
// 
var userModel = require('../CANDS/filemws')
const ProductModel = require('../PRODUCT/productsDB')
exports.getOrderById = (req, res, next, id) => {
    console.log("order id ",id)
    Order.findById(id)
        .exec((err, order) => {
            console.log('order',order)
            if (err) {
            console.log("err",err)
                return res.status(400).json({ message: 'Nothing was found' })
            }
            req.order = order;
            next();
        })
}
exports.userPurchaseList = (req, res) => {
    console.log('user with the purchase', req.profile)
    Order.find({ user: req.profile._id })
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({ error: 'NO ORDER IN THIS ACCOUNT' })
            }
            return res.json(order)
        })
}

exports.createOrder = (req, res) => {

    console.log("entering the createorder",req.profile)
    req.body.order.user = req.profile
    const order = new Order()
    req.body.order.forEach(element => {
        console.log("element fof the order",element)
        order.products.push({
        _id:element._id,
        name:element.NameofProduct,
        count:element.Count,
        price:element.Price
        })
    });
    order.amount = req.body.amount
    order.user = req.profile._id
    order.status = "Processing"
    order.save((err, order) => {
        if (err || !order) {
            console.log("error", err)
            return res.status(400).json({ error: 'Error in the user order' })
        }
        else {
            console.log("hui ", order)
            return res.status(200).json(order);
        }
    })
}


exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    console.log("entrered here")
    console.log(req.body)
    console.log("entering the push order in purchase list",req.body)
    req.body.order.forEach(element => {
        console.log("element", element)
        purchases.push({
            _id: element._id,
            NameofProduct: element.NameofProduct,
            ProductID: element.ProductID,
            Quantity: element.Quantity,
            // transaction_id:element.transaction_id,
            Price: element.Price
        })
    })
    console.log("purchaes", purchases)
    userModel.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { Purchases: purchases } },
        { new: true },
        (err, user) => {
            console.log("user after puirchase", user)
            if (err || !user) {
                return res.status(400).json({
                    error: "Error in the finding of the user"
                })
            }
            else {
                next();
            }
        }
    )
}

exports.updateStock = (req, res, next) => {
    console.log("entering the push order in updating stock",req.body)
    let myOps = req.body.order.map(prod => {
        console.log("prod", prod)
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { Quantity: -prod.Count } }
            }
        }
    })
    ProductModel.bulkWrite(myOps, {}, (err, prods) => {
        if (err) {
            return res.status(400).json({ error: 'Bulk ops failed' })
        }
        else {
            next()
        }
    })
}



exports.updateOrder = (req, res) => {
    Order.findByIdAndUpdate({
        _id: req.body.OrderID
    },
        {
            $set: {
                status: req.body.status
            }
        }, (err, order) => {
            if (err) {
                return res.status(400).json({ error: 'Can not update order' })
            }
            res.json(order)
        })
}
exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues)
}


exports.orderinit = async (req, res
    // ,next
    ) => {
    try {
        // console.log("req",req.body.order)
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });
        // console.log("amount", typeof(req.body.amount))
        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                // console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            // console.log("payment done sucessfully", order)
            req.payment = order
            res.status(200).json({ data: order });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

exports.orderverify  =async (req, res
    ) => {
    try {
        console.log('req payment',req.payment)
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;
        // console.log("razor pay",req.payment)
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            console.log("",razorpay_signature)
            return res.status(200).json({ message: "Payment verified successfully" });
            // next();/
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}